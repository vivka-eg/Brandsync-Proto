import { getPool, resolveUserId, userOwnsProject, resolveUserOrgId, userVisibleOrgIds } from '@/lib/db';
import { applyScopedPatch, PatchError } from '@/lib/patch';
import { openSession, listAllowedTools, callTool, closeSession } from '@/lib/mcp-client';
import { normalizeImages, userContentWithImages } from '@/lib/images';

// POST /api/generate
//
// The Brandsync Make generation endpoint. Takes the user's prompt + their
// active project / file context and returns a corpus_entries row that
// either (a) was just created or (b) had its content scoped-patched in
// place. The frontend's send button (my-patterns/page.js → handleSend)
// is the only caller today.
//
// Why scoped patches: re-emitting a multi-view pattern at ~13k tokens
// every turn is wasteful. The model returns an envelope describing what
// changed (full | section:<view> | css-only) and applyScopedPatch folds
// the change into the existing markdown. Unchanged sections are preserved
// bit for bit because the merger never regenerates them.
//
// On envelope-validation failure we retry once with scope=full so a
// malformed envelope never breaks the user-visible flow — quality stays
// the same, just at the cost of an extra round trip on the rare retry.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_MODEL = 'claude-sonnet-4-6';
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
// Safety cap on the MCP tool-use loop. A runaway Claude that keeps
// calling tools without converging burns input tokens fast; this
// stops the bleeding while still giving real generations plenty of
// headroom. We observed real gens using 4–8 tools on heavy prompts
// (Funnels, multi-component layouts), so 16 leaves comfortable
// margin without being so high that a runaway costs serious money.
const MAX_TOOL_USE_ITERATIONS = 16;

// Cap how much of a sibling pattern we include as "design system context"
// to keep input tokens predictable when a project has many files.
const SIBLING_CONTEXT_CHAR_BUDGET = 4000;
const MAX_SIBLINGS = 6;

// ──────────────────────────────────────────────────────────────────────
// Slug derivation. Used only when creating a brand-new pattern. We take
// the first few prompt words, kebab-case them, and add a short random
// suffix so concurrent generations don't collide on the corpus_entries
// (slug) unique constraint.
// ──────────────────────────────────────────────────────────────────────
const SLUG_STOP = new Set([
  'a', 'an', 'the', 'to', 'of', 'for', 'and', 'or', 'with', 'in', 'on', 'my', 'our', 'me',
  'please', 'can', 'you', 'create', 'make', 'build', 'design', 'generate', 'add', 'new',
  'give', 'want', 'need', 'using', 'use',
]);
function deriveSlug(prompt) {
  const words = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  // Drop filler/imperative words so the slug core is meaningful
  // ("create a dashboard" → "dashboard", not "create-a-dashboard").
  const meaningful = words.filter(w => !SLUG_STOP.has(w));
  const base = (meaningful.length ? meaningful : words)
    .slice(0, 4)
    .join('-')
    .replace(/-+/g, '-')
    .slice(0, 50) || 'pattern';
  // Short random suffix keeps concurrent generations from colliding on the
  // (slug, type, org, user) unique key; the UI hides it via prettifyName().
  const suffix = Math.random().toString(36).slice(2, 7);
  return `${base}-${suffix}`;
}

