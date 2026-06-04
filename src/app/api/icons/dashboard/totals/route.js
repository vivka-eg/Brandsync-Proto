import { NextResponse } from "next/server";
import axios from "axios";
import { checkUserAuthWithRole } from "@/lib/auth/keycloak";
import { handleRouteError } from "@/utils/routeError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_INTERNAL_API_URL;
const ADMIN_TOKEN = process.env.STRAPI_API_ADMIN_TOKEN;
// GET /api/icons/dashboard/totals — platform-level stats (admin or superadmin)
export async function GET(request) {
  try {
    await checkUserAuthWithRole(request, ["admin", "superadmin"]);

    const { data, status } = await axios.get(
      `${BACKEND_URL}/icon-dashboard/totals`,
      { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error) {
    return handleRouteError(error);
  }
}
