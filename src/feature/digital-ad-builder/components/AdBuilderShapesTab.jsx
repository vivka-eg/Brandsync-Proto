"use client";

import React from "react";
import {
  Box,
  Typography,
  Stack,
  Tooltip,
  IconButton,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import HelpOutline from "@mui/icons-material/HelpOutline";
import {
  CircleHalf,
  ArrowsOut,
  ArrowsOutLineHorizontal,
  ArrowsOutLineVertical,
} from "phosphor-react";
import LabeledSliderRow from "./LabeledSliderRow";
import SliderValueInput from "./SliderValueInput";

function ShapeSliderRow({ icon: Icon, label, valueBox, disabled, slider, minLabel, maxLabel }) {
  return (
    <Box sx={{ opacity: disabled ? 0.45 : 1 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Box sx={{ color: "text.secondary", display: "flex", lineHeight: 0 }}>
            <Icon size={18} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
        </Stack>
        {valueBox}
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 0.25 }}>
        <Typography variant="caption" color="text.disabled" sx={{ minWidth: 28, fontVariantNumeric: "tabular-nums" }}>
          {minLabel}
        </Typography>
        <Box sx={{ flex: 1, minWidth: 0 }}>{slider}</Box>
        <Typography variant="caption" color="text.disabled" sx={{ minWidth: 28, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
          {maxLabel}
        </Typography>
      </Stack>
    </Box>
  );
}

const cardSx = (theme) => ({
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1,
  p: 1.5,
  bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "grey.50",
});

function cardSxResolved(theme, dense) {
  return {
    ...cardSx(theme),
    ...(dense ? { p: 1, borderRadius: 0.75 } : {}),
  };
}

export default function AdBuilderShapesTab({ hasBackgroundImage, state, setField, isLeaderboardFormat, dense = false }) {
  const frostOn = state.frostPanelEnabled !== false;
  const opacityPct = Math.round((state.frostOpacity ?? 0.5) * 100);
  const scalePct = Math.round((state.frostPanelScale ?? 1) * 100);
  const hPct = 50 + (state.frostPanelOffsetX ?? 0);
  const vPct = 50 + (state.frostPanelOffsetY ?? 0);
  /** Frosted panel sliders need a photo to position the card over. */
  const frostShapeControlsDisabled = !hasBackgroundImage;
  /** Photo + band layout uses solid brand colour even without an image - keep controls usable. */
  const photoBandControlsDisabled = false;
  const isFrostedLayout = (state.adLayout ?? "frostedPanel") === "frostedPanel";

  return (
    <Stack spacing={dense ? 1 : 2}>
      {isFrostedLayout ? (
        <Box sx={(theme) => cardSxResolved(theme, dense)}>
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: dense ? 0.75 : 1.5 }}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={dense ? { fontSize: "0.75rem", lineHeight: 1.2 } : undefined}
            >
              Edit Shapes
            </Typography>
            <Tooltip
              title="Solid uses a flat brand colour panel. Frosted adds a glass blur over the image. Adjust size and position of the content panel."
              placement="top"
              arrow
            >
              <IconButton size="small" aria-label="About shapes" sx={{ p: dense ? 0.15 : 0.25 }}>
                <HelpOutline sx={{ fontSize: dense ? 16 : 18, color: "text.secondary" }} />
              </IconButton>
            </Tooltip>
          </Stack>

          <ToggleButtonGroup
            exclusive
            fullWidth
            size="small"
            value={frostOn ? "frosted" : "solid"}
            onChange={(_, v) => {
              if (v != null) setField("frostPanelEnabled", v === "frosted");
            }}
            disabled={frostShapeControlsDisabled}
            sx={{ mb: dense ? 1 : 2 }}
          >
            <ToggleButton value="solid" aria-label="Solid panel">
              Solid
            </ToggleButton>
            <ToggleButton value="frosted" aria-label="Frosted panel">
              Frosted
            </ToggleButton>
          </ToggleButtonGroup>

          <Stack spacing={dense ? 1 : 2}>
            <ShapeSliderRow
              icon={CircleHalf}
              label="Opacity"
              disabled={frostShapeControlsDisabled || !frostOn}
              minLabel="0%"
              maxLabel="100%"
              valueBox={
                <SliderValueInput
                  displayValue={opacityPct}
                  unit="%"
                  min={0}
                  max={100}
                  step={5}
                  disabled={frostShapeControlsDisabled || !frostOn}
                  onCommit={(v) => setField("frostOpacity", v / 100)}
                />
              }
              slider={
                <Slider
                  size="small"
                  value={typeof state.frostOpacity === "number" ? state.frostOpacity : 0.5}
                  min={0}
                  max={1}
                  step={0.05}
                  disabled={frostShapeControlsDisabled || !frostOn}
                  onChange={(_, v) => setField("frostOpacity", v)}
                />
              }
            />
            <ShapeSliderRow
              icon={ArrowsOut}
              label="Shape size"
              disabled={frostShapeControlsDisabled}
              minLabel="50%"
              maxLabel="100%"
              valueBox={
                <SliderValueInput
                  displayValue={scalePct}
                  unit="%"
                  min={50}
                  max={100}
                  step={2}
                  disabled={frostShapeControlsDisabled}
                  onCommit={(v) => setField("frostPanelScale", v / 100)}
                />
              }
              slider={
                <Slider
                  size="small"
                  value={typeof state.frostPanelScale === "number" ? state.frostPanelScale : 1}
                  min={0.5}
                  max={1}
                  step={0.02}
                  disabled={frostShapeControlsDisabled}
                  onChange={(_, v) => setField("frostPanelScale", v)}
                />
              }
            />
            <ShapeSliderRow
              icon={ArrowsOutLineHorizontal}
              label="Horizontal position"
              disabled={frostShapeControlsDisabled}
              minLabel="0%"
              maxLabel="100%"
              valueBox={
                <SliderValueInput
                  displayValue={Math.round(hPct)}
                  unit="%"
                  min={0}
                  max={100}
                  step={1}
                  disabled={frostShapeControlsDisabled}
                  onCommit={(v) => setField("frostPanelOffsetX", v - 50)}
                />
              }
              slider={
                <Slider
                  size="small"
                  value={typeof state.frostPanelOffsetX === "number" ? state.frostPanelOffsetX : 0}
                  min={-50}
                  max={50}
                  step={1}
                  disabled={frostShapeControlsDisabled}
                  onChange={(_, v) => setField("frostPanelOffsetX", v)}
                />
              }
            />
            <ShapeSliderRow
              icon={ArrowsOutLineVertical}
              label="Vertical position"
              disabled={frostShapeControlsDisabled}
              minLabel="0%"
              maxLabel="100%"
              valueBox={
                <SliderValueInput
                  displayValue={Math.round(vPct)}
                  unit="%"
                  min={0}
                  max={100}
                  step={1}
                  disabled={frostShapeControlsDisabled}
                  onCommit={(v) => setField("frostPanelOffsetY", v - 50)}
                />
              }
              slider={
                <Slider
                  size="small"
                  value={typeof state.frostPanelOffsetY === "number" ? state.frostPanelOffsetY : 0}
                  min={-50}
                  max={50}
                  step={1}
                  disabled={frostShapeControlsDisabled}
                  onChange={(_, v) => setField("frostPanelOffsetY", v)}
                />
              }
            />
          </Stack>
        </Box>
      ) : (
        <Box sx={(theme) => cardSxResolved(theme, dense)}>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            sx={{ mb: dense ? 0.75 : 1.5, ...(dense ? { fontSize: "0.75rem", lineHeight: 1.2 } : {}) }}
          >
            Photo band
          </Typography>
          <Stack spacing={dense ? 1 : 1.25}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                Band position
              </Typography>
              {isLeaderboardFormat ? (
                <ToggleButtonGroup
                  exclusive
                  fullWidth
                  size="small"
                  value={state.photoBandPosition === "left" ? "left" : "right"}
                  disabled={photoBandControlsDisabled}
                  onChange={(_, v) => v && setField("photoBandPosition", v)}
                >
                  <ToggleButton value="left">Left</ToggleButton>
                  <ToggleButton value="right">Right</ToggleButton>
                </ToggleButtonGroup>
              ) : (
                <ToggleButtonGroup
                  exclusive
                  fullWidth
                  size="small"
                  value={state.photoBandPosition === "top" ? "top" : "bottom"}
                  disabled={photoBandControlsDisabled}
                  onChange={(_, v) => v && setField("photoBandPosition", v)}
                >
                  <ToggleButton value="bottom">Bottom</ToggleButton>
                  <ToggleButton value="top">Top</ToggleButton>
                </ToggleButtonGroup>
              )}
            </Box>
            <LabeledSliderRow
              label={isLeaderboardFormat ? "Band width" : "Band height"}
              valueNode={
                <SliderValueInput
                  displayValue={Math.round((state.photoBandHeightRatio ?? 0.495) * 100)}
                  unit="%"
                  min={25}
                  max={70}
                  step={1}
                  disabled={photoBandControlsDisabled}
                  onCommit={(v) => setField("photoBandHeightRatio", v / 100)}
                />
              }
              disabled={photoBandControlsDisabled}
            >
              <Slider
                size="small"
                value={state.photoBandHeightRatio ?? 0.495}
                min={0.25}
                max={0.7}
                step={0.01}
                disabled={photoBandControlsDisabled}
                onChange={(_, v) => setField("photoBandHeightRatio", v)}
              />
            </LabeledSliderRow>
          </Stack>
        </Box>
      )}
    </Stack>
  );
}
