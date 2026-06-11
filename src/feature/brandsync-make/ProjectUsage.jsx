"use client";
import { getUserEmail } from "@/lib/userEmail";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Per-project token-consumption documentation. Reads /api/brandsync-make/
// project-usage and shows the project's totals plus a chronological ledger of
// every generation (tokens + cost + running total) that grows as you design.
// "Export" copies the ledger as Markdown so it can be pasted into a doc/ticket.

// Figma Make baseline — SAME key + shape the Cost & savings screen persists, so
// the assumptions are shared. Read-only here; adjust them on Cost & savings.
const BASELINE_KEY = "brandsync-make:figma-baseline-v2";
const BASELINE_DEFAULTS = { creditsPerSeat: 3500, seatCostUsd: 45, creditsPerScreen: 20 };
function loadBaseline() {
  try {
    const s = JSON.parse(localStorage.getItem(BASELINE_KEY) || "null");
    return s && typeof s === "object" ? { ...BASELINE_DEFAULTS, ...s } : { ...BASELINE_DEFAULTS };
  } catch { return { ...BASELINE_DEFAULTS }; }
}
function perScreenFigma(b) {
  const usdPerCredit = b.creditsPerSeat > 0 ? b.seatCostUsd / b.creditsPerSeat : 0;
  const ai = b.creditsPerScreen * usdPerCredit;          // AI-credit cost / screen
  return { usdPerCredit, ai, total: ai };
}

const fmtUSD = (n) => (n == null ? "—" : `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`);
const fmtUSD2 = (n) => (n == null ? "—" : `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
const fmtNum = (n) => Number(n || 0).toLocaleString("en-US");
const fmtTok = (n) => {
  const v = Number(n || 0);
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}k`;
  return String(v);
};
const fmtTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
};

function Stat({ label, value, sub, accent }) {
  return (
    <div style={{ background: "var(--bs-surface-raised)", border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-200)", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={{ fontSize: 12, color: "var(--bs-text-muted)", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: accent || "var(--bs-text-default)", lineHeight: 1.15 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--bs-text-muted)" }}>{sub}</div>}
    </div>
  );
}

