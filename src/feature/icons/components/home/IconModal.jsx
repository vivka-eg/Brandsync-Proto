"use client";
import {
  Box,
  CircularProgress,
  Paper,
  IconButton,
  Stack,
  Typography,
  Slider,
  Chip,
  useTheme,
  alpha,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowCounterClockwise,
  Check,
  Copy,
  DownloadSimple,
  X,
} from "phosphor-react";
import Image from "next/image";
import { CustomChip } from "@/constants";
import { getIcons } from "@/api/icons/icons";
import { getObjectURLFromSVG } from "@/utils/assets";
import CustomIconButton from "@/components/shared/IconButton";
import { captureEvent } from "@/lib/analytics/posthog";
import { useHomePageContext } from "../../context/HomePageContext";
import { BRAND_COLOURS } from "@/constants/assets";

// ─── Brand Colour Picker ──────────────────────────────────────────────────────

const BrandColourPicker = ({ selectedColor, setSelectedColor }) => {
  const theme = useTheme();
  const defaultColor = theme.palette.mode === "dark" ? "#ffffff" : "#000000";
  const isDefault = selectedColor === defaultColor;

  return (
    <Stack spacing={1.5} sx={{ width: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          variant="subtitle1"
          fontWeight={600}
          color="action.active"
          sx={{ fontSize: "20px" }}
        >
          Pick a Color
        </Typography>

        <Tooltip title="Reset to default">
          <span>
            <IconButton
              onClick={() => setSelectedColor(defaultColor)}
              disabled={isDefault}
              size="small"
              sx={{
                width: 32,
                height: 32,
                backgroundColor: alpha(theme.palette.action.active, 0.08),
                color: "action.active",
                border: `1px solid ${alpha(theme.palette.action.active, 0.2)}`,
                "&:hover": { backgroundColor: alpha(theme.palette.action.active, 0.16) },
                "&:disabled": {
                  backgroundColor: alpha(theme.palette.action.disabled, 0.05),
                  color: "action.disabled",
                  border: `1px solid ${alpha(theme.palette.action.disabled, 0.1)}`,
                },
                transition: "all 0.2s ease",
              }}
            >
              <ArrowCounterClockwise size={16} weight="bold" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      {/* Default swatch */}
      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
        <Tooltip title="Default" placement="top">
          <Box
            component="button"
            onClick={() => setSelectedColor(defaultColor)}
            aria-label="Default colour"
            sx={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              bgcolor: defaultColor,
              border: "2px solid",
              borderColor: isDefault ? "primary.main" : alpha(theme.palette.divider, 0.6),
              outline: isDefault ? `2px solid ${theme.palette.primary.main}` : "none",
              outlineOffset: 2,
              cursor: "pointer",
              padding: 0,
              flexShrink: 0,
              transition: "outline 0.15s ease, border-color 0.15s ease",
              boxShadow: defaultColor === "#ffffff" ? `0 0 0 1px ${theme.palette.divider} inset` : undefined,
            }}
          />
        </Tooltip>

        {/* 14 brand colour swatches */}
        {BRAND_COLOURS.map(({ name, hex }) => (
          <Tooltip key={hex} title={name} placement="top">
            <Box
              component="button"
              onClick={() => setSelectedColor(hex)}
              aria-label={`Select ${name}`}
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                bgcolor: hex,
                border: "2px solid transparent",
                outline: selectedColor === hex ? `2px solid ${hex}` : "none",
                outlineOffset: 2,
                cursor: "pointer",
                padding: 0,
                flexShrink: 0,
                transition: "outline 0.15s ease",
              }}
            />
          </Tooltip>
        ))}
      </Stack>

      {/* Current colour preview + name */}
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box
          sx={{
            width: 22,
            height: 22,
            borderRadius: 1,
            bgcolor: selectedColor,
            border: "1px solid",
            borderColor: "divider",
            flexShrink: 0,
          }}
        />
        <Typography
          variant="caption"
          sx={{ fontFamily: "monospace", color: "text.secondary", letterSpacing: 0.5 }}
        >
          {(() => {
            if (isDefault) return "Default";
            const match = BRAND_COLOURS.find((c) => c.hex.toLowerCase() === selectedColor.toLowerCase());
            return match ? match.name : selectedColor.toUpperCase();
          })()}
        </Typography>
      </Stack>
    </Stack>
  );
};

