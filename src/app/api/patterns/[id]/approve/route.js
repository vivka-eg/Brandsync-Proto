import { getPool, resolveUserId, userIsOrgAdmin } from '@/lib/db';

// POST /api/patterns/:id/approve  { userEmail }
// An org admin approves a user draft, making it team-visible in Explore.
// Pass { approved: false } to un-approve. Admin of the pattern's org only.
export async function POST(request, { params }) {
  const { id } = await params;
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
  }
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'invalid JSON' }, { status: 400 }); }
  const { userEmail } = body ?? {};
  const approve = body?.approved !== false; // default true
  if (!userEmail) return Response.json({ error: 'userEmail required' }, { status: 400 });

  const client = getPool();
  try {
    const userId = await resolveUserId(client, userEmail);
    if (!userId) return Response.json({ error: 'no such user' }, { status: 404 });

    const { rows: pr } = await client.query(
      `SELECT org_id FROM corpus_entries WHERE id = $1 AND type = 'pattern'`,
      [id],
    );
    if (!pr[0]) return Response.json({ error: 'pattern not found' }, { status: 404 });
    if (!(await userIsOrgAdmin(client, pr[0].org_id, userId))) {
      return Response.json({ error: 'only org admins can approve patterns' }, { status: 403 });
    }

    const { rows } = await client.query(
      `UPDATE corpus_entries
          SET approved = $2,
              approved_by = CASE WHEN $2 THEN $3 ELSE NULL END,
              approved_at = CASE WHEN $2 THEN now() ELSE NULL END,
              updated_at = now()
        WHERE id = $1
        RETURNING id, approved`,
      [id, approve, userId],
    );
    return Response.json({ pattern: rows[0] });
  } catch (err) {
    console.error('[api/patterns/:id/approve POST] error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}
