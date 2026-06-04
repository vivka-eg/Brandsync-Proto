"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  IconButton,
  Box,
  Stack,
  Typography,
  Button,
  ButtonBase,
  Avatar,
  Tooltip,
  Chip,
  CircularProgress,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { X, CheckCircle, Sparkle, UsersThree, Clock } from "phosphor-react";
import { getStoredOrgId } from "@/lib/useActiveOrg";

// LOCAL DEV ONLY — same hardcoded user as the other Make dialogs.
const USER_EMAIL = "vivka@eg.dk";

const NAME_STOP = new Set([
  "a", "an", "the", "to", "of", "for", "and", "or", "with", "my", "our", "me",
  "create", "make", "build", "design", "generate", "add", "new", "please", "can", "you",
]);
function prettify(slug) {
  if (!slug) return "Untitled";
  let s = String(slug).replace(/^corpus\/patterns\//, "").replace(/\.md$/, "");
  s = s.replace(/-(?=[a-z0-9]*[0-9])[a-z0-9]{4,6}$/i, "");
  let words = s.split("-").filter(Boolean);
  const m = words.filter((w) => !NAME_STOP.has(w.toLowerCase()));
  if (m.length) words = m;
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "Untitled";
}
function initials(email) {
  if (!email) return "BS";
  const n = email.split("@")[0];
  const p = n.split(/[.\-_]+/).filter(Boolean);
  return ((p[0]?.[0] ?? "") + (p[1]?.[0] ?? "") || n.slice(0, 2)).toUpperCase();
}
function fencedBlock(md, lang) {
  const m = md.match(new RegExp("```" + lang + "\\s*([\\s\\S]*?)```"));
  return m ? m[1] : "";
}
function buildPreviewDoc(content, tokensCss) {
  if (!content) return null;
  const html = fencedBlock(content, "html");
  if (!html) return null;
  const css = fencedBlock(content, "css");
  const safeHtml = html.replace(/\bhref\s*=\s*"[^"]*"/gi, 'href="#"');
  const inject =
    "<style>" + (tokensCss || "") + "</style>" +
    "<style>html,body{margin:0;padding:0;background:var(--bs-surface-base);}" + css + "</style>";
  return /<\/head>/i.test(safeHtml)
    ? safeHtml.replace(/<\/head>/i, inject + "</head>")
    : "<!doctype html><html><head>" + inject + "</head><body>" + safeHtml + "</body></html>";
}

function Preview({ patternId, tokensCss }) {
  const [content, setContent] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/patterns/${patternId}?userEmail=${encodeURIComponent(USER_EMAIL)}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setContent(d.content ?? ""); })
      .catch(() => { if (!cancelled) setContent(""); });
    return () => { cancelled = true; };
  }, [patternId]);

  const box = {
    height: 128, borderRadius: "var(--bs-border-radius-100)",
    border: "1px solid var(--bs-border-default)", overflow: "hidden",
    position: "relative", bgcolor: "#fff",
  };
  if (content === null) {
    return <Box sx={{ ...box, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "var(--bs-surface-raised)" }}><CircularProgress size={16} sx={{ color: "var(--bs-color-accent-default)" }} /></Box>;
  }
  const doc = buildPreviewDoc(content, tokensCss);
  if (!doc) return <Box sx={{ ...box, bgcolor: "var(--bs-surface-raised)" }} />;
  return (
    <Box sx={box}>
      <iframe
        title="pattern preview" srcDoc={doc} sandbox="allow-scripts" scrolling="no"
        tabIndex={-1} aria-hidden="true"
        style={{ position: "absolute", top: 0, left: 0, width: "1280px", height: `${Math.round(128 / 0.16)}px`, border: 0, transform: "scale(0.16)", transformOrigin: "top left", pointerEvents: "none" }}
      />
    </Box>
  );
}