// ─── Size Slider ──────────────────────────────────────────────────────────────

const SIZE_STEPS = [16, 24, 32, 48, 64, 128, 256, 512];

function SizeSlider({ size, setSize }) {
  const currentIndex =
    SIZE_STEPS.indexOf(size) !== -1
      ? SIZE_STEPS.indexOf(size)
      : SIZE_STEPS.findIndex((s) => s >= size) ?? SIZE_STEPS.length - 1;

  const marks = SIZE_STEPS.map((v, i) => ({ value: i, label: String(v) }));

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="subtitle1"
        gutterBottom
        color="action.active"
        fontWeight={600}
        sx={{ fontSize: "20px" }}
      >
        Choose a size
      </Typography>

      <Slider
        value={currentIndex}
        onChange={(e, newIndex) => setSize(SIZE_STEPS[newIndex])}
        aria-labelledby="size-slider"
        step={1}
        marks={marks}
        min={0}
        max={SIZE_STEPS.length - 1}
        valueLabelDisplay="on"
        valueLabelFormat={(index) => SIZE_STEPS[index]}
        sx={{
          color: "action.active",
          height: 4,
          mt: "16px",
          mb: "32px",
          "& .MuiSlider-thumb": { width: 14, height: 14, backgroundColor: "action.active" },
          "& .MuiSlider-valueLabel": {
            backgroundColor: "action.active",
            color: "#fff",
            borderRadius: "4px",
            fontSize: "0.75rem",
          },
          "& .MuiSlider-markLabel": { fontSize: "0.65rem", color: "text.secondary" },
        }}
      />
    </Box>
  );
}

// ─── Stroke Slider ────────────────────────────────────────────────────────────

const STROKE_STEPS = [0, 0.5, 1, 1.5, 2];

function StrokeSlider({ stroke, setStroke }) {
  const marks = STROKE_STEPS.map((v) => ({ value: v, label: String(v) }));

  return (
    <Box sx={{ width: "100%", marginTop: "24px" }}>
      <Typography
        variant="subtitle1"
        gutterBottom
        fontWeight={600}
        color="action.active"
        sx={{ fontSize: "20px" }}
      >
        Edit Stroke
      </Typography>

      <Slider
        value={stroke}
        onChange={(e, newValue) => setStroke(newValue)}
        min={0}
        max={2}
        step={null}
        marks={marks}
        valueLabelDisplay="on"
        sx={{
          color: "action.active",
          height: 4,
          mt: "16px",
          mb: "32px",
          "& .MuiSlider-thumb": { width: 14, height: 14, backgroundColor: "action.active" },
          "& .MuiSlider-valueLabel": {
            backgroundColor: "action.active",
            color: "#fff",
            borderRadius: "4px",
            fontSize: "0.75rem",
          },
          "& .MuiSlider-markLabel": { fontSize: "0.65rem", color: "text.secondary" },
          "& .MuiSlider-track": { border: "none" },
          "& .MuiSlider-rail": { opacity: 0.3, backgroundColor: "#ccc" },
        }}
      />
    </Box>
  );
}

// ─── Download Formats ─────────────────────────────────────────────────────────

