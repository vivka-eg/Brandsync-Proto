"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Container,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Paper,
  Button,
  useTheme,
} from "@mui/material";
import { Download, Info, InfoOutline } from "@mui/icons-material";
import ComponentPreview from "./components/ComponentPreview";
import ColorSidebar from "./components/ColorSidebar";
import PalettesTab from "./components/PalettesTab";
import SemanticsTab from "./components/SemanticsTab";
import TypographyTab from "./components/TypographyTab";
import TokenPreview from "./components/TokenPreview";
import TokenExportModal from "./components/TokenExportModal";
import ProductsUsingColorModal from "./components/ProductsUsingColorModal";
import { exportTabs } from "./constants";
import { generateExportCode } from "./utils/exportGenerators";
import colorPalettes from "brandsync-tokens/accessibility.json";
import Link from "next/link";
import ExampleScreens from "./components/ExampleScreens";
import { getProductLogosByMatchingColorPalette } from "@/api/design-system/product-logos";
import { getStrapiURL } from "@/strapi/utils";
import { captureEvent } from "@/lib/analytics/posthog";

function ThemeBuilder() {
  const [selectedColor, setSelectedColor] = useState("blue");
  const [activeTab, setActiveTab] = useState("palettes");
  const [formatTab, setFormatTab] = useState("css");
  const [viewportTab, setViewportTab] = useState("desktop");
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [productsModalOpen, setProductsModalOpen] = useState(false);
  const [matchingLogos, setMatchingLogos] = useState([]);
  const theme = useTheme();
  const scrollContainerRef = useRef(null);

  const handleColorSelect = useCallback((colorName) => {
    captureEvent("theme_builder_color_selected", { color_name: colorName });
    setSelectedColor(colorName);
  }, []);

  useEffect(() => {
    const container = document.querySelector(".theme-builder-scroll");
    if (container) container.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const handleCopyColor = useCallback((color) => {
    navigator.clipboard.writeText(color);
    setSnackbar({ open: true, message: `Copied ${color} to clipboard` });
  }, []);

  const handleCopyAll = useCallback(() => {
    const code = generateExportCode(selectedColor, formatTab);
    navigator.clipboard.writeText(code);
    setSnackbar({ open: true, message: "Copied all tokens to clipboard" });
  }, [selectedColor, formatTab]);

  const currentPalette = colorPalettes[selectedColor];
  const primaryColors = currentPalette?.primarySection || [];
  const previewLogos = matchingLogos.slice(0, 5);
  const remainingCount = matchingLogos.length - previewLogos.length;
  const firstMatchingLogo =
    matchingLogos.length > 0
      ? {
          src: getStrapiURL(matchingLogos[0].Assets.Logo),
          horizontal: {
            light: getStrapiURL(matchingLogos[0].Assets.LightLogo.Horizontal),
            dark: getStrapiURL(matchingLogos[0].Assets.DarkLogo.Horizontal),
          },
        }
      : {
          src: null,
          horizontal: { light: null, dark: null },
        };

  useEffect(() => {
    getProductLogosByMatchingColorPalette(selectedColor).then((data) => {
      console.log("Fetched product logos:", data);
      setMatchingLogos(data || []);
    });
  }, [selectedColor]);

  return (
    <Box
      sx={{
        pb: 6,
        px: 2,
        position: "relative",
      }}
    >
      <Box
        sx={{
          "@media (min-width: 1300px)": { width: "1300px", mx: "auto" },
          pt: 4,
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: "center", my: 5 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "#111827",
              mb: 1.5,
              // fontSize: { xs: "1.75rem", md: "2.25rem" },
              width: "500px",
              textAlign: "center",
              marginX: "auto",
            }}
          >
            Generate your EG Product theme in minutes
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#6B7280",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
            }}
          >
            Pick a color and we&apos;ll build a theme that meets your product&apos;s colour palette.
          </Typography>
        </Box>

        {/* Main Layout */}
        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexDirection: { xs: "column", md: "row" },
            alignItems: "flex-start",
          }}
        >
          {/* Left Sidebar - Color Selection */}
          <ColorSidebar
            selectedColor={selectedColor}
            onColorSelect={handleColorSelect}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Right Content Area */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Tabs Header */}
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                p: 1,
                // borderRadius: 2,
                // border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
                position: "sticky",
                top: 0,
                zIndex: 10,
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(_, v) => {
                  captureEvent("theme_builder_tab_changed", { tab: v });
                  setActiveTab(v);
                }}
                sx={{
                  minHeight: 42,
                  "& .MuiTab-root": {
                    minHeight: 42,
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                  },
                  borderBottom: "1px solid",
                  borderColor: "neutral.container",
                }}
              >
                {exportTabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    label={tab.label}
                    value={tab.value}
                    disableFocusRipple
                  />
                ))}
              </Tabs>

              <Button
                variant="contained"
                onClick={() => {
                  captureEvent("theme_builder_tokens_download_opened", { color_name: selectedColor });
                  setTokenModalOpen(true);
                }}
                startIcon={<Download sx={{ fontSize: 18 }} aria-hidden="true" />}
                sx={{
                  backgroundColor: "action.active",
                  color: "#FFFFFF",
                  borderRadius: 2,
                  px: "16px",
                  py: "12px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  "&:hover": {
                    backgroundColor: "#1F2937",
                  },
                }}
              >
                Download tokens
              </Button>
            </Paper>

            {/* Info Banner */}
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1.5,
                py: "8px",
                px: "16px",
                mb: 3,
                borderRadius: 2,
                backgroundColor: "#F3F4F6",
                border: "1px solid #E5E7EB",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <InfoOutline sx={{ color: "neutral.icons", fontSize: 20 }} />
                <Typography sx={{ color: "text.body", fontSize: "0.9rem" }}>
                  Explore{" "}
                  <Link
                    href="/design-system/accessible-palettes"
                    style={{
                      color: theme.palette.text.body,
                      textDecoration: "underline",
                      textDecorationColor: theme.palette.text.body,
                      fontWeight: 500,
                    }}
                  >
                    accessible palettes
                  </Link>{" "}
                  in detail for every color scheme.
                </Typography>
              </Box>
              <a
                href="/theme-builder/usage-guide"
                style={{
                  color: "#3B82F6",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                How to use these tokens →
              </a>
            </Paper>

            {activeTab === "palettes" && (
              <>
                <PalettesTab
                  primaryColors={primaryColors}
                  selectedColor={selectedColor}
                  onColorClick={handleCopyColor}
                />
                {/* Products Using This Color - Subtle inline display */}
                {matchingLogos.length > 0 && (
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1.5,
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.8rem",
                        color: "#9CA3AF",
                      }}
                    >
                      Used by
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                      }}
                    >
                      {previewLogos.map((logo) => (
                        <Box
                          key={logo.id}
                          component="img"
                          src={getStrapiURL(logo.Assets.Logo)}
                          alt={logo.Name}
                          title={logo.Name}
                          role="button"
                          aria-label={`${logo.Name} — view all products using this color`}
                          tabIndex={0}
                          sx={{
                            width: 24,
                            height: 24,
                            objectFit: "contain",
                            opacity: 0.7,
                            transition: "opacity 0.2s ease",
                            cursor: "pointer",
                            "&:hover": {
                              opacity: 1,
                            },
                          }}
                          onClick={() => setProductsModalOpen(true)}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setProductsModalOpen(true); } }}
                        />
                      ))}
                    </Box>
                    {remainingCount > 0 && (
                      <Typography
                        component="button"
                        onClick={() => setProductsModalOpen(true)}
                        sx={{
                          fontSize: "0.75rem",
                          color: "#9CA3AF",
                          cursor: "pointer",
                          background: "none",
                          border: "none",
                          padding: 0,
                          fontFamily: "inherit",
                          "&:hover": {
                            color: "#3B82F6",
                          },
                        }}
                      >
                        +{remainingCount} more
                      </Typography>
                    )}
                    <Typography
                      component="button"
                      onClick={() => setProductsModalOpen(true)}
                      aria-label="View all products using this color"
                      sx={{
                        fontSize: "0.8rem",
                        color: "#6B7280",
                        cursor: "pointer",
                        background: "none",
                        border: "none",
                        padding: 0,
                        font: "inherit",
                        "&:hover": {
                          color: "#3B82F6",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      View all
                    </Typography>
                  </Box>
                )}
                {/* Component Preview */}
                <Box sx={{ mt: 4 }}>
                  <ComponentPreview
                    primaryColor={
                      colorPalettes[selectedColor]?.primaryColor || "#3B82F6"
                    }
                  />
                </Box>
              </>
            )}

            {activeTab === "semantics" && (
              <SemanticsTab onColorClick={handleCopyColor} />
            )}

            {activeTab === "typography" && (
              <TypographyTab
                viewportTab={viewportTab}
                onViewportChange={setViewportTab}
              />
            )}

            {activeTab === "preview" && (
              <ExampleScreens
                primaryColor={
                  colorPalettes[selectedColor]?.primaryColor || "#3B82F6"
                }
                selectedColor={selectedColor}
                firstMatchingLogo={firstMatchingLogo}
              />
            )}

            {activeTab === "token-preview" && (
              <TokenPreview
                selectedColor={selectedColor}
                onCopy={(message) => setSnackbar({ open: true, message })}
              />
            )}
          </Box>
        </Box>
        {/* </Container> */}

        {/* Token Export Modal */}
        <TokenExportModal
          open={tokenModalOpen}
          onClose={() => setTokenModalOpen(false)}
          selectedColor={selectedColor}
          formatTab={formatTab}
          onFormatChange={setFormatTab}
          onCopyAll={handleCopyAll}
        />

        {/* Products Using Color Modal */}
        <ProductsUsingColorModal
          open={productsModalOpen}
          onClose={() => setProductsModalOpen(false)}
          selectedColor={selectedColor}
          matchingLogos={matchingLogos}
        />

        {/* Snackbar for copy notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity="success"
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            sx={{ borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default ThemeBuilder;
