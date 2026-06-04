"use client";

import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Box,
  Checkbox,
  Chip,
  Collapse,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ArrowSquareOut,
  CaretDown,
  CaretUp,
  Check,
  ClockCounterClockwise,
  Copy,
  DownloadSimple,
  TextT,
} from "phosphor-react";
import { alpha } from "@mui/material/styles";
import useHomePageIcons from "../../hooks/useHomePageIcons";
import useRecentlyViewed from "../../hooks/useRecentlyViewed";
import { useHomePageContext } from "../../context/HomePageContext";
import Image from "next/image";
import IconModal from "./IconModal";
import IconsEmptyState from "./IconsEmptyState";
import { downloadIcon } from "@/api/icons/icons";
import { captureEvent } from "@/lib/analytics/posthog";
import { BRAND_COLOURS } from "@/constants/assets";

// ─── Density config ───────────────────────────────────────────────────────────

const DENSITY_CONFIG = {
  compact:     { iconSize: 32, padding: "10px", cardSize: 52,  copySize: 14, gap: 1 },
  comfortable: { iconSize: 56, padding: "32px", cardSize: 120, copySize: 22, gap: 2 },
  spacious:    { iconSize: 72, padding: "44px", cardSize: 160, copySize: 24, gap: 2 },
};

// Keyed lookup derived from the single source of truth
const BRAND_COLOUR_HEX = Object.fromEntries(
  BRAND_COLOURS.map((c) => [c.key, { primary: c.hex, secondary: c.secondary }])
);

// Extract all distinct non-transparent fill colours from an SVG, sorted darkest→lightest
function extractSVGFills(svgString) {
  const skip = new Set(["none", "transparent", "inherit", "currentcolor", ""]);
  const fills = new Set();

  const addColour = (c) => {
    const n = c.trim().toLowerCase();
    if (!skip.has(n)) fills.add(n);
  };

  // attribute fills
  [...(svgString.matchAll(/fill\s*=\s*["']([^"']+)["']/gi) ?? [])].forEach((m) => addColour(m[1]));
  // inline style fills
  [...(svgString.matchAll(/fill\s*:\s*([^;}"'\s]+)/gi) ?? [])].forEach((m) => addColour(m[1]));

  // Sort by luminance: darkest first (primary), lightest last (secondary)
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

// Recolour a monochrome SVG: darkest fill → primary, all others → secondary.
// Replaces every distinct fill so no original colour bleeds through.
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

  // fills[0] is darkest → primary; everything else → secondary.
  // Replace lightest-first so intermediate shades don't collide with the primary swap.
  let result = svgString;
  for (let i = fills.length - 1; i >= 1; i--) {
    result = replace(result, fills[i], secondaryHex);
  }
  result = replace(result, fills[0], primaryHex);
  return result;
}

// ─── Color utility (shared by all sub-components) ─────────────────────────────

// Module-level caches so repeated renders of the same icon never redo work.
// svgColorCache: `${svgString}::${color}` → colored SVG string
// blobUrlCache:  colored SVG string → stable blob URL
const svgColorCache = new Map();
const blobUrlCache  = new Map();

function updateSVGColor(svgString, newColor) {
  if (!svgString) return "";
  const colorValue = newColor.startsWith("#") ? newColor : `#${newColor}`;
  const cacheKey = `${svgString}::${colorValue}`;
  if (svgColorCache.has(cacheKey)) return svgColorCache.get(cacheKey);

  const shouldSkipColor = (color) => {
    const c = color.trim().toLowerCase();
    return c === "none" || c === "transparent" || c === "inherit" || c === "currentcolor";
  };

  let result = svgString;
  const hasExplicitFill   = !!svgString.match(/fill\s*[:=]/gi);
  const hasExplicitStroke = !!svgString.match(/stroke\s*[:=]/gi);
  const hasStyleColors    = !!svgString.match(/style\s*=.*?(?:fill|stroke)\s*:/gi);

  result = result.replace(/style\s*=\s*["']([^"']*?)["']/gi, (match, styleContent) => {
    let newStyle = styleContent;
    if (/fill\s*:/i.test(styleContent))
      newStyle = newStyle.replace(/fill\s*:\s*([^;]+)/gi, (m, c) => shouldSkipColor(c) ? m : `fill: ${colorValue}`);
    if (/stroke\s*:/i.test(styleContent))
      newStyle = newStyle.replace(/stroke\s*:\s*([^;]+)/gi, (m, c) => shouldSkipColor(c) ? m : `stroke: ${colorValue}`);
    return `style="${newStyle}"`;
  });

  result = result.replace(/fill\s*=\s*["']([^"']+)["']/gi,   (match, c) => shouldSkipColor(c) ? match : `fill="${colorValue}"`);
  result = result.replace(/stroke\s*=\s*["']([^"']+)["']/gi, (match, c) => shouldSkipColor(c) ? match : `stroke="${colorValue}"`);
  result = result.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, css) => {
    let newCSS = css;
    if (/fill\s*:/i.test(css))
      newCSS = newCSS.replace(/fill\s*:\s*([^;}\s]+)/gi,   (m, c) => shouldSkipColor(c) ? m : `fill: ${colorValue}`);
    if (/stroke\s*:/i.test(css))
      newCSS = newCSS.replace(/stroke\s*:\s*([^;}\s]+)/gi, (m, c) => shouldSkipColor(c) ? m : `stroke: ${colorValue}`);
    return match.replace(css, newCSS);
  });

  if (!hasExplicitFill && !hasExplicitStroke && !hasStyleColors) {
    result = result.replace(
      /<(path|circle|rect|ellipse|polygon|polyline|line)(\s[^>]*?)(\s*\/?>)/gi,
      (match, el, attrs, closing) =>
        /(?:fill|stroke|style)\s*=/i.test(attrs) ? match : `<${el}${attrs} fill="${colorValue}"${closing}`
    );
  }

  svgColorCache.set(cacheKey, result);
  return result;
}

