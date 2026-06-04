"use client";

import React from "react";
import { Box, Typography, Collapse } from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";

/**
 * Compact collapsible section for the Digital Ad builder side panel.
 * Custom UI (not MUI Accordion)  -  minimal chrome, small type, tight padding.
 * Use as a controlled panel: pass `expanded` and `onToggle` (parent enforces single-open if needed).
 */
export default function AdBuilderMiniPanel({
  /** Stable id prefix, e.g. `ad-builder-acc-logo` → header `ad-builder-acc-logo-header`, region `ad-builder-acc-logo-content`. */
  id: baseId,
  title,
  expanded,
  onToggle,
  children,
}) {
  const open = Boolean(expanded);
  const headerId = `${baseId}-header`;
  const regionId = `${baseId}-content`;

  return (
    <Box
      id={baseId}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        mb: 1,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <Box
        component="button"
        type="button"
        id={headerId}
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={regionId}
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          minHeight: 35,
          px: 1.5,
          py: 0.875,
          m: 0,
          border: "none",
          borderBottom: open ? "1px solid" : "none",
          borderColor: "divider",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "grey.50",
          cursor: "pointer",
          font: "inherit",
          textAlign: "left",
          transition: "background-color 0.15s ease",
          "&:hover": {
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "rgba(255,255,255,0.07)" : "grey.100",
          },
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: -2,
          },
        }}
      >
        <Typography
          component="span"
          sx={{
            fontSize: "0.75rem",
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: 0.06,
            textTransform: "uppercase",
            color: "text.primary",
          }}
        >
          {title}
        </Typography>
        <ExpandMore
          sx={{
            fontSize: 18,
            color: "text.secondary",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: (theme) =>
              theme.transitions.create("transform", {
                duration: theme.transitions.duration.shorter,
              }),
          }}
          aria-hidden
        />
      </Box>
      <Collapse in={open} timeout="auto">
        <Box
          id={regionId}
          role="region"
          aria-labelledby={headerId}
          sx={{ px: 1.5, pb: 1.5, pt: 1.25 }}
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}