function DownloadFormats({ selectedFormat, setSelectedFormat }) {
  const formats = ["svg", "png"];

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Typography
        variant="subtitle1"
        gutterBottom
        fontWeight={600}
        color="action.active"
        sx={{ fontSize: "20px" }}
      >
        Download Formats
      </Typography>
      <Stack spacing={2} direction="row" sx={{ width: "100%" }} useFlexGap>
        {formats.map((format) => (
          <Chip
            key={format}
            label={format.toUpperCase()}
            sx={{
              bgcolor: selectedFormat === format ? "action.active" : "neutral.container",
              color: selectedFormat === format ? "#fff" : "text.body",
              ":hover": { bgcolor: "neutral.hover", color: "text.body" },
            }}
            onClick={() => setSelectedFormat(format)}
          />
        ))}
      </Stack>
    </Stack>
  );
}

// ─── Download Preview ─────────────────────────────────────────────────────────
// Shows a live rasterised thumbnail of what the PNG output will look like at
// the selected size/colour. Uses an off-screen canvas to convert the SVG blob
// URL to a data URL, then displays it on a checkerboard background that makes
// transparency obvious.

const PREVIEW_DISPLAY = 80; // px – display size in the panel

function DownloadPreview({ svgContent, selectedFormat, size }) {
  const canvasRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [generating, setGenerating] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (selectedFormat !== "png") {
      setPreviewUrl(null);
      return;
    }

    let objectUrl;
    setGenerating(true);

    // Ensure the SVG carries its XML namespace so browsers accept it as an
    // <img> source (required for cross-origin-safe canvas drawImage).
    const svgWithNs = /xmlns\s*=/.test(svgContent)
      ? svgContent
      : svgContent.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');

    const blob = new Blob([svgWithNs], { type: "image/svg+xml" });
    objectUrl = URL.createObjectURL(blob);

    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);
      setPreviewUrl(canvas.toDataURL("image/png"));
      setGenerating(false);
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      setGenerating(false);
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  }, [svgContent, selectedFormat, size]);

  if (selectedFormat === "svg") return null;

  const isDark = theme.palette.mode === "dark";
  const checkA = isDark ? "#252525" : "#e8e8e8";
  const checkB = isDark ? "#1a1a1a" : "#f5f5f5";

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ mb: 1.5, fontWeight: 600 }}
      >
        {selectedFormat === "png" ? "PNG Preview" : "Preview"}
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{
          p: 1.5,
          borderRadius: 1.5,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        {/* Checkerboard shows transparency naturally */}
        <Box
          sx={{
            width: PREVIEW_DISPLAY,
            height: PREVIEW_DISPLAY,
            borderRadius: 1,
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
            background: `repeating-conic-gradient(${checkA} 0% 25%, ${checkB} 0% 50%) 0 0 / 12px 12px`,
          }}
        >
          {generating && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={18} sx={{ color: "action.disabled" }} />
            </Box>
          )}
          {previewUrl && !generating && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Download preview"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          )}
        </Box>

        <Stack spacing={0.5}>
          <Typography variant="body2" fontWeight={600} color="text.primary">
            {size} × {size} px
          </Typography>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.65rem" }}
          >
            {selectedFormat}
          </Typography>
        </Stack>
      </Stack>

      {/* Off-screen canvas used only for rasterisation */}
      <canvas ref={canvasRef} style={{ display: "none" }} aria-hidden />
    </Box>
  );
}

// ─── Action Buttons ───────────────────────────────────────────────────────────

