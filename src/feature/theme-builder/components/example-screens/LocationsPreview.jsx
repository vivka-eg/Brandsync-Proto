"use client";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton,
  InputAdornment,
  Tabs,
  Tab,
  Chip,
  Collapse,
  useTheme,
} from "@mui/material";
import {
  MagnifyingGlass,
  SquaresFour,
  MapPin,
  TextAlignLeft,
  File,
  Translate,
  Gear,
  Bell,
  CaretRight,
  CaretDown,
  MapTrifold,
  Buildings,
  Coffee,
  Warehouse,
} from "@phosphor-icons/react";
import Image from "next/image";
import React, { useState } from "react";
import colorPalettes from "brandsync-tokens/themebuilder.json";
import GenericLogo from "./GenericLogo";

function LocationsPreview({
  device = "desktop",
  mode = "light",
  selectedColor,
  firstMatchingLogo,
}) {
  const theme = useTheme();
  const primaryColorPalette =
    colorPalettes[selectedColor]?.shades || colorPalettes["blue"]?.shades;
  const neutralColorPalette = colorPalettes["neutral"].shades;
  const isDarkMode = mode === "dark";
  const primaryColor = isDarkMode
    ? primaryColorPalette[400]
    : primaryColorPalette[600];
  const [activeTab, setActiveTab] = useState(0);
  const [expandedItems, setExpandedItems] = useState({
    denmark: true,
    finland: true,
    lapland: true,
    kemiTornio: true,
  });

  // Location type chips data
  const locationTypes = [
    { Icon: Buildings, label: "Building" },
    { Icon: Coffee, label: "Breaking Room" },
    { Icon: Warehouse, label: "Loading Dock" },
  ];

  // Determine container width based on device
  const getDeviceWidth = () => {
    switch (device) {
      case "mobile":
        return "400px";
      case "tablet":
        return "600px";
      case "desktop":
      default:
        return "100%";
    }
  };

  const isMobile = device === "mobile";
  const isTablet = device === "tablet";
  const showSidebar = device === "desktop";
  const showMap = true;

  const navigationItems = [
    { label: "Dashboard", icon: SquaresFour, active: false },
    { label: "Locations", icon: MapPin, active: true },
    { label: "User Ma...", icon: TextAlignLeft, active: false },
    { label: "Document...", icon: File, active: false },
    { label: "Language", icon: Translate, active: false },
    { label: "Settings", icon: Gear, active: false },
    { label: "Notificati...", icon: Bell, active: false },
  ];

  const toggleExpand = (item) => {
    setExpandedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  return (
    <Box
      sx={{
        width: getDeviceWidth(),
        maxWidth: "1400px",
        margin: "0 auto",
        // bgcolor: mode === "dark" ? "background.default" : "#F5F6FA",
        minHeight: "700px",
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        border: "7px solid",
        borderColor: "neutral.border",
      }}
    >
      {/* Sidebar - Desktop Only */}
      {showSidebar && (
        <Box
          sx={{
            width: "96px",
            bgcolor: isDarkMode ? neutralColorPalette[900] : "#FFFFFF",
            borderRight: "1px solid",
            borderColor: isDarkMode
              ? neutralColorPalette[500]
              : "neutral.border",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 3,
            gap: 2,
          }}
        >
          {/* Logo */}
          <Box sx={{ mb: 2 }}>
            <GenericLogo selectedColor={selectedColor} mode={mode} />
          </Box>

          {/* Navigation Items */}
          <Stack spacing={1.5} sx={{ flex: 1, width: "96px", px: 1 }}>
            {navigationItems.map((item) => (
              <Box
                key={item.label}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.5,
                  py: "8px",
                  borderRadius: "12px",
                  bgcolor: item.active
                    ? isDarkMode
                      ? neutralColorPalette[800]
                      : "#F3F4F6"
                    : "transparent",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: isDarkMode ? neutralColorPalette[800] : "#F9FAFB",
                  },
                }}
              >
                <item.icon
                  size={24}
                  weight={item.active ? "fill" : "regular"}
                  color={isDarkMode ? "#FFFFFF" : theme.palette.icons.muted}
                />
                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: item.active ? 600 : 400,
                    color: isDarkMode
                      ? "#FFFFFF"
                      : item.active
                        ? "text.primary"
                        : "text.secondary",
                    textAlign: "center",
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Stack>

          {/* Language Selector */}
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "8px",
              bgcolor: isDarkMode ? neutralColorPalette[800] : "#F3F4F6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: isDarkMode ? "#FFFFFF" : "text.primary",
              }}
            >
              SL
            </Typography>
          </Box>
        </Box>
      )}

      {/* right side */}
      <Stack width={"100%"}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            bgcolor: isDarkMode ? neutralColorPalette[900] : "#fff",
            width: "100%",
            pt: "16px",
            px: "24px",
            pb: "8px",
            borderBottom: "1px solid",
            borderColor: isDarkMode
              ? neutralColorPalette[500]
              : "neutral.border",
          }}
        >
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 700,
              color: isDarkMode ? "#FFFFFF" : "text.primary",
            }}
          >
            Locations
          </Typography>
        </Box>
        <Stack
          flex={1}
          direction={isMobile || isTablet ? "column" : "row"}
          gap={"24px"}
          px={"24px"}
          sx={{
            bgcolor: isDarkMode ? neutralColorPalette[950] : "transparent",
          }}
        >
          {/* Locations List Panel */}
          <Box
            sx={{
              width: showMap
                ? isMobile || isTablet
                  ? "100%"
                  : "320px"
                : "100%",
              bgcolor: isDarkMode ? neutralColorPalette[900] : "#FFFFFF",
              // borderRight: showMap ? "1px solid" : "none",
              // borderColor: "neutral.border",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 3,
                // borderBottom: "1px solid",
                // borderColor: "neutral.border",
              }}
            >
              {/* Search */}
              <TextField
                fullWidth
                placeholder="Search"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MagnifyingGlass
                        size={20}
                        color={
                          isDarkMode ? neutralColorPalette[400] : "#9CA3AF"
                        }
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    // bgcolor: isDarkMode ? neutralColorPalette[800] : "#F9FAFB",
                    "& fieldset": {
                      borderColor: isDarkMode
                        ? neutralColorPalette[700]
                        : neutralColorPalette[200],
                    },
                    "&:not(.Mui-focused):hover fieldset": {
                      borderColor: primaryColor,
                      borderWidth: "1.5px",
                    },
                    color: isDarkMode ? "#FFFFFF" : "text.primary",
                  },
                }}
              />

              {/* Tabs */}
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                sx={{
                  px: 3,
                  minHeight: "48px",
                  width: "100%",
                  borderBottom: "1px solid",
                  borderColor: "neutral.border",

                  "& .MuiTab-root": {
                    width: "50%",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "14px",
                    minHeight: "48px",
                    color: "text.secondary",

                    "&.Mui-selected": {
                      color: primaryColor,
                    },

                    "&:hover": {
                      color: primaryColor,
                    },
                  },

                  "& .MuiTabs-indicator": {
                    bgcolor: primaryColor,
                    height: "3px",
                  },
                }}
              >
                <Tab label="Active" />
                <Tab label="Archived" />
              </Tabs>
            </Box>

            {/* Locations List */}
            <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
              <Stack spacing={1}>
                {/* Norway */}
                <Box
                  sx={{
                    py: "13.5px",
                    px: 2,
                    borderRadius: "8px",
                    "&:hover": {
                      bgcolor: isDarkMode
                        ? neutralColorPalette[800]
                        : "#F9FAFB",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: isDarkMode ? "#FFFFFF" : "text.primary",
                    }}
                  >
                    Norway
                  </Typography>
                </Box>

                {/* Sweden */}
                <Box
                  sx={{
                    py: "13.5px",
                    px: 2,
                    borderRadius: "8px",
                    "&:hover": {
                      bgcolor: isDarkMode
                        ? neutralColorPalette[800]
                        : "#F9FAFB",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: isDarkMode ? "#FFFFFF" : "text.primary",
                    }}
                  >
                    Sweden
                  </Typography>
                </Box>

                {/* Denmark */}
                <Box>
                  <Box
                    onClick={() => toggleExpand("denmark")}
                    sx={{
                      py: "13.5px",
                      px: 2,
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: isDarkMode
                          ? neutralColorPalette[800]
                          : "#F9FAFB",
                      },
                    }}
                  >
                    {expandedItems.denmark ? (
                      <CaretDown
                        size={16}
                        weight="bold"
                        color={isDarkMode ? "#FFFFFF" : undefined}
                      />
                    ) : (
                      <CaretRight
                        size={16}
                        weight="bold"
                        color={isDarkMode ? "#FFFFFF" : undefined}
                      />
                    )}
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: isDarkMode ? "#FFFFFF" : "text.primary",
                      }}
                    >
                      Denmark
                    </Typography>
                  </Box>
                  <Collapse in={expandedItems.denmark}>
                    <Box sx={{ pl: 4, py: 0.5 }}>
                      <Box
                        sx={{
                          py: "13.5px",
                          px: 2,
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: isDarkMode
                              ? neutralColorPalette[800]
                              : "#F9FAFB",
                          },
                        }}
                      >
                      
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 400,
                            color: isDarkMode ? "#FFFFFF" : "text.primary",
                          }}
                        >
                          Hovedstaden
                        </Typography>
                      </Box>
                    </Box>
                  </Collapse>
                </Box>

                {/* Spain */}
                <Box
                  sx={{
                    py: "13.5px",
                    px: 2,
                    borderRadius: "8px",
                    "&:hover": {
                      bgcolor: isDarkMode
                        ? neutralColorPalette[800]
                        : "#F9FAFB",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: isDarkMode ? "#FFFFFF" : "text.primary",
                    }}
                  >
                    Spain
                  </Typography>
                </Box>

                {/* Finland */}
                <Box>
                  <Box
                    onClick={() => toggleExpand("finland")}
                    sx={{
                      py: "13.5px",
                      px: 2,
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: isDarkMode
                          ? neutralColorPalette[800]
                          : "#F9FAFB",
                      },
                    }}
                  >
                    {expandedItems.finland ? (
                      <CaretDown
                        size={16}
                        weight="bold"
                        color={isDarkMode ? "#FFFFFF" : undefined}
                      />
                    ) : (
                      <CaretRight
                        size={16}
                        weight="bold"
                        color={isDarkMode ? "#FFFFFF" : undefined}
                      />
                    )}
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: isDarkMode ? "#FFFFFF" : "text.primary",
                      }}
                    >
                      Finland
                    </Typography>
                  </Box>
                  <Collapse in={expandedItems.finland}>
                    <Box sx={{ pl: 4 }}>
                      {/* Lapland */}
                      <Box>
                        <Box
                          onClick={() => toggleExpand("lapland")}
                          sx={{
                            py: "13.5px",
                            px: 2,
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            cursor: "pointer",
                            "&:hover": {
                              bgcolor: isDarkMode
                                ? neutralColorPalette[800]
                                : "#F9FAFB",
                            },
                          }}
                        >
                          {expandedItems.lapland ? (
                            <CaretDown
                              size={16}
                              weight="bold"
                              color={isDarkMode ? "#FFFFFF" : undefined}
                            />
                          ) : (
                            <CaretRight
                              size={16}
                              weight="bold"
                              color={isDarkMode ? "#FFFFFF" : undefined}
                            />
                          )}
                          <Typography
                            sx={{
                              fontSize: "14px",
                              fontWeight: 400,
                              color: isDarkMode ? "#FFFFFF" : "text.primary",
                            }}
                          >
                            Lapland
                          </Typography>
                        </Box>
                        <Collapse in={expandedItems.lapland}>
                          <Box sx={{ pl: 4 }}>
                            {/* Kemi-Tornio sub-region */}
                            <Box>
                              <Box
                                onClick={() => toggleExpand("kemiTornio")}
                                sx={{
                                  py: "13.5px",
                                  px: 2,
                                  borderRadius: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px",
                                  cursor: "pointer",
                                  "&:hover": {
                                    bgcolor: isDarkMode
                                      ? neutralColorPalette[800]
                                      : "#F9FAFB",
                                  },
                                }}
                              >
                                {expandedItems.kemiTornio ? (
                                  <CaretDown
                                    size={16}
                                    weight="bold"
                                    color={isDarkMode ? "#FFFFFF" : undefined}
                                  />
                                ) : (
                                  <CaretRight
                                    size={16}
                                    weight="bold"
                                    color={isDarkMode ? "#FFFFFF" : undefined}
                                  />
                                )}
                                <Typography
                                  sx={{
                                    fontSize: "14px",
                                    fontWeight: 400,
                                    color: isDarkMode
                                      ? "#FFFFFF"
                                      : "text.primary",
                                  }}
                                >
                                  Kemi-Tornio sub-region
                                </Typography>
                              </Box>
                              <Collapse in={expandedItems.kemiTornio}>
                                <Box sx={{ pl: 4 }}>
                                  <Box
                                    sx={{
                                      py: "13.5px",
                                      px: 2,
                                      borderRadius: "8px",
                                      "&:hover": {
                                        bgcolor: isDarkMode
                                          ? neutralColorPalette[800]
                                          : "#F9FAFB",
                                      },
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "14px",
                                        fontWeight: 400,
                                        color: isDarkMode
                                          ? "#FFFFFF"
                                          : "text.primary",
                                      }}
                                    >
                                      Kemi
                                    </Typography>
                                  </Box>
                                  <Box
                                    sx={{
                                      py: "13.5px",
                                      px: 2,
                                      borderRadius: "8px",
                                      "&:hover": {
                                        bgcolor: isDarkMode
                                          ? neutralColorPalette[800]
                                          : "#F9FAFB",
                                      },
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "14px",
                                        fontWeight: 400,
                                        color: isDarkMode
                                          ? "#FFFFFF"
                                          : "text.primary",
                                      }}
                                    >
                                      Keminmaa
                                    </Typography>
                                  </Box>
                                </Box>
                              </Collapse>
                            </Box>
                          </Box>
                        </Collapse>
                      </Box>
                    </Box>
                  </Collapse>
                </Box>
              </Stack>
            </Box>

            {/* Add Location Button */}
            <Box
              sx={{
                p: 3,
                // borderTop: "1px solid",
                // borderColor: "neutral.border",
              }}
            >
              <Button
                fullWidth
                variant="contained"
                disableRipple
                disableFocusRipple
                startIcon={<MapPin size={20} weight="fill" />}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  borderRadius: "8px",
                  py: "13.5px",
                  bgcolor: isDarkMode
                    ? primaryColorPalette[500]
                    : primaryColor || "primary.main",
                  color: isDarkMode ? "text.primary" : "#FFFFFF",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                  "&:hover": {
                    bgcolor: isDarkMode
                      ? primaryColorPalette[300]
                      : primaryColorPalette[700],
                    boxShadow: "none",
                  },

                  "&:active": {
                    bgcolor: isDarkMode
                      ? primaryColorPalette[200]
                      : primaryColorPalette[800],
                    boxShadow: "none",
                  },

                  "&:focus-visible": {
                    bgcolor: isDarkMode
                      ? primaryColorPalette[300]
                      : primaryColorPalette[700],
                    boxShadow: "none",
                  },
                }}
              >
                Add location
              </Button>
            </Box>
          </Box>

          {/* Map Panel */}
          {showMap && (
            <Stack
              flex={1}
              gap={"12px"}
              pb={"16px"}
              minHeight={isMobile || isTablet ? "400px" : "auto"}
            >
              <Box
                sx={{
                  flex: 1,
                  minHeight: isMobile ? "350px" : isTablet ? "450px" : "auto",
                  position: "relative",
                  bgcolor: isDarkMode ? neutralColorPalette[800] : "#C5E3F6",
                }}
              >
                {/* Map/Satellite Toggle */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    zIndex: 10,
                    bgcolor: isDarkMode ? neutralColorPalette[900] : "#FFFFFF",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                  }}
                >
                  <Button
                    sx={{
                      textTransform: "none",
                      px: 3,
                      py: 1,
                      bgcolor: isDarkMode
                        ? neutralColorPalette[800]
                        : "#FFFFFF",
                      color: isDarkMode ? "#FFFFFF" : "text.primary",
                      fontWeight: 600,
                      borderRadius: 0,
                      "&:hover": {
                        bgcolor: isDarkMode
                          ? neutralColorPalette[700]
                          : "#F9FAFB",
                      },
                    }}
                  >
                    Map
                  </Button>
                  <Button
                    sx={{
                      textTransform: "none",
                      px: 3,
                      py: 1,
                      bgcolor: isDarkMode
                        ? neutralColorPalette[900]
                        : "#F3F4F6",
                      color: isDarkMode
                        ? neutralColorPalette[400]
                        : "text.secondary",
                      fontWeight: 500,
                      borderRadius: 0,
                      "&:hover": {
                        bgcolor: isDarkMode
                          ? neutralColorPalette[800]
                          : "#E5E7EB",
                      },
                    }}
                  >
                    Satellite
                  </Button>
                </Box>

                {/* Map Image */}
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url('/theme-builder/example-screens/map.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                  }}
                >
                  {/* Fallback map visualization */}
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      bgcolor: "#B8D9ED",
                      backgroundImage: `
                  linear-gradient(to bottom, #C5E3F6 0%, #9AC9E3 50%, #B8D9ED 100%)
                `,
                    }}
                  >
                    {/* Simple map representation */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: "20%",
                        right: "25%",
                        width: "40%",
                        height: "60%",
                        bgcolor: "#D4E5B9",
                        clipPath:
                          "polygon(30% 10%, 60% 5%, 75% 20%, 80% 40%, 70% 60%, 50% 80%, 30% 75%, 15% 60%, 10% 35%, 20% 20%)",
                        border: "2px solid #A8C686",
                      }}
                    >
                      {/* Country labels */}
                      <Typography
                        sx={{
                          position: "absolute",
                          top: "30%",
                          left: "35%",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#4A5568",
                          textTransform: "uppercase",
                        }}
                      >
                        NORWAY
                      </Typography>
                      <Typography
                        sx={{
                          position: "absolute",
                          top: "40%",
                          right: "25%",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#4A5568",
                          textTransform: "uppercase",
                        }}
                      >
                        SWEDEN
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Location Type Filters */}
              <Box
                sx={{
                  bgcolor: isDarkMode ? neutralColorPalette[900] : "#F3F4F6",
                  borderRadius: "12px",
                  p: 2,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  gap: 2,
                  flexDirection: isMobile ? "column" : "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                  // maxWidth: "90%",
                }}
              >
                <Stack
                  direction={"row"}
                  spacing={1}
                  justifyContent="center"
                  width={"100%"}
                  flexWrap={"wrap"}
                >
                  {locationTypes.map(({ Icon, label }, index) => (
                    <Chip
                      key={index}
                      icon={<Icon size={24} />}
                      label={label}
                      sx={{
                        bgcolor: "transparent",
                        p: "12px",
                        color: isDarkMode ? "#FFFFFF" : "text.primary",
                        fontWeight: 500,
                        "& .MuiChip-icon": {
                          color: isDarkMode ? "#FFFFFF" : "text.primary",
                        },
                      }}
                    />
                  ))}
                </Stack>
                <Button
                  endIcon={<CaretDown size={16} weight="bold" />}
                  sx={{
                    textTransform: "none",
                    color: isDarkMode ? "#FFFFFF" : "text.primary",
                    fontWeight: 500,
                    fontSize: "13px",
                    width: "100%",
                    border: "2px solid",
                    borderColor: isDarkMode
                      ? neutralColorPalette[800]
                      : neutralColorPalette[100],
                  }}
                >
                  More location types
                </Button>
              </Box>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

export default LocationsPreview;
