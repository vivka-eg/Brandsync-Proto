"use client";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import SectionBadge from "./SectionBadge";
import { Feature1Visual, Feature2Visual, Feature3Visual, Feature4Visual } from "./CoreCapabilitiesVisuals";
import { CaretRight } from "phosphor-react";
import { FEATURES } from "../utils/coreCapabilitiesFeatures";

const MotionBox = motion(Box);
const MotionStack = motion(Stack);
const MotionTypography = motion(Typography);

function FeatureRow({ feature }) {
  const isImageRight = feature.imageRight;
  const hasCustomVisual = feature.feature1Visual || feature.feature2Visual || feature.feature3Visual || feature.feature4Visual || feature.imageGrid;

  const textXFrom = isImageRight ? -40 : 40;
  const imgXFrom  = isImageRight ?  40 : -40;

  const textContent = (
    <MotionStack
      spacing={3}
      initial={{ opacity: 0, x: textXFrom }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      sx={{ flex: 1, minWidth: 0 }}
    >
      <MotionBox
        initial={{ opacity: 0, scale: 1.1 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        sx={{ alignSelf: "flex-start" }}
      >
        <SectionBadge fontWeight={700} sx={{ alignSelf: "flex-start" }}>
          {feature.badge}
        </SectionBadge>
      </MotionBox>

      <Stack spacing={3}>
        <MotionTypography
          component="h3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
          sx={{ fontSize: { xs: "1.75rem", md: "2.5rem" }, fontWeight: 700, lineHeight: 1.2, color: "text.primary" }}
        >
          {feature.title}
        </MotionTypography>

        <MotionTypography
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.26, ease: "easeOut" }}
          sx={{ fontSize: "18px", color: "text.secondary", lineHeight: 1.5 }}
        >
          {feature.description}
        </MotionTypography>

        <MotionBox
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.34, ease: "easeOut" }}
        >
          <Button
            component={Link}
            href={feature.cta.href}
            variant="contained"
            disableElevation
            endIcon={<CaretRight size={20} weight="bold" />}
            sx={{
              bgcolor: "transparent",
              color: "text.primary",
              borderRadius: "8px",
              height: 48,
              pl: "20px",
              pr: "12px",
              fontWeight: 500,
              fontSize: "16px",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#cdd2e0", boxShadow: "none" },
            }}
          >
            {feature.cta.label}
          </Button>
        </MotionBox>
      </Stack>
    </MotionStack>
  );

  const imageContent = (
    <MotionBox
      initial={{ opacity: 0, x: imgXFrom, scale: 0.96 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
      sx={{
        flexShrink: 0,
        width: { xs: "100%", md: 459 },
        bgcolor: "background.paper",
        border: "0.5px solid",
        borderColor: "divider",
        borderRadius: "12px",
        overflow: "hidden",
        height: { xs: 360, md: 640 },
        position: "relative",
        boxShadow: "0px 4px 8px 0px rgba(0,0,0,0.1)",
        ...(hasCustomVisual ? {} : { display: "flex", alignItems: "center", justifyContent: "center" }),
      }}
    >
      {feature.imageGrid      ? <Feature2Visual  /> :
       feature.feature1Visual ? <Feature1Visual  /> :
       feature.feature3Visual ? <Feature3Visual  /> :
       feature.feature4Visual ? <Feature4Visual  /> : null}
    </MotionBox>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: isImageRight ? "row" : "row-reverse" },
        alignItems: "center",
        gap: { xs: 4, md: 10 },
        maxWidth: 1280,
        mx: "auto",
        width: "100%",
      }}
    >
      {textContent}
      {imageContent}
    </Box>
  );
}

export default function CoreCapabilitiesSection() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 14 },
        px: { xs: 3, md: 8 },
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        gap: { xs: 8, md: 12 },
      }}
    >
      <Stack spacing={2} alignItems="center" textAlign="center" sx={{ maxWidth: 1000, mx: "auto" }}>
        <MotionBox
          initial={{ opacity: 0, scale: 1.15 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SectionBadge>The Features</SectionBadge>
        </MotionBox>

        <MotionTypography
          component="h2"
          initial={{ opacity: 0, scale: 1.08 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
          sx={{ fontSize: { xs: "2rem", md: "3rem" }, fontWeight: 700, lineHeight: 1.2, color: "text.primary" }}
        >
          Here are the Core Capabilities
        </MotionTypography>

        <MotionTypography
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          sx={{ fontSize: "18px", color: "text.secondary", lineHeight: 1.5 }}
        >
          Everything the MCP server exposes plus where to get the same foundations
          <br />
          as a static Agent Skills bundle when you don&apos;t need a live connection.
        </MotionTypography>
      </Stack>

      {FEATURES.map((feature) => (
        <FeatureRow key={feature.id} feature={feature} />
      ))}
    </Box>
  );
}
