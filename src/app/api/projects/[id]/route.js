import { getPool, resolveUserId } from '@/lib/db';
import { BRAND_PALETTES } from '@/lib/brand-substitute';

// GET /api/projects/:id?userEmail=foo@bar.com
// Returns { project, files: [{ id, corpus_entry_id, added_at, slug, type, content }] }
// 404s if project doesn't belong to userEmail or doesn't exist.
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

    // Project lookup + files query are independent — fire them in parallel.
    // Saves ~one DB RTT per project switch.
    const [{ rows: projectRows }, { rows: files }] = await Promise.all([
      client.query(
        `SELECT id, name, user_id, brand_palette, logo_name, created_at, updated_at
         FROM projects
         WHERE id = $1 AND user_id = $2`,
        [id, userId],
      ),
      client.query(
        `SELECT pf.id, pf.corpus_entry_id, pf.added_at, ce.slug, ce.type, ce.content, ce.saved_at
         FROM project_files pf
         JOIN corpus_entries ce ON ce.id = pf.corpus_entry_id
         WHERE pf.project_id = $1
         ORDER BY pf.added_at DESC`,
        [id],
      ),
    ]);

    if (projectRows.length === 0) {
      return Response.json({ error: 'project not found' }, { status: 404 });
    }
    return Response.json({ project: projectRows[0], files });
  } catch (err) {
    console.error('[api/projects/[id] GET] error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}

// PATCH /api/projects/:id  { userEmail, brandPalette, logoName }
// Updates the project's persisted brand (the "edit brand later" flow).
// Ownership-checked via user_id in the UPDATE's WHERE clause.
export async function PATCH(request, { params }) {
  const { id } = await params;
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
  }
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'invalid JSON body' }, { status: 400 }); }
  const userEmail = body?.userEmail;
  if (!userEmail) return Response.json({ error: 'userEmail required' }, { status: 400 });
  const brandPalette = BRAND_PALETTES.includes(body?.brandPalette) ? body.brandPalette : null;
  const logoName = typeof body?.logoName === 'string' && body.logoName.trim()
    ? body.logoName.trim() : null;

  const client = getPool();
  try {
    const userId = await resolveUserId(client, userEmail);
    if (!userId) return Response.json({ error: 'no such user' }, { status: 404 });
    const { rows } = await client.query(
      `UPDATE projects
          SET brand_palette = $1, logo_name = $2
        WHERE id = $3 AND user_id = $4
        RETURNING id, name, org_id, brand_palette, logo_name, created_at, updated_at`,
      [brandPalette, logoName, id, userId],
    );
    if (rows.length === 0) return Response.json({ error: 'project not found' }, { status: 404 });
    return Response.json({ project: rows[0] });
  } catch (err) {
    console.error('[api/projects/[id] PATCH] error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}