function ActionButtons({ selectedIcon, selectedFormat, svgContent, size }) {
  const [svgCopied, setSvgCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(selectedIcon.svg_content)
      .then(() => {
        setSvgCopied(true);
        setTimeout(() => setSvgCopied(false), 1000);
      })
      .catch((err) => console.error("Failed to copy SVG content:", err));
  };

  const handleDownload = async () => {
    try {
      let blob;
      if (selectedFormat === "svg") {
        blob = new Blob([svgContent], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedIcon.name}.svg`;
        a.click();
        URL.revokeObjectURL(url);
        captureEvent("icon_downloaded", {
          icon_id: selectedIcon.id,
          icon_name: selectedIcon.name,
          format: "svg",
          source: "modal",
        });
      } else if (selectedFormat === "png") {
        // Rasterise client-side using canvas
        const svgWithNs = /xmlns\s*=/.test(svgContent)
          ? svgContent
          : svgContent.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
        const svgBlob = new Blob([svgWithNs], { type: "image/svg+xml" });
        const objectUrl = URL.createObjectURL(svgBlob);
        await new Promise((resolve, reject) => {
          const img = new window.Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            canvas.getContext("2d").drawImage(img, 0, 0, size, size);
            canvas.toBlob((pngBlob) => {
              const url = URL.createObjectURL(pngBlob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${selectedIcon.name}.png`;
              a.click();
              URL.revokeObjectURL(url);
              URL.revokeObjectURL(objectUrl);
              captureEvent("icon_downloaded", {
                icon_id: selectedIcon.id,
                icon_name: selectedIcon.name,
                format: "png",
                size_px: size,
                source: "modal",
              });
              resolve();
            }, "image/png");
          };
          img.onerror = reject;
          img.src = objectUrl;
        });
      }
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <Stack direction="row" spacing={2}>
      <CustomIconButton
        onClick={handleDownload}
        Icon={DownloadSimple}
        text={`Download ${selectedFormat.toUpperCase()}`}
        sx={{ flex: 1 }}
      />
      <CustomIconButton
        onClick={handleCopy}
        Icon={svgCopied ? Check : Copy}
        text="Copy SVG"
        variant="secondary"
        sx={{ flex: 1 }}
      />
    </Stack>
  );
}

// ─── Mini Icon Card (suggested icons) ────────────────────────────────────────

const MiniIconCard = ({ icon, onClick, svgColour }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const defaultColour = mode === "dark" ? "#fff" : "#000";
  const isMonochrome = icon.type?.toLowerCase() === "monochrome";
  const resolvedColour = svgColour ?? defaultColour;
  const brandColour = (() => {
    const brand = BRAND_COLOURS.find((c) => c.hex.toLowerCase() === resolvedColour.toLowerCase());
    if (brand) return brand;
    return { hex: resolvedColour, secondary: "#9CA3AF" };
  })();
  const updatedSVGContent = isMonochrome
    ? updateSVGColorMonochrome(icon.svg_content, brandColour.hex, brandColour.secondary)
    : updateSVGColor(icon.svg_content, resolvedColour);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "20px",
        backgroundColor: "background.default",
        "&:hover": { backgroundColor: "neutral.light" },
        ":active": { backgroundColor: "neutral.container" },
        transition: "background-color 0.2s ease-in-out",
        p: "20px",
      }}
      onClick={onClick}
    >
      <Image
        src={getObjectURLFromSVG(updatedSVGContent)}
        alt={icon.name}
        width={56}
        height={56}
      />
    </Paper>
  );
};

