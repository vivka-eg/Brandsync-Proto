#!/usr/bin/env node
//
// Dump prod Brandsync data (logos + components) to local JSON files plus
// downloaded media. Intended to seed a local Strapi instance later.
//
// Run from frontend dir:
//   node --env-file=.env.local scripts/dump-brand-data.mjs
//
// Writes to ../backend/data/seed/:
//   logos.json
//   components.json
//   media/logos/<filename>
//   media/components/<filename>
//
// Re-run any time prod data changes or the 24h S3 URLs need to be refreshed.

import fs from 'node:fs/promises';
import path from 'node:path';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

// ─── config ─────────────────────────────────────────────────────────────

const PROD_API = 'https://api.brand.dev.egsync.com/api';
const TOKEN = process.env.STRAPI_API_PROD_TOKEN;
const SEED_DIR = path.resolve(import.meta.dirname, '../../backend/data/seed');
const MEDIA_ROOT = path.join(SEED_DIR, 'media');

if (!TOKEN) {
  console.error('Missing STRAPI_API_PROD_TOKEN. Pass it via --env-file=.env.local');
  process.exit(1);
}

const headers = { Authorization: `Bearer ${TOKEN}` };

// ─── fetch helpers ──────────────────────────────────────────────────────

async function getJson(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`GET ${url} → HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  return res.json();
}

// Paginate through every page of a collection. Strapi returns
// meta.pagination.{page, pageCount}.
async function fetchAll(collection, populate) {
  const all = [];
  let page = 1;
  const pageSize = 100;
  while (true) {
    const url = `${PROD_API}/${collection}?${populate}&pagination%5Bpage%5D=${page}&pagination%5BpageSize%5D=${pageSize}`;
    const body = await getJson(url);
    const items = body?.data ?? [];
    all.push(...items);
    const pageCount = body?.meta?.pagination?.pageCount ?? 1;
    process.stdout.write(`  ${collection}: page ${page}/${pageCount} (${all.length} total)\r`);
    if (page >= pageCount) break;
    page += 1;
  }
  console.log(); // newline after the \r progress
  return all;
}

// ─── media downloader ──────────────────────────────────────────────────
// Walks an arbitrary JSON value looking for Strapi media objects (objects
// with both `url` and `hash` + `ext`). When it finds one, downloads the
// file to MEDIA_ROOT/<subdir>/<hash><ext> and rewrites .url to a relative
// local path. Returns the count of files downloaded.

let downloadCount = 0;
let skipCount = 0;

async function downloadMedia(value, subdir) {
  if (value === null || typeof value !== 'object') return;

  // Strapi media object: has hash + ext + url. Sometimes also `name`.
  if (typeof value.url === 'string' && typeof value.hash === 'string' && typeof value.ext === 'string') {
    const filename = `${value.hash}${value.ext}`;
    const destDir = path.join(MEDIA_ROOT, subdir);
    const destPath = path.join(destDir, filename);

    try {
      await fs.access(destPath);
      skipCount += 1;
    } catch {
      // File doesn't exist — download it.
      await fs.mkdir(destDir, { recursive: true });
      const res = await fetch(value.url);
      if (res.ok) {
        await pipeline(res.body, createWriteStream(destPath));
        downloadCount += 1;
        process.stdout.write(`  downloaded ${downloadCount} files (skipped ${skipCount} existing)\r`);
      } else {
        console.warn(`\n  ! ${res.status} downloading ${value.url.slice(0, 80)}`);
      }
    }

    // Rewrite url + remove the signed-URL query string + add a hint that
    // the file is now local. Keep the rest of the metadata intact.
    value.url = `/media/${subdir}/${filename}`;
    value._localPath = `media/${subdir}/${filename}`;
    return;
  }

  // Recurse into objects + arrays.
  if (Array.isArray(value)) {
    for (const v of value) await downloadMedia(v, subdir);
  } else {
    for (const k of Object.keys(value)) await downloadMedia(value[k], subdir);
  }
}

// ─── main ───────────────────────────────────────────────────────────────

async function main() {
  await fs.mkdir(SEED_DIR, { recursive: true });

  // === logos ===
  console.log('\nFetching logos from prod…');
  const LOGO_POPULATE = [
    'populate[0]=Assets',
    'populate[1]=Assets.Logo',
    'populate[2]=Assets.Bundle',
    'populate[3]=Assets.LightLogo',
    'populate[4]=Assets.LightLogo.Horizontal',
    'populate[5]=Assets.LightLogo.Vertical',
    'populate[6]=Assets.DarkLogo',
    'populate[7]=Assets.DarkLogo.Horizontal',
    'populate[8]=Assets.DarkLogo.Vertical',
    'populate[9]=Assets.NegativeLogo',
    'populate[10]=Assets.NegativeLogo.Horizontal',
    'populate[11]=Assets.NegativeLogo.Vertical',
    'populate[12]=Sizes',
    'populate[13]=Sizes.HeaderSize',
    'populate[14]=Sizes.DrawerSize',
    'populate[15]=Sizes.SplashHorizontalSize',
    'populate[16]=Sizes.SplashSquareSize',
    'populate[17]=Powerpoint',
    'populate[18]=CVI',
  ].join('&');

  const logos = await fetchAll('logos', LOGO_POPULATE);
  console.log(`  total logos: ${logos.length}`);

  console.log('Downloading logo media…');
  downloadCount = 0; skipCount = 0;
  for (const logo of logos) await downloadMedia(logo, 'logos');
  console.log(`\n  logos media: ${downloadCount} downloaded, ${skipCount} skipped`);

  await fs.writeFile(path.join(SEED_DIR, 'logos.json'), JSON.stringify(logos, null, 2));
  console.log(`  saved logos.json (${logos.length} entries)`);

  // === components ===
  console.log('\nFetching components from prod…');
  const COMPONENT_POPULATE = [
    'populate[0]=Image',
    'populate[1]=Overview',
    'populate[2]=Specification',
    'populate[3]=Usage',
    'populate[4]=Guidelines',
    'populate[5]=Accessiblity',
    'populate[6]=CodeExamples',
  ].join('&');

  const components = await fetchAll('components', COMPONENT_POPULATE);
  console.log(`  total components: ${components.length}`);

  console.log('Downloading component media…');
  downloadCount = 0; skipCount = 0;
  for (const c of components) await downloadMedia(c, 'components');
  console.log(`\n  components media: ${downloadCount} downloaded, ${skipCount} skipped`);

  await fs.writeFile(path.join(SEED_DIR, 'components.json'), JSON.stringify(components, null, 2));
  console.log(`  saved components.json (${components.length} entries)`);

  // === component-lists (sidebar) ===
  console.log('\nFetching component-lists…');
  const componentLists = await fetchAll('component-lists', 'populate=ComponentItem.ComponentRel');
  await fs.writeFile(path.join(SEED_DIR, 'component-lists.json'), JSON.stringify(componentLists, null, 2));
  console.log(`  saved component-lists.json (${componentLists.length} entries)`);

  console.log('\nDone.');
  console.log(`Output dir: ${SEED_DIR}`);
}

main().catch(e => { console.error(e); process.exit(1); });
