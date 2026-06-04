import {
  House,
  PaintBrush,
  Palette,
  Sparkle,
  CirclesFour,
  ImageSquare,
  Wrench,
  Newspaper,
  TreeStructure,
  ChartBar,
} from "phosphor-react";
import { Toolbox } from "@phosphor-icons/react";

/** Trailing header link — after marketing group, separated by a divider (desktop). */
export const blogNavItem = { label: "Blog", icon: Newspaper, href: "/blog" };

/** Primary nav (desktop header). */
export const designerNavItems = [
  { label: "Home", icon: House, href: "/" },
  { label: "Design System", icon: PaintBrush, href: "/design-system" },
  { label: "Designer Tools", icon: Toolbox, href: "/figma-kit" },
  { label: "Theme Builder", icon: Palette, href: "/theme-builder" },
  { label: "AI & MCP", icon: Sparkle, href: "/mcp" },
  { label: "Brandsync Make", icon: ChartBar, href: "/brandsync-make" },
];

/** Mobile drawer includes Sitemap after the same core links. */
export const designerNavItemsMobile = [
  ...designerNavItems,
  { label: "Sitemap", icon: TreeStructure, href: "/sitemap" },
];

export const marketingNavItems = [
  { label: "Product Logos", icon: CirclesFour, href: "/logos" },
  { label: "Digital Assets", icon: ImageSquare, href: "/digital-assets" },
  { label: "Utilities", icon: Wrench, href: "/utilities" },
];
