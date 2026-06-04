"use client";
import { Box, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import WidgetsIcon from "@mui/icons-material/Widgets";
import ShieldIcon from "@mui/icons-material/Shield";
import CodeIcon from "@mui/icons-material/Code";
import HubIcon from "@mui/icons-material/Hub";
import Lottie from "lottie-react";

// AI Brain with MCP Data Streams component for AI & MCP section
const AIMCPVisualization = () => {
  const dataNodes = [
    { label: "Prompts", color: "#8b5cf6", Icon: AutoAwesomeIcon },
    { label: "Design System", color: "#ec4899", Icon: WidgetsIcon },
    { label: "Governance", color: "#10b981", Icon: ShieldIcon },
    { label: "Components", color: "#f59e0b", Icon: CodeIcon },
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
      {/* Neural network background effect - render first */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: { xs: "300px", md: "400px" },
          height: { xs: "300px", md: "400px" },
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Central AI Brain */}
      <Box
        sx={{
          position: "relative",
          zIndex: 3,
          width: { xs: "130px", md: "170px" },
          height: { xs: "130px", md: "170px" },
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)",
          border: "3px solid rgba(139, 92, 246, 0.4)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3), inset 0 0 0 1px rgba(236, 72, 153, 0.2)",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: "-25px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
            animation: "brainPulse 2.5s ease-in-out infinite",
            zIndex: -1,
          },
          "@keyframes brainPulse": {
            "0%, 100%": {
              transform: "scale(1)",
              opacity: 0.8,
            },
            "50%": {
              transform: "scale(1.15)",
              opacity: 1,
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
            path="/lottie/ai.json"
            loop={true}
            autoplay={true}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
      </Box>

      {/* MCP Hub Layer - positioned between AI and data nodes */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "220px", md: "280px" },
          height: { xs: "220px", md: "280px" },
          borderRadius: "50%",
          border: "2px dashed rgba(100, 149, 237, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          "&::after": {
            content: '""',
            position: "absolute",
            inset: "-10px",
            borderRadius: "50%",
            background: "conic-gradient(from 0deg, rgba(100, 149, 237, 0.1), rgba(236, 72, 153, 0.1), rgba(100, 149, 237, 0.1))",
            animation: "rotateMCP 10s linear infinite",
            zIndex: -1,
          },
          "@keyframes rotateMCP": {
            "0%": {
              transform: "rotate(0deg)",
            },
            "100%": {
              transform: "rotate(360deg)",
            },
          },
        }}
      >
      </Box>

      {/* Data Nodes positioned around the MCP layer */}
      {dataNodes.map((node, index) => {
        const angle = (index * 360) / dataNodes.length - 90;
        const radius = 180;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <Box key={node.label}>
            {/* Bidirectional data stream lines */}
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "3px",
                height: `${radius}px`,
                transformOrigin: "top center",
                transform: `rotate(${angle + 90}deg)`,
                zIndex: 1,
              }}
            >
              {/* Outward flow (AI to node) */}
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(to bottom, ${node.color}60, transparent)`,
                  animation: `flowOut 2.5s ease-in-out infinite`,
                  animationDelay: `${index * 0.6}s`,
                  "@keyframes flowOut": {
                    "0%": {
                      opacity: 0.3,
                      transform: "scaleY(0.5) translateY(0)",
                    },
                    "50%": {
                      opacity: 1,
                      transform: "scaleY(1) translateY(0)",
                    },
                    "100%": {
                      opacity: 0.3,
                      transform: "scaleY(0.5) translateY(0)",
                    },
                  },
                }}
              />

              {/* Data particles flowing */}
              {[0, 1, 2].map((particleIndex) => (
                <Box
                  key={particleIndex}
                  sx={{
                    position: "absolute",
                    left: "50%",
                    top: "0%",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: node.color,
                    transform: "translateX(-50%)",
                    animation: `particleFlow 2.5s ease-in-out infinite`,
                    animationDelay: `${index * 0.6 + particleIndex * 0.8}s`,
                    "@keyframes particleFlow": {
                      "0%": {
                        top: "10%",
                        opacity: 0,
                        transform: "translateX(-50%) scale(0.5)",
                      },
                      "50%": {
                        opacity: 1,
                        transform: "translateX(-50%) scale(1)",
                      },
                      "100%": {
                        top: "90%",
                        opacity: 0,
                        transform: "translateX(-50%) scale(0.5)",
                      },
                    },
                  }}
                />
              ))}
            </Box>

            {/* Data Node */}
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
                  width: { xs: "75px", md: "95px" },
                  height: { xs: "75px", md: "95px" },
                  borderRadius: "16px",
                  backgroundColor: "#ffffff",
                  border: `2px solid ${node.color}50`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  boxShadow: `0 4px 20px ${node.color}30`,
                  animation: `nodeFloat 3s ease-in-out infinite`,
                  animationDelay: `${index * 0.6}s`,
                  transition: "all 0.3s ease",
                  zIndex: 1,
                  "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: `0 6px 28px ${node.color}40`,
                  },
                  "@keyframes nodeFloat": {
                    "0%, 100%": {
                      transform: "translateY(0px)",
                    },
                    "50%": {
                      transform: "translateY(-8px)",
                    },
                  },
                }}
              >
                <node.Icon sx={{ fontSize: { xs: 26, md: 30 }, color: node.color }} />
                <Typography
                  sx={{
                    fontSize: { xs: "0.65rem", md: "0.75rem" },
                    fontWeight: 600,
                    color: "#475569",
                    textAlign: "center",
                  }}
                >
                  {node.label}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default AIMCPVisualization;


