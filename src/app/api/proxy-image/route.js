import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/proxy-image?url=...
 * Proxies images from S3 to avoid CORS issues
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");
    const filename = searchParams.get("filename");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 },
      );
    }

    // Validate that the URL is from our S3 bucket or Strapi
    const allowedDomains = [
      "dev-brandsync-asset-manager-457087769501.s3.eu-central-1.amazonaws.com",
      "s3-brandsync-strapi-stage-01.s3.eu-central-1.amazonaws.com",
      "s3-brandsync-strapi-prod-01.s3.eu-central-1.amazonaws.com",
      "api.brand.dev.egsync.com",
      "api.brand.stage.egsync.com",
      "api.brand.egsync.com",
      process.env.NEXT_PUBLIC_INTERNAL_API_URL,
    ];

    const url = new URL(imageUrl);
    if (!allowedDomains.some((domain) => url.hostname.includes(domain))) {
      return NextResponse.json({ error: "URL not allowed" }, { status: 403 });
    }

    // Fetch the image
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: response.status },
      );
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    const responseHeaders = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400", // Cache for 24 hours
      "Access-Control-Allow-Origin": "*",
    };

    const contentLength = response.headers.get("content-length");
    if (contentLength) {
      responseHeaders["Content-Length"] = contentLength;
    }

    if (filename) {
      responseHeaders["Content-Disposition"] = `attachment; filename="${filename}"`;
    }

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("[Proxy Image] Error:", error);
    return NextResponse.json(
      { error: "Failed to proxy image" },
      { status: 500 },
    );
  }
}
