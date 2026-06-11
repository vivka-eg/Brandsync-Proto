// Scoped-patch merging for Brandsync Make's /api/generate.
//
// When the LLM finishes a turn it returns an envelope describing WHAT
// changed, not the whole file. The server uses applyScopedPatch to
// fold those changes into the pattern's existing markdown.
//
// Why: re-emitting the full pattern (~13k tokens for a multi-view file)
// on every edit is wasteful — the model regenerates 10k tokens of
// unchanged content. Scoped patches cut output cost ~75% on edits
// without compromising the result: the model still generates the same
// markup for the section it's modifying, the unchanged sections are
// preserved BIT FOR BIT because we never regenerate them.
//
// Envelope shapes:
//
//   { scope: "full", html, css, js? }
//      → returns a fresh markdown with the three fenced blocks.
//        Used for: first creation of a pattern, refactors that span
//        sections, anything where the model isn't confident it can
//        narrow the scope.
//
//   { scope: "section:<view>", html, cssAppend? }
//      → finds <section data-view="<view>">…</section> in the existing
//        html block, replaces it. Appends cssAppend to the css block.
//        If the section doesn't exist yet (new view being added),
//        inserts before </main>.
//        html MUST start with <section data-view="<view>"> matching
//        the scope's view name.
//
//   { scope: "css-only", cssAppend }
//      → just appends new CSS rules. Used for: tweaks that only touch
//        styling ("make buttons green"). Does not touch html.
//
//   { scope: "edit", edits: [{block, find, replace}, …] }
//      → element-level find/replace, modeled on Claude Code's Edit
//        tool. Each entry targets one of the existing fenced blocks
//        (block ∈ "html" | "css" | "js"); the `find` string MUST
//        appear exactly once in that block so the replacement is
//        unambiguous. Use this for "rename a label", "change a class
//        name", "swap one element for another" — the cheapest scope,
//        ~30-50× lower output cost than scope=section.
//
// Validation: the caller can fall back to scope="full" + retry if the
// envelope fails structural checks. The merger never returns invalid
// content — either a clean merged markdown or it throws.

const HTML_BLOCK_RE = /```html\n([\s\S]*?)```/;
const CSS_BLOCK_RE  = /```css\n([\s\S]*?)```/;
const JS_BLOCK_RE   = /```(?:js|javascript)\n([\s\S]*?)```/;

export class PatchError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code; // 'invalid_envelope' | 'section_not_found' | 'parse_failure'
  }
}

// Stitch an html/css(/js) trio back into the markdown shape patterns use.
function renderMarkdown({ html, css, js }) {
  let out = '```html\n' + html.trim() + '\n```';
  if (css?.trim()) out += '\n\n```css\n' + css.trim() + '\n```';
  if (js?.trim())  out += '\n\n```js\n' + js.trim() + '\n```';
  return out + '\n';
}

function parseMarkdown(content) {
  return {
    html: content.match(HTML_BLOCK_RE)?.[1] ?? '',
    css:  content.match(CSS_BLOCK_RE)?.[1]  ?? '',
    js:   content.match(JS_BLOCK_RE)?.[1]   ?? '',
  };
}

// Find the data-view="X" section in html. Returns { start, end, full } or null.
// We can't use a lazy regex like `[\s\S]*?</section>` because the view's body
// often contains nested <section> elements (cards, panels). A lazy match would
// close on the first inner </section>, leaving the rest of the view orphaned
// outside any data-view boundary — which the view-switching JS can't hide.
// Instead, scan tag-by-tag and track open/close depth.
function findViewSection(html, view) {
  const escaped = view.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const openRe = new RegExp(
    `<section\\b[^>]*\\bdata-view="${escaped}"[^>]*>`,
    'i',
  );
  const m = openRe.exec(html);
  if (!m) return null;
  const start = m.index;
  const bodyStart = m.index + m[0].length;

  const tagRe = /<section\b[^>]*>|<\/section>/gi;
  tagRe.lastIndex = bodyStart;
  let depth = 1;
  let tag;
  while ((tag = tagRe.exec(html)) !== null) {
    if (tag[0][1] === '/') depth--; else depth++;
    if (depth === 0) {
      const end = tag.index + tag[0].length;
      return { start, end, full: html.slice(start, end) };
    }
  }
  return null;
}

