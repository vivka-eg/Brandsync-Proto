/**
 * Template patches from `adTemplates` merge into shared artwork state.
 * Keeps user headline / subtext / CTA unless explicitly overwritten.
 */
export function prepareTemplatePatch(patch, currentAdLayout) {
  const patchToApply = { ...patch };
  delete patchToApply.headline;
  delete patchToApply.subtext;
  delete patchToApply.cta;
  /** Never change artboard identity, placement, or pixel size from a layout template. */
  delete patchToApply.selectedSizeId;
  delete patchToApply.placement;
  delete patchToApply.id;
  delete patchToApply.backgroundAssetId;
  delete patchToApply.backgroundImageUrl;
  if (patchToApply.adLayout === "frostedPanel" || (!patchToApply.adLayout && currentAdLayout === "frostedPanel")) {
    if (patchToApply.frostPanelEnabled === undefined) patchToApply.frostPanelEnabled = true;
    if (patchToApply.frostOpacity === undefined) patchToApply.frostOpacity = 0.5;
  }
  return patchToApply;
}
