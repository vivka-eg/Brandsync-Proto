import { House, Sparkle, ChartBar } from "phosphor-react";

// Standalone BrandSync Make: nav trimmed to the MCP-backed product. The
// eg-brandsync surfaces (design system, designer tools, theme builder,
// product logos, digital assets, utilities, blog) are not part of this build.

/** Trailing header link slot — unused in the standalone build. */
export const blogNavItem = null;

/** Primary nav (desktop header). */
export const designerNavItems = [
  { label: "Home", icon: House, href: "/" },
  { label: "AI & MCP", icon: Sparkle, href: "/mcp" },
  { label: "Brandsync Make", icon: ChartBar, href: "/brandsync-make" },
];

/** Mobile drawer mirrors the desktop nav. */
export const designerNavItemsMobile = [...designerNavItems];

/** Marketing/asset group — empty in the standalone build. */
export const marketingNavItems = [];
