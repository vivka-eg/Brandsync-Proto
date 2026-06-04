import { getPool, resolveUserId } from '@/lib/db';

// GET /api/patterns/:id?userEmail=
// Returns a single pattern's content for a lazy thumbnail preview. Visible if
// it's a team row (user_id NULL), admin-approved, or the caller's own draft.
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
    const { rows } = await client.query(
      `SELECT id, slug, content, approved, user_id FROM corpus_entries WHERE id = $1 AND type = 'pattern'`,
      [id],
    );
    const p = rows[0];
    if (!p) return Response.json({ error: 'not found' }, { status: 404 });
    const visible = p.user_id === null || p.approved === true || p.user_id === userId;
    if (!visible) return Response.json({ error: 'not visible' }, { status: 403 });
    return Response.json({ content: p.content, slug: p.slug });
  } catch (err) {
    console.error('[api/patterns/:id GET] error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}
