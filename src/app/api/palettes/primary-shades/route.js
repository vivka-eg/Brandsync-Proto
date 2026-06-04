import palettes from "brandsync-tokens/accessibility.json";

export async function GET(_request) {
  try {
    const updatedPalettes = {};
    const colorKeys = Object.keys(palettes);

    colorKeys.forEach((colorName) => {
      updatedPalettes[colorName] = palettes[colorName]["primaryColor"];
    });

    return Response.json(updatedPalettes);
  } catch (err) {
    console.error("API ERROR:", err);
    return new Response("Failed to fetch palette.", { status: 500 });
  }
}
