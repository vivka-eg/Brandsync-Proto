// One-off migration: copy the component kit + product logos OUT of Strapi and
// INTO Supabase, so the app can drop the Strapi dependency.
//
//   node --env-file=.env.local scripts/migrate-strapi-to-supabase.mjs
//
// Sources data via the running dev server's existing proxy routes
// (http://localhost:3000/api/components + /api/product-logos), which currently
// pull from Strapi. Logos: the presigned S3 image URLs work right now, so we
// download the bytes and store them as base64 data: URIs (no expiry, no extra
// hosting). Components: the full Strapi detail object is stored as jsonb so the
// kit + drawer keep getting the exact same shape.
//
// Idempotent: re-running upserts. Safe to run multiple times.

import pg from 'pg';

const APP = process.env.MIGRATE_APP_ORIGIN || 'http://localhost:3000';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 3 });

async function createTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS kit_components (
      id          text PRIMARY KEY,
      title       text NOT NULL,
      category    text,
      detail      jsonb,
      created_at  timestamptz NOT NULL DEFAULT now(),
      updated_at  timestamptz NOT NULL DEFAULT now()
    );
    CREATE UNIQUE INDEX IF NOT EXISTS kit_components_title_idx ON kit_components (title);
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS product_logos (
      id            text PRIMARY KEY,
      name          text,
      color_palette text,
      assets        jsonb,        -- { logo, light:{horizontal}, dark:{horizontal} } as data: URIs
      created_at    timestamptz NOT NULL DEFAULT now(),
      updated_at    timestamptz NOT NULL DEFAULT now()
    );
  `);
  console.log('✓ tables ready (kit_components, product_logos)');
}

async function migrateComponents() {
  const list = await fetch(`${APP}/api/components`).then((r) => r.json());
  if (!Array.isArray(list)) throw new Error('component list not an array: ' + JSON.stringify(list).slice(0, 120));
  console.log(`components: ${list.length} in list`);
  let ok = 0;
  for (const c of list) {
    try {
      const detail = await fetch(`${APP}/api/components?name=${encodeURIComponent(c.title)}`).then((r) => r.json());
      await pool.query(
        `INSERT INTO kit_components (id, title, category, detail, updated_at)
         VALUES ($1, $2, $3, $4, now())
         ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, category = EXCLUDED.category, detail = EXCLUDED.detail, updated_at = now()`,
        [c.id, c.title, c.category ?? null, detail && !detail.error ? detail : null],
      );
      ok++;
    } catch (e) {
      console.warn(`  ! ${c.title}: ${e.message}`);
    }
  }
  console.log(`✓ components migrated: ${ok}/${list.length}`);
}

// Download a presigned URL → data: URI (base64). Returns null on failure/empty.
async function toDataUri(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const mime = res.headers.get('content-type')?.split(';')[0]
      || (url.includes('.svg') ? 'image/svg+xml' : 'application/octet-stream');
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${mime};base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

async function migrateLogos() {
  const body = await fetch(`${APP}/api/product-logos?pageSize=200`).then((r) => r.json());
  const logos = Array.isArray(body?.data) ? body.data : [];
  console.log(`logos: ${logos.length} to migrate (downloading image bytes)…`);
  let ok = 0;
  for (const l of logos) {
    try {
      const [logo, light, dark] = await Promise.all([
        toDataUri(l.assets?.logo),
        toDataUri(l.assets?.light?.horizontal),
        toDataUri(l.assets?.dark?.horizontal),
      ]);
      const assets = { logo, light: { horizontal: light }, dark: { horizontal: dark } };
      await pool.query(
        `INSERT INTO product_logos (id, name, color_palette, assets, updated_at)
         VALUES ($1, $2, $3, $4, now())
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, color_palette = EXCLUDED.color_palette, assets = EXCLUDED.assets, updated_at = now()`,
        [l.id, l.name ?? null, l.colorPalette ?? null, assets],
      );
      ok++;
      if (ok % 10 === 0) console.log(`  …${ok}/${logos.length}`);
    } catch (e) {
      console.warn(`  ! ${l.name}: ${e.message}`);
    }
  }
  console.log(`✓ logos migrated: ${ok}/${logos.length}`);
}

(async () => {
  try {
    await createTables();
    await migrateComponents();
    await migrateLogos();
    const { rows: c } = await pool.query('SELECT count(*)::int n FROM kit_components');
    const { rows: l } = await pool.query("SELECT count(*)::int n, count(*) FILTER (WHERE assets->>'logo' IS NOT NULL)::int withlogo, pg_size_pretty(sum(octet_length(assets::text))) sz FROM product_logos");
    console.log(`\nDONE · kit_components=${c[0].n} · product_logos=${l[0].n} (with icon: ${l[0].withlogo}, assets ~${l[0].sz})`);
  } catch (e) {
    console.error('MIGRATION FAILED:', e.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
