"use client";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

export default function BenefitRow({
  imageFirst = true,
  badge,
  badgeColor = "#EEF2FF",
  badgeTextColor = "#4361EE",
  title,
  description,
  bullets = [],
  image,
}) {
  // Mirror the RoleBasedSection direction logic:
  // imageFirst=true  → image on left, text on right → text slides from right (+x), image from left (-x)
  // imageFirst=false → text on left, image on right → text slides from left (-x), image from right (+x)
  const textXFrom = imageFirst ? 50 : -50;
  const imgXFrom = imageFirst ? -50 : 50;

  const pillVariants = {
    hidden: { opacity: 0, x: textXFrom },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0 } },
  };

  const headingVariants = {
    hidden: { opacity: 0, scale: 1.2 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut", delay: 0.2 } },
  };

  const bodyVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.3 } },
  };

  const bulletVariants = (i) => ({
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.4 + i * 0.12 } },
  });

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, x: imgXFrom },
    visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 1, ease: [0.34, 1.56, 0.64, 1], delay: 0.25 } },
  };

  const textBlock = (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "16px",
        px: "48px",
        "@media (max-width: 1600px)": { px: "28px" },
      }}
    >
      {/* Badge */}
      <MotionBox
        variants={pillVariants}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          bgcolor: badgeColor,
          borderRadius: "6px",
          px: 1.5,
          py: 0.4,
          width: "fit-content",
        }}
      >
        <Typography sx={{ fontSize: "13px", fontWeight: 500, color: badgeTextColor }}>
          {badge}
        </Typography>
      </MotionBox>

      {/* Title */}
      <MotionTypography
        variants={headingVariants}
        sx={{
          fontFamily: "Roboto",
          fontSize: "27px",
          "@media (max-width: 1600px)": { fontSize: "22px" },
          fontWeight: 600,
          lineHeight: "120%",
          color: "#000",
        }}
      >
        {title}
      </MotionTypography>

      {/* Description */}
      <MotionTypography
        variants={bodyVariants}
        sx={{
          fontFamily: "Roboto",
          fontSize: "17px",
          fontWeight: 400,
          lineHeight: "150%",
          color: "#4D535F",
        }}
      >
        {description}
      </MotionTypography>

      {/* Bullets */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {bullets.map((point, i) => (
          <MotionBox
            key={i}
            variants={bulletVariants(i)}
            sx={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
          >
            <Box
              sx={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                bgcolor: "#4D535F",
                mt: "8px",
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontFamily: "Roboto",
                fontSize: "15px",
                fontWeight: 400,
                lineHeight: "160%",
                color: "#4D535F",
              }}
            >
              {point}
            </Typography>
          </MotionBox>
        ))}
      </Box>
    </Box>
  );

  const imageBlock = (
    <MotionBox
      variants={imageVariants}
      sx={{
        flex: 1,
        position: "relative",
      }}
    >
      {image}
    </MotionBox>
  );

  return (
    <MotionBox
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "32px",
        py: "48px",
        "@media (max-width: 1600px)": { py: "32px" },
      }}
    >
      {imageFirst ? (
        <>
          {imageBlock}
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          {imageBlock}
        </>
      )}
    </MotionBox>
  );
}
