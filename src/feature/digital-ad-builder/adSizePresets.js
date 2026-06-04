/**
 * Standard digital ad dimensions (IAB / social + large-format exports).
 *
 * Figma file `OJirkXG7z2xXAf63VDySjr` (Online Ads) uses only three pixel sizes across
 * many frames (e.g. 79:1750 / 79:2304 / 12:1416 → 1200×1200; 79:1809 / 79:2363 → 1200×600);
 * 19:1689 / 79:1872 / 12:1474 / 79:2488 / 79:1996 → 1080×1920. One preset id per size.
 */
/**
 * Each `label` is the user-facing **Ad format** name (dimensions still show in the select as “Name (W × H px)”).
 *
 * | id        | label                 | role |
 * |-----------|----------------------|------|
 * | 300x250   | Medium Rectangle     | IAB |
 * | 500x500   | Square 500           | General square |
 * | 1200x1200 | Large square         | High-res square export |
 * | 1200x600  | Wide banner          | Large landscape banner |
 * | 1200x600-smartkalk | EG Smartkalk  | Figma `9:685`, same px as wide banner |
 * | 160x600   | Wide Skyscraper      | IAB |
 * | 300x600   | Half Page            | IAB |
 * | 336x280   | Large Rectangle      | IAB |
 * | 728x90    | Leaderboard          | IAB |
 * | 320x100   | Mobile Banner        | Mobile web |
 * | 320x50    | Mobile Banner (Short)  | Mobile web |
 * | 1080x1080 | Social square        | 1:1 social feed |
 * | 1080x1350 | Portrait (4:5)       | Portrait social feed |
 * | 1080x1920 | Vertical (9:16)      | Stories / full-height vertical |
 */
export const AD_SIZE_PRESETS = [
  { id: "300x250", label: "Medium Rectangle", width: 300, height: 250 },
  { id: "500x500", label: "Square 500", width: 500, height: 500 },
  { id: "1200x1200", label: "Large square", width: 1200, height: 1200 },
  { id: "1200x600", label: "Wide banner", width: 1200, height: 600 },
  /** Figma: Online Ads, Smartkalk `9:685` (“EG Smartkalk-1200x600 Ad- Original Content”). */
  { id: "1200x600-smartkalk", label: "EG Smartkalk", width: 1200, height: 600 },
  { id: "160x600", label: "Wide Skyscraper", width: 160, height: 600 },
  { id: "300x600", label: "Half Page", width: 300, height: 600 },
  { id: "336x280", label: "Large Rectangle", width: 336, height: 280 },
  { id: "728x90", label: "Leaderboard", width: 728, height: 90 },
  { id: "320x100", label: "Mobile Banner", width: 320, height: 100 },
  { id: "320x50", label: "Mobile Banner (Short)", width: 320, height: 50 },
  { id: "1080x1080", label: "Social square", width: 1080, height: 1080 },
  { id: "1080x1350", label: "Portrait (4:5)", width: 1080, height: 1350 },
  { id: "1080x1920", label: "Vertical (9:16)", width: 1080, height: 1920 },
];

export const AD_SIZE_PRESET_MAP = Object.fromEntries(
  AD_SIZE_PRESETS.map((p) => [p.id, p]),
);

/** True if two preset ids refer to the same canvas (e.g. 1200×600 vs Smartkalk variant). */
export function isSameAdSize(a, b) {
  if (a === b) return true;
  if (a === "1200x600" && b === "1200x600-smartkalk") return true;
  if (b === "1200x600" && a === "1200x600-smartkalk") return true;
  return false;
}

export const DEFAULT_SELECTED_SIZE_IDS = AD_SIZE_PRESETS.map((p) => p.id);

/** Every preset id (same order as `AD_SIZE_PRESETS`). */
export const ALL_AD_SIZE_IDS = DEFAULT_SELECTED_SIZE_IDS;

/**
 * Preview / export order: similar aspect ratios stacked together (wide banners,
 * rectangles, squares, tall units, vertical social). Also drives grouped Ad format options in the UI.
 */
export const PREVIEW_GROUPS = [
  {
    id: "landscape-banners",
    title: "Landscape banners",
    sizeIds: ["1200x600", "728x90", "320x100", "320x50"],
  },
  {
    id: "rectangles",
    title: "Rectangles",
    sizeIds: ["300x250", "336x280"],
  },
  {
    id: "squares",
    title: "Square",
    sizeIds: ["500x500", "1080x1080", "1200x1200"],
  },
  {
    id: "tall-units",
    title: "Tall units",
    sizeIds: ["160x600", "300x600"],
  },
  {
    id: "vertical-social",
    title: "Vertical (social)",
    sizeIds: ["1080x1350", "1080x1920"],
  },
];

/** Selected size ids split into preview groups (only groups with ≥1 selection). */
export function getGroupedSelectedSizeIds(selectedIds) {
  const set = new Set(selectedIds);
  const groups = PREVIEW_GROUPS.map((g) => ({
    id: g.id,
    title: g.title,
    sizeIds: g.sizeIds.filter((id) => set.has(id)),
  })).filter((g) => g.sizeIds.length > 0);

  const inGroups = new Set(groups.flatMap((g) => g.sizeIds));
  const rest = selectedIds.filter((id) => !inGroups.has(id));
  if (rest.length > 0) {
    groups.push({
      id: "other",
      title: "Other sizes",
      sizeIds: rest,
    });
  }
  return groups;
}
