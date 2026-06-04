"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Skeleton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Paper,
  ButtonBase,
  Collapse,
} from "@mui/material";
import {
  DownloadSimple,
  Plus,
  DeviceMobile,
  Globe,
  AndroidLogo,
  CheckCircle,
  ArrowLeft,
  CaretDown,
  CaretUp,
  Image as ImageIcon,
} from "phosphor-react";
import ProductLogoSidebar from "@/components/shared/ProductLogoSidebar";
import VpnGate from "@/components/shared/VpnGate";
import { useRouter, useSearchParams } from "next/navigation";
import JSZip from "jszip";
import useAllProductLogos from "@/hooks/useAllProductLogos";
import Loader from "@/components/shared/Loader";
import HomeScreenMockup from "./HomeScreenMockup";
import { captureEvent } from "@/lib/analytics/posthog";
import { useToast } from "@/context/shared/ToastContext";

// ─── Platform size presets ────────────────────────────────────────────────────

const PLATFORM_PRESETS = {
  ios: {
    label: "iOS",
    icon: DeviceMobile,
    sizes: [20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024],
    color: "#007AFF",
    bg: "#EBF4FF",
  },
  android: {
    label: "Android",
    icon: AndroidLogo,
    sizes: [36, 48, 72, 96, 144, 192, 512],
    color: "#34A853",
    bg: "#EAFAF1",
  },
  pwa: {
    label: "PWA / Web",
    icon: Globe,
    sizes: [16, 32, 48, 72, 96, 144, 152, 192, 384, 512],
    color: "#7C3AED",
    bg: "#F3EEFF",
  },
};

// ─── Custom Scrollbar ─────────────────────────────────────────────────────────

const scrollbarSx = {
  "&::-webkit-scrollbar": { width: 6, height: 6 },
  "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(128, 128, 128, 0.3)",
    borderRadius: 8,
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "rgba(128, 128, 128, 0.5)",
  },
};

// ─── Platform card ────────────────────────────────────────────────────────────

function PlatformCard({ platformKey, preset, isSelected, onToggle }) {
  const { label, icon: Icon, sizes, color, bg } = preset;
  return (
    <Box
      onClick={() => onToggle(platformKey)}
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2,
        py: 1.5,
        borderRadius: 2,
        border: "1px solid",
        borderColor: isSelected ? color : "divider",
        bgcolor: isSelected ? bg : "transparent",
        cursor: "pointer",
        transition: "all 0.15s ease",
        userSelect: "none",
        "&:hover": {
          borderColor: color,
          bgcolor: isSelected ? bg : "action.hover",
        },
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: 1.5,
          bgcolor: isSelected ? color : "action.selected",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "background-color 0.15s",
        }}
      >
        <Icon size={16} weight="duotone" color={isSelected ? "#fff" : "currentColor"} />
      </Box>
      <Box>
        <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
          {label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {sizes.length} sizes
        </Typography>
      </Box>
      {isSelected && (
        <Box sx={{ position: "absolute", top: 6, right: 6 }}>
          <CheckCircle size={14} weight="fill" color={color} />
        </Box>
      )}
    </Box>
  );
}

// ─── Canvas helpers ───────────────────────────────────────────────────────────

async function fetchSvgAsBlob(logoUrl) {
  const res = await fetch(`/api/proxy-image?url=${encodeURIComponent(logoUrl)}`);
  if (!res.ok) throw new Error("Failed to fetch logo");
  return res.blob();
}

async function rasterize(objectUrl, size) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      canvas.getContext("2d").drawImage(img, 0, 0, size, size);
      resolve(canvas);
    };
    img.onerror = () => reject(new Error(`Render failed at ${size}px`));
    img.src = objectUrl;
  });
}

async function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png");
  });
}

// ─── Preview strip ────────────────────────────────────────────────────────────

const skeletonSx = {
  background: "linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.4s ease-in-out infinite",
};

