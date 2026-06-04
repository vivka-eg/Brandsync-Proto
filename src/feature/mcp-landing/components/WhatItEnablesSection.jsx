"use client";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SectionBadge from "./SectionBadge";
import {
  DesignContextCard,
  FrameworkHubCard,
  ZeroTokenDriftCard,
  PatternCollageCard,
  ProdReadinessCard,
} from "./WhatItEnablesVisuals";
import { CARDS } from "../utils/whatItEnablesCards";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: "easeOut" },
  }),
};

function FeatureCard({ card, index }) {
  return (
    <MotionBox
      custom={index * 0.08}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={cardVariants}
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0px 4px 8px 0px rgba(0,0,0,0.06)",
        height: "100%",
      }}
    >
      {card.designContext  ? <DesignContextCard  /> :
       card.frameworkHub  ? <FrameworkHubCard   /> :
       card.zeroTokenDrift? <ZeroTokenDriftCard /> :
       card.patternCollage? <PatternCollageCard /> :
       card.prodReadiness ? <ProdReadinessCard  /> : null}

      <Box sx={{ p: "20px 24px 24px" }}>
        <Typography sx={{ fontSize: "18px", fontWeight: 700, color: "text.primary", mb: 1, lineHeight: 1.3 }}>
          {card.title}
        </Typography>
        <Typography sx={{ fontSize: "15px", color: "text.secondary", lineHeight: 1.6 }}>
          {card.description}
        </Typography>
      </Box>
    </MotionBox>
  );
}

export default function WhatItEnablesSection() {
  const firstRow  = CARDS.slice(0, 3);
  const secondRow = CARDS.slice(3);

  return (
    <Box sx={{ py: { xs: 8, md: 14 }, px: { xs: 3, md: 8 } }}>
      <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 6, maxWidth: 768, mx: "auto" }}>
        <MotionBox
          initial={{ opacity: 0, scale: 1.15 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SectionBadge>What it enables</SectionBadge>
        </MotionBox>

        <MotionTypography
          component="h2"
          initial={{ opacity: 0, scale: 1.08 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
          sx={{ fontSize: { xs: "2rem", md: "3rem" }, fontWeight: 700, lineHeight: 1.2, color: "text.primary" }}
        >
          What BrandSync MCP Enables?
        </MotionTypography>

        <MotionTypography
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          sx={{ fontSize: "18px", color: "text.secondary", lineHeight: 1.5 }}
        >
          Five capabilities that enforce design system compliance in every generated component.
        </MotionTypography>
      </Stack>

      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
            gap: 3,
            mb: 3,
          }}
        >
          {firstRow.map((card, i) => <FeatureCard key={card.id} card={card} index={i} />)}
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 3,
          }}
        >
          {secondRow.map((card, i) => <FeatureCard key={card.id} card={card} index={i} />)}
        </Box>
      </Box>
    </Box>
  );
}
