"use client";

import React from "react";
import { Box, IconButton, Popover, Stack, Tooltip, Typography } from "@mui/material";
import { Hand, Plus, MagnifyingGlassPlus, Keyboard, ArrowCounterClockwise, ArrowClockwise } from "phosphor-react";

const KbdKey = ({ children }) => (
  <Box
    component="span"
    sx={{
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
      fontSize: "0.65rem",
      fontWeight: 700,
      lineHeight: 1,
      px: 0.5,
      py: 0.25,
      borderRadius: 0.75,
      border: "1px solid",
      borderColor: "divider",
      bgcolor: "action.hover",
      color: "text.primary",
      flexShrink: 0,
    }}
  >
    {children}
  </Box>
);

const Sep = ({ children = "+" }) => (
  <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", display: "inline", fontSize: "0.7rem" }}>
    {children}
  </Typography>
);

const Label = ({ children }) => (
  <Typography variant="caption" sx={{ fontWeight: 600, color: "text.primary", fontSize: "0.7rem" }}>
    {children}
  </Typography>
);

export default function PreviewShortcutsPopover({
  anchorEl,
  open,
  onClose,
  onToggle,
  /** When true, sits in normal flow beside the preview toolbar instead of fixed bottom-right. */
  inline = false,
}) {
  return (
    <Box
      component="aside"
      aria-label="Preview shortcuts"
      sx={
        inline
          ? { position: "relative", flexShrink: 0, zIndex: 4 }
          : {
              position: "fixed",
              right: { xs: 16, sm: 24 },
              left: "auto",
              bottom: { xs: "calc(92px + env(safe-area-inset-bottom, 0px))", sm: 24 },
              transform: "none",
              zIndex: (theme) => theme.zIndex.tooltip,
            }
      }
    >
      <Tooltip title="Keyboard shortcuts" placement="top" arrow>
        <IconButton
          size="small"
          onClick={onToggle}
          aria-label="Preview keyboard shortcuts"
          aria-haspopup="dialog"
          aria-expanded={open}
          sx={{
            bgcolor: open ? "action.selected" : "background.paper",
            border: "1px solid",
            borderColor: open ? "primary.main" : "divider",
            boxShadow: 2,
            color: "primary.main",
            "&:hover": { bgcolor: open ? "action.selected" : "action.hover" },
          }}
        >
          <Keyboard size={22} weight="bold" />
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        disableRestoreFocus
        slotProps={{
          paper: {
            sx: {
              px: 2,
              py: 1.5,
              maxWidth: 380,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: 3,
              mb: 1,
            },
          },
        }}
      >
        <Stack spacing={1} sx={{ lineHeight: 1.25 }}>
          <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap sx={{ gap: 0.5 }}>
            <Box aria-hidden sx={{ display: "flex", color: "primary.main", flexShrink: 0 }}>
              <Hand size={18} weight="duotone" />
            </Box>
            <KbdKey>Space</KbdKey>
            <Box aria-hidden sx={{ display: "flex", alignItems: "center", color: "text.secondary", flexShrink: 0 }}>
              <Plus size={12} weight="bold" />
            </Box>
            <Label>drag to pan</Label>
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap sx={{ gap: 0.5 }}>
            <Box aria-hidden sx={{ display: "flex", color: "primary.main", flexShrink: 0 }}>
              <MagnifyingGlassPlus size={18} weight="duotone" />
            </Box>
            <KbdKey>Scroll</KbdKey>
            <Box aria-hidden sx={{ display: "flex", alignItems: "center", color: "text.secondary", flexShrink: 0 }}>
              <Plus size={12} weight="bold" />
            </Box>
            <Label>zoom</Label>
            <Sep>·</Sep>
            <KbdKey>Ctrl/⌘</KbdKey>
            <Box aria-hidden sx={{ display: "flex", alignItems: "center", color: "text.secondary", flexShrink: 0 }}>
              <Plus size={12} weight="bold" />
            </Box>
            <Label>scroll to zoom</Label>
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap sx={{ gap: 0.5 }}>
            <Box aria-hidden sx={{ display: "flex", color: "primary.main", flexShrink: 0 }}>
              <ArrowCounterClockwise size={18} weight="duotone" />
            </Box>
            <KbdKey>⌘</KbdKey>
            <Sep>/</Sep>
            <KbdKey>Ctrl</KbdKey>
            <Sep>+</Sep>
            <KbdKey>Z</KbdKey>
            <Label>undo</Label>
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap sx={{ gap: 0.5 }}>
            <Box aria-hidden sx={{ display: "flex", color: "primary.main", flexShrink: 0 }}>
              <ArrowClockwise size={18} weight="duotone" />
            </Box>
            <KbdKey>⌘</KbdKey>
            <Sep>+</Sep>
            <KbdKey>⇧</KbdKey>
            <Sep>+</Sep>
            <KbdKey>Z</KbdKey>
            <Label>redo</Label>
          </Stack>
        </Stack>
      </Popover>
    </Box>
  );
}
