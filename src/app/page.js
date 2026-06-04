import { redirect } from "next/navigation";

// Standalone product entry: the MCP-backed "Make" experience is the home of
// this prototype. The original WordPress-driven marketing landing is bypassed
// (WordPress is an eg-brandsync dependency not part of the standalone build).
export default function Home() {
  redirect("/brandsync-make");
}