function validateEnvelope(env) {
  if (!env || typeof env !== 'object') {
    throw new PatchError('envelope must be an object', 'invalid_envelope');
  }
  const { scope } = env;
  if (typeof scope !== 'string') {
    throw new PatchError('envelope.scope must be a string', 'invalid_envelope');
  }
  if (scope === 'full') {
    if (typeof env.html !== 'string' || !env.html.trim()) {
      throw new PatchError('scope=full requires non-empty html', 'invalid_envelope');
    }
    return { kind: 'full' };
  }
  if (scope === 'css-only') {
    if (typeof env.cssAppend !== 'string' || !env.cssAppend.trim()) {
      throw new PatchError('scope=css-only requires non-empty cssAppend', 'invalid_envelope');
    }
    return { kind: 'css-only' };
  }
  if (scope === 'edit') {
    if (!Array.isArray(env.edits) || env.edits.length === 0) {
      throw new PatchError('scope=edit requires a non-empty edits array', 'invalid_envelope');
    }
    for (let i = 0; i < env.edits.length; i++) {
      const e = env.edits[i];
      if (!e || typeof e !== 'object') {
        throw new PatchError(`edits[${i}] must be an object`, 'invalid_envelope');
      }
      const block = e.block;
      if (block !== 'html' && block !== 'css' && block !== 'js') {
        throw new PatchError(`edits[${i}].block must be "html", "css", or "js"`, 'invalid_envelope');
      }
      if (typeof e.find !== 'string' || !e.find.length) {
        throw new PatchError(`edits[${i}].find must be a non-empty string`, 'invalid_envelope');
      }
      if (typeof e.replace !== 'string') {
        throw new PatchError(`edits[${i}].replace must be a string`, 'invalid_envelope');
      }
      // An identical find/replace is a no-op, not an error — the model
      // occasionally emits one. applyScopedPatch skips it silently rather
      // than failing the whole generation.
    }
    return { kind: 'edit' };
  }

  if (scope.startsWith('section:')) {
    const view = scope.slice('section:'.length);
    if (!view) {
      throw new PatchError('scope=section: requires a view name', 'invalid_envelope');
    }
    if (typeof env.html !== 'string' || !env.html.trim()) {
      throw new PatchError(`scope=section:${view} requires non-empty html`, 'invalid_envelope');
    }
    // The html MUST be a single <section data-view="<view>"> ... </section>.
    // Wrap the check in a regex to avoid surprises from leading whitespace.
    const opens = new RegExp(
      `^\\s*<section\\b[^>]*\\bdata-view="${view.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`,
      'i',
    );
    if (!opens.test(env.html)) {
      throw new PatchError(
        `scope=section:${view} html must start with <section data-view="${view}">`,
        'invalid_envelope',
      );
    }
    if (!/<\/section>\s*$/i.test(env.html)) {
      throw new PatchError(
        `scope=section:${view} html must end with </section>`,
        'invalid_envelope',
      );
    }
    return { kind: 'section', view };
  }
  throw new PatchError(`unknown scope "${scope}"`, 'invalid_envelope');
}

// Insert `block` just before the LAST closing </main> in `html`. Used when
// a section:<view> patch refers to a brand-new view (no existing section
// to replace). If no </main> exists, append.
function insertBeforeLastMainClose(html, block) {
  const lastMainClose = html.lastIndexOf('</main>');
  if (lastMainClose === -1) return html + '\n\n' + block;
  return html.slice(0, lastMainClose) + block + '\n\n    ' + html.slice(lastMainClose);
}