// ──────────────────────────────────────────────────────────────────────
// System prompt. Three jobs:
//   1. Tell the model what shape to return (envelope JSON).
//   2. Give it the existing content when editing — so section/css-only
//      patches are grounded in what's actually there.
//   3. Surface the brand context (palette, theme, sibling patterns) so
//      the model uses the team's design tokens instead of inventing
//      generic styles.
// ──────────────────────────────────────────────────────────────────────
function buildSystemPrompt({
  existingContent,
  editingSlug,
  brandPalette,
  theme,
  selectedLogoName,
  siblingContext,
  kitCatalog,
}) {
  const mcpAvailable = !!(process.env.MCP_SERVER_URL && process.env.MCP_SERVICE_TOKEN);

  const lines = [
    'You are Brandsync Make, an in-house AI that generates HTML+CSS UI patterns for EG\'s teams using their internal design system.',
    '',
  ];

  if (mcpAvailable) {
    lines.push(
      '## Design system access (Brandsync MCP)',
      'You have tool access to the Brandsync MCP server — the authoritative source for EG\'s design system. The "JSON only" rule below applies to your FINAL text response; tool calls happen BEFORE that final response and are expected. A typical turn looks like:',
      '  1. (optional but encouraged) one or more tool_use blocks to look up components / patterns / tokens',
      '  2. the final assistant turn contains a single text block with the JSON envelope',
      '',
      'Available tools:',
      '  • list_components() — enumerate available components when you don\'t know the exact name.',
      '  • get_component(component) — fetch a single component\'s markup, class names, and usage rules. Pass include_html=true only on the final lookup before generating code; omit during discovery.',
      '  • get_pattern(name) — fetch a full reference pattern\'s HTML/CSS by slug or name.',
      '  • search_guidelines(query) — discover patterns/components by topic when the right name isn\'t obvious.',
      '  • get_tokens(filter?) — fetch design tokens (colors, spacing, typography, radii). Filter by category prefix.',
      '',
      'When to call tools (DO NOT skip these):',
      '  • The user names a specific component (Button, Input, Card, etc.) → call get_component for each one with include_html=true.',
      '  • The user names a specific pattern (dashboard, pricing page, sign-in screen) → call search_guidelines or get_pattern first.',
      '  • You need a color/spacing/typography value → call get_tokens before inventing hex codes.',
      'Inventing class names or styles that don\'t exist in the design system is the failure mode this prompt is designed to prevent.',
      '',
    );
  }

  lines.push(
    'You ALWAYS reply with a single JSON object (no markdown fences, no prose) matching one of these envelope shapes:',
    '',
    '  { "summary": "...", "scope": "full", "html": "...", "css": "...", "js": "..." (optional) }',
    '    — Use this for a brand-new pattern, a sweeping refactor, or when you cannot confidently narrow the change to a single section.',
    '',
    '  { "summary": "...", "scope": "section:<view>", "html": "<section data-view=\\"<view>\\">...</section>", "cssAppend": "..." (optional) }',
    '    — Use this when the change is confined to one view of an existing multi-view pattern. The html MUST start with <section data-view="<view>"> and end with </section>, matching exactly the view name in the scope.',
    '',
    '  { "summary": "...", "scope": "css-only", "cssAppend": "..." }',
    '    — Use this for pure styling tweaks (colors, spacing, typography) that need no html change.',
    '',
    '  { "summary": "...", "scope": "edit", "edits": [{ "block": "html"|"css"|"js", "find": "<exact existing text>", "replace": "<new text>" }, ...] }',
    '    — Use this for localized changes (rename a label, swap a class, change a single value, add/remove a list item). Each edit\'s `find` MUST appear verbatim and EXACTLY ONCE in the target block of the existing pattern — copy the snippet character-for-character including whitespace. If your target appears multiple times, include enough surrounding context to make the match unique. This is the cheapest scope by ~30-50× vs section/full, so prefer it whenever the change is small and pinpointed.',
    '',
    '  { "summary": "...", "scope": "chat" }',
    '    — Use this when the user is asking a question, clarifying intent, or saying something that is NOT a request to change the pattern. Examples: "what can you do?", "can you access X?", "are you connected to the MCP?", "thanks", "explain why you chose flexbox here". The pattern is NOT modified — the entire response is just the summary, which becomes the assistant\'s chat message. Never use chat as a way to avoid a real request — only use it when there genuinely is no UI change to make.',
    '',
    'Hard rules:',
    '  • Output JSON ONLY. No leading text, no trailing text, no code fences.',
    '  • summary is REQUIRED on every envelope. For UI changes: 1–2 sentences addressed to the PM about what you did ("Added a logout button to the header"). For chat: this is your full reply — answer the question directly and warmly, can be longer (3–5 sentences) since this IS the response.',
    '  • For scope=full, the html block is what will be wrapped in ```html ... ``` and stored. Do not include the fences yourself.',
    '  • For css-only and section: patches, only the existing CSS file is appended to — never reset it.',
    '  • Prefer the narrowest scope that completes the user\'s request faithfully. If the user is NOT asking for a change, use scope=chat — never modify the pattern as a side effect of a question.',
    '  • Editing rule of thumb (cost-ordered, cheapest first):',
    '       — scope=edit:        the change is localized to specific element(s), text, attribute(s), or value(s). Example: rename a button, change one color value, swap an icon, add/remove a list item. ALMOST EVERY EDIT PROMPT FROM A PM FITS HERE.',
    '       — scope=css-only:    pure styling tweak that needs no html change AND can\'t be expressed as a small find/replace.',
    '       — scope=section:<v>: an entire view of a multi-view pattern is being rewritten or a new view is being added.',
    '       — scope=full:        the change spans 3+ sections, restructures the layout, or replaces the entire pattern.',
    '     Re-emitting the whole pattern on a "make this button blue" edit is a 30-50× billing waste. Prefer scope=edit aggressively; the merger will fail loud if your `find` is ambiguous and we\'ll retry up a level.',
    '  • Style with the design system\'s CSS variables when the brand context lists them. Do not invent hex colors when a token covers the role.',
    '  • CRITICAL: Use `--bs-*` Brandsync variables DIRECTLY. NEVER invent your own variable namespace (no `--db-*`, `--sdb-*`, `--app-*`, `--tracker-*`, `--db-sidebar-*`, etc.). If a token doesn\'t exist for the role you need, use a literal value as a last resort and add a `/* TODO: needs a brand token */` comment — but inventing variables that just wrap brand tokens (or worse, that are undefined) fragments the design system, bloats output, and breaks consistency with other patterns in the corpus. Every `--<something>-*` you write must either be a real `--bs-*` token or a literal value.',
    '  • Status / semantic colors — Brandsync HAS tokens for these, use them directly. Do NOT invent `--success-*`, `--error-*`, `--danger-*`, `--warning-*`, `--info-*`, `--green-*`, `--red-*`, `--blue-*`, `--amber-*`, etc.',
    '       Success state:  --bs-color-success-default / --bs-color-success-container / --bs-color-success-hover / --bs-color-success-pressed',
    '       Error/danger:   --bs-color-error-default / --bs-color-error-container / --bs-color-error-hover / --bs-color-error-pressed',
    '       Warning state:  --bs-color-warning-default / --bs-color-warning-container',
    '       Info state:     --bs-color-info-default / --bs-color-info-container / --bs-color-info-hover / --bs-color-info-pressed',
    '       Neutral state:  --bs-color-neutral-default / --bs-color-neutral-hover / --bs-color-neutral-pressed / --bs-color-neutral-container (+ -hover, -pressed)',
    '       Primary brand:  --bs-color-primary-default / --bs-color-primary-hover / --bs-color-primary-pressed / --bs-color-primary-focused / --bs-color-primary-container (+ -hover)',
    '     When in doubt about a status color, call get_tokens(filter: "color") to verify the exact name BEFORE inventing one.',
  );

  if (brandPalette || theme || selectedLogoName) {
    lines.push('', '## Brand context');
    if (brandPalette) {
      lines.push('Palette:', '```json', JSON.stringify(brandPalette, null, 2), '```');
    }
    if (theme) {
      lines.push('Theme:', '```json', JSON.stringify(theme, null, 2), '```');
    }
    if (selectedLogoName) {
      lines.push(`Logo: ${selectedLogoName}`);
    }
  }

  if (kitCatalog?.length) {
    lines.push(
      '',
      '## Component kit — PRE-BUILT, already loaded (use these; do NOT restyle them)',
      'A shared component stylesheet is ALREADY linked in the preview. Every `.bs-*` class below is fully styled with the brand tokens. This is the single biggest lever on output size and consistency:',
      '  • USE these classes for their UI primitive (buttons, cards, inputs, tabs, badges, etc.) instead of hand-rolling markup+CSS.',
      '  • DO NOT emit CSS rules for these classes — they are already defined. Redefining them is wasted output AND overrides the brand kit. Never write a `.bs-btn { ... }` rule; just use `class="bs-btn bs-btn-primary"`.',
      '  • Only write CSS for page LAYOUT/glue (grid, flex containers, page-specific sections). Keep that minimal and prefer kit components inside it.',
      'Available kit components → classes:',
      '```',
      ...kitCatalog.map((c) => `${c.name}: ${(c.classes || []).join(', ')}`),
      '```',
    );
  }

  if (siblingContext?.length) {
    lines.push(
      '',
      '## Sibling patterns from this project',
      'These are the project\'s other patterns — match their styling vocabulary (class naming, spacing scale, semantic tokens) so the new work feels of-a-piece. They are reference, not content to copy verbatim.',
    );
    for (const sib of siblingContext) {
      lines.push(
        '',
        `### ${sib.slug}`,
        sib.snippet,
      );
    }
  }

  if (existingContent) {
    lines.push(
      '',
      '## Existing pattern you are editing',
      `Slug: ${editingSlug ?? '(unknown)'}`,
      'Below is the current markdown (with ```html / ```css fenced blocks). When you return a section: or css-only envelope, it will be merged into THIS content — so refer to existing class names, view names, and CSS variables.',
      '',
      existingContent,
    );
  } else {
    lines.push(
      '',
      '## Creating a new pattern',
      'Return scope=full. STRUCTURAL REQUIREMENT — read this twice:',
      '',
      'A `<section data-view="<name>">` is the SWAP-OUT CONTENT for ONE navigable destination. It is NOT a wrapper around the whole UI. The "data-view" name should match a route, a tab, a step in a wizard, or a screen the user navigates to.',
      '',
      'How many sections to emit:',
      '  • If the user describes ONE screen (sign-in card, single dashboard, empty state, modal) → one section.',
      '  • If the user describes MULTIPLE TABS, SCREENS, ROUTES, STEPS, or VIEWS the user navigates between → one section per destination. THIS IS THE COMMON CASE FOR DASHBOARDS.',
      '',
      '✅ CORRECT for "dashboard with Active, Archived, Settings tabs" (3 navigable views):',
      '  <main class="tracker">',
      '    <aside class="tracker-sidebar"> ... nav links ... </aside>',
      '    <header class="tracker-header"> ... </header>',
      '    <section data-view="active"> ...content shown when Active is selected... </section>',
      '    <section data-view="archived"> ...content shown when Archived is selected... </section>',
      '    <section data-view="settings"> ...content shown when Settings is selected... </section>',
      '  </main>',
      '',
      '❌ WRONG (this is what cost us $0.40 per edit on prior dashboards — DO NOT do this):',
      '  <main class="tracker">',
      '    <section data-view="app">',
      '      ... entire dashboard including all three tabs internally ...',
      '    </section>',
      '  </main>',
      '',
      'CRITICAL: Sidebar, header, footer, top bar — these are CHROME shared across all views, NOT data-view sections. They live as siblings of the data-view sections, inside <main>. Only the SWAP-OUT content panels get the data-view attribute.',
      '',
      'Add minimal JS or CSS to toggle which section is visible based on nav clicks (e.g. show one section, set hidden on others). The default visible section should be the first one.',
      '',
      'Also use brand-substitutable placeholders so the client can swap colors/logos per workspace:',
      '  • {{logo}} — wherever a logo image src belongs.',
      '  • {{product-name}} — wherever the product name appears as text.',
      'Avoid hardcoding external image URLs when these placeholders apply.',
      '',
      'Why this matters: future edits to this pattern will use scope=section:<view> to replace just ONE view at a time. A pattern with 5 sections has 5 cheap edit targets; a pattern with 1 section that wraps everything has zero cheap edit targets and every edit costs 5-10× more.',
    );
  }

  return lines.join('\n');
}

