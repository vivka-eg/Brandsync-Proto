// The brand "component kit": a base set assembled from the Strapi component
// library (each component ships HTML + a <style> of .bs-* classes built on
// tokens), MERGED with an org's own overrides. We combine all component CSS
// into one stylesheet and build a compact catalog (name + class list) so
// pattern generation can COMPOSE from these classes instead of re-defining
// them every time.
//
//   GET /api/kit?orgId=&userEmail=  → { css, catalog, componentCount, variantCount }
//   GET /api/kit?css=1&orgId=        → the raw kit stylesheet (text/css) for previews
//
// Org-awareness (Phase 2): the Strapi BASE is expensive to assemble, so it's
// cached in-memory (~10 min). Overrides are a cheap per-request DB read and
// are merged fresh, so an edit shows up immediately. An override can:
//   • action='override' — replace a base component's css + variants (rebrand)
//   • action='add'      — introduce a brand-new component
//   • action='disable'  — hide a base component from this org's kit
// Only APPROVED overrides apply to everyone; a caller sees their own pending
// overrides too (so the editor previews unapproved edits), via userEmail.

import { getPool, resolveUserId } from '@/lib/db';
import { replaceEmojisWithPhosphor } from '@/lib/icons';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Components the kit sources from the MCP corpus (corpus/components/<slug>.html)
// rather than Strapi — the corpus version is the authoritative, fully-tokenized
// one. Navigation Drawer is a full app shell (drawer + header).
const CORPUS_BASE = {
  'Navigation Drawer': 'navigation-drawer',
};

let BASE_CACHE = null; // { at, data } — the Strapi-derived base kit only
const TTL_MS = 10 * 60 * 1000;

// Split a Strapi CodeExample "Code" into its <style> CSS and the HTML.
function splitCode(code) {
  const css = [...String(code).matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n');
  const html = String(code)
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();
  return { css, html };
}
function classesIn(html) {
  const set = new Set();
  for (const m of String(html).matchAll(/class="([^"]+)"/g)) {
    for (const c of m[1].split(/\s+/)) if (c.startsWith('bs-')) set.add(c);
  }
  return [...set];
}

// Assemble the BASE kit from Strapi. Each catalog entry keeps its own css so
// the merge step can drop/replace a single component cleanly.
async function assembleBase(origin) {
  const listRes = await fetch(`${origin}/api/components`);
  const listJson = await listRes.json();
  const list = Array.isArray(listJson) ? listJson : (listJson.data || []);
  const names = list.map((c) => c.title || c.name).filter(Boolean);

  const components = []; // { name, css, classes, variants }
  await Promise.all(names.map(async (name) => {
    try {
      const res = await fetch(`${origin}/api/components?name=${encodeURIComponent(name)}`);
      const detail = await res.json();
      const examples = [];
      JSON.stringify(detail, (k, v) => {
        if (k === 'CodeExamples' && Array.isArray(v)) examples.push(...v);
        return v;
      });
      const htmlExamples = examples.filter((e) => (e.Framework || '').toUpperCase() === 'HTML' && e.Code);
      if (!htmlExamples.length) return;

      const classes = new Set();
      const variants = [];
      const cssParts = [];
      const seen = new Set();
      for (const ex of htmlExamples) {
        const { css, html } = splitCode(ex.Code);
        if (css && !seen.has(css)) { seen.add(css); cssParts.push(css); }
        classesIn(html).forEach((c) => classes.add(c));
        variants.push({ variant: ex.Variant || ex.Group || 'default', html });
      }
      components.push({
        name,
        css: cssParts.length ? `/* ${name} */\n${cssParts.join('\n')}` : '',
        classes: [...classes],
        variants,
      });
    } catch { /* skip a component that fails to load */ }
  }));

  // Replace the Strapi version of any CORPUS_BASE component with the corpus
  // app-shell (emoji icons swapped to Phosphor so the stored kit html is
  // native). A corpus fetch that fails leaves the Strapi version in place.
  await Promise.all(Object.entries(CORPUS_BASE).map(async ([name, slug]) => {
    try {
      const res = await fetch(`${origin}/api/corpus-component?slug=${encodeURIComponent(slug)}`);
      if (!res.ok) return;
      const { html: raw } = await res.json();
      const { css, html } = splitCode(raw);
      const swapped = replaceEmojisWithPhosphor(html);
      const comp = {
        name,
        css: css ? `/* ${name} (corpus) */\n${css}` : '',
        classes: classesIn(swapped),
        variants: [{ variant: 'App shell', html: swapped }],
      };
      const i = components.findIndex((c) => c.name === name);
      if (i >= 0) components[i] = comp; else components.push(comp);
    } catch { /* keep the Strapi version on failure */ }
  }));

  components.sort((a, b) => a.name.localeCompare(b.name));
  return components;
}

