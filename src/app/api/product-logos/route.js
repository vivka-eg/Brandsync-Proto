import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Product logos, served entirely from Supabase `product_logos` (migrated off
// Strapi via scripts/migrate-strapi-to-supabase.mjs). Image bytes are stored as
// base64 data: URIs — no expiry, no external/Strapi dependency, and they render
// in the sandboxed preview iframe (opaque origin) without CORS issues.
//
//   GET /api/product-logos?page=1&pageSize=100
//     → { data: [{ id, name, colorPalette, assets:{logo,light:{horizontal},dark:{horizontal}} }], totalCount, source }
export async function GET(request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
  }
  const { searchParams } = new URL(request.url);
  const limit = Math.max(1, Number(searchParams.get('pageSize')) || 100);
  const offset = (Math.max(1, Number(searchParams.get('page')) || 1) - 1) * limit;

  try {
    const pool = getPool();
    const [{ rows }, { rows: cnt }] = await Promise.all([
      pool.query(
        'SELECT id, name, color_palette, assets FROM product_logos ORDER BY name LIMIT $1 OFFSET $2',
        [limit, offset],
      ),
      pool.query('SELECT count(*)::int n FROM product_logos'),
    ]);
    const data = rows.map((r) => ({
      id: r.id,
      name: r.name,
      colorPalette: r.color_palette,
      assets: r.assets ?? { logo: null, light: { horizontal: null }, dark: { horizontal: null } },
    }));
    return NextResponse.json({ data, totalCount: cnt[0]?.n ?? data.length, source: 'supabase' });
  } catch (err) {
    console.error('[api/product-logos] error:', err);
    return NextResponse.json({ error: err?.message ?? 'unknown error' }, { status: 500 });
  }
}
