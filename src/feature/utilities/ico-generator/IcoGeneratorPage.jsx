"use client";
import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  Skeleton,
} from "@mui/material";
import {
  DownloadSimple,
  CheckCircle,
  LockSimple,
  ArrowLeft,
  ArrowRight,
  ArrowClockwise,
  Circle,
  Image as ImageIcon,
} from "phosphor-react";
import { useRouter, useSearchParams } from "next/navigation";
import VpnGate from "@/components/shared/VpnGate";
import { motion } from "motion/react";
import useAllProductLogos from "@/hooks/useAllProductLogos";
import Loader from "@/components/shared/Loader";
import { captureEvent } from "@/lib/analytics/posthog";
import ProductLogoSidebar from "@/components/shared/ProductLogoSidebar";
import { useToast } from "@/context/shared/ToastContext";

// ─── ICO size presets ─────────────────────────────────────────────────────────

const ALL_SIZES = [16, 24, 32, 48, 64, 128, 256];
const DEFAULT_SELECTED = [16, 32, 48, 64, 128, 256];

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

// ─── Canvas helpers ───────────────────────────────────────────────────────────

async function fetchSvgAsBlob(logoUrl) {
  const res = await fetch(`/api/proxy-image?url=${encodeURIComponent(logoUrl)}`);
  if (!res.ok) throw new Error("Failed to fetch logo");
  return res.blob();
}

/**
 * Rasterize logo to raw RGBA pixel rows for a given size.
 * Returns { size, rgba: Uint8ClampedArray } - the canvas ImageData pixels.
 */
async function rasterize(objectUrl, size) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      resolve({ size, rgba: ctx.getImageData(0, 0, size, size).data });
    };
    img.onerror = () => reject(new Error(`Render failed at ${size}px`));
    img.src = objectUrl;
  });
}

/**
 * Build an ICO Blob from rasterized entries using raw 32-bit DIB data.
 * Each image is stored as a BITMAPINFOHEADER + XOR mask (bottom-up BGRA).
 * No PNG embedding, maximum compatibility.
 */
