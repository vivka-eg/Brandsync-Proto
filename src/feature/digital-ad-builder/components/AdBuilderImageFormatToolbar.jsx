"use client";

import React, { useCallback } from "react";
import { Box, Button, IconButton, Stack, Typography, Tooltip } from "@mui/material";
import { Image as ImageIcon, Minus, Plus, Crosshair } from "phosphor-react";
import { alpha } from "@mui/material/styles";

function ToolbarDivider() {
  return (
    <Box
      aria-hidden
      sx={{
        width: 1,
        alignSelf: "stretch",
        minHeight: 22,
        my: 0.25,
        bgcolor: "divider",
      }}
    />
  );
}

const IMAGE_SCALE_MIN = 0.5;
const IMAGE_SCALE_MAX = 2;
const IMAGE_STEP = 0.05;

/**
 * Floating controls for background image  -  size (same range as Edit image) + change image.
 */
export default function AdBuilderImageFormatToolbar({
  state,
  setField,
  onOpenStockDialog,
  showMiniPreview = false,
  onToggleMiniPreview,
}) {
  const scaleRaw = typeof state.imageScale === "number" ? state.imageScale : 1;
  const scale = Math.min(IMAGE_SCALE_MAX, Math.max(IMAGE_SCALE_MIN, scaleRaw));
  const pct = Math.round(scale * 100);

  const bumpScale = useCallback(
    (delta) => {
      const next = Math.min(
        IMAGE_SCALE_MAX,
        Math.max(IMAGE_SCALE_MIN, Math.round((scale + delta * IMAGE_STEP) * 100) / 100),
      );
      setField("imageScale", next);
    },
    [scale, setField],
  );

  const preventFocusSteal = useCallback((e) => {
    e.preventDefault();
  }, []);

  const iconSize = 16;

  return (
    <Box
      role="toolbar"
      aria-label="Background image"
      sx={{
        pointerEvents: "auto",
        display: "inline-flex",
        flexWrap: "nowrap",
        alignItems: "center",
        gap: 0.25,
        px: 0.75,
        py: 0.35,
        borderRadius: 999,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: (t) =>
          t.palette.mode === "dark"
            ? "0 8px 28px rgba(0,0,0,0.45)"
            : "0 8px 28px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.06)",
        maxWidth: "calc(100vw - 16px)",
        flexShrink: 0,
        overflowX: "auto",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={0.125} sx={{ pl: 0.125, flexShrink: 0 }}>
        <Typography
          variant="caption"
          component="span"
          color="text.secondary"
          sx={{
            fontWeight: 600,
            minWidth: 34,
            textAlign: "center",
            fontVariantNumeric: "tabular-nums",
            fontSize: "0.7rem",
            lineHeight: 1.2,
          }}
        >
          {pct}%
        </Typography>
        <IconButton
          size="small"
          aria-label="Decrease image size"
          disabled={scale <= IMAGE_SCALE_MIN}
          onMouseDown={preventFocusSteal}
          onClick={() => bumpScale(-1)}
          sx={{ p: 0.25 }}
        >
          <Minus size={iconSize} weight="bold" aria-hidden />
        </IconButton>
        <IconButton
          size="small"
          aria-label="Increase image size"
          disabled={scale >= IMAGE_SCALE_MAX}
          onMouseDown={preventFocusSteal}
          onClick={() => bumpScale(1)}
          sx={{ p: 0.25 }}
        >
          <Plus size={iconSize} weight="bold" aria-hidden />
        </IconButton>
      </Stack>

      <ToolbarDivider />

      <Button
        size="small"
        variant="outlined"
        color="primary"
        onMouseDown={preventFocusSteal}
        onClick={() => onOpenStockDialog?.()}
        aria-label="Change background image"
        startIcon={<ImageIcon size={iconSize} weight="bold" aria-hidden />}
        sx={{
          flexShrink: 0,
          minWidth: 0,
          px: 1,
          py: 0.25,
          fontSize: "0.7rem",
          fontWeight: 600,
          textTransform: "none",
          lineHeight: 1.2,
          borderRadius: 999,
        }}
      >
        Change
      </Button>

      <ToolbarDivider />

      <Tooltip title={showMiniPreview ? "Hide mini preview" : "Show mini preview"}>
        <span>
          <IconButton
            size="small"
            aria-label="Toggle mini preview"
            onMouseDown={preventFocusSteal}
            onClick={onToggleMiniPreview}
            sx={{
              p: 0.25,
              color: showMiniPreview ? "primary.main" : "inherit",
              bgcolor: showMiniPreview ? (t) => alpha(t.palette.primary.main, 0.1) : "transparent",
              borderRadius: "50%",
            }}
          >
            <Crosshair size={iconSize} weight="bold" aria-hidden />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}
