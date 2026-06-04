"use client";
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import LazyImage from "@/components/shared/LazyImage";
import { productColors } from "../constants";
import { useGridKeyNavigation } from "@/hooks/useGridKeyNavigation";

const ColorSidebar = ({
  selectedColor,
  onColorSelect,
  searchQuery,
  onSearchChange,
}) => {
  const filteredColors = productColors.filter((color) =>
    color.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const { register, onKeyDown } = useGridKeyNavigation(2);

  return (
    <Paper
      elevation={0}
      sx={{
        width: { xs: "100%", md: 280 },
        flexShrink: 0,
        p: 3,
        borderRadius: 0,
        borderRight: "1px solid #E5E7EB",
        backgroundColor: "#FFFFFF",
        position: "sticky",
        top: 0,
        height: "calc(100vh - 64px)",
        overflowY: "auto",
        alignSelf: "flex-start",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(0, 0, 0, 0.2) transparent",
        "&::-webkit-scrollbar": { width: "6px" },
        "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          borderRadius: "4px",
        },
      }}
    >
      <Typography
        // variant="h6"
        sx={{ fontWeight: 700, color: "#111827", mb: 0.5, fontSize: "20px" }}
      >
        Available Color themes
      </Typography>

      {/* Search */}
      <TextField
        size="small"
        placeholder="Search color themes"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        id="color-theme-search"
        inputProps={{ id: "color-theme-search-input", autoComplete: "off" }}
        sx={{
          mt: 2,
          mb: 2,
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            // backgroundColor: "#F9FAFB",
          },
          fontWeight: 500,
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "#9CA3AF", fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Color List */}
      <Box
        role="grid"
        aria-label="Available color themes"
        aria-colcount={2}
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5,
        }}
      >
        {filteredColors.map(({ name, src }, index) => (
          <Box key={name} role="row">
          <Box
            role="gridcell"
            aria-selected={selectedColor === name}
            onClick={() => onColorSelect(name)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              p: "8px 16px",
              borderRadius: 2,
              cursor: "pointer",
              border:
                selectedColor === name
                  ? "1px solid #2b2b2b"
                  : "1px solid transparent",
              // backgroundColor:
              //   selectedColor === name ? "#EFF6FF" : "transparent",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#F3F4F6",
              },
            }}
            tabIndex={index === 0 ? 0 : -1}
            ref={register(index)}
            onKeyDown={(e) => onKeyDown(e, index)}
          >
            <LazyImage
              src={src}
              alt={name}
              width={40}
              height={40}
              enableModal={false}
              style={{ width: 40, height: 40 }}
            />
            <Typography
              sx={{
                fontSize: "0.8rem",
                // fontWeight: selectedColor === name ? 600 : 400,
                color: "#374151",
                textTransform: "capitalize",
              }}
            >
              {name}
            </Typography>
          </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ColorSidebar;
