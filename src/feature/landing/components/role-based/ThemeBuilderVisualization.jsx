"use client";
import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";

// Theme Builder visualization component
const ThemeBuilderVisualization = () => {
  const [selectedColor, setSelectedColor] = useState("#1976d2");
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  const colorOptions = [
    "#1976d2", // Blue
    "#ec4899", // Pink
    "#10b981", // Green
    "#f59e0b", // Orange
    "#8b5cf6", // Purple
    "#ef4444", // Red
  ];

  // Auto-cycle through colors
  useEffect(() => {
    if (isUserInteracting) return;

    const interval = setInterval(() => {
      setCurrentColorIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % colorOptions.length;
        setSelectedColor(colorOptions[nextIndex]);
        return nextIndex;
      });
    }, 3000); // Change color every 3 seconds

    return () => clearInterval(interval);
  }, [isUserInteracting]);

  // Resume auto-cycling after user stops interacting
  useEffect(() => {
    if (!isUserInteracting) return;

    const timeout = setTimeout(() => {
      setIsUserInteracting(false);
    }, 5000); 

    return () => clearTimeout(timeout);
  }, [isUserInteracting, selectedColor]);

  const handleColorClick = (color, index) => {
    setSelectedColor(color);
    setCurrentColorIndex(index);
    setIsUserInteracting(true);
  };

  const generateShades = (baseColor) => {
    const shades = ["10", "20", "30", "40", "50"];
    return shades.map(shade => ({
      shade,
      color: `${baseColor}${Math.floor(parseInt(shade) * 2.55).toString(16).padStart(2, '0')}`
    }));
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "400px", md: "500px" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        overflow: "hidden",
      }}
    >
      {/* Animated background glow that follows the selected color */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "500px",
          height: "500px",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${selectedColor}15 0%, transparent 70%)`,
          animation: "colorGlow 2s ease-in-out infinite",
          transition: "background 0.8s ease",
          zIndex: 0,
          "@keyframes colorGlow": {
            "0%, 100%": {
              opacity: 0.6,
              transform: "translate(-50%, -50%) scale(1)",
            },
            "50%": {
              opacity: 1,
              transform: "translate(-50%, -50%) scale(1.1)",
            },
          },
        }}
      />

      {/* Theme Builder Interface */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "90%",
          maxWidth: "400px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          p: 3,
          boxShadow: `0 20px 60px ${selectedColor}20, 0 10px 30px rgba(0, 0, 0, 0.15)`,
          transition: "box-shadow 0.8s ease",
        }}
      >
        {/* Header */}
        <Typography
          sx={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#1f2937",
            mb: 2,
            textAlign: "center",
          }}
        >
          Theme Generator
        </Typography>

        {/* Color Picker */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#6b7280",
              mb: 1.5,
            }}
          >
            Choose Primary Color
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {colorOptions.map((color, index) => (
              <Box
                key={color}
                onClick={() => handleColorClick(color, index)}
                sx={{
                  position: "relative",
                  width: "45px",
                  height: "45px",
                  borderRadius: "12px",
                  backgroundColor: color,
                  cursor: "pointer",
                  border: selectedColor === color ? `3px solid #1f2937` : "3px solid transparent",
                  boxShadow: selectedColor === color
                    ? `0 4px 12px ${color}60`
                    : "0 2px 8px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  transform: selectedColor === color ? "scale(1.15)" : "scale(1)",
                  animation: selectedColor === color ? "colorPulse 0.6s ease-out" : "none",
                  "&:hover": {
                    transform: "scale(1.2)",
                    boxShadow: `0 6px 16px ${color}60`,
                  },
                  "@keyframes colorPulse": {
                    "0%": {
                      transform: "scale(1)",
                      boxShadow: `0 0 0 0 ${color}80`,
                    },
                    "50%": {
                      transform: "scale(1.2)",
                      boxShadow: `0 0 0 10px ${color}00`,
                    },
                    "100%": {
                      transform: "scale(1.15)",
                      boxShadow: `0 4px 12px ${color}60`,
                    },
                  },
                  "&::after": selectedColor === color ? {
                    content: '""',
                    position: "absolute",
                    inset: "-8px",
                    borderRadius: "14px",
                    background: `${color}20`,
                    animation: "ripple 1.5s ease-out infinite",
                    zIndex: -1,
                  } : {},
                  "@keyframes ripple": {
                    "0%": {
                      transform: "scale(0.8)",
                      opacity: 0.8,
                    },
                    "100%": {
                      transform: "scale(1.5)",
                      opacity: 0,
                    },
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Generated Color Tokens */}
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#6b7280",
              mb: 1.5,
            }}
          >
            Generated Palette
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 1,
            }}
          >
            {generateShades(selectedColor).map((item, index) => (
              <Box
                key={`${selectedColor}-${index}`}
                sx={{
                  aspectRatio: "1",
                  borderRadius: "8px",
                  backgroundColor: item.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: parseInt(item.shade) > 30 ? "#ffffff" : "#1f2937",
                  animation: `fadeInScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s both`,
                  transition: "background-color 0.5s ease",
                  "@keyframes fadeInScale": {
                    "0%": {
                      opacity: 0,
                      transform: "scale(0.3) rotate(-5deg)",
                    },
                    "60%": {
                      transform: "scale(1.1) rotate(2deg)",
                    },
                    "100%": {
                      opacity: 1,
                      transform: "scale(1) rotate(0deg)",
                    },
                  },
                }}
              >
                {item.shade}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Export Options */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
          }}
        >
          {["Export CSS", "Export JSON", "Export Figma"].map((label, index) => (
            <Box
              key={label}
              sx={{
                px: 2,
                py: 1,
                borderRadius: "8px",
                backgroundColor: `${selectedColor}15`,
                border: `1px solid ${selectedColor}40`,
                fontSize: "0.75rem",
                fontWeight: 600,
                color: selectedColor,
                cursor: "pointer",
                transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                animation: `buttonFadeIn 0.5s ease-out ${0.5 + index * 0.1}s both`,
                "&:hover": {
                  backgroundColor: `${selectedColor}25`,
                  transform: "translateY(-3px) scale(1.05)",
                  boxShadow: `0 4px 12px ${selectedColor}40`,
                },
                "@keyframes buttonFadeIn": {
                  "0%": {
                    opacity: 0,
                    transform: "translateY(10px)",
                  },
                  "100%": {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              {label}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ThemeBuilderVisualization;


