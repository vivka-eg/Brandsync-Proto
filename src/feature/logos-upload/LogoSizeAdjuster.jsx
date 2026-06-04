"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Slider,
  Tabs,
  Tab,
  Divider,
  Switch,
  FormControlLabel,
  Stack,
} from "@mui/material";
import { motion } from "motion/react";
import { BatteryFull } from "phosphor-react";
import { StatusBar } from "@/feature/logos/components/SplashScreenMockup";
import { MenuBook, AccessibilityNew, ChevronLeft } from "@mui/icons-material";

// Home Indicator
const HomeIndicator = ({ dark = false }) => (
  <Box
    sx={{
      position: "absolute",
      bottom: 8,
      left: "50%",
      transform: "translateX(-50%)",
      width: "100px",
      height: "4px",
      bgcolor: dark ? "#D1D5DB" : "rgba(255, 255, 255, 0.5)",
      borderRadius: "2px",
    }}
  />
);

// Size Control Panel Component
function SizeControlPanel({ size, onSizeChange, label }) {
  const [useAutoWidth, setUseAutoWidth] = useState(
    size.width === "auto" || !size.width,
  );

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "#F9FAFB",
        borderRadius: 2,
        border: "1px solid #E5E7EB",
        minWidth: 200,
      }}
    >
      <Typography
        variant="caption"
        fontWeight={600}
        color="text.secondary"
        mb={1.5}
        display="block"
      >
        {label}
      </Typography>

      {/* Height */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Height: {size.height || 60}px
        </Typography>
        <Slider
          value={Number(size.height) || 60}
          onChange={(e, v) => onSizeChange({ ...size, height: v })}
          min={20}
          max={180}
          size="small"
          sx={{ color: "#111", py: 1 }}
        />
      </Box>

      {/* Width Toggle */}
      <FormControlLabel
        control={
          <Switch
            checked={useAutoWidth}
            onChange={(e) => {
              setUseAutoWidth(e.target.checked);
              onSizeChange({ ...size, width: e.target.checked ? "auto" : 100 });
            }}
            size="small"
          />
        }
        label={<Typography variant="caption">Auto width</Typography>}
        sx={{ mb: 1 }}
      />

      {!useAutoWidth && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Width: {size.width || 100}px
          </Typography>
          <Slider
            value={Number(size.width) || 100}
            onChange={(e, v) => onSizeChange({ ...size, width: v })}
            min={50}
            max={200}
            size="small"
            sx={{ color: "#111", py: 1 }}
          />
        </Box>
      )}

      {/* Margin Left */}
      <Box>
        <Typography variant="caption" color="text.secondary">
          Left Offset: {size.marginLeft || 0}px
        </Typography>
        <Slider
          value={Number(size.marginLeft) || 0}
          onChange={(e, v) => onSizeChange({ ...size, marginLeft: v })}
          min={0}
          max={80}
          size="small"
          sx={{ color: "#111", py: 1 }}
        />
      </Box>
    </Box>
  );
}

// Phone Frame Component
function PhoneFrame({ children, brandColor, variant = "brand" }) {
  const getBgStyle = () => {
    switch (variant) {
      case "brand":
        return { bgcolor: brandColor || "#2563EB" };
      case "light":
        return { bgcolor: "white" };
      case "image":
        return {
          bgcolor: "#B4B4B4",
          backgroundImage:
            'url("https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 1,
          },
        };
      default:
        return { bgcolor: brandColor || "#2563EB" };
    }
  };

  return (
    <Box
      sx={{
        width: "220px",
        height: "450px",
        borderRadius: "10px",
        border: "8px solid #E5E7EB",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        ...getBgStyle(),
      }}
    >
      <StatusBar
        dark={variant === "light"}
        color={variant === "light" ? "#000" : "#fff"}
      />
      <Box sx={{ position: "relative", zIndex: 2 }}>{children}</Box>
      <HomeIndicator dark={variant === "light"} />
    </Box>
  );
}

