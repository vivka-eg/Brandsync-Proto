import axios from "axios";
import { NextResponse } from "next/server";
import { checkUserAuthWithRole } from "@/lib/auth/keycloak";
import { handleRouteError } from "@/utils/routeError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_INTERNAL_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// GET /api/icons/:id/download — download icon as SVG, PNG, or PDF (any authenticated user)
export async function GET(request, { params }) {
  try {
    await checkUserAuthWithRole(request, []);

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const filetype = searchParams.get("filetype") ?? "svg";

    if (filetype === "svg") {
      // Backend returns JSON: { name, contentType, content: base64 }
      const response = await axios.get(`${BACKEND_URL}/icons/${id}/download`, {
        params: Object.fromEntries(searchParams),
        headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      });
      return NextResponse.json(response.data, { status: response.status });
    }

    // PNG / PDF — still binary
    const response = await axios.get(`${BACKEND_URL}/icons/${id}/download`, {
      params: Object.fromEntries(searchParams),
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      responseType: "arraybuffer",
    });

    return new Response(response.data, {
      status: response.status,
      headers: {
        "Content-Type": response.headers["content-type"] || "application/octet-stream",
        "Content-Disposition": response.headers["content-disposition"] || "",
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
