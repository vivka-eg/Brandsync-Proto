import { NextResponse } from "next/server";
import axios from "axios";
import { checkUserAuthWithRole } from "@/lib/auth/keycloak";
import { handleRouteError } from "@/utils/routeError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_INTERNAL_API_URL;
const ADMIN_TOKEN = process.env.STRAPI_API_ADMIN_TOKEN;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;
// GET /api/icons/:id — get icon by documentId (any authenticated user)
export async function GET(request, { params }) {
  try {
    await checkUserAuthWithRole(request, []);

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const { data, status } = await axios.get(`${BACKEND_URL}/icons/${id}`, {
      params: Object.fromEntries(searchParams),
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
    });
    return NextResponse.json(data, { status });
  } catch (error) {
    return handleRouteError(error);
  }
}

// PUT /api/icons/:id — update icon (admin or superadmin)
export async function PUT(request, { params }) {
  try {
    await checkUserAuthWithRole(request, ["admin", "superadmin"]);

    const { id } = await params;
    const body = await request.json();
    const { data, status } = await axios.put(`${BACKEND_URL}/icons/${id}`, body, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });
    return NextResponse.json(data, { status });
  } catch (error) {
    return handleRouteError(error);
  }
}

// DELETE /api/icons/:id — delete icon (admin or superadmin)
export async function DELETE(request, { params }) {
  try {
    await checkUserAuthWithRole(request, ["admin", "superadmin"]);

    const { id } = await params;
    const { data, status } = await axios.delete(`${BACKEND_URL}/icons/${id}`, {
      headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
    });
    return NextResponse.json(data, { status });
  } catch (error) {
    return handleRouteError(error);
  }
}
