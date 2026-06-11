"use client";
import { getUserEmail } from "@/lib/userEmail";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Stack,
  Typography,
  Button,
  ButtonBase,
  InputBase,
  CircularProgress,
  Avatar,
  Tooltip,
} from "@mui/material";
import { X, Plus, FileText, FolderPlus } from "phosphor-react";
import { getStoredOrgId } from "@/lib/useActiveOrg";
import TokenMeter from "./TokenMeter";
import ProjectBrandDialog from "./ProjectBrandDialog";

// LOCAL DEV ONLY — same hardcoded user as /brandsync-make/my-patterns/page.js.
// When real auth lands, both files should switch in lockstep.

// Initials for an owner/collaborator avatar, e.g. getUserEmail() → "VI".
function initials(email) {
  if (!email) return "?";
  const name = email.split("@")[0];
  const parts = name.split(/[.\-_]+/).filter(Boolean);
  const two = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  return (two || name.slice(0, 2)).toUpperCase();
}

function formatRelative(iso) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

// Lightweight stylized thumbnail (skeleton mockup) — a placeholder preview
// of the project's UI. Empty projects render a fainter, emptier version.
function ProjectThumb({ empty }) {
  const bar = (w, h, o = 1) => (
    <Box sx={{ width: w, height: h, borderRadius: "3px", bgcolor: "var(--bs-border-default)", opacity: empty ? 0.35 * o : 0.7 * o }} />
  );
  return (
    <Box
      sx={{
        height: 116,
        borderRadius: "var(--bs-border-radius-100)",
        border: "1px solid var(--bs-border-default)",
        background: "linear-gradient(135deg, var(--bs-surface-raised), var(--bs-surface-hover))",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, p: 1.25, display: "flex", flexDirection: "column", gap: 0.75 }}>
        {bar("38%", 8)}
        {bar("100%", 30, 0.85)}
        <Stack direction="row" gap={0.75}>
          {bar("50%", 26, 0.7)}
          {bar("50%", 26, 0.7)}
        </Stack>
      </Box>
    </Box>
  );
}

// Pull a fenced ```html / ```css block out of a pattern's markdown content.
function fencedBlock(md, lang) {
  const m = md.match(new RegExp("```" + lang + "\\s*([\\s\\S]*?)```"));
  return m ? m[1] : "";
}

// Build a self-contained srcDoc for a thumbnail preview from a file's content.
function buildPreviewDoc(content, tokensCss) {
  if (!content) return null;
  const html = fencedBlock(content, "html");
  if (!html) return null;
  const css = fencedBlock(content, "css");
  // neutralize links so the sandboxed preview can't try to navigate
  const safeHtml = html.replace(/\bhref\s*=\s*"[^"]*"/gi, 'href="#"');
  // Inline the app's LOCAL design tokens (the same source the live canvas
  // uses) so every --bs-* variable resolves. The unpkg <link> the pattern
  // embeds is unreliable inside a sandboxed iframe, which left previews
  // unstyled; inlining fixes that.
  const inject =
    "<style>" + (tokensCss || "") + "</style>" +
    "<style>html,body{margin:0;padding:0;background:var(--bs-surface-base);}" + css + "</style>";
  return /<\/head>/i.test(safeHtml)
    ? safeHtml.replace(/<\/head>/i, inject + "</head>")
    : "<!doctype html><html><head>" + inject + "</head><body>" + safeHtml + "</body></html>";
}

