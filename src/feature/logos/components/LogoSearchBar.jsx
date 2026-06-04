import { TextField, InputAdornment } from "@mui/material";
import { MagnifyingGlass } from "phosphor-react";

function LogoSearchBar({ searchQuery, onSearchChange }) {
  return (
    <TextField
      fullWidth
      placeholder="Search logos"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      size="small"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <MagnifyingGlass size={18} />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        flexShrink: 0,
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          backgroundColor: "background.paper",
          height: "40px",
          marginTop: "10px",
        },
        "& .MuiOutlinedInput-input": {
          padding: "8px 14px 8px 8px",
        },
      }}
    />
  );
}

export default LogoSearchBar;
