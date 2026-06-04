// Returns true if the color is dark based on WCAG relative luminance
export function isColorDark(hex) {
  const luminance = getLuminance(hex);
  return luminance < 0.5;
}

// Calculates WCAG relative luminance (0 = dark, 1 = light)
function getLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);

  // Convert RGB to linear-light
  const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // WCAG luminance formula
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

// Converts hex "#RRGGBB" to RGB (in 0–1 range)
function hexToRgb(hex) {
  hex = hex.replace('#', '');

  // Support short hex like #123 → #112233
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  return { r, g, b };
}
