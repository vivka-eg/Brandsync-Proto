import { getPool, resolveUserId } from '@/lib/db';
import { randomUUID } from 'crypto';

// userEmail-driven access control is the same local-dev placeholder used by
// /api/projects; production auth is described there.

// GET /api/orgs?userEmail=foo@bar.com
// Orgs the caller can see: every default org + any they're a member of.
// Each row carries the caller's role (null if visible only via is_default).
export async function GET(request) {
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
  }
  const userEmail = new URL(request.url).searchParams.get('userEmail');
  if (!userEmail) return Response.json({ error: 'userEmail required' }, { status: 400 });

  const client = getPool();
  try {
    const userId = await resolveUserId(client, userEmail);
    if (!userId) return Response.json({ error: 'no such user' }, { status: 404 });

    const { rows } = await client.query(
      `SELECT o.id, o.name, o.is_default,
              (SELECT m.role FROM org_members m
                WHERE m.org_id = o.id AND m.user_id = $1) AS my_role,
              (SELECT count(*)::int FROM org_members m WHERE m.org_id = o.id) AS member_count
         FROM orgs o
        WHERE o.is_default = true
           OR o.id IN (SELECT org_id FROM org_members WHERE user_id = $1)
        ORDER BY o.is_default DESC, o.name`,
      [userId],
    );
    return Response.json({ orgs: rows });
  } catch (err) {
    console.error('[api/orgs GET] query error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}

// POST /api/orgs  { userEmail, name, id? }
// Creates an org; the creator becomes its admin.
export async function POST(request) {
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
  }
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'invalid JSON' }, { status: 400 }); }
  const { userEmail, name } = body ?? {};
  if (!userEmail || !name) {
    return Response.json({ error: 'userEmail and name required' }, { status: 400 });
  }

  const client = getPool();
  try {
    const userId = await resolveUserId(client, userEmail);
    if (!userId) return Response.json({ error: 'no such user' }, { status: 404 });

    // Readable id derived from the name + a short suffix to avoid collisions.
    const id = (body.id?.trim())
      || `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)}-${randomUUID().slice(0, 8)}`;

    const { rows } = await client.query(
      'INSERT INTO orgs (id, name) VALUES ($1, $2) RETURNING id, name, is_default',
      [id, name],
    );
    await client.query(
      `INSERT INTO org_members (org_id, user_id, role) VALUES ($1, $2, 'admin')
       ON CONFLICT (org_id, user_id) DO UPDATE SET role = 'admin'`,
      [id, userId],
    );
    return Response.json({ org: rows[0] }, { status: 201 });
  } catch (err) {
    console.error('[api/orgs POST] error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}
