'use client';

// ─────────────────────────────────────────────────────────────────────────
// Component Kit — the brand's pre-built component set that powers AI
// generation. Unlike /components (a raw Strapi library browser), this page
// frames the kit as a *feature*: it shows exactly what the model composes
// from, the classes each component exposes, and that this is the active org's
// kit. Read-only v1 — editing/per-org overrides come next (Phase 2/3).
//
// Data: one call to /api/kit gives { css, catalog, componentCount, ... }.
//   catalog[i] = { name, classes: ['bs-…'], variants: [{ variant, html }] }
// The css is the COMBINED stylesheet for all components, so a single inline
// of it styles every preview. The variant html is already CSS-stripped.
// ─────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Eye, Code, Sparkle, Desktop, DeviceTablet, DeviceMobile, Sun, Moon, MagnifyingGlass,
  PencilSimple, Check, ArrowCounterClockwise, Paperclip,
} from '@phosphor-icons/react';
import { getStoredOrgId } from '@/lib/useActiveOrg';

const USER_EMAIL = 'vivka@eg.dk';

const VIEWPORTS = {
  desktop: { label: 'Desktop', width: 1280, height: 800, icon: Desktop },
  tablet:  { label: 'Tablet',  width: 768,  height: 1024, icon: DeviceTablet },
  mobile:  { label: 'Mobile',  width: 375,  height: 812,  icon: DeviceMobile },
};

// Inline tokens + the WHOLE kit stylesheet so any component's classes resolve,
// then drop the (already CSS-stripped) variant markup. Same sandboxed-iframe
// recipe the components gallery and pattern previews use.
function buildPreviewDoc(html, tokensCss, kitCss, theme) {
  return `<!doctype html>
<html lang="en" data-theme="${theme}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap">
    <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">
    <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/bold/style.css">
    <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css">
    <style>${tokensCss}</style>
    <style>${kitCss}</style>
    <style>
      html, body { margin: 0; padding: 0; background: var(--bs-surface-base); color: var(--bs-text-default); font-family: var(--bs-typography-font-family-body), system-ui, sans-serif; min-height: 100vh; display: grid; place-items: center; padding: 32px; box-sizing: border-box; }
      html, body { scrollbar-width: none; -ms-overflow-style: none; }
      html::-webkit-scrollbar, body::-webkit-scrollbar { width: 0; height: 0; display: none; }
    </style>
  </head>
  <body>${html}</body>
</html>`;
}

// ─────────────────────────── shell tokens ───────────────────────────

const ui = {
  bg: '#f5f6f8', canvas: '#eceef2', panel: '#ffffff', panelLine: '#e4e6eb',
  text: '#15181d', textMuted: '#5d6470', textFaint: '#9097a3',
  pill: '#f3f4f7', pillBorder: '#e0e3e9', accent: '#1a1d23', accentText: '#ffffff',
  brand: '#6d28d9', brandSoft: '#f3effd', brandLine: '#e4d9fb',
};

const pillStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  background: ui.pill, color: ui.text, border: `1px solid ${ui.pillBorder}`,
  borderRadius: 999, padding: '3px 10px', fontSize: 12, lineHeight: 1,
};

function IconButton({ icon: Icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick} aria-label={label} title={label}
      style={{
        width: 30, height: 30, display: 'grid', placeItems: 'center',
        background: active ? ui.pill : 'transparent',
        color: active ? ui.text : ui.textMuted,
        border: `1px solid ${active ? ui.pillBorder : 'transparent'}`,
        borderRadius: 6, cursor: 'pointer',
      }}
    ><Icon size={16} weight="regular" /></button>
  );
}

function PillGroup({ children }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 2,
      background: ui.panel, borderRadius: 8, border: `1px solid ${ui.panelLine}`,
      padding: 2, boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    }}>{children}</div>
  );
}

// ─────────────────────────── top bar ───────────────────────────

