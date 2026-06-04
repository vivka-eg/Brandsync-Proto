import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/download-asset?url=...&filename=...
 * Proxies a Strapi file download server-side so the API token is never exposed to the client.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const filename = searchParams.get("filename") || "download.zip";

  if (!url) {
    return NextResponse.json({ error: "url parameter is required" }, { status: 400 });
  }

  const strapiToken = process.env.STRAPI_API_ADMIN_TOKEN;
  if (!strapiToken) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const upstream = await fetch(url, {
    headers: { Authorization: `Bearer ${strapiToken}` },
  });

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Upstream fetch failed" },
      { status: upstream.status },
    );
  }

  const contentType =
    upstream.headers.get("content-type") || "application/octet-stream";

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