// Locate a scope=edit `find` snippet within `haystack`.
// Tries an exact match first (fast, and preserves the uniqueness
// guarantee). If that misses, falls back to a whitespace-tolerant match:
// every run of whitespace in `find` is treated as "one or more whitespace
// chars", so differences in indentation / line wrapping between the model's
// snippet and the stored markup don't fail the edit — the #1 cause of the
// old "find string not found" failures.
// Returns { index, length } for a unique match, or { notFound } / { ambiguous }.
function locateFind(haystack, find) {
  // 1) Exact, unique match.
  const i = haystack.indexOf(find);
  if (i !== -1) {
    return haystack.indexOf(find, i + 1) === -1
      ? { index: i, length: find.length }
      : { ambiguous: true };
  }
  // 2) Whitespace-tolerant match.
  const source = find
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // escape regex metachars
    .replace(/\s+/g, '\\s+');                // collapse whitespace runs
  let re;
  try { re = new RegExp(source, 'g'); } catch { return { notFound: true }; }
  let m, hit = null, count = 0;
  while ((m = re.exec(haystack)) !== null) {
    if (m[0].length === 0) { re.lastIndex++; continue; }
    if (++count === 1) hit = { index: m.index, length: m[0].length };
    else break;
  }
  if (count === 0) return { notFound: true };
  if (count > 1) return { ambiguous: true };
  return hit;
}

export function applyScopedPatch(existingContent, envelope) {
  const kind = validateEnvelope(envelope);

  // Full scope — bypass merging entirely.
  if (kind.kind === 'full') {
    return renderMarkdown({
      html: envelope.html,
      css:  envelope.css ?? '',
      js:   envelope.js  ?? '',
    });
  }

  const parsed = parseMarkdown(existingContent || '');
  // If the existing pattern has no html block, the only sensible fallback
  // is to refuse — section/css-only patches assume there's something to
  // patch. The caller should switch to scope=full and retry.
  if (!parsed.html) {
    throw new PatchError(
      'existing pattern has no ```html block; use scope=full for first creation',
      'parse_failure',
    );
  }

  if (kind.kind === 'edit') {
    // Apply each find/replace against its target block. We mutate a
    // local copy of the three blocks and re-stitch at the end. The
    // matches must be unique within the targeted block — the caller
    // should retry with more surrounding context if not. This is the
    // same uniqueness guarantee Claude Code's Edit tool enforces and
    // it's what keeps the model honest about anchoring its edits.
    const blocks = { html: parsed.html, css: parsed.css, js: parsed.js };
    for (let i = 0; i < envelope.edits.length; i++) {
      const e = envelope.edits[i];
      // Identical find/replace changes nothing — skip it (no-op) instead of
      // failing the whole generation.
      if (e.find === e.replace) continue;
      const haystack = blocks[e.block];
      if (typeof haystack !== 'string' || !haystack.length) {
        throw new PatchError(
          `edits[${i}] targets "${e.block}" block but that block is empty in the existing pattern`,
          'parse_failure',
        );
      }
      const loc = locateFind(haystack, e.find);
      if (loc.notFound) {
        throw new PatchError(
          `edits[${i}] find string not found in ${e.block} block`,
          'parse_failure',
        );
      }
      if (loc.ambiguous) {
        throw new PatchError(
          `edits[${i}] find string is ambiguous in ${e.block} block — appears multiple times. Add more surrounding context to make the match unique.`,
          'parse_failure',
        );
      }
      blocks[e.block] = haystack.slice(0, loc.index) + e.replace + haystack.slice(loc.index + loc.length);
    }
    return renderMarkdown({ html: blocks.html, css: blocks.css, js: blocks.js });
  }

  if (kind.kind === 'css-only') {
    const css = (parsed.css.trimEnd() + '\n\n' + envelope.cssAppend.trim() + '\n').trim();
    return renderMarkdown({ html: parsed.html, css, js: parsed.js });
  }

  // kind.kind === 'section'
  const { view } = kind;
  const found = findViewSection(parsed.html, view);
  let newHtml;
  if (found) {
    // Replace in place.
    newHtml = parsed.html.slice(0, found.start) + envelope.html.trim() + parsed.html.slice(found.end);
  } else {
    // New section — insert before the last </main>.
    newHtml = insertBeforeLastMainClose(parsed.html, envelope.html.trim());
  }

  let css = parsed.css;
  if (envelope.cssAppend && envelope.cssAppend.trim()) {
    css = (css.trimEnd() + '\n\n' + envelope.cssAppend.trim() + '\n').trim();
  }

  return renderMarkdown({ html: newHtml, css, js: parsed.js });
}
