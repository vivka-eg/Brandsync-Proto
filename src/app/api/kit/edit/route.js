import { getPool, resolveUserId, userVisibleOrgIds } from '@/lib/db';
import { normalizeImages, userContentWithImages } from '@/lib/images';

// POST /api/kit/edit  { orgId, userEmail, name, instruction }
//
// Prompt-edit a single kit component. A component is small (its CSS + a little
// markup per variant), so we re-emit the whole thing in one cheap Anthropic
// call rather than the scoped-patch machinery /api/generate uses for big
// multi-view patterns. The result is saved as a DRAFT override
// (approved=false, created_by=caller) — visible to its author immediately,
// applied to the team kit only after an admin approves via /api/kit/override.
//
// Source of the "current" component: an existing visible override row if one
// exists, otherwise the Strapi base component. Brand discipline (only --bs-*
// tokens / .bs-* classes) is prompt-enforced and lint-warned on the way out.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = 'claude-sonnet-4-6';

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

// Load the base component (css + variants) straight from Strapi.
async function loadBaseComponent(origin, name) {
  const res = await fetch(`${origin}/api/components?name=${encodeURIComponent(name)}`);
  if (!res.ok) return null;
  const detail = await res.json();
  const examples = [];
  JSON.stringify(detail, (k, v) => {
    if (k === 'CodeExamples' && Array.isArray(v)) examples.push(...v);
    return v;
  });
  const htmlExamples = examples.filter((e) => (e.Framework || '').toUpperCase() === 'HTML' && e.Code);
  if (!htmlExamples.length) return null;
  const cssParts = [];
  const variants = [];
  const seen = new Set();
  for (const ex of htmlExamples) {
    const { css, html } = splitCode(ex.Code);
    if (css && !seen.has(css)) { seen.add(css); cssParts.push(css); }
    variants.push({ variant: ex.Variant || ex.Group || 'default', html });
  }
  return { css: cssParts.join('\n'), variants };
}

// Parse the model's line-delimited reply. We deliberately AVOID JSON here:
// packing full HTML + CSS into JSON string values is fragile (unescaped
// quotes / newlines break JSON.parse). Instead the model emits plain blocks:
//   SUMMARY: <line>
//   ###CSS
//   <css…>
//   ###VARIANT <name>
//   <html…>   (repeated)
// Markers are matched only at line-start, so @media / nested markup are safe.
function parseBlocks(text) {
  const lines = String(text).replace(/```[a-z]*\n?/gi, '').split(/\r?\n/);
  let summary = null;
  const sections = [];
  let cur = null;
  for (const line of lines) {
    if (!cur && /^\s*SUMMARY:/i.test(line)) { summary = line.replace(/^\s*SUMMARY:/i, '').trim(); continue; }
    if (/^\s*###\s*CSS\s*$/i.test(line)) { cur = { type: 'css', lines: [] }; sections.push(cur); continue; }
    const mV = line.match(/^\s*###\s*VARIANT\s+(.+?)\s*$/i);
    if (mV) { cur = { type: 'variant', name: mV[1].trim().replace(/^["']|["']$/g, ''), lines: [] }; sections.push(cur); continue; }
    if (cur) cur.lines.push(line);
  }
  const cssSec = sections.find((s) => s.type === 'css');
  const css = cssSec ? cssSec.lines.join('\n').trim() : '';
  const variants = sections
    .filter((s) => s.type === 'variant')
    .map((s) => ({ variant: s.name || 'default', html: s.lines.join('\n').trim() }))
    .filter((v) => v.html);
  return { summary, css, variants };
}

// Flag raw hex / px that should probably be a --bs-* token. Non-blocking.
function brandLint(css) {
  const warnings = [];
  const hex = [...String(css).matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0]);
  if (hex.length) warnings.push(`Hard-coded colors instead of --bs-* tokens: ${[...new Set(hex)].slice(0, 6).join(', ')}`);
  const px = [...String(css).matchAll(/\b\d+px\b/g)].map((m) => m[0]);
  if (px.length > 2) warnings.push(`${px.length} raw px values — prefer --bs-spacing-* / --bs-radius-* tokens where they exist`);
  return warnings;
}

async function callAnthropic({ apiKey, system, userText, images }) {
  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: userContentWithImages(userText, images) }],
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Anthropic ${res.status}: ${t.slice(0, 400)}`);
  }
  return res.json();
}

