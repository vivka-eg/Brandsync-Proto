import { NextResponse } from "next/server";
import axios from "axios";
import { checkUserAuthWithRole } from "@/lib/auth/keycloak";
import { handleRouteError } from "@/utils/routeError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_INTERNAL_API_URL;
const ADMIN_TOKEN = process.env.STRAPI_API_ADMIN_TOKEN;

// POST /api/icons/upload — upload one or more SVG files (admin or superadmin)
export async function POST(request) {
  try {
    await checkUserAuthWithRole(request, ["admin", "superadmin"]);

    const { searchParams } = new URL(request.url);
    const multipleIcons = searchParams.get("multiple_icons") ?? "false";

    const body = await request.json();
    const { data, status } = await axios.post(
      `${BACKEND_URL}/icons/upload?multiple_icons=${multipleIcons}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
    return NextResponse.json(data, { status });
  } catch (error) {
    console.error("[icons/upload] error:", error?.response?.status, JSON.stringify(error?.response?.data));
    return handleRouteError(error);
  }
}
