"use client";
import {
  FormControl,
  Select,
  MenuItem,
  Typography,
  Box,
  FormHelperText,
} from "@mui/material";
import { CaretDown } from "phosphor-react";

function Dropdown({
  label = "Label",
  helperText,
  values,
  selectedValue,
  onChange,
  disabled = false,
  error = false,
  success = false,
  required = false,
  errorMsg = "",
  sx = {},
}) {
  return (
    <FormControl
      variant="outlined"
      fullWidth
      disabled={disabled}
      error={error}
      sx={{
        m: 1,
        minWidth: 200,
        ...sx,

        ".MuiOutlinedInput-notchedOutline": {
          border: "none !important",
        },

        ".MuiInputBase-root": {
          borderRadius: "16px",
          backgroundColor: disabled ? "#f5f5f5" : "#FFFFFF",

          /* OUTER BORDER - only visible on focus */
          border: "2px solid transparent",

          /* GAP between borders - consistent all around */
          padding: "3px",

          "&:hover": {
            border: "2px solid transparent",
          },

          "&.Mui-focused": {
            /* OUTER BORDER on focus */
            border: "2px solid #1F2937",
            backgroundColor: "#F9FAFB",
          },

          ".MuiSelect-select": {
            padding: "10px 14px",
            lineHeight: "24px",
            borderRadius: "12px",
            
            /* INNER BORDER - always visible */
            border: "1.5px solid #E5E7EB",
            backgroundColor: disabled ? "#F5F5F5" : "#FFFFFF",
          },
        },

        /* Hover state for inner border */
        ".MuiInputBase-root:hover .MuiSelect-select": {
          borderColor: "#1F2937",
        },

        /* Focus state for inner border */
        ".MuiInputBase-root.Mui-focused .MuiSelect-select": {
          borderColor: "#E5E7EB",
          backgroundColor: "#F9FAFB",
        },
      }}
    >
      {label && (
        <Box sx={{ mb: 0.5 }}>
          <Typography
            variant="subtitle2"
            component="label"
            htmlFor="customized-select"
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

      <Select
        value={selectedValue}
        onChange={onChange}
        displayEmpty
        required={required}
        inputProps={{ id: "customized-select" }}
        IconComponent={(props) => (
          <CaretDown size={20} {...props} weight="bold" />
        )}
      >
        {values.map(({ label, value }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>

      {error && errorMsg && (
        <FormHelperText
          sx={{
            color: error ? "#ef4444" : success ? "#22c55e" : "text.secondary",
            display: "flex",
            marginLeft: "0px",
          }}
        >
          {error && errorMsg ? errorMsg : helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}

export default Dropdown;