"use client";
import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Snackbar, Alert, Stack, Button, AlertTitle, Skeleton } from "@mui/material";
import VpnGate from "@/components/shared/VpnGate";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Lottie from "lottie-react";
import ProductLogoSidebar from "@/components/shared/ProductLogoSidebar";
import LogoPreviewSection from "./components/LogoPreviewSection";
import MockupsSection from "./components/MockupsSection";
import { useColorPreview } from "./components/useColorPreview";
import useProductLogos from "./hooks/useProductLogos";
import Loader from "@/components/shared/Loader";
import { captureEvent } from "@/lib/analytics/posthog";
import { useAuthContext } from "@/context/auth/AuthContext";
import { recordDownload } from "@/api/download-tracking";
import colorPaletteAnimation from "../../../public/animations/color-pallete.json";
import cropToolAnimation from "../../../public/animations/Crop-Tool.json";

function UtilityCardAnimation({ animationData }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 56,
        height: 56,
        minWidth: 56,
        borderRadius: 1.5,
        bgcolor: "action.hover",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{
          width: 68,
          height: 68,
        }}
      />
    </Box>
  );
}

function LogosPage() {
  const { isAdmin, isSuperAdmin } = useAuthContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialLogoId = searchParams.get("logo");

  const {
    productLogos,
    selectedLogo,
    isInitialLoading,
    isSidebarLoading,
    isLogoDetailsLoading,
    currentPage,
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    fetchLogos,
    fetchLogoDetails,
    totalPages,
    fetchError,
  } = useProductLogos({ initialLogoId });

  // Show loader on back/forward navigation until the correct logo is ready
  const [isNavRestoring, setIsNavRestoring] = useState(() => {
    if (typeof window === "undefined") return false;
    return performance.getEntriesByType("navigation")[0]?.type === "back_forward";
  });
  const [selectedColorTab, setSelectedColorTab] = useState("brand");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
    showAnimation: false,
  });
  const [hoveredColorIndex, setHoveredColorIndex] = useState(null);
  const [hoveredColor, setHoveredColor] = useState(null);
  const [copiedColorIndex, setCopiedColorIndex] = useState(null);
  const rightSideContentRef = useRef(null);

  const { previewColors, defaultMainPreviewColor } = useColorPreview(
    selectedLogo,
    selectedColorTab,
  );

  const mainPreviewColor = hoveredColor || defaultMainPreviewColor;

  const handleCopyColor = (color, index) => {
    navigator.clipboard.writeText(color).then(() => {
      setCopiedColorIndex(index);
      setSnackbar({
        open: true,
        message: `Color ${color} copied to clipboard!`,
        severity: "success",
        showAnimation: false,
      });
      setTimeout(() => {
        setCopiedColorIndex(null);
      }, 1000);
    });
  };

  const [animationData, setAnimationData] = useState(null);
  useEffect(() => {
    fetch("/animations/successful-download.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch(() => {});
  }, []);

  const handleDownload = () => {
    captureEvent("logo_kit_downloaded", {
      logo_id: selectedLogo.id,
      logo_name: selectedLogo.name,
    });

    const logoName = selectedLogo.name.replace(/\s+/g, "_");
    const fileName = `${logoName}_Full_Kit.zip`;
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(selectedLogo.assets.bundleURL)}&filename=${encodeURIComponent(fileName)}`;

    const link = document.createElement("a");
    link.href = proxyUrl;
    link.download = fileName;
    link.click();

    fetch("/api/download-count", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logoName: selectedLogo.name }),
    }).catch(() => {});

    recordDownload({
      assetId: String(selectedLogo.id),
      assetName: selectedLogo.name,
      assetType: "logo",
      format: ".zip",
    }).catch(() => {});

    setSnackbar({
      open: true,
      message: `${selectedLogo.name} zip bundle downloaded!`,
      severity: "success",
      showAnimation: true,
    });
  };

  const handleCviDownload = () => {
    const logoName = selectedLogo.name.replace(/\s+/g, "_");
    const fileName = `${logoName}_CVI.pdf`;
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(selectedLogo.assets.cviURL)}&filename=${encodeURIComponent(fileName)}`;
    const link = document.createElement("a");
    link.href = proxyUrl;
    link.download = fileName;
    link.click();
    captureEvent("logo_cvi_downloaded", {
      logo_id: String(selectedLogo.id),
      logo_name: selectedLogo.name,
    });
    recordDownload({
      assetId: String(selectedLogo.id),
      assetName: selectedLogo.name,
      assetType: "logo",
      format: ".pdf",
    }).catch(() => {});
    setSnackbar({ open: true, message: `${selectedLogo.name} CVI downloaded!`, severity: "success", showAnimation: true });
  };

  const handlePptDownload = () => {
    const logoName = selectedLogo.name.replace(/\s+/g, "_");
    const fileName = `${logoName}_Template.pptx`;
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(selectedLogo.assets.powerpointURL)}&filename=${encodeURIComponent(fileName)}`;
    const link = document.createElement("a");
    link.href = proxyUrl;
    link.download = fileName;
    link.click();
    captureEvent("logo_powerpoint_downloaded", {
      logo_id: String(selectedLogo.id),
      logo_name: selectedLogo.name,
    });
    recordDownload({
      assetId: String(selectedLogo.id),
      assetName: selectedLogo.name,
      assetType: "logo",
      format: ".pptx",
    }).catch(() => {});
    setSnackbar({ open: true, message: `${selectedLogo.name} PowerPoint downloaded!`, severity: "success", showAnimation: true });
  };

  const handleColorHover = (index, color) => {
    setHoveredColorIndex(index);
    setHoveredColor(color);
  };

  const handleColorLeave = () => {
    setHoveredColorIndex(null);
    setHoveredColor(null);
  };

  // Clear back-nav loader once the correct logo is loaded
  useEffect(() => {
    if (!isNavRestoring) return;
    const logoReady =
      selectedLogo &&
      !isLogoDetailsLoading &&
      (!initialLogoId || selectedLogo.id?.toString() === initialLogoId.toString());
    if (logoReady) setIsNavRestoring(false);
  }, [isNavRestoring, selectedLogo, isLogoDetailsLoading, initialLogoId]);

  // Handle logo selection - fetch full details and persist in URL
  const handleLogoSelect = (logo) => {
    captureEvent("logo_selected", {
      logo_id: logo.id,
      logo_name: logo.name,
    });
    router.replace(`/logos?logo=${logo.id}`, { scroll: false });
    fetchLogoDetails(logo.id);
  };

  const handlePageChange = (page) => {
    fetchLogos(page, false, debouncedSearchQuery);
  };

  useEffect(() => {
    if (selectedLogo) {
      const container = document.getElementById("logos-scroll");
      if (container) container.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedLogo]);

  if (isNavRestoring) {
    return <Loader />;
  }

  return (
    <>
      <VpnGate error={fetchError} title="Logos">
      <Box
        sx={{
          bgcolor: "background.default",
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        {/* Left Sidebar */}
        <ProductLogoSidebar
          logos={productLogos}
          selectedLogo={selectedLogo}
          onSelect={handleLogoSelect}
          isLoading={isInitialLoading || isSidebarLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          fetchError={fetchError}
        />

        {/* Right Content Area */}
        <Box sx={{ flex: 1, pt: 4, position: "relative" }}>
          {selectedLogo && (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 3,
                maxWidth: "1200px",
                mx: "auto",
                px: 2,
              }}
              ref={rightSideContentRef}
            >
              {/* Page Title & Admin Actions */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: -2 }}>
                <Box>
                  <Typography variant="h3" fontWeight={700}>
                    EG Product Logos
                  </Typography>
                  <Typography variant="body" fontWeight={400} color="#303131">
                    Preview and download EG product logos
                  </Typography>
                </Box>
                {(isAdmin || isSuperAdmin) && (
                  <Stack direction="row" spacing={1.5}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => router.push(`/logos/upload?edit=${selectedLogo.id}`)}
                      sx={{ textTransform: "none", borderRadius: 2 }}
                    >
                      Manage Logo
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => router.push("/logos/manage")}
                      sx={{ textTransform: "none", borderRadius: 2, bgcolor: "#111", "&:hover": { bgcolor: "#333" } }}
                    >
                      Upload Logo
                    </Button>
                  </Stack>
                )}
              </Box>

              {/* Brand Guidelines Contextual Link */}
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                Before downloading, make sure to review our{" "}
                <Link href="/design-system/foundation/logo-placement" style={{ fontWeight: 600, color: "inherit", textDecoration: "underline" }}>
                  Brand Identity Guidelines
                </Link>{" "}
                for proper logo placement and clear space rules.
              </Alert>

              {/* Top Row: Large Logo Preview + Preview Backgrounds */}
              <LogoPreviewSection
                selectedLogo={selectedLogo}
                mainPreviewColor={mainPreviewColor}
                selectedColorTab={selectedColorTab}
                onTabChange={setSelectedColorTab}
                previewColors={previewColors}
                hoveredColorIndex={hoveredColorIndex}
                copiedColorIndex={copiedColorIndex}
                onColorHover={handleColorHover}
                onColorLeave={handleColorLeave}
                onColorClick={handleCopyColor}
                onDownload={handleDownload}
                onCviDownload={handleCviDownload}
                onPptDownload={handlePptDownload}
                isLoading={isLogoDetailsLoading}
              />

              {/* Utility CTAs */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flexWrap="wrap" useFlexGap>
                {/* WCAG Card */}
                <Stack
                  component={Link}
                  href={
                    selectedLogo?.colorPalette
                      ? `/design-system/accessible-palettes?color=${selectedLogo.colorPalette}&logo=${encodeURIComponent(selectedLogo.name)}&logoImage=${encodeURIComponent(selectedLogo.assets.logo)}`
                      : "/design-system/accessible-palettes"
                  }
                  onClick={() => captureEvent("logo_cta_accessible_palettes_clicked", {
                    logo_id: selectedLogo?.id,
                    logo_name: selectedLogo?.name,
                  })}
                  direction="row"
                  spacing={1.5}
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    textDecoration: "none",
                    color: "inherit",
                    cursor: "pointer",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    "&:hover": { borderColor: "text.primary", boxShadow: 1 },
                  }}
                >
                  <UtilityCardAnimation animationData={colorPaletteAnimation} />
                  <Box>
                    <Typography variant="body2" fontWeight={600} mb={0.25}>
                      WCAG Colors
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", lineHeight: 1.45 }}
                    >
                      Explore accessible brand palettes, contrast ratios, and
                      compliant combinations for this logo.
                    </Typography>
                  </Box>
                </Stack>

                {/* App Icon Card */}
                <Stack
                  component={Link}
                  href={`/utilities/app-icons${selectedLogo?.id ? `?logo=${selectedLogo.id}` : ""}`}
                  onClick={() => captureEvent("logo_cta_app_icon_generator_clicked", {
                    logo_id: selectedLogo?.id,
                    logo_name: selectedLogo?.name,
                  })}
                  direction="row"
                  spacing={1.5}
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: 2,
                    position: "relative",
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    textDecoration: "none",
                    color: "inherit",
                    cursor: "pointer",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    "&:hover": { borderColor: "text.primary", boxShadow: 1 },
                  }}
                >
                  <UtilityCardAnimation animationData={cropToolAnimation} />
                  <Box>
                    <Typography variant="body2" fontWeight={600} mb={0.25}>
                      App Icon Generator
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", lineHeight: 1.45 }}
                    >
                      Generate polished app icon variants for iOS, Android, and
                      other product surfaces.
                    </Typography>
                  </Box>
                </Stack>

                {/* Favicon Generator Card */}
                <Stack
                  component={Link}
                  href={`/utilities/ico-generator${selectedLogo?.id ? `?logo=${selectedLogo.id}` : ""}`}
                  onClick={() => captureEvent("logo_cta_favicon_generator_clicked", {
                    logo_id: selectedLogo?.id,
                    logo_name: selectedLogo?.name,
                  })}
                  direction="row"
                  spacing={1.5}
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: 2,
                    position: "relative",
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    textDecoration: "none",
                    color: "inherit",
                    cursor: "pointer",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    "&:hover": { borderColor: "text.primary", boxShadow: 1 },
                  }}
                >
                  {/* Favicon browser-tab preview */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 56,
                      height: 56,
                      minWidth: 56,
                      borderRadius: 1.5,
                      bgcolor: "action.hover",
                      overflow: "hidden",
                      flexShrink: 0,
                      position: "relative",
                    }}
                  >
                    {/* Browser chrome strip */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 14,
                        bgcolor: "action.selected",
                        display: "flex",
                        alignItems: "center",
                        px: 0.75,
                        gap: 0.4,
                      }}
                    >
                      {["#ff5f57", "#ffbd2e", "#28ca41"].map((c) => (
                        <Box
                          key={c}
                          sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: c, flexShrink: 0 }}
                        />
                      ))}
                    </Box>
                    {/* Favicon icon in tab */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 14,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {selectedLogo?.assets?.logo ? (
                        <Box
                          component="img"
                          src={selectedLogo.assets.logo}
                          alt={selectedLogo.name}
                          sx={{ width: 20, height: 20, objectFit: "contain" }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "3px",
                            bgcolor: "primary.main",
                            opacity: 0.4,
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="body2" fontWeight={600} mb={0.25}>
                      Favicon Generator
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", lineHeight: 1.45 }}
                    >
                      Export multi-size .ico files for browser tabs, bookmarks,
                      and PWA icons.
                    </Typography>
                  </Box>
                </Stack>

              </Stack>

              {/* Mockups Section */}
              <MockupsSection
                logo={selectedLogo}
                brandColor={mainPreviewColor}
                isLoading={isLogoDetailsLoading}
              />

            </Box>
          )}
        </Box>{/* close right content */}
      </Box>{/* close outer flex row */}
      </VpnGate>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            alignItems: "center",
            bgcolor: "#111",
            color: "#fff",
            "& .MuiAlert-icon": {
              mr: 2,
              p: 0,
            },
            py: 1,
            px: 2,
            borderRadius: 2,
          }}
          icon={
            snackbar.showAnimation && animationData ? (
              <Box sx={{ width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", marginRight: -1 }}>
                <Lottie animationData={animationData} loop={false} style={{ width: "100%", height: "100%" }} />
              </Box>
            ) : undefined
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default LogosPage;
