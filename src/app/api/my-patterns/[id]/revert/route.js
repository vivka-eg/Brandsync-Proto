import { getPool } from '@/lib/db';

// POST /api/my-patterns/:id/revert  { userEmail, versionId }
//
// Restores corpus_entries[:id].content to the snapshot `versionId` from
// pattern_versions (the "state before" a given edit turn). The CURRENT content
// is snapshotted first so a revert is itself reversible. Ownership is enforced
// via the users join, same as the sibling DELETE/PATCH handlers.
export async function POST(request, { params }) {
  const { id } = await params;
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
  }
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'invalid JSON body' }, { status: 400 }); }
  const userEmail = body?.userEmail;
  const versionId = body?.versionId;
  if (!userEmail) return Response.json({ error: 'userEmail required' }, { status: 400 });
  if (!versionId) return Response.json({ error: 'versionId required' }, { status: 400 });

  const client = getPool();
  try {
    // Ownership + current content in one shot.
    const { rows: owned } = await client.query(
      `SELECT ce.id, ce.content
         FROM corpus_entries ce
         JOIN users u ON u.id = ce.user_id
        WHERE ce.id = $1 AND u.email = $2`,
      [id, userEmail],
    );
    if (owned.length === 0) {
      return Response.json({ error: 'pattern not found or not yours' }, { status: 404 });
    }
    const currentContent = owned[0].content;

    // The snapshot to restore (must belong to this pattern).
    const { rows: vers } = await client.query(
      `SELECT content FROM pattern_versions WHERE id = $1 AND corpus_entry_id = $2`,
      [versionId, id],
    );
    if (vers.length === 0) {
      return Response.json({ error: 'version not found for this pattern' }, { status: 404 });
    }

    // Snapshot current content so the revert can itself be reverted.
    await client.query(
      `INSERT INTO pattern_versions (corpus_entry_id, content) VALUES ($1, $2)`,
      [id, currentContent],
    );

    const { rows } = await client.query(
      `UPDATE corpus_entries
          SET content = $1
        WHERE id = $2
        RETURNING id, slug, type, path, content, user_id, created_at, saved_at`,
      [vers[0].content, id],
    );
    return Response.json({ pattern: rows[0] });
  } catch (err) {
    console.error('[api/my-patterns/[id]/revert] error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}
