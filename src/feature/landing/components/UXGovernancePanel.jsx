"use client";
import { Box, Container, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import AnimatedAvatarSection from "@/components/shared/AnimatedAvatarSection";
import GovernanceProcessFlow from "./governance/GovernanceProcessFlow";
import { zoomInView } from "@/utils/animations";

const MotionBox = motion(Box);

const UXGovernancePanel = () => {
  return (
    <Box sx={{ position: "relative", py: { xs: 8, md: 12 }, bgcolor: "#FFFFFF", overflow: "hidden" }}>
      <Box sx={{ position: "absolute", inset: 0, background: { xs: "radial-gradient(800px 300px at 80% -20%, rgba(99,102,241,0.10), transparent), radial-gradient(600px 260px at -10% 120%, rgba(59,130,246,0.10), transparent)", md: "radial-gradient(1200px 400px at 80% -20%, rgba(99,102,241,0.10), transparent), radial-gradient(900px 320px at -10% 120%, rgba(59,130,246,0.10), transparent)" }, pointerEvents: "none" }} />
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Stack direction="column" alignItems="center" justifyContent="center" sx={{ mb: 5, gap: 1.5 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: "2rem", md: "2.75rem", lg: "3rem" }, color: "#212529", letterSpacing: -0.5 }}>
              UX Governance
            </Typography>
            <Typography variant="body1" sx={{ fontSize: { xs: "1rem", md: "1.2rem" }, color: "#6c757d", lineHeight: 1.8, maxWidth: "700px", mx: "auto", mt: 1.5 }}>
            From tokens to components, every decision follows a clear governance process that keeps products consistent without slowing teams down.            </Typography>
          </Box>
        </Stack>

        {/* Animated Governance Illustration */}
        <Box sx={{ mb: 6, maxWidth: "100%", mx: "auto" }}>
          <AnimatedAvatarSection />
        </Box>

        {/* Governance Process Flow */}
        <Box sx={{ mb: 8, maxWidth: "1400px", mx: "auto" }}>
          <MotionBox
            {...zoomInView}
          >
            <GovernanceProcessFlow />
          </MotionBox>
        </Box>
      </Container>
    </Box>
  );
};

export default UXGovernancePanel;
