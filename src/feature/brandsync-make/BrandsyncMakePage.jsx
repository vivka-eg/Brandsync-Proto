"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box, Container, Stack, Typography, IconButton, InputBase, Button, Avatar, Divider,
} from "@mui/material";
import {
  PaperPlaneRight, ArrowRight, Ticket, FolderOpen, SquaresFour, ArrowsClockwise,
  Star, DiamondsFour, CaretDown,
} from "phosphor-react";
import PatternsDialog from "./PatternsDialog";
import HandoffDialog from "./HandoffDialog";
import ProjectsDialog from "./ProjectsDialog";
import OrgDialog from "./OrgDialog";
import OrgSwitcher from "./OrgSwitcher";
import { useActiveOrg } from "@/lib/useActiveOrg";

const USER_EMAIL = "vivka@eg.dk";

// Larger pool of starter prompts; the shuffle button rotates which four show.
const CHIP_POOL = [
  { label: "Data dashboard", prompt: "A data dashboard with KPI cards, a revenue chart, and a recent-activity table." },
  { label: "Settings page", prompt: "A settings page with profile, notifications, and security sections." },
  { label: "Onboarding flow", prompt: "A multi-step onboarding flow with a progress indicator and validation." },
  { label: "Form with validation", prompt: "A form with inline validation, required fields, and an error summary." },
  { label: "Admin table", prompt: "An admin data table with filters, sorting, pagination, and row actions." },
  { label: "Empty state", prompt: "An empty state with an illustration, a short message, and a primary call to action." },
  { label: "Pricing page", prompt: "A pricing page with three tiers, a feature comparison, and a highlighted plan." },
  { label: "Sign-in screen", prompt: "A sign-in screen with email/password, SSO buttons, and a forgot-password link." },
];

const CATEGORIES = ["All", "Dashboards", "Forms", "Tables"];
const CAT_MATCH = {
  Dashboards: /dashboard|analytics|overview|metric|chart|kpi/i,
  Forms: /form|onboard|sign|login|wizard|input|field|feedback/i,
  Tables: /table|list|grid|data|request/i,
};

// Soft thumbnail accents, rotated per card so the gallery reads like the mock.
const THUMB = ["#0073e1", "#b06f00", "#00855b", "#c2185b", "#6c4bd1", "#0e8a8a"];

function prettify(slug = "") {
  let s = slug.split("/").pop() || slug;   // last path segment ("corpus/patterns/x" → "x")
  s = s.replace(/\.md$/i, "");             // drop .md extension
  s = s.replace(/-[a-z0-9]{4,6}$/i, "");   // drop random suffix
  s = s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim();
  return s || "Untitled";
}
function initials(name, email) {
  if (name && name.trim()) {
    const p = name.trim().split(/\s+/);
    return ((p[0]?.[0] || "") + (p[1]?.[0] || "")).toUpperCase();
  }
  return (email || "?").slice(0, 2).toUpperCase();
}
function authorLabel(name, email) {
  if (name && name.trim()) return name.trim();
  const local = (email || "").split("@")[0];
  return local ? local.replace(/\b\w/g, (c) => c.toUpperCase()) : "—";
}
// Deterministic placeholder star count (stable per pattern) until a real
// rating/usage signal exists. Flagged in the UI commentary, not invented data.
function pseudoStars(slug = "") {
  let n = 0;
  for (const ch of slug) n += ch.charCodeAt(0);
  return (n % 33) + 8;
}

function PatternThumb({ accent }) {
  const soft = `${accent}1f`;
  return (
    <Box sx={{ p: 1.25, display: "flex", flexDirection: "column", gap: 0.75, bgcolor: "var(--bs-surface-container)", height: 132 }}>
      <Box sx={{ height: 6, width: "55%", borderRadius: 1, bgcolor: accent }} />
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.75, flex: 1 }}>
        {[0, 1, 2, 3].map((i) => (
          <Box key={i} sx={{ borderRadius: 1, bgcolor: i % 3 === 0 ? soft : "var(--bs-surface-raised)", border: "1px solid var(--bs-border-default)" }} />
        ))}
      </Box>
    </Box>
  );
}

