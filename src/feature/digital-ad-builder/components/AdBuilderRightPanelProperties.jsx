"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Stack,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
} from "@mui/material";
import HelpOutline from "@mui/icons-material/HelpOutline";
import { alpha } from "@mui/material/styles";
import { SquaresFour, Rectangle } from "phosphor-react";
import { AD_SIZE_PRESET_MAP, PREVIEW_GROUPS, ALL_AD_SIZE_IDS } from "../adSizePresets";
import { getShadeHex, getMidShadeKeyForPalette } from "../brandPalettes";

export function presetOrientation(id) {
  const p = AD_SIZE_PRESET_MAP[id];
  if (!p) return "square";
  if (p.width === p.height) return "square";
  return p.height > p.width ? "portrait" : "landscape";
}

function PortraitIcon({ size = 20 }) {
  return (
    <Box
      component="span"
      sx={{ display: "inline-flex", lineHeight: 0, transform: "rotate(90deg)" }}
    >
      <Rectangle size={size} />
    </Box>
  );
}

const ORIENTATIONS = [
  { value: "square", label: "Square", icon: SquaresFour },
  { value: "portrait", label: "Portrait", icon: PortraitIcon },
  { value: "landscape", label: "Landscape", icon: Rectangle },
];

export default function AdBuilderRightPanelProperties({
  state,
  setField,
  /** If set, called instead of setField("selectedSizeId") (page shows replace vs add-new). */
  onSelectSize,
}) {
  const [orientation, setOrientation] = useState(() => presetOrientation(state.selectedSizeId));
  const [pressedId, setPressedId] = useState(null);
  const pressedTimerRef = useRef(null);

  useEffect(() => {
    setOrientation(presetOrientation(state.selectedSizeId));
  }, [state.selectedSizeId]);

  const handleChipClick = (id) => {
    setPressedId(id);
    clearTimeout(pressedTimerRef.current);
    pressedTimerRef.current = setTimeout(() => setPressedId(null), 300);
    if (onSelectSize) onSelectSize(id);
    else setField("selectedSizeId", id);
  };

  const sizeIdsForOrientation = useMemo(
    () => ALL_AD_SIZE_IDS.filter((id) => presetOrientation(id) === orientation),
    [orientation],
  );

  const allowedIdSet = useMemo(() => new Set(sizeIdsForOrientation), [sizeIdsForOrientation]);

  const handleOrientation = (_, next) => {
    if (!next) return;
    setOrientation(next);
    /** Do not change the selected pixel size when switching Square / Portrait / Landscape — only filter the list. */
  };

  const cardSx = (theme) => ({
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 1,
    p: 1.5,
    bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "grey.50",
  });

  return (
    <Stack spacing={2} sx={{ flexShrink: 0, display: "flex", flexDirection: "column" }}>
      <Box sx={{ ...cardSx, flexShrink: 0 }}>
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1.25 }}>
          <Typography variant="body2" fontWeight={600}>
            Layout
          </Typography>
          <Tooltip title="Pick a canvas shape, then a pixel size." placement="top" arrow>
            <HelpOutline sx={{ fontSize: 18, color: "text.secondary" }} />
          </Tooltip>
        </Stack>
        <ToggleButtonGroup
          exclusive
          fullWidth
          size="small"
          value={orientation}
          onChange={handleOrientation}
          aria-label="Canvas orientation"
          sx={{ mb: 1.5 }}
        >
          {ORIENTATIONS.map(({ value, label, icon: Icon }) => (
            <ToggleButton key={value} value={value} aria-label={label}>
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ py: 0.25 }}>
                <Icon size={18} />
                <Typography variant="caption" fontWeight={600} sx={{ display: { xs: "none", sm: "block" } }}>
                  {label}
                </Typography>
              </Stack>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Stack spacing={1.25}>
          {PREVIEW_GROUPS.map((group) => {
            const idsInGroup = group.sizeIds.filter((id) => allowedIdSet.has(id) && AD_SIZE_PRESET_MAP[id]);
            if (!idsInGroup.length) return null;
            return (
              <Box key={group.id}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={700}
                  letterSpacing={0.06}
                  sx={{ display: "block", mb: 0.75 }}
                >
                  {group.title}
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={0.75}>
                  {idsInGroup.map((id) => {
                    const p = AD_SIZE_PRESET_MAP[id];
                    if (!p) return null;
                    const selected =
                      state.selectedSizeId === id ||
                      (id === "1200x600" && state.selectedSizeId === "1200x600-smartkalk");
                    const fullLabel = `${p.label} (${p.width} × ${p.height}px)`;
                    return (
                      <Tooltip key={id} title={fullLabel} placement="top" arrow>
                        <Chip
                          label={
                            <Stack alignItems="flex-start" spacing={0.05} sx={{ py: 0.15, maxWidth: 200 }}>
                              <Typography
                                variant="caption"
                                fontWeight={600}
                                component="span"
                                sx={(theme) => ({
                                  lineHeight: 1.25,
                                  color: selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
                                })}
                              >
                                {p.label}
                              </Typography>
                              <Typography
                                variant="caption"
                                component="span"
                                sx={(theme) => ({
                                  lineHeight: 1.2,
                                  color: selected
                                    ? alpha(theme.palette.primary.contrastText, 0.92)
                                    : theme.palette.text.secondary,
                                })}
                              >
                                {p.width} × {p.height}px
                              </Typography>
                            </Stack>
                          }
                          onClick={() => handleChipClick(id)}
                          color={selected ? "primary" : "default"}
                          variant={selected ? "filled" : "outlined"}
                          size="small"
                          sx={{
                            height: "auto",
                            borderRadius: 0.5,
                            "& .MuiChip-label": { display: "block", whiteSpace: "normal", py: 0.75, px: 0.75 },
                            ...(pressedId === id && {
                              "@keyframes chipSpring": {
                                "0%": { transform: "scale(1)" },
                                "30%": { transform: "scale(0.92)" },
                                "65%": { transform: "scale(1.07)" },
                                "100%": { transform: "scale(1)" },
                              },
                              animation: "chipSpring 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both",
                            }),
                          }}
                        />
                      </Tooltip>
                    );
                  })}
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Stack>
  );
}

/** Resolve swatch colour for the locked (2nd) brand palette. */
export function getLockedPaletteSwatchHex(paletteName, bgShade) {
  if (!paletteName) return null;
  const shade = bgShade ?? getMidShadeKeyForPalette(paletteName);
  return getShadeHex(paletteName, shade);
}
