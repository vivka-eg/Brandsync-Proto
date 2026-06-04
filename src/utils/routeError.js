import { NextResponse } from "next/server";
import ApiError from "@/utils/apiError";

export function handleRouteError(error) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  if (error.response) {
    return NextResponse.json(error.response.data, { status: error.response.status });
  }
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
