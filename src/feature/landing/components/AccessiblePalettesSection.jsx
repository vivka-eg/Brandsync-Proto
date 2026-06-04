"use client";
import React, { useEffect, useRef } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Paper,
  Chip,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PaletteIcon from "@mui/icons-material/Palette";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";
import { zoomInView, withDelay, animateTextZoomIn } from "@/utils/animations";

gsap.registerPlugin(ScrollTrigger);

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const features = [
  {
    icon: <AccessibilityNewIcon sx={{ fontSize: 40 }} />,
    title: "WCAG Compliant",
    description:
      "All color combinations meet WCAG 2.1 AAA standards for contrast ratios, ensuring readability for all users.",
    color: "#10b981",
  },
  {
    icon: <PaletteIcon sx={{ fontSize: 40 }} />,
    title: "Brand-Ready Palettes",
    description:
      "Choose from pre-built accessible color palettes tailored to each EG brand with primary, neutral, and semantic colors.",
    color: "#3b82f6",
  },
  {
    icon: <ColorLensIcon sx={{ fontSize: 40 }} />,
    title: "Color Combinations",
    description:
      "Explore tested accessible combinations for text, backgrounds, and UI elements with real-time contrast ratios.",
    color: "#f59e0b",
  },
  {
    icon: <VisibilityIcon sx={{ fontSize: 40 }} />,
    title: "Theme Preview",
    description:
      "Preview your selected palette across real UI components including buttons, inputs, navigation, and more.",
    color: "#8b5cf6",
  },
];

export default function AccessiblePalettesSection() {
  const router = useRouter();
  const titleRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    const titleAnim = animateTextZoomIn(gsap, titleRef.current);
    const descAnim = animateTextZoomIn(gsap, descRef.current, { delay: 0.1 });

    return () => {
      titleAnim?.kill();
      descAnim?.kill();
    };
  }, []);

  const handleExplore = () => {
    router.push("/design-system/accessible-palettes");
  };

  return (
    <Box
      sx={{
        position: "relative",
        background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 6 },
        overflow: "hidden",
      }}
    >
      <Box
        sx={{ maxWidth: "1200px", mx: "auto", position: "relative", zIndex: 2 }}
      >
        <Stack
          spacing={2}
          alignItems="center"
          textAlign="center"
          sx={{ mb: 6 }}
        >
          <Typography
            ref={titleRef}
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2rem", md: "2.75rem", lg: "3rem" },
              lineHeight: 1.2,
              color: "#212529",
            }}
          >
            Accessible Color Palettes
          </Typography>
          <Typography
            ref={descRef}
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", md: "1.2rem" },
              color: "#6c757d",
              lineHeight: 1.8,
              maxWidth: "800px",
              mx: "auto",
            }}
          >
            Design confidently with accessible color palettes. Each combination
            is WCAG-tested so apps stay readable and inclusive.
          </Typography>
        </Stack>

        {/* Features Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 6,
          }}
        >
          {features.map((feature, index) => (
            <Box key={index}>
              <MotionPaper
                {...withDelay(zoomInView, index * 0.1)}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid #e5e7eb",
                  bgcolor: "#ffffff",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: `0 12px 24px ${feature.color}20`,
                    borderColor: feature.color,
                  },
                }}
              >
                <Stack spacing={2} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      bgcolor: `${feature.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: feature.color,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: "#212529",
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6c757d",
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Stack>
              </MotionPaper>
            </Box>
          ))}
        </Box>

        {/* Color Preview Section */}
        <MotionPaper
          {...zoomInView}
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            bgcolor: "#ffffff",
            border: "1px solid #e5e7eb",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
            mb: 4,
          }}
        >
          <Stack spacing={3}>
            <Box textAlign="center">
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#212529",
                  mb: 1,
                }}
              >
                What You'll Get
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#6c757d",
                  maxWidth: "600px",
                  mx: "auto",
                }}
              >
                Every palette includes everything you need for accessible design
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(5, 1fr)",
                },
                alignSelf: "center",
                "@media (max-width: 1318px)": {
                  gridTemplateColumns: "repeat(4, 1fr)",
                },
                "@media (max-width: 1080px)": {
                  gridTemplateColumns: "repeat(3, 1fr)",
                },
                "@media (max-width: 770px)": {
                  gridTemplateColumns: "repeat(2, 1fr)",
                },
                gap: 2,
              }}
            >
              {[
                {
                  label: "Primary Colors",
                  desc: "9 shades from 50-900",
                  colors: [
                    "#eff6ff",
                    "#dbeafe",
                    "#bfdbfe",
                    "#93c5fd",
                    "#60a5fa",
                  ],
                },
                {
                  label: "Neutral Colors",
                  desc: "Complete grayscale set",
                  colors: [
                    "#f9fafb",
                    "#f3f4f6",
                    "#e5e7eb",
                    "#d1d5db",
                    "#9ca3af",
                  ],
                },
                {
                  label: "Semantic Colors",
                  desc: "Success, warning, error",
                  colors: [
                    "#10b981",
                    "#f59e0b",
                    "#ef4444",
                    "#3b82f6",
                    "#8b5cf6",
                  ],
                },
                {
                  label: "Accessible Combinations",
                  desc: "Pre-tested text/bg pairs",
                  colors: [
                    "#1e40af",
                    "#3b82f6",
                    "#60a5fa",
                    "#93c5fd",
                    "#dbeafe",
                  ],
                },
                {
                  label: "Contrast Ratios",
                  desc: "Pre-validated combinations",
                  colors: [
                    "#065f46",
                    "#059669",
                    "#10b981",
                    "#34d399",
                    "#6ee7b7",
                  ],
                },
              ].map((section, idx) => (
                <Box key={idx}>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, mb: 0.5, color: "#212529" }}
                    >
                      {section.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#6c757d", display: "block", mb: 1.5 }}
                    >
                      {section.desc}
                    </Typography>
                    <Stack direction="row" spacing={0.5}>
                      {section.colors.map((color, i) => (
                        <Box
                          key={i}
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: color,
                            borderRadius: 1,
                            border: "1px solid #e5e7eb",
                            transition: "transform 0.2s",
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "center",
                pt: 2,
              }}
            >
              <Chip
                icon={<CheckCircleIcon />}
                label="WCAG AAA Compliant"
                sx={{
                  bgcolor: "#10b98115",
                  color: "#10b981",
                  fontWeight: 600,
                  border: "1px solid #10b98130",
                }}
              />
              <Chip
                icon={<CheckCircleIcon />}
                label="Contrast Tested"
                sx={{
                  bgcolor: "#3b82f615",
                  color: "#3b82f6",
                  fontWeight: 600,
                  border: "1px solid #3b82f630",
                }}
              />
              <Chip
                icon={<CheckCircleIcon />}
                label="Production Ready"
                sx={{
                  bgcolor: "#8b5cf615",
                  color: "#8b5cf6",
                  fontWeight: 600,
                  border: "1px solid #8b5cf630",
                }}
              />
            </Box>
          </Stack>
        </MotionPaper>

        {/* CTA Button */}
        <Box sx={{ textAlign: "center" }}>
          <MotionBox {...zoomInView}>
            <Button
              variant="contained"
              size="large"
              onClick={handleExplore}
              sx={{
                bgcolor: "#000000",
                color: "#ffffff",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 700,
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                "&:hover": {
                  bgcolor: "#1a1a1a",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Explore Accessible Palettes
            </Button>
          </MotionBox>
        </Box>
      </Box>
    </Box>
  );
}
