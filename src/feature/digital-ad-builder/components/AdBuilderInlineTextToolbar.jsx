"use client";

import React, { useCallback } from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { Minus, Plus } from "phosphor-react";
import { AlignRow } from "./AdBuilderContentTab";
import { scaleToContentPx, contentPxToScale } from "../lib/contentTextSize";
import { formatShadeMenuLabel, getShadeHex, getSortedShadeKeysForPalette } from "../brandPalettes";

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

const CTA_SCALE_MIN = 0.65;
const CTA_SCALE_MAX = 1.35;
const CTA_STEP = 0.05;
const NEUTRAL_TEXT_COLOR_SWATCHES = [
  { shade: "black", hex: "#000000", label: "Black" },
  { shade: "white", hex: "#ffffff", label: "White" },
];

/**
 * Floating bar for headline/subtext/CTA  -  matches Content / CTA tabs: size + alignment.
 */
export default function AdBuilderInlineTextToolbar({ role, state, setField, anchorEl = null }) {
  const isCta = role === "cta";
  const isHeadline = role === "headline";

  const scaleKey = isCta ? "ctaFontScale" : isHeadline ? "headlineFontScale" : "subtextFontScale";
  const alignKey = isCta ? "ctaAlign" : isHeadline ? "headlineAlign" : "subtextAlign";

  const scaleRaw = typeof state[scaleKey] === "number" ? state[scaleKey] : 1;
  const scale = isCta
    ? Math.min(CTA_SCALE_MAX, Math.max(CTA_SCALE_MIN, scaleRaw))
    : scaleRaw;
  const px = isCta ? Math.round(scale * 100) : scaleToContentPx(scale);
  const align = ["left", "center", "right"].includes(state[alignKey]) ? state[alignKey] : "left";

  const bumpSize = useCallback(
    (delta) => {
      if (isCta) {
        const next = Math.min(
          CTA_SCALE_MAX,
          Math.max(CTA_SCALE_MIN, Math.round((scale + delta * CTA_STEP) * 100) / 100),
        );
        setField(scaleKey, next);
        return;
      }
      const nextPx = Math.min(24, Math.max(12, px + delta));
      setField(scaleKey, contentPxToScale(nextPx));
    },
    [isCta, px, scale, scaleKey, setField],
  );

  const onAlignChange = useCallback(
    (v) => {
      setField(alignKey, v);
    },
    [alignKey, setField],
  );

  const applySelectionColor = useCallback(
    (colorHex) => {
      if (isCta || !anchorEl) return;
      anchorEl.focus();
      try {
        document.execCommand("styleWithCSS", false, true);
      } catch {
        // Best effort; some browsers ignore this command.
      }
      document.execCommand("foreColor", false, colorHex);
    },
    [isCta, anchorEl],
  );

  const paletteName = state.bgPalette;
  const shadeKeys = getSortedShadeKeysForPalette(paletteName).slice(0, 6);
  const colorSwatches = shadeKeys.map((k) => ({
    shade: k,
    hex: getShadeHex(paletteName, k),
    label: formatShadeMenuLabel(k),
  }));

  const preventFocusSteal = useCallback((e) => {
    e.preventDefault();
  }, []);

  const ariaToolbar =
    isCta ? "Call to action button formatting" : isHeadline ? "Heading text formatting" : "Paragraph text formatting";
  const ariaDecrease = isCta ? "Decrease call to action text size" : "Decrease text size";
  const ariaIncrease = isCta ? "Increase call to action text size" : "Increase text size";
  const ariaAlign = isCta ? "Button alignment" : isHeadline ? "Heading alignment" : "Paragraph alignment";
  const sizeDisabledMin = isCta ? scale <= CTA_SCALE_MIN : px <= 12;
  const sizeDisabledMax = isCta ? scale >= CTA_SCALE_MAX : px >= 24;

  return (
    <Box
      role="toolbar"
      aria-label={ariaToolbar}
      sx={{
        pointerEvents: "auto",
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 1,
        py: 0.5,
        borderRadius: 999,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: (t) =>
          t.palette.mode === "dark"
            ? "0 8px 28px rgba(0,0,0,0.45)"
            : "0 8px 28px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={0.25} sx={{ pl: 0.25 }}>
        <Typography
          variant="caption"
          component="span"
          color="text.secondary"
          sx={{
            fontWeight: 600,
            minWidth: isCta ? 36 : 28,
            textAlign: "center",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {isCta ? `${px}%` : px}
        </Typography>
        <IconButton
          size="small"
          aria-label={ariaDecrease}
          disabled={sizeDisabledMin}
          onMouseDown={preventFocusSteal}
          onClick={() => bumpSize(-1)}
          sx={{ p: 0.35 }}
        >
          <Minus size={18} weight="bold" aria-hidden />
        </IconButton>
        <IconButton
          size="small"
          aria-label={ariaIncrease}
          disabled={sizeDisabledMax}
          onMouseDown={preventFocusSteal}
          onClick={() => bumpSize(1)}
          sx={{ p: 0.35 }}
        >
          <Plus size={18} weight="bold" aria-hidden />
        </IconButton>
      </Stack>

      <ToolbarDivider />

      <Box onMouseDown={preventFocusSteal} sx={{ "& .MuiToggleButtonGroup-root": { mt: 0 } }}>
        <AlignRow value={align} onChange={onAlignChange} ariaLabel={ariaAlign} />
      </Box>

      {!isCta && colorSwatches.length > 0 ? (
        <>
          <ToolbarDivider />
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ pr: 0.25 }}>
            {colorSwatches.map((sw) => (
              <IconButton
                key={`sw-${sw.shade}-${sw.hex}`}
                size="small"
                aria-label={`Apply ${sw.label} color`}
                title={`${sw.label} - ${sw.hex}`}
                onMouseDown={preventFocusSteal}
                onClick={() => applySelectionColor(sw.hex)}
                sx={{ p: 0.2 }}
              >
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    bgcolor: sw.hex,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                />
              </IconButton>
            ))}
            <Box
              aria-hidden
              sx={{
                width: 1,
                height: 18,
                bgcolor: "divider",
              }}
            />
            {NEUTRAL_TEXT_COLOR_SWATCHES.map((sw) => (
              <IconButton
                key={`sw-${sw.shade}-${sw.hex}`}
                size="small"
                aria-label={`Apply ${sw.label} color`}
                title={`${sw.label} - ${sw.hex}`}
                onMouseDown={preventFocusSteal}
                onClick={() => applySelectionColor(sw.hex)}
                sx={{ p: 0.2 }}
              >
                <Box
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    bgcolor: sw.hex,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                />
              </IconButton>
            ))}
          </Stack>
        </>
      ) : null}
    </Box>
  );
}