function PatternCard({ p, accent, onClick }) {
  return (
    <Box
      role="button" tabIndex={0} onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(); } }}
      sx={{
        border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-200)",
        overflow: "hidden", cursor: "pointer", bgcolor: "var(--bs-surface-raised)",
        transition: "border-color .15s, transform .15s",
        "&:hover": { borderColor: "var(--bs-border-neutral-hover)", transform: "translateY(-2px)" },
        "&:focus-visible": { outline: "2px solid var(--bs-border-primary)", outlineOffset: 2 },
      }}
    >
      <PatternThumb accent={accent} />
      <Box sx={{ p: 1.5, borderTop: "1px solid var(--bs-border-default)" }}>
        <Typography variant="body2" fontWeight={600} sx={{ color: "var(--bs-text-default)", mb: 1 }} noWrap>
          {prettify(p.slug)}
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" gap={0.75} sx={{ minWidth: 0 }}>
            <Avatar sx={{ width: 18, height: 18, fontSize: 9, bgcolor: "var(--bs-color-primary-container)", color: "var(--bs-color-primary-default)" }}>
              {initials(p.creator_name, p.creator_email)}
            </Avatar>
            <Typography variant="caption" sx={{ color: "var(--bs-text-muted)" }} noWrap>
              {authorLabel(p.creator_name, p.creator_email)}
            </Typography>
          </Stack>
          {p.approved ? (
            <Box sx={{ px: 0.75, py: 0.25, fontSize: 10, fontWeight: 600, borderRadius: "var(--bs-border-radius-50)", bgcolor: "var(--bs-color-success-container)", color: "var(--bs-color-success-default)", display: "inline-flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
              ✓ Promoted
            </Box>
          ) : (
            <Stack direction="row" alignItems="center" gap={0.5} sx={{ color: "var(--bs-text-muted)", flexShrink: 0 }}>
              <Star size={12} weight="fill" />
              <Typography variant="caption" sx={{ color: "inherit" }}>{pseudoStars(p.slug)}</Typography>
            </Stack>
          )}
        </Stack>
      </Box>
    </Box>
  );
}

