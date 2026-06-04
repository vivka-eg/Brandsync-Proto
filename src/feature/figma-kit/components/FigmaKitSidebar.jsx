"use client";

import React, { useState, useEffect } from "react";
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
import { usePathname, useRouter } from "next/navigation";
import { FigmaLogo, Plug, PuzzlePiece, CaretDown, CaretUp, CaretLeft, CaretRight, Sparkle, Image, Diamond } from "phosphor-react";

const navItems = [
  {
    label: "Figma Kit",
    icon: FigmaLogo,
    href: "/figma-kit",
    children: [],
  },
  {
    label: "Agent Skills",
    iconSrc: "/bot.svg",
    href: "/figma-kit/agent-skills",
    children: [],
  },
  {
    label: "Figma Make",
    icon: Sparkle,
    href: "/figma-kit/figma-make",
    children: [],
  },
  {
    label: "Figma Plugins",
    icon: PuzzlePiece,
    defaultOpen: true,
    children: [
      {
        label: "BrandSync Studio",
        href: "/figma-kit/figma-plugins/brandsync-studio",
        icon: Plug,
      },
      {
        label: "EG Stock Images",
        href: "/figma-kit/figma-plugins/eg-stock-images",
        icon: Image,
      },
      {
        label: "EG Product Logos",
        href: "/figma-kit/figma-plugins/eg-product-logos",
        icon: Diamond,
      },
    ],
  },
];

