"use client";

import React, { useCallback } from "react";
import { Box, IconButton, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { Image, Minus, Plus, SquaresFour } from "phosphor-react";
import { AlignRow } from "./AdBuilderContentTab";

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

const LOGO_SCALE_MIN = 0.5;
const LOGO_SCALE_MAX = 1.5;
const LOGO_STEP = 0.05;

/**
 * Floating controls for logo  -  matches Logo on ad: size, placement, align.
 */
export default function AdBuilderLogoFormatToolbar({ state, setField }) {
  const scaleRaw = typeof state.logoScale === "number" ? state.logoScale : 1;
  const scale = Math.min(LOGO_SCALE_MAX, Math.max(LOGO_SCALE_MIN, scaleRaw));
  const pct = Math.round(scale * 100);
  const placement = ["inLayout", "onPhotoTop"].includes(state.logoPlacement) ? state.logoPlacement : "inLayout";
  const align = ["left", "center", "right"].includes(state.logoAlign) ? state.logoAlign : "left";

  const bumpScale = useCallback(
    (delta) => {
      const next = Math.min(
        LOGO_SCALE_MAX,
        Math.max(LOGO_SCALE_MIN, Math.round((scale + delta * LOGO_STEP) * 100) / 100),
      );
      setField("logoScale", next);
    },
    [scale, setField],
  );

  const onAlignChange = useCallback(
    (v) => {
      setField("logoAlign", v);
    },
    [setField],
  );

  const preventFocusSteal = useCallback((e) => {
    e.preventDefault();
  }, []);

  const iconSize = 16;

  return (
    <Box
      role="toolbar"
      aria-label="Logo formatting"
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
        "& .MuiToggleButtonGroup-root": { flexShrink: 0 },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={0.125} sx={{ pl: 0.125, flexShrink: 0 }}>
        <Typography
          variant="caption"
          component="span"
          color="text.secondary"
          sx={{
            fontWeight: 600,
            minWidth: 30,
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
          aria-label="Decrease logo size"
          disabled={scale <= LOGO_SCALE_MIN}
          onMouseDown={preventFocusSteal}
          onClick={() => bumpScale(-1)}
          sx={{ p: 0.25 }}
        >
          <Minus size={iconSize} weight="bold" aria-hidden />
        </IconButton>
        <IconButton
          size="small"
          aria-label="Increase logo size"
          disabled={scale >= LOGO_SCALE_MAX}
          onMouseDown={preventFocusSteal}
          onClick={() => bumpScale(1)}
          sx={{ p: 0.25 }}
        >
          <Plus size={iconSize} weight="bold" aria-hidden />
        </IconButton>
      </Stack>

      <ToolbarDivider />

      <Box onMouseDown={preventFocusSteal} sx={{ flexShrink: 0 }}>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={placement}
          onChange={(_, v) => v != null && setField("logoPlacement", v)}
          aria-label="Logo placement"
        >
          <ToggleButton value="inLayout" aria-label="In layout" sx={{ px: 0.5, py: 0.25, minWidth: 0 }}>
            <SquaresFour size={iconSize} weight="bold" aria-hidden />
          </ToggleButton>
          <ToggleButton value="onPhotoTop" aria-label="On photo" sx={{ px: 0.5, py: 0.25, minWidth: 0 }}>
            <Image size={iconSize} weight="bold" aria-hidden />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <ToolbarDivider />

      <Box
        onMouseDown={preventFocusSteal}
        sx={{
          flexShrink: 0,
          "& .MuiToggleButtonGroup-root": { mt: 0 },
          "& .MuiToggleButton-root": { px: 0.4, py: 0.2 },
        }}
      >
        <AlignRow value={align} onChange={onAlignChange} ariaLabel="Logo alignment" />
      </Box>
    </Box>
  );
}
