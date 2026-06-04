import React from "react";
import { Box, Typography, Alert, Link, CircularProgress } from "@mui/material";
import { Info } from "@mui/icons-material";
import NavigationHeaderMockup from "./NavigationHeaderMockup";
import NavigationDrawerMockup from "./NavigationDrawerMockup";
import SplashScreenMockup from "./SplashScreenMockup";

function MockupsSection({ logo, brandColor, isLoading }) {
  return (
    <Box sx={{ mt: 4, position: "relative" }}>
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(255, 255, 255, 0.8)",
            zIndex: 10,
            backdropFilter: "blur(4px)",
            borderRadius: 3,
          }}
        >
          <CircularProgress size={40} sx={{ color: "#111" }} />
        </Box>
      )}
      <Typography variant="h5" fontWeight={600} mb={2}>
        How Your Logo Appears in Applications
      </Typography>

      <Alert
        severity="info"
        icon={<Info />}
        sx={{
          mb: 3,
          bgcolor: "#F9FAFB",
          border: "1px solid #E5E7EB",
          "& .MuiAlert-message": {
            color: "#374151",
          },
          "& .MuiAlert-icon": {
            color: "#6B7280",
          },
        }}
      >
        Explore the recommended logo placements for every screen.{" "}
        <Link
          href="/design-system/foundation/logo-placement"
          sx={{
            color: "#374151",
            fontWeight: 600,
            textDecoration: "underline",
            "&:hover": {
              color: "#1F2937",
            },
          }}
        >
          View full guidelines
        </Link>
      </Alert>

      <Box
        sx={{
          bgcolor: "#F9FAFB",
          border: "1px solid #E5E7EB",
          borderRadius: "16px",
          p: 4,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <NavigationHeaderMockup
          logo={logo}
          brandColor={brandColor}
        />
        <NavigationDrawerMockup
          logo={logo}
          brandColor={brandColor}
        />
        <SplashScreenMockup
          logo={logo}
          brandColor={brandColor}
        />
      </Box>
    </Box>
  );
}

export default MockupsSection;