// Strip the most common ways a model wraps "just JSON" replies, then parse.
function parseEnvelopeText(text) {
  if (!text) throw new PatchError('empty model response', 'parse_failure');
  let trimmed = text.trim();

  // Remove ```json ... ``` or ``` ... ``` wrappers.
  const fence = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
  if (fence) trimmed = fence[1].trim();

  // Some models still emit a leading "Here is the envelope:" line. Extract
  // from the first { to the matching final }.
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace > 0 && lastBrace > firstBrace) {
    trimmed = trimmed.slice(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(trimmed);
  } catch (err) {
    throw new PatchError(`envelope is not valid JSON: ${err.message}`, 'parse_failure');
  }
}

// Build the optional `mcp_servers` parameter from env. When both URL
// and token are configured, Claude can call the Brandsync MCP's tools
// (search_guidelines, get_pattern, get_component, get_tokens, …)
// directly during generation — no proxy on our side. When either is
// missing we just don't attach the parameter and the model generates
// without MCP grounding (the original behaviour).
// Render a tool call's input as a one-liner for SSE consumers. We don't
// surface the full JSON in the UI — it's noisy — but we want the user
// to see *which* component is being fetched. For tools without a
// natural primary argument we just join keys.
function summarizeToolInput(input) {
  if (!input || typeof input !== 'object') return '';
  if (input.component) return String(input.component);
  if (input.name) return String(input.name);
  if (input.query) return String(input.query);
  if (input.filter) return String(input.filter);
  const keys = Object.keys(input);
  return keys.length ? keys.join(', ') : '';
}