function SuggestedIcons({ suggestedIcons, onIconSelect, svgColour, activeTag, loading }) {
  return (
    <Stack spacing={2} sx={{ marginTop: "24px" }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="h5" fontWeight={600} color="action.active">
          {activeTag ? `Tagged "${activeTag.name}"` : "More like this"}
        </Typography>
        {loading && <CircularProgress size={16} sx={{ color: "text.disabled" }} />}
      </Stack>

      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {suggestedIcons.map((icon, index) => (
          <MiniIconCard icon={icon} key={index} onClick={() => onIconSelect(icon)} svgColour={svgColour} />
        ))}
      </Stack>
    </Stack>
  );
}

// ─── SVG manipulation helpers ─────────────────────────────────────────────────

function smartSVGColorManipulation(svgString, newColor) {
  const colorValue = newColor.startsWith("#") ? newColor : `#${newColor}`;
  const shouldSkipColor = (color) => {
    const c = color.trim().toLowerCase();
    return c === "none" || c === "transparent" || c === "inherit" || c === "currentcolor";
  };

  let result = svgString;
  const hasExplicitFill = !!svgString.match(/fill\s*[:=]/gi);
  const hasExplicitStroke = !!svgString.match(/stroke\s*[:=]/gi);
  const hasStyleColors = !!svgString.match(/style\s*=.*?(?:fill|stroke)\s*:/gi);

  result = result.replace(/style\s*=\s*["']([^"']*?)["']/gi, (match, styleContent) => {
    let newStyle = styleContent;
    if (/fill\s*:/i.test(styleContent))
      newStyle = newStyle.replace(/fill\s*:\s*([^;]+)/gi, (m, c) =>
        shouldSkipColor(c) ? m : `fill: ${colorValue}`);
    if (/stroke\s*:/i.test(styleContent))
      newStyle = newStyle.replace(/stroke\s*:\s*([^;]+)/gi, (m, c) =>
        shouldSkipColor(c) ? m : `stroke: ${colorValue}`);
    return `style="${newStyle}"`;
  });

  result = result.replace(/fill\s*=\s*["']([^"']+)["']/gi, (match, c) =>
    shouldSkipColor(c) ? match : `fill="${colorValue}"`);
  result = result.replace(/stroke\s*=\s*["']([^"']+)["']/gi, (match, c) =>
    shouldSkipColor(c) ? match : `stroke="${colorValue}"`);
  result = result.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, css) => {
    let newCSS = css;
    if (/fill\s*:/i.test(css))
      newCSS = newCSS.replace(/fill\s*:\s*([^;}\s]+)/gi, (m, c) =>
        shouldSkipColor(c) ? m : `fill: ${colorValue}`);
    if (/stroke\s*:/i.test(css))
      newCSS = newCSS.replace(/stroke\s*:\s*([^;}\s]+)/gi, (m, c) =>
        shouldSkipColor(c) ? m : `stroke: ${colorValue}`);
    return match.replace(css, newCSS);
  });

  if (!hasExplicitFill && !hasExplicitStroke && !hasStyleColors) {
    result = result.replace(
      /<(path|circle|rect|ellipse|polygon|polyline|line)(\s[^>]*?)(\s*\/?>)/gi,
      (match, el, attrs, closing) =>
        /(?:fill|stroke|style)\s*=/i.test(attrs) ? match : `<${el}${attrs} fill="${colorValue}"${closing}`
    );
  }

  return result;
}

function updateSVGColor(svgString, newColor) {
  return smartSVGColorManipulation(svgString, newColor);
}

