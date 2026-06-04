export const PREVIEW_ENTER_MS = 0.2;

export const PREVIEW_ZOOM_MIN = 0.25;
export const PREVIEW_ZOOM_MAX = 8;
/** Scales wheel delta (pixels/lines/pages) into a smooth zoom factor. */
export const PREVIEW_WHEEL_ZOOM_SENSITIVITY = 0.0065;

export const RIGHT_PANEL_ACCORDION_SX = {
  "&:before": { display: "none" },
  boxShadow: "none",
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1,
  mb: 1,
  "&:last-of-type": { mb: 0 },
};
