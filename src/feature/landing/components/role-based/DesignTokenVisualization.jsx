"use client";
import { Box, Typography } from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import SpaceBarIcon from "@mui/icons-material/SpaceBar";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import LightModeIcon from "@mui/icons-material/LightMode";
import WidgetsIcon from "@mui/icons-material/Widgets";
import Lottie from "lottie-react";

// Design Token Connections component for designer section - Hub and Spoke Design
const DesignTokenVisualization = () => {
  const tokens = [
    { label: "Colors", icon: PaletteIcon, color: "#ec4899" },
    { label: "Typography", icon: FormatSizeIcon, color: "#8b5cf6" },
    { label: "Spacing", icon: SpaceBarIcon, color: "#10b981" },
    { label: "Shapes", icon: CropSquareIcon, color: "#f59e0b" },
    { label: "Shadows", icon: LightModeIcon, color: "#06b6d4" },
    { label: "Components", icon: WidgetsIcon, color: "#f97316" },
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
        overflow: "hidden",
      }}
    >
      {/* Multi-layered Background glow */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: { xs: "400px", md: "500px" },
          height: { xs: "400px", md: "500px" },
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, rgba(139, 92, 246, 0.08) 30%, transparent 70%)",
          animation: "designGlow 5s ease-in-out infinite",
          zIndex: 0,
          "@keyframes designGlow": {
            "0%, 100%": {
              opacity: 0.5,
              transform: "translate(-50%, -50%) scale(1) rotate(0deg)",
            },
            "50%": {
              opacity: 0.9,
              transform: "translate(-50%, -50%) scale(1.15) rotate(180deg)",
            },
          },
        }}
      />

      {/* Secondary rotating glow */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: { xs: "350px", md: "450px" },
          height: { xs: "350px", md: "450px" },
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle, transparent 40%, rgba(16, 185, 129, 0.08) 60%, transparent 80%)",
          animation: "glowCounter 7s ease-in-out infinite reverse",
          zIndex: 0,
          "@keyframes glowCounter": {
            "0%, 100%": {
              opacity: 0.4,
              transform: "translate(-50%, -50%) scale(1) rotate(0deg)",
            },
            "50%": {
              opacity: 0.8,
              transform: "translate(-50%, -50%) scale(1.1) rotate(-180deg)",
            },
          },
        }}
      />

      {/* Central Design System Hub */}
      <Box
        sx={{
          position: "relative",
          zIndex: 3,
          width: { xs: "140px", md: "180px" },
          height: { xs: "140px", md: "180px" },
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          border: "3px solid rgba(139, 92, 246, 0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          boxShadow: "0 12px 40px rgba(139, 92, 246, 0.25)",
          animation: "hubPulse 3s ease-in-out infinite",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: "-3px",
            borderRadius: "50%",
            padding: "3px",
            background: "linear-gradient(135deg, #ec4899, #8b5cf6, #10b981, #f59e0b)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            animation: "rotateBorder 4s linear infinite",
            opacity: 0.6,
          },
          "@keyframes hubPulse": {
            "0%, 100%": {
              transform: "scale(1)",
              boxShadow: "0 12px 40px rgba(139, 92, 246, 0.25)",
            },
            "50%": {
              transform: "scale(1.05)",
              boxShadow: "0 16px 48px rgba(139, 92, 246, 0.35)",
            },
          },
          "@keyframes rotateBorder": {
            "0%": {
              transform: "rotate(0deg)",
            },
            "100%": {
              transform: "rotate(360deg)",
            },
          },
        }}
      >
        <Box
          sx={{
            width: { xs: "120px", md: "160px" },
            height: { xs: "120px", md: "160px" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Lottie
            path="/lottie/figma.json"
            loop={true}
            autoplay={true}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
      </Box>

      {/* Token nodes positioned around the hub */}
      {tokens.map((token, index) => {
        const angle = (index * 360) / tokens.length - 90;
        const radius = 190;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <Box key={token.label}>
            {/* Connection line from hub to token */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "2px",
                height: `${radius}px`,
                transformOrigin: "top center",
                transform: `rotate(${angle + 90}deg)`,
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(to bottom, ${token.color}60, ${token.color}20)`,
                  animation: "lineGlow 3s ease-in-out infinite",
                  animationDelay: `${index * 0.5}s`,
                  "@keyframes lineGlow": {
                    "0%, 100%": {
                      opacity: 0.4,
                    },
                    "50%": {
                      opacity: 1,
                    },
                  },
                }}
              />

              {/* Data pulse along the line */}
              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  top: "0%",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: token.color,
                  transform: "translateX(-50%)",
                  boxShadow: `0 0 12px ${token.color}`,
                  animation: "pulseMove 2.5s ease-in-out infinite",
                  animationDelay: `${index * 0.4}s`,
                  "@keyframes pulseMove": {
                    "0%": {
                      top: "15%",
                      opacity: 0,
                      transform: "translateX(-50%) scale(0.5)",
                    },
                    "50%": {
                      opacity: 1,
                      transform: "translateX(-50%) scale(1)",
                    },
                    "100%": {
                      top: "85%",
                      opacity: 0,
                      transform: "translateX(-50%) scale(0.5)",
                    },
                  },
                }}
              />
            </Box>

            {/* Token Node */}
            <Box
              sx={{
                position: "absolute",
                top: `calc(50% + ${y}px)`,
                left: `calc(50% + ${x}px)`,
                transform: "translate(-50%, -50%)",
                zIndex: 2,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: { xs: "85px", md: "105px" },
                  height: { xs: "85px", md: "105px" },
                  borderRadius: "16px",
                  backgroundColor: "#ffffff",
                  border: `2px solid ${token.color}50`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.75,
                  boxShadow: `0 6px 24px ${token.color}30`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: `0 12px 40px ${token.color}50`,
                    border: `2px solid ${token.color}80`,
                  },
                }}
              >
                <Box
                  sx={{
                    width: { xs: "38px", md: "44px" },
                    height: { xs: "38px", md: "44px" },
                    borderRadius: "10px",
                    background: `linear-gradient(135deg, ${token.color}25 0%, ${token.color}10 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <token.icon sx={{ fontSize: { xs: 22, md: 26 }, color: token.color }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: { xs: "0.7rem", md: "0.8rem" },
                    fontWeight: 600,
                    color: "#475569",
                    textAlign: "center",
                  }}
                >
                  {token.label}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      })}

      {/* Outer orbit ring */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: { xs: "300px", md: "320px" },
          height: { xs: "300px", md: "320px" },
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: "2px dashed rgba(139, 92, 246, 0.2)",
          zIndex: 0,
          animation: "orbitRotate 20s linear infinite",
          "@keyframes orbitRotate": {
            "0%": {
              transform: "translate(-50%, -50%) rotate(0deg)",
            },
            "100%": {
              transform: "translate(-50%, -50%) rotate(360deg)",
            },
          },
        }}
      />

      {/* Comet trails orbiting around the tokens */}
      {[0, 1, 2].map((cometIndex) => {
        const cometDelay = cometIndex * 4;
        const orbitRadius = 190;

        return (
          <Box
            key={`comet-${cometIndex}`}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "100%",
              height: "100%",
              animation: `cometOrbit 12s linear infinite`,
              animationDelay: `${cometDelay}s`,
              "@keyframes cometOrbit": {
                "0%": {
                  transform: "translate(-50%, -50%) rotate(0deg)",
                },
                "100%": {
                  transform: "translate(-50%, -50%) rotate(360deg)",
                },
              },
            }}
          >
            {/* Comet head */}
            <Box
              sx={{
                position: "absolute",
                left: `calc(50% + ${orbitRadius}px)`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: `radial-gradient(circle, #fff 0%, ${tokens[cometIndex % tokens.length].color} 40%, transparent 70%)`,
                boxShadow: `0 0 20px ${tokens[cometIndex % tokens.length].color}, 0 0 40px ${tokens[cometIndex % tokens.length].color}80`,
                zIndex: 2,
              }}
            />

            {/* Comet trail */}
            <Box
              sx={{
                position: "absolute",
                left: `calc(50% + ${orbitRadius}px)`,
                top: "50%",
                transform: "translate(-100%, -50%)",
                width: "60px",
                height: "3px",
                background: `linear-gradient(to left, ${tokens[cometIndex % tokens.length].color}90 0%, ${tokens[cometIndex % tokens.length].color}60 20%, ${tokens[cometIndex % tokens.length].color}30 50%, transparent 100%)`,
                borderRadius: "2px",
                filter: "blur(1px)",
                zIndex: 1,
              }}
            />

            {/* Additional trail particles for depth */}
            {[0, 1, 2, 3].map((particleIdx) => (
              <Box
                key={particleIdx}
                sx={{
                  position: "absolute",
                  left: `calc(50% + ${orbitRadius - particleIdx * 12}px)`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: `${6 - particleIdx}px`,
                  height: `${6 - particleIdx}px`,
                  borderRadius: "50%",
                  backgroundColor: tokens[cometIndex % tokens.length].color,
                  opacity: 0.6 - particleIdx * 0.15,
                  filter: "blur(1px)",
                  zIndex: 1,
                }}
              />
            ))}
          </Box>
        );
      })}
    </Box>
  );
};

export default DesignTokenVisualization;


