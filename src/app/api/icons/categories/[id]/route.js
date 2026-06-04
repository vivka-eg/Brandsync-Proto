import { NextResponse } from "next/server";
import axios from "axios";
import { checkUserAuthWithRole } from "@/lib/auth/keycloak";
import { handleRouteError } from "@/utils/routeError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_INTERNAL_API_URL;
const ADMIN_TOKEN = process.env.STRAPI_API_ADMIN_TOKEN;
// PUT /api/icons/categories/:id — update a category (admin or superadmin)
export async function PUT(request, { params }) {
  try {
    await checkUserAuthWithRole(request, ["admin", "superadmin"]);

    const { id } = await params;
    const body = await request.json();
    const { data, status } = await axios.put(
      `${BACKEND_URL}/icon-categories/${id}`,
      body,
      { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error) {
    return handleRouteError(error);
  }
}

// DELETE /api/icons/categories/:id — delete a category (admin or superadmin)
export async function DELETE(request, { params }) {
  try {
    await checkUserAuthWithRole(request, ["admin", "superadmin"]);

    const { id } = await params;
    const { data, status } = await axios.delete(
      `${BACKEND_URL}/icon-categories/${id}`,
      { headers: { Authorization: `Bearer ${ADMIN_TOKEN}` } }
    );
    return NextResponse.json(data, { status });
  } catch (error) {
    return handleRouteError(error);
  }
}
