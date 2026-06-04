/** Maps font scale (0.5–1.75) to a 12–24 px “control” display used in the Content tab. */
const SCALE_MIN = 0.5;
const SCALE_MAX = 1.75;
const PX_MIN = 12;
const PX_MAX = 24;

export function scaleToContentPx(scale) {
  const s = typeof scale === "number" && scale > 0 ? scale : 1;
  const clamped = Math.min(SCALE_MAX, Math.max(SCALE_MIN, s));
  return Math.round(PX_MIN + ((clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * (PX_MAX - PX_MIN));
}

export function contentPxToScale(px) {
  const n = typeof px === "number" ? px : 18;
  const clamped = Math.min(PX_MAX, Math.max(PX_MIN, Math.round(n)));
  return SCALE_MIN + ((clamped - PX_MIN) / (PX_MAX - PX_MIN)) * (SCALE_MAX - SCALE_MIN);
}
