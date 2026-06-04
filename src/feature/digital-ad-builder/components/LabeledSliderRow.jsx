"use client";

import React from "react";
import { Box, Stack, Typography } from "@mui/material";

/** Label + optional value display (string or React node) + slider (shared spacing). */
export default function LabeledSliderRow({
  label,
  valueLabel,
  valueNode,
  disabled,
  children,
}) {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ opacity: disabled ? 0.5 : 1 }}
        >
          {label}
        </Typography>
        {valueNode ?? (valueLabel != null && (
          <Typography
            variant="caption"
            fontWeight={700}
            color="text.secondary"
            sx={{ fontVariantNumeric: "tabular-nums", opacity: disabled ? 0.5 : 1 }}
          >
            {valueLabel}
          </Typography>
        ))}
      </Stack>
      {children}
    </Box>
  );
}