function buildIco(entries) {
  const count = entries.length;
  const BITMAPINFOHEADER_SIZE = 40;

  // Each image: BITMAPINFOHEADER (40) + XOR pixels (size*size*4) + AND mask (padded rows)
  const imageSizes = entries.map(({ size }) => {
    const andRowBytes = Math.ceil(size / 32) * 4; // each AND mask row padded to 4 bytes
    return BITMAPINFOHEADER_SIZE + size * size * 4 + andRowBytes * size;
  });

  const headerSize = 6 + count * 16;
  const totalSize = headerSize + imageSizes.reduce((a, b) => a + b, 0);

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const u8 = new Uint8Array(buffer);

  // ICO file header
  view.setUint16(0, 0, true);     // reserved, must be 0
  view.setUint16(2, 1, true);     // image type: 1 = ICO
  view.setUint16(4, count, true); // number of images

  let dataOffset = headerSize;

  entries.forEach(({ size, rgba }, i) => {
    const dirBase = 6 + i * 16;
    const imgSize = imageSizes[i];
    const andRowBytes = Math.ceil(size / 32) * 4;

    // Directory entry
    view.setUint8(dirBase + 0, size >= 256 ? 0 : size); // width  (0 = 256)
    view.setUint8(dirBase + 1, size >= 256 ? 0 : size); // height (0 = 256)
    view.setUint8(dirBase + 2, 0);                       // color count (0 = >256 colors)
    view.setUint8(dirBase + 3, 0);                       // reserved
    view.setUint16(dirBase + 4, 1, true);                // color planes
    view.setUint16(dirBase + 6, 32, true);               // bits per pixel
    view.setUint32(dirBase + 8, imgSize, true);          // size of image data
    view.setUint32(dirBase + 12, dataOffset, true);      // offset in file

    // BITMAPINFOHEADER
    const bih = dataOffset;
    view.setUint32(bih + 0, BITMAPINFOHEADER_SIZE, true); // header size
    view.setInt32(bih + 4, size, true);                   // width
    view.setInt32(bih + 8, size * 2, true);               // height * 2 (XOR + AND masks)
    view.setUint16(bih + 12, 1, true);                    // color planes
    view.setUint16(bih + 14, 32, true);                   // bits per pixel
    view.setUint32(bih + 16, 0, true);                    // compression: BI_RGB
    view.setUint32(bih + 20, 0, true);                    // image size (0 for BI_RGB)
    view.setUint32(bih + 24, 0, true);                    // X pixels per meter
    view.setUint32(bih + 28, 0, true);                    // Y pixels per meter
    view.setUint32(bih + 32, 0, true);                    // colors in table
    view.setUint32(bih + 36, 0, true);                    // important colors

    // XOR mask - 32-bit BGRA, bottom-up (last row of image = first row in data)
    const xorBase = dataOffset + BITMAPINFOHEADER_SIZE;
    for (let row = 0; row < size; row++) {
      const srcRow = size - 1 - row; // flip vertically
      for (let col = 0; col < size; col++) {
        const srcIdx = (srcRow * size + col) * 4;
        const dstIdx = xorBase + (row * size + col) * 4;
        u8[dstIdx + 0] = rgba[srcIdx + 2]; // B
        u8[dstIdx + 1] = rgba[srcIdx + 1]; // G
        u8[dstIdx + 2] = rgba[srcIdx + 0]; // R
        u8[dstIdx + 3] = rgba[srcIdx + 3]; // A
      }
    }

    // AND mask - 1-bit transparency mask, bottom-up, rows padded to 4 bytes
    // 0 = opaque, 1 = transparent. We derive from alpha channel.
    const andBase = xorBase + size * size * 4;
    for (let row = 0; row < size; row++) {
      const srcRow = size - 1 - row;
      for (let col = 0; col < size; col++) {
        const alpha = rgba[(srcRow * size + col) * 4 + 3];
        if (alpha < 128) {
          const byteIdx = andBase + row * andRowBytes + Math.floor(col / 8);
          u8[byteIdx] |= 1 << (7 - (col % 8));
        }
      }
    }

    dataOffset += imgSize;
  });

  return new Blob([buffer], { type: "image/x-icon" });
}

// ─── Size toggle chip ─────────────────────────────────────────────────────────

function SizeToggle({ size, isSelected, onToggle }) {
  return (
    <Tooltip title={isSelected ? "Click to deselect" : "Click to select"} arrow>
      <Chip
        label={`${size}×${size}`}
        size="small"
        onClick={() => onToggle(size)}
        icon={isSelected ? <CheckCircle size={13} weight="fill" /> : undefined}
        sx={{
          fontVariantNumeric: "tabular-nums",
          fontSize: 12,
          cursor: "pointer",
          bgcolor: isSelected ? "primary.main" : "background.default",
          color: isSelected ? "primary.contrastText" : "text.secondary",
          border: "1px solid",
          borderColor: isSelected ? "primary.main" : "divider",
          "& .MuiChip-icon": { color: "inherit" },
          "&:hover": {
            bgcolor: isSelected ? "primary.dark" : "action.hover",
          },
          transition: "all 0.15s",
        }}
      />
    </Tooltip>
  );
}

// ─── Browser mockup preview ───────────────────────────────────────────────────