export default function FigmaKitSidebar() {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState(() => {
    const initial = {};
    navItems.forEach((item) => {
      if (item.defaultOpen || (item.children?.length > 0 && item.children.some((c) => pathname === c.href))) {
        initial[item.label] = true;
      }
    });
    return initial;
  });

  // Auto-open section if a child route is active
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children?.length > 0) {
        const hasActiveChild = item.children.some((child) => pathname === child.href);
        if (hasActiveChild && !openSections.hasOwnProperty(item.label)) {
          setOpenSections((prev) => ({ ...prev, [item.label]: true }));
        }
      }
    });
  }, [pathname]);

  const handleToggle = (label) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <Box
      sx={{
        width: collapsed ? "64px" : "280px",
        transition: "width 0.25s ease",
        borderRight: 1,
        borderColor: "divider",
        position: "sticky",
        top: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden",
        [theme.breakpoints.down(950)]: { display: "none" },
        p: "16px",
        pl: collapsed ? "10px" : "32px",
        transition: "width 0.25s ease, padding 0.25s ease",
      }}
      role="navigation"
      aria-label="Documentation navigation"
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          borderColor: "divider",
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
            sx={{ fontSize: "1.25rem", lineHeight: "1.5rem", whiteSpace: "nowrap" }}
          >
            Resources
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

      {/* Nav Items */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          pt: "12px",
          pl: "4px",
          pr: "6px",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <Stack sx={{ gap: "4px" }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children && item.children.length > 0;

            if (!hasChildren) {
              const isActive = pathname === item.href;
              return (
                <Tooltip
                  key={item.href}
                  title={collapsed ? item.label : ""}
                  placement="right"
                  arrow
                >
                  <ButtonBase
                    onClick={() => router.push(item.href)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: collapsed ? "center" : "flex-start",
                      width: "100%",
                      py: "12px",
                      px: "8px",
                      borderRadius: 1,
                      color: "neutral.main",
                      backgroundColor: isActive ? "neutral.container" : "",
                      "&:hover": {
                        backgroundColor: isActive ? alpha("#A2AAB2", 0.24) : "neutral.hover",
                      },
                      "&:focus-visible": {
                        outline: "2px solid",
                        outlineColor: "primary.main",
                        outlineOffset: "2px",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={collapsed ? 0 : 1} alignItems="center">
                      {item.iconSrc ? (
                        <Box
                          component="img"
                          src={item.iconSrc}
                          alt=""
                          sx={{ width: 24, height: 24, flexShrink: 0 }}
                        />
                      ) : (
                        <Icon
                          size={24}
                          weight="regular"
                          color={isActive ? theme.palette.action.active : theme.palette.neutral.icons}
                          style={{ flexShrink: 0 }}
                        />
                      )}
                      {!collapsed && (
                        <Typography
                          fontWeight={500}
                          sx={{
                            fontSize: "16px",
                            color: isActive ? theme.palette.text.primary : theme.palette.neutral.main,
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

            // Collapsible item with children
            const isChildActive = item.children.some((child) => pathname === child.href);
            const isOpen = openSections[item.label] ?? isChildActive;

            return (
              <Box key={item.label}>
                <Tooltip title={collapsed ? item.label : ""} placement="right" arrow>
                  <ButtonBase
                    onClick={() => collapsed ? router.push(item.children[0]?.href) : handleToggle(item.label)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: collapsed ? "center" : "space-between",
                      width: "100%",
                      py: "12px",
                      px: "8px",
                      borderRadius: 1,
                      color: isChildActive ? "text.primary" : "neutral.main",
                      backgroundColor: isChildActive ? "neutral.hover" : "",
                      "&:hover": {
                        backgroundColor: isOpen ? alpha("#A2AAB2", 0.24) : "neutral.hover",
                      },
                      "&:focus-visible": {
                        outline: "2px solid",
                        outlineColor: "primary.main",
                        outlineOffset: "2px",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={collapsed ? 0 : 1} alignItems="center">
                      {item.iconSrc ? (
                        <Box component="img" src={item.iconSrc} alt="" sx={{ width: 24, height: 24, flexShrink: 0 }} />
                      ) : (
                        <Icon
                          size={24}
                          weight="regular"
                          color={isChildActive ? theme.palette.action.active : theme.palette.neutral.icons}
                        />
                      )}
                      {!collapsed && (
                        <Typography fontWeight={500} sx={{ fontSize: "16px", whiteSpace: "nowrap" }}>
                          {item.label}
                        </Typography>
                      )}
                    </Stack>
                    {!collapsed && (isOpen ? <CaretUp size={16} /> : <CaretDown size={16} />)}
                  </ButtonBase>
                </Tooltip>

                {!collapsed && (
                  <Collapse in={isOpen}>
                    <Stack spacing={0.5} sx={{ py: "12px" }}>
                      {item.children.map((child) => {
                        const isActive = pathname === child.href;
                        const ChildIcon = child.icon;
                        return (
                          <ButtonBase
                            key={child.href}
                            onClick={() => router.push(child.href)}
                            sx={{
                              pl: "44px",
                              py: "12px",
                              pr: "8px",
                              borderRadius: 1,
                              display: "flex",
                              alignItems: "center",
                              width: "100%",
                              textAlign: "left",
                              backgroundColor: isActive ? "neutral.container" : "transparent",
                              color: isActive ? "text.primary" : "text.secondary",
                              "&:hover": {
                                backgroundColor: isActive ? alpha("#A2AAB2", 0.24) : "neutral.hover",
                              },
                              "&:focus-visible": {
                                outline: "2px solid",
                                outlineColor: "primary.main",
                                outlineOffset: "2px",
                              },
                              transition: "all 0.2s ease",
                            }}
                          >
                            {ChildIcon ? (
                              <Stack direction="row" spacing={1} alignItems="center">
                                <ChildIcon
                                  size={20}
                                  weight="regular"
                                  color={isActive ? theme.palette.action.active : theme.palette.neutral.icons}
                                  style={{ flexShrink: 0 }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{ fontSize: "16px", fontWeight: isActive ? 700 : 500 }}
                                >
                                  {child.label}
                                </Typography>
                              </Stack>
                            ) : (
                              <Typography
                                variant="body2"
                                sx={{ fontSize: "16px", fontWeight: isActive ? 700 : 500 }}
                              >
                                {child.label}
                              </Typography>
                            )}
                          </ButtonBase>
                        );
                      })}
                    </Stack>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
