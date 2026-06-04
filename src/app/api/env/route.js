import { NextResponse } from "next/server";

export const GET = async (req, res) => {
  const env = {
    STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
  };

  return NextResponse.json(env);
};
