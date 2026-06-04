"use client";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { AccessibilityPalletteTabs } from "@/constants";
import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import TopHeader from "@/components/shared/TopHeader";
import ComponentTabs from "@/components/shared/ComponentTabs";
import ProductColorSelection from "./components/ProductColorSelection";
import Primary from "./components/tabs/Primary";
import { useAccessiblePaletteContext } from "@/context/design-system/AccessiblePaletteContext";
import Loader from "@/components/shared/Loader";
import Neutral from "./components/tabs/Neutral";
import ThemePreview from "./components/theme_preview/Theme_preview";
import AccessibleCombinations from "./components/tabs/AccessibleCombinations";
import Semantic from "./components/tabs/Semantic";

function AccessiblePalette() {
  const [currentTab, setCurrentTab] = useState(0);
  const {
    isLoading,
    paletteData,
    selectedProductColor,
    setSelectedProductColor,
    showSnackbarWithLogo,
  } = useAccessiblePaletteContext();
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const searchParams = useSearchParams();
  const hasProcessedQueryParams = useRef(false);

  // Extract query params as stable values
  const colorParam = searchParams.get("color");
  const logoName = searchParams.get("logo");
  const logoImage = searchParams.get("logoImage");

  // Use useLayoutEffect to set color synchronously before paint
  // This ensures it happens before the hook's useEffect runs
  useLayoutEffect(() => {
    if (hasProcessedQueryParams.current) return;
    hasProcessedQueryParams.current = true;

    if (colorParam) {
      // console.log("Setting color from URL params (layout):", colorParam, "current:", selectedProductColor);
      // Always set it, even if it seems the same, to ensure the hook's useEffect runs
      setSelectedProductColor(colorParam);
    }
  }, [colorParam, setSelectedProductColor]);

  // Handle snackbar display after initial render
  useEffect(() => {
    if (
      hasProcessedQueryParams.current &&
      logoName &&
      logoImage &&
      colorParam
    ) {
      // Show snackbar with logo if logo info is provided
      setTimeout(() => {
        showSnackbarWithLogo(
          `Viewing ${logoName} color palette`,
          logoImage,
          logoName,
        );
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logoName, logoImage, colorParam]);

  // Track if we've loaded data at least once
  React.useEffect(() => {
    // console.log("Palette data changed:", paletteData ? "has data" : "no data", "selectedColor:", selectedProductColor);
    if (paletteData && !hasInitiallyLoaded) {
      setHasInitiallyLoaded(true);
    }
  }, [paletteData, hasInitiallyLoaded, selectedProductColor]);

  // Handle tab change :
  const handleTabChange = (_, newValue) => {
    setCurrentTab(newValue);
    // Don't scroll when changing tabs - let user stay at current position
  };

  const renderTabContent = () => {
    if (!paletteData) {
      return (
        <>
          <Typography>No data found</Typography>
        </>
      );
    }
    switch (currentTab) {
      case 0:
        return <Primary />;
      case 1:
        return <Neutral />;
      case 2:
        return <Semantic />;
      case 3:
        return <AccessibleCombinations />;
      default:
        return null;
    }
  };

  // Show full page loader only on initial load
  if (isLoading && !hasInitiallyLoaded) {
    return <Loader />;
  }

  return (
    <Stack
      sx={{
        bgcolor: "background.default",
        position: "relative",
        minHeight: "100vh",
      }}
    >
      {/* Loading overlay for subsequent loads */}
      {isLoading && hasInitiallyLoaded && (
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
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            animation: "fadeIn 0.2s ease-in",
            "@keyframes fadeIn": {
              "0%": {
                opacity: 0,
              },
              "100%": {
                opacity: 1,
              },
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress size={48} />
            <Typography variant="body1" color="text.primary" fontWeight={500}>
              Loading palette...
            </Typography>
          </Box>
        </Box>
      )}

      {/* Header Section */}
      <Box sx={{ p: 2, pb: 0 }}>
        <TopHeader
          title={"Accessible Palettes"}
          description="Choose your brand to preview the right, accessible color palette along with neutral and semantic colors."
          assetURL="/Accessible color palettes.svg"
          relativePath
        />
      </Box>

      {/* Main Layout with Sidebar and Content */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          position: "relative",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Left Sidebar - Product Color Selection */}
        <Box
          sx={{
            width: { xs: "100%", md: "280px" },
            minWidth: { xs: "unset", md: "280px" },
            borderRight: { xs: "none", md: "1px solid" },
            borderBottom: { xs: "1px solid", md: "none" },
            borderColor: "divider",
            p: 2,
            overflowY: { xs: "visible", md: "auto" },
            position: { xs: "static", md: "sticky" },
            top: 0,
            alignSelf: "flex-start",
            maxHeight: { xs: "none", md: "100vh" },
            bgcolor: "background.paper",
            // Custom scrollbar styles
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.3)",
              },
            },
            // Firefox scrollbar
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0, 0, 0, 0.2) transparent",
            pb: { xs: 2, md: "100px" },
          }}
        >
          <ProductColorSelection />
        </Box>

        {/* Main Content Area */}
        <Stack
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 2,
            paddingBottom: "100px",
          }}
        >
          {/* Tab Section */}
          <ComponentTabs
            tabs={AccessibilityPalletteTabs}
            currentTab={currentTab}
            onChange={handleTabChange}
          />

          {/* Main Content Section with transition */}
          <Box
            sx={{
              display: "flex",
              opacity: isLoading ? 0.5 : 1,
              transition: "opacity 0.3s ease-in-out",
              pointerEvents: isLoading ? "none" : "auto",
            }}
          >
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                p: 1,
              }}
            >
              {renderTabContent()}
            </Box>
          </Box>

          {/* Theme Preview Section */}
          {paletteData && (
            <Box
              sx={{
                p: 1,
                opacity: isLoading ? 0.5 : 1,
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              <ThemePreview />
            </Box>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}

export default AccessiblePalette;
