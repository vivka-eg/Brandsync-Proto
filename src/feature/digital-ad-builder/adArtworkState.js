import { DEFAULT_AD_BUILDER_BACKGROUND_IMAGE_URL } from "./defaultAdBackgroundImageUrl";
import { DEFAULT_AD_BUILDER_BRAND_PALETTE } from "./adBuilderDefaults";
import { AD_TEMPLATES, DEFAULT_AD_BUILDER_TEMPLATE_ID } from "./adTemplates";

export const AD_ARTWORK_VERSION = 6;

/** One shared creative; first slot uses `center`, extras orbit top → right → bottom → left. */
export const BOARD_PLACEMENT = {
  CENTER: "center",
  TOP: "top",
  RIGHT: "right",
  BOTTOM: "bottom",
  LEFT: "left",
};

const SATELLITE_PLACEMENT_ORDER = [
  BOARD_PLACEMENT.TOP,
  BOARD_PLACEMENT.RIGHT,
  BOARD_PLACEMENT.BOTTOM,
  BOARD_PLACEMENT.LEFT,
];

function newArtboardId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `ab-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Satellite index 0 = top, 1 = right, … (wraps). Used when adding the 2nd, 3rd, … banner. */
export function placementForSatelliteIndex(satelliteIndex) {
  return SATELLITE_PLACEMENT_ORDER[satelliteIndex % SATELLITE_PLACEMENT_ORDER.length];
}

/** After delete/reorder, first banner is always center; others get satellites in order. Resets position offsets since base positions change. */
export function reassignBoardPlacements(artboards) {
  return artboards.map((ab, i) => ({
    ...ab,
    placement: i === 0 ? BOARD_PLACEMENT.CENTER : placementForSatelliteIndex(i - 1),
    posX: 0,
    posY: 0,
  }));
}

export function defaultBannerCreative(overrides = {}) {
  return {
    headline: "Your headline here",
    headlineRich: null,
    subtext: "Supporting copy that explains your offer in one or two short lines.",
    subtextRich: null,
    cta: "Learn more",
    backgroundAssetId: null,
    backgroundImageUrl: DEFAULT_AD_BUILDER_BACKGROUND_IMAGE_URL,
    logoScale: 1,
    logoAlign: "left",
    logoPlacement: "inLayout",
    imageScale: 1,
    imageOffsetX: 0,
    imageOffsetY: 0,
    frostPanelEnabled: true,
    frostOpacity: 0.5,
    frostPanelScale: 1,
    frostPanelOffsetX: 0,
    frostPanelOffsetY: 0,
    adLayout: "frostedPanel",
    photoBandPosition: "bottom",
    photoBandCtaPlacement: "onBand",
    photoBandCtaOnPhotoVertical: "bottom",
    photoBandHeightRatio: 0.495,
    headlineFontScale: 1,
    subtextFontScale: 1,
    headlineLineHeight: 1.1,
    subtextLineHeight: 1.15,
    headlineSpacing: 1,
    ctaRadius: 0,
    headlineAlign: "left",
    subtextAlign: "left",
    ctaShowIcon: false,
    ctaAlign: "left",
    ctaFontScale: 1,
    ctaPaddingScale: 1,
    ctaOffsetX: 0,
    ctaOffsetY: 0,
    logoDocumentId: overrides.logoDocumentId,
    logoTone: overrides.logoTone,
    logoOrientation: overrides.logoOrientation,
    ...overrides,
  };
}

const _bannerKeys = new Set(Object.keys(defaultBannerCreative()));
/** Fields stored on each artboard (not on document root). `selectedSizeId` is updated via its own path. */
export const BANNER_CREATIVE_FIELD_KEYS = _bannerKeys;

export function isBannerCreativeField(key) {
  return key !== "selectedSizeId" && key !== "placement" && key !== "id" && _bannerKeys.has(key);
}

export function createArtboardSlot(selectedSizeId = "300x250", placement = BOARD_PLACEMENT.CENTER, creativeOverrides = {}) {
  return {
    id: newArtboardId(),
    selectedSizeId,
    placement,
    posX: 0,
    posY: 0,
    ...defaultBannerCreative(creativeOverrides),
  };
}

export function pickSharedRoot(prev) {
  if (!prev || typeof prev !== "object") return {};
  return {
    version: AD_ARTWORK_VERSION,
    logoDocumentId: prev.logoDocumentId ?? null,
    logoTone: prev.logoTone ?? "light",
    logoOrientation: prev.logoOrientation ?? "horizontal",
    bgPalette: prev.bgPalette ?? DEFAULT_AD_BUILDER_BRAND_PALETTE,
    bgShade: prev.bgShade ?? "2",
    frostPalette: prev.frostPalette ?? DEFAULT_AD_BUILDER_BRAND_PALETTE,
    frostShade: prev.frostShade ?? "2",
    extraBrandPaletteNames: Array.isArray(prev.extraBrandPaletteNames) ? prev.extraBrandPaletteNames : [],
  };
}

function pickBannerCreativeFromRoot(prev) {
  const o = defaultBannerCreative();
  for (const k of _bannerKeys) {
    if (prev[k] !== undefined) o[k] = prev[k];
  }
  if (prev.backgroundImageUrl !== undefined) o.backgroundImageUrl = prev.backgroundImageUrl;
  if (prev.backgroundAssetId !== undefined) o.backgroundAssetId = prev.backgroundAssetId;
  return o;
}

export function defaultAdArtworkState(rootOverride = {}) {
  const template = AD_TEMPLATES.find((t) => t.id === DEFAULT_AD_BUILDER_TEMPLATE_ID);
  const templatePatch = template?.patch ? { ...template.patch } : {};
  const firstId = newArtboardId();

  return {
    ...pickSharedRoot(rootOverride),
    artboards: [
      {
        id: firstId,
        selectedSizeId: "300x250",
        placement: BOARD_PLACEMENT.CENTER,
        ...defaultBannerCreative(templatePatch),
      },
    ],
    activeArtboardId: firstId,
  };
}

/** Blank board state with no artboards — used when the user creates a new board. */
export function emptyAdArtworkState() {
  return {
    ...pickSharedRoot({}),
    artboards: [],
    activeArtboardId: null,
  };
}

export function getActiveArtboard(state) {
  if (!state?.artboards?.length) return null;
  if (state.activeArtboardId === null) return null;
  const found = state.artboards.find((a) => a.id === state.activeArtboardId);
  return found ?? state.artboards[0];
}

export function getActiveSelectedSizeId(state) {
  const ab = getActiveArtboard(state);
  if (ab) return ab.selectedSizeId ?? "300x250";
  if (state?.artboards?.length) return state.artboards[0].selectedSizeId ?? "300x250";
  return "300x250";
}

/** Flat state for panels that expect `state.headline`, `state.selectedSizeId`, etc. (active slot + shared). */
export function mergeActiveArtboardForUi(state) {
  const shared = pickSharedRoot(state);
  const ab = getActiveArtboard(state);
  if (!ab) {
    const first = state.artboards?.[0];
    if (!first) {
      return {
        ...shared,
        ...defaultBannerCreative(),
        selectedSizeId: "300x250",
        artboards: state.artboards ?? [],
      };
    }
    const merged = getMergedStateForArtboard(state, first.id);
    return { ...merged, activeArtboardId: null };
  }
  // eslint-disable-next-line no-unused-vars
  const { id, placement, selectedSizeId, posX, posY, ...creative } = ab;
  return {
    ...shared,
    ...creative,
    selectedSizeId,
    activeArtboardId: id,
    artboards: state.artboards,
  };
}

/** @deprecated Use mergeActiveArtboardForUi */
export const withActiveSelectedSizeId = mergeActiveArtboardForUi;

/** Merged flat state for one artboard (shared brand + that slot’s creative). */
export function getMergedStateForArtboard(state, artboardId) {
  const shared = pickSharedRoot(state);
  const ab = state.artboards?.find((a) => a.id === artboardId);
  if (!ab) {
    return { ...shared, ...defaultBannerCreative(), selectedSizeId: "300x250", artboards: state.artboards ?? [] };
  }
  // eslint-disable-next-line no-unused-vars
  const { id, placement, selectedSizeId, posX, posY, ...creative } = ab;
  return {
    ...shared,
    ...creative,
    selectedSizeId,
    activeArtboardId: id,
    artboards: state.artboards,
  };
}

export function migrateAdArtworkStateIfNeeded(prev) {
  if (!prev || typeof prev !== "object") return defaultAdArtworkState();
  if (Array.isArray(prev.artboards) && prev.artboards.length === 0) {
    return { ...pickSharedRoot(prev), artboards: [], activeArtboardId: null, version: AD_ARTWORK_VERSION };
  }

  if (Array.isArray(prev.artboards) && prev.artboards.length > 0) {
    const first = prev.artboards[0];
    const hasPerSlotCreative = first && typeof first.headline === "string";

    if (hasPerSlotCreative) {
      const activeArtboardId =
        typeof prev.activeArtboardId === "string" && prev.artboards.some((a) => a.id === prev.activeArtboardId)
          ? prev.activeArtboardId
          : prev.artboards[0].id;
      return {
        ...pickSharedRoot(prev),
        artboards: reassignBoardPlacements(
          prev.artboards.map((ab, i) => {
            const bgUrl = ab.backgroundImageUrl ?? prev.backgroundImageUrl ?? DEFAULT_AD_BUILDER_BACKGROUND_IMAGE_URL;
            const bgAsset =
              ab.backgroundAssetId !== undefined && ab.backgroundAssetId !== null
                ? ab.backgroundAssetId
                : prev.backgroundAssetId ?? null;
            return {
              ...ab,
              placement: ab.placement ?? (i === 0 ? BOARD_PLACEMENT.CENTER : placementForSatelliteIndex(i - 1)),
              backgroundImageUrl: bgUrl,
              backgroundAssetId: bgAsset,
            };
          }),
        ),
        activeArtboardId,
        version: AD_ARTWORK_VERSION,
      };
    }

    const creativeFromRoot = pickBannerCreativeFromRoot(prev);
    const artboards = prev.artboards.map((ab, i) => ({
      id: ab.id,
      selectedSizeId: ab.selectedSizeId,
      placement: i === 0 ? BOARD_PLACEMENT.CENTER : placementForSatelliteIndex(i - 1),
      ...creativeFromRoot,
    }));
    const activeArtboardId =
      typeof prev.activeArtboardId === "string" && artboards.some((a) => a.id === prev.activeArtboardId)
        ? prev.activeArtboardId
        : artboards[0].id;
    return {
      ...pickSharedRoot(prev),
      artboards,
      activeArtboardId,
      version: AD_ARTWORK_VERSION,
    };
  }

  if (prev.selectedSizeId != null || prev.headline != null) {
    const { selectedSizeId: legacySize, ...rest } = prev;
    const id = newArtboardId();
    const creative = pickBannerCreativeFromRoot(prev);
    return {
      ...pickSharedRoot(rest),
      artboards: [
        {
          id,
          selectedSizeId: legacySize || "300x250",
          placement: BOARD_PLACEMENT.CENTER,
          ...creative,
        },
      ],
      activeArtboardId: id,
      version: AD_ARTWORK_VERSION,
    };
  }

  return defaultAdArtworkState();
}

export function toSerializableAdArtwork(state) {
  const shared = pickSharedRoot(state);
  const base = {
    ...shared,
    artboards: Array.isArray(state.artboards) ? state.artboards : [],
    activeArtboardId:
      state.activeArtboardId === null
        ? null
        : typeof state.activeArtboardId === "string"
          ? state.activeArtboardId
          : "",
  };
  return base;
}