// One scaled, non-interactive mini-render cell.
function PreviewCell({ doc, cellH, scale }) {
  return (
    <Box sx={{ position: "relative", overflow: "hidden", bgcolor: "#fff" }}>
      <iframe
        title="preview"
        srcDoc={doc}
        sandbox="allow-scripts"
        scrolling="no"
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: "absolute", top: 0, left: 0,
          width: "1280px", height: `${Math.round(cellH / scale)}px`,
          border: 0, transform: `scale(${scale})`, transformOrigin: "top left",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
}

// Lazy per-card preview: fetches up to 4 of the project's latest files only
// when the card mounts, and renders them as a Figma-style 2×2 of mini-renders.
function ProjectPreviewGrid({ projectId, fileCount, tokensCss }) {
  const [files, setFiles] = useState(null); // null = loading, [] = none

  useEffect(() => {
    if (!fileCount) { setFiles([]); return; }
    let cancelled = false;
    fetch(`/api/projects/${projectId}/previews?userEmail=${encodeURIComponent(getUserEmail())}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setFiles(d.files || []); })
      .catch(() => { if (!cancelled) setFiles([]); });
    return () => { cancelled = true; };
  }, [projectId, fileCount]);

  if (fileCount === 0) return <ProjectThumb empty />;
  if (files === null) return <ProjectThumb />; // loading skeleton

  const docs = files.map((f) => buildPreviewDoc(f.content, tokensCss)).filter(Boolean).slice(0, 4);
  if (!docs.length) return <ProjectThumb empty />;

  const cols = docs.length === 1 ? 1 : 2;
  const rows = docs.length <= 2 ? 1 : 2;
  const cellH = Math.floor((116 - (rows - 1) * 2) / rows);
  const scale = docs.length === 1 ? 0.16 : 0.085;

  return (
    <Box
      sx={{
        height: 116, borderRadius: "var(--bs-border-radius-100)",
        border: "1px solid var(--bs-border-default)", overflow: "hidden",
        display: "grid", gap: "2px", bgcolor: "var(--bs-border-default)",
        gridTemplateColumns: cols === 1 ? "1fr" : "1fr 1fr",
        gridTemplateRows: rows === 1 ? "1fr" : "1fr 1fr",
      }}
    >
      {docs.map((doc, i) => <PreviewCell key={i} doc={doc} cellH={cellH} scale={scale} />)}
    </Box>
  );
}

function ProjectCard({ project, ownerEmail, tokensCss, onOpen, usage }) {
  return (
    <ButtonBase
      onClick={() => onOpen(project)}
      sx={{
        textAlign: "left",
        bgcolor: "var(--bs-surface-raised)",
        border: "1px solid var(--bs-border-default)",
        borderRadius: "var(--bs-border-radius-150)",
        p: 1.5,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 1,
        transition: "border-color 0.15s, transform 0.15s, box-shadow 0.15s",
        "&:hover": {
          borderColor: "var(--bs-border-neutral-hover)",
          transform: "translateY(-2px)",
          boxShadow: "var(--bs-shadow-elevation-xs, 0 4px 12px rgba(0,0,0,0.08))",
        },
        "&:focus-visible": { outline: "2px solid var(--bs-border-primary)", outlineOffset: 2 },
      }}
    >
      <ProjectPreviewGrid projectId={project.id} fileCount={project.file_count} tokensCss={tokensCss} />

      <Typography
        variant="body2"
        fontWeight={600}
        sx={{ color: "var(--bs-text-default)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
      >
        {project.name}
      </Typography>

      <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
        <Stack direction="row" alignItems="center" gap={0.5} sx={{ minWidth: 0 }}>
          <FileText size={12} color="var(--bs-text-muted)" />
          <Typography variant="caption" noWrap sx={{ color: "var(--bs-text-muted)" }}>
            {project.file_count} {project.file_count === 1 ? "file" : "files"} · {formatRelative(project.updated_at)}
          </Typography>
        </Stack>
        {/* Owner avatar (collaborators come once project sharing exists). */}
        <Tooltip title={`Owner: ${ownerEmail}`} arrow>
          <Avatar
            sx={{
              width: 24, height: 24, flexShrink: 0,
              fontSize: 10, fontWeight: 700,
              bgcolor: "var(--bs-color-accent-container)",
              color: "var(--bs-color-accent-default)",
            }}
          >
            {initials(ownerEmail)}
          </Avatar>
        </Tooltip>
      </Stack>

      {/* Daily token budget meter for this project */}
      <Box sx={{ width: "100%" }}>
        <TokenMeter
          used={usage?.by_project?.[project.id] ?? 0}
          limit={usage?.daily_limit}
        />
      </Box>
    </ButtonBase>
  );
}

function EmptyState({ onCreate }) {
  return (
    <Stack
      alignItems="center"
      spacing={2}
      sx={{
        py: 6,
        px: 3,
        textAlign: "center",
        border: "1px dashed var(--bs-border-default)",
        borderRadius: "var(--bs-border-radius-150)",
        bgcolor: "var(--bs-surface-raised)",
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          bgcolor: "var(--bs-color-accent-container)",
          color: "var(--bs-color-accent-default)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FolderPlus size={22} weight="fill" />
      </Box>
      <Stack spacing={0.5}>
        <Typography variant="body1" fontWeight={600} sx={{ color: "var(--bs-text-default)" }}>
          No projects yet
        </Typography>
        <Typography variant="body2" sx={{ color: "var(--bs-text-muted)", maxWidth: 360 }}>
          Projects group the patterns you create in BrandSync Make. Start one to keep your work organized.
        </Typography>
      </Stack>
      <Button
        variant="contained"
        startIcon={<Plus size={14} weight="bold" />}
        onClick={onCreate}
        sx={{
          textTransform: "none",
          bgcolor: "var(--bs-color-accent-default)",
          color: "var(--bs-text-inverse)",
          "&:hover": { bgcolor: "var(--bs-color-accent-hover)" },
        }}
      >
        Create your first project
      </Button>
    </Stack>
  );
}

function NewProjectForm({ onCancel, onCreated }) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const trimmed = name.trim();
  const canSubmit = trimmed.length > 0 && !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: getUserEmail(), name: trimmed, orgId: getStoredOrgId() }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || `HTTP ${res.status}`);
      onCreated(body.project);
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  return (
    <Stack
      spacing={1.5}
      sx={{
        p: 2,
        bgcolor: "var(--bs-surface-raised)",
        border: "1px solid var(--bs-border-default)",
        borderRadius: "var(--bs-border-radius-150)",
      }}
    >
      <Typography variant="body2" fontWeight={600} sx={{ color: "var(--bs-text-default)" }}>
        Name your project
      </Typography>
      <InputBase
        autoFocus
        placeholder="e.g. Vigilo onboarding redesign"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") onCancel();
        }}
        sx={{
          px: 1.5,
          py: 1,
          color: "var(--bs-text-default)",
          fontSize: "var(--bs-font-size-md)",
          bgcolor: "var(--bs-surface-base)",
          border: "1px solid var(--bs-border-default)",
          borderRadius: "var(--bs-border-radius-100)",
          "&:focus-within": { borderColor: "var(--bs-border-primary)" },
        }}
      />
      {error && (
        <Typography variant="caption" sx={{ color: "var(--bs-color-error-default)" }}>
          {error}
        </Typography>
      )}
      <Stack direction="row" justifyContent="flex-end" gap={1}>
        <Button
          size="small"
          onClick={onCancel}
          sx={{
            textTransform: "none",
            color: "var(--bs-text-default)",
            "&:hover": { bgcolor: "var(--bs-surface-hover)" },
          }}
        >
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
          disabled={!canSubmit}
          onClick={submit}
          sx={{
            textTransform: "none",
            bgcolor: "var(--bs-color-accent-default)",
            color: "var(--bs-text-inverse)",
            "&:hover": { bgcolor: "var(--bs-color-accent-hover)" },
          }}
        >
          {submitting ? "Creating…" : "Create"}
        </Button>
      </Stack>
    </Stack>
  );
}

export default function ProjectsDialog({ open, onClose }) {
  const router = useRouter();
  const [projects, setProjects] = useState(null); // null = not loaded yet
  const [loadError, setLoadError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [usage, setUsage] = useState(null);
  // App-local design tokens, inlined into each card preview so --bs-* resolve.
  const [tokensCss, setTokensCss] = useState("");

  const load = async () => {
    setLoadError(null);
    try {
      const res = await fetch(`/api/projects?userEmail=${encodeURIComponent(getUserEmail())}${getStoredOrgId() ? `&orgId=${encodeURIComponent(getStoredOrgId())}` : ""}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || `HTTP ${res.status}`);
      setProjects(body.projects || []);
    } catch (e) {
      setLoadError(e.message);
      setProjects([]);
    }
  };

  useEffect(() => {
    if (open) {
      setCreating(false);
      setProjects(null);
      load();
      fetch(`/api/brandsync-make/usage?userEmail=${encodeURIComponent(getUserEmail())}`)
        .then((r) => r.json())
        .then((body) => { if (body && !body.error) setUsage(body); })
        .catch(() => {});
      if (!tokensCss) {
        fetch("/brandsync-tokens.css")
          .then((r) => r.text())
          .then((css) => setTokensCss(css))
          .catch(() => {});
      }
    }
  }, [open]);

  const openProject = (project) => {
    onClose?.();
    router.push(`/brandsync-make/my-patterns?projectId=${project.id}`);
  };

  const handleCreated = (project) => {
    setProjects((prev) => [{ ...project, file_count: 0 }, ...(prev || [])]);
    setCreating(false);
    openProject(project);
  };

  // Create a project with its brand (color + logo) from the brand modal.
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const handleBrandCreate = async ({ name, brandPalette, logoName }) => {
    setCreateSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: getUserEmail(), name, orgId: getStoredOrgId(), brandPalette, logoName }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || `HTTP ${res.status}`);
      handleCreated(body.project);
    } catch (e) {
      setLoadError(e.message);
      setCreating(false);
    } finally {
      setCreateSubmitting(false);
    }
  };

  const showEmpty = projects && projects.length === 0 && !creating;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      // Pin to the top so the top margin actually applies (MUI centers by
      // default via .MuiDialog-scrollPaper, which cancels the margin).
      sx={{
        "& .MuiDialog-container": { alignItems: "flex-start !important" },
        "& .MuiDialog-scrollPaper": { alignItems: "flex-start !important" },
      }}
      slotProps={{
        paper: {
          sx: {
            bgcolor: "var(--bs-surface-base)",
            border: "1px solid var(--bs-border-default)",
            borderRadius: "var(--bs-border-radius-200)",
            backgroundImage: "none",
            height: "70vh",
            mt: "6vh",
          },
        },
      }}
    >
      <DialogTitle
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          py: 2.5,
          px: 4,
          borderBottom: "1px solid var(--bs-border-default)",
        }}
      >
        <Stack>
          <Typography variant="h6" fontWeight={700} sx={{ color: "var(--bs-text-default)" }}>
            Open project
          </Typography>
          <Typography variant="caption" sx={{ color: "var(--bs-text-muted)" }}>
            Pick up where you left off, or start something new.
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" gap={1}>
          {projects && projects.length > 0 && !creating && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<Plus size={14} weight="bold" />}
              onClick={() => setCreating(true)}
              sx={{
                textTransform: "none",
                borderColor: "var(--bs-border-default)",
                color: "var(--bs-text-default)",
                "&:hover": {
                  borderColor: "var(--bs-border-neutral-hover)",
                  bgcolor: "var(--bs-surface-hover)",
                },
              }}
            >
              New project
            </Button>
          )}
          <IconButton onClick={onClose} size="small" aria-label="Close">
            <X size={18} />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* Create flow now collects brand (color + logo) up front. */}
      <ProjectBrandDialog
        open={creating}
        mode="create"
        submitting={createSubmitting}
        onSubmit={handleBrandCreate}
        onClose={() => setCreating(false)}
      />

      <DialogContent sx={{ px: 4, pt: 6, pb: 4 }}>
        <Stack spacing={1.5}>

          {projects === null && !loadError && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={24} sx={{ color: "var(--bs-color-accent-default)" }} />
            </Box>
          )}

          {loadError && (
            <Typography variant="body2" sx={{ color: "var(--bs-color-error-default)" }}>
              Couldn't load projects: {loadError}
            </Typography>
          )}

          {showEmpty && <EmptyState onCreate={() => setCreating(true)} />}

          {projects && projects.length > 0 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
                gap: 2,
              }}
            >
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} ownerEmail={getUserEmail()} tokensCss={tokensCss} onOpen={openProject} usage={usage} />
              ))}
            </Box>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