function StartCard({ title, viewAll, onViewAll, children }) {
  return (
    <Box sx={{ border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-200)", bgcolor: "var(--bs-surface-raised)", p: 2.25, display: "flex", flexDirection: "column" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Typography variant="overline" sx={{ color: "var(--bs-text-muted)", fontWeight: 600, letterSpacing: "0.04em" }}>{title}</Typography>
        <Button onClick={onViewAll} endIcon={<ArrowRight size={13} weight="bold" />} sx={{ textTransform: "none", color: "var(--bs-color-primary-default)", fontWeight: 500, fontSize: 13, minWidth: 0, p: 0.5, "&:hover": { bgcolor: "transparent", opacity: 0.8 } }}>
          {viewAll}
        </Button>
      </Stack>
      {children}
    </Box>
  );
}

export default function BrandsyncMakePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const { activeOrgId, loading: orgLoading } = useActiveOrg();

  const [patternsOpen, setPatternsOpen] = useState(false);
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [usage, setUsage] = useState(null);
  const [patterns, setPatterns] = useState([]);
  const [promptText, setPromptText] = useState("");
  const [chipSeed, setChipSeed] = useState(0);
  const [category, setCategory] = useState("All");

  // Re-scope projects + patterns whenever the active org changes (the top-bar
  // switcher broadcasts via useActiveOrg). Wait for org resolution so we don't
  // briefly fetch with the wrong/empty org on first paint.
  useEffect(() => {
    if (orgLoading) return;
    const org = activeOrgId ? `&orgId=${encodeURIComponent(activeOrgId)}` : "";
    fetch(`/api/projects?userEmail=${encodeURIComponent(USER_EMAIL)}${org}`)
      .then((r) => r.json()).then((b) => setProjects(b.projects ?? [])).catch(() => setProjects([]));
    fetch(`/api/patterns?userEmail=${encodeURIComponent(USER_EMAIL)}${org}&scope=approved`)
      .then((r) => r.json()).then((b) => setPatterns(b.patterns ?? [])).catch(() => setPatterns([]));
  }, [activeOrgId, orgLoading]);

  // Usage is per-user (not org-scoped) — fetch once.
  useEffect(() => {
    fetch(`/api/brandsync-make/usage?userEmail=${encodeURIComponent(USER_EMAIL)}`)
      .then((r) => r.json()).then((b) => { if (b && !b.error) setUsage(b); }).catch(() => {});
  }, []);

  const contextProject = projectId ? projects.find((p) => p.id === projectId) ?? null : null;

  // Budget pill: today's spend across projects vs the daily allotment.
  const budgetPct = useMemo(() => {
    if (!usage?.daily_limit) return null;
    const today = (usage.in_today ?? 0) + (usage.out_today ?? 0);
    return Math.min(999, Math.round((today / usage.daily_limit) * 100));
  }, [usage]);

  // Four chips drawn from the pool; the shuffle button advances the window.
  const chips = useMemo(() => {
    const start = (chipSeed * 4) % CHIP_POOL.length;
    return Array.from({ length: 4 }, (_, i) => CHIP_POOL[(start + i) % CHIP_POOL.length]);
  }, [chipSeed]);

  const visiblePatterns = useMemo(() => {
    const list = category === "All" ? patterns : patterns.filter((p) => CAT_MATCH[category]?.test(p.slug));
    return list.slice(0, 6);
  }, [patterns, category]);

  const handleSend = () => {
    const text = promptText.trim();
    if (!text) return;
    try {
      sessionStorage.setItem("brandsync-make:pending-prompt", JSON.stringify({
        prompt: text, model: "claude-sonnet-4-6", projectId: contextProject?.id ?? null, at: Date.now(),
      }));
    } catch { /* private mode */ }
    const qs = contextProject?.id ? `?projectId=${encodeURIComponent(contextProject.id)}` : "";
    router.push(`/brandsync-make/my-patterns${qs}`);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "var(--bs-surface-base)" }}>
      {/* Top bar */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: { xs: 5, md: 8 }, py: 4, borderBottom: "1px solid var(--bs-border-default)", bgcolor: "var(--bs-surface-raised)" }}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Box sx={{ width: 30, height: 30, borderRadius: "var(--bs-border-radius-75)", bgcolor: "var(--bs-color-primary-default)", color: "var(--bs-text-on-action, #fff)", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 800 }}>BS</Box>
          <Typography fontWeight={700} sx={{ color: "var(--bs-text-default)" }}>BrandSync Proto</Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: "var(--bs-border-default)" }} />
          <OrgSwitcher />
        </Stack>
        <Stack direction="row" alignItems="center" gap={1.5}>
          {budgetPct != null && (
            <Stack direction="row" alignItems="center" gap={0.75} sx={{ px: 1.25, py: 0.5, borderRadius: "var(--bs-border-radius-full)", border: "1px solid var(--bs-border-default)", bgcolor: "var(--bs-surface-base)" }}>
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${budgetPct >= 100 ? "var(--bs-color-error-default)" : budgetPct >= 80 ? "var(--bs-color-warning-default)" : "var(--bs-color-success-default)"}` }} />
              <Typography variant="caption" sx={{ color: "var(--bs-text-muted)", fontWeight: 500 }}>{budgetPct}% of budget</Typography>
            </Stack>
          )}
          <Avatar sx={{ width: 30, height: 30, fontSize: 12, fontWeight: 700, bgcolor: "var(--bs-color-primary-container)", color: "var(--bs-color-primary-default)" }}>
            {initials(null, USER_EMAIL)}
          </Avatar>
        </Stack>
      </Box>

      <Container maxWidth="md" sx={{ pt: { xs: 14, md: 32}, pb: { xs: 6, md: 10 } }}>
        <Stack spacing={4}>
          {/* Headline */}
          <Typography variant="h3" fontWeight={700} textAlign="center" sx={{ color: "var(--bs-text-default)" }}>
            What do you want to{" "}
            <Box component="span" sx={{ color: "var(--bs-color-primary-default)" }}>prototype</Box>?
          </Typography>

          {/* Prompt box */}
          <Box sx={{
            border: "2px solid var(--bs-color-primary-default)", borderRadius: "var(--bs-border-radius-300)",
            bgcolor: "var(--bs-surface-raised)", boxShadow: "0 0 0 4px var(--bs-color-primary-container)", p: 2,
          }}>
            <InputBase
              fullWidth multiline minRows={2} maxRows={6}
              value={promptText} onChange={(e) => setPromptText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); handleSend(); } }}
              placeholder="Describe a screen, component, or flow…"
              sx={{ fontSize: "var(--bs-font-size-md)", color: "var(--bs-text-default)", "& textarea::placeholder": { color: "var(--bs-text-muted)", opacity: 1 } }}
            />
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 1.5 }}>
              <Button onClick={() => setHandoffOpen(true)} startIcon={<Ticket size={15} />} sx={{ textTransform: "none", fontWeight: 500, color: "var(--bs-text-default)", bgcolor: "var(--bs-surface-container)", border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-full)", px: 1.5, "&:hover": { bgcolor: "var(--bs-surface-hover)" } }}>
                Import from Jira
              </Button>
              <IconButton onClick={handleSend} disabled={!promptText.trim()} sx={{ bgcolor: "var(--bs-color-primary-default)", color: "var(--bs-text-on-action, #fff)", width: 40, height: 40, borderRadius: "var(--bs-border-radius-100)", "&:hover": { bgcolor: "var(--bs-color-primary-hover)" }, "&.Mui-disabled": { bgcolor: "var(--bs-color-primary-default)", color: "var(--bs-text-on-action, #fff)", opacity: 0.4 } }}>
                <ArrowRight size={18} weight="bold" />
              </IconButton>
            </Stack>
          </Box>

          {/* Quick-start chips + shuffle */}
          <Stack direction="row" gap={1} flexWrap="wrap" justifyContent="center" alignItems="center">
            {chips.map((c) => (
              <Button key={c.label} onClick={() => setPromptText(c.prompt)} sx={{ textTransform: "none", fontWeight: 500, color: "var(--bs-text-default)", bgcolor: "var(--bs-surface-raised)", border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-full)", px: 1.75, "&:hover": { borderColor: "var(--bs-border-neutral-hover)", bgcolor: "var(--bs-surface-hover)" } }}>
                {c.label}
              </Button>
            ))}
            <IconButton onClick={() => setChipSeed((s) => s + 1)} aria-label="Shuffle suggestions" sx={{ color: "var(--bs-text-muted)", "&:hover": { color: "var(--bs-text-default)" } }}>
              <ArrowsClockwise size={16} />
            </IconButton>
          </Stack>

          {/* Divider */}
          <Stack direction="row" alignItems="center" gap={2}>
            <Divider sx={{ flex: 1, borderColor: "var(--bs-border-default)" }} />
            <Typography variant="caption" sx={{ color: "var(--bs-text-muted)", whiteSpace: "nowrap" }}>or pick a starting point</Typography>
            <Divider sx={{ flex: 1, borderColor: "var(--bs-border-default)" }} />
          </Stack>

          {/* Two starting-point cards */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <StartCard title="Open project" viewAll="View all" onViewAll={() => setProjectsOpen(true)}>
              <Stack spacing={1}>
                {projects.length === 0 && <Typography variant="caption" sx={{ color: "var(--bs-text-muted)" }}>No projects yet.</Typography>}
                {projects.slice(0, 3).map((p) => (
                  <Stack key={p.id} direction="row" alignItems="center" gap={1.25} onClick={() => router.push(`/brandsync-make/my-patterns?projectId=${p.id}`)}
                    sx={{ px: 1.5, py: 1, borderRadius: "var(--bs-border-radius-100)", bgcolor: "var(--bs-color-primary-container)", cursor: "pointer", "&:hover": { opacity: 0.9 } }}>
                    <FolderOpen size={15} weight="fill" color="var(--bs-color-primary-default)" />
                    <Typography variant="body2" sx={{ flex: 1, color: "var(--bs-text-default)" }} noWrap>{p.name}</Typography>
                    <Typography variant="caption" sx={{ color: "var(--bs-text-muted)" }}>{p.file_count ?? 0}</Typography>
                  </Stack>
                ))}
              </Stack>
            </StartCard>

            <StartCard title="Jira import" viewAll="View all" onViewAll={() => setHandoffOpen(true)}>
              <Box onClick={() => setHandoffOpen(true)} sx={{ cursor: "pointer", border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-150)", p: 1.5, "&:hover": { borderColor: "var(--bs-border-neutral-hover)" } }}>
                <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1.25 }}>
                  <Box sx={{ px: 1, py: 0.25, bgcolor: "var(--bs-color-primary-container)", color: "var(--bs-color-primary-default)", borderRadius: "var(--bs-border-radius-50)", fontSize: 11, fontWeight: 700 }}>APT-202</Box>
                  <Ticket size={14} color="var(--bs-text-muted)" />
                  <Box sx={{ flex: 1, height: 5, bgcolor: "var(--bs-surface-container)", borderRadius: 3 }} />
                </Stack>
                <Stack spacing={0.75} sx={{ mb: 1.25 }}>
                  <Box sx={{ height: 5, bgcolor: "var(--bs-surface-container)", borderRadius: 3 }} />
                  <Box sx={{ height: 5, width: "70%", bgcolor: "var(--bs-surface-container)", borderRadius: 3 }} />
                </Stack>
                <Stack direction="row" gap={0.75}>
                  {["#0073e1", "#6c4bd1", "#00855b"].map((c) => (
                    <Box key={c} sx={{ px: 1, py: 0.25, fontSize: 10, fontWeight: 600, borderRadius: "var(--bs-border-radius-full)", bgcolor: `${c}22`, color: c, border: `1px solid ${c}44` }}>tag</Box>
                  ))}
                </Stack>
              </Box>
            </StartCard>
          </Box>

          {/* Component kit */}
          <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ color: "var(--bs-text-default)", mb: 1 }}>Component kit</Typography>
            <Box onClick={() => router.push("/brandsync-make/kit")}
              sx={{ display: "flex", alignItems: "center", gap: 1.5, border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-200)", bgcolor: "var(--bs-color-primary-container)", px: 2.25, py: 1.75, cursor: "pointer", "&:hover": { opacity: 0.92 } }}>
              <DiamondsFour size={20} weight="fill" color="var(--bs-color-primary-default)" />
              <Typography variant="body1" fontWeight={600} sx={{ flex: 1, color: "var(--bs-text-default)" }}>Explore Component Kit</Typography>
              <Stack direction="row" alignItems="center" gap={0.5} sx={{ color: "var(--bs-color-primary-default)", fontWeight: 500, fontSize: 13 }}>
                View all <ArrowRight size={14} weight="bold" />
              </Stack>
            </Box>
          </Box>

          {/* Patterns */}
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ color: "var(--bs-text-default)" }}>Patterns</Typography>
              <Stack direction="row" alignItems="center" gap={1}>
                {CATEGORIES.map((c) => (
                  <Button key={c} onClick={() => setCategory(c)} sx={{
                    textTransform: "none", fontWeight: 500, fontSize: 13, px: 1.5, py: 0.25, minWidth: 0,
                    borderRadius: "var(--bs-border-radius-full)",
                    color: category === c ? "var(--bs-color-primary-default)" : "var(--bs-text-muted)",
                    bgcolor: category === c ? "var(--bs-color-primary-container)" : "transparent",
                    border: `1px solid ${category === c ? "transparent" : "var(--bs-border-default)"}`,
                    "&:hover": { bgcolor: category === c ? "var(--bs-color-primary-container)" : "var(--bs-surface-hover)" },
                  }}>{c}</Button>
                ))}
                <Button onClick={() => setPatternsOpen(true)} endIcon={<ArrowRight size={13} weight="bold" />} sx={{ textTransform: "none", color: "var(--bs-text-muted)", fontWeight: 500, fontSize: 13, minWidth: 0, "&:hover": { bgcolor: "transparent", color: "var(--bs-text-default)" } }}>Browse all</Button>
              </Stack>
            </Stack>

            {visiblePatterns.length === 0 ? (
              <Typography variant="body2" sx={{ color: "var(--bs-text-muted)", py: 3, textAlign: "center" }}>
                No patterns in this category yet.
              </Typography>
            ) : (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
                {visiblePatterns.map((p, i) => (
                  <PatternCard key={p.id} p={p} accent={THUMB[i % THUMB.length]} onClick={() => setPatternsOpen(true)} />
                ))}
              </Box>
            )}
          </Box>

          {/* Footer links */}
          <Stack direction="row" spacing={1} justifyContent="center" sx={{ pt: 1 }}>
            <Button onClick={() => setOrgOpen(true)} sx={{ textTransform: "none", color: "var(--bs-text-muted)", "&:hover": { color: "var(--bs-text-default)", bgcolor: "var(--bs-surface-hover)" } }}>Organizations &amp; members</Button>
            <Button onClick={() => router.push("/brandsync-make/usage")} sx={{ textTransform: "none", color: "var(--bs-text-muted)", "&:hover": { color: "var(--bs-text-default)", bgcolor: "var(--bs-surface-hover)" } }}>Cost &amp; savings</Button>
          </Stack>
        </Stack>
      </Container>

      <PatternsDialog open={patternsOpen} onClose={() => setPatternsOpen(false)} />
      <HandoffDialog open={handoffOpen} onClose={() => setHandoffOpen(false)} />
      <ProjectsDialog open={projectsOpen} onClose={() => setProjectsOpen(false)} />
      <OrgDialog open={orgOpen} onClose={() => setOrgOpen(false)} />
    </Box>
  );
}