function extractSVGFills(svgString) {
  const skip = new Set(["none", "transparent", "inherit", "currentcolor", ""]);
  const fills = new Set();
  const addColour = (c) => { const n = c.trim().toLowerCase(); if (!skip.has(n)) fills.add(n); };
  [...(svgString.matchAll(/fill\s*=\s*["']([^"']+)["']/gi) ?? [])].forEach((m) => addColour(m[1]));
  [...(svgString.matchAll(/fill\s*:\s*([^;}"'\s]+)/gi) ?? [])].forEach((m) => addColour(m[1]));
  const luminance = (hex) => {
    const h = hex.replace("#", "").padEnd(6, "0");
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  return [...fills]
    .filter((c) => /^#[0-9a-f]{3,8}$/i.test(c) || /^rgb/i.test(c))
    .sort((a, b) => luminance(a) - luminance(b));
}

function updateSVGColorMonochrome(svgString, primaryHex, secondaryHex) {
  const fills = extractSVGFills(svgString);
  if (fills.length === 0) return updateSVGColor(svgString, primaryHex);
  if (fills.length === 1) return updateSVGColor(svgString, primaryHex);
  const replace = (str, from, to) => {
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return str
      .replace(new RegExp(`(fill\\s*=\\s*["'])${escaped}(["'])`, "gi"), `$1${to}$2`)
      .replace(new RegExp(`(fill\\s*:\\s*)${escaped}([;}"'\\s])`, "gi"), `$1${to}$2`);
  };
  // fills[0] darkest → primary; all others → secondary (lightest-first to avoid collisions)
  let result = svgString;
  for (let i = fills.length - 1; i >= 1; i--) {
    result = replace(result, fills[i], secondaryHex);
  }
  result = replace(result, fills[0], primaryHex);
  return result;
}

function updateSvgSize(svgContent, size) {
  let result = svgContent;
  if (/<svg[^>]*\swidth\s*=\s*"\d+(\.\d+)?"/i.test(result)) {
    result = result.replace(/(<svg[^>]*\s)width\s*=\s*"\d+(\.\d+)?"/i, `$1width="${size}"`);
  } else {
    result = result.replace(/<svg([^>]*)>/i, `<svg$1 width="${size}">`);
  }
  if (/<svg[^>]*\sheight\s*=\s*"\d+(\.\d+)?"/i.test(result)) {
    result = result.replace(/(<svg[^>]*\s)height\s*=\s*"\d+(\.\d+)?"/i, `$1height="${size}"`);
  } else {
    result = result.replace(/<svg([^>]*)>/i, `<svg$1 height="${size}">`);
  }
  return result;
}

function updateSVGStrokeWidth(svgString, newStrokeWidth) {
  const val = newStrokeWidth.toString();
  let result = svgString;

  result = result.replace(/style\s*=\s*["']([^"']*?)["']/gi, (match, styleContent) => {
    let newStyle = styleContent;
    if (/stroke-width\s*:/i.test(styleContent))
      newStyle = newStyle.replace(/stroke-width\s*:\s*([^;]+)/gi, `stroke-width: ${val}`);
    return `style="${newStyle}"`;
  });

  result = result.replace(/stroke-width\s*=\s*["']([^"']+)["']/gi, `stroke-width="${val}"`);

  result = result.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, css) => {
    let newCSS = css;
    if (/stroke-width\s*:/i.test(css))
      newCSS = newCSS.replace(/stroke-width\s*:\s*([^;}\s]+)/gi, `stroke-width: ${val}`);
    return match.replace(css, newCSS);
  });

  return result;
}

function hasSVGStroke(svgString) {
  const isValid = (color) => {
    const c = color.trim().toLowerCase();
    return c !== "none" && c !== "transparent" && c !== "inherit" && c !== "currentcolor" && c !== "";
  };

  const direct = svgString.match(/stroke\s*=\s*["']([^"']+)["']/gi);
  if (direct) return direct.some((m) => isValid(m.match(/stroke\s*=\s*["']([^"']+)["']/i)[1]));

  const styleStroke = svgString.match(/style\s*=\s*["'][^"']*stroke\s*:\s*([^;"']+)[^"']*["']/gi);
  if (styleStroke) return styleStroke.some((m) => isValid(m.match(/stroke\s*:\s*([^;"']+)/i)[1]));

  const inCSS = svgString.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  if (inCSS) {
    return inCSS.some((tag) => {
      const css = tag.match(/<style[^>]*>([\s\S]*?)<\/style>/i)[1];
      const rules = css.match(/stroke\s*:\s*([^;}\s]+)/gi);
      return rules?.some((r) => isValid(r.match(/stroke\s*:\s*([^;}\s]+)/i)[1]));
    });
  }

  return false;
}

// ─── Icon Customization Panel ─────────────────────────────────────────────────

const IconCustomization = ({ selectedIcon, setOpenModal }) => {
  const theme = useTheme();
  const defaultColor = theme.palette.mode === "dark" ? "#ffffff" : "#000000";
  const { previewColour } = useHomePageContext();
  const initialBrandColour = previewColour ? BRAND_COLOURS.find((c) => c.key === previewColour) : null;
  // Monochrome with a palette: open with default (palette is applied via two-colour logic)
  // Non-monochrome: open with the primary hex of the selected palette, or default
  const isMonochromeType = selectedIcon.type?.toLowerCase() === "monochrome";
  const initialColor = isMonochromeType
    ? defaultColor
    : (initialBrandColour?.hex ?? defaultColor);

  const [currentIcon, setCurrentIcon] = useState(selectedIcon);
  const [size, setSize] = useState(128);
  const [stroke, setStroke] = useState(0.5);
  const [selectedFormat, setSelectedFormat] = useState("svg");
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [svgContent, setSvgContent] = useState(selectedIcon.svg_content);
  const [suggestedIcons, setSuggestedIcons] = useState([]);
  const [activeTag, setActiveTag] = useState(null);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  const isStrokeSVG = hasSVGStroke(currentIcon.svg_content);
  const isMonochrome = currentIcon.type?.toLowerCase() === "monochrome";
  // For monochrome icons, resolve primary + secondary.
  // Brand colour → use its 500/200 shades.
  // Default (black/white) → primary is the selected colour, secondary is a mid-grey.
  const selectedBrandColour = (() => {
    const brand = BRAND_COLOURS.find((c) => c.hex.toLowerCase() === selectedColor.toLowerCase());
    if (brand) return brand;
    const isDark = selectedColor.toLowerCase() === "#ffffff";
    return {
      hex: selectedColor,
      secondary: isDark ? "#9CA3AF" : "#9CA3AF",
    };
  })();

  const fetchSuggested = (tagIds, typeId) => {
    if (!tagIds?.length) return;
    setSuggestionsLoading(true);
    const filters = { icon_tags: { documentId: { $in: tagIds } } };
    if (typeId) filters.icon_type = { documentId: { $eq: typeId } };
    getIcons({
      filters,
      pagination: { pageSize: 20 },
      populate: "*",
    })
      .then((response) => {
        setSuggestedIcons(
          (response.data ?? []).map((icon) => ({
            id: icon.documentId,
            name: icon.icon_name,
            src: getObjectURLFromSVG(icon.icon_content),
            svg_content: icon.icon_content,
            type: icon.icon_type?.type_name ?? "",
            typeId: icon.icon_type?.documentId ?? null,
            tags: (icon.icon_tags ?? []).map((t) => ({ id: t.documentId, name: t.tag_name })),
            categories: (icon.icon_category ?? []).map((c) => ({ id: c.documentId, name: c.category_name })),
          }))
        );
      })
      .catch(() => {})
      .finally(() => setSuggestionsLoading(false));
  };

  const handleTagClick = (tag) => {
    if (activeTag?.id === tag.id) {
      setActiveTag(null);
      fetchSuggested(selectedIcon.tags.map((t) => t.id), currentIcon.typeId);
    } else {
      setActiveTag(tag);
      fetchSuggested([tag.id], currentIcon.typeId);
    }
  };

  const handleIconSelect = (icon) => {
    setCurrentIcon(icon);
    setSvgContent(icon.svg_content);
    setActiveTag(null);
    fetchSuggested(icon.tags?.map((t) => t.id), icon.typeId);
    document.querySelector("[data-modal-scroll]")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const base = currentIcon.svg_content;
    const sized = updateSvgSize(base, size);
    const colored = isMonochrome && selectedBrandColour
      ? updateSVGColorMonochrome(sized, selectedBrandColour.hex, selectedBrandColour.secondary)
      : smartSVGColorManipulation(sized, selectedColor);
    const stroked = updateSVGStrokeWidth(colored, stroke);
    setSvgContent(stroked);
  }, [currentIcon, size, stroke, selectedColor, isMonochrome, selectedBrandColour]);

  useEffect(() => {
    fetchSuggested(selectedIcon.tags?.map((t) => t.id), selectedIcon.typeId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Header */}
      <Stack spacing={2} direction="row">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIcon.id ?? currentIcon.name}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            style={{ flex: 1 }}
          >
            <Typography variant="h6" fontWeight={600}>
              {currentIcon.name}
            </Typography>
            {currentIcon.type && (
              <Typography
                variant="caption"
                sx={{
                  display: "inline-block",
                  mt: 0.5,
                  px: 1,
                  py: 0.25,
                  borderRadius: "4px",
                  bgcolor: "neutral.container",
                  color: "text.secondary",
                  fontWeight: 500,
                  fontSize: "11px",
                  letterSpacing: "0.04em",
                }}
              >
                {currentIcon.type}
              </Typography>
            )}
          </motion.div>
        </AnimatePresence>
        <X
          size={24}
          weight="bold"
          onClick={() => setOpenModal(false)}
          style={{ cursor: "pointer", flexShrink: 0 }}
        />
      </Stack>

      {/* Preview + Customization */}
      <Stack direction="row" sx={{ marginTop: "16px", width: "100%" }}>
        {/* Preview */}
        <Stack flex={1} minWidth={0}>
          <Box sx={{ p: "32px", height: "400px", width: "100%", flexShrink: 0 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIcon.id ?? currentIcon.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    "& svg": { maxWidth: "100%", maxHeight: "100%" },
                  }}
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              </motion.div>
            </AnimatePresence>
          </Box>
          {currentIcon.tags?.length > 0 && (
            <Stack spacing="16px">
              <Typography variant="subtitle1" fontWeight={600}>
                Tags
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {currentIcon.tags.map((tag, index) => (
                  <Box key={index} onClick={() => handleTagClick(tag)} sx={{ cursor: "pointer" }}>
                    <CustomChip
                      label={tag.name}
                      variant="default"
                      sx={{
                        cursor: "pointer",
                        ...(activeTag?.id === tag.id && {
                          bgcolor: "action.active",
                          color: "common.white",
                        }),
                        "&:hover": { opacity: 0.8 },
                        transition: "opacity 0.15s ease, background-color 0.15s ease",
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Stack>
          )}
        </Stack>

        {/* Controls */}
        <Stack flexShrink={0} width={420} spacing="24px" pl="24px">
          <BrandColourPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
          <SizeSlider size={size} setSize={setSize} />
          {isStrokeSVG && <StrokeSlider stroke={stroke} setStroke={setStroke} />}
          <DownloadFormats selectedFormat={selectedFormat} setSelectedFormat={setSelectedFormat} />
          <DownloadPreview svgContent={svgContent} selectedFormat={selectedFormat} size={size} />
          <ActionButtons
            selectedIcon={currentIcon}
            selectedFormat={selectedFormat}
            svgContent={svgContent}
            size={size}
          />
        </Stack>
      </Stack>

      {/* More like this */}
      <SuggestedIcons suggestedIcons={suggestedIcons} onIconSelect={handleIconSelect} svgColour={selectedColor} activeTag={activeTag} loading={suggestionsLoading} />
    </>
  );
};

// ─── Modal wrapper ────────────────────────────────────────────────────────────

const MotionPaper = motion.create(Paper);

function IconModal({ openModal, setOpenModal, selectedIcon }) {
  useEffect(() => {
    if (!openModal) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [openModal]);

  if (!openModal || !selectedIcon) return null;

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1300,
        bgcolor: "rgba(0, 0, 0, 0.5)",
        overflow: "hidden",
      }}
    >
      <MotionPaper
        data-modal-scroll
        sx={{
          bgcolor: "background.default",
          borderRadius: "12px",
          padding: "24px",
          height: "95vh",
          width: "1000px",
          minWidth: "600px",
          maxWidth: "95vw",
          maxHeight: "95vh",
          overflowY: "auto",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={(e) => e.stopPropagation()}
      >
        <IconCustomization
          selectedIcon={selectedIcon}
          setOpenModal={setOpenModal}
        />
      </MotionPaper>
    </Box>
  );
}

export default IconModal;
