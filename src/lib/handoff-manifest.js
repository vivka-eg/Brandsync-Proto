// Design handoff manifest — the declarative, versioned JSON a PM hands to
// developers. It is NOT rendered HTML: it carries a bill of materials (which
// corpus components/patterns/tokens the prototype uses, snapshotted BY VALUE)
// plus the UI decisions (features, views, composition, flows). A developer's
// coding agent loads it via the MCP and regenerates production code against the
// same corpus. The `version` heads the document — it is the build coordinate.
//
// Dependency-free on purpose so it can be imported by route code and, if needed,
// mirrored on the MCP server. The MCP stores the manifest opaquely as JSON.

export const MANIFEST_SCHEMA_VERSION = 'handoff/1';

/**
 * @typedef {Object} HandoffManifest
 * @property {string} version        MAJOR.MINOR content version (head = latest)
 * @property {string} schemaVersion  manifest FORMAT version, e.g. "handoff/1"
 * @property {Object} head           { name, ticket, status, createdBy, createdAt, projectId, orgId, sourcePatternIds[], model }
 * @property {Object} corpus         bill of materials, snapshotted by value: { components[], patterns[], tokens }
 * @property {Object} body           { features[], views[], flows[], data[] }
 */

/**
 * Schema description handed to the model so it emits a valid `body`. The route
 * fills in `head` and `corpus` (the BOM is resolved by value server-side); the
 * model only authors the design decisions in `body`.
 */
export const MANIFEST_SCHEMA_TEXT = `Emit a single JSON object describing the design intent of the prototype. Output JSON ONLY — no prose, no code fences. Shape:
{
  "features": [            // distinct capabilities the prototype delivers
    { "id": "f1", "intent": "<what the user can do>", "acceptance": ["<testable criterion>", ...] }
  ],
  "views": [               // each screen/view in the prototype
    { "id": "v-...", "name": "<view name>", "route": "<url path or ''>",
      "layout": "<short layout description, e.g. 'sidebar + content grid'>",
      "composition": [     // the building blocks used in this view
        { "ref": "<component name as used from the corpus, e.g. 'Buttons'>",
          "role": "<purpose in this view, e.g. 'primary-cta'>",
          "variant": "<class/variant if relevant, e.g. 'bs-btn-tonal' or ''>",
          "content": "<visible text/label or short content note>",
          "tokens": ["--bs-color-...", ...] }
      ],
      "featureRefs": ["f1", ...] }
  ],
  "flows": [               // navigation / state transitions between views
    { "id": "flow-...", "from": "<view id>", "trigger": "<user action>", "to": "<view id>", "effect": "<what happens>" }
  ],
  "data": [                // data entities the views read/write
    { "entity": "<name>", "fields": ["<field>", ...] }
  ]
}
Rules: reference components by the name they appear under in the corpus/kit. Keep it declarative — describe WHAT to build and which corpus pieces to use, never raw HTML/CSS. Every view's composition[].ref should name a real component. Omit empty arrays' items rather than inventing.`;

// Two-part MAJOR.MINOR versions: major (whole number) bumps on breaking changes,
// minor (the decimal) increments on every other change — e.g. 1.0 → 1.1 → 1.24 → 2.0.
const VERSION_RE = /^(\d+)\.(\d+)$/;

export function isVersion(v) {
  return VERSION_RE.test(String(v ?? '').trim());
}

/** Bump a MAJOR.MINOR version. level ∈ 'major' | 'minor' (default 'minor'). */
export function bumpVersion(prev, level = 'minor') {
  const m = VERSION_RE.exec(String(prev ?? '').trim());
  const [maj, min] = m ? [Number(m[1]), Number(m[2])] : [1, 0];
  if (level === 'major') return `${maj + 1}.0`;
  return `${maj}.${min + 1}`;
}

/**
 * Validate a full manifest object before persisting. Returns { ok, errors[] }.
 * Lenient on optional fields; strict on the structural contract.
 */
export function validateManifest(manifest) {
  const errors = [];
  const m = manifest;
  if (!m || typeof m !== 'object') return { ok: false, errors: ['manifest is not an object'] };

  if (!isVersion(m.version)) errors.push('version must be MAJOR.MINOR (e.g. 1.24)');
  if (m.schemaVersion !== MANIFEST_SCHEMA_VERSION) errors.push(`schemaVersion must be "${MANIFEST_SCHEMA_VERSION}"`);

  if (!m.head || typeof m.head !== 'object') errors.push('head is required');
  else {
    if (!m.head.name) errors.push('head.name is required');
    if (!m.head.ticket) errors.push('head.ticket is required');
  }

  if (!m.corpus || typeof m.corpus !== 'object') errors.push('corpus is required');
  else {
    if (!Array.isArray(m.corpus.components)) errors.push('corpus.components must be an array');
    if (!Array.isArray(m.corpus.patterns)) errors.push('corpus.patterns must be an array');
    if (!m.corpus.tokens || typeof m.corpus.tokens !== 'object') errors.push('corpus.tokens must be an object');
  }

  if (!m.body || typeof m.body !== 'object') errors.push('body is required');
  else {
    for (const key of ['features', 'views', 'flows', 'data']) {
      if (!Array.isArray(m.body[key])) errors.push(`body.${key} must be an array`);
    }
    if (Array.isArray(m.body.views)) {
      m.body.views.forEach((v, i) => {
        if (!v || typeof v !== 'object') { errors.push(`body.views[${i}] is not an object`); return; }
        if (!Array.isArray(v.composition)) errors.push(`body.views[${i}].composition must be an array`);
      });
    }
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Assemble a complete manifest from the model-authored body + the route-resolved
 * head and corpus snapshot. Pure — callers stamp createdAt/version.
 */
export function buildManifest({ version, head, corpus, body }) {
  return {
    version,
    schemaVersion: MANIFEST_SCHEMA_VERSION,
    head,
    corpus,
    body: {
      features: Array.isArray(body?.features) ? body.features : [],
      views: Array.isArray(body?.views) ? body.views : [],
      flows: Array.isArray(body?.flows) ? body.flows : [],
      data: Array.isArray(body?.data) ? body.data : [],
    },
  };
}
