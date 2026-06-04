import { getPool } from '@/lib/db';

// POST /api/my-patterns/:id/save  { userEmail }
//
// Promotes a freshly-generated pattern from "draft" to "saved" by
// stamping corpus_entries.saved_at. This is the minimum-viable
// implementation of the flywheel's candidate state (BRANDSYNC-MAKE.md
// §8.3) — once the PO approval queue lands, this endpoint becomes the
// transition into `status='candidate'` and the PO can promote it to
// `team` / `org` from there. For now, "saved" means "the PM intends
// this to live in their pattern library" and is mostly a UX signal.
//
// Idempotent — re-saving an already-saved pattern just returns the
// existing saved_at without changing it.
export async function POST(request, { params }) {
  const { id } = await params;
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
  }
  let body;
  try { body = await request.json(); }
  catch { return Response.json({ error: 'invalid JSON body' }, { status: 400 }); }

  const userEmail = body?.userEmail;
  if (!userEmail) return Response.json({ error: 'userEmail required' }, { status: 400 });

  try {
    const { rows } = await getPool().query(
      `UPDATE corpus_entries ce
          SET saved_at = COALESCE(saved_at, now())
         FROM users u
        WHERE ce.id = $1 AND ce.user_id = u.id AND u.email = $2
        RETURNING ce.id, ce.slug, ce.saved_at`,
      [id, userEmail],
    );
    if (rows.length === 0) {
      return Response.json({ error: 'pattern not found or not yours' }, { status: 404 });
    }
    return Response.json({ pattern: rows[0] });
  } catch (err) {
    console.error('[api/my-patterns/[id]/save POST] error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}
