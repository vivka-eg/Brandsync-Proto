import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { motion } from "motion/react";
import { MenuBook, AccessibilityNew, ChevronLeft } from "@mui/icons-material";
import ShimmerOverlay from "./ShimmerOverlay";

function NavigationDrawerMockup({ logo }) {
  const [showShimmer, setShowShimmer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const horizontalLogoURL = logo.assets.dark.horizontal;
  const logoURL = logo.assets.logo;

  useEffect(() => {
    setShowShimmer(true);
    const timer = setTimeout(() => {
      setShowShimmer(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [logo.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      <Box sx={{ width: "100%", mb: 4 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Navigation Drawer
        </Typography>

        <Box sx={{ display: "flex", gap: 3 }}>
          {/* Desktop Drawer */}
          <Box
            sx={{
              flex: 1,
              bgcolor: "white",
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              p: 3,
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box sx={{ display: "flex", gap: 2, height: "300px" }}>
              {/* Sidebar */}
              <Box
                sx={{
                  width: "240px",
                  bgcolor: "#F9FAFB",
                  borderRadius: "8px",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {/* Logo */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: "auto",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={horizontalLogoURL}
                      alt={logo.name}
                      style={{
                        width: "auto",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                    {showShimmer && <ShimmerOverlay />}
                  </Box>
                </Box>

                {/* Menu Items */}
                <Stack spacing={0.5}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1,
                      borderRadius: "6px",
                    }}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{ fontSize: "0.95rem" }}
                    >
                      Design System
                    </Typography>
                    <ChevronLeft sx={{ fontSize: 20, color: "#6B7280" }} />
                  </Box>
                  <Stack spacing={0.5} sx={{ pl: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 1,
                        borderRadius: "6px",
                        bgcolor: "#EEF1F1",
                      }}
                    >
                      <MenuBook sx={{ fontSize: 18, color: "#29303B" }} />
                      <Typography
                        variant="body2"
                        sx={{ color: "#29303B", fontSize: "0.875rem", fontWeight: 600 }}
                      >
                        Introduction
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 1,
                        borderRadius: "6px",
                      }}
                    >
                      <AccessibilityNew
                        sx={{ fontSize: 18, color: "#6B7280" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "#6B7280", fontSize: "0.875rem" }}
                      >
                        Accessibility
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Box>

              {/* Content Area */}
              <Box sx={{ flex: 1, p: 2 }}>
                <Typography variant="h6" fontWeight={600} mb={1}>
                  Dashboard
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    height: "120px",
                    bgcolor: "#F3F4F6",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Mobile Drawer */}
          <Box
            sx={{
              flex: 1,
              bgcolor: "white",
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
              p: 3,
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box sx={{ display: "flex", gap: 2, height: "300px" }}>
              {/* Mobile Sidebar */}
              <Box
                sx={{
                  width: "80px",
                  bgcolor: "#F9FAFB",
                  borderRadius: "8px",
                  p: 1.5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {/* Logo */}
                <Box
                  sx={{
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={logoURL}
                    alt={logo.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                  {showShimmer && <ShimmerOverlay />}
                </Box>

                {/* Icon Menu Items */}
                <Box
                  sx={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#EEF1F1",
                  }}
                >
                  <MenuBook sx={{ fontSize: 20, color: "#29303B" }} />
                </Box>
                <Box
                  sx={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AccessibilityNew sx={{ fontSize: 20, color: "#6B7280" }} />
                </Box>
                <Box
                  sx={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* <MenuBook sx={{ fontSize: 20, color: "#6B7280" }} /> */}
                </Box>
              </Box>

              {/* Content Area */}
              <Box sx={{ flex: 1, p: 2 }}>
                <Typography variant="h6" fontWeight={600} mb={1}>
                  Dashboard
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    height: "120px",
                    bgcolor: "#F3F4F6",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}

export default NavigationDrawerMockup;
