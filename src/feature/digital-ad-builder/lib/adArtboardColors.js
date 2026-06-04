export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
}

function srgbChannelToLinear(c) {
  const x = c / 255;
  return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance for sRGB hex (0–1). */
export function relativeLuminance(hex) {
  if (!hex || typeof hex !== "string") return 0;
  const { r, g, b } = hexToRgb(hex);
  if ([r, g, b].some((x) => Number.isNaN(x))) return 0;
  const R = srgbChannelToLinear(r);
  const G = srgbChannelToLinear(g);
  const B = srgbChannelToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/** True when the solid colour reads as a light surface (white text would fail). */
export function isLightHex(hex, threshold = 0.52) {
  return relativeLuminance(hex) >= threshold;
}

function parseOpacity(opacity, fallback = 0.5) {
  if (typeof opacity === "number" && Number.isFinite(opacity)) return opacity;
  if (typeof opacity === "string" && opacity.trim() !== "") {
    const n = parseFloat(opacity);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

export function frostBackground(frostHex, opacity) {
  const { r, g, b } = hexToRgb(typeof frostHex === "string" && frostHex ? frostHex : "#808080");
  const safeR = Number.isFinite(r) ? r : 128;
  const safeG = Number.isFinite(g) ? g : 128;
  const safeB = Number.isFinite(b) ? b : 128;
  const o = Math.min(1, Math.max(0, parseOpacity(opacity)));
  return `rgba(${safeR},${safeG},${safeB},${o})`;
}
