"use client";
import { Box } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: "easeOut" },
  }),
};

export default function FeatureCard({ children, delay = 0, sx = {} }) {
  return (
    <MotionBox
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={cardVariants}
      sx={{
        display: "flex",
        p: "25px",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        gap: "32px",
        borderRadius: "12px",
        background: "#FFF",
        boxShadow: "-2px 2px 16.3px 0 rgba(0,0,0,0.12)",
        position: "relative",
        overflow: "hidden",
        ...sx,
      }}
    >
      {children}
    </MotionBox>
  );
}
