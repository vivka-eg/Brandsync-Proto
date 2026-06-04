import { getPool, resolveUserId, userVisibleOrgIds } from '@/lib/db';

// GET /api/orgs/:id/members?userEmail=foo@bar.com
// Lists members of an org. Caller must be able to see the org (member or
// the org is a default org).
export async function GET(request, { params }) {
  const { id } = await params;
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
  }
  const userEmail = new URL(request.url).searchParams.get('userEmail');
  if (!userEmail) return Response.json({ error: 'userEmail required' }, { status: 400 });

  const client = getPool();
  try {
    const userId = await resolveUserId(client, userEmail);
    if (!userId) return Response.json({ error: 'no such user' }, { status: 404 });

    const visible = await userVisibleOrgIds(client, userId);
    if (!visible.includes(id)) return Response.json({ error: 'org not found' }, { status: 404 });

    const { rows } = await client.query(
      `SELECT m.user_id, u.email, m.role, m.created_at
         FROM org_members m
         JOIN users u ON u.id = m.user_id
        WHERE m.org_id = $1
        ORDER BY (m.role = 'admin') DESC, m.created_at`,
      [id],
    );
    return Response.json({ members: rows });
  } catch (err) {
    console.error('[api/orgs/:id/members GET] error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}
