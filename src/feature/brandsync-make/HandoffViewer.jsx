"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Stack,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  X,
  ArrowRight,
  Plus,
  PencilSimple,
  Minus,
  Cards,
  Stack as StackIcon,
  Cube,
  ArrowsLeftRight,
} from "phosphor-react";
import { getUserEmail } from "@/lib/userEmail";
import { diffManifests, previousVersionOf } from "./handoffDiff";

const STATUS_STYLES = {
  draft: { label: "Draft", fg: "#0073e1", bg: "rgba(0,115,225,0.12)" },
  ready_for_dev: { label: "Ready for dev", fg: "#00855b", bg: "rgba(0,133,91,0.14)" },
  superseded: { label: "Superseded", fg: "#6d7585", bg: "rgba(109,117,133,0.14)" },
};

const CHANGE_STYLES = {
  added: { label: "Added", fg: "#00855b", bg: "rgba(0,133,91,0.12)", Icon: Plus },
  changed: { label: "Changed", fg: "#9a6700", bg: "rgba(154,103,0,0.12)", Icon: PencilSimple },
  removed: { label: "Removed", fg: "#c4314b", bg: "rgba(196,49,75,0.12)", Icon: Minus },
};

// How each diffed category labels itself + extracts a human title from an item.
const CATEGORIES = [
  { key: "views", label: "Screens / views", Icon: StackIcon, titleOf: (it) => it?.name || it?.route || it?.id },
  { key: "features", label: "Features", Icon: Cards, titleOf: (it) => it?.intent || it?.id },
  { key: "components", label: "Components", Icon: Cube, titleOf: (it) => it?.ref || it?.slug },
  { key: "flows", label: "Flows", Icon: ArrowsLeftRight, titleOf: (it) => `${it?.from || "?"} → ${it?.to || "?"}` },
];

function statusStyleFor(status) {
  return STATUS_STYLES[status] || { label: status || "Handoff", fg: "#6d7585", bg: "rgba(109,117,133,0.14)" };
}

function SectionLabel({ Icon, children, count }) {
  return (
    <Stack direction="row" alignItems="center" gap={0.75} sx={{ mb: 1 }}>
      {Icon && <Icon size={15} weight="bold" color="var(--bs-text-muted)" />}
      <Typography
        variant="caption"
        fontWeight={700}
        sx={{ color: "var(--bs-text-default)", textTransform: "uppercase", letterSpacing: "0.05em" }}
      >
        {children}
      </Typography>
      {typeof count === "number" && (
        <Typography variant="caption" sx={{ color: "var(--bs-text-muted)" }}>
          {count}
        </Typography>
      )}
    </Stack>
  );
}

