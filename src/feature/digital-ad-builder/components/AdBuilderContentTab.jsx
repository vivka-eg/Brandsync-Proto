"use client";

import React from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Slider,
  Tooltip,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import HelpOutline from "@mui/icons-material/HelpOutline";
import FormatAlignLeft from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenter from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRight from "@mui/icons-material/FormatAlignRight";
import { scaleToContentPx, contentPxToScale } from "../lib/contentTextSize";
import SliderValueInput from "./SliderValueInput";

export const cardSx = (theme) => ({
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1,
  p: 1.5,
  bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "grey.50",
});

export function SectionLabel({ children, tooltip, dense = false }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: dense ? 0.5 : 1 }}>
      <Typography
        variant="body2"
        fontWeight={600}
        color="text.primary"
        sx={dense ? { fontSize: "0.75rem", lineHeight: 1.2 } : undefined}
      >
        {children}
      </Typography>
      <Tooltip title={tooltip} placement="top" arrow>
        <IconButton size="small" aria-label="More info" sx={{ p: dense ? 0.15 : 0.25 }}>
          <HelpOutline sx={{ fontSize: dense ? 16 : 18, color: "text.secondary" }} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

function TextSizeRow({ label, pxValue, onPxChange }) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <SliderValueInput
          displayValue={pxValue}
          unit=" px"
          min={12}
          max={24}
          step={1}
          onCommit={onPxChange}
        />
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 0.25 }}>
        <Typography variant="caption" color="text.disabled" sx={{ minWidth: 22, fontVariantNumeric: "tabular-nums" }}>
          12
        </Typography>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Slider
            size="small"
            value={pxValue}
            min={12}
            max={24}
            step={1}
            onChange={(_, v) => onPxChange(v)}
          />
        </Box>
        <Typography variant="caption" color="text.disabled" sx={{ minWidth: 22, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
          24
        </Typography>
      </Stack>
    </Box>
  );
}

function SimpleSliderRow({ label, value, min, max, step, displayValue, onChange }) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography
          variant="caption"
          fontWeight={600}
          color="text.secondary"
          sx={{ fontVariantNumeric: "tabular-nums" }}
        >
          {displayValue}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 0.25 }}>
        <Typography variant="caption" color="text.disabled" sx={{ minWidth: 22, fontVariantNumeric: "tabular-nums" }}>
          {min}
        </Typography>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Slider
            size="small"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(_, v) => onChange(v)}
          />
        </Box>
        <Typography variant="caption" color="text.disabled" sx={{ minWidth: 22, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
          {max}
        </Typography>
      </Stack>
    </Box>
  );
}

export function AlignRow({ value, onChange, ariaLabel = "Text alignment" }) {
  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={value}
      onChange={(_, next) => next != null && onChange(next)}
      aria-label={ariaLabel}
      sx={{ alignSelf: "flex-start", mt: 0.5 }}
    >
      <ToggleButton value="left" aria-label="Align left">
        <FormatAlignLeft fontSize="small" />
      </ToggleButton>
      <ToggleButton value="center" aria-label="Align center">
        <FormatAlignCenter fontSize="small" />
      </ToggleButton>
      <ToggleButton value="right" aria-label="Align right">
        <FormatAlignRight fontSize="small" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default function AdBuilderContentTab({ state, setField, onResetToDefaults, dense = false }) {
  const headlinePx = scaleToContentPx(state.headlineFontScale ?? 1);
  const subtextPx = scaleToContentPx(state.subtextFontScale ?? 1);
  const headlineSpacing = state.headlineSpacing ?? 1;
  const subtextLineHeight = state.subtextLineHeight ?? 1.15;

  const cardSxResolved = (theme) => ({
    ...cardSx(theme),
    ...(dense ? { p: 1, borderRadius: 0.75 } : {}),
  });

  return (
    <Stack spacing={dense ? 1.25 : 2}>
      <Box sx={cardSxResolved}>
        <SectionLabel dense={dense} tooltip="Main headline shown on the ad.">
          Heading
        </SectionLabel>
        <Stack spacing={dense ? 1 : 1.25}>
          <TextField
            value={state.headline}
            onChange={(e) => setField("headline", e.target.value)}
            fullWidth
            size="small"
            placeholder="Headline"
          />
          <TextSizeRow
            label="Text Size"
            pxValue={headlinePx}
            onPxChange={(px) => setField("headlineFontScale", contentPxToScale(px))}
          />
          <SimpleSliderRow
            label="Spacing"
            value={headlineSpacing}
            min={0}
            max={3}
            step={0.1}
            displayValue={headlineSpacing.toFixed(1) + "×"}
            onChange={(v) => setField("headlineSpacing", v)}
          />
          <AlignRow
            value={state.headlineAlign ?? "left"}
            onChange={(v) => setField("headlineAlign", v)}
          />
        </Stack>
      </Box>

      <Box sx={cardSxResolved}>
        <SectionLabel dense={dense} tooltip="Supporting copy below the headline.">
          Paragraph
        </SectionLabel>
        <Stack spacing={dense ? 1 : 1.25}>
          <TextField
            value={state.subtext}
            onChange={(e) => setField("subtext", e.target.value)}
            fullWidth
            multiline
            minRows={2}
            size="small"
            placeholder="Paragraph"
          />
          <TextSizeRow
            label="Text Size"
            pxValue={subtextPx}
            onPxChange={(px) => setField("subtextFontScale", contentPxToScale(px))}
          />
          <SimpleSliderRow
            label="Line Height"
            value={subtextLineHeight}
            min={0.8}
            max={2.5}
            step={0.05}
            displayValue={subtextLineHeight.toFixed(2)}
            onChange={(v) => setField("subtextLineHeight", v)}
          />
          <AlignRow
            value={state.subtextAlign ?? "left"}
            onChange={(v) => setField("subtextAlign", v)}
          />
        </Stack>
      </Box>
    </Stack>
  );
}
