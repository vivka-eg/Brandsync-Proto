import colorPalettes from "brandsync-tokens/themebuilder.json";

const SEMANTIC_COLORS = new Set(["neutral", "success", "error", "warning", "information"]);

// Build brand token list from the themebuilder.json; uses the 500 shade as the swatch color.
// Excludes semantic utility colors.
export const BRAND_TOKENS = Object.entries(colorPalettes)
  .filter(([name]) => !SEMANTIC_COLORS.has(name))
  .map(([name, val]) => ({
    label: name.charAt(0).toUpperCase() + name.slice(1),
    color: val.shades["500"],
  }));

export const FRAMEWORKS = ["Angular", "React", "Vue", "Next.js", "Nuxt", "Other"];
