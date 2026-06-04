import { Hct, argbFromHex } from "@material/material-color-utilities";


export function hexToHct(hex) {
  const argb = argbFromHex(hex); // Convert hex to ARGB integer
  const hct = Hct.fromInt(argb); // Use CAM16 to calculate HCT
  return {
    h: Math.round(hct.hue), // 0-360° (perceptually uniform)
    c: Math.round(hct.chroma), // Colorfulness intensity
    t: Math.round(hct.tone), // 0-100 (perceptual lightness)
  };
}