function getCachedBlobUrl(svgString) {
  if (!svgString) return "";
  if (blobUrlCache.has(svgString)) return blobUrlCache.get(svgString);
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  blobUrlCache.set(svgString, url);
  return url;
}

// ─── Filter Summary Bar ───────────────────────────────────────────────────────

function FilterSummaryBar({ count, total, loading }) {
  const { categories, setCategories, styles, setStyles, previewColour, setPreviewColour } = useHomePageContext();

  const activeColourHex = previewColour ? BRAND_COLOUR_HEX[previewColour]?.primary : null;
  const activeColourName = previewColour
    ? previewColour.charAt(0).toUpperCase() + previewColour.slice(1)
    : null;

  const activeFilters = [
    ...categories.map((c) => ({ type: "category", label: c })),
    ...styles.map((s) => ({ type: "style", label: s })),
  ];

  const removeFilter = (type, label) => {
    if (type === "category") setCategories((prev) => prev.filter((c) => c !== label));
    else setStyles((prev) => prev.filter((s) => s !== label));
  };

  const clearAll = () => {
    setCategories([]);
    setStyles([]);
    setPreviewColour(null);
  };

  const totalActive = activeFilters.length + (previewColour ? 1 : 0);

  if (loading) return null;

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      flexWrap="wrap"
      useFlexGap
      sx={{ mb: 2, minHeight: 28 }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
        Showing{" "}
        <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
          {count}
        </Box>
        {total != null && count !== total && (
          <>
            {" of "}
            <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
              {total}
            </Box>
          </>
        )}{" "}
        icon{count !== 1 ? "s" : ""}
      </Typography>

      {activeFilters.map(({ type, label }) => (
        <Chip
          key={`${type}-${label}`}
          label={label}
          size="small"
          onDelete={() => removeFilter(type, label)}
          sx={{
            height: 22,
            fontSize: "11px",
            fontWeight: 500,
            bgcolor: "neutral.container",
          }}
        />
      ))}

      {activeColourHex && (
        <Chip
          icon={
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: activeColourHex,
                flexShrink: 0,
              }}
            />
          }
          label={activeColourName}
          size="small"
          onDelete={() => setPreviewColour(null)}
          sx={{
            height: 22,
            fontSize: "11px",
            fontWeight: 500,
            bgcolor: activeColourHex,
            color: "white",
            "& .MuiChip-deleteIcon": { color: "rgba(255,255,255,0.7)", "&:hover": { color: "white" } },
            "& .MuiChip-icon": { color: "white" },
          }}
        />
      )}

      {totalActive > 1 && (
        <Typography
          variant="caption"
          onClick={clearAll}
          sx={{
            cursor: "pointer",
            color: "text.disabled",
            textDecoration: "underline",
            "&:hover": { color: "text.secondary" },
          }}
        >
          Clear all
        </Typography>
      )}
    </Stack>
  );
}

