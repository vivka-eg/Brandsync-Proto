import { getPool, resolveUserId } from '@/lib/db';

// GET /api/projects/:id/previews?userEmail=foo@bar.com
// Returns up to 4 of the project's most-recent files (id, slug, content) for
// rendering card thumbnails. Owner-scoped via the join on projects.user_id.
// Kept separate from the project list so the list payload stays lightweight
// and each card lazy-loads only its own previews.
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
    if (!userId) return Response.json({ files: [] });

    const { rows } = await client.query(
      `SELECT ce.id, ce.slug, ce.content
         FROM project_files pf
         JOIN corpus_entries ce ON ce.id = pf.corpus_entry_id
         JOIN projects p        ON p.id = pf.project_id
        WHERE pf.project_id = $1 AND p.user_id = $2
        ORDER BY pf.added_at DESC
        LIMIT 4`,
      [id, userId],
    );
    return Response.json({ files: rows });
  } catch (err) {
    console.error('[api/projects/:id/previews GET] error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}