function TopBar({ orgName, componentCount, variantCount, mode, onModeChange }) {
  return (
    <header style={{
      height: 56, display: 'flex', alignItems: 'center', gap: 12,
      padding: '0 20px', background: ui.panel,
      borderBottom: `1px solid ${ui.panelLine}`, color: ui.text, fontSize: 13,
    }}>
      <div style={{ width: 22, height: 22, borderRadius: 4, background: 'linear-gradient(135deg,#f04 0%,#a0f 50%,#0af 100%)' }} />
      <span style={{ fontWeight: 500 }}>Component Kit</span>
      {orgName && <span style={{ ...pillStyle, fontSize: 11 }}>{orgName}</span>}
      <span style={{
        ...pillStyle, fontSize: 11, background: ui.brandSoft,
        border: `1px solid ${ui.brandLine}`, color: ui.brand, fontWeight: 500,
      }}>
        <Sparkle size={13} weight="fill" /> Powers AI generation
      </span>
      <div style={{ flex: 1 }} />
      {componentCount != null && (
        <span style={{ fontSize: 12, color: ui.textMuted }}>
          {componentCount} components · {variantCount} variants
        </span>
      )}
      <PillGroup>
        <IconButton active={mode === 'preview'} onClick={() => onModeChange('preview')} label="Preview" icon={Eye} />
        <IconButton active={mode === 'classes'} onClick={() => onModeChange('classes')} label="Classes" icon={Code} />
      </PillGroup>
    </header>
  );
}

// ─────────────────────────── canvas controls ───────────────────────────

function CanvasControlBar({ viewport, onViewportChange, theme, onThemeChange }) {
  const vp = VIEWPORTS[viewport];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
      <PillGroup>
        {Object.entries(VIEWPORTS).map(([key, def]) => (
          <IconButton key={key} active={viewport === key} onClick={() => onViewportChange(key)} label={def.label} icon={def.icon} />
        ))}
        <span style={{
          padding: '0 12px 0 10px', fontSize: 11, color: ui.textMuted,
          fontFamily: 'ui-monospace, Menlo, Consolas, monospace', whiteSpace: 'nowrap',
        }}>{vp.width} × {vp.height}</span>
      </PillGroup>
      <PillGroup>
        <IconButton active={theme === 'light'} onClick={() => onThemeChange('light')} label="Light" icon={Sun} />
        <IconButton active={theme === 'dark'}  onClick={() => onThemeChange('dark')}  label="Dark"  icon={Moon} />
      </PillGroup>
    </div>
  );
}

// ─────────────────────────── sidebar ───────────────────────────

