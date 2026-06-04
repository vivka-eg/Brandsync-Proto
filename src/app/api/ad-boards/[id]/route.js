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

async function fetchBoard(id) {
  const res = await fetch(`${strapiUrl}/ad-boards/${id}`, {
    headers: { Authorization: `Bearer ${strapiToken}` },
    cache: "no-store",
  });
  if (res.status === 404) throw new ApiError("Board not found", 404);
  if (!res.ok) throw new ApiError("Failed to fetch board", res.status);
  const data = await res.json();
  return data.data;
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

/** GET /api/ad-boards/[id] — load a board's full state. */
export async function GET(request, { params }) {
  try {
    const userId = await getUserId(request);
    const { id } = await params;
    const board = await fetchBoard(id);

    if (board.userId !== userId) throw new ApiError("Board not found", 404);

    return NextResponse.json({
      success: true,
      data: {
        id: board.documentId ?? board.id,
        name: board.name,
        stateSnapshot: board.stateSnapshot,
        stateVersion: board.stateVersion,
        sizeSummary: board.sizeSummary,
        artboardCount: board.artboardCount,
        updatedAt: board.updatedAt,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

/** PUT /api/ad-boards/[id] — update name and/or state of an existing board. */
export async function PUT(request, { params }) {
  try {
    const userId = await getUserId(request);
    const { id } = await params;
    const body = await request.json();

    const board = await fetchBoard(id);
    if (board.userId !== userId) throw new ApiError("Board not found", 404);

    const updateData = {};
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.stateSnapshot !== undefined) {
      updateData.stateSnapshot = body.stateSnapshot;
      updateData.stateVersion = body.stateVersion ?? 0;
      updateData.artboardCount = body.artboardCount ?? 1;
      updateData.sizeSummary = body.sizeSummary ?? "";
    }

    const res = await fetch(`${strapiUrl}/ad-boards/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${strapiToken}`,
      },
      body: JSON.stringify({ data: updateData }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new ApiError(err?.error?.message ?? "Failed to update board", res.status);
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data: data.data });
  } catch (error) {
    return handleError(error);
  }
}

/** DELETE /api/ad-boards/[id] — delete a board. */
export async function DELETE(request, { params }) {
  try {
    const userId = await getUserId(request);
    const { id } = await params;

    const board = await fetchBoard(id);
    if (board.userId !== userId) throw new ApiError("Board not found", 404);

    const res = await fetch(`${strapiUrl}/ad-boards/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${strapiToken}` },
    });

    if (!res.ok) throw new ApiError("Failed to delete board", res.status);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
