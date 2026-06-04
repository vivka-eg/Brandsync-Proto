"use client";

import React, { forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Box, Typography, Button, Skeleton } from "@mui/material";
import { alpha, darken } from "@mui/material/styles";
import { ArrowRight, ArrowsOutCardinal } from "phosphor-react";
import { frostBackground, isLightHex } from "./lib/adArtboardColors";
import { computeAdArtboardLayoutMetrics } from "./lib/adArtboardLayoutMetrics";
import ArtboardInlineText from "./components/ArtboardInlineText";

/** Readable copy on light brand / frost surfaces (light shade “3”, etc.). */
const TEXT_ON_LIGHT_HEADLINE = "rgba(17, 24, 39, 0.98)";
const TEXT_ON_LIGHT_SUB = "rgba(17, 24, 39, 0.78)";

function clampImageOffset(v) {
  return Math.min(50, Math.max(-50, Math.round(v)));
}

/** Matches AdBuilderShapesTab band slider (25%–70%). */
const PHOTO_BAND_RATIO_MIN = 0.25;
const PHOTO_BAND_RATIO_MAX = 0.7;

function clampBandRatio(r) {
  const n = typeof r === "number" && !Number.isNaN(r) ? r : 0.495;
  return Math.min(PHOTO_BAND_RATIO_MAX, Math.max(PHOTO_BAND_RATIO_MIN, n));
}

function SafeZoneOverlay({ width, height }) {
  const r = height / width;
  let type, tF, rF, bF, lF;
  if (r >= 1.7) {
    type = "story";
    tF = 0.20;
    rF = 0.05;
    bF = 0.25;
    lF = 0.05;
  } else if (r >= 1.2) {
    type = "portrait-feed";
    tF = 0.14;
    rF = 0.08;
    bF = 0.14;
    lF = 0.08;
  } else if (r > 0.95 && r < 1.05 && width >= 500) {
    type = "social";
    tF = 0.08;
    rF = 0.08;
    bF = 0.08;
    lF = 0.08;
  } else {
    type = "display";
    tF = 0.05;
    rF = 0.05;
    bF = 0.05;
    lF = 0.05;
  }
  const safeZone = {
    type,
    top: Math.round(height * tF),
    right: Math.round(width * rF),
    bottom: Math.round(height * bF),
    left: Math.round(width * lF),
  };

  return (
    <Box data-html2canvas-ignore sx={{ position: "absolute", inset: 0, zIndex: 11, pointerEvents: "none" }}>
      <Box sx={{ position: "absolute", top: safeZone.top, left: 0, right: 0, height: 1, bgcolor: "rgba(255,193,7,0.75)" }} />
      <Box sx={{ position: "absolute", bottom: safeZone.bottom, left: 0, right: 0, height: 1, bgcolor: "rgba(255,193,7,0.75)" }} />
      <Box sx={{ position: "absolute", left: safeZone.left, top: 0, bottom: 0, width: 1, bgcolor: "rgba(255,193,7,0.75)" }} />
      <Box sx={{ position: "absolute", right: safeZone.right, top: 0, bottom: 0, width: 1, bgcolor: "rgba(255,193,7,0.75)" }} />
      {safeZone.type === "story" && (
        <>
          <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: safeZone.top, bgcolor: "rgba(255,100,0,0.12)" }} />
          <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: safeZone.bottom, bgcolor: "rgba(255,100,0,0.12)" }} />
        </>
      )}
      {width >= 200 && height >= 100 && (
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            top: safeZone.top + 3,
            left: safeZone.left + 4,
            fontSize: 9,
            lineHeight: 1,
            color: "rgba(255,193,7,0.9)",
            fontWeight: 700,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          Safe zone
        </Typography>
      )}
    </Box>
  );
}

