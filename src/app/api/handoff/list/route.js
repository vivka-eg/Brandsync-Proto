// GET /api/handoff/list?userEmail=
// List the design handoffs the user can see: their FILES (patterns) that have a
// handoff ticket, with the head manifest's name/status/version pulled from the
// MCP. Returns rows shaped for HandoffDialog.

import { getPool, resolveUserId, resolveUserOrgId } from '@/lib/db';
import { openSession, callTool, closeSession } from '@/lib/mcp-client';

export const maxDuration = 60;

const MAX_HANDOFFS = 50;

export async function GET(request) {
  const url = new URL(request.url);
  const userEmail = url.searchParams.get('userEmail');
  if (!userEmail) return Response.json({ error: 'userEmail required' }, { status: 400 });

  const client = getPool();
  const userId = await resolveUserId(client, userEmail);
  if (!userId) return Response.json({ error: 'no such user' }, { status: 404 });
  const orgId = await resolveUserOrgId(client, userId);

  // Files (patterns) that have a handoff ticket. MAKE-* tickets are ours.
  let patterns = [];
  try {
    const r = await client.query(
      `SELECT id, slug, ticket
         FROM corpus_entries
        WHERE ticket IS NOT NULL AND ticket LIKE 'MAKE-%'
          AND (user_id = $1 OR user_id IS NULL)
        ORDER BY updated_at DESC NULLS LAST
        LIMIT $2`,
      [userId, MAX_HANDOFFS],
    );
    patterns = r.rows;
  } catch {
    return Response.json({ handoffs: [] });
  }
  if (!patterns.length) return Response.json({ handoffs: [] });

  const mcpUrl = process.env.MCP_SERVER_URL?.trim();
  const mcpToken = process.env.MCP_SERVICE_TOKEN?.replace(/[^\x20-\x7E]/g, '').trim();
  if (!mcpUrl || !mcpToken) return Response.json({ error: 'MCP server not configured' }, { status: 500 });

  let session;
  const handoffs = [];
  try {
    session = await openSession({ url: mcpUrl, token: mcpToken, actingUserEmail: userEmail, orgId });
    for (const p of patterns) {
      try {
        const res = await callTool(session, 'load_handoff', { ticket: p.ticket, pocket: 1 });
        if (res.isError) continue;
        const m = JSON.parse(res.text);
        const head = m.head ?? {};
        handoffs.push({
          ticket: p.ticket,
          title: head.name || p.slug,
          status: head.status || 'ready_for_dev',
          version: m.version || null,
          lastEditedBy: head.createdBy || null,
          lastEditedAt: head.createdAt || null,
          patternId: p.id,
        });
      } catch { /* skip a ticket whose manifest can't be read */ }
    }
    return Response.json({ handoffs });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  } finally {
    if (session) { try { await closeSession(session); } catch { /* ignore */ } }
  }
}
