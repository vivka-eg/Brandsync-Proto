import { promises as fs } from "fs";
import path from "path";
import palettes from "brandsync-tokens/accessibility.json";

// // Load palettes once
// let palettesCache = null;

// async function loadPalettes() {
//   if (!palettesCache) {
//     const filePath = path.join(
//       process.cwd(),
//       "src",
//       "data",
//       "color-palettes.json"
//     );
//     const text = await fs.readFile(filePath, "utf8");
//     palettesCache = JSON.parse(text || "{}");
//   }
//   return palettesCache;
// }

export async function GET(_request, { params }) {
  try {

    const { colorName } =await params;

    // const palettes = await loadPalettes();

    const palette = palettes[colorName];
    if (!palette) {
      return new Response("Color not found.", { status: 404 });
    }

    // Clone to avoid modifying module cached data
    const result = { ...palette };

    result.neutralSection = palettes.neutral.primarySection;

    return Response.json(result);
  } catch (err) {
    console.error("API ERROR:", err);
    return new Response("Failed to fetch palette.", { status: 500 });
  }
}