function LeftSidebar({ items, selected, onSelect, loading, filter, onFilter }) {
  const shown = items.filter((c) => c.name.toLowerCase().includes(filter.toLowerCase()));
  return (
    <aside style={{
      width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column',
      background: ui.panel, borderRight: `1px solid ${ui.panelLine}`, color: ui.text,
    }}>
      <div style={{ padding: '18px 16px 10px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: ui.pill, border: `1px solid ${ui.pillBorder}`,
          borderRadius: 10, padding: '8px 12px',
        }}>
          <MagnifyingGlass size={15} color={ui.textMuted} />
          <input
            value={filter} onChange={(e) => onFilter(e.target.value)}
            placeholder="Search kit…"
            style={{ border: 0, outline: 0, background: 'transparent', fontSize: 13, width: '100%', color: ui.text }}
          />
        </div>
      </div>
      <div style={{ padding: '4px 12px', flex: 1, overflow: 'auto' }}>
        <div style={{
          padding: '10px 8px 8px', fontSize: 11, fontWeight: 600, letterSpacing: 0.6,
          color: ui.textFaint, textTransform: 'uppercase',
        }}>
          {loading ? 'Loading…' : `${shown.length} components`}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {shown.map((item) => {
            const isSel = item.name === selected;
            return (
              <button
                key={item.name} onClick={() => onSelect(item.name)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  textAlign: 'left', width: '100%',
                  background: isSel ? ui.pill : 'transparent',
                  color: isSel ? ui.text : ui.textMuted,
                  border: `1px solid ${isSel ? ui.pillBorder : 'transparent'}`,
                  borderRadius: 10, padding: '10px 14px', fontSize: 13, cursor: 'pointer', fontWeight: 500,
                }}
              >
                <span>{item.name}</span>
                <span style={{ fontSize: 11, color: ui.textFaint }}>{item.classes.length}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

// ─────────────────────────── variant tabs ───────────────────────────

function VariantTabs({ variants, active, onChange }) {
  if (variants.length <= 1) return null;
  return (
    <div style={{
      display: 'inline-flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center',
      background: ui.panel, padding: 6, borderRadius: 10,
      border: `1px solid ${ui.panelLine}`, maxWidth: 880,
    }}>
      {variants.map((v, i) => (
        <button
          key={i} onClick={() => onChange(i)}
          style={{
            padding: '6px 12px', fontSize: 12, borderRadius: 6, cursor: 'pointer',
            background: active === i ? ui.accent : 'transparent',
            color: active === i ? ui.accentText : ui.textMuted,
            border: `1px solid ${active === i ? ui.accent : 'transparent'}`,
            fontFamily: 'inherit', fontWeight: 500,
          }}
        >{v.variant || `Variant ${i + 1}`}</button>
      ))}
    </div>
  );
}

// ─────────────────────────── canvas ───────────────────────────

function Placeholder({ message }) {
  return (
    <div style={{ flex: 1, display: 'grid', placeItems: 'center', background: ui.canvas, color: ui.textMuted, padding: 48 }}>
      <span style={{ fontSize: 13 }}>{message}</span>
    </div>
  );
}

// Status of the selected component within the org's kit.
function StatusBadge({ component }) {
  const src = component.source ?? 'base';
  const map = {
    base:     { label: 'Brandsync base', bg: ui.pill, line: ui.pillBorder, fg: ui.textMuted },
    override: component.pending
      ? { label: 'Edited · pending approval', bg: '#fff7e6', line: '#f6d98a', fg: '#92610a' }
      : { label: 'Edited · approved',         bg: '#e9f7ee', line: '#bfe6cd', fg: '#1f7a44' },
    add: component.pending
      ? { label: 'New · pending approval', bg: '#fff7e6', line: '#f6d98a', fg: '#92610a' }
      : { label: 'New · approved',         bg: '#e9f7ee', line: '#bfe6cd', fg: '#1f7a44' },
  };
  const s = map[src] || map.base;
  return (
    <span style={{ ...pillStyle, fontSize: 11, background: s.bg, border: `1px solid ${s.line}`, color: s.fg }}>
      {s.label}
    </span>
  );
}

// The primary editing surface: describe a change (optionally with a reference
// image) → cheap scoped AI edit.
function EditBar({ busy, feedback, onSubmit }) {
  const [text, setText] = useState('');
  const [imgs, setImgs] = useState([]); // { id, name, mediaType, data, dataUrl }
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = String(reader.result || '');
        const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (!m) return;
        setImgs((prev) => (prev.length >= 4 ? prev : [...prev, {
          id: `${file.name}-${file.size}-${prev.length}`, name: file.name, mediaType: m[1], data: m[2], dataUrl,
        }]));
      };
      reader.readAsDataURL(file);
    });
  };
  const submit = () => {
    const t = text.trim();
    if ((!t && !imgs.length) || busy) return;
    onSubmit(t || 'Update this component to match the attached reference.', imgs.map((i) => ({ mediaType: i.mediaType, data: i.data })));
    setText(''); setImgs([]);
  };

  return (
    <div style={{ width: '100%', maxWidth: 880, margin: '24px auto 0' }}>
      {feedback && (
        <div style={{
          fontSize: 12, marginBottom: 8, padding: '8px 12px', borderRadius: 8,
          background: feedback.error ? '#fdecec' : ui.brandSoft,
          border: `1px solid ${feedback.error ? '#f3c0c0' : ui.brandLine}`,
          color: feedback.error ? '#a12020' : '#4c1d95',
        }}>
          {feedback.error
            ? `Couldn't apply: ${feedback.error}`
            : <>
                {feedback.summary && <div>{feedback.summary}</div>}
                {(feedback.warnings || []).map((w, i) => (
                  <div key={i} style={{ color: '#92610a' }}>⚠ {w}</div>
                ))}
              </>}
        </div>
      )}
      {imgs.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {imgs.map((img) => (
            <div key={img.id} style={{ position: 'relative', width: 44, height: 44 }}>
              <img src={img.dataUrl} alt={img.name}
                style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, border: `1px solid ${ui.panelLine}`, display: 'block' }} />
              <button aria-label={`Remove ${img.name}`}
                onClick={() => setImgs((prev) => prev.filter((i) => i.id !== img.id))}
                style={{
                  position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: 999,
                  background: '#15181d', color: '#fff', border: '2px solid #fff', cursor: 'pointer',
                  display: 'grid', placeItems: 'center', fontSize: 9, lineHeight: 1, padding: 0,
                }}>×</button>
            </div>
          ))}
        </div>
      )}
      <div
        onDragOver={(e) => { e.preventDefault(); if (!busy) setDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
        onDrop={(e) => {
          e.preventDefault(); setDragOver(false);
          const f = [...(e.dataTransfer?.files || [])].filter((x) => x.type.startsWith('image/'));
          if (f.length && !busy) addFiles(f);
        }}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: ui.panel,
          border: `1px ${dragOver ? 'dashed' : 'solid'} ${dragOver ? ui.brand : ui.panelLine}`,
          borderRadius: 12, padding: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          transition: 'border-color 120ms ease',
        }}>
        <label title="Attach reference image" style={{
          width: 30, height: 30, borderRadius: 8, display: 'grid', placeItems: 'center',
          color: ui.textMuted, cursor: busy ? 'not-allowed' : 'pointer',
          border: `1px solid ${ui.pillBorder}`, opacity: busy ? 0.5 : 1, flexShrink: 0,
        }}>
          <Paperclip size={15} />
          <input type="file" accept="image/*" multiple hidden disabled={busy}
            onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
        </label>
        <input
          value={text} onChange={(e) => setText(e.target.value)}
          onPaste={(e) => {
            const f = [...(e.clipboardData?.files || [])].filter((x) => x.type.startsWith('image/'));
            if (f.length) { e.preventDefault(); addFiles(f); }
          }}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
          placeholder="Describe a change — or paste a reference image"
          disabled={busy}
          style={{ flex: 1, border: 0, outline: 0, background: 'transparent', fontSize: 13, color: ui.text }}
        />
        <button
          onClick={submit} disabled={busy || (!text.trim() && !imgs.length)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: busy ? ui.pill : ui.brand, color: busy ? ui.textMuted : '#fff',
            border: 0, borderRadius: 8, padding: '8px 14px', fontSize: 13,
            fontWeight: 500, cursor: (busy || (!text.trim() && !imgs.length)) ? 'default' : 'pointer',
            opacity: (!text.trim() && !imgs.length && !busy) ? 0.5 : 1,
          }}
        >
          <Sparkle size={14} weight="fill" /> {busy ? 'Editing…' : 'Edit'}
        </button>
      </div>
    </div>
  );
}

