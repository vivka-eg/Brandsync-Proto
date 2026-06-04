import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/digital-assets/upload
 * Server-side upload handler for digital assets to Strapi
 * Body: FormData with file and metadata
 */
export async function POST(request) {
  try {
    const STRAPI_API_URL =
      process.env.NEXT_PUBLIC_INTERNAL_API_URL ||
      "https://api.brand.dev.egsync.com/api";
    const token = process.env.STRAPI_API_ADMIN_TOKEN;

    const formData = await request.formData();
    const file = formData.get("file");
    const dataString = formData.get("data");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    let metadata = {};
    if (dataString) {
      try {
        metadata = JSON.parse(dataString);
      } catch (e) {
        return NextResponse.json(
          { success: false, error: "Invalid metadata JSON" },
          { status: 400 },
        );
      }
    }

    // Create FormData for Strapi upload
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    // Only append defined values to avoid "undefined" strings
    if (metadata.title) {
      uploadFormData.append("assetName", metadata.title);
    }
    if (metadata.description) {
      uploadFormData.append("description", metadata.description);
    }
    if (metadata.businessUnitId && metadata.businessUnitId !== "undefined" && metadata.businessUnitId !== "null") {
      uploadFormData.append("businessUnitId", metadata.businessUnitId);
      uploadFormData.append("businessUnit", metadata.businessUnitId);
    }
    // categories is required by the backend — always send, even if empty
    const categoriesToSend =
      metadata.category && metadata.category !== "undefined"
        ? metadata.category
        : [];
    uploadFormData.append("categories", JSON.stringify(categoriesToSend));

    // Add tags and encode containsPeople + orientation as special tags
    if (metadata.tags && Array.isArray(metadata.tags)) {
      let tagsToSend = [...metadata.tags];

      // Add special tag for containsPeople
      if (metadata.containsPeople === true) {
        tagsToSend.push("_contains-people");
      } else if (metadata.containsPeople === false) {
        tagsToSend.push("_no-people");
      }

      // Add orientation tag based on dimensions
      if (
        metadata.dimensions &&
        metadata.dimensions.width &&
        metadata.dimensions.height
      ) {
        const width = metadata.dimensions.width;
        const height = metadata.dimensions.height;

        let orientation = "square";
        if (height > width) {
          orientation = "portrait";
        } else if (width > height) {
          orientation = "landscape";
        }

        tagsToSend.push(`_${orientation}`);
        console.log(
          "✓ Adding orientation tag:",
          orientation,
          `(${width}x${height})`,
        );
      }

      uploadFormData.append("tags", JSON.stringify(tagsToSend));
    }

    // Still try to send containsPeople directly
    if (
      metadata.containsPeople !== null &&
      metadata.containsPeople !== undefined
    ) {
      uploadFormData.append("containsPeople", String(metadata.containsPeople));
    }

    // Send orientation if available
    if (metadata.orientation) {
      uploadFormData.append("orientation", metadata.orientation);
    }

    // Send gender if available (stored as String[] in Prisma)
    if (metadata.gender) {
      uploadFormData.append("gender", JSON.stringify([metadata.gender]));
    }

    // Send ethnicity if available (stored as String[] in Prisma)
    if (metadata.ethnicity) {
      uploadFormData.append("ethnicity", JSON.stringify([metadata.ethnicity]));
    }

    // Add dimensions if available
    if (
      metadata.dimensions &&
      metadata.dimensions.width &&
      metadata.dimensions.height
    ) {
      uploadFormData.append(
        "metadata",
        JSON.stringify([
          String(metadata.dimensions.height),
          String(metadata.dimensions.width),
        ]),
      );
      uploadFormData.append("height", String(metadata.dimensions.height));
      uploadFormData.append("width", String(metadata.dimensions.width));
    }

    const uploadUrl = `${STRAPI_API_URL}/asset-tracking/upload`;

    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers,
      body: uploadFormData,
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }

      console.error("Upload failed:", errorData);
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || errorData.message || "Upload failed",
          details: errorData,
        },
        { status: response.status },
      );
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      result = { data: responseText };
    }

    return NextResponse.json({
      success: true,
      data: result.data || result,
      message: "Asset uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
        details: error.toString(),
      },
      { status: 500 },
    );
  }
}
