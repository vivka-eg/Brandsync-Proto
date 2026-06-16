// POST /api/handoff/generate
// Generate a versioned JSON design handoff for a single Make FILE (pattern) and
// persist it via the MCP (save_handoff, pocket 1). Body: { userEmail, patternId,
// name?, ticketOverride?, bump? }. The manifest is authored by a Claude pass over
// that one pattern, then the referenced components/tokens are re-resolved via the
// MCP and embedded BY VALUE so a developer's agent can rebuild exactly what the
// PM made. Each file gets its own handoff + version line (keyed on the pattern).

import { getPool, resolveUserId, resolveUserOrgId } from '@/lib/db';
import { openSession, callTool, closeSession } from '@/lib/mcp-client';
import { callClaudeText, parseJsonLoose, DEFAULT_MODEL } from '@/lib/anthropic';
import { MANIFEST_SCHEMA_TEXT, buildManifest, validateManifest } from '@/lib/handoff-manifest';

export const maxDuration = 300;

const HANDOFF_DEADLINE_MS = 280_000;
const MAX_COMPONENT_RESOLVES = 30;
const PATTERN_CHAR_BUDGET = 18_000;
const MANIFEST_BODY_MAX_TOKENS = 8_000;

// Deterministic, stable per-FILE key so a file's manifest versions accrete under
// one ticket (derived from the corpus_entry id — survives even if the stored
// ticket column write is unavailable).
function deriveHandoffKey(entryId) {
  const hex = String(entryId).replace(/[^a-f0-9]/gi, '').slice(0, 10).toUpperCase();
  return `MAKE-${hex || '0000000000'}`;
}

// The handoff key for a file lives in corpus_entries.ticket (its intended use).
async function resolveHandoffTicket(client, entryId, existing, override) {
  const ticket = (override?.trim()?.toUpperCase()) || existing || deriveHandoffKey(entryId);
  if (ticket !== existing) {
    try {
      await client.query('UPDATE corpus_entries SET ticket = $1 WHERE id = $2', [ticket, entryId]);
    } catch { /* best-effort */ }
  }
  return ticket;
}

function summarizeBom(files) {
  const components = new Set();
  const patterns = new Set();
  for (const f of files) {
    const bom = f.bom && typeof f.bom === 'object' ? f.bom : null;
    (bom?.components ?? []).forEach((c) => c?.ref && components.add(c.ref));
    (bom?.patterns ?? []).forEach((p) => p && patterns.add(p));
  }
  const parts = [];
  if (components.size) parts.push(`components: ${[...components].join(', ')}`);
  if (patterns.size) parts.push(`patterns: ${[...patterns].join(', ')}`);
  return parts.length ? parts.join('\n') : '(none recorded)';
}

// Union of component refs from the model-authored body and the persisted BOM.
function collectComponentRefs(bodyObj, files) {
  const refs = new Map(); // lowercased -> original
  const add = (r) => { if (r && typeof r === 'string') refs.set(r.toLowerCase(), r); };
  for (const v of bodyObj?.views ?? []) {
    for (const c of v?.composition ?? []) add(c?.ref);
  }
  for (const f of files) {
    for (const c of (f.bom?.components ?? [])) add(c?.ref);
  }
  return [...refs.values()].slice(0, MAX_COMPONENT_RESOLVES);
}

function collectPatternRefs(files) {
  const refs = new Set();
  for (const f of files) for (const p of (f.bom?.patterns ?? [])) refs.add(p);
  return [...refs];
}

function parseToolText(text) {
  try { return parseJsonLoose(text); } catch { return { raw: text }; }
}

