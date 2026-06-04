"use client";

import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import SliderValueInput from "./components/SliderValueInput";
import {
  getShadeHex,
  getSortedShadeKeysForPalette,
  formatShadeMenuLabel,
} from "./brandPalettes";
import usePaletteSwatchEntries from "./usePaletteSwatchEntries";

function swatchSx(theme, selected, interactive) {
  return {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "2px solid",
    borderColor: selected ? "primary.main" : "divider",
    cursor: interactive ? "pointer" : "default",
    p: 0,
    flexShrink: 0,
    boxShadow: selected
      ? `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${theme.palette.primary.main}`
      : "none",
    transition: "box-shadow 0.15s ease",
    "&:focus-visible": {
      outline: "2px solid",
      outlineColor: "primary.main",
      outlineOffset: 2,
    },
  };
}

export default function FrostedPanelControls({
  brandPalettes,
  logos,
  selectedLogo,
  state,
  setField,
  disabled = false,
  /** When true, omit top border/padding; use inside accordions or tight layouts. */
  embedded = false,
  /** Hide colour swatches and shade; only frost toggle + opacity (brand locked elsewhere). */
  opacityOnly = false,
}) {
  const frostPct = Math.round((state.frostOpacity ?? 0) * 100);
  const frostOn = state.frostPanelEnabled !== false;
  const { paletteEntriesForSwatches } = usePaletteSwatchEntries(
    brandPalettes,
    logos,
    selectedLogo,
    state,
  );

  return (
    <Box
      sx={
        embedded
          ? { pt: 0 }
          : { pt: 2, borderTop: "1px solid", borderColor: "divider" }
      }
    >
      <Typography variant="body2" fontWeight={600} sx={{ mb: embedded ? 1 : 2 }}>
        Frosted panel
      </Typography>
      <Stack spacing={embedded ? 1.25 : 2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 0.5,
            py: 0.75,
            borderRadius: 1,
            bgcolor: "action.hover",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="body2" fontWeight={500}>
            Frosted on
          </Typography>
          <Switch
            size="small"
            checked={frostOn}
            onChange={(_, v) => setField("frostPanelEnabled", v)}
            color="primary"
            disabled={disabled}
          />
        </Stack>

        {!opacityOnly && (
          <>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              letterSpacing={0.06}
              display="block"
            >
              Frosted colour
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ opacity: frostOn ? 1 : 0.55 }}>
              {paletteEntriesForSwatches.map((p) => {
                const hex = getShadeHex(p.name, state.frostShade);
                const selected = state.frostPalette === p.name;
                return (
                  <Box
                    key={`frost-${p.name}`}
                    component="button"
                    type="button"
                    title={p.label}
                    disabled={disabled || !frostOn}
                    onClick={() => setField("frostPalette", p.name)}
                    sx={(theme) => ({
                      bgcolor: hex,
                      ...swatchSx(theme, selected, frostOn),
                    })}
                  />
                );
              })}
            </Stack>
            <FormControl size="small" fullWidth disabled={disabled || !frostOn}>
              <InputLabel id="frost-shade-preview-label">Frosted shade</InputLabel>
              <Select
                labelId="frost-shade-preview-label"
                label="Frosted shade"
                value={state.frostShade}
                onChange={(e) => setField("frostShade", e.target.value)}
              >
                {getSortedShadeKeysForPalette(state.frostPalette).map((s) => (
                  <MenuItem key={s} value={s}>
                    {formatShadeMenuLabel(s)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} letterSpacing={0.06}>
            Frosted opacity
          </Typography>
          <SliderValueInput
            displayValue={frostPct}
            unit="%"
            min={0}
            max={100}
            step={5}
            disabled={disabled || !frostOn}
            onCommit={(v) => setField("frostOpacity", v / 100)}
          />
        </Stack>
        <Slider
          size="small"
          value={state.frostOpacity}
          min={0}
          max={1}
          step={0.05}
          disabled={disabled || !frostOn}
          onChange={(_, v) => setField("frostOpacity", v)}
        />
      </Stack>
    </Box>
  );
}