// One round-trip to Anthropic. The conversation loop (below) drives
// this multiple times when tools are in play — each call appends an
// assistant turn, and tool_use blocks trigger one more pass after
// their tool_result is added by the caller.
//
// We mark the system prompt and the tools array with `cache_control:
// ephemeral`. Anthropic caches the marked prefix for ~5 minutes and
// reads it back at ~10× cheaper on subsequent calls that share the
// same prefix. Two places that benefit hugely:
//
//   1. Tool-use iterations within ONE generation. The system prompt
//      can contain a 58k-char existing pattern when editing; we send
//      that on every iteration. Cache it once, read 7× cheap.
//   2. Back-to-back generations within 5 min on the same pattern.
//
// The Anthropic API requires structured-array form to attach
// cache_control to system. Tools take cache_control on the last tool
// in the array — meaning "cache through here."
//
// Cache breakpoints used: 2 (system + tools). Anthropic allows up to
// 4 — leaving headroom for future caching of the messages history.
async function callAnthropic({ apiKey, model, system, messages, tools }) {
  const systemBlocks = system
    ? [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }]
    : undefined;

  const toolsWithCache = tools && tools.length
    ? tools.map((t, i) => (i === tools.length - 1
        ? { ...t, cache_control: { type: 'ephemeral' } }
        : t))
    : undefined;

  const requestBody = {
    model,
    // Sonnet 4.6 supports up to 64k output. We were capped at 16k
    // before, which truncated multi-section dashboard gens once the
    // system prompt started requiring per-view structure + brand
    // placeholders. Bumping to 32k leaves comfortable headroom
    // without enabling pathologically long outputs.
    max_tokens: 32000,
    messages,
  };
  if (systemBlocks) requestBody.system = systemBlocks;
  if (toolsWithCache) requestBody.tools = toolsWithCache;

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
    },
    body: JSON.stringify(requestBody),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Anthropic ${res.status}: ${errText.slice(0, 500)}`);
  }
  return res.json();
}

// Drive a full Claude exchange — including any MCP tool calls — until
// Claude returns its final text-only response (the envelope JSON).
// Returns the same shape the route's existing flow expects:
//   { text, usage, model, mcpToolCalls, toolNames }
//
// `mcpSession` is optional. When omitted, `tools` is empty and the
// function returns after one Anthropic call. When present, we loop:
//
//   1. Call Anthropic with the message history + tools list.
//   2. If the response contains tool_use blocks, run each via the MCP
//      session, append a user turn carrying the tool_results, and go
//      back to (1).
//   3. When the response is text-only, return it.
//
// Capped at MAX_TOOL_USE_ITERATIONS so a runaway tool-calling loop
// can't burn the user's token budget indefinitely.
async function runConversation({ apiKey, model, system, userPrompt, images, retryHint, mcpSession, tools, emit }) {
  const fire = typeof emit === 'function' ? emit : () => {};
  // When images are attached, the first user turn becomes a content-block
  // array (image blocks first, then the text) so Claude sees them as visual
  // reference. Without images we keep the plain-string form.
  const messages = [{ role: 'user', content: userContentWithImages(userPrompt, images) }];
  if (retryHint) {
    messages.push({
      role: 'assistant',
      content: 'I will retry with a corrected envelope.',
    });
    messages.push({
      role: 'user',
      content: `Your previous envelope was rejected: ${retryHint}. Reply again with scope="full" so the entire pattern is regenerated cleanly. JSON only.`,
    });
  }

  const totalUsage = {};
  let mcpToolCalls = 0;
  const toolNames = [];
  let finalModel = model;

  for (let iter = 0; iter < MAX_TOOL_USE_ITERATIONS; iter++) {
    // Fire BEFORE the Anthropic call so the UI shows "Thinking…"
    // while the model is generating, and `tool` events arrive after
    // each tool the model chooses to use.
    fire('phase', { phase: 'thinking', iteration: iter, toolsSoFar: mcpToolCalls });
    const json = await callAnthropic({ apiKey, model, system, messages, tools });
    if (json.usage) {
      for (const [k, v] of Object.entries(json.usage)) {
        if (typeof v === 'number') totalUsage[k] = (totalUsage[k] ?? 0) + v;
      }
    }
    if (json.model) finalModel = json.model;

    const contentBlocks = Array.isArray(json.content) ? json.content : [];
    const toolUses = contentBlocks.filter((c) => c.type === 'tool_use');

    if (toolUses.length === 0) {
      // Final text. Concatenate any text blocks (usually one) — that's
      // the envelope JSON the route parses next.
      const text = contentBlocks
        .filter((c) => c.type === 'text' && typeof c.text === 'string')
        .map((c) => c.text)
        .join('');
      return { text, usage: totalUsage, model: finalModel, mcpToolCalls, toolNames };
    }

    // Append the assistant's tool-use turn verbatim — Anthropic requires
    // tool_use blocks to be followed by tool_result blocks in the next
    // user turn, in the same conversation.
    messages.push({ role: 'assistant', content: contentBlocks });

    // Run each tool against the MCP and collect tool_result blocks.
    const toolResults = [];
    for (const t of toolUses) {
      toolNames.push(t.name);
      mcpToolCalls++;
      // Surface the in-flight tool call to the SSE stream so the UI
      // can show "Fetching Buttons…" instead of a generic spinner.
      // We pass a short summary of the input rather than the full JSON
      // to keep the event compact.
      fire('phase', {
        phase: 'tool',
        tool: t.name,
        input: summarizeToolInput(t.input),
      });
      if (!mcpSession) {
        // Tools were declared but no session available — return an
        // error so Claude tries a different approach in the next loop.
        toolResults.push({
          type: 'tool_result',
          tool_use_id: t.id,
          content: 'MCP session unavailable. Proceed without this tool.',
          is_error: true,
        });
        continue;
      }
      try {
        const result = await callTool(mcpSession, t.name, t.input ?? {});
        toolResults.push({
          type: 'tool_result',
          tool_use_id: t.id,
          content: result.text || '(empty)',
          is_error: result.isError,
        });
      } catch (err) {
        toolResults.push({
          type: 'tool_result',
          tool_use_id: t.id,
          content: `Tool error: ${err.message}`,
          is_error: true,
        });
      }
    }
    messages.push({ role: 'user', content: toolResults });
  }

  throw new Error(`exceeded ${MAX_TOOL_USE_ITERATIONS} tool-use iterations without a final response`);
}

// ──────────────────────────────────────────────────────────────────────
// Context fetchers — small, intentional. We only inject project siblings
// when the user toggled "use design system". Calling the MCP for broader
// retrieval is a follow-up; for now keep the loop fully self-contained.
// ──────────────────────────────────────────────────────────────────────
async function loadEditTarget(client, editEntryId, userId) {
  const { rows } = await client.query(
    `SELECT id, slug, type, path, content, user_id
       FROM corpus_entries
      WHERE id = $1`,
    [editEntryId],
  );
  const row = rows[0];
  if (!row) return { error: { status: 404, message: 'edit target not found' } };
  if (row.user_id && row.user_id !== userId) {
    return { error: { status: 403, message: 'cannot edit another user\'s pattern' } };
  }
  return { row };
}

async function loadSiblingContext(client, projectId, excludeEntryId) {
  // corpus_entries.id is uuid; the bound parameter arrives as text, so
  // we cast on the Postgres side. Without the cast Postgres refuses with
  // "operator does not exist: uuid <> text" because there's no implicit
  // cast between the two types.
  const { rows } = await client.query(
    `SELECT ce.slug, ce.content
       FROM project_files pf
       JOIN corpus_entries ce ON ce.id = pf.corpus_entry_id
      WHERE pf.project_id = $1
        AND ($2::uuid IS NULL OR ce.id <> $2::uuid)
      ORDER BY pf.added_at DESC
      LIMIT $3`,
    [projectId, excludeEntryId, MAX_SIBLINGS],
  );
  // Budget each snippet so the whole context block stays bounded.
  const perSnippet = Math.floor(SIBLING_CONTEXT_CHAR_BUDGET / Math.max(rows.length, 1));
  return rows.map((r) => ({
    slug: r.slug,
    snippet: (r.content ?? '').slice(0, perSnippet),
  }));
}

// ──────────────────────────────────────────────────────────────────────
// Telemetry. Every Make generation writes one row into tool_usage_logs
// (same table the MCP server uses for `get_component` etc.) so we have
// a single source of truth for who's spent how many tokens. The
// frontend's /api/brandsync-make/usage endpoint reads the same table.
// We intentionally swallow logging failures — the user-visible request
// shouldn't fail just because telemetry hiccuped.
// ──────────────────────────────────────────────────────────────────────
async function logUsage({ userEmail, startedAt, usage, success, errorMessage }) {
  try {
    await getPool().query(
      `INSERT INTO tool_usage_logs
         (id, user_email, tool_name, duration_ms, success, error,
          input_tokens, output_tokens, cache_read_tokens)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        // Anthropic-style cuid would be nicer but uuid is fine — the
        // column is plain text and the existing rows are a mix of
        // identifier styles already.
        crypto.randomUUID(),
        userEmail ?? null,
        'brandsync_make.generate',
        Date.now() - startedAt,
        success,
        errorMessage ?? null,
        usage?.input_tokens ?? null,
        usage?.output_tokens ?? null,
        // Anthropic returns cache_read_input_tokens; the schema column
        // is just cache_read_tokens.
        usage?.cache_read_input_tokens ?? null,
      ],
    );
  } catch (err) {
    console.error('[tool_usage_logs] insert failed:', err.message);
  }
}

