// GET /api/handoff/load?userEmail=&ticket=&version=
// Load a design handoff manifest via the MCP (load_handoff, pocket 1).
// `version` optional: a semver string for a specific version, or "list" for the
// version index. Omit for the latest (head).

import { getPool, resolveUserId, resolveUserOrgId } from '@/lib/db';
import { openSession, callTool, closeSession } from '@/lib/mcp-client';

export const maxDuration = 60;

export async function GET(request) {
  const url = new URL(request.url);
  const userEmail = url.searchParams.get('userEmail');
  const ticket = url.searchParams.get('ticket');
  const version = url.searchParams.get('version') || undefined;
  if (!userEmail) return Response.json({ error: 'userEmail required' }, { status: 400 });
  if (!ticket) return Response.json({ error: 'ticket required' }, { status: 400 });

  const mcpUrl = process.env.MCP_SERVER_URL?.trim();
  const mcpToken = process.env.MCP_SERVICE_TOKEN?.replace(/[^\x20-\x7E]/g, '').trim();
  if (!mcpUrl || !mcpToken) return Response.json({ error: 'MCP server not configured' }, { status: 500 });

  const client = getPool();
  const userId = await resolveUserId(client, userEmail);
  if (!userId) return Response.json({ error: 'no such user' }, { status: 404 });
  const orgId = await resolveUserOrgId(client, userId);

  let session;
  try {
    session = await openSession({ url: mcpUrl, token: mcpToken, actingUserEmail: userEmail, orgId });
    const res = await callTool(session, 'load_handoff', { ticket, pocket: 1, version });
    if (res.isError) return Response.json({ error: res.text || 'load_handoff failed' }, { status: 404 });

    let payload;
    try { payload = JSON.parse(res.text); }
    catch { return Response.json({ error: 'handoff payload was not valid JSON', raw: res.text }, { status: 502 }); }

    // version=list → the version index; otherwise the manifest.
    return Response.json(version === 'list' ? { ticket, versions: payload } : { ticket, manifest: payload });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  } finally {
    if (session) { try { await closeSession(session); } catch { /* ignore */ } }
  }
}
