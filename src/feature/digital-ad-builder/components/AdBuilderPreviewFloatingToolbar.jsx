"use client";

import React from "react";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import SliderValueInput from "./SliderValueInput";
import {
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  CornersIn,
  ArrowCounterClockwise,
  ArrowClockwise,
} from "phosphor-react";
import { PREVIEW_ZOOM_MIN, PREVIEW_ZOOM_MAX } from "../lib/previewConstants";

function ToolbarDivider() {
  return (
    <Box
      aria-hidden
      sx={{
        width: 1,
        alignSelf: "stretch",
        minHeight: 28,
        my: 0.5,
        bgcolor: "divider",
      }}
    />
  );
}

/**
 * Floating canvas toolbar (design: EG Toolbar)  -  bottom-centered over the preview region.
 */
export default function AdBuilderPreviewFloatingToolbar({
  previewZoom,
  setPreviewZoom,
  onFitToView,
  hasPreset,
  disabled,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  prefersReducedMotion = false,
}) {
  const pct = Math.round(previewZoom * 100);

  const [undoKey, setUndoKey] = React.useState(0);
  const [redoKey, setRedoKey] = React.useState(0);

  const handleUndo = () => {
    if (!canUndo) return;
    setUndoKey((k) => k + 1);
    onUndo?.();
  };
  const handleRedo = () => {
    if (!canRedo) return;
    setRedoKey((k) => k + 1);
    onRedo?.();
  };

  const undoRedoPulseSx = prefersReducedMotion
    ? {}
    : {
        "@keyframes undoPulse": {
          "0%": { transform: "scale(1)" },
          "35%": { transform: "scale(0.78)" },
          "70%": { transform: "scale(1.12)" },
          "100%": { transform: "scale(1)" },
        },
        animation: "undoPulse 0.24s cubic-bezier(0.34, 1.56, 0.64, 1) both",
      };

  const zoomOut = () =>
    setPreviewZoom((z) =>
      Math.max(PREVIEW_ZOOM_MIN, Math.round((z - 0.1) * 100) / 100),
    );
  const zoomIn = () =>
    setPreviewZoom((z) =>
      Math.min(PREVIEW_ZOOM_MAX, Math.round((z + 0.1) * 100) / 100),
    );

  const entranceSx = prefersReducedMotion
    ? {}
    : {
        "@keyframes toolbarFloat": {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        animation: "toolbarFloat 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both",
      };

  return (
    <Box
      role="toolbar"
      aria-label="Preview canvas tools"
      sx={{
        pointerEvents: "auto",
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.25,
        py: 0.75,
        borderRadius: 999,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: (t) =>
          t.palette.mode === "dark"
            ? "0 8px 28px rgba(0,0,0,0.45)"
            : "0 8px 28px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.06)",
        ...entranceSx,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.25}
        sx={{
          px: 0.5,
          py: 0.25,
          borderRadius: 1.5,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: (t) => (t.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "grey.50"),
        }}
      >
        <Tooltip title="Zoom in">
          <span>
            <IconButton
              size="small"
              aria-label="Zoom in preview"
              onClick={zoomIn}
              disabled={disabled || !hasPreset || previewZoom >= PREVIEW_ZOOM_MAX}
            >
              <MagnifyingGlassPlus size={20} />
            </IconButton>
          </span>
        </Tooltip>
        <SliderValueInput
          displayValue={pct}
          unit="%"
          min={Math.round(PREVIEW_ZOOM_MIN * 100)}
          max={Math.round(PREVIEW_ZOOM_MAX * 100)}
          step={1}
          disabled={disabled || !hasPreset}
          width={58}
          height={26}
          fontSize="0.75rem"
          onCommit={(v) => setPreviewZoom(Math.round(v) / 100)}
        />
        <Tooltip title="Zoom out">
          <span>
            <IconButton
              size="small"
              aria-label="Zoom out preview"
              onClick={zoomOut}
              disabled={disabled || !hasPreset || previewZoom <= PREVIEW_ZOOM_MIN}
            >
              <MagnifyingGlassMinus size={20} />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      <Tooltip title="Fit to view">
        <span>
          <IconButton
            size="small"
            aria-label="Reset zoom and pan to fit view"
            onClick={onFitToView}
            disabled={disabled || !hasPreset}
          >
            <CornersIn size={22} />
          </IconButton>
        </span>
      </Tooltip>

      <ToolbarDivider />

      <Tooltip title="Undo (⌘Z / Ctrl+Z)">
        <span>
          <IconButton
            size="small"
            aria-label="Undo"
            onClick={handleUndo}
            disabled={!canUndo}
          >
            <Box key={undoKey} component="span" sx={{ display: "inline-flex", ...(undoKey > 0 ? undoRedoPulseSx : {}) }}>
              <ArrowCounterClockwise size={22} />
            </Box>
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Redo (⌘⇧Z / Ctrl+Shift+Z)">
        <span>
          <IconButton
            size="small"
            aria-label="Redo"
            onClick={handleRedo}
            disabled={!canRedo}
          >
            <Box key={redoKey} component="span" sx={{ display: "inline-flex", ...(redoKey > 0 ? undoRedoPulseSx : {}) }}>
              <ArrowClockwise size={22} />
            </Box>
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}
