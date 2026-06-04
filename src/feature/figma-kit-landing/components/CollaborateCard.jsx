"use client";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import CardText from "./CardText";
import FeatureCard from "./FeatureCard";

const MotionBox = motion(Box);
const COLLAB = "/figma-kit/landing/Section%203%20(Features)/Collaborative%20card";

const cursors = [
  {
    src: `${COLLAB}/Group%204.svg`,
    alt: "Taylor cursor",
    sx: { position: "absolute", top: "12%", left: "13%", width: "18%", zIndex: 4 },
    offX: -12, offY: -10,
    delay: 0,
  },
  {
    src: `${COLLAB}/Group%205.svg`,
    alt: "Chris cursor",
    sx: { position: "absolute", top: "36%", left: "20%", width: "16%", zIndex: 4 },
    offX: -14, offY: 8,
    delay: 0.3,
  },
  {
    src: `${COLLAB}/Group%2028.svg`,
    alt: "Jonathan cursor",
    sx: { position: "absolute", top: "34%", right: "17%", width: "20%", zIndex: 4 },
    offX: 14, offY: 8,
    delay: 0.6,
  },
];

export default function CollaborateCard() {
  return (
    <FeatureCard
      delay={0.12}
      sx={{ width: "490px", height: "330px", "@media (max-width: 1600px)": { width: "400px", height: "270px" } }}
    >
      {/* Avatar stack */}
      <Box
        component="img"
        src={`${COLLAB}/EG%20Avatar%20Stack.svg`}
        alt="Team avatars"
        sx={{
          position: "absolute",
          top: "38%",
          left: "50%",
          transform: "translate(-50%, -70%)",
          width: "45%",
          zIndex: 3,
        }}
      />

      {/* Cursors; continuously drift out and back */}
      {cursors.map(({ src, alt, sx, offX, offY, delay }) => (
        <MotionBox
          key={src}
          component="img"
          src={src}
          alt={alt}
          aria-hidden
          animate={{ x: [offX, 0, offX], y: [offY, 0, offY] }}
          transition={{ duration: 3, delay, ease: "easeInOut", repeat: Infinity }}
          sx={sx}
        />
      ))}

      <CardText
        title="Collaborate seamlessly with your team"
        description="Shared components and documentation keep everyone on the same page."
      />
    </FeatureCard>
  );
}
