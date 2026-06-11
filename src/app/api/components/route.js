import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Component kit, served entirely from Supabase `kit_components` (migrated off
// Strapi via scripts/migrate-strapi-to-supabase.mjs). The full original detail
// object is stored as jsonb, so the shape is identical to what the kit builder
// and the Components drawer expect.
//
//   GET /api/components              → sidebar list  [{ id, title, category }]
//   GET /api/components?name=<title> → full component detail (jsonb)
export async function GET(request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
  }
  const name = new URL(request.url).searchParams.get('name');

  try {
    const pool = getPool();
    if (name) {
      const { rows } = await pool.query(
        'SELECT detail FROM kit_components WHERE title = $1 LIMIT 1',
        [name],
      );
      if (!rows[0]?.detail) {
        return NextResponse.json({ error: `Component "${name}" not found` }, { status: 404 });
      }
      return NextResponse.json(rows[0].detail);
    }
    const { rows } = await pool.query(
      'SELECT id, title, category FROM kit_components ORDER BY title',
    );
    return NextResponse.json(rows.map((r) => ({ id: r.id, title: r.title, category: r.category })));
  } catch (err) {
    console.error('[api/components] error:', err);
    return NextResponse.json({ error: err?.message ?? 'unknown error' }, { status: 500 });
  }
}
