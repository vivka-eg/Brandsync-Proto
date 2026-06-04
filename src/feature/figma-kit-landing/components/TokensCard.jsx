"use client";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import CardText from "./CardText";
import FeatureCard from "./FeatureCard";

const MotionBox = motion(Box);

const TOKENS = "/figma-kit/landing/Section%203%20(Features)/Tokens%20First";

export default function TokensCard() {
  return (
    <FeatureCard delay={0.24} sx={{ width: "490px", height: "340px", "@media (max-width: 1600px)": { width: "400px", height: "275px" } }}>
      {/* Figma Variables panel */}
      <Box
        component="img"
        src={`${TOKENS}/Frame%20335.svg`}
        alt="Figma Variables panel"
        sx={{
          position: "absolute",
          top: "39px",
          left: "65%",
          transform: "translateX(-50%)",
          width: "105%",
          borderRadius: "8px",
          boxShadow: "0 2px 20px rgba(0,0,0,0.1)",
          zIndex: 2,
        }}
      />

      {/* Cursor pointer; continuously floats up and down */}
      <MotionBox
        component="img"
        src={`${TOKENS}/pointer.svg`}
        alt=""
        aria-hidden
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
        sx={{
          position: "absolute",
          bottom: "52%",
          right: "60%",
          width: "8%",
          zIndex: 4,
        }}
      />

      {/* Fade overlay */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "70%",
          background: "linear-gradient(to bottom, transparent 0%, #ffffff 65%)",
          zIndex: 6,
          pointerEvents: "none",
        }}
      />

      <CardText
        title="Token-first structure"
        description="Styles live in Figma Variables, not buried in layers. Swap a mode, switch a brand and zero hunting through fills."
      />
    </FeatureCard>
  );
}