export default function ProjectUsage({ projectId }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [baseline, setBaseline] = useState(BASELINE_DEFAULTS);
  useEffect(() => { setBaseline(loadBaseline()); }, []);
  const figma = perScreenFigma(baseline);

  const load = () => {
    fetch(`/api/brandsync-make/project-usage?userEmail=${encodeURIComponent(getUserEmail())}&projectId=${encodeURIComponent(projectId)}`)
      .then((r) => r.json())
      .then((b) => { if (b?.error) setError(b.error); else { setData(b); setError(null); } })
      .catch((e) => setError(e.message));
  };
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [projectId]);

  const exportMarkdown = () => {
    if (!data) return;
    const name = data.project?.name ?? "Project";
    const lines = [
      `# Token consumption — ${name}`,
      ``,
      `Model: ${data.pricing.model} · priced at $${data.pricing.inputPerMtok}/Mtok in · $${data.pricing.cacheReadPerMtok}/Mtok cache · $${data.pricing.outputPerMtok}/Mtok out`,
      ``,
      `**Totals:** ${fmtNum(data.totals.screens)} screens · ${fmtNum(data.totals.gens)} generations · ` +
        `${fmtNum(data.totals.inTokens)} in / ${fmtNum(data.totals.cacheTokens)} cache / ${fmtNum(data.totals.outTokens)} out · ` +
        `est ${fmtUSD2(data.totals.cost)}`,
      ``,
      `**Token economy:** output was ${data.totals.cost > 0 ? Math.round((data.totals.outTokens * 15 / 1e6 / data.totals.cost) * 100) : 0}% of cost; ` +
        `caching saved ${fmtUSD2(data.totals.cacheTokens * (3 - 0.3) / 1e6)} ` +
        `(${data.totals.inTokens + data.totals.cacheTokens > 0 ? Math.round((data.totals.cacheTokens / (data.totals.inTokens + data.totals.cacheTokens)) * 100) : 0}% of input from cache); ` +
        `${fmtUSD(data.totals.cost / Math.max(1, data.totals.screens))} / screen.`,
      ``,
      `**vs Figma Make (AI-credit cost):** ${data.totals.screens} screens cost ${fmtUSD2(data.totals.cost)} here vs ~${fmtUSD2(data.totals.screens * figma.ai)} on Figma Make ` +
        `(${fmtNum(data.totals.screens * baseline.creditsPerScreen)} credits) → **net saved ~${fmtUSD2(data.totals.screens * figma.ai - data.totals.cost)}**.`,
      ``,
      `| # | When | Status | In | Cache | Out | Cost | Cumulative |`,
      `|---|------|--------|----|-------|-----|------|------------|`,
      ...data.ledger.map((r, i) =>
        `| ${i + 1} | ${fmtTime(r.at)} | ${r.success ? "ok" : "failed"} | ${r.inTokens} | ${r.cacheTokens} | ${r.outTokens} | ${fmtUSD(r.cost)} | ${fmtUSD(r.cumulativeCost)} |`),
    ];
    const md = lines.join("\n");
    navigator.clipboard?.writeText(md).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }).catch(() => {});
  };

  if (error) return <div style={{ padding: 40, color: "var(--bs-color-error-default)" }}>Couldn’t load usage: {error}</div>;
  if (!data) return <div style={{ padding: 40, color: "var(--bs-text-muted)" }}>Loading project usage…</div>;

  const { totals, ledger } = data;

  // Token-economy breakdown for THIS project (Sonnet 4.6 list price).
  const outputCost = totals.outTokens * 15 / 1e6;
  const inputCost = totals.inTokens * 3 / 1e6;
  const cacheCost = totals.cacheTokens * 0.3 / 1e6;
  const outputShare = totals.cost > 0 ? Math.round((outputCost / totals.cost) * 100) : 0;
  const cacheShare = totals.inTokens + totals.cacheTokens > 0
    ? Math.round((totals.cacheTokens / (totals.inTokens + totals.cacheTokens)) * 100) : 0;
  const cacheSaved = totals.cacheTokens * (3 - 0.3) / 1e6; // vs paying reads as fresh input

  // vs Figma Make for THIS project's screens — AI-credit cost only.
  const figmaTotal = totals.screens * figma.ai;
  const figmaCredits = totals.screens * baseline.creditsPerScreen;
  const seatMonths = baseline.creditsPerSeat > 0 ? figmaCredits / baseline.creditsPerSeat : 0;
  const netSaved = figmaTotal - totals.cost;

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "32px 24px 64px" }}>
      <button onClick={() => router.push("/brandsync-make/usage")} style={{ background: "none", border: 0, color: "var(--bs-text-muted)", cursor: "pointer", fontSize: 13, padding: 0, marginBottom: 14 }}>
        ← Cost &amp; savings
      </button>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 13, color: "var(--bs-color-primary-default)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Project usage</div>
          <h1 style={{ margin: "2px 0 0", fontSize: 26, fontWeight: 700, color: "var(--bs-text-default)" }}>{data.project?.name ?? "Project"}</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={load} style={{ fontSize: 13, padding: "7px 12px", borderRadius: "var(--bs-border-radius-75)", border: "1px solid var(--bs-border-default)", background: "var(--bs-surface-raised)", color: "var(--bs-text-default)", cursor: "pointer" }}>Refresh</button>
          <button onClick={exportMarkdown} style={{ fontSize: 13, padding: "7px 12px", borderRadius: "var(--bs-border-radius-75)", border: "1px solid var(--bs-color-primary-default)", background: "var(--bs-color-primary-default)", color: "var(--bs-text-on-action, #fff)", cursor: "pointer", fontWeight: 600 }}>
            {copied ? "Copied ✓" : "Export Markdown"}
          </button>
        </div>
      </div>
      <p style={{ margin: "0 0 22px", color: "var(--bs-text-muted)", fontSize: 14 }}>
        Every screen you design in this project is logged here — tokens and estimated cost, with a running total.
      </p>

      {/* Totals */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 26 }}>
        <Stat label="Total cost" value={fmtUSD2(totals.cost)} sub={`today ${fmtUSD2(totals.today.cost)}`} accent="var(--bs-color-primary-default)" />
        <Stat label="Screens" value={fmtNum(totals.screens)} sub={`${fmtNum(totals.gens)} generations · ${fmtNum(totals.screensToday)} today`} />
        <Stat label="Output tokens" value={fmtTok(totals.outTokens)} sub="the expensive ones (5× input)" />
        <Stat label="Input tokens" value={fmtTok(totals.inTokens)} sub={`+ ${fmtTok(totals.cacheTokens)} cache reads`} />
      </div>

      {/* vs Figma Make — how much this project saved */}
      {totals.gens > 0 && (
        <>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--bs-text-default)", marginBottom: 8 }}>vs Figma Make <span style={{ fontWeight: 400, color: "var(--bs-text-muted)", fontSize: 12 }}>· AI-credit cost</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 10 }}>
            <Stat
              label="Saved on this project"
              value={fmtUSD2(netSaved)}
              sub={`BrandSync ${fmtUSD2(totals.cost)} vs Figma ${fmtUSD2(figmaTotal)}`}
              accent={netSaved >= 0 ? "var(--bs-color-success-default)" : "var(--bs-color-error-default)"}
            />
            <Stat label="Figma Make AI cost" value={fmtUSD2(figmaTotal)} sub={`${fmtNum(figmaCredits)} credits × ${fmtUSD(figma.usdPerCredit)}/cr`} />
            <Stat label="Figma credits" value={fmtNum(figmaCredits)} sub={`≈ ${seatMonths.toFixed(2)} of a ${fmtNum(baseline.creditsPerSeat)}-credit seat`} />
            <Stat label="Cost / screen" value={totals.screens ? fmtUSD(totals.cost / totals.screens) : "—"} sub={`Figma Make: ${fmtUSD(figma.total)}`} />
          </div>
          <p style={{ margin: "0 0 26px", fontSize: 11.5, color: "var(--bs-text-muted)", lineHeight: 1.6 }}>
            Figma side uses the shared assumptions ({fmtNum(baseline.creditsPerSeat)} cr/seat · ${baseline.seatCostUsd}/seat ·
            {" "}{baseline.creditsPerScreen} cr/screen) — AI-credit cost only.
            {" "}<button onClick={() => router.push("/brandsync-make/usage")} style={{ background: "none", border: 0, padding: 0, color: "var(--bs-color-primary-default)", cursor: "pointer", fontSize: 11.5 }}>Adjust on Cost &amp; savings →</button>
          </p>
        </>
      )}

      {/* Token economy — documented for this project */}
      {totals.gens > 0 && (
        <div style={{ background: "var(--bs-surface-container)", border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-150)", padding: "16px 18px", marginBottom: 26 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--bs-text-default)", marginBottom: 10 }}>Token economy — where this project’s cost goes</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 13, color: "var(--bs-text-muted)", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--bs-text-default)" }}>Output is {outputShare}% of cost</strong> ({fmtUSD2(outputCost)} of {fmtUSD2(totals.cost)}).
              Output tokens cost 5× input, so the lever is <strong style={{ color: "var(--bs-text-default)" }}>scope discipline</strong> — scoped edits over full regenerations.
            </div>
            <div style={{ fontSize: 13, color: "var(--bs-text-muted)", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--bs-color-success-default)" }}>Caching saved {fmtUSD2(cacheSaved)}</strong> — {cacheShare}% of input came from cache at 1/10th price
              ({fmtNum(totals.cacheTokens)} reads cost {fmtUSD2(cacheCost)} instead of {fmtUSD2(totals.cacheTokens * 3 / 1e6)}).
            </div>
            <div style={{ fontSize: 13, color: "var(--bs-text-muted)", lineHeight: 1.6 }}>
              <strong style={{ color: "var(--bs-text-default)" }}>{fmtUSD(totals.cost / Math.max(1, totals.screens))} / screen</strong> across {fmtNum(totals.screens)} screens · uncached input was {fmtUSD2(inputCost)} (effectively free).
            </div>
          </div>
        </div>
      )}

      {/* Ledger */}
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--bs-text-default)", marginBottom: 8 }}>Generation ledger</div>
      <div style={{ background: "var(--bs-surface-raised)", border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-200)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "28px 1.4fr 0.8fr 0.8fr 0.8fr 0.9fr 1fr", padding: "10px 16px", fontSize: 11.5, fontWeight: 600, color: "var(--bs-text-muted)", borderBottom: "1px solid var(--bs-border-default)" }}>
          <div>#</div><div>When</div><div style={{ textAlign: "right" }}>In</div><div style={{ textAlign: "right" }}>Cache</div><div style={{ textAlign: "right" }}>Out</div><div style={{ textAlign: "right" }}>Cost</div><div style={{ textAlign: "right" }}>Cumulative</div>
        </div>
        {ledger.length === 0 && (
          <div style={{ padding: "28px 16px", textAlign: "center", color: "var(--bs-text-muted)", fontSize: 13 }}>
            No generations yet. Open this project in the studio and design a screen — it’ll appear here.
          </div>
        )}
        {ledger.map((r, i) => (
          <div key={r.at + i} style={{ display: "grid", gridTemplateColumns: "28px 1.4fr 0.8fr 0.8fr 0.8fr 0.9fr 1fr", padding: "9px 16px", fontSize: 12.5, color: "var(--bs-text-default)", borderBottom: "1px solid var(--bs-border-default)", alignItems: "center", background: r.success ? "transparent" : "var(--bs-color-error-container)" }}>
            <div style={{ color: "var(--bs-text-muted)" }}>{i + 1}</div>
            <div style={{ color: "var(--bs-text-muted)" }}>
              {fmtTime(r.at)}{!r.success && <span style={{ color: "var(--bs-color-error-default)", marginLeft: 6 }}>failed</span>}
            </div>
            <div style={{ textAlign: "right", color: "var(--bs-text-muted)" }}>{fmtNum(r.inTokens)}</div>
            <div style={{ textAlign: "right", color: "var(--bs-text-muted)" }}>{fmtNum(r.cacheTokens)}</div>
            <div style={{ textAlign: "right", fontWeight: 600 }}>{fmtNum(r.outTokens)}</div>
            <div style={{ textAlign: "right" }}>{fmtUSD(r.cost)}</div>
            <div style={{ textAlign: "right", color: "var(--bs-text-muted)" }}>{fmtUSD(r.cumulativeCost)}</div>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 16, fontSize: 11.5, color: "var(--bs-text-muted)", lineHeight: 1.6 }}>
        Cost from logged tokens at {data.pricing.model} list price; cache-creation tokens aren’t logged, so totals are a slight under-count.
        {data.truncated && " Showing the most recent 500 generations."}
      </p>
    </div>
  );
}
