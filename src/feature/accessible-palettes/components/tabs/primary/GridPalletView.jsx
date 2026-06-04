import React, { useState, useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import ColorAccessibilityCard from "./ColorAccessibilityCard";
import { useAccessiblePaletteContext } from "@/context/design-system/AccessiblePaletteContext";

/**
 * GridPalletView - Displays a grid of color accessibility cards
 * Shows the color palette in a responsive grid layout with accessibility information
 *
 * @returns {JSX.Element} A grid view of color accessibility cards
 */
function GridPalletView({ colorPalette }) {
  const [animationKey, setAnimationKey] = useState(0);

  // Trigger animation when colorPalette changes
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [colorPalette]);

  return (
    <Stack>
      {/* CSS Grid of Color Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // 1 column on mobile
            // sm: "repeat(2, 1fr)", // 2 columns on small screens
            // md: "repeat(3, 1fr)", // 3 columns on medium screens
            lg: "repeat(3,1fr)", // Auto-fit with min width
          },
          "@media (min-width: 1200px)": {
            gridTemplateColumns: "repeat(2, 1fr)", // 4 columns on large screens
          },

          gap: 4,
        }}
      >
        {colorPalette.map((colorData, index) => (
          <Box
            key={`${colorData.name}-${animationKey}`}
            sx={{
              animation: "slideInUp 0.5s ease-out forwards",
              animationDelay: `${index * 0.08}s`,
              opacity: 0,
              "@keyframes slideInUp": {
                "0%": {
                  opacity: 0,
                  transform: "translateY(30px) scale(0.95)",
                },
                "100%": {
                  opacity: 1,
                  transform: "translateY(0) scale(1)",
                },
              },
            }}
          >
            <ColorAccessibilityCard colorData={colorData} />
          </Box>
        ))}
      </Box>
    </Stack>
  );
}

export default GridPalletView;
