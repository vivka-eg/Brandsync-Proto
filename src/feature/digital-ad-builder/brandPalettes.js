import rawValueTokens from "./valueTokens.json";

/**
 * Figma "Value" tokens (Brand-* families + neutrals). Replaces themebuilder.json
 * for the digital ad builder so colours match design exports.
 */

const SEMANTIC_SKIP = new Set(["$extensions"]);

/** Legacy themebuilder shade keys → Figma 3-stop scale (deep / brand / light). */
const LEGACY_SHADE_MAP = {
  50: "3",
  100: "3",
  200: "3",
  300: "3",
  400: "2",
  500: "2",
  600: "2",
  700: "1",
  800: "1",
  900: "1",
  950: "1",
};

function extractHex(token) {
  if (!token || typeof token !== "object") return null;
  if (token.$type === "color" && token.$value && typeof token.$value.hex === "string") {
    return token.$value.hex;
  }
  return null;
}

function normalizeFamilyName(familyKey) {
  if (familyKey === "White") return "white";
  if (familyKey === "Grey") return "grey";
  if (familyKey === "Cool grey") return "coolGrey";
  if (familyKey === "Red") return "red";
  if (familyKey.startsWith("Brand-")) return familyKey.slice(6).toLowerCase();
  return familyKey.toLowerCase().replace(/\s+/g, "");
}

function formatFamilyLabel(familyKey) {
  if (familyKey.startsWith("Brand-")) return familyKey.slice(6).replace(/-/g, " ");
  return familyKey;
}

function normalizeShadeTokenName(tokenName, familyKey) {
  const endNum = tokenName.match(/-(\d+)$/);
  if (endNum) return endNum[1];
  if (familyKey === "Cool grey") {
    if (/dark/i.test(tokenName)) return "dark";
    if (/light/i.test(tokenName)) return "light";
  }
  if (tokenName === "Paper") return "paper";
  if (familyKey === "Red" && tokenName === "Red") return "1";
  return tokenName.toLowerCase().replace(/\s+/g, "-");
}

function buildPalettesFromFigmaTokens(raw) {
  const palettes = {};
  for (const [familyKey, familyVal] of Object.entries(raw)) {
    if (SEMANTIC_SKIP.has(familyKey) || familyKey.startsWith("$")) continue;
    if (typeof familyVal !== "object" || familyVal === null) continue;

    const name = normalizeFamilyName(familyKey);
    const shades = {};
    for (const [tokenName, tokenVal] of Object.entries(familyVal)) {
      if (tokenName.startsWith("$")) continue;
      const hex = extractHex(tokenVal);
      if (!hex) continue;
      const sk = normalizeShadeTokenName(tokenName, familyKey);
      shades[sk] = hex;
    }
    if (Object.keys(shades).length > 0) {
      palettes[name] = {
        shades,
        label: formatFamilyLabel(familyKey),
      };
    }
  }
  return palettes;
}

const colorPalettes = buildPalettesFromFigmaTokens(rawValueTokens);

function sortShadeKeys(keys) {
  return [...keys].sort((a, b) => {
    const na = parseInt(a, 10);
    const nb = parseInt(b, 10);
    const aNum = !Number.isNaN(na) && String(na) === a;
    const bNum = !Number.isNaN(nb) && String(nb) === b;
    if (aNum && bNum) return na - nb;
    if (aNum) return -1;
    if (bNum) return 1;
    return a.localeCompare(b);
  });
}

/**
 * Valid shade key for this palette, migrating legacy 50–950 keys from old themebuilder.
 */
export function resolveShadeKeyForPalette(paletteName, shadeKey) {
  const p = colorPalettes[paletteName];
  if (!p?.shades) return shadeKey;
  if (p.shades[shadeKey] != null) return shadeKey;
  if (LEGACY_SHADE_MAP[shadeKey] != null && p.shades[LEGACY_SHADE_MAP[shadeKey]] != null) {
    return LEGACY_SHADE_MAP[shadeKey];
  }
  const keys = sortShadeKeys(Object.keys(p.shades));
  return keys[0] ?? shadeKey;
}

/** Sorted shade keys for Select menus (depends on palette). */
export function getSortedShadeKeysForPalette(paletteName) {
  const p = colorPalettes[paletteName];
  if (!p?.shades) return [];
  return sortShadeKeys(Object.keys(p.shades));
}

/** Short label for shade dropdown (3-stop brands). */
export function formatShadeMenuLabel(shadeKey) {
  const hints = { 1: "Deep", 2: "Brand", 3: "Light" };
  if (hints[shadeKey]) return `${shadeKey} (${hints[shadeKey]})`;
  return shadeKey;
}

/** Mid “primary” shade for swatches; prefer 2, then 500 legacy → 2. */
export function getMidShadeKeyForPalette(paletteName) {
  const keys = getSortedShadeKeysForPalette(paletteName);
  if (keys.includes("2")) return "2";
  if (keys.includes("500")) return resolveShadeKeyForPalette(paletteName, "500");
  return keys[Math.floor(keys.length / 2)] ?? keys[0];
}

/**
 * @deprecated Use getSortedShadeKeysForPalette; shade keys are per palette now.
 */
export const SHADE_KEYS = ["1", "2", "3"];

export function getBrandPaletteEntries() {
  return Object.entries(colorPalettes).map(([name, val]) => ({
    name,
    label: val.label || name.charAt(0).toUpperCase() + name.slice(1),
    shades: val.shades,
  }));
}

export function getBrandPaletteNames() {
  return Object.keys(colorPalettes);
}

export function getShadeHex(paletteName, shadeKey) {
  const p = colorPalettes[paletteName];
  if (!p?.shades) return "#000000";
  const resolved = resolveShadeKeyForPalette(paletteName, shadeKey);
  return p.shades[resolved] ?? Object.values(p.shades)[0] ?? "#000000";
}