// One "what changed" row: a kind chip + the item's title.
function ChangeRow({ kind, title }) {
  const style = CHANGE_STYLES[kind];
  const { Icon } = style;
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      sx={{
        px: 1.25,
        py: 0.875,
        bgcolor: "var(--bs-surface-raised)",
        border: "1px solid var(--bs-border-default)",
        borderRadius: "var(--bs-border-radius-100)",
      }}
    >
      <Box
        sx={{
          width: 18,
          height: 18,
          borderRadius: "var(--bs-border-radius-050, 4px)",
          bgcolor: style.bg,
          color: style.fg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={11} weight="bold" />
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: "var(--bs-text-default)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {title || "—"}
      </Typography>
    </Stack>
  );
}

// A column listing the contents of one version (previous or current).
function VersionColumn({ heading, version, manifest, emptyHint, highlightKeys }) {
  const body = manifest?.body || {};
  const components = manifest?.corpus?.components || [];
  const blocks = [
    { ...CATEGORIES[0], items: body.views || [] },
    { ...CATEGORIES[1], items: body.features || [] },
    { ...CATEGORIES[2], items: components },
  ];

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Stack direction="row" alignItems="baseline" gap={1} sx={{ mb: 1.5 }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ color: "var(--bs-text-default)" }}>
          {heading}
        </Typography>
        {version && (
          <Typography variant="caption" sx={{ color: "var(--bs-text-muted)", fontFamily: "monospace" }}>
            v{version}
          </Typography>
        )}
      </Stack>

      {!manifest ? (
        <Typography variant="body2" sx={{ color: "var(--bs-text-muted)", fontStyle: "italic" }}>
          {emptyHint}
        </Typography>
      ) : (
        <Stack spacing={2}>
          {blocks.map(({ key, label, Icon, titleOf, items }) => (
            <Box key={key}>
              <SectionLabel Icon={Icon} count={items.length}>
                {label}
              </SectionLabel>
              {items.length === 0 ? (
                <Typography variant="caption" sx={{ color: "var(--bs-text-muted)" }}>
                  None
                </Typography>
              ) : (
                <Stack spacing={0.5}>
                  {items.map((it, i) => {
                    const isNew = highlightKeys?.[key]?.has(titleOf(it));
                    return (
                      <Typography
                        key={i}
                        variant="body2"
                        sx={{
                          color: isNew ? "var(--bs-color-success-default, #00855b)" : "var(--bs-text-default)",
                          fontWeight: isNew ? 600 : 400,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isNew ? "+ " : "• "}
                        {titleOf(it) || "—"}
                      </Typography>
                    );
                  })}
                </Stack>
              )}
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default function HandoffViewer({ open, onClose, ticket, manifest }) {
  const [prevManifest, setPrevManifest] = useState(null);
  const [prevVersion, setPrevVersion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentVersion = manifest?.version || null;

  // On open: find the previous version from the version index and load it so we
  // can diff current-vs-previous. No previous version → initial handoff.
  useEffect(() => {
    if (!open || !ticket || !currentVersion) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPrevManifest(null);
    setPrevVersion(null);

    const email = getUserEmail() || "";
    const base = `/api/handoff/load?userEmail=${encodeURIComponent(email)}&ticket=${encodeURIComponent(ticket)}`;

    (async () => {
      try {
        const listRes = await fetch(`${base}&version=list`);
        const listBody = await listRes.json();
        if (cancelled) return;
        const prevV = previousVersionOf(listBody.versions, currentVersion);
        if (!prevV) { setLoading(false); return; } // initial version

        const prevRes = await fetch(`${base}&version=${encodeURIComponent(prevV)}`);
        const prevBody = await prevRes.json();
        if (cancelled) return;
        if (prevBody.error) setError(prevBody.error);
        else { setPrevManifest(prevBody.manifest || null); setPrevVersion(prevV); }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [open, ticket, currentVersion]);

  const diff = useMemo(
    () => (manifest ? diffManifests(prevManifest, manifest) : null),
    [prevManifest, manifest],
  );

  // Keys of items added in the current version, per category — used to highlight
  // them green in the current-version column.
  const addedKeys = useMemo(() => {
    const map = {};
    if (!diff) return map;
    for (const { key, titleOf } of CATEGORIES) {
      map[key] = new Set((diff[key]?.added || []).map((e) => titleOf(e.next)));
    }
    return map;
  }, [diff]);

  const head = manifest?.head || {};
  const statusStyle = statusStyleFor(head.status);
  const changeSummary = head.changeSummary;
  const changeLevel = head.changeLevel;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: "var(--bs-surface-base)",
            border: "1px solid var(--bs-border-default)",
            borderRadius: "var(--bs-border-radius-200)",
            backgroundImage: "none",
          },
        },
      }}
    >
      <DialogTitle
        component="div"
        sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, pb: 1.5, pr: 1.5 }}
      >
        <Stack spacing={0.75} sx={{ minWidth: 0 }}>
          <Stack direction="row" alignItems="center" gap={1} sx={{ flexWrap: "wrap" }}>
            <Typography
              variant="caption"
              fontWeight={700}
              sx={{ color: "var(--bs-color-info-default)", fontFamily: "monospace", letterSpacing: "0.04em" }}
            >
              {ticket}
            </Typography>
            <Box
              sx={{
                px: 0.875,
                py: 0.125,
                fontSize: "10px",
                fontWeight: 600,
                borderRadius: "var(--bs-border-radius-full)",
                bgcolor: statusStyle.bg,
                color: statusStyle.fg,
              }}
            >
              {statusStyle.label}
            </Box>
          </Stack>
          <Typography variant="h6" fontWeight={700} sx={{ color: "var(--bs-text-default)" }}>
            {head.name || ticket}
          </Typography>
          {/* Version progression: vN-1 → vN, or just vN for the initial handoff. */}
          <Stack direction="row" alignItems="center" gap={0.75}>
            {prevVersion && (
              <>
                <Typography variant="body2" sx={{ color: "var(--bs-text-muted)", fontFamily: "monospace" }}>
                  v{prevVersion}
                </Typography>
                <ArrowRight size={13} color="var(--bs-text-muted)" />
              </>
            )}
            <Typography variant="body2" fontWeight={700} sx={{ color: "var(--bs-text-default)", fontFamily: "monospace" }}>
              v{currentVersion}
            </Typography>
            {changeLevel && (
              <Chip
                label={changeLevel}
                size="small"
                sx={{
                  height: 18,
                  fontSize: "10px",
                  fontWeight: 600,
                  bgcolor: "var(--bs-surface-raised)",
                  color: "var(--bs-text-muted)",
                  border: "1px solid var(--bs-border-default)",
                }}
              />
            )}
          </Stack>
        </Stack>
        <IconButton onClick={onClose} size="small" aria-label="Close">
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {changeSummary && (
          <Box
            sx={{
              p: 1.5,
              mb: 2.5,
              bgcolor: "var(--bs-color-info-container, rgba(0,115,225,0.08))",
              border: "1px solid var(--bs-border-default)",
              borderRadius: "var(--bs-border-radius-100)",
            }}
          >
            <Typography variant="body2" sx={{ color: "var(--bs-text-default)" }}>
              {changeSummary}
            </Typography>
          </Box>
        )}

        {loading ? (
          <Stack alignItems="center" sx={{ py: 4 }}>
            <CircularProgress size={20} />
          </Stack>
        ) : error ? (
          <Typography variant="body2" sx={{ color: "var(--bs-color-error-default)", textAlign: "center", py: 3 }}>
            Couldn’t load the previous version: {error}
          </Typography>
        ) : (
          <>
            {/* ── What’s new in this version ───────────────────────────────── */}
            <SectionLabel>{diff?.isInitial ? "What this handoff includes" : `What’s new in v${currentVersion}`}</SectionLabel>
            {diff?.isInitial ? (
              <Typography variant="body2" sx={{ color: "var(--bs-text-muted)", mb: 3 }}>
                This is the initial handoff — there’s no earlier version to compare against. Everything below is the
                first version’s contents.
              </Typography>
            ) : !diff?.hasChanges ? (
              <Typography variant="body2" sx={{ color: "var(--bs-text-muted)", mb: 3 }}>
                No structural changes from v{prevVersion} — copy or token tweaks only.
              </Typography>
            ) : (
              <Stack spacing={2} sx={{ mb: 3 }}>
                {CATEGORIES.map(({ key, label, Icon, titleOf }) => {
                  const d = diff[key];
                  const rows = [
                    ...d.added.map((e) => ({ kind: "added", title: titleOf(e.next) })),
                    ...d.changed.map((e) => ({ kind: "changed", title: titleOf(e.next) })),
                    ...d.removed.map((e) => ({ kind: "removed", title: titleOf(e.prev) })),
                  ];
                  if (rows.length === 0) return null;
                  return (
                    <Box key={key}>
                      <SectionLabel Icon={Icon} count={rows.length}>
                        {label}
                      </SectionLabel>
                      <Stack spacing={0.5}>
                        {rows.map((r, i) => (
                          <ChangeRow key={i} kind={r.kind} title={r.title} />
                        ))}
                      </Stack>
                    </Box>
                  );
                })}
              </Stack>
            )}

            {/* ── Side-by-side: previous version vs this version ───────────── */}
            <SectionLabel>Full contents</SectionLabel>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={3}
              sx={{
                pt: 1,
                "& > *:first-of-type": prevManifest
                  ? { borderRight: { sm: "1px solid var(--bs-border-default)" }, pr: { sm: 3 } }
                  : {},
              }}
            >
              {prevManifest && (
                <VersionColumn
                  heading="Previous version"
                  version={prevVersion}
                  manifest={prevManifest}
                  emptyHint="No previous version."
                />
              )}
              <VersionColumn
                heading={prevManifest ? "This version" : "Contents"}
                version={currentVersion}
                manifest={manifest}
                emptyHint="Empty handoff."
                highlightKeys={addedKeys}
              />
            </Stack>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
