import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/business-units
 * Proxy to fetch business units from the backend
 */
export async function GET(request) {
  try {
    const STRAPI_API_URL =
      process.env.NEXT_PUBLIC_INTERNAL_API_URL ||
      "https://api.brand.dev.egsync.com/api";
    const token = process.env.STRAPI_API_ADMIN_TOKEN;

    const { searchParams } = new URL(request.url);
    const queryParams = new URLSearchParams();

    if (searchParams.get("search")) {
      queryParams.append("search", searchParams.get("search"));
    }
    if (searchParams.get("page")) {
      queryParams.append("page", searchParams.get("page"));
    }
    if (searchParams.get("pageSize")) {
      queryParams.append("pageSize", searchParams.get("pageSize"));
    }

    const url = `${STRAPI_API_URL}/business-units?${queryParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: "Failed to fetch business units", details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
