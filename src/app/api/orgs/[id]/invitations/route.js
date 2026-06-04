import { getPool, resolveUserId, userIsOrgAdmin } from '@/lib/db';
import { randomUUID } from 'crypto';

// GET /api/orgs/:id/invitations?userEmail=foo@bar.com
// Lists invitations for an org. Admin-only.
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
    if (!(await userIsOrgAdmin(client, id, userId))) {
      return Response.json({ error: 'only org admins can view invitations' }, { status: 403 });
    }

    const { rows } = await client.query(
      `SELECT id, email, role, status, created_at, accepted_at
         FROM org_invitations
        WHERE org_id = $1
        ORDER BY created_at DESC`,
      [id],
    );
    return Response.json({ invitations: rows });
  } catch (err) {
    console.error('[api/orgs/:id/invitations GET] error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}

// POST /api/orgs/:id/invitations  { userEmail, email, role? }
// Admin invites someone (by email) to join the org. Returns the token the
// invitee uses with POST /api/invitations/accept.
export async function POST(request, { params }) {
  const { id } = await params;
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
  }
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'invalid JSON' }, { status: 400 }); }
  const { userEmail, email } = body ?? {};
  if (!userEmail || !email) {
    return Response.json({ error: 'userEmail (inviter) and email (invitee) required' }, { status: 400 });
  }
  const role = body.role === 'admin' ? 'admin' : 'member';

  const client = getPool();
  try {
    const userId = await resolveUserId(client, userEmail);
    if (!userId) return Response.json({ error: 'no such user' }, { status: 404 });
    if (!(await userIsOrgAdmin(client, id, userId))) {
      return Response.json({ error: 'only org admins can invite' }, { status: 403 });
    }

    const token = randomUUID();
    const { rows } = await client.query(
      `INSERT INTO org_invitations (org_id, email, role, token, invited_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, role, status, token, created_at`,
      [id, String(email).toLowerCase(), role, token, userId],
    );
    return Response.json({ invitation: rows[0] }, { status: 201 });
  } catch (err) {
    console.error('[api/orgs/:id/invitations POST] error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}