function Canvas({ component, tokensCss, kitCss, mode, viewport, theme, onViewportChange, onThemeChange,
                 isAdmin, editBusy, editFeedback, onEdit, onApprove, onRevert }) {
  const [activeVariant, setActiveVariant] = useState(0);
  useEffect(() => { setActiveVariant(0); }, [component?.name]);

  if (!component) return <Placeholder message="Pick a component from the kit." />;

  // ── Classes view: the actual surface generation composes from. ──
  if (mode === 'classes') {
    return (
      <div style={{ flex: 1, overflow: 'auto', background: ui.canvas, padding: '32px 48px 72px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{ background: ui.brandSoft, border: `1px solid ${ui.brandLine}`, borderRadius: 12, padding: '14px 18px', marginBottom: 20, color: '#4c1d95', fontSize: 13, lineHeight: 1.5 }}>
            When you generate a pattern, the AI is told these classes already exist and styles itself with them — it does <strong>not</strong> re-write the CSS. That is the token saving.
          </div>
          <div style={{ background: ui.panel, border: `1px solid ${ui.panelLine}`, borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14, color: ui.text }}>
              {component.name} · {component.classes.length} classes
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {component.classes.map((c) => (
                <code key={c} style={{
                  fontSize: 12, fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
                  background: ui.pill, border: `1px solid ${ui.pillBorder}`,
                  borderRadius: 6, padding: '4px 9px', color: ui.text,
                }}>.{c}</code>
              ))}
              {component.classes.length === 0 && (
                <span style={{ fontSize: 12, color: ui.textMuted }}>No bs-* classes detected for this component.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Preview view ──
  const variants = component.variants || [];
  if (variants.length === 0) return <Placeholder message="This component has no preview markup." />;
  const current = variants[activeVariant] ?? variants[0];
  const srcDoc = buildPreviewDoc(current.html, tokensCss, kitCss, theme);
  const vp = VIEWPORTS[viewport];
  const iframeBg = theme === 'light' ? '#ffffff' : '#191c22';

  const canRevert = (component.source ?? 'base') !== 'base';
  const canApprove = isAdmin && component.pending;

  return (
    <div style={{ flex: 1, background: ui.canvas, padding: '32px 48px 72px', overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* component status + approve / revert */}
      <div style={{ width: '100%', maxWidth: 880, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{component.name}</span>
        <StatusBadge component={component} />
        <div style={{ flex: 1 }} />
        {canApprove && (
          <button onClick={onApprove} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1f7a44', color: '#fff',
            border: 0, borderRadius: 8, padding: '7px 13px', fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
          }}><Check size={14} weight="bold" /> Approve for team</button>
        )}
        {canRevert && (
          <button onClick={onRevert} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', color: ui.textMuted,
            border: `1px solid ${ui.pillBorder}`, borderRadius: 8, padding: '7px 13px', fontSize: 12.5, cursor: 'pointer',
          }}><ArrowCounterClockwise size={14} /> Revert</button>
        )}
      </div>

      <CanvasControlBar viewport={viewport} onViewportChange={onViewportChange} theme={theme} onThemeChange={onThemeChange} />
      <VariantTabs variants={variants} active={activeVariant} onChange={setActiveVariant} />
      <div style={{
        width: vp.width, height: vp.height, flexShrink: 0,
        display: 'flex', borderRadius: 14, overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.08)',
        border: `1px solid ${ui.panelLine}`, background: iframeBg,
        marginTop: 20, transition: 'width 180ms ease, height 180ms ease',
      }}>
        <iframe title={`${component.name} — ${current.variant}`} srcDoc={srcDoc} sandbox="" style={{ width: '100%', height: '100%', border: 0, background: iframeBg }} />
      </div>

      <EditBar busy={editBusy} feedback={editFeedback} onSubmit={onEdit} />
    </div>
  );
}

// ─────────────────────────── page ───────────────────────────

export default function ComponentKitPage() {
  const [catalog, setCatalog] = useState([]);
  const [kitCss, setKitCss] = useState('');
  const [tokensCss, setTokensCss] = useState('');
  const [counts, setCounts] = useState({ componentCount: null, variantCount: null });
  const [selectedName, setSelectedName] = useState(null);
  const [filter, setFilter] = useState('');
  const [mode, setMode] = useState('preview');
  const [viewport, setViewport] = useState('desktop');
  const [theme, setTheme] = useState('dark');
  const [orgName, setOrgName] = useState(null);
  const [orgId, setOrgId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editBusy, setEditBusy] = useState(false);
  const [editFeedback, setEditFeedback] = useState(null);

  // Refetch the org-scoped kit (+ css). Reused after every mutation so the
  // catalog, combined css, and per-component status stay consistent.
  const reloadKit = useCallback(async (oid) => {
    const qs = `orgId=${encodeURIComponent(oid ?? '')}&userEmail=${encodeURIComponent(USER_EMAIL)}`;
    const [kitRes, cssRes] = await Promise.all([
      fetch(`/api/kit?${qs}`),
      fetch(`/api/kit?css=1&${qs}`),
    ]);
    const kit = await kitRes.json();
    if (!kitRes.ok) throw new Error(kit?.error ?? `HTTP ${kitRes.status}`);
    const css = cssRes.ok ? await cssRes.text() : '';
    setCatalog(kit.catalog || []);
    setKitCss(css);
    setCounts({ componentCount: kit.componentCount ?? (kit.catalog || []).length, variantCount: kit.variantCount ?? null });
    return kit;
  }, []);

  useEffect(() => {
    const oid = getStoredOrgId();
    setOrgId(oid);
    Promise.all([
      reloadKit(oid),
      fetch('/api/tokens').then((r) => (r.ok ? r.text() : '')),
      fetch(`/api/orgs?userEmail=${encodeURIComponent(USER_EMAIL)}`)
        .then((r) => (r.ok ? r.json() : { orgs: [] }))
        .catch(() => ({ orgs: [] })),
    ])
      .then(([kit, tokens, orgsBody]) => {
        setTokensCss(tokens || '');
        const cat = kit.catalog || [];
        if (cat.length) setSelectedName((prev) => prev ?? cat[0].name);
        const org = (orgsBody.orgs || []).find((o) => o.id === oid) || (orgsBody.orgs || []).find((o) => o.is_default);
        setOrgName(org?.name ?? null);
        setIsAdmin(org?.my_role === 'admin');
      })
      .catch((e) => setError(e?.message ?? 'Failed to load the component kit'))
      .finally(() => setLoading(false));
  }, [reloadKit]);

  const selected = useMemo(
    () => catalog.find((c) => c.name === selectedName) ?? null,
    [catalog, selectedName],
  );

  // Drop edit feedback when moving to a different component.
  useEffect(() => { setEditFeedback(null); }, [selectedName]);

  const handleEdit = useCallback(async (instruction, images = []) => {
    if (!selected) return;
    setEditBusy(true); setEditFeedback(null);
    try {
      const res = await fetch('/api/kit/edit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId, userEmail: USER_EMAIL, name: selected.name, instruction, images }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? `HTTP ${res.status}`);
      await reloadKit(orgId);
      setEditFeedback({ summary: body.summary, warnings: body.warnings });
    } catch (e) {
      setEditFeedback({ error: e?.message ?? 'edit failed' });
    } finally {
      setEditBusy(false);
    }
  }, [selected, orgId, reloadKit]);

  const handleApprove = useCallback(async () => {
    if (!selected) return;
    try {
      const res = await fetch('/api/kit/override', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId, userEmail: USER_EMAIL, name: selected.name, approved: true }),
      });
      if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error(b.error ?? `HTTP ${res.status}`); }
      await reloadKit(orgId);
    } catch (e) { setEditFeedback({ error: e?.message ?? 'approve failed' }); }
  }, [selected, orgId, reloadKit]);

  const handleRevert = useCallback(async () => {
    if (!selected) return;
    try {
      const qs = `orgId=${encodeURIComponent(orgId ?? '')}&userEmail=${encodeURIComponent(USER_EMAIL)}&name=${encodeURIComponent(selected.name)}`;
      const res = await fetch(`/api/kit/override?${qs}`, { method: 'DELETE' });
      if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error(b.error ?? `HTTP ${res.status}`); }
      await reloadKit(orgId);
      setEditFeedback(null);
    } catch (e) { setEditFeedback({ error: e?.message ?? 'revert failed' }); }
  }, [selected, orgId, reloadKit]);

  return (
    <div style={{
      height: 'calc(100vh - 64px)', background: ui.bg, color: ui.text,
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      display: 'flex', flexDirection: 'column',
    }}>
      <TopBar
        orgName={orgName}
        componentCount={counts.componentCount}
        variantCount={counts.variantCount}
        mode={mode} onModeChange={setMode}
      />
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <LeftSidebar
          items={catalog} selected={selectedName} onSelect={setSelectedName}
          loading={loading} filter={filter} onFilter={setFilter}
        />
        {error ? (
          <Placeholder message={`Error: ${error}`} />
        ) : loading ? (
          <Placeholder message="Loading the kit…" />
        ) : (
          <Canvas
            component={selected} tokensCss={tokensCss} kitCss={kitCss}
            mode={mode} viewport={viewport} theme={theme}
            onViewportChange={setViewport} onThemeChange={setTheme}
            isAdmin={isAdmin} editBusy={editBusy} editFeedback={editFeedback}
            onEdit={handleEdit} onApprove={handleApprove} onRevert={handleRevert}
          />
        )}
      </div>
    </div>
  );
}
