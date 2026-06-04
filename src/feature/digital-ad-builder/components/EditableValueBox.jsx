"use client";

import React, { useRef, useState } from "react";
import { OutlinedInput } from "@mui/material";

/**
 * Numeric input that shows a formatted value (e.g. "125%") when idle and lets
 * the user type a raw number when focused. On blur or Enter the value is
 * clamped to [min, max], snapped to step, and emitted via onCommit.
 * Escape cancels without committing.
 */
export default function EditableValueBox({
  value,
  disabled,
  onCommit,
  min,
  max,
  step,
  width = 76,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const cancelRef = useRef(false);

  const handleFocus = () => {
    const num = parseFloat(String(value).replace(/[^0-9.-]/g, ""));
    setDraft(isNaN(num) ? "" : String(Math.round(num)));
    setEditing(true);
  };

  const handleBlur = () => {
    if (!cancelRef.current) {
      const parsed = parseFloat(draft);
      if (!isNaN(parsed) && onCommit) {
        const clamped = Math.max(min, Math.min(max, parsed));
        const stepped = step ? Math.round(clamped / step) * step : clamped;
        onCommit(stepped);
      }
    }
    cancelRef.current = false;
    setEditing(false);
  };

  return (
    <OutlinedInput
      size="small"
      disabled={disabled}
      value={editing ? draft : value}
      onFocus={handleFocus}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          cancelRef.current = true;
          e.currentTarget.blur();
        }
      }}
      sx={{
        width,
        height: 32,
        cursor: disabled ? "default" : "text",
        "& .MuiOutlinedInput-input": {
          py: 0.5,
          textAlign: "right",
          fontSize: "0.8125rem",
          fontWeight: 600,
          fontVariantNumeric: "tabular-nums",
        },
      }}
    />
  );
}
