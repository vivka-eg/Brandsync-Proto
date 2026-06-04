import { getPool, resolveUserId, resolveUserOrgId, userVisibleOrgIds, userOwnsProject } from '@/lib/db';
import { randomUUID } from 'crypto';

// POST /api/patterns/:id/clone  { userEmail, orgId?, projectId? }
// Creates a new editable DRAFT from an existing (approved/visible) pattern by
// copying its content — no Claude call, so it's ~free. This is how reuse
// banks tokens: start from an approved pattern, then make cheap scoped edits
// instead of generating a full UI from scratch.
export async function POST(request, { params }) {
  const { id } = await params;
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
  }
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'invalid JSON' }, { status: 400 }); }
  const { userEmail, projectId } = body ?? {};
  if (!userEmail) return Response.json({ error: 'userEmail required' }, { status: 400 });

  const client = getPool();
  try {
    const userId = await resolveUserId(client, userEmail);
    if (!userId) return Response.json({ error: 'no such user' }, { status: 404 });

    // Source must be visible to the caller: team (NULL), approved, or own.
    const { rows: src } = await client.query(
      `SELECT slug, content, approved, user_id FROM corpus_entries WHERE id = $1 AND type = 'pattern'`,
      [id],
    );
    const s = src[0];
    if (!s) return Response.json({ error: 'pattern not found' }, { status: 404 });
    if (!(s.user_id === null || s.approved === true || s.user_id === userId)) {
      return Response.json({ error: 'not allowed to use this pattern' }, { status: 403 });
    }

    // Target org: the requested active org if the caller can access it, else default.
    const visible = await userVisibleOrgIds(client, userId);
    const orgId = (body.orgId && visible.includes(body.orgId)) ? body.orgId : await resolveUserOrgId(client, userId);

    // Fresh slug from the source's base name + a short suffix.
    const base = String(s.slug)
      .replace(/^corpus\/patterns\//, '').replace(/\.md$/, '')
      .replace(/-[a-z0-9]{4,7}$/i, '') || 'pattern';
    const slug = `${base}-${randomUUID().slice(0, 5)}`;
    const path = `corpus/patterns/${slug}.md`;

    const { rows } = await client.query(
      `INSERT INTO corpus_entries (slug, type, path, content, user_id, org_id, approved, created_by)
       VALUES ($1, 'pattern', $2, $3, $4, $5, false, $6)
       RETURNING id, slug`,
      [slug, path, s.content, userId, orgId, userEmail],
    );
    const pattern = rows[0];

    // Optional: drop the copy straight into a project.
    if (projectId && (await userOwnsProject(client, projectId, userId))) {
      await client.query(
        `INSERT INTO project_files (project_id, corpus_entry_id) VALUES ($1, $2)
         ON CONFLICT (project_id, corpus_entry_id) DO NOTHING`,
        [projectId, pattern.id],
      );
      await client.query('UPDATE projects SET updated_at = now() WHERE id = $1', [projectId]);
    }

    return Response.json({ pattern }, { status: 201 });
  } catch (err) {
    console.error('[api/patterns/:id/clone POST] error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}
