import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { resolve } from "path";

export const GET = () => {
  let css = readFileSync(
    resolve(process.cwd(), "node_modules/brandsync-tokens/dist/css/tokens.css"),
    "utf8"
  );
  // Strip JS-style // comments (invalid CSS) that the token generator emits
  css = css.replace(/^\s*\/\/.*$/gm, "");
  return new NextResponse(css, {
    headers: { "Content-Type": "text/css", "Cache-Control": "public, max-age=3600" },
  });
};