// ─── Recently Viewed ─────────────────────────────────────────────────────────

const RecentlyViewedCard = ({ icon, onClick, brandPalette }) => {
  const theme = useTheme();
  const defaultColour = theme.palette.mode === "dark" ? "#FFFFFF" : "#000000";
  const isMonochrome = icon.type?.toLowerCase() === "monochrome";
  const resolvedPalette = brandPalette ?? { primary: defaultColour, secondary: "#9CA3AF" };
  const updatedSVG = isMonochrome
    ? updateSVGColorMonochrome(icon.svg_content, resolvedPalette.primary, resolvedPalette.secondary)
    : updateSVGColor(icon.svg_content, resolvedPalette.primary);

  return (
    <Tooltip title={icon.name} placement="bottom" arrow>
      <Box
        onClick={onClick}
        sx={{
          flexShrink: 0,
          width: 64,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.5,
          py: 1,
          px: 0.5,
          borderRadius: 1.5,
          border: "1px solid transparent",
          "&:hover": {
            bgcolor: "action.hover",
            borderColor: "divider",
          },
          transition: "all 0.15s ease",
        }}
      >
        <Image
          src={getCachedBlobUrl(updatedSVG)}
          alt={icon.name}
          width={28}
          height={28}
        />
        <Typography
          component="span"
          sx={{
            fontSize: "9px",
            color: "text.secondary",
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
            lineHeight: 1.2,
          }}
        >
          {icon.name}
        </Typography>
      </Box>
    </Tooltip>
  );
};

const RecentlyViewedSection = ({ icons, onIconClick, onClear, brandPalette }) => {
  const [collapsed, setCollapsed] = useState(false);

  if (icons.length === 0) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <ClockCounterClockwise
            size={14}
            weight="bold"
            style={{ opacity: 0.5, flexShrink: 0 }}
          />
          <Typography
            variant="caption"
            fontWeight={600}
            color="text.secondary"
            sx={{ letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "10px" }}
          >
            Recently Viewed
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center">
          <Box
            component="button"
            onClick={onClear}
            sx={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "text.disabled",
              fontSize: "11px",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              "&:hover": { color: "text.secondary", bgcolor: "action.hover" },
              transition: "all 0.15s ease",
            }}
          >
            Clear
          </Box>
          <IconButton
            size="small"
            onClick={() => setCollapsed((v) => !v)}
            sx={{ width: 24, height: 24 }}
          >
            {collapsed
              ? <CaretDown size={13} weight="bold" />
              : <CaretUp size={13} weight="bold" />
            }
          </IconButton>
        </Stack>
      </Stack>

      <Collapse in={!collapsed}>
        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            overflowX: "auto",
            pb: 0.5,
            "&::-webkit-scrollbar": { height: 4 },
            "&::-webkit-scrollbar-thumb": { borderRadius: 2, bgcolor: "divider" },
          }}
        >
          {icons.map((icon, i) => (
            <RecentlyViewedCard
              key={icon.id ?? i}
              icon={icon}
              brandPalette={brandPalette}
              onClick={() => onIconClick(icon)}
            />
          ))}
        </Stack>
      </Collapse>

      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

// ─── Context Menu ─────────────────────────────────────────────────────────────

