import { NextResponse } from "next/server";
import { calculateOrientation } from "@/utils/imageUtils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const GENERIC_BUSINESS_UNITS = new Set(["", "null", "general", "other", "all"]);

function formatBusinessUnitLabel(value) {
  return String(value || "")
    .trim()
    .split(/[-_ ]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/**
 * GET /api/digital-assets/:id
 * Fetch a single digital asset by ID
 */
export async function GET(request, { params }) {
  try {
    // console.log("===== GET SINGLE ASSET ENDPOINT HIT =====");
    const STRAPI_API_URL = process.env.NEXT_PUBLIC_INTERNAL_API_URL || "https://api.brand.dev.egsync.com/api";
    const token = process.env.STRAPI_API_ADMIN_TOKEN;

    if (!token) {
      // console.error("Token not configured");
      return NextResponse.json(
        { success: false, error: "Strapi API token not configured" },
        { status: 500 }
      );
    }

    const { id } = await params;
    // console.log("Fetching asset with ID:", id);

    const response = await fetch(
      `${STRAPI_API_URL}/asset-tracking/${id}`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    // console.log("Backend response status:", response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      // console.error("Backend error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch asset", details: error },
        { status: response.status }
      );
    }

    const apiData = await response.json();

    // console.log("Raw API response for single asset:", JSON.stringify(apiData, null, 2));

    // The API returns { data: {...} } without signedUrl
    const asset = apiData.data || apiData;

    if (!asset || !asset.id) {
      // console.error("Invalid asset structure received");
      return NextResponse.json(
        { success: false, error: "Invalid asset data" },
        { status: 500 }
      );
    }

    // Get signed URL for the asset
    let signedUrl = null;
    try {
      // console.log("Fetching signed URL for asset:", asset.id);
      const signedUrlResponse = await fetch(
        `${STRAPI_API_URL}/asset-tracking/${asset.id}/signed-url`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      // console.log("Signed URL response status:", signedUrlResponse.status);

      if (signedUrlResponse.ok) {
        const signedUrlData = await signedUrlResponse.json();
        // console.log("Signed URL data:", JSON.stringify(signedUrlData, null, 2));
        
        // Try different possible response formats
        signedUrl = signedUrlData.signedUrl || signedUrlData.data?.signedUrl || signedUrlData.url;
        
        if (!signedUrl) {
          // console.error("No signed URL found in response:", signedUrlData);
        }
      } else {
        const errorText = await signedUrlResponse.text();
        // console.error("Failed to get signed URL:", errorText);
      }
    } catch (e) {
      // console.error("Error fetching signed URL:", e);
    }

    const rawBusinessUnit = String(asset.businessUnit || "").trim();
    const normalizedBusinessUnit = rawBusinessUnit.toLowerCase();
    let businessUnitName = "";

    if (rawBusinessUnit && !GENERIC_BUSINESS_UNITS.has(normalizedBusinessUnit)) {
      try {
        const businessUnitResponse = await fetch(
          `${STRAPI_API_URL}/categories/${encodeURIComponent(rawBusinessUnit)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        if (businessUnitResponse.ok) {
          const businessUnitData = await businessUnitResponse.json();
          const businessUnitRecord = businessUnitData.data || businessUnitData;
          businessUnitName =
            businessUnitRecord?.name ||
            businessUnitRecord?.title ||
            businessUnitRecord?.label ||
            "";
        }
      } catch (e) {
        // Ignore lookup failures and use fallback formatting below.
      }

      if (
        !businessUnitName &&
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(rawBusinessUnit)
      ) {
        businessUnitName = formatBusinessUnitLabel(rawBusinessUnit);
      }
    }

    // console.log("Final signedUrl value:", signedUrl);

    // Extract containsPeople from tags (our workaround) or other locations
    let containsPeopleValue = null;
    let tags = Array.isArray(asset.tags) ? asset.tags : [];

    // Check special tags first (our workaround)
    if (tags.includes("_contains-people")) {
      containsPeopleValue = true;

      // Remove the special tag from display tags
      tags = tags.filter(t => t !== "_contains-people" && t !== "_no-people" && t !== "_portrait" && t !== "_landscape" && t !== "_square");
    } else if (tags.includes("_no-people")) {
      containsPeopleValue = false;

      // Remove the special tag from display tags
      tags = tags.filter(t => t !== "_contains-people" && t !== "_no-people" && t !== "_portrait" && t !== "_landscape" && t !== "_square");
    }
    // Check metadata field
    else if (asset.metadata && asset.metadata.containsPeople !== undefined) {
      containsPeopleValue = Boolean(asset.metadata.containsPeople);
      // Still remove orientation tags from display
      tags = tags.filter(t => t !== "_portrait" && t !== "_landscape" && t !== "_square");
    }
    // Check root level
    else if (asset.containsPeople !== null && asset.containsPeople !== undefined) {
      if (typeof asset.containsPeople === 'string') {
        containsPeopleValue = asset.containsPeople.toLowerCase() === 'true';
      } else {
        containsPeopleValue = Boolean(asset.containsPeople);
      }
      // Still remove orientation tags from display
      tags = tags.filter(t => t !== "_portrait" && t !== "_landscape" && t !== "_square");
    } else {
      // Still remove orientation tags from display even if no containsPeople
      tags = tags.filter(t => t !== "_portrait" && t !== "_landscape" && t !== "_square");
    }

    // Map the new API structure to the format expected by the frontend
    const mappedData = {
      id: asset.id,
      title: asset.assetName || "Untitled",
      description: asset.description || "",
      businessUnit: (asset.businessUnit && asset.businessUnit !== "null") ? asset.businessUnit : "",
      businessUnitId: (asset.businessUnitId && asset.businessUnitId !== "null") ? asset.businessUnitId : (asset.businessUnit && asset.businessUnit !== "null") ? asset.businessUnit : "",
      businessUnitName,
      category: asset.categories || "",
      tags: tags,
      containsPeople: containsPeopleValue,
      orientation: calculateOrientation(asset.metadata?.[1] || 4000, asset.metadata?.[0] || 3000),
      fullImage: signedUrl,
      fullSize: signedUrl,
      thumbnail: signedUrl,
      dimensions: {
        width: asset.metadata?.[1] || 4000,
        height: asset.metadata?.[0] || 3000,
      },
      sizes: (() => {
        const origWidth = asset.metadata?.[1] || 4000;
        const origHeight = asset.metadata?.[0] || 3000;
        const isPortrait = origHeight > origWidth;
        const s = (w, h) => isPortrait ? { width: h, height: w } : { width: w, height: h };
        return [
          { label: "Thumbnail", ...s(208, 156), url: signedUrl },
          { label: "Small",     ...s(500, 375), url: signedUrl },
          { label: "Medium",    ...s(750, 563), url: signedUrl },
          { label: "Large",     ...s(1000, 750), url: signedUrl },
          { label: "Original",  width: origWidth, height: origHeight, url: signedUrl },
        ];
      })(),
      gender: Array.isArray(asset.gender) ? (asset.gender[0] || null) : (asset.gender || null),
      ethnicity: Array.isArray(asset.ethnicity) ? (asset.ethnicity[0] || null) : (asset.ethnicity || null),
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
      s3Key: asset.s3Key,
      fileSize: asset.fileSize,
      assetType: asset.assetType,
    };

    // console.log("Mapped single asset data:", JSON.stringify(mappedData, null, 2));
    // console.log("Image URL being returned:", mappedData.fullImage);

    return NextResponse.json({ success: true, data: mappedData });

  } catch (error) {
    // console.error("CATCH BLOCK - Fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/digital-assets/:id
 * Update a digital asset
 */
export async function PUT(request, { params }) {
  try {
    const STRAPI_API_URL = process.env.NEXT_PUBLIC_INTERNAL_API_URL || "https://api.brand.dev.egsync.com/api";
    const token = process.env.STRAPI_API_ADMIN_TOKEN;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Strapi API token not configured" },
        { status: 500 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Transform frontend format to backend format
    const backendData = {};

    // Map title to assetName
    if (body.title !== undefined) {
      backendData.assetName = body.title;
    }

    if (body.description !== undefined) {
      backendData.description = body.description;
    }

    if (body.businessUnitId !== undefined) {
      const buId = (body.businessUnitId && !GENERIC_BUSINESS_UNITS.has(String(body.businessUnitId).toLowerCase())) ? body.businessUnitId : null;
      backendData.businessUnitId = buId;
      // businessUnit is required by the backend — send empty string when no BU is assigned
      backendData.businessUnit = buId || "";
    }

    // categories is required by the backend — always send, even if empty
    if (body.category !== undefined) {
      backendData.categories = (body.category && body.category !== "undefined") ? body.category : [];
    }

    // Handle tags, containsPeople, and orientation
    if (body.tags !== undefined || body.containsPeople !== undefined || body.orientation !== undefined) {
      let tagsToSend = Array.isArray(body.tags) ? [...body.tags] : [];

      // Remove any existing special tags
      tagsToSend = tagsToSend.filter(t => t !== "_contains-people" && t !== "_no-people" && t !== "_portrait" && t !== "_landscape" && t !== "_square");

      // Add special tag based on containsPeople value
      if (body.containsPeople === true) {
        tagsToSend.push("_contains-people");
      } else if (body.containsPeople === false) {
        tagsToSend.push("_no-people");
      }

      // Add special tag based on orientation value
      if (body.orientation === "Portrait") {
        tagsToSend.push("_portrait");
      } else if (body.orientation === "Landscape") {
        tagsToSend.push("_landscape");
      }

      backendData.tags = tagsToSend;
    }

    if (body.containsPeople !== null && body.containsPeople !== undefined) {
      backendData.containsPeople = body.containsPeople;
    }

    if (body.orientation !== null && body.orientation !== undefined) {
      backendData.orientation = body.orientation;
    }

    if (body.gender !== undefined && body.gender !== null) {
      backendData.gender = [body.gender];
    }

    if (body.ethnicity !== undefined && body.ethnicity !== null) {
      backendData.ethnicity = [body.ethnicity];
    }

    const response = await fetch(
      `${STRAPI_API_URL}/asset-tracking/${id}`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendData),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: "Failed to update asset", details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/digital-assets/:id
 * Delete a digital asset
 */
export async function DELETE(request, { params }) {
  try {
    const STRAPI_API_URL = process.env.NEXT_PUBLIC_INTERNAL_API_URL || "https://api.brand.dev.egsync.com/api";
    const token = process.env.STRAPI_API_ADMIN_TOKEN;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Strapi API token not configured" },
        { status: 500 }
      );
    }

    const { id } = await params;

    const response = await fetch(
      `${STRAPI_API_URL}/asset-tracking/${id}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    if (!response.ok && response.status !== 204) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: "Failed to delete asset", details: error },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    // console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
