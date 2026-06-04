import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/categories
 * Proxy to backend categories endpoint
 */
export async function GET() {
  try {
    const STRAPI_API_URL =
      process.env.NEXT_PUBLIC_INTERNAL_API_URL ||
      "https://api.brand.dev.egsync.com/api";

    const token = process.env.STRAPI_API_ADMIN_TOKEN;

    const response = await fetch(`${STRAPI_API_URL}/categories?pageSize=100`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch categories" },
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
