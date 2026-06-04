'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Sun, Moon, MagnifyingGlass, PencilSimple } from '@phosphor-icons/react';
import { brandOverrideCss, substituteBrand } from '@/lib/brand-substitute';
import { getStoredOrgId } from '@/lib/useActiveOrg';
import { replaceEmojisWithPhosphor } from '@/lib/icons';

const DRAWER_USER_EMAIL = 'vivka@eg.dk';
// We used to call getComponentsForSidebar/getComponentByName which proxied
// through the local Strapi at localhost:1337. Switched to /api/components
// which hits prod Strapi server-side via STRAPI_API_PROD_TOKEN — no local
// Strapi required, and CodeExamples are always populated (the local client
// excluded them in non-"dev" env).

// Right-side drawer that browses the Brandsync component library inline,
// without leaving the project workspace. Read-only for now: user previews
// a component + its variants, doesn't modify the project.

// ──────────────────────────────────────────────────────────────────────

function parseCodeParts(code = '') {
  const cssMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const jsMatch  = code.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  return {
    html: code.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').trim(),
    css:  cssMatch ? cssMatch[1].trim() : '',
    js:   jsMatch  ? jsMatch[1].trim()  : '',
  };
}

// Components shipped from Strapi use hand-drawn Lucide-ish inline SVGs.
// We swap recognized icons for Phosphor web-font glyphs so previews use the
// official Brandsync icon set. Path signatures are stable across the 27
// components in the dump — see `node scripts/inspect-icons.mjs` for the full
// audit. Order matters: list specific signatures before generic ones.
const ICON_MAP = [
  // Chevrons / carets
  ['polyline points="9 18 15 12 9 6"',   'caret-right'],
  ['polyline points="6 9 12 15 18 9"',   'caret-down'],
  ['M6 4l4 4-4 4',                       'caret-right'],
  ['M7 4l6 6-6 6',                       'caret-right'],
  ['M13 4l-6 6 6 6',                     'caret-left'],

  // Status / actions
  ['M2 7l3.5 3.5L12 3',                  'check'],
  ['polyline points="20 6 9 17 4 12"',   'check'],
  ['M3 7h8',                             'minus'],
  ['line x1="18" y1="6" x2="6" y2="18"', 'x'],
  ['line x1="12" y1="5" x2="12" y2="19"','plus'],

  // Filesystem / content
  ['M22 19a2 2 0 0 1-2 2H4',             'folder'],
  ['polyline points="14 2 14 8 20 8"',   'file-text'],
  ['polyline points="3 6 5 6 21 6"',     'trash'],

  // Nav / shortcuts
  ['M3 12L12 4l9 8v8',                   'house'],
  ['M12 2l3.09 6.26L22 9.27',            'star'],
  ['polygon points="2,1 12,7 2,13"',     'play'],
  ['rect x="2" y="1" width="4" height="12" rx="1"', 'pause'],

  // Comms
  ['M18 8A6 6 0 0',                      'bell'],
  ['M6 1a3.5 3.5 0 0 0-3.5 3.5',         'bell'],
  ['M4 4h16c1.1',                        'envelope'],
  ['M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4', 'microphone'],

  // People
  ['circle cx="12" cy="8" r="4"',        'user'],

  // Feedback
  ['M10.29 3.86L1.82 18',                'warning'],
  ['9.09 9a3 3 0 0 1 5.83 1',            'question'],
  ['line x1="12" y1="16" x2="12.01" y2="16"', 'info'],
  ['line x1="12" y1="16" x2="12.01"',    'info'],

  // Misc
  ['M18 13v6a2 2 0 0 1-2 2H5',           'arrow-square-out'],
  ['M21 16V8a2 2 0 0 0-1-1.73',          'cube'],
  ['rect x="1" y="4" width="22" height="16" rx="2"', 'credit-card'],
  ['M21 10c0 7-9 13',                    'map-pin'],
  ['M7 11V7a5 5 0 0 1 10 0v4',           'lock'],
  ['M19.4 15a1.65 1.65',                 'gear'],
  ['M18.5 2.5a2.121',                    'pencil-simple'],
  ['rect x="3" y="3" width="18" height="18" rx="2" ry="2"', 'image'],
];

