"use client";

import { Stack, TextField, Typography } from "@mui/material";

const CustomTextField = ({
  label = "Label",
  placeholder = "Input text",
  helperText = "",
  value,
  onChange,
  disabled = false,
  error = false,
  multiline = false,
  rows = 4,
  sx = {},
}) => {
  return (
    <Stack spacing={1} direction="column" sx={{ width: '100%' }}>
      <Typography
        variant="subtitle2"
        fontWeight={600}
        color="text.primary"
        id="custom-text-field"
      >
        {label}
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        label=""
        placeholder={placeholder}
        helperText={helperText}
        value={value}
        onChange={onChange}
        disabled={disabled}
        error={error}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        InputProps={{
          sx: {
            borderRadius: "8px",
            fontSize: 14,
            "&.MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: error
                  ? "#D92D20"
                  : disabled
                  ? "#E4E7EC"
                  : "#D0D5DD",
              },
              "&:hover fieldset": {
                borderColor: error ? "#D92D20" : "#98A2B3",
              },
              "&.Mui-focused fieldset": {
                borderColor: error ? "#D92D20" : "#101828",
                borderWidth: 2,
              },
            },
          },
        }}
        InputLabelProps={{
          shrink: Boolean(value) || undefined,
          sx: { fontSize: 13 },
        }}
        FormHelperTextProps={{
          sx: { fontSize: 12, ml: 0 },
        }}
        sx={sx} // Allow additional external styles
      />
    </Stack>
  );
};

export default CustomTextField;
