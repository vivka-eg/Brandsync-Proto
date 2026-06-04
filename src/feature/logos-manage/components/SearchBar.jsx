import React from "react";
import { TextField, InputAdornment, Box } from "@mui/material";
import { MagnifyingGlass, X } from "phosphor-react";
import { IconButton } from "@mui/material";

/**
 * SearchBar component for filtering logos
 *
 * @param {Object} props
 * @param {string} props.value - Current search value
 * @param {Function} props.onChange - Function to handle search input changes
 * @param {string} props.placeholder - Placeholder text for the search input
 */
const SearchBar = ({ value, onChange, placeholder = "Search logos..." }) => {
  const handleClear = () => {
    onChange({ target: { value: "" } });
  };

  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MagnifyingGlass size={20} weight="bold" />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                edge="end"
                sx={{
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <X size={18} weight="bold" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          maxWidth: { xs: "100%", sm: 400 },
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            bgcolor: "background.paper",
            "&:hover": {
              bgcolor: "grey.50",
            },
            "&.Mui-focused": {
              bgcolor: "background.paper",
            },
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
