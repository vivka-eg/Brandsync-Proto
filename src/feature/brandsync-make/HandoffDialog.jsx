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
  InputBase,
  ButtonBase,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { X, MagnifyingGlass, Ticket, Clock, ArrowRight } from "phosphor-react";
import { getUserEmail } from "@/lib/userEmail";

// Maps a manifest head.status (snake_case) to a label + badge colors.
const STATUS_STYLES = {
  draft: { label: "Draft", fg: "#0073e1", bg: "rgba(0,115,225,0.12)" },
  ready_for_dev: { label: "Ready for dev", fg: "#00855b", bg: "rgba(0,133,91,0.14)" },
  superseded: { label: "Superseded", fg: "#6d7585", bg: "rgba(109,117,133,0.14)" },
};

function statusStyleFor(status) {
  return STATUS_STYLES[status] || { label: status || "Handoff", fg: "#6d7585", bg: "rgba(109,117,133,0.14)" };
}

function initialsFor(email) {
  const handle = String(email || "").split("@")[0] || "?";
  const parts = handle.split(/[.\-_]+/).filter(Boolean);
  const letters = (parts.length >= 2 ? parts[0][0] + parts[1][0] : handle.slice(0, 2));
  return letters.toUpperCase();
}

function relativeTime(iso) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

function HandoffRow({ item, onSelect }) {
  const { ticket, title, version, lastEditedBy, status } = item;
  const statusStyle = statusStyleFor(status);
  const initials = initialsFor(lastEditedBy);
  const lastEditedAt = relativeTime(item.lastEditedAt);

  return (
    <ButtonBase
      onClick={onSelect}
      sx={{
        width: "100%",
        textAlign: "left",
        bgcolor: "var(--bs-surface-raised)",
        border: "1px solid var(--bs-border-default)",
        borderRadius: "var(--bs-border-radius-150)",
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        transition: "border-color 0.15s, transform 0.15s",
        "&:hover": {
          borderColor: "var(--bs-border-neutral-hover)",
          transform: "translateY(-1px)",
          "& .arrow": { opacity: 1, transform: "translateX(0)" },
        },
        "&:focus-visible": {
          outline: "2px solid var(--bs-border-primary)",
          outlineOffset: 2,
        },
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "var(--bs-border-radius-100)",
          bgcolor: "var(--bs-color-info-container)",
          color: "var(--bs-color-info-default)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Ticket size={18} weight="regular" />
      </Box>

      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" gap={1} sx={{ flexWrap: "wrap" }}>
          <Typography
            variant="caption"
            fontWeight={700}
            sx={{
              color: "var(--bs-color-info-default)",
              letterSpacing: "0.04em",
              fontFamily: "monospace",
            }}
          >
            {ticket}
          </Typography>
          {version && (
            <Typography
              variant="caption"
              fontWeight={700}
              sx={{ color: "var(--bs-text-muted)", fontFamily: "monospace" }}
            >
              v{version}
            </Typography>
          )}
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
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            color: "var(--bs-text-default)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Typography>
        <Stack direction="row" alignItems="center" gap={1.25} sx={{ color: "var(--bs-text-muted)" }}>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Avatar
              sx={{
                width: 16,
                height: 16,
                fontSize: "9px",
                fontWeight: 700,
                bgcolor: "var(--bs-color-neutral-container)",
                color: "var(--bs-text-default)",
              }}
            >
              {initials}
            </Avatar>
            <Typography variant="caption">{lastEditedBy}</Typography>
          </Stack>
          <Box sx={{ width: 3, height: 3, borderRadius: "50%", bgcolor: "currentColor", opacity: 0.4 }} />
          <Stack direction="row" alignItems="center" gap={0.5}>
            <Clock size={11} />
            <Typography variant="caption">{lastEditedAt}</Typography>
          </Stack>
        </Stack>
      </Stack>

      <Box
        className="arrow"
        sx={{
          opacity: 0,
          transform: "translateX(-4px)",
          transition: "all 0.15s",
          color: "var(--bs-text-muted)",
          display: "flex",
        }}
      >
        <ArrowRight size={14} weight="bold" />
      </Box>
    </ButtonBase>
  );
}

export default function HandoffDialog({ open, onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const [handoffs, setHandoffs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/handoff/list?userEmail=${encodeURIComponent(getUserEmail() || "")}`)
      .then((res) => res.json())
      .then((body) => {
        if (cancelled) return;
        if (body.error) setError(body.error);
        else setHandoffs(Array.isArray(body.handoffs) ? body.handoffs : []);
      })
      .catch((e) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return handoffs;
    return handoffs.filter(
      (h) =>
        (h.ticket || "").toLowerCase().includes(q) ||
        (h.title || "").toLowerCase().includes(q) ||
        (h.lastEditedBy || "").toLowerCase().includes(q)
    );
  }, [query, handoffs]);

  // Loading a handoff is a round-trip via /api/handoff/load; surface the full
  // manifest to the caller so the page can act on it.
  const handleSelect = async (item) => {
    try {
      const res = await fetch(
        `/api/handoff/load?userEmail=${encodeURIComponent(getUserEmail() || "")}&ticket=${encodeURIComponent(item.ticket)}`,
      );
      const body = await res.json();
      onSelect?.({ ...item, manifest: body.manifest, error: body.error });
    } catch (e) {
      onSelect?.({ ...item, error: e.message });
    }
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          pb: 1.5,
          pr: 1.5,
        }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={700} sx={{ color: "var(--bs-text-default)" }}>
            Load handoff
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--bs-text-muted)" }}>
            Pick a Jira ticket to load its handoff into BrandSync Make.
          </Typography>
        </Stack>
        <IconButton onClick={onClose} size="small" aria-label="Close">
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "var(--bs-surface-raised)",
            border: "1px solid var(--bs-border-default)",
            borderRadius: "var(--bs-border-radius-100)",
            px: 1.5,
            py: 1,
            mb: 2.5,
          }}
        >
          <MagnifyingGlass size={16} color="var(--bs-text-muted)" />
          <InputBase
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ticket number, title, or editor"
            sx={{
              color: "var(--bs-text-default)",
              fontSize: "var(--bs-font-size-sm)",
              "& input::placeholder": { color: "var(--bs-text-muted)", opacity: 1 },
            }}
            inputProps={{ "aria-label": "Search handoffs" }}
            autoFocus
          />
        </Box>

        {loading ? (
          <Stack alignItems="center" sx={{ py: 4 }}>
            <CircularProgress size={20} />
          </Stack>
        ) : error ? (
          <Typography variant="body2" sx={{ color: "var(--bs-color-error-default)", textAlign: "center", py: 4 }}>
            {error}
          </Typography>
        ) : filtered.length === 0 ? (
          <Typography variant="body2" sx={{ color: "var(--bs-text-muted)", textAlign: "center", py: 4 }}>
            {query
              ? `No handoffs match “${query}”`
              : "No handoffs yet — generate one from a project with “Hand off”."}
          </Typography>
        ) : (
          <Stack spacing={1}>
            {filtered.map((item) => (
              <HandoffRow key={item.ticket} item={item} onSelect={() => handleSelect(item)} />
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
