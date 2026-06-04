"use client";
import {
  Box,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import { ErrorOutline, Home, Refresh } from "@mui/icons-material";

const ErrorPage = ({ primaryColor }) => {
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
      {/* Error Icon */}
      <Box
        sx={{
          width: 80,
          height: 80,
          mx: "auto",
          mb: 2,
          borderRadius: 2,
          backgroundColor: "#FEE2E2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ErrorOutline sx={{ fontSize: 40, color: "#EF4444" }} />
      </Box>

      <Typography sx={{ fontWeight: 700, color: "#111827", fontSize: "2rem", mb: 0.5 }}>
        404
      </Typography>
      <Typography sx={{ fontWeight: 600, color: "#374151", fontSize: "1rem", mb: 1 }}>
        Page not found
      </Typography>
      <Typography sx={{ color: "#6B7280", fontSize: "0.875rem", mb: 3, maxWidth: 300, mx: "auto" }}>
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
      </Typography>

      <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "wrap" }}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 1.5,
            borderColor: "#D1D5DB",
            color: "#374151",
            "&:hover": { borderColor: "#9CA3AF", backgroundColor: "#F9FAFB" },
          }}
        >
          Try again
        </Button>
        <Button
          variant="contained"
          startIcon={<Home />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 1.5,
            backgroundColor: primaryColor,
            "&:hover": { backgroundColor: primaryColor, opacity: 0.9 },
          }}
        >
          Go home
        </Button>
      </Box>
    </Paper>
  );
};

export default ErrorPage;
