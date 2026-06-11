// Brandsync MCP client.
//
// The Brandsync MCP server (Brandsync-hosted-MCP repo) speaks the
// Streamable HTTP transport of MCP — POST init, server returns a
// session id in the `mcp-session-id` response header, every subsequent
// call must echo that header back. Responses are SSE-framed even when
// they fit in one chunk, so we parse `data: ...` lines.
//
// Why this lives in our route rather than going through Anthropic's
// native `mcp_servers` parameter: that parameter requires Anthropic to
// dial the MCP from their infra, which (a) doesn't work for localhost
// during dev, and (b) failed against our prod ALB because the load
// balancer's sticky-session cookies weren't being honored between
// Anthropic's init and follow-up calls. Proxying through our route
// makes us infrastructure-agnostic.

const PROTOCOL_VERSION = '2025-06-18';

// Hard deadline per MCP HTTP call. Without it a hung MCP connection waits for
// the OS socket timeout (minutes), which showed up as `read ETIMEDOUT` and
// multi-minute stuck generations. On timeout the call throws and the route
// degrades gracefully (a failed tool becomes a tool_result error; a failed
// session open falls back to no-tools mode).
const MCP_TIMEOUT_MS = 60_000;

// Tools we expose to Claude during Make generations. The MCP server
// has many more (write_corpus_entry, save_handoff, graph traversal,
// etc.) but for UI generation we only want read-side discovery —
// search, components, patterns, tokens. Limiting the surface keeps
// (a) the input-tokens cost low (each declared tool eats prompt) and
// (b) prevents Claude from accidentally writing to the corpus.
export const ALLOWED_TOOLS = new Set([
  'list_components',
  'get_component',
  'get_pattern',
  'search_guidelines',
  'get_tokens',
]);

function buildHeaders(token, sessionId, opts = {}) {
  const h = {
    'authorization': `Bearer ${token}`,
    'content-type': 'application/json',
    'accept': 'application/json, text/event-stream',
  };
  if (sessionId) h['mcp-session-id'] = sessionId;
  // Act on behalf of the end user and scope reads to their selected org.
  // The MCP (a trusted relationship via the service token) honors these.
  if (opts.actingUserEmail) h['x-acting-user-email'] = opts.actingUserEmail;
  if (opts.orgId) h['x-org-id'] = opts.orgId;
  return h;
}

// SSE responses look like:
//   event: message
//   data: {"jsonrpc":"2.0",...}
//
// They MAY contain multiple data lines for a single logical message
// (multi-line payloads — though MCP doesn't currently use this).
// We accept either a single-line or multi-line payload by joining all
// `data:` lines and parsing the result.
function parseSseBody(text) {
  const dataLines = text.split('\n')
    .filter((l) => l.startsWith('data:'))
    .map((l) => l.slice(5).trimStart());
  if (!dataLines.length) {
    throw new Error('MCP response had no data lines');
  }
  return JSON.parse(dataLines.join('\n'));
}

async function rpc(session, body) {
  const res = await fetch(session.url, {
    method: 'POST',
    headers: buildHeaders(session.token, session.sessionId, session),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(MCP_TIMEOUT_MS),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`MCP ${res.status}: ${errText.slice(0, 300)}`);
  }
  // 202 Accepted for notifications has no body.
  if (res.status === 202) return null;
  const text = await res.text();
  return parseSseBody(text);
}

// Open a fresh MCP session. Returns a `session` handle to thread
// through callTool / listTools / closeSession. The session lifetime
// should match one generate request — we open at the start and
// (best-effort) close after the conversation ends.
export async function openSession({ url, token, actingUserEmail = null, orgId = null }) {
  if (!url || !token) throw new Error('mcp url + token required');

  const initRes = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(token, null, { actingUserEmail, orgId }),
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {},
        clientInfo: { name: 'brandsync-make', version: '0.1' },
      },
    }),
    signal: AbortSignal.timeout(MCP_TIMEOUT_MS),
  });
  if (!initRes.ok) {
    const errText = await initRes.text().catch(() => '');
    throw new Error(`MCP init ${initRes.status}: ${errText.slice(0, 300)}`);
  }
  // The session id is server-issued when the MCP runs stateful (the
  // production deployment behind an ALB does this) and absent when it
  // runs stateless (local dev). When absent we synthesize one so the
  // server's logging stays coherent — the server doesn't actually
  // require us to track it in that mode.
  const sessionId = initRes.headers.get('mcp-session-id')
    ?? `client-${crypto.randomUUID()}`;

  // The MCP spec requires this notification right after init. Server
  // returns 202 with no body. In stateless mode the server doesn't
  // strictly need it but sending it is harmless and keeps stateful
  // and stateless servers on the same code path.
  const session = { url, token, sessionId, actingUserEmail, orgId };
  await rpc(session, { jsonrpc: '2.0', method: 'notifications/initialized' });
  return session;
}

// List the MCP's tools, filtered to the read-side set we want to
// expose to Claude. Returned in Anthropic's `tools` schema directly
// so the route can pass them through.
export async function listAllowedTools(session) {
  const body = await rpc(session, {
    jsonrpc: '2.0',
    id: nextId(),
    method: 'tools/list',
  });
  const all = body?.result?.tools ?? [];
  return all
    .filter((t) => ALLOWED_TOOLS.has(t.name))
    .map((t) => ({
      name: t.name,
      description: t.description,
      input_schema: t.inputSchema,
    }));
}

// Call a single tool. The MCP returns `{ content: [{ type, text }] }`
// — we flatten the text contents into one string so the model gets
// the result inline as a tool_result.
export async function callTool(session, name, args) {
  const body = await rpc(session, {
    jsonrpc: '2.0',
    id: nextId(),
    method: 'tools/call',
    params: { name, arguments: args ?? {} },
  });
  if (body?.error) {
    throw new Error(`MCP ${name} error: ${body.error.message}`);
  }
  const content = body?.result?.content ?? [];
  // Most MCP tool results are a single text block. If multiple, join.
  const text = content
    .filter((c) => c?.type === 'text' && typeof c.text === 'string')
    .map((c) => c.text)
    .join('\n');
  return { text, isError: !!body?.result?.isError };
}

export async function closeSession(session) {
  if (!session?.sessionId) return;
  try {
    // MCP spec: DELETE with the session id terminates the session.
    await fetch(session.url, {
      method: 'DELETE',
      headers: buildHeaders(session.token, session.sessionId),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    // Best-effort. The server will GC stale sessions anyway.
  }
}

// Per-process monotonic id generator. RPC ids must be unique within a
// session; using a counter avoids the rare collision Date.now() can
// hit if two calls land in the same ms.
let _id = 1;
function nextId() { return ++_id; }