const skeletonKeyframes = `
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

function PreviewStrip({ logoUrl, sizes, isLoading }) {
  const [bg, setBg] = useState("light");
  const allSizes = [...new Set(sizes)];
  const allValidSizes = allSizes.filter((s) => s <= 4096);
  const maxSize = allValidSizes.length > 0 ? Math.max(...allValidSizes) : 1024;
  const skeletonSizes = [24, 28, 36, 48, 56, 72, 72, 72, 72];

  if (!isLoading && (!logoUrl || allValidSizes.length === 0)) return null;

  const bgColor = bg === "light" ? "#ffffff" : "#121212";
  const labelColor = bg === "light" ? "#121212" : "#ffffff";
  const proxyUrl = logoUrl ? `/api/proxy-image?url=${encodeURIComponent(logoUrl)}` : null;

  return (
    <Box>
      <style>{skeletonKeyframes}</style>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <Typography variant="overline" color="text.secondary" fontWeight={600}>
          Size Previews
        </Typography>
        <ToggleButtonGroup
          value={bg}
          exclusive
          onChange={(_, v) => v && setBg(v)}
          size="small"
          disabled={isLoading}
        >
          <ToggleButton value="light" sx={{ px: 1.5, py: 0.25, fontSize: 11 }}>Light</ToggleButton>
          <ToggleButton value="dark" sx={{ px: 1.5, py: 0.25, fontSize: 11 }}>Dark</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "flex-end",
          p: 3,
          borderRadius: 2,
          bgcolor: isLoading ? "background.default" : bgColor,
          border: "1px solid",
          borderColor: "divider",
          transition: "background-color 0.2s",
        }}
      >
        {isLoading
          ? skeletonSizes.map((size, i) => (
              <Box
                key={i}
                sx={{
                  width: size,
                  height: size,
                  borderRadius: 1,
                  flexShrink: 0,
                  ...skeletonSx,
                }}
              />
            ))
          : allValidSizes.map((size) => {
          const logScale = Math.log2(Math.max(size, 1)) / Math.log2(Math.max(maxSize, 2));
          const visual = Math.round(12 + logScale * 84);
          return (
            <Tooltip key={size} title={`${size}×${size}px`} arrow>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.5,
                  flexShrink: 0,
                }}
              >
                <Box
                  sx={{
                    width: visual,
                    height: visual,
                    borderRadius: 1,
                    overflow: "hidden",
                    position: "relative",
                    bgcolor: "#ffffff",
                    border: "1px solid",
                    borderColor: bg === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proxyUrl}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 10,
                    color: labelColor,
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {size}
                </Typography>
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function AppIconGeneratorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialLogoId = searchParams.get("logo");
  const { logos, selectedLogo, isLoading, isDetailLoading, selectLogo, fetchError } = useAllProductLogos({ initialLogoId });
  const { setToast } = useToast();

  const [activePlatforms, setActivePlatforms] = useState(["ios", "android"]);
  const [customInput, setCustomInput] = useState("");
  const [customSizes, setCustomSizes] = useState([]);
  const [customSizeError, setCustomSizeError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const [showAllSizes, setShowAllSizes] = useState(false);

  const leftScrollRef = useRef(null);
  const rightScrollRef = useRef(null);

  useEffect(() => {
    if (leftScrollRef.current) leftScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    if (rightScrollRef.current) rightScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedLogo?.id]);

  const handlePlatformToggle = (key) => {
    setActivePlatforms((prev) => {
      const next = prev.includes(key)
        ? prev.length > 1 ? prev.filter((k) => k !== key) : prev
        : [...prev, key];
      if (next !== prev) captureEvent("app_icon_platform_toggled", { platform: key, selected: !prev.includes(key) });
      return next;
    });
  };

  const addCustomSize = () => {
    const val = parseInt(customInput, 10);
    if (!val || val < 1 || val > 4096) return;
    if (customSizes.includes(val)) {
      setCustomSizeError(`${val}×${val} is already in your custom sizes`);
      return;
    }
    setCustomSizeError("");
    setCustomSizes((prev) => [...prev, val].sort((a, b) => a - b));
    setCustomInput("");
    setShowAllSizes(true);
  };

  const removeCustomSize = (size) => {
    setCustomSizes((prev) => prev.filter((s) => s !== size));
  };

  const allSizes = [
    ...new Set([
      ...activePlatforms.flatMap((p) => PLATFORM_PRESETS[p]?.sizes ?? []),
      ...customSizes,
    ]),
  ].sort((a, b) => a - b);

  // Display list keeps duplicates — preset entries + custom entries side by side
  const displaySizes = [
    ...activePlatforms.flatMap((p) =>
      (PLATFORM_PRESETS[p]?.sizes ?? []).map((size) => ({ size, isCustom: false }))
    ),
    ...customSizes.map((size) => ({ size, isCustom: true })),
  ].sort((a, b) => a.size - b.size);

  const totalFilesToGenerate = displaySizes.length;

  const logoUrl = selectedLogo?.assets?.logo;

  const handleGenerate = useCallback(async () => {
    if (!logoUrl || totalFilesToGenerate === 0) return;
    setIsGenerating(true);
    setError(null);

    try {
      const blob = await fetchSvgAsBlob(logoUrl);
      const objectUrl = URL.createObjectURL(blob);
      const zip = new JSZip();
      const logoName = (selectedLogo?.name ?? "logo").replace(/\s+/g, "_");

      const folders = {};
      activePlatforms.forEach((p) => {
        folders[p] = PLATFORM_PRESETS[p].sizes;
      });
      if (customSizes.length > 0) folders["custom"] = customSizes;

      for (const [platform, sizes] of Object.entries(folders)) {
        const folder = zip.folder(platform);
        for (const size of sizes) {
          const canvas = await rasterize(objectUrl, size);
          const pngBlob = await canvasToBlob(canvas);
          folder.file(`${logoName}_${size}x${size}.png`, pngBlob);
        }
      }

      URL.revokeObjectURL(objectUrl);

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(zipBlob);
      a.download = `${logoName}_app_icons.zip`;
      a.click();
      URL.revokeObjectURL(a.href);

      captureEvent("app_icon_generated", {
        logo_id: selectedLogo?.id,
        logo_name: selectedLogo?.name,
        platforms: activePlatforms,
        total_sizes: totalFilesToGenerate,
        has_custom_sizes: customSizes.length > 0,
      });

      setToast({
        open: true,
        type: "success",
        message: `${totalFilesToGenerate} icons downloaded for ${selectedLogo?.name}`,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong generating icons.");
    } finally {
      setIsGenerating(false);
    }
  }, [logoUrl, allSizes, totalFilesToGenerate, activePlatforms, customSizes, selectedLogo, setToast]);

  if (isLoading) return <Loader />;

  return (
    <VpnGate error={fetchError} title="App Icons">
    <Box sx={{ display: "flex", height: "calc(100vh - 64px)", overflow: "hidden" }}>
      {/* Fixed sidebar */}
      <ProductLogoSidebar
        logos={logos}
        selectedLogo={selectedLogo}
        onSelect={(logo) => {
          captureEvent("app_icon_logo_selected", { logo_id: logo.id, logo_name: logo.name });
          selectLogo(logo);
          setError(null);
        }}
        isLoading={isLoading}
        positionVariant="fixed"
      />

      {/* Spacer matching sidebar width */}
      <Box sx={{ width: 260, flexShrink: 0 }} />

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        
        {/* Fixed Header */}
        <Box sx={{ px: { xs: 3, md: 5 }, py: 3, borderBottom: "1px solid", borderColor: "divider", bgcolor: "background.paper", zIndex: 2 }}>
          <Tooltip title="Navigate back to Utilities" placement="right" arrow>
            <Box
              onClick={() => router.push("/utilities")}
              sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 2, cursor: "pointer", color: "text.secondary", "&:hover": { color: "text.primary" }, transition: "color 0.15s" }}
            >
              <ArrowLeft size={14} />
              <Typography variant="body2" fontWeight={500}>Back</Typography>
            </Box>
          </Tooltip>
          <Typography variant="h4" fontWeight={700} mb={0.5}>
            App Icon Generator
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Pick a logo, choose your platforms, and download a ZIP of PNG icons in every required size.
          </Typography>
        </Box>

        {/* Scrollable Content Body */}
        <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", bgcolor: "background.default", ...scrollbarSx }}>
          
          {/* Progressive Disclosure Empty State */}
          {!logoUrl && !isDetailLoading && (
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", p: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 10,
                  px: 4,
                  borderRadius: 3,
                  border: "2px dashed",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  textAlign: "center",
                  maxWidth: 480,
                  width: "100%"
                }}
              >
                <Box sx={{ width: 64, height: 64, borderRadius: "50%", bgcolor: "action.hover", display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
                  <ImageIcon size={32} weight="duotone" color="#9CA3AF" />
                </Box>
                <Typography variant="h6" fontWeight={600} mb={1}>
                  No Logo Selected
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Select a product logo from the sidebar to preview and generate a complete App Icon pack for iOS, Android, and Web.
                </Typography>
              </Box>
            </Box>
          )}

          {/* Split View for Configuration and Preview */}
          {(logoUrl || isDetailLoading) && (
            <Box sx={{ flex: 1, display: "flex", flexDirection: { xs: "column", lg: "row" }, minHeight: 0 }}>
              
              {/* Left Column: Configuration */}
              <Box 
                sx={{ 
                  width: { lg: 420 }, 
                  flexShrink: 0, 
                  borderRight: { lg: "1px solid" }, 
                  borderBottom: { xs: "1px solid", lg: "none" },
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  display: "flex",
                  flexDirection: "column",
                  ...scrollbarSx
                }}
              >
                <Box ref={leftScrollRef} sx={{ p: { xs: 3, md: 4 }, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4, ...scrollbarSx }}>
                  
                  {/* Logo Info */}
                  <Box>
                    <Typography variant="overline" color="text.primary" fontWeight={1000} display="block" mb={1.5}>
                      Selected Logo
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {isDetailLoading ? (
                        <Skeleton variant="rounded" width={56} height={56} sx={{ borderRadius: 2 }} />
                      ) : (
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "#ffffff",
                            flexShrink: 0,
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/api/proxy-image?url=${encodeURIComponent(logoUrl)}`}
                            alt={selectedLogo?.name}
                            style={{ width: 40, height: 40, objectFit: "contain" }}
                          />
                        </Box>
                      )}
                      <Box>
                        {isDetailLoading ? (
                          <>
                            <Skeleton variant="text" width={120} height={24} />
                            <Skeleton variant="text" width={180} height={16} />
                          </>
                        ) : (
                          <>
                            <Typography variant="subtitle2" fontWeight={600}>{selectedLogo?.name}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>Vector logo source</Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {/* Platforms */}
                  <Box>
                    <Typography variant="overline" color="text.secondary" fontWeight={600} display="block" mb={1.5}>
                      Target Platforms
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                      {Object.entries(PLATFORM_PRESETS).map(([key, preset]) => (
                        <PlatformCard key={key} platformKey={key} preset={preset} isSelected={activePlatforms.includes(key)} onToggle={handlePlatformToggle} />
                      ))}
                    </Box>
                  </Box>

                  {/* Custom Sizes */}
                  <Box>
                    <Typography variant="overline" color="text.primary" fontWeight={1000} display="block" mb={1.5}>
                      Custom Sizes
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                      <TextField
                        size="small"
                        placeholder="e.g. 256"
                        type="number"
                        value={customInput}
                        onChange={(e) => { setCustomInput(e.target.value); setCustomSizeError(""); }}
                        onKeyDown={(e) => e.key === "Enter" && addCustomSize()}
                        onWheel={(e) => e.target.blur()}
                        inputProps={{ min: 1, max: 4096 }}
                        fullWidth
                        error={!!customSizeError}
                        helperText={customSizeError || " "}
                      />
                      <Button variant="outlined" sx={{ flexShrink: 0, mt: "2px" }} onClick={addCustomSize}>Add</Button>
                    </Box>
                  </Box>

                  {/* Output Summary */}
                  <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => setShowAllSizes(!showAllSizes)}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {totalFilesToGenerate} Files to Generate
                      </Typography>
                      <ButtonBase sx={{ p: 0.5, borderRadius: 1 }}>
                        {showAllSizes ? <CaretUp size={16} /> : <CaretDown size={16} />}
                      </ButtonBase>
                    </Box>
                    
                    <Collapse in={showAllSizes}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 2 }}>
                        {displaySizes.map(({ size, isCustom }, index) => {
                          const ownerPlatform = Object.entries(PLATFORM_PRESETS).find(([, p]) => p.sizes.includes(size));
                          const chipColor = isCustom ? "#D97706" : ownerPlatform ? ownerPlatform[1].color : "#6B7280";
                          const chipBg = isCustom ? "#FEF3C7" : ownerPlatform ? ownerPlatform[1].bg : "#F3F4F6";
                          return (
                            <Chip
                              key={`${size}-${index}`}
                              label={`${size}×${size}`}
                              size="small"
                              onDelete={isCustom ? () => removeCustomSize(size) : undefined}
                              sx={{ fontVariantNumeric: "tabular-nums", fontSize: 11, bgcolor: chipBg, color: chipColor, border: "1px solid", borderColor: chipColor + "44", "& .MuiChip-deleteIcon": { color: chipColor } }}
                            />
                          );
                        })}
                      </Box>
                    </Collapse>
                  </Box>

                </Box>
                
                {/* CTA Sticky Bottom */}
                <Box sx={{ p: 3, borderTop: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
                  {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={isGenerating ? <CircularProgress size={16} color="inherit" /> : <DownloadSimple size={18} weight="bold" />}
                    onClick={handleGenerate}
                    disabled={!logoUrl || totalFilesToGenerate === 0 || isGenerating}
                    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500, height: 48 }}
                  >
                    {isGenerating ? "Generating ZIP…" : "Download App Icons"}
                  </Button>
                </Box>
              </Box>

              {/* Right Column: Previews */}
              <Box ref={rightScrollRef} sx={{ flex: 1, overflowY: "auto", position: "relative", ...scrollbarSx }}>
                {isDetailLoading ? (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      minHeight: 300,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark" ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.8)",
                      backdropFilter: "blur(4px)",
                      zIndex: 10,
                      borderRadius: 3,
                    }}
                  >
                    <CircularProgress size={40} />
                  </Box>
                ) : (
                  <Box sx={{ p: { xs: 3, md: 5 }, display: "flex", flexDirection: "column", gap: 5 }}>
                    <HomeScreenMockup logoUrl={logoUrl} logoName={selectedLogo?.name} isLoading={false} />
                    <PreviewStrip logoUrl={logoUrl} sizes={allSizes} isLoading={false} />
                  </Box>
                )}
              </Box>

            </Box>
          )}
        </Box>
      </Box>
    </Box>
    </VpnGate>
  );
}

export default AppIconGeneratorPage;