// ──────────────────────────────────────────────────────────────────────
// SSE streaming wrapper. Calls handlePost with an `emit` callback that
// pushes `phase` events through a ReadableStream; the final response
// payload becomes a single `complete` event (or `error` if anything
// throws). Same telemetry, just delivered incrementally.
// ──────────────────────────────────────────────────────────────────────
function streamingResponse(request) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event, data) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch {
          // Stream already closed (client went away). Swallow — we'll
          // notice when the next enqueue throws too and bail.
        }
      };
      // Initial colon line is an SSE-spec comment. Some intermediary
      // proxies buffer the response until first byte; this prods them
      // to flush immediately so the UI sees the first phase event
      // within milliseconds.
      controller.enqueue(encoder.encode(': stream-open\n\n'));

      const ctx = { startedAt: Date.now(), userEmail: null, usage: {} };
      try {
        emit('phase', { phase: 'starting', message: 'Preparing your request…' });
        const response = await handlePost(request, ctx, emit);
        const status = response.status;
        const body = await response.json();
        const ok = status >= 200 && status < 300;
        await logUsage({
          ...ctx,
          success: ok,
          errorMessage: ok ? null : (body?.error ?? `HTTP ${status}`),
        });
        emit(ok ? 'complete' : 'error', body);
      } catch (err) {
        console.error('[/api/generate stream] uncaught:', err);
        await logUsage({ ...ctx, success: false, errorMessage: err?.message });
        emit('error', {
          error: err?.message ?? 'unknown server error',
          stack: process.env.NODE_ENV === 'production' ? undefined : err?.stack,
        });
      } finally {
        try { controller.close(); } catch { /* ignore */ }
      }
    },
  });
  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      'connection': 'keep-alive',
      // Nginx-style hint to skip response buffering. Vercel ignores
      // it but proxies in front of self-hosted setups respect it.
      'x-accel-buffering': 'no',
    },
  });
}