// An override row → the same { name, css, classes, variants } shape, plus
// metadata so the UI can badge drafts / approved overrides and gate actions.
function overrideToComponent(row) {
  const variants = Array.isArray(row.variants) ? row.variants : [];
  const classes = row.classes && row.classes.length
    ? row.classes
    : [...new Set(variants.flatMap((v) => classesIn(v.html || '')))];
  return {
    name: row.name,
    css: row.css ? `/* ${row.name} (override) */\n${row.css}` : '',
    classes,
    variants,
    source: row.action === 'add' ? 'add' : 'override',
    approved: row.approved,
    pending: !row.approved,
  };
}

// Fetch the org's applicable overrides: approved ones (team-wide) plus the
// caller's own pending edits when userEmail is supplied (so the editor can
// preview before approval).
async function fetchOverrides(orgId, userEmail) {
  if (!orgId || !process.env.DATABASE_URL) return [];
  const client = getPool();
  const userId = userEmail ? await resolveUserId(client, userEmail) : null;
  const { rows } = await client.query(
    `SELECT name, action, css, variants, classes, approved, created_by
       FROM kit_overrides
      WHERE org_id = $1 AND (approved = true OR created_by = $2)`,
    [orgId, userId],
  );
  return rows;
}

// Merge base + overrides into the final kit shape the catalog/css expose.
function merge(baseComponents, overrideRows) {
  const byName = new Map(baseComponents.map((c) => [c.name, c]));
  for (const row of overrideRows) {
    if (row.action === 'disable') { byName.delete(row.name); continue; }
    byName.set(row.name, overrideToComponent(row)); // override or add
  }
  const components = [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
  const css = components.map((c) => c.css).filter(Boolean).join('\n\n');
  const catalog = components.map((c) => ({
    name: c.name, classes: c.classes, variants: c.variants,
    source: c.source ?? 'base', approved: c.approved ?? true, pending: c.pending ?? false,
  }));
  const variantCount = components.reduce((n, c) => n + (c.variants?.length || 0), 0);
  return { css, catalog, componentCount: catalog.length, variantCount };
}

export async function GET(request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const orgId = url.searchParams.get('orgId');
  const userEmail = url.searchParams.get('userEmail');
  try {
    if (!BASE_CACHE || Date.now() - BASE_CACHE.at > TTL_MS) {
      BASE_CACHE = { at: Date.now(), data: await assembleBase(origin) };
    }
    const overrides = await fetchOverrides(orgId, userEmail);
    const data = merge(BASE_CACHE.data, overrides);

    if (url.searchParams.get('css') === '1') {
      return new Response(data.css, { headers: { 'Content-Type': 'text/css' } });
    }
    return Response.json({ ...data, overrideCount: overrides.length });
  } catch (err) {
    console.error('[api/kit] assemble error:', err);
    return Response.json({ error: err.message ?? 'unknown error', css: '', catalog: [] }, { status: 500 });
  }
}
