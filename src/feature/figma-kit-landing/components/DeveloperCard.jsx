"use client";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import CardText from "./CardText";
import FeatureCard from "./FeatureCard";

const MotionBox = motion(Box);
const DEV = "/figma-kit/landing/Section%203%20(Features)/Developers%20Mode%20card";

export default function DeveloperCard() {
  return (
    <FeatureCard delay={0} sx={{ width: "490px", height: "420px", "@media (max-width: 1600px)": { width: "400px", height: "340px" } }}>
      {/* Frame 318; main modal UI */}
      <Box
        component="img"
        src={`${DEV}/Frame%20318.svg`}
        alt=""
        aria-hidden
        sx={{
          position: "absolute",
          top: "35px",
          left: "-144px",
          width: "110%",
          zIndex: 2,
          borderRadius: "6px",
          boxShadow: "0 6px 24px rgba(0,0,0,0.14)",
          maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
          "@media (max-width: 1595px)": { left: "-100px", width: "100%" },
        }}
      />

      {/* Frame 339; code editor panel; continuously floats */}
      <MotionBox
        component="img"
        src={`${DEV}/Frame%20339.svg`}
        alt=""
        aria-hidden
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
        sx={{
          position: "absolute",
          top: "82px",
          right: "34px",
          width: "27%",
          zIndex: 3,
          borderRadius: "6px",
          boxShadow: "0 6px 24px rgba(0,0,0,0.22)",
        }}
      />

      {/* Frame 378; "Input Field" purple annotation */}
      <Box
        component="img"
        src={`${DEV}/Frame%20378.svg`}
        alt=""
        aria-hidden
        sx={{
          position: "absolute",
          top: "47%",
          left: "0px",
          width: "71%",
          height: "62px",
          zIndex: 4,
          "@media (max-width: 1595px)": { top: "42%", left: "-4px", width: "59%" },
        }}
      />

      {/* Group 3; Jerry red cursor; continuously drifts */}
      <MotionBox
        component="img"
        src={`${DEV}/Group%203.svg`}
        alt=""
        aria-hidden
        animate={{ x: [-12, 0, -12], y: [10, 0, 10] }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
        sx={{
          position: "absolute",
          top: "13%",
          left: "25%",
          width: "17%",
          zIndex: 5,
        }}
      />

      {/* pointer; black cursor; continuously drifts */}
      <MotionBox
        component="img"
        src={`${DEV}/pointer.svg`}
        alt=""
        aria-hidden
        animate={{ x: [12, 0, 12], y: [10, 0, 10] }}
        transition={{ duration: 3, delay: 0.4, ease: "easeInOut", repeat: Infinity }}
        sx={{
          position: "absolute",
          top: "58%",
          left: "55%",
          width: "8%",
          zIndex: 5,
          "@media (max-width: 1595px)": { left: "52%" },
        }}
      />

      {/* Fade overlay */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60%",
          background: "linear-gradient(to bottom, transparent, #ffffff)",
          zIndex: 6,
          pointerEvents: "none",
        }}
      />

      <CardText
        title="Developer Friendly"
        description="Clear naming conventions, logical variants, and predictable component structure for smooth handoff."
      />
    </FeatureCard>
  );
}
