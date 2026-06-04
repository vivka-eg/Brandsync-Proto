import React, { useState, useEffect } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { motion, AnimatePresence } from "motion/react";
import ShimmerOverlay from "./ShimmerOverlay";

function LogoPreviewCard({ selectedLogo, backgroundColor }) {
  const [showShimmer, setShowShimmer] = useState(false);

  // Show shimmer when logo changes
  useEffect(() => {
    setShowShimmer(true);
    const timer = setTimeout(() => {
      setShowShimmer(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [selectedLogo.id]);

  // Function to determine if a color is light
  const isLightColor = (hexColor) => {
    // Convert hex to RGB
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return true if luminance is greater than 0.7 (lighter colors)
    return luminance > 0.7;
  };

  const useBlackText = isLightColor(backgroundColor);

  // Capitalize first letter of color palette name
  const colorPaletteName = selectedLogo?.colorPalette
    ? selectedLogo.colorPalette.charAt(0).toUpperCase() + selectedLogo.colorPalette.slice(1)
    : "";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{
        backgroundColor: backgroundColor,
        transition: { duration: 0.5, ease: "easeInOut" },
      }}
      style={{
        flex: 1,
        height: "400px",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        position: "relative",
      }}
    >
      {/* Color Theme Badge */}
      {colorPaletteName && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 1,
          }}
        >
          <Chip
            label={colorPaletteName}
            sx={{
              bgcolor: useBlackText ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.2)",
              color: useBlackText ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)",
              fontWeight: 600,
              fontSize: "0.75rem",
              height: "28px",
              backdropFilter: "blur(8px)",
              border: useBlackText ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(255, 255, 255, 0.3)",
              "& .MuiChip-label": {
                px: 1.5,
              },
            }}
          />
        </Box>
      )}
      <Box
        sx={{
          // bgcolor: "white",
          borderRadius: "24px",
          p: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "200px",
          height: "200px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedLogo.id}
            src={selectedLogo.assets.logo}
            alt={selectedLogo.name}
            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateY: 0,
              transition: {
                duration: 0.6,
                ease: [0.43, 0.13, 0.23, 0.96],
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              rotateY: 90,
              transition: { duration: 0.3 },
            }}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </AnimatePresence>
        {/* {showShimmer && <ShimmerOverlay />} */}
      </Box>
      <AnimatePresence mode="wait">
        <motion.div
          key={`text-${selectedLogo.id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Typography
            variant="h3"
            sx={{
              color: useBlackText ? "black" : "white",
              fontWeight: 500,
              mt: 1,
              fontFamily: "'Neo Sans', sans-serif",
            }}
          >
            {selectedLogo.name}
          </Typography>
        
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default LogoPreviewCard;
