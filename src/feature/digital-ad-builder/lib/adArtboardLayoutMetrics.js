import { PHOTO_BAND_TYPE } from "../adLayoutTokens";

const PHOTO_BAND_RATIO_MIN = 0.25;
const PHOTO_BAND_RATIO_MAX = 0.7;

function clampBandRatio(r) {
  const n = typeof r === "number" && !Number.isNaN(r) ? r : 0.495;
  return Math.min(PHOTO_BAND_RATIO_MAX, Math.max(PHOTO_BAND_RATIO_MIN, n));
}

function clampOffset(v) {
  const n = typeof v === "number" && !Number.isNaN(v) ? v : 0;
  return Math.min(50, Math.max(-50, Math.round(n)));
}

export function computeAdArtboardLayoutMetrics({
  width,
  height,
  adLayout,
  photoBandHeightRatio,
  headlineSpacing,
  logoScale,
  headlineFontScale,
  subtextFontScale,
  headlineLineHeight,
  subtextLineHeight,
  ctaFontScale,
  ctaPaddingScale,
  ctaOffsetX,
  ctaOffsetY,
}) {
  const shortSide = Math.min(width, height);
  const isLeaderboard = height <= 140 && width >= height * 2.2;
  const usePhotoBand = adLayout === "photoBand";
  const usePhotoBandLb = usePhotoBand && isLeaderboard;
  const usePhotoBandTall = usePhotoBand && !isLeaderboard;
  const bandRatio = clampBandRatio(photoBandHeightRatio);
  const bandHeightPx = usePhotoBandTall ? Math.round(height * bandRatio) : 0;
  const photoHeightPx = usePhotoBandTall ? height - bandHeightPx : 0;
  const bandWidthPx = usePhotoBandLb ? Math.round(width * bandRatio) : 0;
  const photoWidthPx = usePhotoBandLb ? width - bandWidthPx : 0;

  let headlineSize;
  let subSize;
  let ctaSize;
  let logoH;
  let panelPad;
  let panelGap;
  let panelRadius;

  if (usePhotoBandLb) {
    const h = height;
    let headlineR;
    let subR;
    let ctaR;
    let logoR;
    let headlineFloor;
    let subFloor;
    if (h <= 56) {
      headlineR = 0.15;
      subR = 0.085;
      ctaR = 0.095;
      logoR = 0.17;
      headlineFloor = 7;
      subFloor = 5;
    } else if (h <= 100) {
      headlineR = 0.16;
      subR = 0.09;
      ctaR = 0.1;
      logoR = 0.19;
      headlineFloor = 8;
      subFloor = 6;
    } else if (h <= 140) {
      headlineR = 0.2;
      subR = 0.12;
      ctaR = 0.12;
      logoR = 0.22;
      headlineFloor = 9;
      subFloor = 7;
    } else {
      headlineR = 0.28;
      subR = 0.15;
      ctaR = 0.14;
      logoR = 0.26;
      headlineFloor = 10;
      subFloor = 8;
    }
    headlineSize = Math.round(Math.max(headlineFloor, Math.min(h * headlineR, h * 0.36)));
    subSize = Math.round(Math.max(subFloor, Math.min(h * subR, h * 0.22)));
    ctaSize = Math.round(Math.max(8, Math.min(h * ctaR, h * 0.19)));
    logoH = Math.round(Math.max(16, Math.min(h * logoR, h * 0.34)));
    panelPad = Math.max(4, Math.min(height * 0.08, 14));
    panelGap = Math.max(4, Math.min(height * 0.06, 10));
    panelRadius = 0;
    if (h <= 100) {
      panelPad = Math.max(3, Math.min(height * 0.052, 10));
      panelGap = Math.max(2, Math.min(height * 0.032, 6));
    }
  } else if (usePhotoBandTall) {
    headlineSize = Math.round(Math.max(14, Math.min(shortSide * PHOTO_BAND_TYPE.headline, 96)));
    subSize = Math.round(Math.max(11, Math.min(shortSide * PHOTO_BAND_TYPE.subtext, 56)));
    ctaSize = Math.round(Math.max(10, Math.min(shortSide * PHOTO_BAND_TYPE.subtext * 0.85, 44)));
    logoH = Math.round(Math.max(24, Math.min(shortSide * 0.15, 200)));
    panelPad = Math.max(10, Math.min(width * PHOTO_BAND_TYPE.horizontalPad, 64));
    panelGap = Math.round(Math.max(8, shortSide * PHOTO_BAND_TYPE.headlineSubGap));
    panelRadius = 0;
  } else if (isLeaderboard) {
    headlineSize = Math.round(Math.max(10, Math.min(height * 0.26, height * 0.34)));
    subSize = Math.round(Math.max(8, Math.min(height * 0.15, height * 0.2)));
    ctaSize = Math.round(Math.max(8, Math.min(height * 0.15, height * 0.2)));
    logoH = Math.round(Math.max(18, Math.min(height * 0.24, height * 0.36)));
    panelPad = Math.max(6, Math.min(height * 0.08, 14));
    panelGap = Math.max(6, Math.min(height * 0.06, 12));
    panelRadius = Math.max(4, Math.min(height * 0.06, 12));
  } else {
    headlineSize = Math.round(Math.max(11, Math.min(shortSide * 0.065, 88)));
    subSize = Math.round(Math.max(9, Math.min(shortSide * 0.038, 52)));
    ctaSize = Math.round(Math.max(9, Math.min(shortSide * 0.036, 48)));
    logoH = Math.round(Math.max(24, Math.min(shortSide * 0.15, 200)));
    panelPad = Math.max(8, Math.min(shortSide * 0.022, 36));
    panelGap = Math.max(6, Math.min(shortSide * 0.014, 20));
    panelRadius = Math.max(6, Math.min(shortSide * 0.018, 24));
  }

  const headlineSpacingClamped =
    typeof headlineSpacing === "number" && !Number.isNaN(headlineSpacing)
      ? Math.min(3, Math.max(0, headlineSpacing))
      : 1;
  panelGap = Math.round(panelGap * headlineSpacingClamped);

  let logoSlotW;
  if (usePhotoBandLb) {
    logoSlotW = Math.round(Math.min(width * 0.18, bandWidthPx * 0.42));
  } else if (usePhotoBandTall) {
    logoSlotW = Math.round(Math.min(width * 0.48, shortSide * 0.55));
  } else if (isLeaderboard) {
    logoSlotW = Math.round(width * 0.22);
  } else {
    logoSlotW = Math.round(Math.min(width * 0.48, shortSide * 0.55));
  }
  const logoSlotH = logoH;

  const logoScaleClamped =
    typeof logoScale === "number" && !Number.isNaN(logoScale) ? Math.min(1.5, Math.max(0.5, logoScale)) : 1;
  const scaledLogoW = Math.round(logoSlotW * logoScaleClamped);
  const scaledLogoH = Math.round(logoSlotH * logoScaleClamped);

  const isLargePortrait = width >= 600 && height / width >= 1.65;
  if (isLargePortrait) {
    const minCta = Math.round(Math.min(Math.max(height * 0.024, 42), 58));
    ctaSize = Math.round(Math.max(ctaSize, minCta));
  }

  const hScale =
    typeof headlineFontScale === "number" && headlineFontScale > 0 ? headlineFontScale : 1;
  const sScale =
    typeof subtextFontScale === "number" && subtextFontScale > 0 ? subtextFontScale : 1;

  if (usePhotoBandLb) {
    const h = height;
    if (h <= 100) {
      headlineSize = Math.min(headlineSize, Math.max(6, Math.round(h * 0.115)));
      subSize = Math.min(subSize, Math.max(5, Math.round(h * 0.074)));
    } else if (h <= 140) {
      headlineSize = Math.min(headlineSize, Math.max(7, Math.round(h * 0.145)));
      subSize = Math.min(subSize, Math.max(6, Math.round(h * 0.09)));
    }
  }

  headlineSize = Math.round(Math.max(6, headlineSize * hScale));
  subSize = Math.round(Math.max(5, subSize * sScale));

  const headlineLh =
    typeof headlineLineHeight === "number" && headlineLineHeight > 0 ? headlineLineHeight : 1.1;
  const subtextLh =
    typeof subtextLineHeight === "number" && subtextLineHeight > 0 ? subtextLineHeight : 1.15;
  const compactLeaderboardStrip = usePhotoBandLb && height <= 100;
  const veryCompactLbStrip = usePhotoBandLb && height <= 56;
  const headlineLhDisplay = compactLeaderboardStrip ? Math.min(headlineLh, 1.05) : headlineLh;
  const subtextLhDisplay = compactLeaderboardStrip ? Math.min(subtextLh, 1.1) : subtextLh;

  const isSmallBanner = isLeaderboard && height <= 120;
  const visualCtaSize = isSmallBanner ? Math.round(Math.max(6, ctaSize * 0.65)) : ctaSize;
  const ctaFontScaleRaw =
    typeof ctaFontScale === "number" && !Number.isNaN(ctaFontScale) && ctaFontScale > 0
      ? ctaFontScale
      : 1;
  const ctaFontScaleClamped = Math.min(1.35, Math.max(0.65, ctaFontScaleRaw));
  const ctaPaddingScaleRaw =
    typeof ctaPaddingScale === "number" && !Number.isNaN(ctaPaddingScale) && ctaPaddingScale > 0
      ? ctaPaddingScale
      : 1;
  const ctaPaddingScaleClamped = Math.min(1.35, Math.max(0.65, ctaPaddingScaleRaw));
  const visualCtaFontPx = Math.round(Math.max(5, visualCtaSize * ctaFontScaleClamped));
  const ctaFontPx = Math.round(Math.max(5, ctaSize * ctaFontScaleClamped));

  const ctaOx = clampOffset(ctaOffsetX);
  const ctaOy = clampOffset(ctaOffsetY);
  const ctaNudgePxX = (ctaOx / 50) * Math.max(10, shortSide * 0.034);
  const ctaNudgePxY = (ctaOy / 50) * Math.max(8, shortSide * 0.026);

  return {
    shortSide,
    isLeaderboard,
    usePhotoBand,
    usePhotoBandLb,
    usePhotoBandTall,
    bandRatio,
    bandHeightPx,
    photoHeightPx,
    bandWidthPx,
    photoWidthPx,
    headlineSize,
    subSize,
    ctaSize,
    logoH,
    panelPad,
    panelGap,
    panelRadius,
    logoSlotW,
    logoSlotH,
    scaledLogoW,
    scaledLogoH,
    headlineLhDisplay,
    subtextLhDisplay,
    compactLeaderboardStrip,
    veryCompactLbStrip,
    isSmallBanner,
    isLargePortrait,
    visualCtaSize,
    ctaFontScaleClamped,
    ctaPaddingScaleClamped,
    visualCtaFontPx,
    ctaFontPx,
    ctaNudgePxX,
    ctaNudgePxY,
  };
}