function BrowserWindow({ favicon, tabLabel, isDark }) {
  // Hardcoded colors for accurate preview regardless of app theme
  const colors = {
    frameBg: isDark ? "#2D2D2D" : "#F3F4F6",
    windowBg: isDark ? "#1E1E1E" : "#FFFFFF",
    urlBarBg: isDark ? "#121212" : "#F9FAFB",
    border: isDark ? "#404040" : "#E5E7EB",
    textPrimary: isDark ? "#F9FAFB" : "#111827",
    textSecondary: isDark ? "#9CA3AF" : "#6B7280",
    iconMuted: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
    placeholderFill: isDark ? "#333333" : "#F3F4F6"
  };

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: colors.border,
        bgcolor: colors.windowBg,
        overflow: "hidden",
        boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.06)",
        width: "100%",
        maxWidth: 520,
      }}
    >
      {/* Window controls + tab bar */}
      <Box sx={{ bgcolor: colors.frameBg, px: 1.5, pt: 1.25, pb: 0, display: "flex", alignItems: "flex-end", gap: 1 }}>
        {/* Traffic lights */}
        <Box sx={{ display: "flex", gap: 0.5, pb: 1, flexShrink: 0 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((color) => (
            <Box key={color} sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color }} />
          ))}
        </Box>

        {/* Active tab */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.5,
            py: 0.75,
            borderRadius: "6px 6px 0 0",
            bgcolor: colors.windowBg,
            border: "1px solid",
            borderBottom: "none",
            borderColor: colors.border,
            minWidth: 140,
            maxWidth: 200,
          }}
        >
          {favicon}
          <Typography
            sx={{
              fontSize: 11,
              color: colors.textPrimary,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              lineHeight: 1,
              flex: 1,
            }}
          >
            {tabLabel}
          </Typography>
          <Circle size={8} style={{ color: colors.iconMuted, flexShrink: 0 }} />
        </Box>
      </Box>

      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 1,
          borderBottom: "1px solid",
          borderColor: colors.border,
          bgcolor: colors.windowBg,
        }}
      >
        <ArrowLeft size={14} style={{ color: colors.iconMuted, flexShrink: 0 }} />
        <ArrowRight size={14} style={{ color: colors.iconMuted, flexShrink: 0 }} />
        <ArrowClockwise size={14} style={{ color: colors.iconMuted, flexShrink: 0 }} />

        {/* URL bar */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.25,
            py: 0.6,
            borderRadius: "6px",
            border: "1px solid",
            borderColor: colors.border,
            bgcolor: colors.urlBarBg,
          }}
        >
          <LockSimple size={11} style={{ color: colors.iconMuted, flexShrink: 0 }} />
          {favicon}
          <Typography sx={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1 }}>
            brand.egsync.com
          </Typography>
        </Box>
      </Box>

      {/* Page body placeholder */}
      <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1 }}>
        <Box sx={{ height: 10, width: "55%", borderRadius: 1, bgcolor: colors.placeholderFill }} />
        <Box sx={{ height: 8, width: "80%", borderRadius: 1, bgcolor: colors.placeholderFill }} />
        <Box sx={{ height: 8, width: "65%", borderRadius: 1, bgcolor: colors.placeholderFill }} />
      </Box>
    </Box>
  );
}

