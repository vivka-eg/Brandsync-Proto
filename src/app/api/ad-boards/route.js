import { NextResponse } from "next/server";
import { checkUserAuthWithRole } from "@/lib/auth/keycloak";
import ApiError from "@/utils/apiError";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const strapiUrl = process.env.NEXT_PUBLIC_INTERNAL_API_URL;
const strapiToken = process.env.STRAPI_API_ADMIN_TOKEN;

async function getUserId(request) {
  if (process.env.NEXT_PUBLIC_APP_ENV === "dev") return "dev-user";
  const { payload } = await checkUserAuthWithRole(request, []);
  return payload.sub;
}

function transformBoard(item) {
  return {
    id: item.documentId ?? item.id,
    name: item.name ?? "Untitled",
    sizeSummary: item.sizeSummary ?? "",
    artboardCount: item.artboardCount ?? 1,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

function handleError(error) {
  if (error instanceof ApiError) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.status });
  }
  return NextResponse.json(
    { success: false, error: error.message ?? "Internal server error" },
    { status: 500 },
  );
}

/** GET /api/ad-boards — list the current user's saved boards. */
export async function GET(request) {
  try {
    const userId = await getUserId(request);

    const url = new URL(`${strapiUrl}/ad-boards`);
    url.searchParams.set("filters[userId][$eq]", userId);
    url.searchParams.set("sort", "updatedAt:desc");
    url.searchParams.set("pagination[pageSize]", "50");

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${strapiToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err?.error?.message ?? "Failed to fetch boards", res.status);
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      data: (data.data ?? []).map(transformBoard),
    });
  } catch (error) {
    return handleError(error);
  }
}

/** POST /api/ad-boards — create a new saved board. */
export async function POST(request) {
  try {
    const userId = await getUserId(request);
    const body = await request.json();
    const { name, stateSnapshot, stateVersion, artboardCount, sizeSummary } = body;

    if (!name?.trim()) throw new ApiError("Board name is required", 400);
    if (!stateSnapshot) throw new ApiError("State snapshot is required", 400);

    const res = await fetch(`${strapiUrl}/ad-boards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${strapiToken}`,
      },
      body: JSON.stringify({
        data: {
          name: name.trim(),
          userId,
          stateSnapshot,
          stateVersion: stateVersion ?? 0,
          artboardCount: artboardCount ?? 1,
          sizeSummary: sizeSummary ?? "",
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err?.error?.message ?? "Failed to create board", res.status);
    }

    const data = await res.json();
    return NextResponse.json(
      { success: true, data: transformBoard(data.data) },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}
