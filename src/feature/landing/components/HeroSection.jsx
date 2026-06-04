"use client";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { forwardRef, useState, useEffect } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { useRouter } from "next/navigation";

const MotionBox = motion(Box);

const carouselSlides = [
  {
    id: 1,
    label: "Layout",
    title: "Structured Grids",
    description: "Consistent grid systems for harmonious layouts",
    image: "/landing/hero-section/banner-layout.svg",
  },
  {
    id: 2,
    label: "Spacing",
    title: "Consistent Rhythm",
    description: "Unified spacing scale for visual harmony",
    image: "/landing/hero-section/spacing.svg",
  },
  {
    id: 3,
    label: "Logos",
    title: "Brand Identity",
    description:
      "Logo placement and usage guidelines - Mobile, Desktop, and web",
    image: "/landing/hero-section/logo_placement.svg",
  },
  {
    id: 4,
    label: "Typography",
    title: "Type Scales",
    description: "Detailed type system with hierarchy",
    image: "/landing/hero-section/typography.svg",
  },
];

const HeroSection = forwardRef((props, ref) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  // Auto-play carousel - change slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* Hero Section with White Background */}
        <Box
          sx={{
            background: "#ffffff",
            minHeight: "100vh",
            px: { xs: 3, md: 6 },
            position: "relative",
            overflow: "visible",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Animated Grid Pattern */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage:
                "linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* Central White Radial Gradient */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "120%",
              height: "120%",
              background:
                "radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 40%, transparent 70%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* Gradient Orbs - Background Effects */}
          <MotionBox
            animate={{
              x: [0, 120, 0, -80, 0],
              y: [0, -80, 0, 60, 0],
              scale: [1, 1.4, 1.1, 1.3, 1],
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            sx={{
              position: "absolute",
              top: "25%",
              left: "5%",
              width: "650px",
              height: "650px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(110, 173, 255, 0.28) 0%, rgba(56, 189, 248, 0.12) 50%, transparent 70%)",
              filter: "blur(30px)",
              pointerEvents: "none",
              zIndex: 0,
              willChange: "transform",
            }}
          />

          <MotionBox
            animate={{
              x: [0, -100, 0, 70, 0],
              y: [0, 90, 0, -70, 0],
              scale: [1, 1.5, 1.2, 1.4, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
            sx={{
              position: "absolute",
              bottom: "15%",
              right: "8%",
              width: "680px",
              height: "680px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(110, 173, 255, 0.28) 0%, rgba(56, 189, 248, 0.12) 50%, transparent 70%)",
              filter: "blur(30px)",
              pointerEvents: "none",
              zIndex: 0,
              willChange: "transform",
            }}
          />

          {/* Main Content Container */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              maxWidth: "1400px",
              mx: "auto",
              width: "100%",
              gap: { xs: 6, md: 10 },
              py: 6,
            }}
          >
            {/* Left Side - Text Content */}
            <Box
              sx={{
                flex: 1,
                textAlign: { xs: "center", md: "left" },
                maxWidth: { xs: "100%", md: "550px" },
                order: { xs: 2, md: 1 },
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: {
                    xs: "2.5rem",
                    sm: "3.5rem",
                    md: "4rem",
                    lg: "4.5rem",
                  },
                  fontWeight: 800,
                  lineHeight: 1.1,
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
                    xs: "1.5rem",
                    sm: "2rem",
                    md: "2.25rem",
                    lg: "2.5rem",
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
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                  color: "#6c757d",
                  lineHeight: 1.8,
                  mb: 4,
                }}
              >
                BrandSync aims to unify every EG product under a single design
                language. Build consistently with shared foundations: layout,
                spacing, logo usage, and typography.
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: "14px 32px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: "8px",
                    background:
                      "linear-gradient(135deg, #424242 0%, #1a1a1a 100%)",
                    color: "#ffffff",
                    border: "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() =>
                    router.push("/design-system/quick-start-guide")
                  }
                >
                  Get Started
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: "14px 32px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: "8px",
                    background: "transparent",
                    color: "#1a1a1a",
                    border: "2px solid #1a1a1a",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => router.push("/design-system")}
                >
                  Introduction
                </motion.button>
              </Box>
            </Box>

            {/* Right Side - Carousel */}
            <Box
              sx={{
                flex: "0 0 auto",
                width: { xs: "100%", md: "700px" },
                maxWidth: "700px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                order: { xs: 1, md: 2 },
              }}
            >
              {/* Foundations Heading */}
              <Typography
                sx={{
                  fontSize: { xs: "0.75rem", md: "0.85rem" },
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(0, 0, 0, 0.5)",
                  mb: -1,
                }}
              >
                Design Foundations
              </Typography>
              {/* Image Container */}
              <Box
                sx={{
                  width: "100%",
                  height: { xs: "500px", md: "650px" },
                  background: "#ffffff",
                  borderRadius: "24px",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  overflow: "hidden",
                  p: 5,
                }}
              >
                {/* Image/Visual Area */}
                <Box
                  sx={{
                    flex: 1,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {carouselSlides[currentSlide].image ? (
                    <NextImage
                      key={`img-${carouselSlides[currentSlide].id}`}
                      src={carouselSlides[currentSlide].image}
                      alt={carouselSlides[currentSlide].label}
                      width={560}
                      height={480}
                      priority
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <Typography
                      sx={{
                        fontSize: "1rem",
                        color: "rgba(0, 0, 0, 0.3)",
                        fontWeight: 500,
                      }}
                    >
                      Coming Soon
                    </Typography>
                  )}
                </Box>

                {/* Text Content */}
                <Box
                  sx={{
                    width: "100%",
                    textAlign: "center",
                    pt: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "rgba(0, 0, 0, 0.5)",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      mb: 0.5,
                    }}
                  >
                    {carouselSlides[currentSlide].label}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.1rem",
                      color: "#000000",
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    {carouselSlides[currentSlide].title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      color: "rgba(0, 0, 0, 0.6)",
                      lineHeight: 1.5,
                    }}
                  >
                    {carouselSlides[currentSlide].description}
                  </Typography>
                </Box>
              </Box>

              {/* Carousel Indicators */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  alignItems: "center",
                }}
              >
                {carouselSlides.map((slide, index) => (
                  <Box
                    key={slide.id}
                    onClick={() => setCurrentSlide(index)}
                    sx={{
                      width: index === currentSlide ? 40 : 10,
                      height: 10,
                      borderRadius: 5,
                      background:
                        index === currentSlide
                          ? "linear-gradient(135deg, #424242 0%, #1a1a1a 100%)"
                          : "rgba(0, 0, 0, 0.15)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background:
                          index === currentSlide
                            ? "linear-gradient(135deg, #424242 0%, #1a1a1a 100%)"
                            : "rgba(0, 0, 0, 0.25)",
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
