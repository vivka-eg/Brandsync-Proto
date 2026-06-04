import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/cookie?name=cookie_name
 * Returns the value of a specific cookie.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { success: false, error: "name query param is required" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const value = cookieStore.get(name)?.value ?? null;

  if (!value) {
    return NextResponse.json(
      { success: false, error: `Cookie "${name}" not found` },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, name, value });
}

/**
 * POST /api/cookie
 * Sets an HttpOnly cookie.
 *
 * Body: { name: string, value: string, maxAge?: number }
 */
export async function POST(request) {
  try {
    const { name, value, maxAge } = await request.json();

    if (!name || !value) {
      return NextResponse.json(
        { success: false, error: "name and value are required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(name, value, {
      httpOnly: true,
      secure: process.env.NEXT_PUBLIC_APP_ENV === "prod",
      sameSite: "lax",
      path: "/",
      maxAge: maxAge ?? 60 * 60 * 24 * 30, // default 30 days
    });

    return NextResponse.json({ success: true, name });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cookie?name=cookie_name
 * Deletes a specific cookie.
 */
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { success: false, error: "name query param is required" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  cookieStore.delete(name);

  return NextResponse.json({ success: true, name });
}
