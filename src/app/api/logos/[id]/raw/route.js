import { NextResponse } from "next/server";
import axios from "axios";

const strapiUrl = process.env.NEXT_PUBLIC_INTERNAL_API_URL;
const strapiToken = process.env.STRAPI_API_ADMIN_TOKEN;

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const qs = "populate[Assets][populate][Logo]=true"
      + "&populate[Assets][populate][Bundle]=true"
      + "&populate[Assets][populate][LightLogo][populate][Horizontal]=true"
      + "&populate[Assets][populate][LightLogo][populate][Vertical]=true"
      + "&populate[Assets][populate][DarkLogo][populate][Horizontal]=true"
      + "&populate[Assets][populate][DarkLogo][populate][Vertical]=true"
      + "&populate[Assets][populate][NegativeLogo][populate][Horizontal]=true"
      + "&populate[Assets][populate][NegativeLogo][populate][Vertical]=true"
      + "&populate[Sizes][populate][HeaderSize]=*"
      + "&populate[Sizes][populate][DrawerSize]=*"
      + "&populate[Sizes][populate][SplashHorizontalSize]=*"
      + "&populate[Sizes][populate][SplashSquareSize]=*"
      + "&populate[Powerpoint]=true"
      + "&populate[CVI]=true";

    const url = `${strapiUrl}/logos/${id}?${qs}`;
    console.log("[raw route] fetching:", url);
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${strapiToken}` },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    const statusCode = error.response?.status || 500;
    console.error("[raw route] Strapi error:", error.response?.data);
    return NextResponse.json(
      { error: error.message || "Failed to fetch logo" },
      { status: statusCode }
    );
  }
}
