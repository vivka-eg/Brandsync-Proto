"use client";
import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Collapse,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  CheckCircle,
  Check,
  X,
  CaretDown,
  CaretUp,
  ArrowsDownUp,
  Copy,
} from "@phosphor-icons/react";
import { useAccessiblePaletteContext } from "@/context/design-system/AccessiblePaletteContext";

function ColorRow({ colorData, index, animationDelay = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isColorHovered, setIsColorHovered] = useState(false);
  const { showSnackbar } = useAccessiblePaletteContext();

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

  const useBlackText = isLightColor(colorData.color);

  const handleColorClick = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(colorData.color);
    setCopied(true);
    showSnackbar(`${colorData.color} copied to clipboard!`, "success");
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const getComplianceStyles = (compliance) => {
    if (compliance === "AAA" || compliance === "AA") {
      return {
        backgroundColor: "#D7FFED",
        color: "#0A7146",
        iconColor: "#0A7146",
      };
    }
    return {
      backgroundColor: "grey.200",
      color: "text.primary",
      iconColor: "text.primary",
    };
  };

  const complianceStyles = getComplianceStyles(colorData.overallCompliance);
  const rowBgColor = index % 2 === 0 ? "#FFFFFF" : "#FBFBFB";

  const backgroundSections = [
    {
      type: "white",
      label: "White",
      color: "#FFFFFF",
      data: colorData.white,
    },
    {
      type: "black",
      label: "Black",
      color: "#000000",
      data: colorData.black,
    },
  ];

  const complianceColumns = ["AA", "AAA"];
  const textSizes = [
    { key: "large", label: "Large" },
    { key: "body", label: "Body" },
  ];

  return (
    <>
      <TableRow
        sx={{
          cursor: "pointer",
          height: 72,
          "&:hover .color-info": { backgroundColor: "neutral.containerHovered" },
          "& td": {
            borderBottom: "none",
            padding: "0 !important",
            height: 72,
          },
          animation: "fadeInSlide 0.4s ease-out forwards",
          animationDelay: `${animationDelay}s`,
          opacity: 0,
          "@keyframes fadeInSlide": {
            "0%": {
              opacity: 0,
              transform: "translateX(-20px)",
            },
            "100%": {
              opacity: 1,
              transform: "translateX(0)",
            },
          },
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <TableCell colSpan={5} sx={{ p: "0 !important", height: 72 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "stretch",
              height: 72,
              borderBottom: expanded ? "none" : "1px solid",
              borderColor: "divider",
            }}
          >
            {/* Color Column */}
            <Box
              onClick={(e) => {
                e.stopPropagation();
                handleColorClick(e);
              }}
              onMouseEnter={() => setIsColorHovered(true)}
              onMouseLeave={() => setIsColorHovered(false)}
              sx={{
                width: 240,
                height: 72,
                backgroundColor: colorData.color,
                flexShrink: 0,
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  opacity: 0.9,
                  transform: "scale(1.02)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "0",
                  height: "0",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.4)",
                  transform: "translate(-50%, -50%)",
                  transition: "width 0.5s, height 0.5s",
                },
                ...(copied && {
                  "&::before": {
                    width: "300px",
                    height: "300px",
                  },
                }),
              }}
            >
              {/* Copy icon on hover */}
              {isColorHovered && !copied && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
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
                  <Copy size={20} weight="bold" color="white" />
                </Box>
              )}

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
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    animation: "fadeInOut 1s ease-in-out",
                    "@keyframes fadeInOut": {
                      "0%": { opacity: 0 },
                      "50%": { opacity: 1 },
                      "100%": { opacity: 0 },
                    },
                  }}
                >
                  <Check size={24} weight="bold" color="white" />
                </Box>
              )}

              {/* Base Palette Badge */}
              {colorData.name?.endsWith("-600") && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    zIndex: 1,
                  }}
                >
                  <Chip
                    label="Base"
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
            </Box>

            {/* Info Columns */}
            <Box
              className="color-info"
              sx={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                height: 72,
                backgroundColor: rowBgColor,
              }}
            >
              <Box sx={{ width: 214, px: 2 }}>
                <Typography variant="body1" fontWeight={400}>
                  {colorData.name}
                </Typography>
              </Box>

              <Box sx={{ width: 214, px: 2, textAlign: "center" }}>
                <Typography variant="body1" fontWeight={400}>
                  {colorData.color.toUpperCase()}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 214,
                  px: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Chip
                  label={colorData.overallCompliance}
                  size="small"
                  sx={{
                    backgroundColor: complianceStyles.backgroundColor,
                    color: complianceStyles.color,
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
                      color={complianceStyles.iconColor}
                    />
                  }
                />
              </Box>
              <Box
                sx={{
                  width: 149,
                  display: "flex",
                  justifyContent: "flex-end",
                  pr: 2,
                }}
              >
                <IconButton size="small">
                  {expanded ? (
                    <CaretUp size={20} weight="bold" />
                  ) : (
                    <CaretDown size={20} weight="bold" />
                  )}
                </IconButton>
              </Box>
            </Box>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          sx={{
            py: 0,
            px: 0,
            borderBottom: expanded ? "1px solid" : "none",
            borderColor: "divider",
          }}
          colSpan={5}
        >
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ p: 3, backgroundColor: "#FFFFFF", width: "100%" }}>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ mb: 3, color: "text.primary", fontSize: "0.875rem" }}
              >
                Detailed WCAG Compliance
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 2, sm: 6 }} sx={{ width: "100%" }}>
                {backgroundSections.map((section) => (
                  <Box key={section.type} sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={4} sx={{ mb: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.75rem",
                          fontWeight: 400,
                          color: "#636970",
                          display: "block",
                          letterSpacing: "0.5px",
                          width: 120,
                        }}
                      >
                        BACKGROUND
                      </Typography>
                      {complianceColumns.map((column) => (
                        <Typography
                          key={column}
                          variant="caption"
                          sx={{
                            fontSize: "0.75rem",
                            fontWeight: 400,
                            color: "#636970",
                            display: "block",
                            letterSpacing: "0.5px",
                            flex: 1,
                            textAlign: "center",
                          }}
                        >
                          {column}
                        </Typography>
                      ))}
                    </Stack>
                    <Box
                      sx={{
                        backgroundColor: "#F4F5F5",
                        padding: "12px 16px",
                        borderRadius: 1,
                        display: "flex",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={0}
                        sx={{ width: "100%", alignItems: "center" }}
                      >
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          sx={{ width: 120 }}
                        >
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              backgroundColor: section.color,
                              border: 1,
                              borderColor: "divider",
                              borderRadius: 0.5,
                            }}
                          />
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: "0.75rem",
                                color: "#636970",
                                display: "block",
                                mb: 0.5,
                              }}
                            >
                              {section.label}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "0.875rem",
                                fontWeight: 400,
                                color: "#636970",
                              }}
                            >
                              {section.data.ratio.toFixed(1)}:1
                            </Typography>
                          </Box>
                        </Stack>

                        {complianceColumns.map((column) => (
                          <Box
                            key={column}
                            sx={{
                              flex: 1,
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Stack spacing={1.5}>
                              {textSizes.map((size) => (
                                <Stack
                                  key={size.key}
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >
                                  {section.data[size.key][column] ? (
                                    <Check
                                      size={18}
                                      color="#4ADE80"
                                      weight="bold"
                                    />
                                  ) : (
                                    <X
                                      size={18}
                                      color="#F87171"
                                      weight="bold"
                                    />
                                  )}
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontSize: "0.875rem",
                                      color: "#636970",
                                    }}
                                  >
                                    {size.label}
                                  </Typography>
                                </Stack>
                              ))}
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function ListView({ colorPalette }) {
  const [sortOrder, setSortOrder] = useState("dark-to-light"); // 'dark-to-light' or 'light-to-dark'
  const [animationKey, setAnimationKey] = useState(0);

  // Trigger animation when colorPalette changes
  React.useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [colorPalette]);

  // Function to get lightness value from hex color
  const getLightness = (hex) => {
    // Remove # if present
    hex = hex.replace("#", "");

    // Convert hex to RGB
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Calculate lightness (HSL formula)
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const lightness = (max + min) / 2;

    return lightness;
  };

  const handleSort = (e) => {
    e.stopPropagation();
    setSortOrder(sortOrder === "dark-to-light" ? "light-to-dark" : "dark-to-light");
  };

  const sortedColorPalette = React.useMemo(() => {
    return [...colorPalette].sort((a, b) => {
      const lightnessA = getLightness(a.color);
      const lightnessB = getLightness(b.color);

      // Sort by lightness only
      if (sortOrder === "dark-to-light") {
        return lightnessA - lightnessB; // Dark to light (top to bottom)
      } else {
        return lightnessB - lightnessA; // Light to dark (bottom to top)
      }
    });
  }, [colorPalette, sortOrder]);

  return (
    <Box>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: "auto",
          width: "100%",
        }}
      >
        <Table
          sx={{
            tableLayout: "fixed",
            borderCollapse: "collapse",
            minWidth: 1031, 
          }}
        >
          <TableHead sx={{ borderBottom: "1px solid" }}>
            <TableRow
              sx={{
                backgroundColor: "#FFFFFF",
                justifyContent: "space-between",
              }}
            >
              <TableCell
                sx={{
                  p: "12px",
                  borderColor: "divider",
                  width: 240,
                  height: 72,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "neutral.containerHovered",
                  },
                }}
                onClick={handleSort}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    color="text.primary"
                  >
                    Color
                  </Typography>
                  <ArrowsDownUp size={16} weight="bold" color="#636970" />
                </Stack>
              </TableCell>
              <TableCell
                sx={{
                  p: "12px",
                  borderColor: "divider",
                  width: 214,
                  height: 72,
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight={500}
                  color="text.primary"
                >
                  Name
                </Typography>
              </TableCell>
              <TableCell
                sx={{
                  p: "12px",
                  borderColor: "divider",
                  width: 214,
                  height: 72,
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight={500}
                  color="text.primary"
                  textAlign={"center"}
                >
                  Hex Code
                </Typography>
              </TableCell>
              <TableCell sx={{ p: "12px", borderColor: "divider" }}>
                <Typography
                  variant="body1"
                  fontWeight={500}
                  color="text.primary"
                  textAlign={"center"}
                >
                  WCAG Compliance
                </Typography>
              </TableCell>
              <TableCell
                sx={{
                  p: "12px",
                  borderColor: "divider",
                  width: 149,
                  height: 72,
                }}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedColorPalette.map((colorData, index) => (
              <ColorRow
                key={`${colorData.name}-${animationKey}`}
                colorData={colorData}
                index={index}
                animationDelay={index * 0.06}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ListView;
