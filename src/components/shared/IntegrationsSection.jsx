"use client";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { zoomInView } from "@/utils/animations";
import { getProductLogos } from "@/api/design-system/product-logos";

gsap.registerPlugin(ScrollTrigger);

const MotionBox = motion(Box);

const IntegrationIcon = ({ logoUrl, alt }) => (
  <Box
    sx={{
      width: { xs: 40, md: 50 },
      height: { xs: 40, md: 50 },
      borderRadius: "12px",
      backgroundColor: "rgba(100, 149, 237, 0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid rgba(100, 149, 237, 0.15)",
      padding: "8px",
    }}
  >
    <Box
      component="img"
      src={logoUrl}
      alt={alt}
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    />
  </Box>
);

const IntegrationsSection = () => {
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const buttonRef = useRef(null);
  const centerLogoRef = useRef(null);
  const [integrations, setIntegrations] = useState([]);

  useEffect(() => {
    getProductLogos({ pageSize: 24 })
      .then(({ data }) => setIntegrations(data))
      .catch(() => setIntegrations([]));
  }, []);

  useEffect(() => {
    // Title animation
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Description animation
    if (descRef.current) {
      gsap.fromTo(
        descRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: descRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Button animation
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          delay: 0.4,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: buttonRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Parallax effect for center logo
    if (centerLogoRef.current) {
      gsap.to(centerLogoRef.current, {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: centerLogoRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        background: "linear-gradient(to top, rgba(100, 149, 237, 0.4), rgba(135, 206, 250, 0.25), rgba(255, 255, 255, 0.9))",
        py: { xs: 8, md: 12 },
        px: { xs: 3, md: 6 },
        overflow: "hidden",
      }}
    >

      <Box
        sx={{
          maxWidth: "1300px",
          mx: "auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 6, md: 8 },
            alignItems: "center",
          }}
        >
          {/* Left Content */}
          <Box>
            <Typography
              variant="overline"
              sx={{
                display: "inline-block",
                px: 2,
                py: 0.5,
                mb: 3,
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#1976d2",
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                borderRadius: "4px",
                border: "1px solid rgba(25, 118, 210, 0.2)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Integrations
            </Typography>

            <Typography
              ref={titleRef}
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
                fontWeight: 700,
                color: "text.primary",
                mb: 3,
                lineHeight: 1.2,
              }}
            >
              Unite EG products under one design system
            </Typography>

            <Typography
              ref={descRef}
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", md: "1.125rem" },
                color: "#666",
                mb: 4,
                lineHeight: 1.7,
                maxWidth: "500px",
              }}
            >
From design tokens to foundations, BrandSync provides guiding principles to keep every EG team and product aligned. One source of truth. Infinite scale.            </Typography>

            <Button
              ref={buttonRef}
              component={Link}
              href="/design-system/quick-start-guide"
              variant="outlined"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                color: "#424242",
                borderColor: "rgba(0, 0, 0, 0.23)",
                borderRadius: "8px",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#424242",
                  backgroundColor: "rgba(66, 66, 66, 0.04)",
                },
              }}
            >
              Get Started
            </Button>
          </Box>

          {/* Right Side - Central Logo with Grid Icons */}
          <Box
            ref={centerLogoRef}
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: { xs: "450px", md: "550px" },
              overflow: "visible",
              "@keyframes ripple": {
                "0%": {
                  transform: "scale(0.8)",
                  opacity: 0,
                },
                "10%": {
                  opacity: 1,
                },
                "90%": {
                  opacity: 0.7,
                },
                "100%": {
                  transform: "scale(1.3)",
                  opacity: 0,
                },
              },
            }}
          >
            {/* Background grid of integration icons */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: { xs: 2.5, md: 3 },
                opacity: 0.6,
                // Radial fade from center outward
                maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
                WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
              }}
            >
              {/* Create 5 rows of 6 icons each, duplicated for seamless loop */}
              {[0, 1, 2, 3, 4].map((rowIndex) => (
                <Box
                  key={rowIndex}
                  sx={{
                    display: "flex",
                    gap: { xs: 3, md: 4 },
                    ...(rowIndex % 2 === 0 ? {
                      animation: `slideRight ${30 + rowIndex * 3}s linear infinite`,
                      "@keyframes slideRight": {
                        "0%": { transform: "translateX(-50%)" },
                        "100%": { transform: "translateX(0%)" },
                      },
                    } : {
                      animation: `slideLeft ${30 + rowIndex * 3}s linear infinite`,
                      "@keyframes slideLeft": {
                        "0%": { transform: "translateX(0%)" },
                        "100%": { transform: "translateX(-50%)" },
                      },
                    }),
                  }}
                >
                  {/* First set of icons */}
                  {integrations.slice(rowIndex * 6, (rowIndex + 1) * 6).map((logo, index) => (
                    <MotionBox
                      key={`${logo.id}-1`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: (rowIndex * 6 + index) * 0.02 }}
                      viewport={{ once: true }}
                      sx={{ flexShrink: 0 }}
                    >
                      <IntegrationIcon logoUrl={logo.assets.logo} alt={logo.name} />
                    </MotionBox>
                  ))}
                  {/* Duplicate set for seamless loop */}
                  {integrations.slice(rowIndex * 6, (rowIndex + 1) * 6).map((logo, index) => (
                    <MotionBox
                      key={`${logo.id}-2`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: (rowIndex * 6 + index) * 0.02 }}
                      viewport={{ once: true }}
                      sx={{ flexShrink: 0 }}
                    >
                      <IntegrationIcon logoUrl={logo.assets.logo} alt={logo.name} />
                    </MotionBox>
                  ))}
                </Box>
              ))}
            </Box>

            {/* Concentric circles with white to blue gradient ripple effect */}
            {[0, 1, 2].map((i) => {
              const size = 150 + i * 40;
              return (
                <Box
                  key={i}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: `${size}px`,
                    height: `${size}px`,
                    marginTop: `-${size / 2}px`,
                    marginLeft: `-${size / 2}px`,
                    borderRadius: "50%",
                    background: `
                      radial-gradient(circle,
                        transparent 0%,
                        transparent 45%,
                        rgba(255, 255, 255, 0.4) 48%,
                        rgba(255, 255, 255, 0.3) 50%,
                        rgba(255, 255, 255, 0.25) 51%,
                        rgba(100, 149, 237, 0.2) 52%,
                        rgba(100, 149, 237, 0.15) 53%,
                        transparent 55%
                      )
                    `,
                    border: `3px solid rgba(100, 149, 237, 0.4)`,
                    boxShadow: `0 0 20px rgba(100, 149, 237, 0.25), inset 0 0 20px rgba(255, 255, 255, 0.15)`,
                    animation: `ripple 3s ease-out infinite`,
                    animationDelay: `${i * 1}s`,
                    transformOrigin: "center center",
                  }}
                />
              );
            })}

            {/* Center logo/icon */}
            <MotionBox
              {...zoomInView}
              sx={{
                position: "relative",
                zIndex: 2,
                width: { xs: "120px", md: "160px" },
                height: { xs: "120px", md: "160px" },
                borderRadius: "50%",
                background: "#ffffff",
                border: "4px solid rgba(59, 130, 246, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 40px rgba(59, 130, 246, 0.4), inset 0 4px 12px rgba(255, 255, 255, 0.4), inset 0 -4px 12px rgba(30, 64, 175, 0.6)",
              }}
            >
              <Box
                sx={{
                  width: { xs: "60px", md: "80px" },
                  height: { xs: "60px", md: "80px" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  component="img"
                  src="/BrandSync_logomark.svg"
                  alt="BrandSync Logo"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    animation: "pulse 2s ease-in-out infinite",
                    "@keyframes pulse": {
                      "0%, 100%": {
                        transform: "scale(1)",
                        opacity: 1,
                      },
                      "50%": {
                        transform: "scale(1.1)",
                        opacity: 0.9,
                      },
                    },
                  }}
                />
              </Box>
            </MotionBox>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default IntegrationsSection;
