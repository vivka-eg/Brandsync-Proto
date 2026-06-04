"use client";
import {
  Autocomplete,
  Box,
  Chip,
  TextField,
  Typography,
  FormHelperText,
} from "@mui/material";
import React, { useState } from "react";

function DropdownChip({
  categories = [],
  value = [],
  onChange,
  label = "Label",
  helperText,
  disabled = false,
  error = false,
  success = false,
  required = false,
  errorMsg = "",
  sx = {},
  maxVisibleChips = 2, // Control how many chips to show before showing count
}) {
  const [focused, setFocused] = useState(false);

  return (
    <Box sx={sx}>
      {label && (
        <Box sx={{ mb: 0.5 }}>
          <Typography
            variant="subtitle2"
            component="label"
            color={error ? "error" : "inherit"}
          >
            {label}
            {required && (
              <Typography
                component="span"
                sx={{ color: "error.main", ml: 0.5 }}
              >
                *
              </Typography>
            )}
          </Typography>
        </Box>
      )}
      <Autocomplete
        multiple
        disabled={disabled}
        options={categories}
        getOptionLabel={(option) => option.label}
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        limitTags={maxVisibleChips}
        getLimitTagsText={(more) => `+${more} more`}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            error={error}
            required={required}
            helperText=""
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: disabled ? "#f5f5f5" : "background.default",
                border: "1px solid",
                borderColor: error
                  ? "#ef4444"
                  : success
                  ? "#22c55e"
                  : focused
                  ? "#000"
                  : "#d1d5db",
                "&:hover": {
                  borderColor: error
                    ? "#ef4444"
                    : success
                    ? "#22c55e"
                    : "#4b5563",
                },
                "&.Mui-focused": {
                  boxShadow: "0 0 0 2px rgba(0,0,0,0.05)",
                },
                paddingY: "6px",
                minHeight: "48px", // Ensure consistent height
                alignItems: "center",
                flexWrap: "nowrap", // Prevent wrapping
                "& .MuiAutocomplete-tag": {
                  margin: "2px",
                  maxWidth: "120px", // Limit individual chip width
                },
                "& .MuiAutocomplete-inputRoot": {
                  flexWrap: "nowrap",
                  overflow: "hidden",
                },
              },
              "& .MuiInputBase-input": {
                padding: 0,
                minWidth: "30px", // Ensure input field is always visible
              },
              "& .MuiInputLabel-root": {
                display: "none",
              },
            }}
          />
        )}
        renderTags={(value, getTagProps) => {
          const visibleTags = value.slice(0, maxVisibleChips);
          const hiddenCount = value.length - maxVisibleChips;

          return (
            <>
              {visibleTags.map((option, index) => {
                const { key, ...chipProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    label={option.label}
                    {...chipProps}
                    sx={{
                      borderRadius: "6px",
                      maxWidth: "120px",
                      "& .MuiChip-label": {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                    }}
                  />
                );
              })}
              {hiddenCount > 0 && (
                <Chip
                  label={`+${hiddenCount} more`}
                  size="small"
                  sx={{
                    borderRadius: "6px",
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                    color: "text.secondary",
                    fontSize: "0.75rem",
                    "& .MuiChip-deleteIcon": {
                      display: "none", // Hide delete icon for count chip
                    },
                  }}
                />
              )}
            </>
          );
        }}
      />
      {error && errorMsg && (
        <FormHelperText
          sx={{
            color: error ? "#ef4444" : success ? "#22c55e" : "text.secondary",
            display: "flex",
            alignItems: "center",
            gap: 1,
            mt: 0.5,
          }}
        >
          {error && errorMsg ? errorMsg : helperText}
        </FormHelperText>
      )}
    </Box>
  );
}

export default DropdownChip;
