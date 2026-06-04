"use client";

import { Box, Typography, Container } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

/**
 * Full-width banner hero with headline, supporting copy, and CTAs.
 */
export default function LandingBannerHero() {
  const router = useRouter();

  return (
    <Box
      component="section"
      aria-labelledby="landing-banner-heading"
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: "min(92vh, 820px)", md: "min(88vh, 900px)" },
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        bgcolor: "#ffffff",
      }}
    >
      {/* Full-bleed banner artwork */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: "url(/landing/hero-section/banner-layout.svg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: { xs: "min(140%, 900px)", md: "min(58vw, 720px)" },
          backgroundPosition: { xs: "center 88%", md: "right -2% center" },
          opacity: { xs: 0.35, md: 0.55 },
        }}
      />

      {/* Readability scrim over banner */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: {
            xs: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 42%, rgba(255,255,255,0.82) 100%)",
            md: "linear-gradient(105deg, rgba(255,255,255,0.99) 0%, rgba(255,255,255,0.94) 36%, rgba(255,255,255,0.72) 52%, rgba(255,255,255,0.28) 72%, rgba(255,255,255,0.08) 100%)",
          },
        }}
      />

      {/* Light grid */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
          opacity: 0.85,
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 2,
          py: { xs: 8, md: 6 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: "100%", md: "min(560px, 48%)" },
            textAlign: { xs: "center", md: "left" },
            mx: { xs: "auto", md: 0 },
          }}
        >
          <Typography
            id="landing-banner-heading"
            variant="h1"
            sx={{
              fontSize: {
                xs: "2.5rem",
                sm: "3.25rem",
                md: "3.75rem",
                lg: "4.25rem",
              },
              fontWeight: 800,
              lineHeight: 1.08,
              color: "#000000",
              mb: 2,
            }}
          >
            One Design System.
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontSize: {
                xs: "1.45rem",
                sm: "1.85rem",
                md: "2.1rem",
                lg: "2.35rem",
              },
              fontWeight: 300,
              lineHeight: 1.2,
              color: "#000000",
              mb: 3,
            }}
          >
            Every Product Aligned.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1.05rem", md: "1.2rem" },
              color: "#5c6570",
              lineHeight: 1.75,
              mb: 4,
            }}
          >
            BrandSync aims to unify every EG product under a single design language.
            Build consistently with shared foundations: layout, spacing, logo usage, and
            typography.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: { xs: "center", md: "flex-start" },
              flexWrap: "wrap",
            }}
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "14px 32px",
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: "8px",
                background: "linear-gradient(135deg, #424242 0%, #1a1a1a 100%)",
                color: "#ffffff",
                border: "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
              onClick={() => router.push("/design-system/quick-start-guide")}
            >
              Get Started
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "14px 32px",
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: "8px",
                background: "transparent",
                color: "#1a1a1a",
                border: "2px solid #1a1a1a",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
              onClick={() => router.push("/design-system")}
            >
              Introduction
            </motion.button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
