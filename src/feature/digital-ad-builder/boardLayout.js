import { AD_SIZE_PRESET_MAP } from "./adSizePresets";

const GAP = 16;

/**
 * Base (x, y) pixel position for each artboard derived from its placement.
 * Returns { [id]: { x, y } } in board-space coordinates (before posX/posY offsets).
 */
export function computeArtboardBasePositions(artboards) {
  if (!artboards?.length) return {};
  const by = {};
  for (const ab of artboards) by[ab.placement] = ab;

  const ps = (ab) => (ab ? AD_SIZE_PRESET_MAP[ab.selectedSizeId] ?? { width: 300, height: 250 } : null);

  const top = ps(by.top);
  const left = ps(by.left);
  const center = ps(by.center);
  const right = ps(by.right);
  const bottom = ps(by.bottom);

  const c = center ?? { width: 300, height: 250 };
  const midW =
    (left?.width ?? 0) + (left ? GAP : 0) + c.width + (right ? GAP : 0) + (right?.width ?? 0);
  const midH = Math.max(left?.height ?? 0, c.height, right?.height ?? 0);
  const topH = top ? top.height : 0;
  const topGap = top ? GAP : 0;

  const w = Math.max(midW, top?.width ?? 0, bottom?.width ?? 0);
  const midY = topH + topGap;
  const rowStartX = (w - midW) / 2;

  const positions = {};
  if (by.top) positions[by.top.id] = { x: (w - top.width) / 2, y: 0 };
  if (by.left) positions[by.left.id] = { x: rowStartX, y: midY };
  if (by.center) positions[by.center.id] = { x: rowStartX + (left ? left.width + GAP : 0), y: midY };
  if (by.right) positions[by.right.id] = { x: rowStartX + (left ? left.width + GAP : 0) + c.width + GAP, y: midY };
  if (by.bottom) positions[by.bottom.id] = { x: (w - bottom.width) / 2, y: midY + midH + GAP };

  return positions;
}

/**
 * Pixel size of the composite "board" (banners arranged around center) for fitting in the preview.
 */
export function computeBoardLayoutDims(artboards) {
  if (!artboards?.length) return { w: 300, h: 250 };
  const by = {};
  for (const ab of artboards) {
    by[ab.placement] = ab;
  }
  const preset = (ab) => {
    if (!ab) return null;
    return AD_SIZE_PRESET_MAP[ab.selectedSizeId] ?? { width: 300, height: 250 };
  };
  const top = preset(by.top);
  const left = preset(by.left);
  const center = preset(by.center);
  const right = preset(by.right);
  const bottom = preset(by.bottom);

  const c = center ?? { width: 300, height: 250 };
  const midW =
    (left?.width ?? 0) + (left ? GAP : 0) + c.width + (right ? GAP : 0) + (right?.width ?? 0);
  const midH = Math.max(left?.height ?? 0, c.height, right?.height ?? 0);

  const topH = top ? top.height : 0;
  const botH = bottom ? bottom.height : 0;
  const topGap = top ? GAP : 0;
  const botGap = bottom ? GAP : 0;

  const w = Math.max(midW, top?.width ?? 0, bottom?.width ?? 0);
  const h = topH + topGap + midH + botGap + botH;
  return { w, h };
}

export const BOARD_PREVIEW_GAP = GAP;