const IconContextMenu = ({ contextMenu, onClose, onOpenModal }) => {
  if (!contextMenu) return null;

  const { icon } = contextMenu;

  const handleCopySVG = () => {
    navigator.clipboard.writeText(icon.svg_content).catch(console.error);
    onClose();
  };

  const handleCopyName = () => {
    navigator.clipboard.writeText(icon.name).catch(console.error);
    onClose();
  };

  const handleOpenInModal = () => {
    onOpenModal(icon);
    onClose();
  };

  const handleDownloadPNG = async () => {
    try {
      const blob = await downloadIcon(icon.id, "png");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${icon.name}.png`;
      a.click();
      URL.revokeObjectURL(url);
      captureEvent("icon_downloaded", {
        icon_id: icon.id,
        icon_name: icon.name,
        format: "png",
        source: "context_menu",
      });
    } catch (err) {
      console.error("Download failed:", err);
    }
    onClose();
  };

  return (
    <Menu
      open
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={{ top: contextMenu.y, left: contextMenu.x }}
      slotProps={{
        paper: {
          elevation: 4,
          sx: { borderRadius: 2, minWidth: 190, py: 0.5 },
        },
      }}
    >
      <MenuItem onClick={handleCopySVG} dense sx={{ gap: 1.5, py: 1 }}>
        <ListItemIcon sx={{ minWidth: 0 }}><Copy size={15} /></ListItemIcon>
        Copy SVG
      </MenuItem>
      <MenuItem onClick={handleCopyName} dense sx={{ gap: 1.5, py: 1 }}>
        <ListItemIcon sx={{ minWidth: 0 }}><TextT size={15} /></ListItemIcon>
        Copy name
      </MenuItem>
      <MenuItem onClick={handleOpenInModal} dense sx={{ gap: 1.5, py: 1 }}>
        <ListItemIcon sx={{ minWidth: 0 }}><ArrowSquareOut size={15} /></ListItemIcon>
        Open in modal
      </MenuItem>
      <Divider sx={{ my: 0.5 }} />
      <MenuItem onClick={handleDownloadPNG} dense sx={{ gap: 1.5, py: 1 }}>
        <ListItemIcon sx={{ minWidth: 0 }}><DownloadSimple size={15} /></ListItemIcon>
        Download PNG
      </MenuItem>
    </Menu>
  );
};

// ─── Icon Card ────────────────────────────────────────────────────────────────

const IconCard = React.forwardRef(function IconCard(
  { icon, density, brandPalette, onOpenModal, onContextMenu, onKeyDown, tabIndex, isSelected, onSelect, anySelected },
  ref
) {
  const [hovered, setHovered] = useState(false);
  const [svgCopied, setSvgCopied] = useState(false);
  const theme = useTheme();
  const mode = theme.palette.mode;
  const { iconSize, padding, copySize } = DENSITY_CONFIG[density] || DENSITY_CONFIG.comfortable;
  const defaultColour = mode === "dark" ? "#FFFFFF" : "#000000";
  const isMonochrome = icon.type?.toLowerCase() === "monochrome";
  const resolvedPalette = brandPalette ?? { primary: defaultColour, secondary: "#9CA3AF" };
  const updatedSVGContent = isMonochrome
    ? updateSVGColorMonochrome(icon.svg_content, resolvedPalette.primary, resolvedPalette.secondary)
    : updateSVGColor(icon.svg_content, resolvedPalette.primary);

  const showCheckbox = hovered || isSelected || anySelected;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard
      .writeText(icon.svg_content)
      .then(() => {
        setSvgCopied(true);
        setTimeout(() => setSvgCopied(false), 1000);
      })
      .catch((err) => console.error("Failed to copy SVG content:", err));
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    onContextMenu(e, icon);
  };

  const handleCheckbox = (e) => {
    e.stopPropagation();
    onSelect(icon, e);
  };

  return (
    <Paper
      ref={ref}
      className="icon-card"
      tabIndex={tabIndex ?? 0}
      elevation={0}
      role="button"
      aria-label={icon.name}
      aria-pressed={isSelected}
      onKeyDown={onKeyDown}
      onClick={() => onOpenModal(icon)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onContextMenu={handleContextMenu}
      sx={(t) => ({
        borderRadius: 2,
        position: "relative",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        marginTop: "20px",
        backgroundColor: isSelected ? "action.selected" : "background.default",
        outline: isSelected ? `2px solid ${t.palette.primary.main}` : "none",
        outlineOffset: -2,
        "&:hover": { backgroundColor: isSelected ? "action.selected" : "neutral.light" },
        "&:focus-visible": {
          outline: `2px solid ${t.palette.primary.main}`,
          outlineOffset: 2,
        },
        ":active": { backgroundColor: "neutral.container" },
        transition: "background-color 0.2s ease-in-out, outline 0.1s ease",
        p: padding,
        border: `1px solid ${alpha(t.palette.divider, 0.2)}`,
      })}
    >
      <Image
        src={getCachedBlobUrl(updatedSVGContent)}
        alt={icon.name}
        width={iconSize}
        height={iconSize}
      />

      {/* Checkbox — top-left, shown on hover or when any icon is selected */}
      {showCheckbox && (
        <Box
          sx={{
            position: "absolute",
            top: density === "compact" ? 2 : 4,
            left: density === "compact" ? 2 : 4,
            zIndex: 2,
          }}
          onClick={handleCheckbox}
        >
          <Checkbox
            checked={isSelected}
            size="small"
            disableRipple
            sx={{
              p: "2px",
              color: "text.disabled",
              "&.Mui-checked": { color: "primary.main" },
            }}
          />
        </Box>
      )}

      {/* Icon name — fades in as frosted overlay at the bottom */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          py: 0.4,
          px: 0.5,
          bgcolor: (t) =>
            t.palette.mode === "dark"
              ? "rgba(0,0,0,0.65)"
              : "rgba(255,255,255,0.88)",
          backdropFilter: "blur(4px)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.18s ease-in-out",
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <Typography
          component="span"
          sx={{
            fontSize: density === "compact" ? "8px" : "10px",
            color: "text.primary",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
            lineHeight: 1.4,
            fontWeight: 500,
          }}
        >
          {icon.name}
        </Typography>
      </Box>

      {/* Copy SVG button — appears on hover */}
      {hovered && (
        <IconButton
          size="small"
          sx={{
            position: "absolute",
            top: density === "compact" ? 2 : 6,
            right: density === "compact" ? 2 : 6,
            zIndex: 1,
            p: density === "compact" ? "2px" : "4px",
          }}
        >
          {!svgCopied ? (
            <Copy
              size={copySize}
              weight="regular"
              onClick={handleCopy}
              color={theme.palette.action.active}
            />
          ) : (
            <Check size={copySize} weight="bold" color="#4caf50" />
          )}
        </IconButton>
      )}
    </Paper>
  );
});

// ─── Shimmer skeleton ─────────────────────────────────────────────────────────

const shimmerSx = (theme) => ({
  borderRadius: 2,
  background:
    theme.palette.mode === "dark"
      ? "linear-gradient(90deg, #2a2a2a 25%, #363636 50%, #2a2a2a 75%)"
      : "linear-gradient(90deg, #f0f0f0 25%, #e2e2e2 50%, #f0f0f0 75%)",
  backgroundSize: "200% 100%",
  animation: "iconShimmer 1.5s ease-in-out infinite",
  "@keyframes iconShimmer": {
    "0%":   { backgroundPosition: "200% 0" },
    "100%": { backgroundPosition: "-200% 0" },
  },
});

// ─── Icons grid ───────────────────────────────────────────────────────────────

function Icons() {
  const { loading, loadingMore, hasMore, loadMore, filteredIcons, total } = useHomePageIcons();
  const {
    density,
    previewColour,
    searchValue,
    setSearchValue,
    categories,
    setCategories,
    styles,
    setStyles,
    selectedIds,
    setSelectedIds,
    lastSelectedIndex,
    setLastSelectedIndex,
    clearSelection,
    copyAllRef,
    downloadZipRef,
  } = useHomePageContext();
  const brandPalette = previewColour ? BRAND_COLOUR_HEX[previewColour] : null;
  const { recentlyViewed, addRecentlyViewed, clearRecentlyViewed } = useRecentlyViewed();

  const [openModal, setOpenModal] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [contextMenu, setContextMenu] = useState(null);
  const [columns, setColumns] = useState(6);

  const [downloading, setDownloading] = useState(false);

  const gridRef = useRef(null);
  const cardRefs = useRef([]);

  const { cardSize, gap } = DENSITY_CONFIG[density] || DENSITY_CONFIG.comfortable;
  const gapPx = gap * 8; // MUI spacing unit → px

  // Measure available width and derive column count.
  // `loading` is included so the effect re-runs once the grid mounts (gridRef is
  // null during the shimmer skeleton phase and only becomes valid after loading=false).
  useEffect(() => {
    if (!gridRef.current) return;
    const measure = () => {
      const width = gridRef.current?.offsetWidth ?? 0;
      if (width === 0) return;
      const cols = Math.max(1, Math.floor((width + gapPx) / (cardSize + gapPx)));
      setColumns(cols);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(gridRef.current);
    return () => ro.disconnect();
  }, [cardSize, gapPx, loading]);

  // Group flat icon list into rows of `columns`
  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < filteredIcons.length; i += columns) {
      result.push(filteredIcons.slice(i, i + columns));
    }
    return result;
  }, [filteredIcons, columns]);

  const rowHeight = cardSize + 20 + gapPx; // 20px = marginTop on cards

  const { scrollContainerRef } = useHomePageContext();

  const virtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => rowHeight,
    overscan: 5,
    getScrollElement: () => scrollContainerRef.current,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Trigger loadMore when the last rendered virtual row is within 5 rows of the end
  const lastVirtualIndex = virtualItems[virtualItems.length - 1]?.index ?? -1;
  useEffect(() => {
    if (lastVirtualIndex < 0 || !hasMore || loadingMore) return;
    if (lastVirtualIndex >= rows.length - 5) {
      loadMore();
    }
  }, [lastVirtualIndex, hasMore, loadingMore, rows.length, loadMore]);


  const handleSelect = useCallback((icon, e, flatIndex) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (e.shiftKey && lastSelectedIndex !== null) {
        const lo = Math.min(flatIndex, lastSelectedIndex);
        const hi = Math.max(flatIndex, lastSelectedIndex);
        for (let i = lo; i <= hi; i++) {
          if (filteredIcons[i]) next.add(filteredIcons[i].id);
        }
      } else {
        if (next.has(icon.id)) next.delete(icon.id);
        else next.add(icon.id);
      }
      return next;
    });
    setLastSelectedIndex(flatIndex);
  }, [lastSelectedIndex, filteredIcons]);

  const handleClearSelection = clearSelection;

  const handleCopyAll = useCallback(async () => {
    const svgs = filteredIcons
      .filter((ic) => selectedIds.has(ic.id))
      .map((ic) => ic.svg_content)
      .join("\n\n");
    await navigator.clipboard.writeText(svgs).catch(console.error);
  }, [filteredIcons, selectedIds]);

  const handleDownloadZip = useCallback(async () => {
    setDownloading(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      filteredIcons
        .filter((ic) => selectedIds.has(ic.id))
        .forEach((ic) => zip.file(`${ic.name}.svg`, ic.svg_content));
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "icons.zip";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP download failed:", err);
    } finally {
      setDownloading(false);
    }
  }, [filteredIcons, selectedIds]);

  // Register handlers into context refs so the page header can invoke them
  useEffect(() => { copyAllRef.current = handleCopyAll; }, [handleCopyAll, copyAllRef]);
  useEffect(() => { downloadZipRef.current = handleDownloadZip; }, [handleDownloadZip, downloadZipRef]);

  const handleOpenModal = useCallback((icon) => {
    setSelectedIcon(icon);
    setOpenModal(true);
    addRecentlyViewed(icon);
  }, [addRecentlyViewed]);

  const handleContextMenu = useCallback((e, icon) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, icon });
  }, []);

  const handleKeyDown = useCallback(
    (e, index) => {
      const total = filteredIcons.length;
      let nextIndex = index;

      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleOpenModal(filteredIcons[index]);
        return;
      }

      if      (e.key === "ArrowRight") nextIndex = Math.min(index + 1, total - 1);
      else if (e.key === "ArrowLeft")  nextIndex = Math.max(index - 1, 0);
      else if (e.key === "ArrowDown")  nextIndex = Math.min(index + columns, total - 1);
      else if (e.key === "ArrowUp")    nextIndex = Math.max(index - columns, 0);
      else return;

      e.preventDefault();
      setFocusedIndex(nextIndex);
      cardRefs.current[nextIndex]?.focus();
    },
    [filteredIcons, columns, handleOpenModal]
  );

  if (loading) {
    return (
      <>
        <FilterSummaryBar count={0} loading />
        <Stack direction="row" spacing={gap} flexWrap="wrap" useFlexGap>
          {Array.from({ length: 20 }).map((_, i) => (
            <Box key={i} sx={(t) => ({ width: cardSize, height: cardSize, mt: "20px", ...shimmerSx(t) })} />
          ))}
        </Stack>
      </>
    );
  }

  if (filteredIcons.length === 0) {
    return (
      <>
        <FilterSummaryBar count={0} total={total} loading={false} />
        <IconsEmptyState
          searchValue={searchValue}
          categories={categories}
          styles={styles}
          onClearSearch={() => setSearchValue("")}
          onClearFilters={() => { setCategories([]); setStyles([]); }}
        />
      </>
    );
  }

  return (
    <>
      <RecentlyViewedSection
        icons={recentlyViewed}
        onIconClick={handleOpenModal}
        onClear={clearRecentlyViewed}
        brandPalette={brandPalette}
      />

      <FilterSummaryBar count={filteredIcons.length} total={total} loading={false} />

      {/* Outer div establishes the full scroll height */}
      <div
        ref={gridRef}
        style={{ position: "relative", height: virtualizer.getTotalSize() + (loadingMore ? rowHeight : 0) }}
      >
        {virtualItems.map((virtualRow) => {
          const rowIcons = rows[virtualRow.index] ?? [];
          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: virtualRow.start,
                left: 0,
                right: 0,
                display: "flex",
                gap: gapPx,
              }}
            >
              {rowIcons.map((icon, colIndex) => {
                const flatIndex = virtualRow.index * columns + colIndex;
                return (
                  <IconCard
                    key={icon.id ?? flatIndex}
                    ref={(el) => (cardRefs.current[flatIndex] = el)}
                    icon={icon}
                    density={density}
                    brandPalette={brandPalette}
                    onOpenModal={handleOpenModal}
                    onContextMenu={handleContextMenu}
                    tabIndex={focusedIndex === flatIndex || (focusedIndex === -1 && flatIndex === 0) ? 0 : -1}
                    onKeyDown={(e) => handleKeyDown(e, flatIndex)}
                    isSelected={selectedIds.has(icon.id)}
                    onSelect={(ic, e) => handleSelect(ic, e, flatIndex)}
                    anySelected={selectedIds.size > 0}
                  />
                );
              })}
            </div>
          );
        })}

        {/* Skeleton row shown at the bottom while fetching the next page */}
        {loadingMore && (
          <div
            style={{
              position: "absolute",
              top: virtualizer.getTotalSize(),
              left: 0,
              right: 0,
              display: "flex",
              gap: gapPx,
            }}
          >
            {Array.from({ length: columns }).map((_, i) => (
              <Box key={i} sx={(t) => ({ width: cardSize, height: cardSize, mt: "20px", flexShrink: 0, ...shimmerSx(t) })} />
            ))}
          </div>
        )}
      </div>

      <IconModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        selectedIcon={selectedIcon}
      />

      <IconContextMenu
        contextMenu={contextMenu}
        onClose={() => setContextMenu(null)}
        onOpenModal={handleOpenModal}
      />

    </>
  );
}

export default Icons;
