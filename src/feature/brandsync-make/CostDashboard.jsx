"use client";
import { getUserEmail } from "@/lib/userEmail";

import { useEffect, useMemo, useState } from "react";

// Cost & savings dashboard for BrandSync Make. Reads /api/brandsync-make/cost
// (aggregated tool_usage_logs) for BrandSync's REAL spend, and frames savings
// against a MEASURED Figma Make benchmark: the same EG Facilit app was built in
// both tools on the same model (claude-sonnet-4-6), at Anthropic API rates.
//   Figma Make:  $14.97 · 18.9M tokens · 211,736 output · 15 prompts
//   BrandSync:   $1.07  · 0.37M tokens · 65,435 output · 17 generations
// → ~14× cheaper, ~51× fewer tokens. The benchmark figures are editable.
const BENCHMARK_KEY = "brandsync-make:figma-benchmark-v1";

// Measured, same-app benchmark (June 2026 Figma Make session report).
const BENCHMARK_DEFAULTS = {
  figmaCost: 14.97, figmaTokens: 18_900_000, figmaOutput: 211_736, figmaPrompts: 15,
  bsCost: 1.07, bsTokens: 372_687, bsOutput: 65_435, bsGens: 17,
};

const fmtUSD = (n) => (n == null ? "—" : `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
const fmtUSD0 = (n) => (n == null ? "—" : `$${Number(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`);
const fmtNum = (n) => Number(n || 0).toLocaleString("en-US");
const fmtTok = (n) => {
  const v = Number(n || 0);
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}k`;
  return String(v);
};

function Card({ label, value, sub, accent }) {
  return (
    <div style={{ background: "var(--bs-surface-raised)", border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-200)", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
      <div style={{ fontSize: 12, color: "var(--bs-text-muted)", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: accent || "var(--bs-text-default)", lineHeight: 1.15 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--bs-text-muted)" }}>{sub}</div>}
    </div>
  );
}

function NumberField({ label, value, onChange, prefix, step = 1, width = 90 }) {
  return (
    <label style={{ display: "inline-flex", flexDirection: "column", gap: 4, fontSize: 12, color: "var(--bs-text-muted)" }}>
      <span>{label}</span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        {prefix && <span style={{ color: "var(--bs-text-muted)" }}>{prefix}</span>}
        <input type="number" min={0} step={step} value={value} onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          style={{ width, padding: "6px 8px", fontSize: 14, background: "var(--bs-surface-raised)", border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-75)", color: "var(--bs-text-default)" }} />
      </span>
    </label>
  );
}

function TrendChart({ daily }) {
  const max = Math.max(1, ...daily.map((d) => d.cost));
  if (!daily.length) return <div style={{ color: "var(--bs-text-muted)", fontSize: 13, padding: "24px 0" }}>No generations in the last 30 days yet.</div>;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 140, paddingTop: 8 }}>
      {daily.map((d) => (
        <div key={d.day} title={`${d.day} · ${d.screens} screen${d.screens === 1 ? "" : "s"} · ${fmtUSD(d.cost)}`}
          style={{ flex: 1, height: Math.max(2, Math.round((d.cost / max) * 130)), background: "var(--bs-color-primary-default)", borderRadius: "3px 3px 0 0", minWidth: 4, opacity: 0.85 }} />
      ))}
    </div>
  );
}

export default function CostDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [bm, setBm] = useState(BENCHMARK_DEFAULTS);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(BENCHMARK_KEY) || "null");
      if (s && typeof s === "object") setBm({ ...BENCHMARK_DEFAULTS, ...s });
    } catch { /* private mode */ }
    fetch(`/api/brandsync-make/cost?userEmail=${encodeURIComponent(getUserEmail())}`)
      .then((r) => r.json())
      .then((b) => { if (b?.error) setError(b.error); else setData(b); })
      .catch((e) => setError(e.message));
  }, []);

  const setBmField = (key) => (val) => {
    setBm((prev) => {
      const next = { ...prev, [key]: val };
      try { localStorage.setItem(BENCHMARK_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  // The measured cost multiple — how many × more Figma Make cost for the same app.
  const multiple = bm.bsCost > 0 ? bm.figmaCost / bm.bsCost : 0;
  const tokenMultiple = bm.bsTokens > 0 ? bm.figmaTokens / bm.bsTokens : 0;

  // Savings = BrandSync's REAL spend × (measured multiple − 1).
  const savings = useMemo(() => {
    if (!data) return null;
    const out = {};
    for (const k of ["today", "7d", "30d", "all"]) {
      const w = data.windows[k];
      const figmaEquiv = w.cost * multiple;
      out[k] = { screens: w.screens, actual: w.cost, figmaEquiv, net: figmaEquiv - w.cost };
    }
    return out;
  }, [data, multiple]);

  if (error) return <div style={{ padding: 40, color: "var(--bs-color-error-default)" }}>Couldn’t load usage: {error}</div>;
  if (!data || !savings) return <div style={{ padding: 40, color: "var(--bs-text-muted)" }}>Loading usage…</div>;

  const w30 = data.windows["30d"];
  const s30 = savings["30d"];
  const sAll = savings["all"];
  const cacheShare = w30.inTokens + w30.cacheTokens > 0 ? Math.round((w30.cacheTokens / (w30.inTokens + w30.cacheTokens)) * 100) : 0;
  const outputCost = w30.outTokens * 15 / 1e6;
  const cacheCost = w30.cacheTokens * 0.3 / 1e6;
  const cacheWriteCost = (w30.cacheWriteTokens || 0) * 3.75 / 1e6;
  const inputCost = w30.inTokens * 3 / 1e6;
  const outputShare = w30.cost > 0 ? Math.round((outputCost / w30.cost) * 100) : 0;
  const cacheSaved = w30.cacheTokens * (3 - 0.3) / 1e6;

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "32px 24px 64px" }}>
      <div style={{ marginBottom: 4, fontSize: 13, color: "var(--bs-color-primary-default)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>BrandSync Make</div>
      <h1 style={{ margin: "0 0 6px", fontSize: 28, fontWeight: 700, color: "var(--bs-text-default)" }}>Cost &amp; savings</h1>
      <p style={{ margin: "0 0 24px", color: "var(--bs-text-muted)", fontSize: 14, maxWidth: 680 }}>
        BrandSync’s real token spend, and the savings vs Figma Make — grounded in a measured benchmark where the
        same app was built in both tools on the same model.
      </p>

      {/* Measured benchmark — the hero */}
      <div style={{ border: "1px solid var(--bs-color-primary-default)", borderRadius: "var(--bs-border-radius-300)", background: "var(--bs-color-primary-container)", padding: "20px 22px", marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--bs-color-primary-default)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Measured benchmark · same app · same model</div>
          <div style={{ fontSize: 11, color: "var(--bs-text-muted)" }}>EG Facilit · claude-sonnet-4-6 · Anthropic API rates</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 18, alignItems: "center" }}>
          <div style={{ background: "var(--bs-surface-raised)", border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-200)", padding: "16px 18px" }}>
            <div style={{ fontSize: 12, color: "var(--bs-text-muted)", fontWeight: 600 }}>Figma Make</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--bs-text-default)", lineHeight: 1.1 }}>{fmtUSD(bm.figmaCost)}</div>
            <div style={{ fontSize: 12, color: "var(--bs-text-muted)" }}>{fmtTok(bm.figmaTokens)} tokens · {fmtNum(bm.figmaOutput)} output · {bm.figmaPrompts} prompts</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: "var(--bs-color-success-default)" }}>{multiple.toFixed(0)}×</div>
            <div style={{ fontSize: 11, color: "var(--bs-text-muted)" }}>cheaper</div>
          </div>
          <div style={{ background: "var(--bs-surface-raised)", border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-200)", padding: "16px 18px" }}>
            <div style={{ fontSize: 12, color: "var(--bs-color-primary-default)", fontWeight: 600 }}>BrandSync Make</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "var(--bs-color-primary-default)", lineHeight: 1.1 }}>{fmtUSD(bm.bsCost)}</div>
            <div style={{ fontSize: 12, color: "var(--bs-text-muted)" }}>{fmtTok(bm.bsTokens)} tokens · {fmtNum(bm.bsOutput)} output · {bm.bsGens} generations</div>
          </div>
        </div>
        <div style={{ fontSize: 12.5, color: "var(--bs-text-muted)", marginTop: 14, lineHeight: 1.6 }}>
          Same EG Facilit UI, built in both tools. BrandSync used <strong style={{ color: "var(--bs-text-default)" }}>~{tokenMultiple.toFixed(0)}× fewer tokens</strong> — it references a
          cached component kit and edits in scopes, while Figma re-processes the whole codebase each turn (78% of its cost was context, not output).
        </div>
      </div>

      {/* BrandSync's real spend + projected savings at the measured multiple */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 14 }}>
        <Card label="BrandSync cost · 30 days" value={fmtUSD(w30.cost)} sub={`${fmtNum(w30.gens)} generations · ${fmtNum(w30.screens)} screens`} />
        <Card label="Figma Make equivalent · 30d" value={fmtUSD0(s30.figmaEquiv)} sub={`your spend × ${multiple.toFixed(0)}× (measured)`} />
        <Card label="Net saved · 30 days" value={fmtUSD0(s30.net)} sub="vs Figma Make, measured ratio" accent={s30.net >= 0 ? "var(--bs-color-success-default)" : "var(--bs-color-error-default)"} />
        <Card label="Avg cost / screen" value={w30.screens ? fmtUSD(w30.cost / w30.screens) : "—"} sub={`${fmtNum(w30.screens)} screens this month`} />
      </div>

      {/* Token economy — where BrandSync's own cost goes */}
      <div style={{ background: "var(--bs-surface-container)", border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-150)", padding: "16px 18px", marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--bs-text-default)", marginBottom: 10 }}>Token economy — where BrandSync’s cost goes (30 days)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 13, color: "var(--bs-text-muted)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--bs-text-default)" }}>Output is {outputShare}% of spend</strong> ({fmtUSD(outputCost)} of {fmtUSD(w30.cost)}). Output costs 5× input — the lever is <strong style={{ color: "var(--bs-text-default)" }}>scope discipline</strong>.
          </div>
          <div style={{ fontSize: 13, color: "var(--bs-text-muted)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--bs-color-success-default)" }}>Caching saved {fmtUSD(cacheSaved)}</strong> — {cacheShare}% of input from cache at 1/10th price ({fmtTok(w30.cacheTokens)} reads cost {fmtUSD(cacheCost)} vs {fmtUSD(w30.cacheTokens * 3 / 1e6)}).
          </div>
          <div style={{ fontSize: 13, color: "var(--bs-text-muted)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--bs-text-default)" }}>Uncached input is {fmtUSD(inputCost)}</strong> — effectively free. Input is never the problem here; output is.
          </div>
          <div style={{ fontSize: 13, color: "var(--bs-text-muted)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--bs-text-default)" }}>Cache writes are {fmtUSD(cacheWriteCost)}</strong> — the cold-start cost of seeding the cache at 1.25× input ({fmtTok(w30.cacheWriteTokens || 0)} tokens). Now counted in spend, so this figure is true cost, not an estimate.
          </div>
        </div>
      </div>

      {/* Trend */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--bs-text-default)", marginBottom: 8 }}>BrandSync spend · last 30 days</div>
        <div style={{ background: "var(--bs-surface-raised)", border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-200)", padding: "12px 16px 16px" }}>
          <TrendChart daily={data.daily} />
        </div>
      </div>

      {/* Per-project table */}
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--bs-text-default)", marginBottom: 8 }}>By project · last 30 days</div>
      <div style={{ background: "var(--bs-surface-raised)", border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-200)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "10px 16px", fontSize: 12, fontWeight: 600, color: "var(--bs-text-muted)", borderBottom: "1px solid var(--bs-border-default)" }}>
          <div>Project</div>
          <div style={{ textAlign: "right" }}>Screens</div>
          <div style={{ textAlign: "right" }}>Output tok</div>
          <div style={{ textAlign: "right" }}>BrandSync</div>
          <div style={{ textAlign: "right" }}>Net saved</div>
        </div>
        {data.byProject.length === 0 && <div style={{ padding: "16px", color: "var(--bs-text-muted)", fontSize: 13 }}>No project-attributed generations in the last 30 days.</div>}
        {data.byProject.map((p) => {
          const net = p.cost * (multiple - 1);
          return (
            <a key={p.projectId} href={`/brandsync-make/usage/${p.projectId}`} title="View this project's generation ledger"
              style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "11px 16px", fontSize: 13, color: "var(--bs-text-default)", borderBottom: "1px solid var(--bs-border-default)", alignItems: "center", textDecoration: "none", cursor: "pointer" }}>
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500, color: "var(--bs-color-primary-default)" }}>{p.name}</div>
              <div style={{ textAlign: "right", color: "var(--bs-text-muted)" }}>{fmtNum(p.screens)}</div>
              <div style={{ textAlign: "right", color: "var(--bs-text-muted)" }}>{fmtTok(p.outTokens)}</div>
              <div style={{ textAlign: "right" }}>{fmtUSD(p.cost)}</div>
              <div style={{ textAlign: "right", fontWeight: 600, color: net >= 0 ? "var(--bs-color-success-default)" : "var(--bs-color-error-default)" }}>{fmtUSD0(net)}</div>
            </a>
          );
        })}
      </div>

      {/* Editable benchmark (transparency) */}
      <div style={{ background: "var(--bs-surface-container)", border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-150)", padding: "16px 18px", marginTop: 26 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--bs-text-default)", marginBottom: 12 }}>Benchmark figures (from the measured Figma Make session)</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 22, alignItems: "flex-end" }}>
          <NumberField label="Figma Make — same app" prefix="$" value={bm.figmaCost} onChange={setBmField("figmaCost")} step={0.5} width={80} />
          <NumberField label="BrandSync — same app" prefix="$" value={bm.bsCost} onChange={setBmField("bsCost")} step={0.1} width={70} />
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "var(--bs-text-muted)" }}>Measured cost multiple</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--bs-color-success-default)" }}>{multiple.toFixed(1)}×</div>
          </div>
        </div>
        <div style={{ fontSize: 11.5, color: "var(--bs-text-muted)", marginTop: 12, lineHeight: 1.6 }}>
          From a real Figma Make session (June 2026) building the same EG Facilit app at Anthropic API rates. Net-saved figures
          above apply this measured multiple to BrandSync’s actual logged spend. Caveat: Figma produces a working React app vs
          BrandSync’s HTML/CSS patterns, so it’s same‑UI, not byte‑identical output.
        </div>
      </div>
    </div>
  );
}