// ──────────────────────────────────────────────────────────────────────
// POST handler
//
// Two response modes based on the Accept header:
//   • `text/event-stream` → SSE stream. Emits `phase` events as work
//     progresses (loading context, MCP tool calls, generating final
//     response) and a terminal `complete` or `error` event. This is
//     what the Make chat UI uses to render real progress instead of a
//     ~100s "Thinking…" spinner.
//   • anything else → existing one-shot JSON response. Preserved so
//     curl smoke tests, scripts, and any non-streaming consumer keep
//     working without modification.
// ──────────────────────────────────────────────────────────────────────
export async function POST(request) {
  const wantsSSE = (request.headers.get('accept') || '').includes('text/event-stream');
  if (wantsSSE) return streamingResponse(request);

  // Shared mutable context so handlePost can record what it learned
  // (userEmail, accumulated usage) and the wrapper can log it whether
  // we succeed or throw.
  const ctx = { startedAt: Date.now(), userEmail: null, usage: {} };
  try {
    const response = await handlePost(request, ctx);
    const ok = response.status >= 200 && response.status < 300;
    await logUsage({
      ...ctx,
      success: ok,
      errorMessage: ok ? null : `HTTP ${response.status}`,
    });
    return response;
  } catch (err) {
    console.error('[/api/generate] uncaught error:', err);
    await logUsage({ ...ctx, success: false, errorMessage: err?.message });
    return Response.json(
      {
        error: err?.message ?? 'unknown server error',
        // Stack is helpful in dev. In production this could leak details;
        // gate behind NODE_ENV when the route is exposed externally.
        stack: process.env.NODE_ENV === 'production' ? undefined : err?.stack,
      },
      { status: 500 },
    );
  }
}

