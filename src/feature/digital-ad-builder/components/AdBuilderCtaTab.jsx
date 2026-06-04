"use client";

import React from "react";
import {
  Box,
  Typography,
  Stack,
  TextField,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { cardSx, SectionLabel, AlignRow } from "./AdBuilderContentTab";
import LabeledSliderRow from "./LabeledSliderRow";
import SliderValueInput from "./SliderValueInput";

export default function AdBuilderCtaTab({ state, setField, selectedLogo, dense = false, hideSectionHeading = false }) {
  const isPhotoBandLayout = (state.adLayout ?? "frostedPanel") === "photoBand";
  const ctaOnPhoto = state.photoBandCtaPlacement === "onPhoto";
  const onPhotoVertical = ["top", "center", "bottom"].includes(state.photoBandCtaOnPhotoVertical)
    ? state.photoBandCtaOnPhotoVertical
    : "bottom";
  const ctaFontScale = typeof state.ctaFontScale === "number" ? state.ctaFontScale : 1;
  const ctaPaddingScale = typeof state.ctaPaddingScale === "number" ? state.ctaPaddingScale : 1;
  const ctaOffsetX = typeof state.ctaOffsetX === "number" ? state.ctaOffsetX : 0;
  const ctaOffsetY = typeof state.ctaOffsetY === "number" ? state.ctaOffsetY : 0;
  const ctaRadius = typeof state.ctaRadius === "number" ? state.ctaRadius : 0;

  const cardSxResolved = (theme) => ({
    ...cardSx(theme),
    ...(dense ? { p: 1, borderRadius: 0.75 } : {}),
  });

  return (
    <Stack spacing={dense ? 1.25 : 2}>
      <Box sx={cardSxResolved}>
        {!hideSectionHeading ? (
          <SectionLabel dense={dense} tooltip="Label, placement, and appearance of the call-to-action button.">
            Call to action
          </SectionLabel>
        ) : null}
        <Stack spacing={dense ? 1 : 1.25}>
          <TextField
            value={state.cta}
            onChange={(e) => setField("cta", e.target.value)}
            fullWidth
            size="small"
            placeholder="Button label"
          />
          {isPhotoBandLayout ? (
            <FormControl size="small" fullWidth>
              <InputLabel id="cta-tab-photo-band-placement-label">Button placement</InputLabel>
              <Select
                labelId="cta-tab-photo-band-placement-label"
                label="Button placement"
                value={
                  state.photoBandCtaPlacement === "onPhoto" || state.photoBandCtaPlacement === "underLogo"
                    ? state.photoBandCtaPlacement
                    : "onBand"
                }
                onChange={(e) => setField("photoBandCtaPlacement", e.target.value)}
              >
                <MenuItem value="onBand">In band</MenuItem>
                <MenuItem value="onPhoto">On photo</MenuItem>
                <MenuItem value="underLogo" disabled={!selectedLogo || state.logoPlacement === "onPhotoTop"}>
                  Under logo
                </MenuItem>
              </Select>
            </FormControl>
          ) : null}
          <Box
            sx={(theme) => ({
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "grey.50",
              p: dense ? 1 : 1.25,
            })}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={700}
              letterSpacing={0.04}
              sx={{ display: "block", mb: dense ? 0.65 : 1, fontSize: dense ? "0.65rem" : undefined }}
            >
              Position & alignment
            </Typography>
            <Stack spacing={dense ? 1 : 1.25}>
              {isPhotoBandLayout && ctaOnPhoto ? (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.65 }}>
                    On image
                  </Typography>
                  <ToggleButtonGroup
                    exclusive
                    fullWidth
                    size="small"
                    value={onPhotoVertical}
                    onChange={(_, v) => v != null && setField("photoBandCtaOnPhotoVertical", v)}
                    aria-label="Vertical position of button on photo"
                  >
                    <ToggleButton value="top">Top</ToggleButton>
                    <ToggleButton value="center">Center</ToggleButton>
                    <ToggleButton value="bottom">Bottom</ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              ) : null}
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Alignment
                </Typography>
                <AlignRow
                  ariaLabel="Button alignment"
                  value={state.ctaAlign ?? "left"}
                  onChange={(v) => setField("ctaAlign", v)}
                />
              </Box>
              <Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Horizontal nudge
                  </Typography>
                  <SliderValueInput
                    displayValue={ctaOffsetX}
                    unit=""
                    min={-50}
                    max={50}
                    step={1}
                    width={52}
                    height={28}
                    fontSize="0.75rem"
                    onCommit={(v) => setField("ctaOffsetX", v)}
                  />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 0.25 }}>
                  <Typography variant="caption" color="text.disabled" sx={{ minWidth: 22, fontVariantNumeric: "tabular-nums" }}>
                    −50
                  </Typography>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Slider
                      size="small"
                      value={ctaOffsetX}
                      min={-50}
                      max={50}
                      step={1}
                      onChange={(_, v) => setField("ctaOffsetX", v)}
                      aria-label="Horizontal nudge for call to action"
                    />
                  </Box>
                  <Typography variant="caption" color="text.disabled" sx={{ minWidth: 22, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    50
                  </Typography>
                </Stack>
              </Box>
              <Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Vertical nudge
                  </Typography>
                  <SliderValueInput
                    displayValue={ctaOffsetY}
                    unit=""
                    min={-50}
                    max={50}
                    step={1}
                    width={52}
                    height={28}
                    fontSize="0.75rem"
                    onCommit={(v) => setField("ctaOffsetY", v)}
                  />
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 0.25 }}>
                  <Typography variant="caption" color="text.disabled" sx={{ minWidth: 22, fontVariantNumeric: "tabular-nums" }}>
                    −50
                  </Typography>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Slider
                      size="small"
                      value={ctaOffsetY}
                      min={-50}
                      max={50}
                      step={1}
                      onChange={(_, v) => setField("ctaOffsetY", v)}
                      aria-label="Vertical nudge for call to action"
                    />
                  </Box>
                  <Typography variant="caption" color="text.disabled" sx={{ minWidth: 22, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    50
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Box>
          <LabeledSliderRow
            label="Text size"
            valueNode={
              <SliderValueInput
                displayValue={Math.round(ctaFontScale * 100)}
                unit="%"
                min={65}
                max={135}
                step={5}
                onCommit={(v) => setField("ctaFontScale", v / 100)}
              />
            }
          >
            <Slider
              size="small"
              value={ctaFontScale}
              min={0.65}
              max={1.35}
              step={0.05}
              onChange={(_, v) => setField("ctaFontScale", v)}
              aria-label="Call to action text size"
            />
          </LabeledSliderRow>
          <LabeledSliderRow
            label="Button size"
            valueNode={
              <SliderValueInput
                displayValue={Math.round(ctaPaddingScale * 100)}
                unit="%"
                min={65}
                max={135}
                step={5}
                onCommit={(v) => setField("ctaPaddingScale", v / 100)}
              />
            }
          >
            <Slider
              size="small"
              value={ctaPaddingScale}
              min={0.65}
              max={1.35}
              step={0.05}
              onChange={(_, v) => setField("ctaPaddingScale", v)}
              aria-label="Call to action button padding size"
            />
          </LabeledSliderRow>
          <LabeledSliderRow
            label="Button radius"
            valueNode={
              <SliderValueInput
                displayValue={ctaRadius}
                unit="px"
                min={0}
                max={50}
                step={1}
                onCommit={(v) => setField("ctaRadius", v)}
              />
            }
          >
            <Slider
              size="small"
              value={ctaRadius}
              min={0}
              max={50}
              step={1}
              onChange={(_, v) => setField("ctaRadius", v)}
              aria-label="Call to action button corner radius"
            />
          </LabeledSliderRow>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Show icon
            </Typography>
            <Switch
              size="small"
              checked={Boolean(state.ctaShowIcon)}
              onChange={(e) => setField("ctaShowIcon", e.target.checked)}
              inputProps={{ "aria-label": "Show icon on button" }}
            />
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