// Card status is driven by pattern.approved: approved → chip; not approved →
// Approve button (admins) or a Pending chip.
function PatternCard({ pattern, tokensCss, canApprove, onApprove, approving, showCreator, onUse, using }) {
  const isApproved = pattern.approved;
  const creator = pattern.creator_email || pattern.created_by || "Brandsync";
  return (
    <Box sx={{ bgcolor: "var(--bs-surface-raised)", border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-150)", p: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
      <Preview patternId={pattern.id} tokensCss={tokensCss} />
      <Typography variant="body2" fontWeight={600} noWrap sx={{ color: "var(--bs-text-default)" }}>
        {prettify(pattern.slug)}
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
        {showCreator ? (
          <Stack direction="row" alignItems="center" gap={0.75} sx={{ minWidth: 0 }}>
            <Tooltip title={`Created by ${creator}`} arrow>
              <Avatar sx={{ width: 22, height: 22, fontSize: 9, fontWeight: 700, bgcolor: "var(--bs-color-accent-container)", color: "var(--bs-color-accent-default)" }}>
                {initials(pattern.creator_email)}
              </Avatar>
            </Tooltip>
            <Typography variant="caption" noWrap sx={{ color: "var(--bs-text-muted)" }}>
              {pattern.creator_email ? creator.split("@")[0] : "Brandsync"}
            </Typography>
          </Stack>
        ) : <Box />}

        {isApproved ? (
          <Tooltip title="Start an editable copy (no tokens used)" arrow>
            <span>
              <Button size="small" variant="contained" disabled={using} onClick={(e) => onUse(pattern.id, e.currentTarget)}
                sx={{ textTransform: "none", bgcolor: "var(--bs-color-accent-default)", color: "var(--bs-text-inverse)", "&:hover": { bgcolor: "var(--bs-color-accent-hover)" } }}>
                {using ? "…" : "Use"}
              </Button>
            </span>
          </Tooltip>
        ) : canApprove ? (
          <Button size="small" variant="contained" disabled={approving} startIcon={<CheckCircle size={13} weight="fill" />} onClick={() => onApprove(pattern.id)}
            sx={{ textTransform: "none", bgcolor: "var(--bs-color-accent-default)", color: "var(--bs-text-inverse)", "&:hover": { bgcolor: "var(--bs-color-accent-hover)" } }}>
            {approving ? "…" : "Approve"}
          </Button>
        ) : (
          <Chip size="small" icon={<Clock size={12} />} label="Pending"
            sx={{ height: 20, fontSize: 10, bgcolor: "var(--bs-surface-hover)", color: "var(--bs-text-muted)" }} />
        )}
      </Stack>
    </Box>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: "100%", justifyContent: "flex-start", gap: 1.25, px: 1.5, py: 1.25,
        borderRadius: "var(--bs-border-radius-100)", textAlign: "left",
        bgcolor: active ? "var(--bs-color-accent-default)" : "transparent",
        color: active ? "var(--bs-text-inverse)" : "var(--bs-text-default)",
        "&:hover": { bgcolor: active ? "var(--bs-color-accent-hover)" : "var(--bs-surface-hover)" },
      }}
    >
      {icon}
      <Typography variant="body2" fontWeight={active ? 600 : 500}>{label}</Typography>
    </ButtonBase>
  );
}

