"use client";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { zoomInView, withDelay } from "@/utils/animations";
import DeveloperCard from "./DeveloperCard";
import CollaborateCard from "./CollaborateCard";
import TokensCard from "./TokensCard";
import ResponsiveCard from "./ResponsiveCard";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

export default function FeaturesSection() {

  return (
    <Box sx={{ py: 10, background: "radial-gradient(ellipse 40% 35% at 50% 55%, rgba(122, 166, 242, 1.5) 0%, transparent 100%)", "@media (max-width: 1600px)": { py: 7 } }}>
      {/* ── Header ── */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <MotionBox
          {...zoomInView}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            bgcolor: "#EEF2FF",
            borderRadius: "6px",
            px: 1.75,
            py: 0.5,
            mb: 2.5,
          }}
        >
          <Typography sx={{ fontSize: "0.8rem", fontWeight: 500, color: "#4361EE" }}>
            Features
          </Typography>
        </MotionBox>

        <MotionTypography
          component="h2"
          {...withDelay(zoomInView, 0.1)}
          sx={{
            fontSize: "2.75rem",
            "@media (max-width: 1600px)": { fontSize: "2.25rem" },
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#111827",
            mb: 1.5,
          }}
        >
          One kit. Everything covered.
        </MotionTypography>

        <MotionTypography
          {...withDelay(zoomInView, 0.2)}
          sx={{ fontSize: "1rem", color: "#6B7280", maxWidth: 560, mx: "auto" }}
        >
          Every feature your team needs to design faster, ship cleaner, and scale without friction.
        </MotionTypography>
      </Box>

      {/* ── Bento grid ── */}
      <Box sx={{ display: "flex", gap: "20px", justifyContent: "center", "@media (max-width: 1600px)": { gap: "16px" } }}>
        {/* Left column */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <DeveloperCard />
          <TokensCard />
        </Box>
        {/* Right column */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <CollaborateCard />
          <ResponsiveCard />
        </Box>
      </Box>
    </Box>
  );
}
