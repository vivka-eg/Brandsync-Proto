import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Strapi may return a string URL or a media object `{ url }`. */
function mediaFieldToUrl(v) {
  if (v == null) return null;
  if (typeof v === "string") return v.trim() || null;
  if (typeof v === "object" && typeof v.url === "string") return v.url.trim() || null;
  return null;
}

/** Transform Strapi asset item to frontend shape */
function transformItem(item) {
  let tags = [];
  if (item.tags) {
    if (typeof item.tags === "string") {
      try {
        tags = JSON.parse(item.tags);
      } catch (e) {
        tags = item.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
    } else if (Array.isArray(item.tags)) {
      tags = item.tags;
    }
  }

  let containsPeopleValue = false;
  if (tags.includes("_contains-people")) {
    containsPeopleValue = true;
  } else if (tags.includes("_no-people")) {
    containsPeopleValue = false;
  } else if (item.containsPeople !== undefined) {
    containsPeopleValue =
      item.containsPeople === "true" || item.containsPeople === true;
  }

  let dimensions = { width: 0, height: 0 };
  if (item.metadata) {
    try {
      const meta =
        typeof item.metadata === "string"
          ? JSON.parse(item.metadata)
          : item.metadata;
      if (Array.isArray(meta) && meta.length === 2) {
        dimensions = {
          height: parseInt(meta[0]) || 0,
          width: parseInt(meta[1]) || 0,
        };
      }
    } catch (e) {
      // ignore
    }
  }
  if (item.width)
    dimensions.width = parseInt(item.width) || dimensions.width;
  if (item.height)
    dimensions.height = parseInt(item.height) || dimensions.height;

  let orientation = null;
  if (tags.includes("_portrait")) {
    orientation = "Portrait";
  } else if (tags.includes("_landscape")) {
    orientation = "Landscape";
  } else if (dimensions.height > dimensions.width) {
    orientation = "Portrait";
  } else if (dimensions.width > dimensions.height) {
    orientation = "Landscape";
  }

  return {
    id: item.documentId || item.id,
    title: item.assetName || "Untitled",
    description: item.description || "",
    businessUnit:
      item.businessUnit?.toLowerCase().replace(/ /g, "-") || "other",
    businessUnitId: (item.businessUnitId && !["general", "other", "all", "null"].includes(item.businessUnitId.toLowerCase())) ? item.businessUnitId : "",
    category: item.categories,
    tags,
    containsPeople: containsPeopleValue,
    thumbnail: mediaFieldToUrl(item.thumbnailUrl) || mediaFieldToUrl(item.signedUrl) || null,
    /** Original file (may be JPEG/PNG); prefer `thumbnail` for WebP in builder/modal. */
    fullImage: mediaFieldToUrl(item.signedUrl) || null,
    dimensions,
    orientation,
    gender: Array.isArray(item.gender) ? (item.gender[0] || null) : (item.gender || null),
    ethnicity: Array.isArray(item.ethnicity) ? (item.ethnicity[0] || null) : (item.ethnicity || null),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

/**
 * GET /api/digital-assets
 * Server-side handler to fetch digital assets from Strapi
 */
export async function GET(request) {
  try {
    const STRAPI_API_URL =
      process.env.NEXT_PUBLIC_INTERNAL_API_URL ||
      "https://api.brand.dev.egsync.com/api";
    const token = process.env.STRAPI_API_TOKEN;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Strapi API token not configured" },
        { status: 500 },
      );
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const containsPeople = searchParams.get("containsPeople");
    const orientation = searchParams.get("orientation");

    // Build Strapi filters
    const filters = {};
    if (category && category !== "all") {
      filters.category = { $eq: category };
    }

    /** Build base query params (no search). Used for single request or for each OR request. */
    function buildParams(overrides = {}) {
      const p = new URLSearchParams();
      p.append("page", String(overrides.page ?? page));
      p.append("pageSize", String(overrides.pageSize ?? pageSize));
      if (category && category !== "all") {
        p.append("category", category);
      }
      const matchTags = [];
      if (orientation && orientation !== "all") {
        matchTags.push(`_${orientation}`);
        p.append("orientation", `_${orientation}`);
      }
      if (containsPeople && containsPeople !== "all") {
        if (containsPeople === "yes") {
          matchTags.push("_contains-people");
          p.append("containsPeople", "_contains-people");
        } else if (containsPeople === "no") {
          matchTags.push("_no-people");
          p.append("containsPeople", "_no-people");
        }
      }
      if (matchTags.length > 0) {
        p.append("tags", matchTags.join(","));
      }
      if (Object.keys(filters).length > 0) {
        p.append("filters", JSON.stringify(filters));
      }
      return p;
    }

    const auth = {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    };

    // Search with OR: fetch by title, description and tags separately then merge.
    if (search) {
      const SEARCH_PAGE_SIZE = 100;
      const paramsByTitle = buildParams({ page: 1, pageSize: SEARCH_PAGE_SIZE });
      paramsByTitle.append("assetName", search);
      const paramsByDesc = buildParams({ page: 1, pageSize: SEARCH_PAGE_SIZE });
      paramsByDesc.append("description", search);

      // Build tag search params manually to avoid conflict with buildParams' own tags entry
      const paramsByTag = new URLSearchParams();
      paramsByTag.append("page", "1");
      paramsByTag.append("pageSize", String(SEARCH_PAGE_SIZE));
      if (category && category !== "all") paramsByTag.append("category", category);
      if (orientation && orientation !== "all")
        paramsByTag.append("orientation", `_${orientation}`);
      if (containsPeople && containsPeople !== "all")
        paramsByTag.append(
          "containsPeople",
          containsPeople === "yes" ? "_contains-people" : "_no-people",
        );
      paramsByTag.append("search", search);

      const [resTitle, resDesc, resTags] = await Promise.all([
        fetch(`${STRAPI_API_URL}/asset-tracking?${paramsByTitle}`, auth),
        fetch(`${STRAPI_API_URL}/asset-tracking?${paramsByDesc}`, auth),
        fetch(`${STRAPI_API_URL}/asset-tracking?${paramsByTag}`, auth),
      ]);

      if (!resTitle.ok || !resDesc.ok || !resTags.ok) {
        const failed = !resTitle.ok ? resTitle : !resDesc.ok ? resDesc : resTags;
        const errorData = await failed.json().catch(() => ({}));
        console.error("[Digital Assets API] Search fetch failed:", errorData);
        return NextResponse.json(
          {
            success: false,
            error: "Failed to fetch digital assets",
            details: errorData,
          },
          { status: failed.status },
        );
      }

      const dataTitle = await resTitle.json();
      const dataDesc = await resDesc.json();
      const dataTags = await resTags.json();
      const byId = new Map();
      for (const item of dataTitle.data || []) {
        const id = item.documentId || item.id;
        if (!byId.has(id)) byId.set(id, transformItem(item));
      }
      for (const item of dataDesc.data || []) {
        const id = item.documentId || item.id;
        if (!byId.has(id)) byId.set(id, transformItem(item));
      }
      for (const item of dataTags.data || []) {
        const id = item.documentId || item.id;
        if (!byId.has(id)) byId.set(id, transformItem(item));
      }
      let merged = Array.from(byId.values());
      merged.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

      // Client-side filter by orientation in case Strapi tags are missing/inconsistent
      if (orientation && orientation !== "all") {
        const expected = orientation.charAt(0).toUpperCase() + orientation.slice(1);
        merged = merged.filter((item) => item.orientation === expected);
      }

      // Client-side filter by containsPeople in case Strapi tags are missing/inconsistent
      if (containsPeople && containsPeople !== "all") {
        const wantsPeople = containsPeople === "yes";
        merged = merged.filter((item) => item.containsPeople === wantsPeople);
      }

      const total = merged.length;
      const start = (page - 1) * pageSize;
      const pageData = merged.slice(start, start + pageSize);

      return NextResponse.json({
        success: true,
        data: pageData,
        meta: {
          total,
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize) || 1,
        },
      });
    }

    // No search: single request (original behavior)
    const params = buildParams();
    console.log(
      "request url: ",
      `${STRAPI_API_URL}/asset-tracking?${decodeURIComponent(params.toString())}`,
    );

    const response = await fetch(
      `${STRAPI_API_URL}/asset-tracking?${params.toString()}`,
      auth,
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[Digital Assets API] Fetch failed:", errorData);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch digital assets",
          details: errorData,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    const rawData = data.data || [];
    const transformedData = rawData.map(transformItem);

    const total = data.meta?.pagination?.total ?? 0;

    return NextResponse.json({
      success: true,
      data: transformedData,
      meta: {
        total,
        page,
        pageSize,
        pageCount: Math.ceil(total / pageSize) || 1,
      },
    });
  } catch (error) {
    console.error("[Digital Assets API] Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