async function handlePost(request, ctx, emit) {
  const fire = typeof emit === 'function' ? emit : () => {};
  let body;
  try { body = await request.json(); } catch { body = {}; }

  // Debug-only patch path stays available — useful for hand-crafted
  // envelope tests without hitting Anthropic.
  if (body?.__debugPatchOnly && body?.envelope && body?.existingContent != null) {
    return runPatchOnlyDebug(body.envelope, body.existingContent);
  }

  const {
    userEmail,
    prompt,
    projectId = null,
    useDesignSystem = true,
    theme = null,
    brandPalette = null,
    selectedLogoName = null,
    editEntryId = null,
    orgId: requestedOrgId = null,
    model = DEFAULT_MODEL,
    images: rawImages = null,
  } = body ?? {};

  if (!userEmail) return Response.json({ error: 'userEmail required' }, { status: 400 });
  ctx.userEmail = userEmail;
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return Response.json({ error: 'prompt required' }, { status: 400 });
  }

  // Attached images (visual reference). Accept either a data: URL or a
  // { mediaType, data } pair; normalize to { mediaType, data(base64) } and
  // cap count/size so a giant paste can't blow the request or the bill.
  const images = normalizeImages(rawImages);
  if (images.error) return Response.json({ error: images.error }, { status: 400 });
  // Sanitize the API key against undici's HTTP-header validation:
  // a stray \r, \n, or non-ASCII char makes fetch() throw the famously
  // unhelpful "TypeError: The string did not match the expected pattern."
  // Trim whitespace AND strip anything outside printable ASCII so we
  // never hand undici a value it'll refuse.
  const rawKey = process.env.CLAUDE_API_KEY;
  const apiKey = rawKey?.replace(/[^\x20-\x7E]/g, '').trim();
  if (!apiKey) {
    return Response.json(
      { error: 'CLAUDE_API_KEY not configured on the server' },
      { status: 500 },
    );
  }

  const client = getPool();
  const userId = await resolveUserId(client, userEmail);
  if (!userId) return Response.json({ error: 'no such user' }, { status: 404 });

  // org the generated pattern belongs to (tenant axis). Use the caller's
  // selected (active) org when they may access it; otherwise fall back to
  // their default org. Never trust a requested org they can't see.
  const visibleOrgs = await userVisibleOrgIds(client, userId);
  const orgId = (requestedOrgId && visibleOrgs.includes(requestedOrgId))
    ? requestedOrgId
    : await resolveUserOrgId(client, userId);

  if (projectId && !(await userOwnsProject(client, projectId, userId))) {
    return Response.json({ error: 'project not found' }, { status: 404 });
  }

  // Edit-mode setup — fetch the target so we can pass it to the model
  // AND pass it to applyScopedPatch for scope=section/css-only merges.
  let editTarget = null;
  if (editEntryId) {
    const loaded = await loadEditTarget(client, editEntryId, userId);
    if (loaded.error) {
      return Response.json({ error: loaded.error.message }, { status: loaded.error.status });
    }
    editTarget = loaded.row;
  }

  // Sibling context — only when useDesignSystem and inside a project.
  let siblingContext = [];
  if (useDesignSystem && projectId) {
    siblingContext = await loadSiblingContext(client, projectId, editEntryId);
  }

  // Component kit catalog (compact: name + classes) so the model composes
  // from pre-built brand classes instead of re-emitting component CSS.
  let kitCatalog = [];
  if (useDesignSystem) {
    try {
      const origin = new URL(request.url).origin;
      // Org-scoped kit: base + the org's APPROVED overrides. We intentionally
      // omit userEmail so generation uses the team-approved kit, not a single
      // member's unapproved edits.
      const kitRes = await fetch(`${origin}/api/kit?orgId=${encodeURIComponent(orgId ?? '')}`);
      if (kitRes.ok) {
        const kit = await kitRes.json();
        kitCatalog = (kit.catalog || []).map((c) => ({ name: c.name, classes: c.classes }));
      }
    } catch { /* kit optional — generation still works without it */ }
  }

  const systemPrompt = buildSystemPrompt({
    existingContent: editTarget?.content ?? null,
    editingSlug: editTarget?.slug ?? null,
    brandPalette,
    theme,
    selectedLogoName,
    siblingContext,
    kitCatalog,
  });

  fire('phase', { phase: 'connecting', message: 'Connecting to Brandsync MCP…' });

  // Open an MCP session for this generation. The session lifetime is
  // the request lifetime — open here, close in the finally below. If
  // the MCP server is unreachable, fall back to no-tools mode rather
  // than failing the whole generation; the model can still produce
  // a usable pattern without grounding (just less brand-aware).
  let mcpSession = null;
  let mcpTools = [];
  const mcpUrl = process.env.MCP_SERVER_URL?.trim();
  const mcpToken = process.env.MCP_SERVICE_TOKEN?.replace(/[^\x20-\x7E]/g, '').trim();
  if (mcpUrl && mcpToken) {
    try {
      // Act as this user and scope MCP retrieval to their active org so the
      // grounding context is {selected org + Brandsync}, matching where the
      // generated pattern will be saved.
      mcpSession = await openSession({ url: mcpUrl, token: mcpToken, actingUserEmail: userEmail, orgId });
      mcpTools = await listAllowedTools(mcpSession);
    } catch (err) {
      console.warn('[/api/generate] MCP unavailable, continuing without tools:', err.message);
      mcpSession = null;
      mcpTools = [];
    }
  }
  // runConversation fires its own 'thinking' at iter 0 before the
  // Anthropic call, so we don't need to duplicate it here.

  // Everything from here through the DB write is wrapped so we always
  // best-effort close the MCP session, even on error paths.
  let pattern, edited, summary, envelopeScope, retried, mcpToolCalls, usageTotals, finalModel;
  try {
    // First exchange (with tools — Claude may call MCP tools 0+ times
    // before producing the final envelope JSON).
    let llm = await runConversation({
      apiKey, model, system: systemPrompt, userPrompt: prompt.trim(), images: images.list,
      mcpSession, tools: mcpTools, emit: fire,
    });
    usageTotals = { ...(llm.usage ?? {}) };
    ctx.usage = usageTotals;
    mcpToolCalls = llm.mcpToolCalls ?? 0;
    finalModel = llm.model;
    let envelope;
    retried = false;

    try {
      envelope = parseEnvelopeText(llm.text);
    } catch (err) {
      if (!(err instanceof PatchError)) throw err;
      retried = true;
      llm = await runConversation({
        apiKey, model, system: systemPrompt, userPrompt: prompt.trim(), images: images.list,
        retryHint: err.message,
        mcpSession, tools: mcpTools, emit: fire,
      });
      if (llm.usage) { usageTotals = sumUsage(usageTotals, llm.usage); ctx.usage = usageTotals; }
      mcpToolCalls += llm.mcpToolCalls ?? 0;
      finalModel = llm.model;
      envelope = parseEnvelopeText(llm.text);
    }

    // scope=chat short-circuit. The user asked something that isn't a
    // change request; we don't touch the pattern, don't apply any
    // patch, and return the summary as the chat reply. Without this
    // the model is forced to pick a mutating scope and corrupts the
    // pattern as a side effect of a question.
    if (envelope.scope === 'chat') {
      summary = typeof envelope.summary === 'string' && envelope.summary.trim()
        ? envelope.summary.trim()
        : '(no reply)';
      return Response.json({
        pattern: editTarget ?? null,
        edited: false,
        summary,
        model: finalModel,
        contextUsed: {
          useDesignSystem,
          siblingCount: siblingContext.length,
          envelopeScope: 'chat',
          retried,
          mcpToolCalls,
        },
        usage: usageTotals,
      });
    }

    // Apply the patch. If the envelope's structure is invalid, retry
    // once with a hard scope=full instruction; the merger never
    // silently recovers, but the LLM can on a second pass.
    let mergedContent;
    try {
      mergedContent = applyScopedPatch(editTarget?.content ?? '', envelope);
    } catch (err) {
      if (!(err instanceof PatchError) || retried) throw err;
      retried = true;
      llm = await runConversation({
        apiKey, model, system: systemPrompt, userPrompt: prompt.trim(), images: images.list,
        retryHint: err.message,
        mcpSession, tools: mcpTools, emit: fire,
      });
      if (llm.usage) { usageTotals = sumUsage(usageTotals, llm.usage); ctx.usage = usageTotals; }
      mcpToolCalls += llm.mcpToolCalls ?? 0;
      finalModel = llm.model;
      envelope = parseEnvelopeText(llm.text);
      if (envelope.scope === 'chat') {
        summary = typeof envelope.summary === 'string' && envelope.summary.trim()
          ? envelope.summary.trim()
          : '(no reply)';
        return Response.json({
          pattern: editTarget ?? null,
          edited: false,
          summary,
          model: finalModel,
          contextUsed: {
            useDesignSystem,
            siblingCount: siblingContext.length,
            envelopeScope: 'chat',
            retried,
            mcpToolCalls,
          },
          usage: usageTotals,
        });
      }
      mergedContent = applyScopedPatch(editTarget?.content ?? '', envelope);
    }

    fire('phase', { phase: 'saving', message: 'Saving pattern…' });

    // Persist. Edits UPDATE in place; new patterns INSERT and
    // optionally attach to the project's file list so the sidebar
    // picks them up.
    edited = false;
    if (editTarget) {
      const { rows } = await client.query(
        `UPDATE corpus_entries
            SET content = $1
          WHERE id = $2
          RETURNING id, slug, type, path, content, user_id, created_at, saved_at`,
        [mergedContent, editTarget.id],
      );
      pattern = rows[0];
      edited = true;
      if (projectId) {
        await client.query('UPDATE projects SET updated_at = now() WHERE id = $1', [projectId]);
      }
    } else {
      const slug = deriveSlug(prompt);
      const path = `corpus/patterns/${slug}.md`;
      const { rows } = await client.query(
        `INSERT INTO corpus_entries (slug, type, path, content, user_id, org_id)
         VALUES ($1, 'pattern', $2, $3, $4, $5)
         RETURNING id, slug, type, path, content, user_id, org_id, created_at`,
        [slug, path, mergedContent, userId, orgId],
      );
      pattern = rows[0];
      if (projectId) {
        await client.query(
          `INSERT INTO project_files (project_id, corpus_entry_id)
           VALUES ($1, $2)
           ON CONFLICT (project_id, corpus_entry_id) DO NOTHING`,
          [projectId, pattern.id],
        );
        await client.query('UPDATE projects SET updated_at = now() WHERE id = $1', [projectId]);
      }
    }

    envelopeScope = envelope.scope;
    // Defensive: the model is told to always include `summary`, but if
    // it forgets (or the second-pass retry strips it), fall back to
    // something human-readable rather than rendering "undefined".
    summary = typeof envelope.summary === 'string' && envelope.summary.trim()
      ? envelope.summary.trim()
      : (edited ? `Updated ${pattern.slug}.` : `Created ${pattern.slug}.`);

    return Response.json({
      pattern,
      edited,
      summary,
      model: finalModel,
      contextUsed: {
        useDesignSystem,
        siblingCount: siblingContext.length,
        envelopeScope,
        retried,
        mcpToolCalls,
      },
      usage: usageTotals,
    });
  } finally {
    // Best-effort cleanup — never block the response on it. The MCP
    // server GCs idle sessions anyway, this is just polite.
    if (mcpSession) {
      try { await closeSession(mcpSession); } catch { /* ignore */ }
    }
  }
}

function sumUsage(a, b) {
  const out = { ...a };
  for (const k of Object.keys(b)) {
    if (typeof b[k] === 'number') out[k] = (out[k] ?? 0) + b[k];
  }
  return out;
}

// ──────────────────────────────────────────────────────────────────────
// Debug-only patch path. Kept from the previous stub so the patch
// contract can be exercised without an API key.
// ──────────────────────────────────────────────────────────────────────
function runPatchOnlyDebug(envelope, existingContent) {
  try {
    const merged = applyScopedPatch(existingContent, envelope);
    return Response.json({ ok: true, merged });
  } catch (err) {
    if (err instanceof PatchError) {
      return Response.json(
        { ok: false, code: err.code, error: err.message },
        { status: 422 },
      );
    }
    return Response.json({ ok: false, error: err.message ?? 'unknown' }, { status: 500 });
  }
}
