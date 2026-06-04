"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Drawer,
  Box,
  Stack,
  Typography,
  ButtonBase,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  Collapse,
  Divider,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import {
  MagnifyingGlass,
  CaretLeft,
  ArrowLeft,
  CaretDown,
  CaretUp,
  FilmScript,
  Person,
  DotsThreeOutline,
  Lightbulb,
  SquaresFour,
} from "phosphor-react";
import Logo from "./Logo";
import { getComponentsForSidebar } from "@/api/design-system/component-list";
import { blogNavItem, designerNavItemsMobile, marketingNavItems } from "./header/navConfig";

const MobileNavItem = ({ item, onClose, isWide, onDesignSystemClick }) => {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isActive =
    isWide &&
    (item.label === "Home" ? pathname === "/" : pathname.startsWith(item.href));
  const Icon = item.icon;

  const handleClick = () => {
    if (item.label === "Design System") {
      onDesignSystemClick();
    } else {
      router.push(item.href);
      onClose();
    }
  };

  return (
    <ButtonBase
      onClick={handleClick}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        py: "8px",
        px: "12px",
        borderRadius: 1,
        color: "neutral.main",
        backgroundColor: isActive ? "neutral.container" : "transparent",
        "&:hover": {
          backgroundColor: isActive
            ? "neutral.containerHovered"
            : "neutral.hover",
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Icon
          size={24}
          color={
            isActive ? theme.palette.action.active : theme.palette.neutral.icons
          }
        />
        <Typography
          fontWeight={500}
          sx={{
            fontSize: "16px",
            color: isActive
              ? theme.palette.text.primary
              : theme.palette.neutral.main,
          }}
        >
          {item.label}
        </Typography>
      </Stack>
    </ButtonBase>
  );
};

// Mobile Design System Navigation Item Component
const MobileSidebarItem = ({ item, onClose, onMainClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const Icon = item.icon;
  const theme = useTheme();

  // Check if current item is active (for items without children)
  const isCurrentItemActive =
    item.children.length === 0 && decodeURIComponent(pathname) === item.href;

  // Check if any child is active
  const isChildrenLinksActive =
    item.children.length > 0 &&
    item.children
      .map((child) => decodeURIComponent(pathname) === child.href)
      .includes(true);

  // Item is active if it's the current item or has active children
  const isItemActive = isCurrentItemActive || isChildrenLinksActive;

  const [open, setOpen] = useState(isChildrenLinksActive);

  useEffect(() => {
    setOpen(isChildrenLinksActive);
  }, [isChildrenLinksActive]);

  const handleItemClick = () => {
    if (item.children.length > 0) {
      setOpen((prev) => !prev);
    } else {
      router.push(item.href);
      onClose();
      onMainClose();
    }
  };

  return (
    <Box key={item.label}>
      <ButtonBase
        onClick={handleItemClick}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          py: "12px",
          px: "8px",
          borderRadius: 1,
          color: isItemActive ? "text.primary" : "neutral.main",
          backgroundColor: isItemActive ? "neutral.container" : "transparent",
          "&:hover": {
            backgroundColor: isItemActive
              ? "neutral.containerHovered"
              : "neutral.hover",
          },
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Icon
            size={24}
            weight="regular"
            format={"stroke"}
            color={
              isItemActive
                ? theme.palette.action.active
                : theme.palette.neutral.icons
            }
          />
          <Typography
            fontWeight={500}
            sx={{
              fontSize: "16px",
              color: isItemActive
                ? theme.palette.text.primary
                : theme.palette.neutral.main,
            }}
          >
            {item.label}
          </Typography>
        </Stack>
        {item.children.length > 0 &&
          (open ? <CaretUp size={16} /> : <CaretDown size={16} />)}
      </ButtonBase>

      {item.children.length > 0 && (
        <Collapse in={open}>
          <Stack spacing={0.5} sx={{ py: "12px" }}>
            {item.children.map((child) => {
              const isActive = decodeURIComponent(pathname) === child.href;

              return (
                <ButtonBase
                  key={child.href}
                  onClick={() => {
                    router.push(child.href);
                    onClose();
                    onMainClose();
                  }}
                  sx={{
                    pl: "36px",
                    py: "12px",
                    pr: "8px",
                    borderRadius: 1,
                    display: "block",
                    backgroundColor: isActive
                      ? "neutral.container"
                      : "transparent",
                    color: isActive ? "text.primary" : "text.secondary",
                    "&:hover": {
                      backgroundColor: isActive
                        ? "neutral.containerHovered"
                        : "neutral.hover",
                    },
                    transition: "all 0.2s ease",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "left",
                      fontSize: "16px",
                      fontWeight: isActive ? 600 : 500,
                      color: isActive
                        ? theme.palette.text.primary
                        : theme.palette.neutral.main,
                    }}
                  >
                    {child.label}
                  </Typography>
                </ButtonBase>
              );
            })}
          </Stack>
        </Collapse>
      )}
    </Box>
  );
};

export default function MobileSidebar({ open, onClose }) {
  const theme = useTheme();
  const [isWide, setIsWide] = useState(
    typeof window !== "undefined" ? window.innerWidth > 1200 : false
  );
  const [showDesignSystemSidebar, setShowDesignSystemSidebar] = useState(false);
  const [components, setComponents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Design system navigation items
  const designSystemNavItems = useMemo(
    () => [
      {
        label: "Introduction",
        icon: FilmScript,
        children: [],
        href: "/design-system",
      },
      {
        label: "Accessibility",
        icon: Person,
        children: [],
        href: "/design-system/accessibility",
      },
      {
        label: "Design Philosophy",
        icon: Lightbulb,
        children: [],
        href: "/design-system/design-philosophy",
      },
      {
        label: "Foundation",
        icon: DotsThreeOutline,
        children: [
          { label: "Layout", href: "/design-system/foundation/layout" },
          { label: "Typography", href: "/design-system/foundation/typography" },
          { label: "Spacing", href: "/design-system/foundation/spacing" },
          {
            label: "Logo Placement",
            href: "/design-system/foundation/logo-placement",
          },
        ],
      },
      {
        label: "Components",
        icon: SquaresFour,
        children: components,
      },
    ],
    [components]
  );

  // Filter items for search
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return designSystemNavItems;

    const searchLower = searchTerm.toLowerCase();
    return designSystemNavItems.filter((item) => {
      // Check if item label matches
      if (item.label.toLowerCase().includes(searchLower)) return true;

      // Check if any child matches
      if (
        item.children.some((child) =>
          child.label.toLowerCase().includes(searchLower)
        )
      )
        return true;

      return false;
    });
  }, [searchTerm, designSystemNavItems]);

  useEffect(() => {
    const handleResize = () => {
      setIsWide(window.innerWidth > 1200);
      if (window.innerWidth > 1200 && open) {
        onClose();
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [open, onClose]);

  // Load components when design system sidebar opens
  useEffect(() => {
    if (showDesignSystemSidebar && components.length === 0) {
      getComponentsForSidebar()
        .then((response) => {
          if (response.error) {
            console.error(response.error);
            return;
          }

          setComponents([
            ...response.map((component) => ({
              label: component.title,
              href: `/design-system/components/${component.title}`,
            })),
            {
              label: "Chips",
              href: "/design-system/components/Chips?single=1",
            },
            {
              label: "Navigation Header",
              href: "/design-system/components/Navigation Header?single=1",
            },
          ]);
        })
        .catch((error) => {
          console.error("Failed to fetch components:", error);
          setComponents([]);
        });
    }
  }, [showDesignSystemSidebar, components.length]);

  const handleDesignSystemClick = () => {
    setShowDesignSystemSidebar(true);
  };

  const handleDesignSystemClose = () => {
    setShowDesignSystemSidebar(false);
    setSearchTerm("");
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{
          zIndex: 1200,
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
            backgroundColor: "background.paper",
            borderRight: 1,
            borderColor: "divider",
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Main Content Container - Combined Header and Menu */}
          <Box
            sx={{
              flex: 1,
              p: "32px",
              pt: "16px",
              pr: "16px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header with Logo and Close Button */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                // mb: "12px",
                pb: "12px",
                // borderBottom: 1,
                // borderColor: "divider",
              }}
            >
              <Logo />
              <IconButton onClick={onClose} size="small">
                <CaretLeft size={20} />
              </IconButton>
            </Box>

            {/* Main Menu Title */}
            <Typography
              variant="h6"
              fontWeight="700"
              color="text.primary"
              sx={{ fontSize: "1.25rem", lineHeight: "48px", mb: "12px" }}
            >
              Main Menu
            </Typography>

            {/* Search */}
            <TextField
              placeholder="Search"
              size="small"
              variant="outlined"
              fullWidth
              sx={{ mb: "16px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlass
                      size={18}
                      color={theme.palette.text.secondary}
                    />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  backgroundColor: "background.paper",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />

            {/* Navigation Items */}
            <Stack spacing={1}>
              {designerNavItemsMobile.map((item, index) => (
                <MobileNavItem
                  key={item.label}
                  item={item}
                  onClose={onClose}
                  isWide={isWide}
                  onDesignSystemClick={handleDesignSystemClick}
                />
              ))}
              <Typography
                variant="caption"
                sx={{
                  pt: 2,
                  pb: 0.5,
                  px: "12px",
                  color: "text.secondary",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Marketing
              </Typography>
              {marketingNavItems.map((item) => (
                <MobileNavItem
                  key={item.label}
                  item={item}
                  onClose={onClose}
                  isWide={isWide}
                  onDesignSystemClick={handleDesignSystemClick}
                />
              ))}
              {blogNavItem && (
                <>
                  <Divider sx={{ my: 1.5, borderColor: "divider" }} />
                  <MobileNavItem
                    key={blogNavItem.label}
                    item={blogNavItem}
                    onClose={onClose}
                    isWide={isWide}
                    onDesignSystemClick={handleDesignSystemClick}
                  />
                </>
              )}
            </Stack>
          </Box>
        </Box>
      </Drawer>

      {/* Design System Sidebar Overlay */}
      <Drawer
        anchor="left"
        open={showDesignSystemSidebar}
        onClose={handleDesignSystemClose}
        sx={{
          zIndex: 1300,
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
            backgroundColor: "background.paper",
            borderRight: 1,
            borderColor: "divider",
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Design System Content Container */}
          <Box
            sx={{
              flex: 1,
              p: "32px",
              pt: "16px",
              pr: "16px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header with Logo and Back Button */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pb: "12px",
              }}
            >
              <Logo />
              <IconButton onClick={handleDesignSystemClose} size="small">
                <CaretLeft size={20} />
              </IconButton>
            </Box>

            {/* Design System Title */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                pt: "12px",
                pb: "12px",
              }}
            >
              <IconButton
                onClick={handleDesignSystemClose}
                size="small"
                sx={{ mr: 1, p: 0.5 }}
              >
                <ArrowLeft size={24} />
              </IconButton>
              <Typography
                variant="h6"
                fontWeight="700"
                color="text.primary"
                sx={{ fontSize: "1.25rem", lineHeight: "1.5rem" }}
              >
                Design System
              </Typography>
            </Box>

            {/* Design System Search */}
            <TextField
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              size="small"
              variant="outlined"
              fullWidth
              sx={{ pb: "12px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlass
                      size={18}
                      color={theme.palette.text.secondary}
                    />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  backgroundColor: "background.paper",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "divider",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />

            {/* Design System Navigation */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                // Custom scrollbar styling
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: theme.palette.divider,
                  borderRadius: "3px",
                  "&:hover": {
                    backgroundColor: theme.palette.text.disabled,
                  },
                },
                scrollbarWidth: "thin",
                scrollbarColor: `${theme.palette.divider} transparent`,
              }}
            >
              <Stack spacing={1}>
                {filteredItems.map((item, index) => (
                  <MobileSidebarItem
                    key={index}
                    item={item}
                    onClose={handleDesignSystemClose}
                    onMainClose={onClose}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