// Record the handoff's token spend in the shared reasoning/usage log. session_id
// carries the handoff ref `TICKET@VERSION` so the latest version is visible
// alongside the latest log row. Best-effort — never fail the handoff on logging.
async function logHandoffUsage({ userEmail, projectId, startedAt, usage, success, errorMessage, ticket, version }) {
  try {
    await getPool().query(
      `INSERT INTO tool_usage_logs
         (id, user_email, tool_name, duration_ms, success, error, session_id,
          input_tokens, output_tokens, cache_read_tokens, cache_creation_tokens, project_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        crypto.randomUUID(),
        userEmail ?? null,
        'brandsync_make.handoff',
        Date.now() - startedAt,
        success,
        errorMessage ?? null,
        ticket ? `${ticket}@${version ?? '?'}` : null,
        usage?.input_tokens ?? null,
        usage?.output_tokens ?? null,
        usage?.cache_read_input_tokens ?? null,
        usage?.cache_creation_input_tokens ?? null,
        projectId ?? null,
      ],
    );
  } catch (err) {
    console.error('[tool_usage_logs] handoff insert failed:', err.message);
  }
}

// Re-resolve the BOM against the live corpus and embed snapshots by value.
// Components/patterns resolve in parallel so a view-heavy handoff doesn't serialize
// dozens of MCP round-trips. Each failure is skipped, not fatal.
async function resolveCorpusByValue(session, componentRefs, patternRefs) {
  const resolvedAt = () => new Date().toISOString();

  const componentResults = await Promise.all(componentRefs.map(async (ref) => {
    try {
      const res = await callTool(session, 'get_component', { component: ref, include_html: true });
      if (res.isError) return null;
      return { ref, slug: ref, snapshot: parseToolText(res.text), resolvedAt: resolvedAt() };
    } catch { return null; }
  }));

  const patternResults = await Promise.all(patternRefs.map(async (ref) => {
    try {
      const res = await callTool(session, 'get_pattern', { name: ref });
      if (res.isError) return null;
      return { ref, slug: ref, snapshot: { markdown: res.text } };
    } catch { return null; }
  }));

  let tokens = { resolvedAt: resolvedAt(), values: {} };
  try {
    const res = await callTool(session, 'get_tokens', {});
    if (!res.isError) tokens = { resolvedAt: resolvedAt(), values: parseToolText(res.text) };
  } catch { /* tokens optional */ }

  return {
    components: componentResults.filter(Boolean),
    patterns: patternResults.filter(Boolean),
    tokens,
  };
}

// Core orchestration. Returns { status, body }. Emits SSE `phase` events via
// `emit` (a no-op in plain-JSON mode) so the UI can show live progress during
// the ~minute-long model-authoring pass instead of a dead spinner.
async function runHandoff(request, emit) {
  let body;
  try { body = await request.json(); } catch { return { status: 400, body: { error: 'invalid JSON body' } }; }
  const { userEmail, patternId, name, ticketOverride, bump } = body || {};
  if (!userEmail) return { status: 400, body: { error: 'userEmail required' } };
  if (!patternId) return { status: 400, body: { error: 'patternId required' } };

  const apiKey = process.env.CLAUDE_API_KEY?.trim();
  if (!apiKey) return { status: 500, body: { error: 'CLAUDE_API_KEY not configured on the server' } };
  const mcpUrl = process.env.MCP_SERVER_URL?.trim();
  const mcpToken = process.env.MCP_SERVICE_TOKEN?.replace(/[^\x20-\x7E]/g, '').trim();
  if (!mcpUrl || !mcpToken) return { status: 500, body: { error: 'MCP server not configured' } };

  const client = getPool();
  const userId = await resolveUserId(client, userEmail);
  if (!userId) return { status: 404, body: { error: 'no such user' } };

  // Load the single file (pattern) being handed off. Retry without `bom`/`ticket`
  // if those columns aren't applied yet.
  let file;
  try {
    const r = await client.query(
      `SELECT id, slug, content, user_id, org_id, bom, ticket FROM corpus_entries WHERE id = $1`,
      [patternId],
    );
    file = r.rows[0];
  } catch {
    const r = await client.query(
      `SELECT id, slug, content, user_id, org_id FROM corpus_entries WHERE id = $1`,
      [patternId],
    );
    file = r.rows[0] ? { ...r.rows[0], bom: null, ticket: null } : null;
  }
  if (!file) return { status: 404, body: { error: 'pattern not found' } };
  // A user can hand off a pattern they own (or a team pattern).
  if (file.user_id && file.user_id !== userId) {
    return { status: 403, body: { error: 'cannot hand off another user\'s pattern' } };
  }
  if (!file.content || !file.content.trim()) {
    return { status: 400, body: { error: 'pattern has no content to hand off' } };
  }

  const orgId = file.org_id || (await resolveUserOrgId(client, userId));
  const files = [file]; // BOM/ref helpers operate on an array
  const ticket = await resolveHandoffTicket(client, patternId, file.ticket, ticketOverride);
  const deadline = Date.now() + HANDOFF_DEADLINE_MS;
  const startedAt = Date.now();
  let modelUsage = null;

  let session;
  try {
    console.log(`[handoff] ${ticket}: opening MCP session (${mcpUrl})`);
    emit('phase', { phase: 'connecting', message: 'Connecting to BrandSync MCP…' });
    session = await openSession({ url: mcpUrl, token: mcpToken, actingUserEmail: userEmail, orgId });

    // 0 — Load the previous handoff (if any) so the authoring pass can decide
    //     the version bump by comparing what changed.
    let prevBody = null, prevVersion = null;
    try {
      const prevRes = await callTool(session, 'load_handoff', { ticket, pocket: 1 });
      if (!prevRes.isError) {
        const pm = JSON.parse(prevRes.text);
        prevBody = pm?.body ?? null;
        prevVersion = pm?.version ?? null;
      }
    } catch { /* no previous handoff — first version */ }

    // 1 — Author the manifest body from this file + BOM hint, and (vs the previous
    //     handoff) classify the change as major or minor.
    const fileName = name || file.slug;
    console.log(`[handoff] ${ticket}: authoring manifest for file ${file.slug}… (prev: ${prevVersion ?? 'none'})`);
    emit('phase', { phase: 'authoring', message: `Authoring manifest for ${file.slug}… (this is the slow step, ~1 min)` });
    const patternsBlock = `## ${file.slug}\n${(file.content ?? '').slice(0, PATTERN_CHAR_BUDGET)}`;
    const system =
      `You are a design lead authoring a developer handoff for a single UI screen built in BrandSync Make. ${MANIFEST_SCHEMA_TEXT}\n\n` +
      `Return a JSON object: { "changeLevel": "initial"|"minor"|"major", "changeSummary": "<one short line>", "body": <the body object described above> }. ` +
      `Decide changeLevel by comparing to the PREVIOUS handoff body (if given): "major" if any view/screen, feature, or flow was ADDED, REMOVED, or structurally restructured (a developer would rebuild substantially); "minor" for content, copy, token, variant, or layout tweaks; "initial" if there is no previous handoff. JSON only.`;
    const userMsg =
      `Screen: ${fileName}\n\n` +
      `Components/patterns already used (from generation):\n${summarizeBom(files)}\n\n` +
      (prevBody
        ? `PREVIOUS handoff body (v${prevVersion}) to compare against:\n${JSON.stringify(prevBody)}\n\n`
        : `There is no previous handoff for this file — this is the initial version.\n\n`) +
      `The screen's CURRENT markup (HTML/CSS):\n\n${patternsBlock}\n\n` +
      `Author the handoff now: classify the change vs the previous body, then emit { changeLevel, changeSummary, body }. JSON only.`;

    const { text, usage } = await callClaudeText({
      apiKey, model: DEFAULT_MODEL, system,
      messages: [{ role: 'user', content: userMsg }],
      maxTokens: MANIFEST_BODY_MAX_TOKENS, deadline,
    });
    modelUsage = usage;

    let parsed;
    try { parsed = parseJsonLoose(text); }
    catch (e) { return { status: 502, body: { error: 'model returned an invalid manifest', detail: e.message } }; }
    // Tolerate either the wrapper { changeLevel, changeSummary, body } or a bare body.
    const bodyObj = parsed?.body && typeof parsed.body === 'object' ? parsed.body : parsed;
    const changeLevel = ['initial', 'minor', 'major'].includes(parsed?.changeLevel) ? parsed.changeLevel : null;
    const changeSummary = typeof parsed?.changeSummary === 'string' ? parsed.changeSummary.trim() : null;

    // 2 — Capture-by-value: re-resolve referenced components/tokens/patterns.
    const componentRefs = collectComponentRefs(bodyObj, files);
    const patternRefs = collectPatternRefs(files);
    console.log(`[handoff] ${ticket}: resolving ${componentRefs.length} component(s) + ${patternRefs.length} pattern(s) by value…`);
    emit('phase', { phase: 'resolving', count: componentRefs.length, message: `Snapshotting ${componentRefs.length} component(s) by value…` });
    const corpus = await resolveCorpusByValue(session, componentRefs, patternRefs);

    // Decide the version bump. An explicit request `bump` overrides; otherwise it
    // is derived from the model's comparison to the previous handoff. First-ever
    // handoff → MCP assigns 1.0 regardless.
    const decidedBump = bump || (prevBody ? (changeLevel === 'major' ? 'major' : 'minor') : 'minor');

    // 3 — Assemble + validate. Version is provisional; the MCP assigns the real one.
    const head = {
      name: fileName,
      ticket,
      status: 'ready_for_dev',
      createdBy: userEmail,
      createdAt: new Date().toISOString(),
      patternId: file.id,
      patternSlug: file.slug,
      orgId,
      sourcePatternIds: [file.id],
      model: DEFAULT_MODEL,
      changeLevel: prevBody ? (changeLevel || 'minor') : 'initial',
      changeSummary: changeSummary || (prevBody ? null : 'Initial handoff.'),
    };
    const manifest = buildManifest({ version: '1.0', head, corpus, body: bodyObj });
    const check = validateManifest(manifest);
    if (!check.ok) return { status: 500, body: { error: 'assembled manifest failed validation', detail: check.errors } };

    // 4 — Persist via the MCP. The server computes the authoritative version.
    console.log(`[handoff] ${ticket}: saving manifest via save_handoff (bump=${decidedBump}, change=${head.changeLevel})…`);
    emit('phase', { phase: 'saving', message: 'Saving handoff…' });
    const saveRes = await callTool(session, 'save_handoff', {
      ticket, pocket: 1, data: { manifest, bump: decidedBump, created_by: userEmail },
    });
    if (saveRes.isError) return { status: 502, body: { error: 'save_handoff failed', detail: saveRes.text } };
    const version = (/version\s+(\d+\.\d+)/i.exec(saveRes.text) || [])[1] || manifest.version;

    await logHandoffUsage({ userEmail, projectId: null, startedAt, usage: modelUsage, success: true, ticket, version });

    return {
      status: 200,
      body: {
        ok: true,
        ticket,
        version,
        name: head.name,
        status: head.status,
        changeLevel: head.changeLevel,
        changeSummary: head.changeSummary,
        previousVersion: prevVersion,
        summary: {
          features: manifest.body.features.length,
          views: manifest.body.views.length,
          components: manifest.corpus.components.length,
          truncatedComponents: componentRefs.length >= MAX_COMPONENT_RESOLVES,
        },
      },
    };
  } catch (e) {
    // Tokens may already have been spent on the model pass — log the failure too.
    await logHandoffUsage({ userEmail, projectId: null, startedAt, usage: modelUsage, success: false, errorMessage: e.message, ticket });
    return { status: 500, body: { error: e.message } };
  } finally {
    if (session) { try { await closeSession(session); } catch { /* ignore */ } }
  }
}

export async function POST(request) {
  const wantsSSE = (request.headers.get('accept') || '').includes('text/event-stream');

  // Plain JSON mode (curl / programmatic).
  if (!wantsSSE) {
    const { status, body } = await runHandoff(request, () => {});
    return Response.json(body, { status });
  }

  // SSE mode (the UI): stream phase events, then a terminal complete/error.
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event, data) => {
        try { controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)); } catch { /* client gone */ }
      };
      controller.enqueue(encoder.encode(': stream-open\n\n'));
      try {
        emit('phase', { phase: 'starting', message: 'Preparing…' });
        const { status, body } = await runHandoff(request, emit);
        emit(status >= 200 && status < 300 ? 'complete' : 'error', body);
      } catch (err) {
        console.error('[/api/handoff/generate stream] uncaught:', err);
        emit('error', { error: err?.message ?? 'handoff failed' });
      } finally {
        try { controller.close(); } catch { /* ignore */ }
      }
    },
  });
  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      'x-accel-buffering': 'no',
    },
  });
}
