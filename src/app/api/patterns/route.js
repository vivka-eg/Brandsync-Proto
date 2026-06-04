import { getPool, resolveUserId, resolveUserOrgId, userIsOrgAdmin } from '@/lib/db';

// GET /api/patterns?userEmail=&orgId=&scope=approved|pending
//   scope=approved (default): the org's team-approved patterns — team rows
//     (user_id NULL) plus admin-approved drafts. This is the Explore set.
//   scope=pending: drafts awaiting approval (admin-only).
// Lightweight: returns metadata + creator; content is lazy-fetched per card
// via /api/patterns/:id so this list payload stays small.
export async function GET(request) {
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
  }
  const url = new URL(request.url);
  const userEmail = url.searchParams.get('userEmail');
  const scope = url.searchParams.get('scope') === 'pending' ? 'pending' : 'approved';
  if (!userEmail) return Response.json({ error: 'userEmail required' }, { status: 400 });

  const client = getPool();
  try {
    const userId = await resolveUserId(client, userEmail);
    if (!userId) return Response.json({ patterns: [] });
    const orgId = url.searchParams.get('orgId') || (await resolveUserOrgId(client, userId));

    let cond;
    if (scope === 'pending') {
      if (!(await userIsOrgAdmin(client, orgId, userId))) {
        return Response.json({ error: 'only org admins can view pending patterns' }, { status: 403 });
      }
      cond = 'ce.user_id IS NOT NULL AND ce.approved = false';
    } else {
      cond = '(ce.user_id IS NULL OR ce.approved = true)';
    }

    const { rows } = await client.query(
      `SELECT ce.id, ce.slug, ce.created_by, ce.approved, ce.ticket, ce.user_id,
              ce.created_at, u.email AS creator_email, u.name AS creator_name
         FROM corpus_entries ce
         LEFT JOIN users u ON u.id = ce.user_id
        WHERE ce.type = 'pattern' AND ce.org_id = $1 AND ${cond}
        ORDER BY ce.approved DESC, ce.created_at DESC`,
      [orgId],
    );
    return Response.json({ patterns: rows });
  } catch (err) {
    console.error('[api/patterns GET] error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}
