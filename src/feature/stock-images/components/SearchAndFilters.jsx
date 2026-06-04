"use client";
import React, { useRef } from "react";
import {
  Box,
  TextField,
  useTheme,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { MagnifyingGlass, X } from "phosphor-react";

export default function SearchAndFilters({ searchTerm, onSearchChange }) {
  const theme = useTheme();
  const inputRef = useRef(null);

  const handleClearSearch = () => {
    onSearchChange({ target: { value: "" } });
    inputRef.current?.focus();
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        p: "8px 12px",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          bgcolor: "transparent",
        },
        "&:focus-within": {
          borderColor: "primary.main",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
          bgcolor: "background.paper",
        },
        width: "100%",
      }}
    >
      <MagnifyingGlass
        size={20}
        color={theme.palette.text.secondary}
        style={{ marginLeft: 8, flexShrink: 0 }}
      />
      <TextField
        placeholder="Search images..."
        value={searchTerm}
        onChange={onSearchChange}
        fullWidth
        variant="standard"
        inputRef={inputRef}
        InputProps={{
          disableUnderline: true,
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClearSearch}
                edge="end"
                size="small"
                aria-label="clear search"
                sx={{
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "error.light",
                    color: "error.contrastText",
                  },
                }}
              >
                <X size={18} weight="bold" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiInputBase-input": {
            py: 0.5,
          },
        }}
      />
    </Box>
  );
}
