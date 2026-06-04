import { getPool, resolveUserId, userVisibleOrgIds, userIsOrgAdmin } from '@/lib/db';

// Manage a single kit override (identified by org_id + name).
//
//   POST   /api/kit/override   { orgId, userEmail, name, approved }
//     Admin-only. Toggle an override into / out of the team kit.
//
//   DELETE /api/kit/override?orgId=&userEmail=&name=
//     Revert: drop the override row so the component falls back to base
//     (or, for an 'add', disappears). Allowed for the draft's author or any
//     org admin.
//
// Listing pending overrides for an approval queue is done via
// GET /api/kit?orgId=&userEmail= (the merged catalog already carries the
// caller-visible drafts); this route only mutates.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  if (!process.env.DATABASE_URL) return Response.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'invalid JSON' }, { status: 400 }); }
  const { orgId, userEmail, name, approved } = body ?? {};
  if (!orgId || !userEmail || !name || typeof approved !== 'boolean') {
    return Response.json({ error: 'orgId, userEmail, name and approved (boolean) required' }, { status: 400 });
  }

  const client = getPool();
  try {
    const userId = await resolveUserId(client, userEmail);
    if (!userId) return Response.json({ error: 'no such user' }, { status: 404 });
    if (!(await userIsOrgAdmin(client, orgId, userId))) {
      return Response.json({ error: 'only org admins can approve kit overrides' }, { status: 403 });
    }
    const { rows } = await client.query(
      `UPDATE kit_overrides
          SET approved = $3, updated_at = now()
        WHERE org_id = $1 AND name = $2
      RETURNING id, name, action, approved`,
      [orgId, name, approved],
    );
    if (!rows.length) return Response.json({ error: 'no such override' }, { status: 404 });
    return Response.json({ ok: true, override: rows[0] });
  } catch (err) {
    console.error('[api/kit/override POST] error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!process.env.DATABASE_URL) return Response.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
  const url = new URL(request.url);
  const orgId = url.searchParams.get('orgId');
  const userEmail = url.searchParams.get('userEmail');
  const name = url.searchParams.get('name');
  if (!orgId || !userEmail || !name) {
    return Response.json({ error: 'orgId, userEmail and name required' }, { status: 400 });
  }

  const client = getPool();
  try {
    const userId = await resolveUserId(client, userEmail);
    if (!userId) return Response.json({ error: 'no such user' }, { status: 404 });
    const visible = await userVisibleOrgIds(client, userId);
    if (!visible.includes(orgId)) return Response.json({ error: 'org not accessible' }, { status: 403 });

    const isAdmin = await userIsOrgAdmin(client, orgId, userId);
    // Author may revert their own draft; admins may revert anything.
    const cond = isAdmin ? '' : 'AND created_by = $3';
    const params = isAdmin ? [orgId, name] : [orgId, name, userId];
    const { rows } = await client.query(
      `DELETE FROM kit_overrides WHERE org_id = $1 AND name = $2 ${cond} RETURNING id`,
      params,
    );
    if (!rows.length) return Response.json({ error: 'nothing reverted (not found or not yours)' }, { status: 404 });
    return Response.json({ ok: true, reverted: rows.length });
  } catch (err) {
    console.error('[api/kit/override DELETE] error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}