export default function PatternsDialog({ open, onClose }) {
  const router = useRouter();
  const [view, setView] = useState("explore"); // explore | team
  const [usingId, setUsingId] = useState(null);
  const [teamTab, setTeamTab] = useState("approved"); // approved | pending
  const [approved, setApproved] = useState(null);
  const [pending, setPending] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tokensCss, setTokensCss] = useState("");
  const [approvingId, setApprovingId] = useState(null);

  const orgQs = () => (getStoredOrgId() ? `&orgId=${encodeURIComponent(getStoredOrgId())}` : "");

  const loadApproved = useCallback(() => {
    fetch(`/api/patterns?userEmail=${encodeURIComponent(USER_EMAIL)}${orgQs()}&scope=approved`)
      .then((r) => r.json()).then((d) => setApproved(d.patterns || [])).catch(() => setApproved([]));
  }, []);
  const loadPending = useCallback(() => {
    fetch(`/api/patterns?userEmail=${encodeURIComponent(USER_EMAIL)}${orgQs()}&scope=pending`)
      .then((r) => r.json()).then((d) => setPending(d.error ? [] : (d.patterns || []))).catch(() => setPending([]));
  }, []);

  useEffect(() => {
    if (!open) return;
    setView("explore"); setApproved(null); setPending(null);
    loadApproved();
    if (!tokensCss) fetch("/brandsync-tokens.css").then((r) => r.text()).then(setTokensCss).catch(() => {});
    fetch(`/api/orgs?userEmail=${encodeURIComponent(USER_EMAIL)}`)
      .then((r) => r.json())
      .then((d) => {
        const oid = getStoredOrgId();
        const org = (d.orgs || []).find((o) => o.id === oid) || (d.orgs || []).find((o) => o.is_default);
        const admin = org?.my_role === "admin";
        setIsAdmin(admin);
        if (admin) loadPending();
      })
      .catch(() => setIsAdmin(false));
  }, [open, loadApproved, loadPending]); // eslint-disable-line

  const approve = async (id) => {
    setApprovingId(id);
    try {
      await fetch(`/api/patterns/${id}/approve`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: USER_EMAIL }),
      });
      loadPending(); loadApproved();
    } finally { setApprovingId(null); }
  };

  // "Use this pattern" → open a small picker asking which project to add the
  // editable copy to (lazy-loads the user's projects for the active org).
  const [pickAnchor, setPickAnchor] = useState(null);
  const [pickPatternId, setPickPatternId] = useState(null);
  const [projects, setProjects] = useState(null);

  const openPicker = (id, anchorEl) => {
    setPickPatternId(id);
    setPickAnchor(anchorEl);
    setProjects(null);
    fetch(`/api/projects?userEmail=${encodeURIComponent(USER_EMAIL)}${orgQs()}`)
      .then((r) => r.json()).then((d) => setProjects(d.projects || [])).catch(() => setProjects([]));
  };
  const closePicker = () => { setPickAnchor(null); setPickPatternId(null); };

  // Clone into the chosen project (or none) — no Claude call — then open it.
  const cloneInto = async (projectId) => {
    const id = pickPatternId;
    closePicker();
    setUsingId(id);
    try {
      const res = await fetch(`/api/patterns/${id}/clone`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: USER_EMAIL, orgId: getStoredOrgId() || undefined, projectId: projectId || undefined }),
      });
      const d = await res.json();
      if (res.ok && d.pattern) {
        onClose?.();
        router.push(`/brandsync-make/my-patterns${projectId ? `?projectId=${encodeURIComponent(projectId)}` : ""}`);
      }
    } finally { setUsingId(null); }
  };

  // Explore = Brandsync only (the official baseline, no creator).
  const explore = approved ? approved.filter((p) => !p.user_id) : null;
  // Team = everything a team member made: approved team patterns + pending
  // drafts (pending visible to admins). Pending first so they stand out.
  const teamApproved = approved ? approved.filter((p) => p.user_id) : [];
  const team = approved === null
    ? null
    : [...(pending || []), ...teamApproved];

  const grid = (items, opts = {}) => (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 2 }}>
      {items.map((p) => (
        <PatternCard key={p.id} pattern={p} tokensCss={tokensCss}
          canApprove={isAdmin} onApprove={approve} approving={approvingId === p.id}
          onUse={openPicker} using={usingId === p.id}
          showCreator={opts.showCreator} />
      ))}
    </Box>
  );

  const list = view === "explore" ? explore : team;
  const pendingCount = (pending || []).length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{ "& .MuiDialog-container": { alignItems: "flex-start !important" }, "& .MuiDialog-scrollPaper": { alignItems: "flex-start !important" } }}
      slotProps={{
        paper: {
          sx: {
            bgcolor: "var(--bs-surface-base)", border: "1px solid var(--bs-border-default)",
            borderRadius: "var(--bs-border-radius-200)", backgroundImage: "none",
            height: "78vh", mt: "6vh", display: "flex", flexDirection: "column",
          },
        },
      }}
    >
      <DialogTitle
        component="div"
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, py: 2.5, px: 4, borderBottom: "1px solid var(--bs-border-default)", flexShrink: 0 }}
      >
        <Stack>
          <Typography variant="h6" fontWeight={700} sx={{ color: "var(--bs-text-default)" }}>
            Start from Team approved patterns
          </Typography>
          <Typography variant="caption" sx={{ color: "var(--bs-text-muted)" }}>
            Browse Brandsync's library or your team's approved designs.
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small" aria-label="Close"><X size={18} /></IconButton>
      </DialogTitle>

      <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <Box sx={{ width: 196, flexShrink: 0, borderRight: "1px solid var(--bs-border-default)", p: 2, display: "flex", flexDirection: "column", gap: 0.5 }}>
          <NavItem icon={<Sparkle size={16} weight="fill" />} label="Explore" active={view === "explore"} onClick={() => setView("explore")} />
          <NavItem
            icon={<UsersThree size={16} weight="fill" />}
            label={`Team${pendingCount ? ` · ${pendingCount}` : ""}`}
            active={view === "team"} onClick={() => setView("team")}
          />
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0, overflowY: "auto", px: 4, pt: 3, pb: 4 }}>
          {list === null && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress size={24} sx={{ color: "var(--bs-color-accent-default)" }} />
            </Box>
          )}

          {view === "explore" && explore && (
            explore.length === 0
              ? <Typography variant="body2" sx={{ color: "var(--bs-text-muted)", py: 6, textAlign: "center" }}>No Brandsync patterns.</Typography>
              : <>
                  <Typography variant="caption" sx={{ color: "var(--bs-text-muted)", display: "block", mb: 1.5 }}>
                    Official patterns maintained by Brandsync — available to every org.
                  </Typography>
                  {grid(explore, { showCreator: false })}
                </>
          )}

          {view === "team" && team !== null && (
            <>
              {/* Approved / Pending tabs */}
              <Stack direction="row" gap={1} sx={{ mb: 2 }}>
                {[
                  { id: "approved", label: `Approved · ${teamApproved.length}` },
                  { id: "pending", label: `Pending · ${(pending || []).length}` },
                ].map((t) => (
                  <Button
                    key={t.id} size="small" onClick={() => setTeamTab(t.id)}
                    sx={{
                      textTransform: "none", borderRadius: 999, px: 1.75,
                      bgcolor: teamTab === t.id ? "var(--bs-color-accent-default)" : "transparent",
                      color: teamTab === t.id ? "var(--bs-text-inverse)" : "var(--bs-text-muted)",
                      border: `1px solid ${teamTab === t.id ? "transparent" : "var(--bs-border-default)"}`,
                      "&:hover": { bgcolor: teamTab === t.id ? "var(--bs-color-accent-hover)" : "var(--bs-surface-hover)" },
                    }}
                  >
                    {t.label}
                  </Button>
                ))}
              </Stack>

              {teamTab === "approved" && (
                teamApproved.length === 0
                  ? <Typography variant="body2" sx={{ color: "var(--bs-text-muted)", py: 6, textAlign: "center" }}>No approved team patterns yet.</Typography>
                  : grid(teamApproved, { showCreator: true })
              )}
              {teamTab === "pending" && (
                (pending || []).length === 0
                  ? <Typography variant="body2" sx={{ color: "var(--bs-text-muted)", py: 6, textAlign: "center" }}>{isAdmin ? "Nothing waiting for approval." : "No pending patterns."}</Typography>
                  : grid(pending, { showCreator: true })
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Project picker for "Use this pattern" */}
      <Menu
        anchorEl={pickAnchor}
        open={Boolean(pickAnchor)}
        onClose={closePicker}
        slotProps={{ paper: { sx: { bgcolor: "var(--bs-surface-base)", border: "1px solid var(--bs-border-default)", borderRadius: "var(--bs-border-radius-150)", minWidth: 240, mt: 0.5 } } }}
      >
        <Typography variant="caption" sx={{ px: 2, py: 1, display: "block", color: "var(--bs-text-muted)" }}>
          Add the copy to…
        </Typography>
        {projects === null && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 1.5 }}><CircularProgress size={16} sx={{ color: "var(--bs-color-accent-default)" }} /></Box>
        )}
        {projects && projects.map((p) => (
          <MenuItem key={p.id} onClick={() => cloneInto(p.id)} sx={{ color: "var(--bs-text-default)", display: "flex", justifyContent: "space-between", gap: 2 }}>
            <span>{p.name}</span>
            <Typography component="span" variant="caption" sx={{ color: "var(--bs-text-muted)" }}>{p.file_count} files</Typography>
          </MenuItem>
        ))}
        {projects && projects.length === 0 && (
          <MenuItem disabled sx={{ fontSize: 13, color: "var(--bs-text-muted)" }}>No projects in this org yet</MenuItem>
        )}
        <Divider sx={{ borderColor: "var(--bs-border-default)" }} />
        <MenuItem onClick={() => cloneInto(null)} sx={{ color: "var(--bs-text-default)" }}>
          Without a project (My Patterns)
        </MenuItem>
      </Menu>
    </Dialog>
  );
}
