import { NextResponse } from "next/server";
import axios from "axios";
import { checkUserAuthWithRole } from "@/lib/auth/keycloak";
import { handleRouteError } from "@/utils/routeError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_INTERNAL_API_URL;
const ADMIN_TOKEN = process.env.STRAPI_API_ADMIN_TOKEN;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
// GET /api/icons/tags — list all tags (any authenticated user)
export async function GET(request) {
  try {
    await checkUserAuthWithRole(request, []);

    const { searchParams } = new URL(request.url);
    const { data, status } = await axios.get(`${BACKEND_URL}/icon-tags`, {
      params: Object.fromEntries(searchParams),
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    });
    return NextResponse.json(data, { status });
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/icons/tags — create a tag (admin or superadmin)
export async function POST(request) {
  try {
    await checkUserAuthWithRole(request, ["admin", "superadmin"]);

    const body = await request.json();
    const { data, status } = await axios.post(`${BACKEND_URL}/icon-tags`, body, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });
    return NextResponse.json(data, { status });
  } catch (error) {
    return handleRouteError(error);
  }
}
