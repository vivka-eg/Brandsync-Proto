"use client";
import {
  Box,
  Button,
  Chip,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { Check, CheckCircle, Copy, X } from "phosphor-react";
import React, { useState } from "react";
import CopyButton from "../../shared/CopyButton";
import { useAccessiblePaletteContext } from "@/context/design-system/AccessiblePaletteContext";
import { hexToHct } from "@/utils/design-system/color-palette";
import { InfoIcon } from "@phosphor-icons/react";

const ComplianceCheck = ({ compliant, text }) => {
  return (
    <Stack direction="row" sx={{ gap: "4px", alignItems: "center" }}>
      {compliant ? (
        <Check size={16} weight="bold" color="#0A7146" />
      ) : (
        <X size={16} weight="bold" color="#AF0506" />
      )}
      <Typography sx={{ fontSize: "12px", color: "text.body" }}>
        {text}
      </Typography>
    </Stack>
  );
};

const ColorComplianceCard = ({ mode, complianceData }) => {
  return (
    <Box
      sx={{
        px: "12px",
        py: "8px",
        borderRadius: "4px",
        backgroundColor: "#F4F5F5",
        border: "1px solid",
        borderColor: "neutral.border",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* 1st card */}
      <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
        <Box
          sx={{
            height: "16px",
            width: "16px",
            borderRadius: "4px",
            border: "1px solid",
            borderColor: mode === "light" ? "neutral.border" : "",
            bgcolor: mode === "light" ? "#FFFFFF" : "#000000",
          }}
        ></Box>
        <Stack sx={{ gap: "4px" }}>
          <Typography
            sx={{ color: "text.caption", fontSize: "12px", lineHeight: "16px" }}
          >
            {mode === "light" ? "White" : "Black"}
          </Typography>
          <Typography
            sx={{
              color: "text.caption",
              fontSize: "12px",
              lineHeight: "16px",
              fontWeight: 500,
            }}
          >
            {complianceData.ratio}:1
          </Typography>
        </Stack>
      </Stack>

      {/* 2nd card */}
      <Stack>
        <ComplianceCheck compliant={complianceData.large.AA} text="Large" />
        <ComplianceCheck compliant={complianceData.body.AA} text="Body" />
      </Stack>

      {/* 3rd card */}
      <Stack>
        <ComplianceCheck compliant={complianceData.large.AAA} text="Large" />
        <ComplianceCheck compliant={complianceData.body.AAA} text="Body" />
      </Stack>
    </Box>
  );
};

function ColorAccessibilityCard({ colorData }) {
  const [copied, setCopied] = useState(false);
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { showSnackbar } = useAccessiblePaletteContext();
  const hctColor = hexToHct(colorData.color);
  const hctPanelData = [
    { label: "Hue", value: `${hctColor.h}°` },
    { label: "Chroma", value: hctColor.c },
    { label: "Tone", value: hctColor.t },
  ];

  // Function to determine if a color is light
  const isLightColor = (hexColor) => {
    // Convert hex to RGB
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return true if luminance is greater than 0.7 (lighter colors)
    return luminance > 0.7;
  };

  const useBlackText = isLightColor(colorData.color);

  const handleCopy = () => {
    navigator.clipboard.writeText(colorData.color);
    setCopied(true);
    setIsAnimating(true);
    showSnackbar(`${colorData.color} copied to clipboard!`, "success");

    setTimeout(() => {
      setCopied(false);
    }, 1000);
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  return (
    <Stack
      sx={{
        // width: "250px",
        height: "auto",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "neutral.border",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isAnimating ? "scale(0.98)" : "scale(1)",
        boxShadow: isAnimating
          ? "0 8px 24px rgba(0, 0, 0, 0.15)"
          : "0 2px 8px rgba(0, 0, 0, 0.08)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      {/* color bg card */}
      <Box
        onClick={handleCopy}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          backgroundColor: colorData.color,
          width: "100%",
          height: "110px",
          borderRadius: "8px 8px 0 0",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            opacity: 0.95,
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "0",
            height: "0",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.5)",
            transform: "translate(-50%, -50%)",
            transition: "width 0.6s, height 0.6s",
          },
          ...(isAnimating && {
            "&::before": {
              width: "300px",
              height: "300px",
            },
          }),
        }}
      >
        {/* Copy icon on hover */}
        {isHovered && !copied && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
              animation: "scaleIn 0.2s ease-out",
              "@keyframes scaleIn": {
                "0%": {
                  transform: "translate(-50%, -50%) scale(0.8)",
                  opacity: 0,
                },
                "100%": {
                  transform: "translate(-50%, -50%) scale(1)",
                  opacity: 1,
                },
              },
            }}
          >
            <Copy size={24} weight="bold" color="white" />
          </Box>
        )}

        {/* Copy indicator overlay */}
        {copied && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              animation: "fadeInOut 1s ease-in-out",
              "@keyframes fadeInOut": {
                "0%": {
                  opacity: 0,
                },
                "50%": {
                  opacity: 1,
                },
                "100%": {
                  opacity: 0,
                },
              },
            }}
          >
            <Stack alignItems="center" gap={1}>
              <Check size={32} weight="bold" color="white" />
              <Typography
                sx={{
                  color: "white",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                Copied!
              </Typography>
            </Stack>
          </Box>
        )}

        {/* Base Palette Badge */}
        {colorData.name?.endsWith("-600") && (
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 1,
            }}
          >
            <Chip
              label="Base"
              sx={{
                bgcolor: useBlackText
                  ? "rgba(0, 0, 0, 0.1)"
                  : "rgba(255, 255, 255, 0.2)",
                color: useBlackText
                  ? "rgba(0, 0, 0, 0.8)"
                  : "rgba(255, 255, 255, 0.9)",
                fontWeight: 600,
                fontSize: "0.75rem",
                height: "28px",
                backdropFilter: "blur(8px)",
                border: useBlackText
                  ? "1px solid rgba(0, 0, 0, 0.1)"
                  : "1px solid rgba(255, 255, 255, 0.3)",
                "& .MuiChip-label": {
                  px: 1.5,
                },
              }}
            />
          </Box>
        )}
      </Box>

      {/* bottom box */}
      <Box sx={{ padding: 2 }}>
        {/* basic info */}
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            gap: 2,
          }}
        >
          {/* name and color copy btn */}
          <Stack>
            <Typography>{colorData.name}</Typography>
            <CopyButton text={colorData.color} copyText={colorData.color} />
            <CopyButton
              text={`H${hctColor.h} C${hctColor.c} T${hctColor.t}`}
              copyText={`H${hctColor.h} C${hctColor.c} T${hctColor.t}`}
              sx={{ color: "text.body" }}
            />
          </Stack>

          {/* compliance chip */}
          <Chip
            label={colorData.overallCompliance}
            size="small"
            sx={{
              backgroundColor: "#D7FFED",
              color: "#0A7146",
              fontWeight: 600,
              height: 24,
              "& .MuiChip-label": {
                px: 1.5,
              },
              fontSize: "12px",
              width: "fit-content",
            }}
            icon={
              <CheckCircle
                size={16}
                weight="bold"
                color={theme.palette.success.main}
              />
            }
          />
        </Stack>

        {/* button for expand info */}
        <Box sx={{ py: "8px" }}>
          <Button
            sx={{
              textTransform: "none",
              fontSize: "14px",
              mt: 2,
              textAlign: "center",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "action.active",
            }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide" : "Show"} Details
          </Button>
        </Box>

        {/* expanded info */}
        {expanded && (
          <Stack sx={{ gap: "8px" }}>
            <Box
              sx={{
                px: "12px",
                py: "8px",
                borderRadius: "4px",
                backgroundColor: "#EDF0FA",
                border: "1px solid",
                borderColor: "#73A9EA",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ gap: 1, width: "100%" }}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    textTransform: "uppercase",
                    color: "text.caption",
                    textAlign: "center",
                  }}
                >
                  HCT Color Space
                </Typography>
                <Tooltip
                  title="HCT (Hue, Chroma, Tone) is a perceptually accurate color space used in Material Design 3."
                >
                  {" "}
                  <InfoIcon color="action.active" />
                </Tooltip>
              </Stack>

              <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                {hctPanelData.map((label, index) => (
                  <Stack key={index}>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        textAlign: "left",
                      }}
                    >
                      {label.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "20px",
                        fontWeight: 500,
                      }}
                    >
                      {label.value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>

            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", flex: 1 }}
            >
              {["background", "aa", "aaa"].map((label, index) => (
                <Typography
                  sx={{
                    fontSize: "12px",
                    textTransform: "uppercase",
                    color: "text.caption",
                    textAlign: "center",
                    width: "33%",
                  }}
                  key={index}
                >
                  {label}
                </Typography>
              ))}
            </Stack>
            <ColorComplianceCard
              mode="light"
              complianceData={colorData.white}
            />
            <ColorComplianceCard mode="dark" complianceData={colorData.black} />
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

export default ColorAccessibilityCard;
