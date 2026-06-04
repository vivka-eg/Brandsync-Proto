import { getPool } from '@/lib/db';

// GET /api/corpus-component?slug=navigation-drawer
//
// Serves a component's authored HTML straight from the MCP design-system
// corpus (corpus_entries, slug `corpus/components/<slug>.html`). Some
// components (e.g. the Navigation Drawer app shell) are richer and more
// correct in the corpus than in Strapi, so the components drawer renders
// those from here instead of the Strapi library. Read-only.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/; // guard against path tricks / injection

export async function GET(request) {
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
  }
  const slug = new URL(request.url).searchParams.get('slug');
  if (!slug || !SLUG_RE.test(slug)) {
    return Response.json({ error: 'valid slug required' }, { status: 400 });
  }

  const client = getPool();
  try {
    const { rows } = await client.query(
      `SELECT content FROM corpus_entries
        WHERE slug = $1 AND type = 'component_html' LIMIT 1`,
      [`corpus/components/${slug}.html`],
    );
    if (!rows.length) return Response.json({ error: `no corpus component "${slug}"` }, { status: 404 });
    return Response.json({ slug, html: rows[0].content });
  } catch (err) {
    console.error('[api/corpus-component] error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}
