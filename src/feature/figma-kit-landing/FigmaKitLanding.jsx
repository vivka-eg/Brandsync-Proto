"use client";
import { Box } from "@mui/material";
import HeroSection from "./components/HeroSection";
import MarqueeSection from "./components/MarqueeSection";
import FeaturesSection from "./components/FeaturesSection";
import BenefitsSection from "./components/BenefitsSection";
import CTASection from "./components/CTASection";

export default function FigmaKitLanding() {
  return (
    <>
      <Box sx={{ position: "relative", mx: -4, px: 4, background: "#ffffff" }}>
        <Box
          sx={{
            position: "absolute",
            top: "-5%",
            left: "32%",
            width: "75%",
            height: "90%",
            background: "radial-gradient(ellipse 55% 180% at 40% 50%, rgba(122,166,242,1.5) 0%, rgba(122,166,242,0.22) 35%, transparent 70%)",
            transform: "rotate(20deg)",
            filter: "blur(28px)",
            pointerEvents: "none",
            zIndex: 0,
            opacity: 0,
            animation: "heroBlob1In 2s ease-out 0.1s forwards",
            "@keyframes heroBlob1In": { from: { opacity: 0 }, to: { opacity: 1 } },
          }}
        />
        {/* Horizontal ellipse behind marquee */}
        <Box
          sx={{
            position: "absolute",
            bottom: "2%",
            left: "2%",
            width: "60%",
            height: "50%",
            background: "radial-gradient(ellipse 100% 60% at 20% 50%, rgba(122,166,242,1.5) 0%, rgba(122,166,242,0.2) 50%, transparent 70%)",
            filter: "blur(36px)",
            pointerEvents: "none",
            zIndex: 0,
            opacity: 0,
            animation: "heroBlob2In 2.5s ease-out 0.5s forwards",
            "@keyframes heroBlob2In": { from: { opacity: 0 }, to: { opacity: 1 } },
          }}
        />
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <HeroSection />
          <MarqueeSection />
        </Box>
      </Box>
      <FeaturesSection />
      <BenefitsSection />
      <CTASection />
    </>
  );
}