const AdArtboard = forwardRef(function AdArtboard(
  {
    width,
    height,
    headline,
    headlineRich = null,
    subtext,
    subtextRich = null,
    cta,
    bgHex,
    primaryHex,
    frostHex,
    frostPanelEnabled = true,
    frostOpacity,
    backgroundImageUrl,
    imageScale,
    imageOffsetX,
    imageOffsetY,
    logoUrl,
    /** Preview: full logo detail is fetching  -  show skeleton instead of stale bitmap. */
    logoLoading = false,
    adLayout = "frostedPanel",
    photoBandHeightRatio = 0.495,
    photoBandPosition = "bottom",
    photoBandCtaPlacement = "onBand",
    photoBandCtaOnPhotoVertical: photoBandCtaOnPhotoVerticalProp = "bottom",
    headlineFontScale = 1,
    subtextFontScale = 1,
    headlineLineHeight = 1.1,
    subtextLineHeight = 1.15,
    headlineSpacing = 1,
    headlineAlign = "left",
    subtextAlign = "left",
    ctaShowIcon = false,
    frostPanelScale = 1,
    frostPanelOffsetX = 0,
    frostPanelOffsetY = 0,
    onHeadlineChange,
    onSubtextChange,
    /** Preview: focused format target (`headline` | `subtext` | `cta` | `logo` | `image`) + anchor el, or null  -  floating toolbar. */
    onInlineTextEditingChange,
    /** Preview: drag background image to adjust horizontal/vertical position (same as Edit image sliders). */
    onImageOffsetChange,
    /** Preview: drag photo/band divider to change band size (photo + band layout only). */
    onPhotoBandHeightRatioChange,
    /** Preview: CSS scale from logical artboard px → screen px (e.g. displayScale). */
    previewInteractionScale = 1,
    logoScale: logoScaleProp = 1,
    logoAlign: logoAlignProp = "left",
    logoPlacement = "inLayout",
    ctaAlign: ctaAlignProp = "left",
    ctaFontScale: ctaFontScaleProp = 1,
    ctaPaddingScale: ctaPaddingScaleProp = 1,
    ctaOffsetX: ctaOffsetXProp = 0,
    ctaOffsetY: ctaOffsetYProp = 0,
    ctaRadius: ctaRadiusProp = 0,
    activeInlineRole = null,
    showImagePanMiniPreview = false,
    showGrid = false,
    showSafeZones = false,
    /** When true, backdrop-filter is unavailable (html-to-image capture); use stack-blur workaround instead. */
    isExporting = false,
  },
  ref,
) {
  const rootBoxRef = useRef(null);
  const frostPanelRef = useRef(null);
  /**
   * Frost panel bounds in export-root coordinates (from getBoundingClientRect).
   * Used only for the export stack-blur clip: the blur must live outside the panel’s
   * CSS transform tree — absolute `left`/`top` inside a scaled parent are pre-transform
   * px, while getBoundingClientRect is post-transform, which misaligned the blurred
   * duplicate vs the sharp hero image in PNG/JPEG export.
   */
  const [frostExportClip, setFrostExportClip] = useState({ left: 0, top: 0, width: 0, height: 0 });

  const assignRootRef = useCallback(
    (node) => {
      rootBoxRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );

  const textInteractive = Boolean(onHeadlineChange && onSubtextChange);
  const logoAlignResolved = ["left", "center", "right"].includes(logoAlignProp) ? logoAlignProp : "left";
  const logoPlacementResolved = ["inLayout", "onPhotoTop"].includes(logoPlacement) ? logoPlacement : "inLayout";
  const logoJustify =
    logoAlignResolved === "center" ? "center" : logoAlignResolved === "right" ? "flex-end" : "flex-start";
  const ctaAlignResolved = ["left", "center", "right"].includes(ctaAlignProp) ? ctaAlignProp : "left";
  const ctaJustify =
    ctaAlignResolved === "center" ? "center" : ctaAlignResolved === "right" ? "flex-end" : "flex-start";
  const headAlign = ["left", "center", "right"].includes(headlineAlign) ? headlineAlign : "left";
  const subAlign = ["left", "center", "right"].includes(subtextAlign) ? subtextAlign : "left";
  const {
    shortSide,
    isLeaderboard,
    usePhotoBand,
    usePhotoBandLb,
    usePhotoBandTall,
    bandHeightPx,
    photoHeightPx,
    bandWidthPx,
    photoWidthPx,
    headlineSize,
    subSize,
    panelPad,
    panelGap,
    panelRadius,
    scaledLogoW,
    scaledLogoH,
    headlineLhDisplay,
    subtextLhDisplay,
    compactLeaderboardStrip,
    veryCompactLbStrip,
    isSmallBanner,
    isLargePortrait,
    ctaPaddingScaleClamped,
    visualCtaFontPx,
    ctaFontPx,
    ctaNudgePxX,
    ctaNudgePxY,
  } = computeAdArtboardLayoutMetrics({
    width,
    height,
    adLayout,
    photoBandHeightRatio,
    headlineSpacing,
    logoScale: logoScaleProp,
    headlineFontScale,
    subtextFontScale,
    headlineLineHeight,
    subtextLineHeight,
    ctaFontScale: ctaFontScaleProp,
    ctaPaddingScale: ctaPaddingScaleProp,
    ctaOffsetX: ctaOffsetXProp,
    ctaOffsetY: ctaOffsetYProp,
  });
  const pad = Math.max(8, shortSide * 0.04);

  const ctaRowWrapperSx = {
    width: "100%",
    display: "flex",
    justifyContent: ctaJustify,
    flexShrink: 0,
    transform: `translate(${ctaNudgePxX}px, ${ctaNudgePxY}px)`,
  };

  const photoBandCtaOnPhotoVerticalResolved = ["top", "center", "bottom"].includes(
    photoBandCtaOnPhotoVerticalProp,
  )
    ? photoBandCtaOnPhotoVerticalProp
    : "bottom";

  const onPhotoCtaOverlaySx = (padStr) => ({
    position: "absolute",
    left: 0,
    right: 0,
    p: padStr,
    display: "flex",
    justifyContent: ctaJustify,
    pointerEvents: "none",
    zIndex: 1,
    transform: `translate(${ctaNudgePxX}px, ${ctaNudgePxY}px)`,
    ...(photoBandCtaOnPhotoVerticalResolved === "top"
      ? { top: 0, bottom: "auto", alignItems: "flex-start" }
      : photoBandCtaOnPhotoVerticalResolved === "center"
        ? { top: 0, bottom: 0, alignItems: "center" }
        : { top: "auto", bottom: 0, alignItems: "flex-end" }),
  });

  const bgImage = backgroundImageUrl
    ? `url("${backgroundImageUrl}")`
    : "none";

  /** Offset values: -50 … +50, where 0 = centred. */
  const ox = typeof imageOffsetX === "number" && !Number.isNaN(imageOffsetX) ? imageOffsetX : 0;
  const oy = typeof imageOffsetY === "number" && !Number.isNaN(imageOffsetY) ? imageOffsetY : 0;

  /** Cover full area (no letterboxing); `imageScale` zooms from center. */
  const imageScaleResolved =
    typeof imageScale === "number" && !Number.isNaN(imageScale) && imageScale > 0 ? imageScale : 1;

  /**
   * Pan via CSS transform translate rather than background-position.
   *
   * background-position % only moves the image within the visible area when the image
   * is larger than the container *before* scaling — cover ensures the image exactly fills
   * the container, so background-position has nothing to pan against at scale=1, and at
   * scale>1 it operates in pre-scale coordinates making offset changes feel sluggish or
   * ineffective (especially vertically).
   *
   * Instead: scale the element up and then translate it. At scale S the element visually
   * overflows by (S-1)*dim/2 in each direction. Map ox/oy (-50…+50) to that range so the
   * full offset range always reaches the visual edges of the scaled image.
   */
  const bgTransform = useMemo(() => {
    const S = imageScaleResolved;
    // S<1: image is intentionally smaller than the artboard — scale down, no translate.
    // S>1: translate to pan within the zoomed overflow; bgPosition is fixed at 50% 50%.
    const txPct = S > 1 ? (ox / 50) * ((S - 1) / S) * 50 : 0;
    const tyPct = S > 1 ? (oy / 50) * ((S - 1) / S) * 50 : 0;
    return `scale(${S}) translate(${txPct}%, ${tyPct}%)`;
  }, [imageScaleResolved, ox, oy]);

  // At S>1 panning is done via transform-translate above; fix bgPosition to centre.
  // At S≤1 bgPosition handles panning (background-position % works within cover overflow).
  const bgPosition = useMemo(() => {
    if (imageScaleResolved > 1) return "50% 50%";
    if (usePhotoBandLb) return "50% 50%";
    return `${50 + ox}% ${50 + oy}%`;
  }, [imageScaleResolved, ox, oy, usePhotoBandLb]);

  /**
   * html-to-image embeds background bitmaps from inline `style` only (not Emotion class rules).
   * Without this, PNG/JPEG export shows a solid colour where the hero photo should be.
   */
  const bgPhotoExportStyle = useMemo(
    () =>
      backgroundImageUrl
        ? {
            backgroundImage: bgImage,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: bgPosition,
            transform: bgTransform,
            transformOrigin: "center center",
          }
        : undefined,
    [backgroundImageUrl, bgImage, bgPosition, bgTransform],
  );

  const imagePanDims = useMemo(() => {
    if (usePhotoBandLb) return { w: Math.max(1, photoWidthPx), h: Math.max(1, height) };
    if (usePhotoBandTall) return { w: Math.max(1, width), h: Math.max(1, photoHeightPx) };
    return { w: Math.max(1, width), h: Math.max(1, height) };
  }, [usePhotoBandLb, usePhotoBandTall, photoWidthPx, photoHeightPx, width, height]);

  const imagePanEnabled = Boolean(
    backgroundImageUrl && typeof onImageOffsetChange === "function",
  );
  const interactionScale =
    typeof previewInteractionScale === "number" && previewInteractionScale > 0
      ? previewInteractionScale
      : 1;

  const imagePanDocCleanupRef = useRef(null);
  const imagePanSessionRef = useRef(null);
  const [isImagePanning, setIsImagePanning] = useState(false);

  useEffect(
    () => () => {
      imagePanDocCleanupRef.current?.();
      imagePanDocCleanupRef.current = null;
      imagePanSessionRef.current = null;
      setIsImagePanning(false);
    },
    [],
  );

  const handleImagePanPointerDown = useCallback(
    (e) => {
      if (!imagePanEnabled || e.button !== 0) return;
      e.stopPropagation();
      e.preventDefault();
      imagePanDocCleanupRef.current?.();
      imagePanDocCleanupRef.current = null;

      setIsImagePanning(true);
      const ox0 = typeof imageOffsetX === "number" && !Number.isNaN(imageOffsetX) ? imageOffsetX : 0;
      const oy0 = typeof imageOffsetY === "number" && !Number.isNaN(imageOffsetY) ? imageOffsetY : 0;
      const pw = imagePanDims.w;
      const ph = imagePanDims.h;
      const startX = e.clientX;
      const startY = e.clientY;
      const pointerId = e.pointerId;
      const anchorEl = e.currentTarget.closest('[data-ad-export-root]') ?? e.currentTarget;
      imagePanSessionRef.current = { historyRecorded: false };

      const onMove = (ev) => {
        if (ev.pointerId !== pointerId || !onImageOffsetChange) return;
        ev.preventDefault();
        const totalDx = (ev.clientX - startX) / interactionScale;
        const totalDy = (ev.clientY - startY) / interactionScale;
        const nextOx = clampImageOffset(ox0 + (totalDx / pw) * 100);
        const nextOy = clampImageOffset(oy0 + (totalDy / ph) * 100);
        if (nextOx === ox0 && nextOy === oy0) return;
        const session = imagePanSessionRef.current;
        if (!session) return;
        const recordHistory = !session.historyRecorded;
        session.historyRecorded = true;
        onImageOffsetChange({ imageOffsetX: nextOx, imageOffsetY: nextOy }, { recordHistory });
      };

      const detachImagePanListeners = () => {
        document.removeEventListener("pointermove", onMove, true);
        document.removeEventListener("pointerup", onUp, true);
        document.removeEventListener("pointercancel", onUp, true);
      };

      function onUp(ev) {
        if (ev.pointerId !== pointerId) return;
        const session = imagePanSessionRef.current;
        const didMove = session?.historyRecorded ?? false;
        detachImagePanListeners();
        imagePanDocCleanupRef.current = null;
        imagePanSessionRef.current = null;
        setIsImagePanning(false);
        // Treat a tap (no actual pan movement) as an image panel open request.
        if (!didMove && onInlineTextEditingChange) {
          onInlineTextEditingChange("image", anchorEl);
        }
      }

      imagePanDocCleanupRef.current = () => {
        detachImagePanListeners();
        imagePanSessionRef.current = null;
        setIsImagePanning(false);
      };

      document.addEventListener("pointermove", onMove, { passive: false, capture: true });
      document.addEventListener("pointerup", onUp, { capture: true });
      document.addEventListener("pointercancel", onUp, { capture: true });
    },
    [
      imagePanEnabled,
      imageOffsetX,
      imageOffsetY,
      imagePanDims.w,
      imagePanDims.h,
      interactionScale,
      onImageOffsetChange,
      onInlineTextEditingChange,
    ],
  );

  const imagePanHandlers = imagePanEnabled ? { onPointerDown: handleImagePanPointerDown } : {};

  /**
   * Preview: click photo opens inline image size + change controls.
   * When imagePanEnabled the tap is handled in the pointerup of handleImagePanPointerDown
   * (because preventDefault on pointerdown suppresses the click event).
   * This onClick fallback covers the case where pan is not enabled (no backgroundImageUrl
   * or no onImageOffsetChange), so there is no pan handler in that branch.
   */
  const backgroundImageDoubleClickHandlers = useMemo(() => {
    if (!backgroundImageUrl || !onInlineTextEditingChange || imagePanEnabled) return {};
    return {
      onClick: (e) => {
        e.stopPropagation();
        onInlineTextEditingChange("image", e.currentTarget.closest('[data-ad-export-root]') ?? e.currentTarget);
      },
    };
  }, [backgroundImageUrl, onInlineTextEditingChange, imagePanEnabled]);

  const bandResizeEnabled = Boolean(
    usePhotoBand && typeof onPhotoBandHeightRatioChange === "function",
  );

  const bandResizeDragRef = useRef(null);

  const handleBandResizePointerDown = useCallback(
    (e, axis) => {
      if (!bandResizeEnabled || e.button !== 0) return;
      e.stopPropagation();
      e.preventDefault();
      const r0 = clampBandRatio(photoBandHeightRatio);
      bandResizeDragRef.current = {
        ratio0: r0,
        clientX: e.clientX,
        clientY: e.clientY,
        axis,
        historyRecorded: false,
      };
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    },
    [bandResizeEnabled, photoBandHeightRatio],
  );

  const handleBandResizePointerMove = useCallback(
    (e) => {
      const d = bandResizeDragRef.current;
      if (!d || !onPhotoBandHeightRatioChange) return;
      const totalDx = (e.clientX - d.clientX) / interactionScale;
      const totalDy = (e.clientY - d.clientY) / interactionScale;
      const deltaRatio = d.axis === "y" ? totalDy / height : totalDx / width;
      const next = clampBandRatio(d.ratio0 + deltaRatio);
      const recordHistory = !d.historyRecorded;
      d.historyRecorded = true;
      onPhotoBandHeightRatioChange(next, { recordHistory });
    },
    [onPhotoBandHeightRatioChange, interactionScale, height, width],
  );

  const handleBandResizePointerUp = useCallback((e) => {
    bandResizeDragRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }, []);

  const bandResizeHandleProps = bandResizeEnabled
    ? {
        onPointerMove: handleBandResizePointerMove,
        onPointerUp: handleBandResizePointerUp,
        onPointerCancel: handleBandResizePointerUp,
      }
    : {};

  const imagePanCursorSx = imagePanEnabled
    ? {
        cursor: "grab",
        touchAction: "none",
        "@media (pointer: fine)": {
          "&:hover": {
            outline: (t) => `2px solid ${t.palette.primary.main}`,
            outlineOffset: 0,
          },
        },
        "&:active": { cursor: "grabbing" },
      }
    : {};

  const dragHintEl = imagePanEnabled ? (
    <Box
      aria-hidden
      data-drag-hint
      data-html2canvas-ignore
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 4,
        opacity: isImagePanning ? 0 : undefined,
        transition: "opacity 0.15s ease",
        width: 36,
        height: 36,
        borderRadius: "50%",
        bgcolor: "rgba(0,0,0,0.38)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "@media (pointer: coarse)": { display: "none" },
      }}
    >
      <ArrowsOutCardinal size={20} color="#fff" weight="bold" aria-hidden />
    </Box>
  ) : null;

  const miniPreviewEl = (showImagePanMiniPreview && imagePanEnabled && (!usePhotoBand || photoHeightPx >= 60 || photoWidthPx >= 60)) ? (
    <Box
      data-html2canvas-ignore
      sx={{
        position: "absolute",
        bottom: 8,
        right: 8,
        zIndex: 9,
        pointerEvents: "none",
        width: 64,
        height: Math.round(64 * (height / width)),
        bgcolor: "rgba(0,0,0,0.55)",
        border: "1px solid rgba(255,255,255,0.22)",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "50% 50%",
          transform: bgTransform,
          transformOrigin: "center center",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: `${50 + ox}%`,
          top: `${50 + oy}%`,
          transform: "translate(-50%, -50%)",
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: "primary.main",
          boxShadow: "0 0 0 2px #fff",
          pointerEvents: "none",
        }}
      />
    </Box>
  ) : null;

  const frostGlass = frostPanelEnabled !== false;
  const frostBg = frostGlass ? frostBackground(frostHex, frostOpacity) : frostHex;
  const frostPanelOnLightSurface = isLightHex(frostHex);

  const fpScale =
    typeof frostPanelScale === "number" && frostPanelScale > 0
      ? Math.min(1, Math.max(0.5, frostPanelScale))
      : 1;
  const fpOx =
    typeof frostPanelOffsetX === "number" && !Number.isNaN(frostPanelOffsetX) ? frostPanelOffsetX : 0;
  const fpOy =
    typeof frostPanelOffsetY === "number" && !Number.isNaN(frostPanelOffsetY) ? frostPanelOffsetY : 0;
  const fpShiftX = (fpOx / 50) * width * 0.04;
  const fpShiftY = -(fpOy / 50) * height * 0.04;

  const showCta = String(cta ?? "").trim().length > 0;

  /** Focus on the CTA button opens the same floating format bar as headline/subtext (preview only). */
  const ctaFloatingToolbarHandlers = useMemo(() => {
    if (!onInlineTextEditingChange || !showCta) return {};
    const showToolbar = (e) => onInlineTextEditingChange("cta", e.currentTarget);
    return {
      onFocus: showToolbar,
      onClick: showToolbar,
      onBlur: (e) => {
        const n = e.relatedTarget;
        if (n && typeof n.closest === "function" && n.closest("[data-ad-inline-format-toolbar]")) {
          return;
        }
        onInlineTextEditingChange(null, null);
      },
    };
  }, [onInlineTextEditingChange, showCta]);

  const logoFormatToolbarActive = Boolean(onInlineTextEditingChange && logoUrl && !logoLoading);

  const logoFloatingToolbarHandlers = useMemo(() => {
    if (!logoFormatToolbarActive) return {};
    const showToolbar = (e) => onInlineTextEditingChange("logo", e.currentTarget);
    return {
      onFocus: showToolbar,
      onClick: showToolbar,
      onBlur: (e) => {
        const n = e.relatedTarget;
        if (n && typeof n.closest === "function" && n.closest("[data-ad-inline-format-toolbar]")) {
          return;
        }
        onInlineTextEditingChange(null, null);
      },
    };
  }, [logoFormatToolbarActive, onInlineTextEditingChange]);

  /** Opens Properties → Photo band / Text card (shapes) when clicking the band or card chrome, not copy/logo/CTA. */
  const openShapesPanelFromPreview = useCallback(
    (e) => {
      if (!onInlineTextEditingChange) return;
      const t = e.target;
      if (typeof t.closest !== "function") return;
      if (t.closest("button")) return;
      if (t.closest('[contenteditable="true"]')) return;
      if (t.closest('[role="button"]')) return;
      if (t.closest('[role="separator"]')) return;
      e.stopPropagation();
      onInlineTextEditingChange("shapes", e.currentTarget);
    },
    [onInlineTextEditingChange],
  );

  const logoToolbarTargetSx = logoFormatToolbarActive
    ? {
        cursor: "pointer",
        borderRadius: 1,
        transition: "outline 0.12s ease",
        "&:focus-visible": {
          outline: (t) => `2px solid ${t.palette.primary.main}`,
          outlineOffset: 2,
        },
        "@media (pointer: fine)": {
          "&:hover": {
            outline: (t) => `2px solid ${alpha(t.palette.primary.main, 0.5)}`,
            outlineOffset: 2,
          },
        },
      }
    : {};

  const shapesClickSx = onInlineTextEditingChange
    ? {
        cursor: "pointer",
        transition: "filter 0.12s ease",
        "@media (pointer: fine)": {
          "&:hover": {
            filter: "brightness(1.03)",
          },
        },
      }
    : {};

  useLayoutEffect(() => {
    const root = rootBoxRef.current;
    const panel = frostPanelRef.current;
    if (!root || !panel) return;
    const measure = () => {
      const r = root.getBoundingClientRect();
      const p = panel.getBoundingClientRect();
      setFrostExportClip({
        left: p.left - r.left,
        top: p.top - r.top,
        width: p.width,
        height: p.height,
      });
    };
    measure();
    // Next frame(s): flex layout and transforms can settle after patch (e.g. Use template); RO does not fire on transform-only moves.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      measure();
      raf2 = requestAnimationFrame(measure);
    });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (ro) {
      ro.observe(root);
      ro.observe(panel);
    }
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ro?.disconnect();
    };
  }, [
    width,
    height,
    fpShiftX,
    fpShiftY,
    fpScale,
    pad,
    isLeaderboard,
    usePhotoBand,
    usePhotoBandTall,
    scaledLogoW,
    scaledLogoH,
    logoPlacementResolved,
    logoUrl,
    logoLoading,
  ]);

  const ctaEndIconEl =
    ctaShowIcon && showCta ? (
      <ArrowRight
        size={Math.max(11, Math.min(20, Math.round(visualCtaFontPx * 0.5)))}
        weight="bold"
      />
    ) : null;

  // Express radius as em so it scales with the button's font-size, making the full
  // 0–50 slider range produce visible change (0 = square, 50 = full pill).
  // CSS clamps border-radius to half the element's height, so 2em always reaches pill.
  const ctaRadiusCss =
    typeof ctaRadiusProp === "number" && !Number.isNaN(ctaRadiusProp)
      ? `${((Math.max(0, Math.min(50, ctaRadiusProp)) / 50) * 2).toFixed(3)}em`
      : "0em";

  const sharedCtaButtonSx = {
    flexShrink: 0,
    alignSelf: "flex-start",
    mt: (veryCompactLbStrip || compactLeaderboardStrip) ? 0 : 0.5,
    fontSize: visualCtaFontPx,
    py: Math.max(
      0.2,
      (isLargePortrait ? 0.95 : (compactLeaderboardStrip || isSmallBanner) ? 0.3 : 0.75) * ctaPaddingScaleClamped,
    ),
    px: Math.max(
      0.85,
      (isLargePortrait ? 2.75 : (compactLeaderboardStrip || isSmallBanner) ? 1.4 : 2) * ctaPaddingScaleClamped,
    ),
    fontWeight: 600,
    textTransform: "none",
    borderRadius: ctaRadiusCss,
    boxShadow: "none",
  };

  // Photo-band: white button, brand-coloured label.
  const bandCtaButtonSx = {
    ...sharedCtaButtonSx,
    bgcolor: "#fff",
    color: primaryHex,
    "&:hover": {
      bgcolor: darken("#fff", 0.08),
      boxShadow: "none",
    },
  };

  // Photo-band "on photo": same but with a drop shadow so it reads over busy images.
  // alignSelf must match the overlay's align-items so the button respects the vertical position.
  // Without this, sharedCtaButtonSx's alignSelf:"flex-start" overrides the parent's alignItems:"center".
  const photoCtaButtonSx = {
    ...bandCtaButtonSx,
    mt: 0,
    alignSelf: photoBandCtaOnPhotoVerticalResolved === "center" ? "center" : "flex-start",
    boxShadow: "0 1px 10px rgba(0,0,0,0.35)",
    "&:hover": {
      bgcolor: darken("#fff", 0.08),
      boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
    },
  };

  // Frosted-panel: brand-coloured button, white label — matches the card's colour inversion.
  const frostedCtaButtonSx = {
    ...sharedCtaButtonSx,
    fontSize: ctaFontPx,
    bgcolor: primaryHex,
    color: "#fff",
    "&:hover": {
      bgcolor: darken(primaryHex, 0.12),
      boxShadow: "none",
    },
  };

  const renderBandCta = () =>
    showCta ? (
      <Box sx={ctaRowWrapperSx}>
        <Button
          variant="contained"
          size={shortSide >= 420 ? "medium" : "small"}
          sx={bandCtaButtonSx}
          endIcon={ctaEndIconEl}
          {...ctaFloatingToolbarHandlers}
        >
          {cta}
        </Button>
      </Box>
    ) : null;

  const logoBackgroundPosition =
    logoAlignResolved === "center"
      ? "center center"
      : logoAlignResolved === "right"
        ? "right center"
        : "left center";

  const logoDisplay = logoLoading ? (
    <Skeleton
      variant="rounded"
      animation="wave"
      aria-busy
      aria-label="Loading logo"
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: 1,
        transform: "none",
        bgcolor: (t) => alpha(t.palette.common.white, 0.14),
      }}
    />
  ) : logoUrl ? (
    <Box
      component="img"
      aria-label="Product logo"
      alt=""
      src={logoUrl}
      sx={{
        width: "100%",
        height: "100%",
        display: "block",
        objectFit: "contain",
        objectPosition: logoBackgroundPosition,
      }}
    />
  ) : null;

  const showLogoInLayout = (logoUrl || logoLoading) && logoPlacementResolved === "inLayout";
  const showLogoOnPhoto = (logoUrl || logoLoading) && logoPlacementResolved === "onPhotoTop";

  const logoBlock =
    showLogoInLayout &&
    (
      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: logoJustify,
          width: "100%",
        }}
      >
        <Box
          {...(logoFormatToolbarActive
            ? {
                tabIndex: 0,
                role: "button",
                "aria-label": "Product logo, open formatting tools",
                ...logoFloatingToolbarHandlers,
              }
            : {})}
          onPointerDown={(e) => e.stopPropagation()}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: scaledLogoW,
            height: scaledLogoH,
            flexShrink: 0,
            ...logoToolbarTargetSx,
          }}
        >
          {logoDisplay}
        </Box>
      </Box>
    );

  const onPhotoLogoBlock = showLogoOnPhoto && (
    <Box
      sx={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        p: `${Math.max(8, panelPad * 0.75)}px`,
        display: "flex",
        justifyContent: logoJustify,
        alignItems: "flex-start",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <Box
        {...(logoFormatToolbarActive
          ? {
              tabIndex: 0,
              role: "button",
              "aria-label": "Product logo, open formatting tools",
              ...logoFloatingToolbarHandlers,
            }
          : {})}
        onPointerDown={(e) => e.stopPropagation()}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: logoJustify,
          width: scaledLogoW,
          height: scaledLogoH,
          flexShrink: 0,
          pointerEvents: "auto",
          ...logoToolbarTargetSx,
        }}
      >
        {logoDisplay}
      </Box>
    </Box>
  );

  const bandCopyOnLightSurface = isLightHex(bgHex);

  const copyBlock = (
    <Box
      sx={{
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: `${panelGap}px`,
      }}
    >
      <ArtboardInlineText
        value={headline}
        richValue={headlineRich}
        interactive={textInteractive}
        onCommit={onHeadlineChange}
        editingRole="headline"
        onEditingRoleChange={onInlineTextEditingChange}
        sx={{
          color: bandCopyOnLightSurface ? TEXT_ON_LIGHT_HEADLINE : "#fff",
          fontWeight: 600,
          fontSize: headlineSize,
          lineHeight: headlineLhDisplay,
          letterSpacing: "-0.02em",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
          textAlign: headAlign,
        }}
      />
      <ArtboardInlineText
        value={subtext}
        richValue={subtextRich}
        interactive={textInteractive}
        onCommit={onSubtextChange}
        editingRole="subtext"
        onEditingRoleChange={onInlineTextEditingChange}
        sx={{
          color: bandCopyOnLightSurface ? TEXT_ON_LIGHT_SUB : "rgba(255,255,255,0.95)",
          fontWeight: 400,
          fontSize: subSize,
          lineHeight: subtextLhDisplay,
          letterSpacing: "-0.02em",
          wordBreak: "break-word",
          textAlign: subAlign,
        }}
      />
    </Box>
  );

  if (usePhotoBandLb) {
    const placementRaw =
      photoBandCtaPlacement === "underLogo"
        ? "underLogo"
        : photoBandCtaPlacement === "onPhoto"
          ? "onPhoto"
          : "onBand";
    const effectivePlacement =
      placementRaw === "underLogo" && !showLogoInLayout ? "onBand" : placementRaw;
    const ctaOnPhoto = showCta && effectivePlacement === "onPhoto";
    const showCtaInBand = showCta && effectivePlacement !== "onPhoto";
    const bandOnRight = photoBandPosition !== "left";

    /** Same vertical stack as tall photo-band so logo + copy share one left edge (no side-by-side row). */
    const bandContentLb =
      effectivePlacement === "underLogo" && showLogoInLayout ? (
        <>
          {logoBlock}
          {showCtaInBand ? renderBandCta() : null}
          {copyBlock}
        </>
      ) : (
        <>
          {logoBlock}
          {copyBlock}
          {showCtaInBand ? renderBandCta() : null}
        </>
      );

    return (
      <Box
        ref={ref}
        data-ad-export-root
        sx={{
          width,
          height,
          position: "relative",
          overflow: "hidden",
          bgcolor: "#0a0a0a",
          fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            ...(bandOnRight
              ? { left: 0, width: photoWidthPx, right: "auto" }
              : { left: bandWidthPx, width: photoWidthPx, right: "auto" }),
            overflow: "hidden",
            "& [data-drag-hint]": { opacity: 0 },
            "@media (pointer: fine)": {
              "&:hover [data-drag-hint]": { opacity: isImagePanning ? 0 : 1 },
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#0a0a0a",
              backgroundImage: bgImage,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: bgPosition,
              transform: bgTransform,
              transformOrigin: "center center",
              ...imagePanCursorSx,
            }}
            style={bgPhotoExportStyle}
            {...imagePanHandlers}
            {...backgroundImageDoubleClickHandlers}
          />
          {dragHintEl}
          {miniPreviewEl}
          {onPhotoLogoBlock}
          {ctaOnPhoto && (
            <Box sx={onPhotoCtaOverlaySx(`${Math.max(4, panelPad * 0.5)}px`)}>
              <Button
                variant="contained"
                size={shortSide >= 420 ? "medium" : "small"}
                sx={{ ...photoCtaButtonSx, pointerEvents: "auto" }}
                endIcon={ctaEndIconEl}
                {...ctaFloatingToolbarHandlers}
              >
                {cta}
              </Button>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            ...(bandOnRight
              ? { right: 0, width: bandWidthPx, left: "auto" }
              : { left: 0, width: bandWidthPx, right: "auto" }),
            bgcolor: bgHex,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: compactLeaderboardStrip ? "flex-start" : "center",
            px: `${panelPad}px`,
            py: `${veryCompactLbStrip ? Math.max(2, Math.min(height * 0.04, 4)) : compactLeaderboardStrip ? Math.max(4, Math.min(height * 0.04, 8)) : Math.max(6, Math.min(height * 0.05, 20))}px`,
            gap: `${compactLeaderboardStrip ? Math.max(1, Math.round(panelGap * 0.5)) : Math.round(panelGap * 0.9)}px`,
            minWidth: 0,
            overflow: "hidden",
            ...shapesClickSx,
          }}
          onPointerDown={openShapesPanelFromPreview}
        >
          {bandContentLb}
        </Box>
        {bandResizeEnabled && (
          <Box
            role="separator"
            aria-orientation="vertical"
            aria-label="Drag to resize photo band"
            onPointerDown={(e) => handleBandResizePointerDown(e, "x")}
            {...bandResizeHandleProps}
            sx={{
              position: "absolute",
              zIndex: 8,
              pointerEvents: "auto",
              touchAction: "none",
              bgcolor: "transparent",
              cursor: "col-resize",
              top: 0,
              bottom: 0,
              width: 10,
              "&:hover": {
                bgcolor: (t) => alpha(t.palette.primary.main, 0.14),
              },
              ...(bandOnRight
                ? { left: photoWidthPx, transform: "translateX(-50%)" }
                : { left: bandWidthPx, transform: "translateX(-50%)" }),
            }}
          />
        )}
      </Box>
    );
  }

  if (usePhotoBandTall) {
    const bandOnBottom = photoBandPosition !== "top";
    const placementRaw =
      photoBandCtaPlacement === "underLogo"
        ? "underLogo"
        : photoBandCtaPlacement === "onPhoto"
          ? "onPhoto"
          : "onBand";
    const effectivePlacement =
      placementRaw === "underLogo" && !showLogoInLayout ? "onBand" : placementRaw;
    const ctaOnPhoto = showCta && effectivePlacement === "onPhoto";
    const showCtaInBand = showCta && effectivePlacement !== "onPhoto";

    const bandContent =
      effectivePlacement === "underLogo" && showLogoInLayout ? (
        <>
          {logoBlock}
          {showCtaInBand ? renderBandCta() : null}
          {copyBlock}
        </>
      ) : (
        <>
          {logoBlock}
          {copyBlock}
          {showCtaInBand ? renderBandCta() : null}
        </>
      );

    return (
      <Box
        ref={ref}
        data-ad-export-root
        sx={{
          width,
          height,
          position: "relative",
          overflow: "hidden",
          bgcolor: "#0a0a0a",
          fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            ...(bandOnBottom ? { top: 0, bottom: "auto" } : { bottom: 0, top: "auto" }),
            height: photoHeightPx,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#0a0a0a",
              backgroundImage: bgImage,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: bgPosition,
              transform: bgTransform,
              transformOrigin: "center center",
              ...imagePanCursorSx,
            }}
            style={bgPhotoExportStyle}
            {...imagePanHandlers}
            {...backgroundImageDoubleClickHandlers}
          />
          {dragHintEl}
          {miniPreviewEl}
          {onPhotoLogoBlock}
          {ctaOnPhoto && (
            <Box sx={onPhotoCtaOverlaySx(`${Math.max(8, panelPad * 0.75)}px`)}>
              <Button
                variant="contained"
                size={shortSide >= 420 ? "medium" : "small"}
                sx={{ ...photoCtaButtonSx, pointerEvents: "auto" }}
                endIcon={ctaEndIconEl}
                {...ctaFloatingToolbarHandlers}
              >
                {cta}
              </Button>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            ...(bandOnBottom ? { bottom: 0, top: "auto" } : { top: 0, bottom: "auto" }),
            height: bandHeightPx,
            bgcolor: bgHex,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "flex-start",
            px: `${panelPad}px`,
            py: `${Math.max(10, bandHeightPx * 0.085)}px`,
            gap: `${Math.round(panelGap * 0.85)}px`,
            ...shapesClickSx,
          }}
          onPointerDown={openShapesPanelFromPreview}
        >
          {bandContent}
        </Box>
        {bandResizeEnabled && (
          <Box
            role="separator"
            aria-orientation="horizontal"
            aria-label="Drag to resize photo band"
            onPointerDown={(e) => handleBandResizePointerDown(e, "y")}
            {...bandResizeHandleProps}
            sx={{
              position: "absolute",
              zIndex: 8,
              pointerEvents: "auto",
              touchAction: "none",
              bgcolor: "transparent",
              cursor: "row-resize",
              left: 0,
              right: 0,
              height: 10,
              "&:hover": {
                bgcolor: (t) => alpha(t.palette.primary.main, 0.14),
              },
              ...(bandOnBottom
                ? { top: photoHeightPx, transform: "translateY(-50%)" }
                : { top: bandHeightPx, transform: "translateY(-50%)" }),
            }}
          />
        )}
      </Box>
    );
  }

  // For frosted layouts, omit supporting copy on all leaderboard-style units.
  const shouldShowSubtextInFrosted = !isLeaderboard;

  // In live preview: backdrop-filter is always perfectly aligned — no measurement needed.
  // In export (isExporting=true): html-to-image can't capture backdrop-filter, so fall back to the
  // stack-blur workaround. The blur is clipped to the glass card using post-transform bounds
  // (getBoundingClientRect) as a root-level sibling — not a child of the scaled frost panel,
  // otherwise absolute offsets disagree with screen-space layout and the export looks shifted.
  const frostExportStackBlurEl =
    frostGlass &&
    backgroundImageUrl &&
    isExporting &&
    frostExportClip.width > 0 &&
    frostExportClip.height > 0 ? (
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          left: frostExportClip.left,
          top: frostExportClip.top,
          width: frostExportClip.width,
          height: frostExportClip.height,
          borderRadius: `${panelRadius}px`,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            left: -frostExportClip.left,
            top: -frostExportClip.top,
            width,
            height,
            backgroundImage: bgImage,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: bgPosition,
            transform: bgTransform,
            transformOrigin: "center center",
            filter: "blur(14px)",
          }}
          style={
            bgPhotoExportStyle
              ? { ...bgPhotoExportStyle, filter: "blur(14px)" }
              : undefined
          }
        />
      </Box>
    ) : null;
  const frostCardTint =
    frostGlass && backgroundImageUrl
      ? {
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background: frostBg,
          pointerEvents: "none",
        }
      : null;
  const frostInnerBg =
    frostGlass && backgroundImageUrl ? "transparent" : frostBg;

  return (
    <Box
      ref={assignRootRef}
      data-ad-export-root
      sx={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        bgcolor: bgHex,
        fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {backgroundImageUrl && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            "& [data-drag-hint]": { opacity: 0 },
            "@media (pointer: fine)": {
              "&:hover [data-drag-hint]": { opacity: isImagePanning ? 0 : 1 },
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: bgImage,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: bgPosition,
              transform: bgTransform,
              transformOrigin: "center center",
              ...imagePanCursorSx,
            }}
            style={bgPhotoExportStyle}
            {...imagePanHandlers}
            {...backgroundImageDoubleClickHandlers}
          />
          {dragHintEl}
          {miniPreviewEl}
        </Box>
      )}

      {frostExportStackBlurEl}

      {onPhotoLogoBlock}

      <Box
        ref={frostPanelRef}
        sx={{
          position: "absolute",
          ...(isLeaderboard
            ? {
                left: pad,
                right: pad,
                top: "50%",
                transform: `translateY(-50%) translate(${fpShiftX}px, ${fpShiftY}px)`,
                maxHeight: (height - pad * 2) * fpScale,
              }
            : {
                left: pad,
                right: pad,
                bottom: pad,
                top: "auto",
                // Use uniform scale so logos/text keep their aspect ratio.
                // Axis-only scaling (scaleY) can visually stretch the logo in some lifecycle paths.
                transform: `translate(${fpShiftX}px, ${fpShiftY}px) scale(${fpScale})`,
                transformOrigin: "center bottom",
                maxHeight: Math.min(height * 0.72, height - pad * 2),
              }),
          borderRadius: `${panelRadius}px`,
          border: frostGlass
            ? frostPanelOnLightSurface
              ? "1px solid rgba(0,0,0,0.1)"
              : "1px solid rgba(255,255,255,0.12)"
            : "1px solid rgba(0,0,0,0.12)",
          overflow: "hidden",
          ...(!isExporting && frostGlass && backgroundImageUrl
            ? { backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }
            : {}),
          pointerEvents: imagePanEnabled ? "none" : undefined,
        }}
      >
        {frostCardTint ? <Box aria-hidden sx={frostCardTint} /> : null}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            flexDirection: isLeaderboard ? "row" : "column",
            alignItems: isLeaderboard ? "center" : "stretch",
            gap: `${panelGap}px`,
            justifyContent: isLeaderboard ? "space-between" : "flex-start",
            px: `${panelPad}px`,
            py: `${panelPad}px`,
            background: frostInnerBg,
            // When panning the hero image, this shell must not capture drags — they must reach the
            // full-bleed background layer behind the card (otherwise vertical drags on the glass feel "stuck").
            // Headline, subtext, CTA, and logo opt back in with pointer-events: auto.
            ...(imagePanEnabled ? { pointerEvents: "none" } : { pointerEvents: "auto" }),
            ...shapesClickSx,
          }}
          onPointerDown={imagePanEnabled ? undefined : openShapesPanelFromPreview}
        >
        {showLogoInLayout && (
          <Box
            sx={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: logoJustify,
              width: isLeaderboard ? "auto" : "100%",
              minWidth: isLeaderboard ? scaledLogoW + 24 : undefined,
              ...(imagePanEnabled ? { pointerEvents: "none" } : {}),
            }}
          >
            <Box
              {...(logoFormatToolbarActive
                ? {
                    tabIndex: 0,
                    role: "button",
                    "aria-label": "Product logo, open formatting tools",
                    ...logoFloatingToolbarHandlers,
                  }
                : {})}
              onPointerDown={(e) => e.stopPropagation()}
              sx={{
                width: scaledLogoW,
                height: scaledLogoH,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                // When the frost panel opts out of pointer events for image panning, descendants
                // must opt back in (same pattern as headline / subtext / CTA).
                ...(imagePanEnabled ? { pointerEvents: "auto" } : {}),
                ...logoToolbarTargetSx,
              }}
            >
              {logoDisplay}
            </Box>
          </Box>
        )}

        <Box
          sx={{
            flex: isLeaderboard ? 1 : undefined,
            minWidth: 0,
            width: "100%",
          }}
        >
          <ArtboardInlineText
            value={headline}
            richValue={headlineRich}
            interactive={textInteractive}
            onCommit={onHeadlineChange}
            editingRole="headline"
            onEditingRoleChange={onInlineTextEditingChange}
            isActiveTool={activeInlineRole === "headline"}
            sx={{
              color: frostPanelOnLightSurface ? TEXT_ON_LIGHT_HEADLINE : "#fff",
              fontWeight: 700,
              fontSize: headlineSize,
              lineHeight: headlineLhDisplay,
              mb: 0.35,
              wordBreak: "break-word",
              textAlign: headAlign,
              ...(imagePanEnabled ? { pointerEvents: "auto" } : {}),
            }}
          />
          {shouldShowSubtextInFrosted && (
            <ArtboardInlineText
              value={subtext}
              richValue={subtextRich}
              interactive={textInteractive}
              onCommit={onSubtextChange}
              editingRole="subtext"
              onEditingRoleChange={onInlineTextEditingChange}
              isActiveTool={activeInlineRole === "subtext"}
              sx={{
                color: frostPanelOnLightSurface ? TEXT_ON_LIGHT_SUB : "rgba(255,255,255,0.88)",
                fontSize: subSize,
                lineHeight: subtextLhDisplay,
                wordBreak: "break-word",
                textAlign: subAlign,
                ...(imagePanEnabled ? { pointerEvents: "auto" } : {}),
              }}
            />
          )}
        </Box>

        {showCta && (
          <Box
            sx={{
              ...ctaRowWrapperSx,
              mt: isLeaderboard ? 0 : 0.25,
              ...(imagePanEnabled ? { pointerEvents: "auto" } : {}),
            }}
          >
            <Button
              variant="contained"
              size={shortSide >= 420 ? "medium" : "small"}
              sx={frostedCtaButtonSx}
              endIcon={ctaEndIconEl}
              {...ctaFloatingToolbarHandlers}
            >
              {cta}
            </Button>
          </Box>
        )}
        </Box>

        {showGrid && (
          <Box data-html2canvas-ignore sx={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" }}>
            <Box sx={{ position: "absolute", top: 0, bottom: 0, left: "33.33%", width: 1, bgcolor: "rgba(255,255,255,0.32)" }} />
            <Box sx={{ position: "absolute", top: 0, bottom: 0, left: "66.66%", width: 1, bgcolor: "rgba(255,255,255,0.32)" }} />
            <Box sx={{ position: "absolute", left: 0, right: 0, top: "33.33%", height: 1, bgcolor: "rgba(255,255,255,0.32)" }} />
            <Box sx={{ position: "absolute", left: 0, right: 0, top: "66.66%", height: 1, bgcolor: "rgba(255,255,255,0.32)" }} />
          </Box>
        )}

        {showSafeZones && (
          <SafeZoneOverlay width={width} height={height} />
        )}
      </Box>
    </Box>
  );
});

export default React.memo(AdArtboard);
