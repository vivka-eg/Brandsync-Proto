import { NextResponse } from "next/server";
import {
  getCategoryIdBySlug,
  getPostsList,
  isWordPressConfigured,
} from "@/lib/wordpress";

export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!isWordPressConfigured()) {
    return NextResponse.json(
      { posts: [], total: 0, totalPages: 0, error: "not_configured" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
  const perPage = Math.min(
    24,
    Math.max(1, Number.parseInt(searchParams.get("per_page") || "12", 10) || 12)
  );
  const search = (searchParams.get("search") || "").trim();
  const categorySlug = (searchParams.get("category") || "").trim();
  const excludeRaw = searchParams.get("exclude") || "";
  const excludeIds = excludeRaw
    .split(",")
    .map((s) => Number.parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n) && n > 0);

  let categoryId = null;
  if (categorySlug && categorySlug !== "all") {
    categoryId = await getCategoryIdBySlug(categorySlug);
    if (categoryId == null) {
      return NextResponse.json({
        posts: [],
        total: 0,
        totalPages: 0,
        error: false,
      });
    }
  }

  const result = await getPostsList(
    { page, perPage, categoryId, search, excludeIds },
    { cacheMode: "no-store" }
  );

  return NextResponse.json(result);
}
