"use client";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import CardText from "./CardText";
import FeatureCard from "./FeatureCard";

const MotionBox = motion(Box);

const RESPONSIVE = "/figma-kit/landing/Section%203%20(Features)/Responsive%20Card";

export default function ResponsiveCard() {
  return (
    <FeatureCard delay={0.36} sx={{ width: "490px", height: "425px", alignSelf: "flex-start", "@media (max-width: 1600px)": { width: "400px", height: "345px" } }}>
      {/* Desktop/browser mockup */}
      <Box
        component="img"
        src={`${RESPONSIVE}/Frame%20318.svg`}
        alt=""
        aria-hidden
        sx={{
          position: "absolute",
          top: "62px",
          left: "47px",
          width: "80%",
          zIndex: 2,
          borderRadius: "6px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      />

      {/* Mobile phone mockup; continuously floats up and down */}
      <MotionBox
        component="img"
        src={`${RESPONSIVE}/Frame%20337.svg`}
        alt=""
        aria-hidden
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
        sx={{
          position: "absolute",
          top: "94px",
          right: "25px",
          width: "22%",
          zIndex: 3,
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        }}
      />

      {/* Fade overlay */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "55%",
          background: "linear-gradient(to bottom, transparent 0%, #ffffff 65%)",
          zIndex: 6,
          pointerEvents: "none",
        }}
      />

      <CardText
        title="Responsive by default"
        description="Auto Layout all the way down. Components stretch, stack, and respond without manual fixing."
      />
    </FeatureCard>
  );
}
