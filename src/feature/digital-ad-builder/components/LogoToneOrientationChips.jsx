"use client";

import React from "react";
import { Stack, Chip, Tooltip } from "@mui/material";

const TONE_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "monochrome", label: "Monochrome" },
];

const ORIENTATION_OPTIONS = [
  { value: "horizontal", label: "Horizontal" },
  { value: "vertical", label: "Vertical" },
  { value: "stacked", label: "Stacked" },
];

/**
 * Displays the selected logo tone and orientation as non-interactive chips.
 * Helps users see at a glance what variant they're using.
 */
export default function LogoToneOrientationChips({ logoTone = "light", logoOrientation = "horizontal" }) {
  const toneLabel = TONE_OPTIONS.find((o) => o.value === logoTone)?.label || logoTone;
  const orientationLabel = ORIENTATION_OPTIONS.find((o) => o.value === logoOrientation)?.label || logoOrientation;

  return (
    <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
      <Tooltip title="Logo tone variant (set in Properties > Logo)" arrow placement="bottom">
        <Chip
          size="small"
          variant="outlined"
          label={`${toneLabel} tone`}
          sx={{
            fontWeight: 600,
            fontSize: "0.7rem",
            height: 22,
            "& .MuiChip-label": { px: 0.75 },
          }}
        />
      </Tooltip>
      <Tooltip title="Logo orientation variant (set in Properties > Logo)" arrow placement="bottom">
        <Chip
          size="small"
          variant="outlined"
          label={`${orientationLabel}`}
          sx={{
            fontWeight: 600,
            fontSize: "0.7rem",
            height: 22,
            "& .MuiChip-label": { px: 0.75 },
          }}
        />
      </Tooltip>
    </Stack>
  );
}
