"use client";

import { useState, useMemo, useEffect, memo } from "react";
import {
  Box,
  Stack,
  Typography,
  ButtonBase,
  Collapse,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import {
  HouseSimple,
  Gear,
  SquaresFour,
  CaretDown,
  CaretUp,
  CaretLeft,
  CaretRight,
  FolderSimple,
  Lightbulb,
} from "phosphor-react";
import { useArrowKeyNavigation } from "@/hooks/useArrowKeyNavigation";
import { useMCPAuthContext } from "@/context/mcp/MCPAuthContext";

const BASE_NAV_ITEMS = [
  {
    label: "Overview",
    icon: HouseSimple,
    children: [],
    href: "/mcp",
  },
  {
    label: "Getting Started",
    icon: Gear,
    children: [
      { label: "Introduction", 
        href: "/mcp/getting-started/introduction" 
      },

      { label: "Installation", 
        href: "/mcp/getting-started/installation" 
      },
      {
        label: "Understand Tokens",
        href: "/mcp/getting-started/understand-tokens",
      },
      {
        label: "Framework Support",
        href: "/mcp/getting-started/framework-support",
      },
      
    ],
  },
  {
    label: "How it works",
    icon: Lightbulb,
    children: [
      {
        label: "Working with Jira",
        href: "/mcp/how-it-works/working-with-jira",
      },
      {
        label: "Understanding Figjam",
        href: "/mcp/how-it-works/understanding-figjam",
      },
      {
        label: "Handoff to Development",
        href: "/mcp/how-it-works/handoff-to-development",
      },
      {
        label: "BrandSync Foundations",
        href: "/mcp/how-it-works/brandsync-foundations",
      },
    ],
  },
  {
    label: "Brandsync Patterns",
    icon: SquaresFour,
    children: [],
    href: "/mcp/patterns",
  },
];

const ADMIN_NAV_ITEMS = [
  {
    label: "Categories",
    icon: FolderSimple,
    children: [],
    href: "/mcp/categories",
    adminOnly: true,
  },
];

const ALL_SIDEBAR_PATHS = new Set(
  [...BASE_NAV_ITEMS, ...ADMIN_NAV_ITEMS]
    .flatMap((item) => [
      item.href,
      ...item.children.map((c) => c.href.split("#")[0]),
    ])
    .filter(Boolean),
);

const NavItem = memo(function NavItem({
  item,
  index,
  pathname,
  register,
  onKeyDown,
  focusedIndex,
  allFocusableItems,
  currentOpenSections,
  setCurrentOpenSections,
  currentHash,
  onHashChange,
  collapsed,
}) {
  const router = useRouter();
  const theme = useTheme();
  const hasChildren = item.children.length > 0;
  const isFocused = focusedIndex === index;
  const Icon = item.icon;

  const isActive = !hasChildren && pathname === item.href;
  const isChildrenLinksActive =
    hasChildren &&
    item.children.some((c) => {
      const [base, hash] = c.href.split("#");
      return hash
        ? pathname === base && currentHash === `#${hash}`
        : pathname === base;
    });
  const isOpen =
    hasChildren &&
    (currentOpenSections.hasOwnProperty(item.label)
      ? currentOpenSections[item.label]
      : isChildrenLinksActive);

  const handleToggle = (e) => {
    e.stopPropagation();
    setCurrentOpenSections((prev) => ({ ...prev, [item.label]: !isOpen }));
  };

  if (!hasChildren) {
    return (
      <Tooltip title={collapsed ? item.label : ""} placement="right" arrow>
        <ButtonBase
          onClick={() => item.href && router.push(item.href)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            width: "100%",
            py: "12px",
            px: "8px",
            borderRadius: 1,
            backgroundColor: isActive ? "neutral.container" : "",
            "&:hover": {
              backgroundColor: isActive
                ? alpha("#A2AAB2", 0.24)
                : "neutral.hover",
            },
            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: "2px",
            },
          }}
          onKeyDown={(e) => onKeyDown(e, index)}
          ref={register(index)}
          tabIndex={isFocused ? 0 : -1}
        >
          <Stack
            direction="row"
            spacing={collapsed ? 0 : 1}
            alignItems="center"
          >
            <Icon
              size={24}
              weight="regular"
              color={
                isActive
                  ? theme.palette.action.active
                  : theme.palette.neutral.icons
              }
              style={{ flexShrink: 0 }}
            />
            {!collapsed && (
              <Typography
                fontWeight={500}
                sx={{
                  fontSize: "16px",
                  color: isActive
                    ? theme.palette.text.primary
                    : theme.palette.neutral.main,
                  textAlign: "left",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </Typography>
            )}
          </Stack>
        </ButtonBase>
      </Tooltip>
    );
  }

  return (
    <Box>
      <Tooltip title={collapsed ? item.label : ""} placement="right" arrow>
        <ButtonBase
          onClick={(e) =>
            collapsed ? router.push(item.children[0]?.href) : handleToggle(e)
          }
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-between",
            width: "100%",
            py: "12px",
            px: "8px",
            borderRadius: 1,
            color: isChildrenLinksActive ? "text.primary" : "neutral.main",
            backgroundColor: isChildrenLinksActive ? "neutral.hover" : "",
            "&:hover": {
              backgroundColor: isOpen
                ? alpha("#A2AAB2", 0.24)
                : "neutral.hover",
            },
            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: "2px",
            },
          }}
          onKeyDown={(e) => onKeyDown(e, index)}
          ref={register(index)}
          tabIndex={isFocused ? 0 : -1}
        >
          <Stack
            direction="row"
            spacing={collapsed ? 0 : 1}
            alignItems="center"
          >
            <Icon
              size={24}
              weight="regular"
              color={
                isChildrenLinksActive
                  ? theme.palette.action.active
                  : theme.palette.neutral.icons
              }
            />
            {!collapsed && (
              <Typography
                fontWeight={500}
                sx={{ fontSize: "16px", whiteSpace: "nowrap" }}
              >
                {item.label}
              </Typography>
            )}
          </Stack>
          {!collapsed && (
            <Box
              component="span"
              onClick={handleToggle}
              sx={{
                display: "flex",
                alignItems: "center",
                p: "4px",
                ml: "4px",
                borderRadius: 1,
                "&:hover": { bgcolor: alpha("#A2AAB2", 0.24) },
              }}
            >
              {isOpen ? <CaretUp size={16} /> : <CaretDown size={16} />}
            </Box>
          )}
        </ButtonBase>
      </Tooltip>

      {!collapsed && (
        <Collapse in={isOpen}>
          <Stack spacing={0.5} sx={{ py: "12px" }}>
            {item.children.map((child) => {
              const [base, hash] = child.href.split("#");
              const isChildActive = hash
                ? pathname === base && currentHash === `#${hash}`
                : pathname === base;
              const childIndex = allFocusableItems.findIndex(
                (f) => f.type === "child" && f.item.href === child.href,
              );

              return (
                <ButtonBase
                  key={child.href}
                  onClick={() => {
                    if (hash) onHashChange(`#${hash}`);
                    router.push(child.href);
                  }}
                  sx={{
                    pl: "28px",
                    py: "12px",
                    pr: "8px",
                    borderRadius: 1,
                    display: "block",
                    backgroundColor: isChildActive
                      ? "neutral.container"
                      : "transparent",
                    fontWeight: isChildActive ? 700 : 400,
                    color: isChildActive ? "text.primary" : "text.secondary",
                    "&:hover": {
                      backgroundColor: isChildActive
                        ? alpha("#A2AAB2", 0.24)
                        : "neutral.hover",
                    },
                    "&:focus-visible": {
                      outline: "2px solid",
                      outlineColor: "primary.main",
                      outlineOffset: "2px",
                    },
                    transition: "all 0.2s ease",
                    width: "100%",
                    textAlign: "left",
                  }}
                  onKeyDown={(e) => onKeyDown(e, childIndex)}
                  ref={register(childIndex)}
                  tabIndex={focusedIndex === childIndex ? 0 : -1}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    sx={{ width: "100%", pl: "12px", pr: "4px" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "16px",
                        fontWeight: 500,
                        textAlign: "left",
                      }}
                    >
                      {child.label}
                    </Typography>
                  </Stack>
                </ButtonBase>
              );
            })}
          </Stack>
        </Collapse>
      )}
    </Box>
  );
});