// Navigation Header Mockup (Desktop)
function NavigationHeaderMockup({ logo, size }) {
  console.log(size);

  return (
    <Box
      sx={{
        borderTop: "10px solid #E5E7EB",
        borderLeft: "10px solid #E5E7EB",
        borderRight: "10px solid #E5E7EB",
        borderRadius: "24px 24px 0 0",
        overflow: "hidden",
        width: "100%",
        maxWidth: 600,
      }}
    >
      {/* Navigation Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
          bgcolor: "white",
        }}
      >
        {/* Left side - Logo and nav links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Box
            sx={{
              width: size.width === "auto" ? "auto" : Number(size.width),
              height: Number(size.height) || 32,
              marginLeft: size.marginLeft ? `${size.marginLeft}px` : 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {logo ? (
              <img
                src={logo.url}
                alt="Logo"
                style={{
                  width: size.width === "auto" ? "auto" : "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 120,
                  height: "100%",
                  bgcolor: "#E5E7EB",
                  borderRadius: 1,
                }}
              />
            )}
          </Box>

          {/* Nav links */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {["Home", "About", "Statistics", "Pricing"].map((item) => (
              <Typography
                key={item}
                variant="body2"
                sx={{ color: "#6B7280", fontWeight: 500 }}
              >
                {item}
              </Typography>
            ))}
          </Box>
        </Box>

        {/* Right side - Avatar */}
        <Box
          sx={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            bgcolor: "#E5E7EB",
          }}
        />
      </Box>

      {/* Content Area Below */}
      <Box sx={{ mt: 2, display: "flex", gap: 2, px: 2 }}>
        <Box
          sx={{
            flex: 1,
            height: "100px",
            bgcolor: "#E5E7EB",
            borderRadius: "8px 8px 0 0",
          }}
        />
        <Box
          sx={{
            width: "150px",
            height: "100px",
            bgcolor: "#E5E7EB",
            borderRadius: "8px 8px 0 0",
          }}
        />
      </Box>
    </Box>
  );
}

