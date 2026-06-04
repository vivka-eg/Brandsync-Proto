"use client";

import {
  Autocomplete,
  Box,
  Chip,
  Stack,
  TextField,
  Typography,
  FormHelperText,
} from "@mui/material";

function ChipSelectAutocomplete({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  sx, 
  error = false,
  helperText,
  required = false,
  errorMsg = "",
}) {
  return (
    <Stack sx={{ width: "100%", ...sx }}>
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
      <Autocomplete
        freeSolo
        multiple
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        options={[]} // since it's freeSolo, no predefined options
        renderInput={(params) => (
          <TextField
            {...params}
            label={""}
            placeholder={placeholder}
            size="small"
            error={error}
            required={required}
            helperText=""
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                ...(error && {
                  "& fieldset": {
                    borderColor: "error.main",
                    borderWidth: "2px",
                  },
                  "&:hover fieldset": {
                    borderColor: "error.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "error.main",
                  },
                }),
              },
            }}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            // Extract the key prop separately from other props
            const { key, ...chipProps } = getTagProps({ index });
            
            return (
              <Chip
                key={key} // Pass key directly
                {...chipProps} // Spread remaining props
                variant="filled"
                label={option}
                sx={{
                  fontWeight: 500,
                  borderRadius: "8px",
                  fontSize: 13,
                }}
              />
            );
          })
        }
      />
      <FormHelperText
        sx={{
          color: error ? "#ef4444" : "text.secondary",
          display: "flex",
          alignItems: "center",
          gap: 1,
          mt: 0.5,
        }}
      >
        {error && errorMsg ? errorMsg : helperText}
      </FormHelperText>
    </Stack>
  );
}

export default ChipSelectAutocomplete;