export default function McpSidebar() {
  const theme = useTheme();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [currentHash, setCurrentHash] = useState("");
  const [currentOpenSections, setCurrentOpenSections] = useState({});
  const { register, onKeyDown, focusedIndex } = useArrowKeyNavigation();
  const { isSuperAdmin, isAdmin } = useMCPAuthContext();

  const NAV_ITEMS = useMemo(
    () =>
      isSuperAdmin || isAdmin
        ? [...BASE_NAV_ITEMS, ...ADMIN_NAV_ITEMS]
        : BASE_NAV_ITEMS,
    [isSuperAdmin, isAdmin],
  );

  // useEffect(() => {
  //   if (ALL_SIDEBAR_PATHS.has(pathname)) {
  //     setCollapsed(pathname === "/mcp");
  //   }
  // }, [pathname]);

  useEffect(() => {
    setCurrentHash(window.location.hash);
  }, [pathname]);

  useEffect(() => {
    const update = () => setCurrentHash(window.location.hash);
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
    };
  }, []);

  const allFocusableItems = useMemo(() => {
    const items = [];
    NAV_ITEMS.forEach((section, sectionIndex) => {
      items.push({
        id: `parent-${sectionIndex}`,
        type: "parent",
        item: section,
        index: sectionIndex,
      });
      const isOpen =
        section.children.length > 0 &&
        (currentOpenSections.hasOwnProperty(section.label)
          ? currentOpenSections[section.label]
          : section.children.some((c) => c.href.split("#")[0] === pathname));
      if (isOpen) {
        section.children.forEach((child) => {
          items.push({ id: `child-${child.href}`, type: "child", item: child });
        });
      }
    });
    return items;
  }, [NAV_ITEMS, currentOpenSections, pathname]);

  return (
    <Box
      sx={{
        width: collapsed ? "64px" : "280px",
        transition: "width 0.25s ease, padding 0.25s ease",
        borderRight: 1,
        borderColor: "divider",
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden",
        [theme.breakpoints.down(950)]: { display: "none" },
        p: "16px",
        pl: collapsed ? "10px" : "32px",
      }}
      role="navigation"
      aria-label="BrandSync MCP navigation"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          backgroundColor: "background.paper",
          zIndex: 1,
          py: "12px",
        }}
      >
        {!collapsed && (
          <Typography
            variant="h6"
            fontWeight="700"
            color="text.primary"
            sx={{
              fontSize: "1.25rem",
              lineHeight: "1.5rem",
              whiteSpace: "nowrap",
            }}
          >
            Brandsync MCP
          </Typography>
        )}
        <ButtonBase
          onClick={() => setCollapsed((prev) => !prev)}
          sx={{
            borderRadius: "6px",
            p: "4px",
            "&:hover": { bgcolor: "neutral.hover" },
          }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <CaretRight size={18} /> : <CaretLeft size={18} />}
        </ButtonBase>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          pt: "12px",
          pl: "4px",
          pr: "6px",
          paddingBottom: "40px",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        role="list"
        aria-label="Navigation items"
      >
        <Stack sx={{ gap: "8px" }}>
          {NAV_ITEMS.map((item, parentIndex) => {
            const parentGlobalIndex = allFocusableItems.findIndex(
              (f) => f.type === "parent" && f.index === parentIndex,
            );
            return (
              <NavItem
                key={item.label}
                item={item}
                index={parentGlobalIndex}
                pathname={pathname}
                register={register}
                onKeyDown={onKeyDown}
                focusedIndex={focusedIndex}
                allFocusableItems={allFocusableItems}
                currentOpenSections={currentOpenSections}
                setCurrentOpenSections={setCurrentOpenSections}
                currentHash={currentHash}
                onHashChange={setCurrentHash}
                collapsed={collapsed}
              />
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
