"use client";
import Box from "@mui/material/Box";
import HeroSection from "./components/HeroSection";
import WhatItEnablesSection from "./components/WhatItEnablesSection";
import CoreCapabilitiesSection from "./components/CoreCapabilitiesSection";
import FaqSection from "./components/FaqSection";
import CtaSection from "./components/CtaSection";
import EarlyAccessSection from "./components/EarlyAccessSection";
import { useAuthContext } from "@/context/auth/AuthContext";

export default function McpLandingPage() {
  const { isMcpBetaUser } = useAuthContext();

  return (
    <Box sx={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
      <HeroSection />
      <WhatItEnablesSection />
      <CoreCapabilitiesSection />
      {!isMcpBetaUser && <EarlyAccessSection />}
      <FaqSection />
      <CtaSection />
    </Box>
  );
}
