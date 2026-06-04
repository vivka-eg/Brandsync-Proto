import semanticPalettes from "brandsync-tokens/accessibility.json";

export async function GET(_request, { params }) {
  try {
    return Response.json(semanticPalettes);
  } catch (err) {
    console.error("API ERROR:", err);
    return new Response("Failed to fetch palette.", { status: 500 });
  }
}