function BrowserPreview({ logoUrl, logoName, isDetailLoading }) {
  if (!logoUrl && !isDetailLoading) return null;

  const proxyUrl = logoUrl ? `/api/proxy-image?url=${encodeURIComponent(logoUrl)}` : null;

  const favicon = isDetailLoading ? (
    <Box sx={{ width: 14, height: 14, borderRadius: "3px", bgcolor: "rgba(128,128,128,0.2)", flexShrink: 0 }} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={proxyUrl} alt="" style={{ width: 14, height: 14, objectFit: "contain", flexShrink: 0 }} />
  );

  const tabLabel = isDetailLoading ? "" : (logoName ?? "");

  return (
    <Box>
      <Typography variant="overline" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
        Favicon Preview
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        How the .ico will appear as a favicon in browser tabs and address bars in both light and dark modes.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            <BrowserWindow favicon={favicon} tabLabel={tabLabel} isDark={false} />
          </motion.div>
          <Typography variant="caption" color="text.secondary">
            Light mode
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            <BrowserWindow favicon={favicon} tabLabel={tabLabel} isDark={true} />
          </motion.div>
          <Typography variant="caption" color="text.secondary">
            Dark mode
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

function IcoGeneratorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialLogoId = searchParams.get("logo");
  const { logos, selectedLogo, isLoading, isDetailLoading, selectLogo, fetchError } = useAllProductLogos({ initialLogoId });
  const { setToast } = useToast();

  const [selectedSizes, setSelectedSizes] = useState(DEFAULT_SELECTED);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.length > 1 ? prev.filter((s) => s !== size) : prev
        : [...prev, size].sort((a, b) => a - b)
    );
  };

  const logoUrl = selectedLogo?.assets?.logo;

  const handleGenerate = useCallback(async () => {
    if (!logoUrl || selectedSizes.length === 0) return;
    setIsGenerating(true);
    setError(null);

    try {
      const blob = await fetchSvgAsBlob(logoUrl);
      const objectUrl = URL.createObjectURL(blob);

      // Rasterize sequentially to avoid concurrent blob URL reads on some browsers
      const entries = [];
      for (const size of selectedSizes) {
        entries.push(await rasterize(objectUrl, size));
      }

      URL.revokeObjectURL(objectUrl);

      const icoBlob = buildIco(entries);
      const logoName = (selectedLogo?.name ?? "logo").replace(/\s+/g, "_");

      const a = document.createElement("a");
      a.href = URL.createObjectURL(icoBlob);
      a.download = `${logoName}.ico`;
      a.click();
      URL.revokeObjectURL(a.href);

      captureEvent("ico_generated", {
        logo_id: selectedLogo?.id,
        logo_name: selectedLogo?.name,
        sizes: selectedSizes,
        total_sizes: selectedSizes.length,
      });

      setToast({
        open: true,
        type: "success",
        message: `${selectedLogo?.name}.ico downloaded with ${selectedSizes.length} size${selectedSizes.length !== 1 ? "s" : ""}`,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong generating the .ico file.");
    } finally {
      setIsGenerating(false);
    }
  }, [logoUrl, selectedSizes, selectedLogo, setToast]);

  if (isLoading) return <Loader />;

  return (
    <VpnGate error={fetchError} title="ICO Generator">
    <Box sx={{ display: "flex", height: "calc(100vh - 64px)", overflow: "hidden" }}>
      {/* Fixed sidebar */}
      <ProductLogoSidebar
        logos={logos}
        selectedLogo={selectedLogo}
        onSelect={(logo) => {
          captureEvent("ico_logo_selected", { logo_id: logo.id, logo_name: logo.name });
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
          <Box
            onClick={() => router.push("/utilities")}
            sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 2, cursor: "pointer", color: "text.secondary", "&:hover": { color: "text.primary" }, transition: "color 0.15s" }}
          >
            <ArrowLeft size={14} />
            <Typography variant="body2" fontWeight={500}>Utilities</Typography>
          </Box>
          <Typography variant="h4" fontWeight={700} mb={0.5}>
            Favicon Generator
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Generate a single <code>.ico</code> file with multiple sizes embedded, perfect for favicons and Windows app icons.
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
                  Select a product logo from the sidebar to preview and generate a complete .ico file with multiple embedded resolutions.
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
                <Box sx={{ p: { xs: 3, md: 4 }, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4, ...scrollbarSx }}>
                  
                  {/* Logo Info */}
                  <Box>
                    <Typography variant="overline" color="text.secondary" fontWeight={600} display="block" mb={1.5}>
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

                  {/* Sizes */}
                  <Box>
                    <Typography variant="overline" color="text.secondary" fontWeight={600} display="block" mb={1.5}>
                      Sizes to Embed ({selectedSizes.length} selected)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      All selected sizes will be embedded in a single .ico file. Standard favicons use 16, 32, and 48px.
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {ALL_SIZES.map((size) => (
                        <SizeToggle
                          key={size}
                          size={size}
                          isSelected={selectedSizes.includes(size)}
                          onToggle={toggleSize}
                        />
                      ))}
                    </Box>
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
                    disabled={!logoUrl || selectedSizes.length === 0 || isGenerating}
                    sx={{ borderRadius: 2 }}
                  >
                    {isGenerating ? "Generating .ico…" : "Generate & Download .ico"}
                  </Button>
                </Box>
              </Box>

              {/* Right Column: Previews */}
              <Box sx={{ flex: 1, p: { xs: 3, md: 5 }, overflowY: "auto", display: "flex", flexDirection: "column", gap: 5, ...scrollbarSx }}>
                 <BrowserPreview logoUrl={logoUrl} logoName={selectedLogo?.name} isDetailLoading={isDetailLoading} />
              </Box>

            </Box>
          )}
        </Box>
      </Box>
    </Box>
    </VpnGate>
  );
}

export default IcoGeneratorPage;