// Navigation Drawer Mockup (Desktop)
function NavigationDrawerMockup({ logo, size, iconLogo }) {
  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: "12px",
        border: "1px solid #E5E7EB",
        p: 3,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: 500,
      }}
    >
      <Box sx={{ display: "flex", gap: 2, height: "250px" }}>
        {/* Sidebar - Expanded */}
        <Box
          sx={{
            width: "200px",
            bgcolor: "#F9FAFB",
            borderRadius: "8px",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: size.width === "auto" ? "auto" : Number(size.width),
                height: Number(size.height) || 36,
                marginLeft: size.marginLeft ? `${size.marginLeft}px` : 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {logo ? (
                <img
                  src={logo.url}
                  alt="Logo"
                  style={{
                    width: size.width === "auto" ? "auto" : "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 120,
                    height: "100%",
                    bgcolor: "#E5E7EB",
                    borderRadius: 1,
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Menu Items */}
          <Stack spacing={0.5}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                borderRadius: "6px",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ fontSize: "0.95rem" }}
              >
                Design System
              </Typography>
              <ChevronLeft sx={{ fontSize: 20, color: "#6B7280" }} />
            </Box>
            <Stack spacing={0.5} sx={{ pl: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1,
                  borderRadius: "6px",
                }}
              >
                <MenuBook sx={{ fontSize: 18, color: "#6B7280" }} />
                <Typography
                  variant="body2"
                  sx={{ color: "#6B7280", fontSize: "0.875rem" }}
                >
                  Introduction
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1,
                  borderRadius: "6px",
                }}
              >
                <AccessibilityNew sx={{ fontSize: 18, color: "#6B7280" }} />
                <Typography
                  variant="body2"
                  sx={{ color: "#6B7280", fontSize: "0.875rem" }}
                >
                  Accessibility
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>

        {/* Sidebar - Collapsed (Icon only) */}
        <Box
          sx={{
            width: "60px",
            bgcolor: "#F9FAFB",
            borderRadius: "8px",
            p: 1.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Icon Logo */}
          <Box
            sx={{
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {iconLogo ? (
              <img
                src={iconLogo.url}
                alt="Icon"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  bgcolor: "#E5E7EB",
                  borderRadius: 1,
                }}
              />
            )}
          </Box>

          {/* Icon Menu Items */}
          <MenuBook sx={{ fontSize: 20, color: "#6B7280" }} />
          <AccessibilityNew sx={{ fontSize: 20, color: "#6B7280" }} />
        </Box>

        {/* Content Area */}
        <Box sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" fontWeight={600} mb={1}>
            Dashboard
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: "120px",
              bgcolor: "#F3F4F6",
              borderRadius: "8px",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

function LogoSizeAdjuster({
  logoVariants,
  logoSizes,
  onSizeChange,
  logoName,
  colorPalette,
  sidebarLogo,
}) {
  // const [selectedVariant, setSelectedVariant] = useState("dark");

  // Current variant controls which logos are displayed (for preview)
  // const currentVariant = logoVariants[selectedVariant];

  // Get brand color from palette
  const getBrandColor = () => {
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
    return colors[colorPalette] || "#2563EB";
  };

  const brandColor = getBrandColor();

  return (
    <Box>
        {/* <Divider sx={{ mb: 4 }} /> */}
      {/* Variant Selector - controls which logos are previewed */}
      {/* <Box sx={{ mb: 3 }}> */}
        {/* <Typography variant="h6" fontWeight={600} mb={1}>
          Preview Variant
        </Typography> */}
        {/* <Typography
         variant="body2" color="text.secondary" mb={3}
        >
          Size adjustments apply to all variants universally.
        </Typography> */}
        {/* <Tabs
          value={selectedVariant}
          onChange={(e, v) => setSelectedVariant(v)}
          sx={{
            minHeight: 36,
            "& .MuiTab-root": {
              minHeight: 36,
              textTransform: "none",
              fontSize: "0.875rem",
            },
          }}
        >
          <Tab label="Light (White Text)" value="light" />
          <Tab label="Dark (With Stroke)" value="dark" />
          <Tab label="Negative" value="negative" />
        </Tabs> */}
      {/* </Box> */}

      <Divider sx={{ mb: 4 }} />

      {/* Navigation Header Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" fontWeight={600} mb={3}>
          Navigation Header
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <NavigationHeaderMockup
            logo={logoVariants.dark.horizontal}
            size={logoSizes.headerSize}
          />
          <SizeControlPanel
            label="Header Logo Size"
            size={logoSizes.headerSize}
            onSizeChange={(newSize) => onSizeChange("header", newSize)}
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Navigation Drawer Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" fontWeight={600} mb={3}>
          Navigation Drawer
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <NavigationDrawerMockup
            logo={logoVariants.dark.horizontal}
            size={logoSizes.drawerSize}
            iconLogo={sidebarLogo}
          />
          <SizeControlPanel
            label="Drawer Logo Size"
            size={logoSizes.drawerSize}
            onSizeChange={(newSize) => onSizeChange("drawer", newSize)}
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Splash Screen Section */}
      <Box>
        <Typography variant="h6" fontWeight={600} mb={3}>
          Splash Screen
        </Typography>

        {/* Row 1: Horizontal logos */}
        <Typography variant="subtitle2" color="text.secondary" mb={2}>
          Horizontal Logo
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "flex-start",
            flexWrap: "wrap",
            mb: 4,
          }}
        >
          <Stack direction="row" spacing={3}>
            {/* Brand color background */}
            <PhoneFrame brandColor={brandColor} variant="brand">
              {logoVariants.light.horizontal ? (
                <img
                  src={logoVariants.light.horizontal.url}
                  alt="Logo"
                  style={{
                    width:
                      logoSizes.splashHorizontalSize.width === "auto"
                        ? "auto"
                        : `${logoSizes.splashHorizontalSize.width || 190}px`,
                    height: `${logoSizes.splashHorizontalSize.height || 90}px`,
                    marginLeft: `${
                      logoSizes.splashHorizontalSize.marginLeft || 0
                    }px`,
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 150,
                    height: 60,
                    bgcolor: "rgba(255,255,255,0.3)",
                    borderRadius: 1,
                  }}
                />
              )}
            </PhoneFrame>

            {/* Light background */}
            <PhoneFrame variant="light">
              {logoVariants.dark.horizontal ? (
                <img
                  src={logoVariants.dark.horizontal.url}
                  alt="Logo"
                  style={{
                    width:
                      logoSizes.splashHorizontalSize.width === "auto"
                        ? "auto"
                        : `${logoSizes.splashHorizontalSize.width || 190}px`,
                    height: `${logoSizes.splashHorizontalSize.height || 90}px`,
                    marginLeft: `${
                      logoSizes.splashHorizontalSize.marginLeft || 0
                    }px`,
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 150,
                    height: 60,
                    bgcolor: "#E5E7EB",
                    borderRadius: 1,
                  }}
                />
              )}
            </PhoneFrame>

            {/* Image background */}
            <PhoneFrame variant="image">
              {logoVariants.negative.horizontal ? (
                <img
                  src={logoVariants.negative.horizontal.url}
                  alt="Logo"
                  style={{
                    width:
                      logoSizes.splashHorizontalSize.width === "auto"
                        ? "auto"
                        : `${logoSizes.splashHorizontalSize.width || 190}px`,
                    height: `${logoSizes.splashHorizontalSize.height || 90}px`,
                    marginLeft: `${
                      logoSizes.splashHorizontalSize.marginLeft || 0
                    }px`,
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 150,
                    height: 60,
                    bgcolor: "rgba(255,255,255,0.3)",
                    borderRadius: 1,
                  }}
                />
              )}
            </PhoneFrame>
          </Stack>

          <SizeControlPanel
            label="Splash Horizontal Logo Size"
            size={logoSizes.splashHorizontalSize}
            onSizeChange={(newSize) =>
              onSizeChange("splashHorizontal", newSize)
            }
          />
        </Box>

        {/* Row 2: Vertical logos */}
        <Typography variant="subtitle2" color="text.secondary" mb={2}>
          Vertical Logo
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <Stack direction="row" spacing={3}>
            {/* Brand color background */}
            <PhoneFrame brandColor={brandColor} variant="brand">
              {logoVariants.light.vertical ? (
                <img
                  src={logoVariants.light.vertical.url}
                  alt="Logo"
                  style={{
                    width:
                      logoSizes.splashVerticalSize.width === "auto"
                        ? "auto"
                        : `${logoSizes.splashVerticalSize.width || 140}px`,
                    height: `${logoSizes.splashVerticalSize.height || 180}px`,
                    marginLeft: `${
                      logoSizes.splashVerticalSize.marginLeft || 0
                    }px`,
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 100,
                    height: 120,
                    bgcolor: "rgba(255,255,255,0.3)",
                    borderRadius: 1,
                  }}
                />
              )}
            </PhoneFrame>

            {/* Light background */}
            <PhoneFrame variant="light">
              {logoVariants.dark.vertical ? (
                <img
                  src={logoVariants.dark.vertical.url}
                  alt="Logo"
                  style={{
                    width:
                      logoSizes.splashVerticalSize.width === "auto"
                        ? "auto"
                        : `${logoSizes.splashVerticalSize.width || 140}px`,
                    height: `${logoSizes.splashVerticalSize.height || 180}px`,
                    marginLeft: `${
                      logoSizes.splashVerticalSize.marginLeft || 0
                    }px`,
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 100,
                    height: 120,
                    bgcolor: "#E5E7EB",
                    borderRadius: 1,
                  }}
                />
              )}
            </PhoneFrame>

            {/* Image background */}
            <PhoneFrame variant="image">
              {logoVariants.negative.vertical ? (
                <img
                  src={logoVariants.negative.vertical.url}
                  alt="Logo"
                  style={{
                    width:
                      logoSizes.splashVerticalSize.width === "auto"
                        ? "auto"
                        : `${logoSizes.splashVerticalSize.width || 140}px`,
                    height: `${logoSizes.splashVerticalSize.height || 180}px`,
                    marginLeft: `${
                      logoSizes.splashVerticalSize.marginLeft || 0
                    }px`,
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 100,
                    height: 120,
                    bgcolor: "rgba(255,255,255,0.3)",
                    borderRadius: 1,
                  }}
                />
              )}
            </PhoneFrame>
          </Stack>

          <SizeControlPanel
            label="Splash Vertical Logo Size"
            size={logoSizes.splashVerticalSize}
            onSizeChange={(newSize) => onSizeChange("splashVertical", newSize)}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default LogoSizeAdjuster;
