"use client";
import { Box } from "@mui/material";
import { motion } from "motion/react";
import CodeIcon from "@mui/icons-material/Code";
import WebIcon from "@mui/icons-material/Web";
import BrushIcon from "@mui/icons-material/Brush";
import ApiIcon from "@mui/icons-material/Api";
import StorageIcon from "@mui/icons-material/Storage";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import CloudIcon from "@mui/icons-material/Cloud";
import SettingsIcon from "@mui/icons-material/Settings";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
// Rotating icons component for developer section
const RotatingIconsVisualization = () => {
  const icons = [
    { Icon: CodeIcon, color: "#61dafb" }, // React blue
    { Icon: WebIcon, color: "#dd0031" }, // Angular red
    { Icon: BrushIcon, color: "#42b883" }, // Vue green
    { Icon: ApiIcon, color: "#f59e0b" }, // REST API orange
    { Icon: StorageIcon, color: "#8b5cf6" }, // Database purple
    { Icon: IntegrationInstructionsIcon, color: "#e535ab" }, // GraphQL pink
    { Icon: CloudIcon, color: "#06b6d4" }, // Cloud cyan
    { Icon: SettingsIcon, color: "#6366f1" }, // Config indigo
    { Icon: SecurityIcon, color: "#10b981" }, // Security green
    { Icon: SpeedIcon, color: "#f97316" }, // Performance orange
  ];

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "400px", md: "500px" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Central Bing logo */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: { xs: "140px", md: "180px" },
          height: { xs: "140px", md: "180px" },
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          border: "3px solid rgba(100, 149, 237, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 32px rgba(100, 149, 237, 0.2), inset 0 0 0 1px rgba(100, 149, 237, 0.1)",
        }}
      >
        <Box
          sx={{
            width: { xs: "80px", md: "100px" },
            height: { xs: "80px", md: "100px" },
            position: "relative",
            overflow: "hidden",
          }}
        >
          <motion.img
            src="/BrandSync_logomark.svg"
            alt="BrandSync Logo"
            initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
            animate={{
              opacity: 1,
              scale: [1, 1, 1.2, 1],
              rotate: [0, 0, 360, 360],
            }}
            transition={{
              opacity: { duration: 0.5, ease: "easeOut" },
              scale: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.8, 0.85, 1],
              },
              rotate: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.8, 0.85, 1],
              },
            }}
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              zIndex: 1,
            }}
          />
          {/* Shimmer overlay */}
          <motion.div
            animate={{
              x: ["-100%", "100%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.85, 0.87, 0.92],
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        </Box>
      </Box>

      {/* Rotating icons */}
      {icons.map((item, index) => {
        const angle = (index * 360) / icons.length;
        const radius = 180;
        return (
          <Box
            key={index}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: { xs: "60px", md: "70px" },
              height: { xs: "60px", md: "70px" },
              borderRadius: "16px",
              backgroundColor: "#ffffff",
              border: "2px solid rgba(100, 149, 237, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
              animation: `orbit 25s linear infinite`,
              animationDelay: `${-index * (25 / icons.length)}s`,
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${radius}px) rotate(-${angle}deg)`,
              "@keyframes orbit": {
                "0%": {
                  transform: `translate(-50%, -50%) rotate(0deg) translateX(${radius}px) rotate(0deg)`,
                },
                "100%": {
                  transform: `translate(-50%, -50%) rotate(360deg) translateX(${radius}px) rotate(-360deg)`,
                },
              },
            }}
          >
            <item.Icon sx={{ fontSize: { xs: 26, md: 32 }, color: item.color }} />
          </Box>
        );
      })}

      {/* Rotating gradient ring */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: { xs: "320px", md: "320px" },
          height: { xs: "320px", md: "320px" },
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `
            conic-gradient(
              from 0deg,
              transparent 0%,
              rgba(100, 149, 237, 0.6) 15%,
              rgba(135, 206, 250, 0.8) 30%,
              rgba(100, 149, 237, 0.6) 45%,
              transparent 60%,
              transparent 100%
            )
          `,
          animation: "rotateGradient 8s linear infinite",
          zIndex: 0,
          maskImage: "radial-gradient(circle, transparent 48%, black 49%, black 51%, transparent 52%)",
          WebkitMaskImage: "radial-gradient(circle, transparent 48%, black 49%, black 51%, transparent 52%)",
          "@keyframes rotateGradient": {
            "0%": {
              transform: "translate(-50%, -50%) rotate(0deg)",
            },
            "100%": {
              transform: "translate(-50%, -50%) rotate(360deg)",
            },
          },
        }}
      />

      {/* Orbital path circle */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: { xs: "300px", md: "300px" },
          height: { xs: "300px", md: "300px" },
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: "2px dashed rgba(100, 149, 237, 0.15)",
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default RotatingIconsVisualization;

