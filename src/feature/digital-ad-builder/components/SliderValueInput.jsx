"use client";

import React, { useEffect, useState } from "react";
import { Box, OutlinedInput } from "@mui/material";

/**
 * Editable numeric input paired with a slider.
 * Displays `{displayValue}{unit}` when idle; shows raw number when focused.
 * Out-of-range values show a red border + floating error label above the box.
 * Reverts to the last valid value on blur when still invalid.
 */
export default function SliderValueInput({
  displayValue,
  unit = "%",
  min,
  max,
  step = 1,
  onCommit,
  disabled,
  width = 76,
  height = 32,
  fontSize = "0.8125rem",
}) {
  const [draft, setDraft] = useState(String(displayValue));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setDraft(String(displayValue));
  }, [displayValue, focused]);

  const parsedDraft = parseFloat(draft);
  const draftIsNumeric = !Number.isNaN(parsedDraft);
  const tooLow = focused && draftIsNumeric && parsedDraft < min;
  const tooHigh = focused && draftIsNumeric && parsedDraft > max;
  const isInvalid = tooLow || tooHigh;
  const unitLabel = unit.trim();
  const errorMsg = tooLow
    ? `Min: ${min}${unitLabel}`
    : tooHigh
      ? `Max: ${max}${unitLabel}`
      : "";

  function commit() {
    const n = parseFloat(draft);
    if (!Number.isNaN(n) && n >= min && n <= max) {
      const stepped = Math.round(n / step) * step;
      const rounded = Math.round(stepped * 10000) / 10000;
      onCommit(rounded);
      setDraft(String(rounded));
    } else {
      setDraft(String(displayValue));
    }
  }

  return (
    <Box sx={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-end" }}>
      <OutlinedInput
        size="small"
        disabled={disabled}
        error={isInvalid}
        value={focused ? draft : `${displayValue}${unit}`}
        onFocus={() => {
          setFocused(true);
          setDraft(String(displayValue));
        }}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setFocused(false);
          commit();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
          if (e.key === "Escape") {
            setDraft(String(displayValue));
            setFocused(false);
            e.currentTarget.blur();
          }
        }}
        slotProps={{ input: { inputMode: step < 1 ? "decimal" : "numeric" } }}
        sx={{
          width,
          height,
          "& .MuiOutlinedInput-input": {
            py: 0.5,
            textAlign: "right",
            fontSize,
            fontWeight: 600,
            fontVariantNumeric: "tabular-nums",
          },
        }}
      />
      {isInvalid && (
        <Box
          sx={{
            color: "error.main",
            fontSize: "0.65rem",
            fontWeight: 500,
            mt: 0.35,
            lineHeight: 1.2,
          }}
        >
          {errorMsg}
        </Box>
      )}
    </Box>
  );
}
