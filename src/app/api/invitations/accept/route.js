import { getPool, resolveUserId } from '@/lib/db';

// POST /api/invitations/accept  { userEmail, token }
// The invitee accepts an invitation: creates their org membership and marks
// the invitation accepted. The accepting user's email must match the one the
// invitation was sent to (prevents token sharing).
export async function POST(request) {
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
  }
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'invalid JSON' }, { status: 400 }); }
  const { userEmail, token } = body ?? {};
  if (!userEmail || !token) {
    return Response.json({ error: 'userEmail and token required' }, { status: 400 });
  }

  const client = getPool();
  try {
    const userId = await resolveUserId(client, userEmail);
    if (!userId) return Response.json({ error: 'no such user' }, { status: 404 });

    const { rows } = await client.query(
      'SELECT id, org_id, email, role, status FROM org_invitations WHERE token = $1',
      [token],
    );
    const invitation = rows[0];
    if (!invitation) return Response.json({ error: 'invalid invitation token' }, { status: 404 });
    if (invitation.status !== 'pending') {
      return Response.json({ error: `invitation already ${invitation.status}` }, { status: 409 });
    }
    if (invitation.email.toLowerCase() !== String(userEmail).toLowerCase()) {
      return Response.json({ error: 'this invitation was issued to a different email' }, { status: 403 });
    }

    await client.query(
      `INSERT INTO org_members (org_id, user_id, role) VALUES ($1, $2, $3)
       ON CONFLICT (org_id, user_id) DO UPDATE SET role = EXCLUDED.role`,
      [invitation.org_id, userId, invitation.role],
    );
    await client.query(
      "UPDATE org_invitations SET status = 'accepted', accepted_at = now() WHERE id = $1",
      [invitation.id],
    );
    return Response.json({ joined: invitation.org_id, role: invitation.role });
  } catch (err) {
    console.error('[api/invitations/accept POST] error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}
