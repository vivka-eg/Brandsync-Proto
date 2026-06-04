"use client";

import React, { useState } from "react";
import { TextField, InputAdornment, Box, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function CustomSearch({ value, onChange, isLoading = false, sx = {} }) {
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      sx={sx}
    >
      <TextField
        placeholder="Search"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        variant="outlined"
        fullWidth
        value={value}
        onInput={(e) => onChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: isLoading ? (
            <InputAdornment position="end">
              <CircularProgress size={16} thickness={5} color="inherit" sx={{ color: "text.disabled" }} />
            </InputAdornment>
          ) : null,
          sx: {
            height: 48,
            borderRadius: 2,
            backgroundColor: pressed
              ? "neutral.pressed"
              : hovered
              ? "neutral.hover"
              : "background.default",
            border: focused ? "1px solid #111827" : "1px solid #E5E7EB",
            boxShadow: focused ? "0 0 0 1px #111827" : "none",
            transition: "all 0.2s ease-in-out",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          },
        }}
      />
    </Box>
  );
}