const SYSTEM = [
  'You edit ONE UI component for the Brandsync design system.',
  'Output PLAIN TEXT in EXACTLY this block format — no JSON, no markdown code fences, nothing else:',
  '',
  'SUMMARY: <one short line describing the change>',
  '###CSS',
  '<the full updated CSS for this component>',
  '###VARIANT <variant name>',
  '<the full HTML markup for that variant>',
  '###VARIANT <next variant name>',
  '<its full HTML markup>',
  '',
  '(Emit one ###VARIANT block per variant. The ###CSS and ###VARIANT markers MUST each start a new line.)',
  'Hard rules:',
  '  • Style EXCLUSIVELY with CSS custom properties named --bs-* and class names prefixed "bs-". Never hard-code hex colors; never use raw px where a --bs-* token fits (spacing, radius, font-size).',
  '  • Keep the SAME variant names you were given unless the instruction explicitly adds/removes one.',
  '  • Return the COMPLETE component (full css + every variant), not a diff. Markup stays minimal and semantic.',
  '  • Apply ONLY the requested change; leave everything else identical.',
  '  • If a reference image is attached, use it as visual guidance for the change — but still express everything with --bs-* tokens and bs-* classes; do not hard-code values to pixel-match the image.',
].join('\n');

export async function POST(request) {
  if (!process.env.DATABASE_URL) return Response.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
  const apiKey = process.env.CLAUDE_API_KEY?.replace(/[^\x20-\x7E]/g, '').trim();
  if (!apiKey) return Response.json({ error: 'CLAUDE_API_KEY not configured on the server' }, { status: 500 });

  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'invalid JSON' }, { status: 400 }); }
  const { orgId, userEmail, name, instruction } = body ?? {};
  if (!userEmail || !name || !instruction) {
    return Response.json({ error: 'userEmail, name and instruction required' }, { status: 400 });
  }
  // Optional reference image(s): "make it look like this".
  const images = normalizeImages(body?.images);
  if (images.error) return Response.json({ error: images.error }, { status: 400 });

  const origin = new URL(request.url).origin;
  const client = getPool();
  try {
    const userId = await resolveUserId(client, userEmail);
    if (!userId) return Response.json({ error: 'no such user' }, { status: 404 });
    const visible = await userVisibleOrgIds(client, userId);
    if (!orgId || !visible.includes(orgId)) {
      return Response.json({ error: 'org not accessible' }, { status: 403 });
    }

    // Current state: a visible override row wins; else the Strapi base.
    const existing = (await client.query(
      `SELECT action, css, variants FROM kit_overrides
        WHERE org_id = $1 AND name = $2 AND (approved = true OR created_by = $3)`,
      [orgId, name, userId],
    )).rows[0];

    let current, action;
    if (existing && existing.action !== 'disable') {
      current = { css: existing.css || '', variants: Array.isArray(existing.variants) ? existing.variants : [] };
      action = existing.action; // editing an 'add' keeps it an add
    } else {
      current = await loadBaseComponent(origin, name);
      action = 'override';
      if (!current) return Response.json({ error: `no base component named "${name}"` }, { status: 404 });
    }

    // Present the current component in the SAME block format we ask for back,
    // so the model mirrors the shape.
    const userText = [
      `Component: ${name}`,
      '###CSS',
      current.css || '(none)',
      ...current.variants.flatMap((v) => [`###VARIANT ${v.variant || 'default'}`, v.html || '']),
      '',
      `Change to apply: ${instruction}`,
    ].join('\n');

    const json = await callAnthropic({ apiKey, system: SYSTEM, userText, images: images.list });
    const text = (json.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');
    const env = parseBlocks(text);
    if (!env.css && !env.variants.length) {
      throw new Error('could not parse model reply (no CSS or variant blocks found)');
    }
    // If the model returned only one half, keep the current other half rather
    // than wiping it (e.g. a pure-markup change shouldn't clear the CSS).
    const finalCss = env.css || current.css || '';
    const variants = (env.variants.length ? env.variants : current.variants)
      .filter((v) => v && typeof v.html === 'string')
      .map((v) => ({ variant: v.variant || 'default', html: v.html }));
    if (!variants.length) throw new Error('model returned no variants');
    const classes = [...new Set(variants.flatMap((v) => classesIn(v.html)))];
    const warnings = brandLint(finalCss);

    // Upsert the draft (editing resets approval — re-approval required).
    const saved = (await client.query(
      `INSERT INTO kit_overrides (org_id, name, action, css, variants, classes, approved, created_by, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, false, $7, now())
       ON CONFLICT (org_id, name) DO UPDATE
         SET action = EXCLUDED.action, css = EXCLUDED.css, variants = EXCLUDED.variants,
             classes = EXCLUDED.classes, approved = false, created_by = EXCLUDED.created_by, updated_at = now()
       RETURNING id, name, action, approved`,
      [orgId, name, action, finalCss, JSON.stringify(variants), classes, userId],
    )).rows[0];

    return Response.json({
      ok: true,
      summary: env.summary ?? null,
      warnings,
      component: { id: saved.id, name, action: saved.action, approved: saved.approved, css: finalCss, variants, classes },
      usage: json.usage ?? null,
    });
  } catch (err) {
    console.error('[api/kit/edit] error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}
