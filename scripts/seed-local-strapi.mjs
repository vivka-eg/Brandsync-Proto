#!/usr/bin/env node
//
// Seed local Strapi (http://localhost:1337) with the prod data dumped to
// /backend/data/seed/. Phase 2 of "local Strapi clone."
//
// SCOPE: logos only on this pass. Components/component-lists already exist
// locally (60 entries from a prior load) — skipping them avoids duplicates.
// Run again with --components later once we decide how to merge them.
//
// Strategy:
//   1. Walk logos.json, collect every media object (has _localPath).
//   2. Upload each media file to Strapi /api/upload. Build a map of
//      prod-file-id → new-local-file-id.
//   3. For each logo, walk the structure replacing media objects with
//      their new local file IDs. Strip Strapi-assigned read-only fields
//      (id, documentId, timestamps).
//   4. POST each cleaned logo to /api/logos.
//
// Run from frontend dir:
//   node --env-file=.env.local scripts/seed-local-strapi.mjs

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const STRAPI = 'http://localhost:1337';
const TOKEN = process.env.STRAPI_API_TOKEN;
if (!TOKEN) {
  console.error('Missing STRAPI_API_TOKEN. Pass --env-file=.env.local');
  process.exit(1);
}

const SEED_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../backend/data/seed');

// ─── walker ─────────────────────────────────────────────────────────────
// A "media object" in the dumped JSON has: id (number), hash, ext, url,
// and (after our rewrite) _localPath = "media/<subdir>/<filename>".

function isMediaObject(v) {
  return v && typeof v === 'object'
    && typeof v.id === 'number'
    && typeof v.hash === 'string'
    && typeof v.ext === 'string'
    && typeof v._localPath === 'string';
}

function collectMedia(value, into) {
  if (value === null || typeof value !== 'object') return;
  if (isMediaObject(value)) {
    into.set(value.id, value._localPath);
    return; // don't recurse into media object's internals
  }
  if (Array.isArray(value)) {
    for (const v of value) collectMedia(v, into);
  } else {
    for (const k of Object.keys(value)) collectMedia(value[k], into);
  }
}

// Recursively rewrite media objects → just the new local file ID (number).
function rewriteMedia(value, fileIdMap) {
  if (value === null || typeof value !== 'object') return value;
  if (isMediaObject(value)) {
    const newId = fileIdMap[value.id];
    return newId ?? null;
  }
  if (Array.isArray(value)) {
    return value.map(v => rewriteMedia(v, fileIdMap));
  }
  const out = {};
  for (const k of Object.keys(value)) {
    out[k] = rewriteMedia(value[k], fileIdMap);
  }
  return out;
}

// Strip Strapi read-only fields recursively from an entry. Nested compos
// (Assets, LightLogo, Sizes, etc.) each carry their own `id` and
// `documentId` from the dump which Strapi rejects on POST — we want it to
// mint new ones.
const READ_ONLY = ['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt'];
function stripReadOnly(value) {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(stripReadOnly);
  const out = {};
  for (const k of Object.keys(value)) {
    if (READ_ONLY.includes(k)) continue;
    out[k] = stripReadOnly(value[k]);
  }
  return out;
}

// ─── strapi calls ──────────────────────────────────────────────────────

async function uploadOne(localRelPath) {
  const absPath = path.join(SEED_DIR, localRelPath);
  const buffer = await fs.readFile(absPath);
  const filename = path.basename(localRelPath);

  // Guess content-type from extension; Strapi sniffs it but explicit is safer.
  const ext = path.extname(filename).toLowerCase();
  const mimes = {
    '.svg':  'image/svg+xml',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif':  'image/gif',
    '.webp': 'image/webp',
    '.pdf':  'application/pdf',
    '.zip':  'application/zip',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  };
  const mime = mimes[ext] || 'application/octet-stream';

  const form = new FormData();
  form.append('files', new Blob([buffer], { type: mime }), filename);

  const res = await fetch(`${STRAPI}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}` },
    body: form,
  });
  if (!res.ok) {
    throw new Error(`upload ${filename} → HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  const body = await res.json();
  // Strapi returns [{ id, url, ... }]
  if (!Array.isArray(body) || !body[0]?.id) {
    throw new Error(`unexpected upload response: ${JSON.stringify(body).slice(0, 200)}`);
  }
  return body[0].id;
}

async function createLogo(data) {
  const res = await fetch(`${STRAPI}/api/logos`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    throw new Error(`create logo "${data.Name}" → HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  return res.json();
}

// ─── main ───────────────────────────────────────────────────────────────

async function main() {
  console.log('Reading logos.json…');
  const logos = JSON.parse(await fs.readFile(path.join(SEED_DIR, 'logos.json'), 'utf8'));
  console.log(`  ${logos.length} logos`);

  // === 1. collect unique media files
  const mediaMap = new Map(); // prodFileId → localRelPath
  for (const logo of logos) collectMedia(logo, mediaMap);
  console.log(`  ${mediaMap.size} unique media files referenced`);

  // === 2. upload each, build prod-id → local-id map
  console.log('\nUploading media to local Strapi…');
  const fileIdMap = {}; // prodFileId → localFileId
  let done = 0;
  for (const [prodId, localRelPath] of mediaMap) {
    try {
      const localId = await uploadOne(localRelPath);
      fileIdMap[prodId] = localId;
    } catch (e) {
      console.warn(`\n  ! ${e.message}`);
      fileIdMap[prodId] = null;
    }
    done += 1;
    process.stdout.write(`  ${done}/${mediaMap.size} uploaded\r`);
  }
  console.log('');

  // === 3. create logo entries
  console.log('\nCreating logo entries…');
  let created = 0;
  let failed = 0;
  for (const logo of logos) {
    const rewritten = rewriteMedia(logo, fileIdMap);
    const cleaned = stripReadOnly(rewritten);
    try {
      await createLogo(cleaned);
      created += 1;
      process.stdout.write(`  ${created}/${logos.length} created\r`);
    } catch (e) {
      failed += 1;
      console.warn(`\n  ! ${e.message}`);
    }
  }
  console.log('');
  console.log(`\nDone. Created ${created}/${logos.length} logos. Failed: ${failed}.`);
}

main().catch(e => { console.error(e); process.exit(1); });
