"use client";
import {
  Box,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import { SearchOff } from "@mui/icons-material";

const EmptyState = ({ primaryColor }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        backgroundColor: "#FFFFFF",
        textAlign: "center",
      }}
    >
      {/* Illustration Placeholder */}
      <Box
        sx={{
          width: 120,
          height: 120,
          mx: "auto",
          mb: 3,
          borderRadius: "50%",
          backgroundColor: `${primaryColor}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SearchOff sx={{ fontSize: 48, color: primaryColor }} />
      </Box>

      <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "1.1rem", mb: 1 }}>
        No results found
      </Typography>
      <Typography sx={{ color: "#6B7280", fontSize: "0.875rem", mb: 3, maxWidth: 280, mx: "auto" }}>
        We couldn&apos;t find any items matching your search. Try adjusting your filters.
      </Typography>

      <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center" }}>
        <Button
          variant="outlined"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 1.5,
            borderColor: "#D1D5DB",
            color: "#374151",
            "&:hover": { borderColor: "#9CA3AF", backgroundColor: "#F9FAFB" },
          }}
        >
          Clear filters
        </Button>
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 1.5,
            backgroundColor: primaryColor,
            "&:hover": { backgroundColor: primaryColor, opacity: 0.9 },
          }}
        >
          Create new
        </Button>
      </Box>
    </Paper>
  );
};

export default EmptyState;
