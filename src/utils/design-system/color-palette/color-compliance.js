/**
 * Convert a HEX color string to an RGB object.
 *
 * @param {string} hex - Hex color (e.g., "#3366FF" or "#fff")
 * @returns {{r: number, g: number, b: number}} RGB channels
 */
export function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3)
    hex = hex
      .split("")
      .map((x) => x + x)
      .join("");

  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  };
}

/**
 * Calculate the relative luminance of an RGB color.
 *
 * @param {number} r - Red channel (0–255)
 * @param {number} g - Green channel (0–255)
 * @param {number} b - Blue channel (0–255)
 * @returns {number} Relative luminance (0–1)
 */
export function luminance(r, g, b) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

/**
 * Calculate the contrast ratio between two hex colors (2 decimals).
 *
 * @param {string} hex1 - First hex color
 * @param {string} hex2 - Second hex color
 * @returns {number} Contrast ratio (rounded to 2 decimals)
 */
export function contrastRatio(hex1, hex2) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);

  const L1 = luminance(c1.r, c1.g, c1.b);
  const L2 = luminance(c2.r, c2.g, c2.b);

  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);

  return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;
}

/**
 * Calculate WCAG AA/AAA compliance for body (normal) and large text.
 *
 * @param {number} ratio - Contrast ratio
 * @returns {{
 *   large: {AA: boolean, AAA: boolean},
 *   body: {AA: boolean, AAA: boolean}
 * }} WCAG compliance object
 */
function getCompliance(ratio) {
  return {
    large: {
      AA: ratio >= 3,
      AAA: ratio >= 4.5,
    },
    body: {
      AA: ratio >= 4.5,
      AAA: ratio >= 7,
    },
  };
}

/**
 * Determine overall compliance level based on WCAG rules.
 *
 * @param {{body: {AA: boolean, AAA: boolean}, large: {AA: boolean, AAA: boolean}}} whiteComp - Compliance on white
 * @param {{body: {AA: boolean, AAA: boolean}, large: {AA: boolean, AAA: boolean}}} blackComp - Compliance on black
 * @returns {"AAA" | "AA" | "Fail"} Highest achieved WCAG level
 */
function overallLevel(whiteComp, blackComp) {
  const best = (comp) =>
    comp.body.AAA || comp.large.AAA
      ? "AAA"
      : comp.body.AA || comp.large.AA
      ? "AA"
      : "Fail";

  const white = best(whiteComp);
  const black = best(blackComp);

  if (white === "AAA" || black === "AAA") return "AAA";
  if (white === "AA" || black === "AA") return "AA";
  return "Fail";
}

/**
 * Evaluate accessibility contrast of a color against white & black.
 *
 * @param {string} color - Hex color (e.g., "#3366FF")
 * @returns {{
 *   name: string,
 *   color: string,
 *   white: {
 *     ratio: number,
 *     large: {AA: boolean, AAA: boolean},
 *     body: {AA: boolean, AAA: boolean}
 *   },
 *   black: {
 *     ratio: number,
 *     large: {AA: boolean, AAA: boolean},
 *     body: {AA: boolean, AAA: boolean}
 *   },
 *   overallCompliance: "AAA" | "AA" | "Fail"
 * }} Full contrast evaluation result
 */
export function evaluateColor(color) {
  const ratioWhite = contrastRatio(color, "#FFFFFF");
  const ratioBlack = contrastRatio(color, "#000000");

  const compWhite = getCompliance(ratioWhite);
  const compBlack = getCompliance(ratioBlack);

  return {
    color,

    white: {
      ratio: ratioWhite,
      large: compWhite.large,
      body: compWhite.body,
    },

    black: {
      ratio: ratioBlack,
      large: compBlack.large,
      body: compBlack.body,
    },

    overallCompliance: overallLevel(compWhite, compBlack),
  };
}

export function evaluateColorCustom(color1, color2) {
  const ratio = contrastRatio(color1, color2);

  const comp = getCompliance(ratio);

  return {
    color1,
    color2,

    ratio,
    large: comp.large,
    body: comp.body,
  };
}
