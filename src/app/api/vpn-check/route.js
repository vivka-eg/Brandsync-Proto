import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  if (!strapiUrl) {
    return NextResponse.json({ reachable: false });
  }
  try {
    const res = await fetch(strapiUrl, {
      method: "HEAD",
      signal: AbortSignal.timeout(4000),
    });
    return NextResponse.json({ reachable: res.ok || res.status < 500 });
  } catch {
    return NextResponse.json({ reachable: false });
  }
}
