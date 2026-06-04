"use client";

import React, { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import { motion, AnimatePresence } from "motion/react";

// Helper function to get palette color
function getPaletteColor(palette) {
  const colors = {
    purple: "#7C3AED",
    cobalt: "#1E40AF",
    blue: "#2563EB",
    steel: "#475569",
    teal: "#0D9488",
    jade: "#059669",
    green: "#16A34A",
    lime: "#65A30D",
    yellow: "#CA8A04",
    amber: "#D97706",
    orange: "#EA580C",
    magenta: "#DB2777",
    maroon: "#BE185D",
    violet: "#8B5CF6",
  };
  return colors[palette] || "#6B7280";
}

function LogoUploadPreview({ logoVariants, logoSizes, logoName, colorPalette, sidebarLogo }) {
  const [selectedVariant, setSelectedVariant] = useState("dark");

  const currentVariant = logoVariants[selectedVariant];
  const brandColor = getPaletteColor(colorPalette);

  // Use universal sizes (or defaults if not provided)
  const horizontalSize = logoSizes?.headerSize || { width: "auto", height: 30 };
  const verticalSize = logoSizes?.splashVerticalSize || { width: "auto", height: 60 };

  // Determine background color based on variant
  const getBackgroundColor = () => {
    switch (selectedVariant) {
      case "light":
        return brandColor;
      case "dark":
        return "#FFFFFF";
      case "negative":
        return "#1F2937";
      default:
        return "#FFFFFF";
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "#F9FAFB",
        borderRadius: 2,
        border: "1px solid #E5E7EB",
        height: "100%",
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} mb={2}>
        Preview
      </Typography>

      {/* Variant Tabs */}
      <Tabs
        value={selectedVariant}
        onChange={(e, v) => setSelectedVariant(v)}
        sx={{
          mb: 2,
          minHeight: 32,
          "& .MuiTab-root": {
            minHeight: 32,
            textTransform: "none",
            fontSize: "0.75rem",
            px: 2,
          },
        }}
      >
        <Tab label="Light" value="light" />
        <Tab label="Dark" value="dark" />
        <Tab label="Negative" value="negative" />
      </Tabs>

      {/* Main Preview Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedVariant}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Box
            sx={{
              bgcolor: getBackgroundColor(),
              borderRadius: 2,
              p: 3,
              minHeight: 200,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              border: "1px solid #E5E7EB",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Variant Label */}
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                px: 1,
                py: 0.25,
                bgcolor: "rgba(0,0,0,0.1)",
                borderRadius: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  textTransform: "capitalize",
                  color: selectedVariant === "dark" ? "#374151" : "#fff",
                  fontWeight: 500,
                }}
              >
                {selectedVariant}
              </Typography>
            </Box>

            {/* Horizontal Logo */}
            {currentVariant.horizontal ? (
              <Box
                sx={{
                  height: horizontalSize.height || 30,
                  width:
                    horizontalSize.width === "auto"
                      ? "auto"
                      : horizontalSize.width,
                }}
              >
                <img
                  src={currentVariant.horizontal.url}
                  alt="Horizontal logo"
                  style={{
                    height: "100%",
                    width:
                      horizontalSize.width === "auto"
                        ? "auto"
                        : "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  width: 150,
                  height: 30,
                  bgcolor: "rgba(128,128,128,0.2)",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: selectedVariant === "dark" ? "#9CA3AF" : "rgba(255,255,255,0.6)",
                  }}
                >
                  Horizontal logo
                </Typography>
              </Box>
            )}

            {/* Vertical Logo */}
            {currentVariant.vertical ? (
              <Box
                sx={{
                  height: verticalSize.height || 60,
                  width:
                    verticalSize.width === "auto"
                      ? "auto"
                      : verticalSize.width,
                }}
              >
                <img
                  src={currentVariant.vertical.url}
                  alt="Vertical logo"
                  style={{
                    height: "100%",
                    width:
                      verticalSize.width === "auto"
                        ? "auto"
                        : "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: "rgba(128,128,128,0.2)",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: selectedVariant === "dark" ? "#9CA3AF" : "rgba(255,255,255,0.6)",
                    textAlign: "center",
                    fontSize: "0.65rem",
                  }}
                >
                  Vertical
                </Typography>
              </Box>
            )}
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Sidebar Icon Preview */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="caption" color="text.secondary" mb={1} display="block">
          Sidebar Icon
        </Typography>
        <Box
          sx={{
            width: 48,
            height: 48,
            bgcolor: "#fff",
            borderRadius: 1,
            border: "1px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 1,
          }}
        >
          {sidebarLogo ? (
            <img
              src={sidebarLogo.url}
              alt="Sidebar icon"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                bgcolor: "#F3F4F6",
                borderRadius: 0.5,
              }}
            />
          )}
        </Box>
      </Box>

      {/* Color palette indicator */}
      {colorPalette && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="caption" color="text.secondary" mb={1} display="block">
            Brand Color
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1,
                bgcolor: brandColor,
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            />
            <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
              {colorPalette}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default LogoUploadPreview;
