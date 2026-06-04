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
        ".MuiInputBase-root": {
          borderRadius: "8px",
          backgroundColor: disabled ? "#f5f5f5" : "background.default",
          border: "1px solid",
          borderColor: error ? "#ef4444" : success ? "#22c55e" : "#d1d5db",
          "&:hover": {
            borderColor: error ? "#ef4444" : success ? "#22c55e" : "#4b5563",
          },
          "&.Mui-focused": {
            borderColor: error ? "#ef4444" : success ? "#22c55e" : "#000000",
            boxShadow: "0 0 0 2px rgba(0,0,0,0.05)",
          },
          ".MuiSelect-select": {
            padding: "12px",
          },
        },
        ".MuiSvgIcon-root": {
          right: 8,
        },
      }}
    >
      <Box sx={{ mb: 0.5 }}>
        <Typography
          variant="subtitle2"
          component="label"
          htmlFor="customized-select"
          color={error ? "error" : "inherit"}
        >
          {label}
          {required && (
            <Typography component="span" sx={{ color: "error.main", ml: 0.5 }}>
              *
            </Typography>
          )}
        </Typography>
      </Box>
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
      <FormHelperText
        sx={{
          color: error ? "#ef4444" : success ? "#22c55e" : "text.secondary",
          display: "flex",
          marginLeft: "0px",
        }}
      >
        {error && errorMsg ? errorMsg : helperText}
      </FormHelperText>
    </FormControl>
  );
}

export default Dropdown;