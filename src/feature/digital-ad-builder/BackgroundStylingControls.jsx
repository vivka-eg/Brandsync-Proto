"use client";

import React, { useState } from "react";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Plus } from "phosphor-react";
import {
  getShadeHex,
  getSortedShadeKeysForPalette,
  formatShadeMenuLabel,
  getMidShadeKeyForPalette,
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

/**
 * Background colour swatches + shade (frosted controls live in the preview panel).
 */
export default function BackgroundStylingControls({
  brandPalettes,
  logos = [],
  selectedLogo,
  state,
  setField,
  disabled = false,
  compact = false,
}) {
  const [addMenuAnchor, setAddMenuAnchor] = useState(null);

  const { paletteEntriesForSwatches, addablePalettes } = usePaletteSwatchEntries(
    brandPalettes,
    logos,
    selectedLogo,
    state,
  );

  const handleAddPalette = (paletteName) => {
    const prev = state.extraBrandPaletteNames ?? [];
    if (prev.includes(paletteName)) return;
    setField("extraBrandPaletteNames", [...prev, paletteName]);
    setAddMenuAnchor(null);
  };

  return (
    <Stack spacing={compact ? 1.25 : 2.5}>
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={600}
          letterSpacing={0.06}
          display="block"
          mb={compact ? 0.5 : 1}
        >
          Background
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={compact ? 0.75 : 1} sx={{ mb: compact ? 1 : 1.5 }} alignItems="center">
          {paletteEntriesForSwatches.map((p) => {
            const hex = getShadeHex(p.name, state.bgShade);
            const selected = state.bgPalette === p.name;
            return (
              <Box
                key={p.name}
                component="button"
                type="button"
                title={p.label}
                disabled={disabled}
                onClick={() => setField("bgPalette", p.name)}
                sx={(theme) => ({
                  bgcolor: hex,
                  ...swatchSx(theme, selected, !disabled),
                })}
              />
            );
          })}
          <Tooltip title={addablePalettes.length ? "Add another brand colour" : "All brand colours are shown"}>
            <span>
              <IconButton
                size="small"
                aria-label="Add brand colour"
                onClick={(e) => setAddMenuAnchor(e.currentTarget)}
                disabled={disabled || !addablePalettes.length}
                sx={{
                  width: 36,
                  height: 36,
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: "50%",
                  bgcolor: "background.paper",
                }}
              >
                <Plus size={18} />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
        <Menu
          anchorEl={addMenuAnchor}
          open={Boolean(addMenuAnchor)}
          onClose={() => setAddMenuAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          {addablePalettes.map((p) => (
            <MenuItem
              key={p.name}
              onClick={() => handleAddPalette(p.name)}
              sx={{ gap: 1.5 }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: getShadeHex(p.name, getMidShadeKeyForPalette(p.name)),
                }}
              />
              {p.label}
            </MenuItem>
          ))}
        </Menu>
        <FormControl size="small" fullWidth disabled={disabled}>
          <InputLabel id="bg-shade-sidebar-label">Background shade</InputLabel>
          <Select
            labelId="bg-shade-sidebar-label"
            label="Background shade"
            value={state.bgShade}
            onChange={(e) => setField("bgShade", e.target.value)}
          >
            {getSortedShadeKeysForPalette(state.bgPalette).map((s) => (
              <MenuItem key={s} value={s}>
                {formatShadeMenuLabel(s)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Stack>
  );
}