function replaceSvgsWithPhosphor(html) {
  return html.replace(/<svg([^>]*)>([\s\S]*?)<\/svg>/g, (match, attrs, inner) => {
    // Skip our progress spinners and avatar artwork — not really "icons".
    if (inner.includes('bs-progress-circular')) return match;
    if (/<ellipse\b/.test(inner)) return match; // avatar silhouettes
    // Skip SVGs that are component-internal artwork — they're sized,
    // positioned, and styled by the component's own CSS (checkbox tick,
    // radio dot, etc.). A `bs-*` class on the <svg> is the signal.
    // Replacing them with a Phosphor <i> would knock the component
    // layout off (checkbox tick wouldn't sit inside the box, etc.).
    if (/\bclass=["'][^"']*\bbs-[a-z0-9_-]+/i.test(attrs)) return match;

    const normalized = inner.replace(/\s+/g, ' ').trim();
    for (const [sig, name] of ICON_MAP) {
      if (normalized.includes(sig)) {
        // Anchor on word boundary so `width="16"` matches but
        // `stroke-width="2"` doesn't. Without this, snackbar's
        // <svg stroke-width="2" width="16"> rendered at font-size:2px.
        const widthMatch = attrs.match(/(?:^|\s)width=["'](\d+)/);
        const size = widthMatch ? widthMatch[1] : '16';
        return `<i class="ph ph-${name}" style="font-size:${size}px;line-height:1;display:inline-flex;vertical-align:middle"></i>`;
      }
    }
    return match;
  });
}

// Rewrite every <a href="..."> to href="#" so component-internal links
// don't navigate the iframe. Pairs with the click guard in the shim.
function neutralizeLinks(html) {
  return html.replace(/\bhref\s*=\s*"[^"]*"/gi, 'href="#"')
             .replace(/\bhref\s*=\s*'[^']*'/gi, "href='#'");
}

function buildPreviewDoc({ html, css, js }, tokensCss, theme, brandPalette, selectedLogo) {
  const themedHtml = neutralizeLinks(replaceEmojisWithPhosphor(
    replaceSvgsWithPhosphor(substituteBrand(html, theme, selectedLogo)),
  ));
  const brandCss = brandOverrideCss(brandPalette);
  return `<!doctype html>
<html lang="en" data-theme="${theme}">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap">
    <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">
    <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/bold/style.css">
    <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css">
    <style>${tokensCss}</style>
    ${brandCss ? `<style>${brandCss}</style>` : ''}
    <style>
      /* Top-align horizontally-centered content. Previously place-items:
         center vertically centered, which left a lot of empty space above
         short components (checkbox column floated mid-iframe). */
      html, body { margin: 0; padding: 0; background: var(--bs-surface-base); color: var(--bs-text-default); font-family: var(--bs-typography-font-family-body), system-ui, sans-serif; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 48px 24px; box-sizing: border-box; gap: 24px; }
      /* Checkbox indeterminate fix — the component's SVG ships with
         inline style="opacity:0", which beats the component's own
         :indeterminate CSS rule. Use !important to win against inline. */
      .bs-checkbox input:indeterminate ~ .bs-checkbox__box .bs-icon-indeterminate { opacity: 1 !important; }
      .bs-checkbox input:indeterminate ~ .bs-checkbox__box .bs-icon-check       { opacity: 0 !important; }
      /* Several Strapi component SVGs draw dots as zero-length lines
         (e.g. info-icon top dot rendered as a same-point line). Without
         stroke-linecap=round those lines render as invisible butts.
         Force rounded caps on any component-internal SVG so the dots
         actually appear. */
      svg[class*="bs-"] { stroke-linecap: round; stroke-linejoin: round; }
      html, body { scrollbar-width: none; -ms-overflow-style: none; }
      html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }
      img[src=""] { display: none; }
      /* Light-theme component preview sits on the workspace's canvas gray
         instead of pure white so component edges remain visible. Dark
         theme keeps its own surface-base (near-black). */
      html:not([data-theme="dark"]) body { background: #eceef2; }
      ${css}
    </style>
  </head>
  <body>${themedHtml}${js ? `<script>${js}</script>` : ''}
    <script>
      // Interactive shim — wires basic interactions for component previews.
      //
      // Accordion: shipped Strapi markup uses inline onclick handlers
      // with the wrong class names ("acc-item" / "open" instead of the
      // real "bs-acc-item" / "bs-open"); a delegated listener sidesteps it.
      //
      // Checkbox indeterminate: the :indeterminate CSS pseudo only matches
      // when JS sets input.indeterminate = true (no HTML attribute exists).
      // So any label whose text mentions "indeterminate" gets its input
      // pre-flagged here on init.
      document.addEventListener('click', function (e) {
        var header = e.target.closest && e.target.closest('.bs-acc-header');
        if (!header) return;
        var item = header.closest('.bs-acc-item');
        if (!item) return;
        var nowOpen = !item.classList.contains('bs-open');
        item.classList.toggle('bs-open', nowOpen);
        item.classList.toggle('bs-is-active', nowOpen);
        header.setAttribute('aria-expanded', String(nowOpen));
      });

      // Init pass for indeterminate checkboxes.
      document.querySelectorAll('.bs-checkbox').forEach(function (label) {
        if (!/indeterminate/i.test(label.textContent || '')) return;
        var input = label.querySelector('input[type=checkbox]');
        if (input) input.indeterminate = true;
      });

      // Anchor click guard — every <a href="#"> would otherwise scroll
      // the iframe to top; we already rewrote hrefs but some component
      // demos inject links dynamically after first paint.
      document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a');
        if (a) e.preventDefault();
      });
    </script>
  </body>
</html>`;
}

// ──────────────────────────────────────────────────────────────────────

const ui = {
  bg: '#ffffff',
  panel: '#fafbfc',
  panelLine: '#e4e6eb',
  text: '#15181d',
  textMuted: '#5d6470',
  textFaint: '#9097a3',
  pill: '#f3f4f7',
  pillBorder: '#e0e3e9',
  accent: '#1a1d23',
  accentText: '#ffffff',
  backdrop: 'rgba(15, 18, 23, 0.32)',
};


// Hand-authored local overrides are retired: the Navigation Drawer (a full
// app shell that already includes the top header) is now fetched live from
// the MCP corpus, and there's no longer a separate "Navigation Header".
const LOCAL_COMPONENT_OVERRIDES = {};
const LOCAL_COMPONENTS = [];

// Components served from the MCP design-system corpus (corpus/components/
// <slug>.html via /api/corpus-component) instead of Strapi — the corpus
// version is the authoritative, fully-tokenized source. The Navigation
// Drawer corpus entry is a complete app shell (drawer + header), so it
// stands in for both.
const CORPUS_COMPONENTS = {
  'Navigation Drawer': 'navigation-drawer',
};

// ──────────────────────────────────────────────────────────────────────

export default function ComponentsDrawer({
  open, onClose,
  // Defaults from the project workspace. The drawer lets the user override
  // theme locally, but mirrors the workspace's brand palette + logo so the
  // preview matches what they'll see in their pattern canvas.
  workspaceTheme = 'dark',
  brandPalette = 'blue',
  selectedLogo = null,
}) {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedName, setSelectedName] = useState(null);
  const [componentData, setComponentData] = useState(null);
  const [tokensCss, setTokensCss] = useState('');
  const [theme, setTheme] = useState(workspaceTheme);
  const [activeVariant, setActiveVariant] = useState(0);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState(null);
  // Org-kit awareness: this drawer shows the ACTIVE ORG'S kit (base + the
  // org's approved overrides), the same set /api/generate composes from — not
  // the raw Strapi library. `overrides` maps name → the override's variants so
  // edited/added components render from the kit, not Strapi. `status` maps
  // name → { source, pending } for the badges.
  const [overrides, setOverrides] = useState({});
  const [status, setStatus] = useState({});
  const [orgName, setOrgName] = useState(null);

  // When the workspace toggles its theme, follow it — until the user
  // overrides locally via the drawer's toggle (the next render after their
  // click will keep their choice because workspaceTheme didn't change).
  useEffect(() => { setTheme(workspaceTheme); }, [workspaceTheme]);

  // First-mount fetch: the ORG KIT (catalog + combined css) + tokens + org
  // name. The list comes from the kit catalog so disabled base components are
  // gone and org-added ones appear. We also inline the combined kit css into
  // tokensCss so override/added components (which carry html only) still render
  // styled. Held until the drawer opens at least once, then cached.
  useEffect(() => {
    if (!open || items.length > 0) return;
    const orgId = getStoredOrgId();
    const qs = `orgId=${encodeURIComponent(orgId ?? '')}&userEmail=${encodeURIComponent(DRAWER_USER_EMAIL)}`;
    Promise.all([
      fetch(`/api/kit?${qs}`).then(async r => {
        const body = await r.json();
        if (!r.ok) throw new Error(body?.error ?? `HTTP ${r.status}`);
        return body;
      }),
      fetch(`/api/kit?css=1&${qs}`).then(r => (r.ok ? r.text() : '')),
      fetch('/api/tokens').then(r => (r.ok ? r.text() : '')),
      fetch(`/api/orgs?userEmail=${encodeURIComponent(DRAWER_USER_EMAIL)}`).then(r => (r.ok ? r.json() : { orgs: [] })).catch(() => ({ orgs: [] })),
    ])
      .then(([kit, kitCss, tokens, orgsBody]) => {
        const catalog = kit.catalog || [];
        const ov = {}, st = {};
        for (const c of catalog) {
          st[c.name] = { source: c.source ?? 'base', pending: !!c.pending };
          if ((c.source ?? 'base') !== 'base') ov[c.name] = { variants: c.variants || [] };
        }
        setOverrides(ov);
        setStatus(st);
        // List from the kit; splice local-only components (not in Strapi/kit).
        const arr = [
          ...catalog.map(c => ({ id: c.name, title: c.name })),
          ...LOCAL_COMPONENTS,
        ].sort((a, b) => a.title.localeCompare(b.title));
        setItems(arr);
        // tokens FIRST, then the combined kit css (so kit rules win for overrides).
        setTokensCss(`${tokens || ''}\n\n/* ---- component kit ---- */\n${kitCss || ''}`);
        if (arr.length > 0 && !selectedName) setSelectedName(arr[0].title);
        const org = (orgsBody.orgs || []).find(o => o.id === orgId) || (orgsBody.orgs || []).find(o => o.is_default);
        setOrgName(org?.name ?? null);
      })
      .catch(e => setError(e?.message ?? 'Failed to load the component kit'))
      .finally(() => setLoadingList(false));
  }, [open, items.length, selectedName]);

  // Detail when selection changes.
  //   • org override / added component → render straight from the kit (its
  //     variants carry the html; the combined kit css in tokensCss styles it).
  //   • corpus-sourced component → fetch the authored html from /api/corpus-component.
  //   • plain base component → Strapi detail (keeps full brand/icon fidelity).
  useEffect(() => {
    if (!selectedName) return;
    setActiveVariant(0);
    const ov = overrides[selectedName];
    if (ov) {
      setComponentData({
        Title: selectedName,
        CodeExamples: (ov.variants || []).map(v => ({ Variant: v.variant, Code: v.html })),
      });
      setLoadingDetail(false);
      return;
    }
    const corpusSlug = CORPUS_COMPONENTS[selectedName];
    if (corpusSlug) {
      setLoadingDetail(true);
      fetch(`/api/corpus-component?slug=${encodeURIComponent(corpusSlug)}`)
        .then(async r => {
          const body = await r.json();
          if (!r.ok) throw new Error(body?.error ?? `HTTP ${r.status}`);
          // One combined app-shell variant; the render pipeline splits its
          // <style>, swaps emoji → Phosphor, and themes it like any other.
          return { Title: selectedName, CodeExamples: [{ Variant: 'App shell', Code: body.html }] };
        })
        .then(data => setComponentData(data))
        .catch(() => setComponentData(null))
        .finally(() => setLoadingDetail(false));
      return;
    }
    setLoadingDetail(true);
    fetch(`/api/components?name=${encodeURIComponent(selectedName)}`)
      .then(async r => {
        const body = await r.json();
        if (!r.ok) throw new Error(body?.error ?? `HTTP ${r.status}`);
        return body;
      })
      .then(data => setComponentData(data ?? null))
      .catch(() => setComponentData(null))
      .finally(() => setLoadingDetail(false));
  }, [selectedName, overrides]);

  // ESC closes the drawer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    if (!filter.trim()) return items;
    const q = filter.toLowerCase();
    return items.filter(i => i.title.toLowerCase().includes(q));
  }, [items, filter]);

  const variants = useMemo(() => {
    // Prefer a local override when one exists for this component (e.g.
    // Navigation Drawer — see LOCAL_COMPONENT_OVERRIDES).
    const override = componentData?.Title
      ? LOCAL_COMPONENT_OVERRIDES[componentData.Title]
      : null;
    const raw = override ?? componentData?.CodeExamples;
    if (!raw || !Array.isArray(raw)) return [];
    return raw
      .map((v, i) => ({
        // Prod Strapi shape: { Framework, Group, Variant, Code }. Group is
        // usually the variant name (Primary, Neutral, ...); Variant is often
        // null. Fall back through both, then index.
        name: v.Variant || v.Group || v.variant || `Variant ${i + 1}`,
        code: v.Code || v.code || '',
      }))
      .filter(v => v.code);
  }, [componentData]);

  return (
    <>
      {/* Backdrop — clicking it closes the drawer; not opaque so the workspace stays readable behind */}
      <div
        onClick={onClose}
        aria-hidden={!open}
        style={{
          position: 'fixed', inset: 0,
          background: ui.backdrop,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 200ms ease',
          // Site Header sits at zIndex 1100 — keep the drawer above it so
          // its own header (with the "My Design System" title + close
          // button) isn't clipped by the global nav.
          zIndex: 1200,
        }}
      />

      <aside
        role="dialog"
        aria-label="Brandsync component library"
        aria-modal="true"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(820px, 96vw)',
          background: ui.bg, color: ui.text,
          borderLeft: `1px solid ${ui.panelLine}`,
          boxShadow: '-8px 0 32px rgba(0,0,0,0.10)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 240ms cubic-bezier(0.22, 0.61, 0.36, 1)',
          zIndex: 1201,
          display: 'flex', flexDirection: 'column',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {/* Header */}
        <header style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${ui.panelLine}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>My Design System</span>
          {orgName && (
            <span style={{ ...pillStyle, fontSize: 10, padding: '2px 7px' }}>{orgName}</span>
          )}
          <div style={{ flex: 1 }} />
          <button
            onClick={() => { onClose?.(); router.push('/brandsync-make/kit'); }}
            title="Edit, approve, and add components"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'transparent', color: ui.textMuted,
              border: `1px solid ${ui.pillBorder}`, borderRadius: 8,
              padding: '5px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
            }}
          ><PencilSimple size={13} /> Manage kit</button>
          <ThemeToggle theme={theme} onChange={setTheme} />
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 32, height: 32, display: 'grid', placeItems: 'center',
              background: 'transparent', border: 'none', borderRadius: 6, cursor: 'pointer',
              color: ui.textMuted,
            }}
          ><X size={18} /></button>
        </header>

        {/* Search */}
        <div style={{ padding: '12px 16px 0 16px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: ui.panel, border: `1px solid ${ui.panelLine}`,
            borderRadius: 8, padding: '8px 10px',
          }}>
            <MagnifyingGlass size={14} color={ui.textMuted} />
            <input
              value={filter}
              onChange={e => setFilter(e.target.value)}
              placeholder="Search components…"
              style={{
                flex: 1, border: 0, outline: 'none', background: 'transparent',
                fontSize: 13, color: ui.text, fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        {/* Body: list (left) + preview (right) */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0, padding: 12, gap: 12 }}>
          {/* Compact list */}
          <div style={{
            width: 160, flexShrink: 0,
            background: ui.panel, border: `1px solid ${ui.panelLine}`,
            borderRadius: 8, overflow: 'auto', padding: 6,
          }}>
            {loadingList ? (
              <div style={{ padding: 12, fontSize: 12, color: ui.textMuted }}>Loading…</div>
            ) : error ? (
              <div style={{ padding: 12, fontSize: 12, color: '#b00020' }}>
                {error}
                <p style={{ marginTop: 8, color: ui.textMuted }}>Couldn’t load the component kit.</p>
              </div>
            ) : (
              filtered.map(it => {
                const st = status[it.title];
                const badge = st && st.source === 'add' ? 'New'
                  : st && st.source === 'override' ? 'Edited' : null;
                return (
                  <button
                    key={it.id}
                    onClick={() => setSelectedName(it.title)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, width: '100%', textAlign: 'left',
                      padding: '8px 10px', borderRadius: 6,
                      background: selectedName === it.title ? ui.pill : 'transparent',
                      color: selectedName === it.title ? ui.text : ui.textMuted,
                      border: 0, cursor: 'pointer', fontSize: 12.5,
                      fontFamily: 'inherit',
                      fontWeight: selectedName === it.title ? 600 : 500,
                    }}
                  >
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.title}</span>
                    {badge && (
                      <span style={{
                        fontSize: 9, fontWeight: 600, letterSpacing: 0.3, padding: '1px 5px', borderRadius: 4,
                        background: st.pending ? '#fff7e6' : '#e9f7ee',
                        color: st.pending ? '#92610a' : '#1f7a44',
                        border: `1px solid ${st.pending ? '#f6d98a' : '#bfe6cd'}`,
                      }}>{badge}</span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Preview area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {loadingDetail || !componentData ? (
              <div style={{ flex: 1, display: 'grid', placeItems: 'center', color: ui.textMuted, fontSize: 13 }}>
                {loadingDetail ? 'Loading component…' : 'Pick a component'}
              </div>
            ) : (
              <ComponentPreview
                componentData={componentData}
                variants={variants}
                activeVariant={activeVariant}
                onVariantChange={setActiveVariant}
                tokensCss={tokensCss}
                theme={theme}
                brandPalette={brandPalette}
                selectedLogo={selectedLogo}
              />
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────

const pillStyle = {
  display: 'inline-flex', alignItems: 'center',
  background: ui.pill, color: ui.text,
  border: `1px solid ${ui.pillBorder}`,
  borderRadius: 999, padding: '3px 10px', fontSize: 11, lineHeight: 1,
};

function ThemeToggle({ theme, onChange }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 2,
      background: ui.panel, borderRadius: 8, border: `1px solid ${ui.panelLine}`,
      padding: 2,
    }}>
      {[
        { key: 'light', icon: Sun,  label: 'Light' },
        { key: 'dark',  icon: Moon, label: 'Dark'  },
      ].map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          aria-label={label}
          title={label}
          style={{
            width: 26, height: 26, display: 'grid', placeItems: 'center',
            background: theme === key ? ui.pill : 'transparent',
            color: theme === key ? ui.text : ui.textMuted,
            border: `1px solid ${theme === key ? ui.pillBorder : 'transparent'}`,
            borderRadius: 6, cursor: 'pointer',
          }}
        ><Icon size={14} /></button>
      ))}
    </div>
  );
}

function ComponentPreview({ componentData, variants, activeVariant, onVariantChange, tokensCss, theme, brandPalette, selectedLogo }) {
  if (variants.length === 0) {
    return (
      <div style={{ flex: 1, display: 'grid', placeItems: 'center', color: ui.textMuted, fontSize: 13, textAlign: 'center', padding: 24 }}>
        <p>This component has no CodeExamples in Strapi yet.</p>
      </div>
    );
  }

  const current = variants[activeVariant] ?? variants[0];
  const srcDoc = buildPreviewDoc(parseCodeParts(current.code), tokensCss, theme, brandPalette, selectedLogo);
  // #eceef2 mirrors the workspace canvas color so the drawer preview
  // feels continuous with the main canvas. Pure white made the component
  // edges disappear; this neutral light gray gives each primitive its
  // own visible frame.
  const iframeBg = theme === 'light' ? '#eceef2' : '#191c22';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 10 }}>
      {/* Component name */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: ui.text }}>{componentData.Title}</h2>
        <span style={{ fontSize: 11, color: ui.textFaint }}>{variants.length} variant{variants.length === 1 ? '' : 's'}</span>
      </div>

      {/* Variant tabs (wrap if many) */}
      {variants.length > 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {variants.map((v, i) => (
            <button
              key={i}
              onClick={() => onVariantChange(i)}
              style={{
                padding: '4px 10px', fontSize: 11.5, borderRadius: 6, cursor: 'pointer',
                background: activeVariant === i ? ui.accent : ui.pill,
                color: activeVariant === i ? ui.accentText : ui.textMuted,
                border: `1px solid ${activeVariant === i ? ui.accent : ui.pillBorder}`,
                fontFamily: 'inherit', fontWeight: 500,
              }}
            >{v.name}</button>
          ))}
        </div>
      )}

      {/* Preview iframe — fills remaining height */}
      <div style={{
        flex: 1, borderRadius: 10, overflow: 'hidden',
        border: `1px solid ${ui.panelLine}`,
        background: iframeBg,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        minHeight: 280,
      }}>
        <iframe
          title={`${componentData.Title} — ${current.name}`}
          srcDoc={srcDoc}
          // allow-scripts lets the interactive shim below run (accordion
          // toggle, tab switching, etc.). No allow-same-origin → the
          // iframe still can't reach this page's DOM or storage.
          sandbox="allow-scripts"
          style={{ width: '100%', height: '100%', border: 0, background: iframeBg, display: 'block' }}
        />
      </div>
    </div>
  );
}
