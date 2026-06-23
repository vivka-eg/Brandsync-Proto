"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Typography,
  InputBase,
  Button,
  CircularProgress,
} from "@mui/material";
import { X, PaperPlaneTilt, GitBranch, Ticket } from "phosphor-react";

// Confirm + generate a versioned design handoff for the selected file (pattern).
// When `existingHandoff` is set the file has already been handed off, so this is
// an UPDATE — we don't re-ask for the name/ticket (they're already bound); we
// just confirm and let the server compute the next version + what changed.
export default function HandoffGenerateDialog({ open, onClose, pattern, existingHandoff, onGenerate, generating, phase }) {
  const [name, setName] = useState("");
  const [ticketOverride, setTicketOverride] = useState("");

  const patternName = pattern?.name || pattern?.slug || "";
  const isUpdate = !!existingHandoff;

  const handleGenerate = () => {
    if (isUpdate) {
      // Keep the existing name/ticket binding — server bumps the version.
      onGenerate?.({});
      return;
    }
    onGenerate?.({
      name: name.trim() || patternName,
      ticketOverride: ticketOverride.trim() || undefined,
      // bump is auto-decided server-side by comparing to the previous handoff.
    });
  };

  const fieldSx = {
    bgcolor: "var(--bs-surface-raised)",
    border: "1px solid var(--bs-border-default)",
    borderRadius: "var(--bs-border-radius-100)",
    px: 1.5,
    py: 1,
    color: "var(--bs-text-default)",
    fontSize: "var(--bs-font-size-sm)",
    "& input::placeholder": { color: "var(--bs-text-muted)", opacity: 1 },
  };

  return (
    <Dialog
      open={open}
      onClose={generating ? undefined : onClose}
      maxWidth="sm"
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
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={700} sx={{ color: "var(--bs-text-default)" }}>
            {isUpdate ? "Update handoff" : "Generate handoff"}
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--bs-text-muted)" }}>
            {isUpdate
              ? "Snapshot the latest edits as a new version — we’ll show you what changed."
              : "Snapshot this file as a versioned JSON handoff for developers."}
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small" aria-label="Close" disabled={generating}>
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2}>
          {isUpdate ? (
            // Already handed off — show the existing binding read-only instead of
            // re-asking for a name. The new version is computed on generate.
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{
                px: 1.5, py: 1.25,
                borderRadius: "var(--bs-border-radius-100)",
                bgcolor: "var(--bs-surface-raised)",
                border: "1px solid var(--bs-border-default)",
              }}
            >
              <Ticket size={18} color="var(--bs-color-info-default)" />
              <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{ color: "var(--bs-color-info-default)", fontFamily: "monospace", letterSpacing: "0.04em" }}
                >
                  {existingHandoff.ticket}
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ color: "var(--bs-text-default)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {existingHandoff.title || patternName}
                </Typography>
              </Stack>
              {existingHandoff.version && (
                <Typography variant="caption" fontWeight={700} sx={{ color: "var(--bs-text-muted)", fontFamily: "monospace" }}>
                  currently v{existingHandoff.version}
                </Typography>
              )}
            </Stack>
          ) : (
            <>
              <Stack spacing={0.75}>
                <Typography variant="caption" fontWeight={600} sx={{ color: "var(--bs-text-muted)" }}>
                  Handoff name
                </Typography>
                <InputBase
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={patternName || "e.g. Asset filter chips refresh"}
                  sx={fieldSx}
                />
              </Stack>

              <Stack spacing={0.75}>
                <Typography variant="caption" fontWeight={600} sx={{ color: "var(--bs-text-muted)" }}>
                  Jira ticket (optional)
                </Typography>
                <InputBase
                  fullWidth
                  value={ticketOverride}
                  onChange={(e) => setTicketOverride(e.target.value)}
                  placeholder="Bind a real ticket, e.g. APT-202 — leave blank for an auto key"
                  sx={fieldSx}
                />
              </Stack>
            </>
          )}

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              px: 1.5, py: 1,
              borderRadius: "var(--bs-border-radius-100)",
              bgcolor: "var(--bs-surface-raised)",
              border: "1px solid var(--bs-border-default)",
            }}
          >
            <GitBranch size={16} color="var(--bs-text-muted)" weight="bold" />
            <Typography variant="caption" sx={{ color: "var(--bs-text-muted)" }}>
              The version bumps automatically — compared to the last handoff, a <b>major</b> change
              (added/removed/restructured screens, features, or flows) bumps the whole number, anything
              smaller bumps the decimal.
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1.5}>
            {generating && phase && (
              <Typography variant="caption" sx={{ color: "var(--bs-text-muted)", flex: 1, textAlign: "left" }}>
                {phase}
              </Typography>
            )}
            <Button
              onClick={handleGenerate}
              disabled={generating}
              variant="contained"
              startIcon={generating ? <CircularProgress size={14} color="inherit" /> : <PaperPlaneTilt size={16} weight="bold" />}
              sx={{ textTransform: "none", fontWeight: 600, flexShrink: 0 }}
            >
              {generating ? "Generating…" : isUpdate ? "Generate new version" : "Generate handoff"}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
