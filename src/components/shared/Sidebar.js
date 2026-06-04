"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Stack,
  Typography,
  ButtonBase,
  Collapse,
  useTheme,
  TextField,
  InputAdornment,
  alpha,
  Tooltip,
  Chip,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  SquaresFour,
  FilmScript,
  Person,
  DotsThreeOutline,
  Lightbulb,
  CaretUp,
  BookOpen,
  Rocket,
  GridFour,
  TextT,
  ArrowsOutLineVertical,
  Image,
  Cube,
  Star,
} from "phosphor-react";
import { usePathname } from "next/navigation";
import { getComponentsForSidebar } from "@/api/design-system/component-list";
import { constructFullPathname } from "@/utils/assets";
import { useArrowKeyNavigation } from "@/hooks/useArrowKeyNavigation";
import { PaletteIcon, SquareLogoIcon } from "@phosphor-icons/react";
import { PaintBrushHouseholdIcon } from "@phosphor-icons/react/dist/ssr";

// Star indicator with tooltip for mandatory items
const MandatoryDot = () => (
  <Tooltip title="Mandatory" arrow placement="right">
    <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
      <Star size={14} weight="fill" color="#9CA3AF" />
    </Box>
  </Tooltip>
);

const SideBarItemWithoutChildren = ({
  item,
  index,
  register,
  onKeyDown,
  focusedIndex,
  collapsed,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = decodeURIComponent(pathname) === item.href;
  const theme = useTheme();
  const Icon = item.icon;
  const isFocused = focusedIndex === index;

  return (
    <Tooltip title={collapsed ? item.label : ""} placement="right" arrow>
      <ButtonBase
        onClick={() => { if (item.href) router.push(item.href); }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
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
        onKeyDown={(e) => onKeyDown(e, index)}
        ref={register(index)}
        tabIndex={isFocused ? 0 : -1}
      >
        <Stack direction="row" spacing={collapsed ? 0 : 1} alignItems="center">
          <Icon
            size={24}
            weight="regular"
            format={"stroke"}
            color={isActive ? theme.palette.action.active : theme.palette.neutral.icons}
            style={{ flexShrink: 0 }}
          />
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
};

const SidebarItem = ({
  item,
  onKeyDown,
  register,
  index,
  focusedIndex,
  allFocusableItems,
  currentOpenSections,
  setCurrentOpenSections,
  showMandatory = false,
  collapsed,
}) => {
  const pathname = decodeURIComponent(usePathname());
  const searchParams = useSearchParams().toString();
  const fullPathname = constructFullPathname(pathname, searchParams);

  const isChildrenLinksActive = item.children
    .map((child) => fullPathname === child.href)
    .includes(true);

  // Change this logic - only use currentOpenSections for manual state
  // Auto-open only if not manually set and child is active
  const manuallySet = currentOpenSections.hasOwnProperty(item.label);
  const isOpen = manuallySet
    ? currentOpenSections[item.label]
    : isChildrenLinksActive;

  const router = useRouter();
  const Icon = item.icon;
  const theme = useTheme();

  const handleToggle = () => {
    setCurrentOpenSections((prev) => ({
      ...prev,
      [item.label]: !isOpen, // Toggle based on current isOpen state
    }));
  };

  // Only auto-open if not manually controlled and child becomes active
  useEffect(() => {
    if (isChildrenLinksActive && !manuallySet) {
      setCurrentOpenSections((prev) => ({
        ...prev,
        [item.label]: true,
      }));
    }
  }, [isChildrenLinksActive, item.label, setCurrentOpenSections, manuallySet]);

  // Rest of your component remains the same...
  if (!item.children.length) {
    return (
      <SideBarItemWithoutChildren
        item={item}
        register={register}
        onKeyDown={onKeyDown}
        index={index}
        focusedIndex={focusedIndex}
        collapsed={collapsed}
      />
    );
  }

  const isFocused = focusedIndex === index;

  return (
    <Box key={item.label}>
      <Tooltip title={collapsed ? item.label : ""} placement="right" arrow>
        <ButtonBase
          onClick={() => collapsed ? router.push(item.children[0]?.href) : handleToggle()}
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
              backgroundColor: isOpen ? alpha("#A2AAB2", 0.24) : "neutral.hover",
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
          <Stack direction="row" spacing={collapsed ? 0 : 1} alignItems="center">
            <Icon
              size={24}
              weight="regular"
              format={"stroke"}
              color={isChildrenLinksActive ? theme.palette.action.active : theme.palette.neutral.icons}
            />
            {!collapsed && (
              <Typography fontWeight={500} sx={{ fontSize: "16px", whiteSpace: "nowrap" }}>
                {item.label}
              </Typography>
            )}
          </Stack>
          {!collapsed && (isOpen ? <CaretUp size={16} /> : <CaretDown size={16} />)}
        </ButtonBase>
      </Tooltip>

      {!collapsed && <Collapse in={isOpen}>
        <Stack spacing={0.5} sx={{ py: "12px" }}>
          {item.children.map((child) => {
            const isActive = fullPathname === child.href;

            // Find child index in allFocusableItems
            const childIndex = allFocusableItems.findIndex(
              (focusableItem) =>
                focusableItem.type === "child" &&
                focusableItem.item.href === child.href
            );

            const isChildFocused = focusedIndex === childIndex;

            return (
              <ButtonBase
                key={child.href}
                onClick={() => router.push(child.href)}
                sx={{
                  pl: "28px",
                  py: "12px",
                  pr: "8px",
                  borderRadius: 1,
                  display: "block",
                  backgroundColor: isActive
                    ? "neutral.container"
                    : "transparent",
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? "text.primary" : "text.secondary",
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
                  transition: "all 0.2s ease",
                  width: "100%",
                  textAlign: "left",
                }}
                onKeyDown={(e) => onKeyDown(e, childIndex)}
                ref={register(childIndex)}
                tabIndex={isChildFocused ? 0 : -1}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ width: "100%", pl: "12px", pr: "4px" }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {child.icon && (
                      <child.icon
                        size={18}
                        weight="regular"
                        color={
                          isActive
                            ? theme.palette.action.active
                            : theme.palette.neutral.icons
                        }
                      />
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: "left",
                        fontSize: "16px",
                        fontWeight: 500,
                      }}
                    >
                      {child.label}
                    </Typography>
                  </Stack>
                  {showMandatory && <MandatoryDot />}
                </Stack>
              </ButtonBase>
            );
          })}
        </Stack>
      </Collapse>}
    </Box>
  );
};

// Search Result Item Component
const SearchResultItem = ({
  item,
  searchTerm,
  index,
  register,
  onKeyDown,
  focusedIndex,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isActive = pathname === item.href;
  const SectionIcon = item.sectionIcon;
  const isFocused = focusedIndex === index;

  // Function to highlight matching text
  const highlightText = (text, term) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <Box
          key={index}
          component="span"
          sx={{ fontWeight: 700, color: "primary.main" }}
        >
          {part}
        </Box>
      ) : (
        <Box key={index} component="span">
          {part}
        </Box>
      )
    );
  };

  return (
    <ButtonBase
      onClick={() => router.push(item.href)}
      sx={{
        width: "100%",
        p: "12px",
        borderRadius: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: isActive ? "rgba(25, 118, 210, 0.08)" : "transparent",
        border: isActive ? "1px solid" : "1px solid transparent",
        borderColor: isActive ? "primary.main" : "transparent",
        color: "text.primary",
        "&:hover": {
          backgroundColor: isActive
            ? "rgba(25, 118, 210, 0.12)"
            : "action.hover",
        },
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: "2px",
        },
        transition: "all 0.2s ease",
        mx: "8px",
      }}
      onKeyDown={(e) => onKeyDown(e, index)}
      ref={register(index)}
      tabIndex={isFocused ? 0 : -1}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <SectionIcon
          size={16}
          color={
            isActive ? theme.palette.primary.main : theme.palette.text.secondary
          }
        />
        <Box sx={{ flex: 1, textAlign: "left" }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: "14px",
              fontWeight: isActive ? 600 : 500,
              color: isActive ? "primary.main" : "text.primary",
              mb: 0.5,
            }}
          >
            {highlightText(item.label, searchTerm)}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip
              label={item.section}
              size="small"
              variant={isActive ? "filled" : "outlined"}
              sx={{
                height: 18,
                fontSize: "10px",
                backgroundColor: isActive ? "primary.main" : "transparent",
                borderColor: isActive ? "primary.main" : "divider",
                color: isActive ? "primary.contrastText" : "text.secondary",
                "& .MuiChip-label": {
                  px: 1,
                },
              }}
            />
          </Stack>
        </Box>
      </Stack>
    </ButtonBase>
  );
};

export default function Sidebar() {
  const theme = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [components, setComponents] = useState([
    { label: "Loading...", href: "#" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentOpenSections, setCurrentOpenSections] = useState({
    Foundation: true,
  });
  const { register, onKeyDown, focusedIndex, resetFocus, focusItem } =
    useArrowKeyNavigation();

  // Memoize navItems to prevent recreation on every render
  const navItems = useMemo(
    () => [
      {
        label: "Introduction",
        icon: FilmScript,
        children: [],
        href: "/design-system",
      },
      {
        label: "Quick Start Guide",
        icon: BookOpen,
        children: [],
        href: "/design-system/quick-start-guide",
      },
      {
        label: "Implementation Planner",
        icon: Rocket,
        children: [],
        href: "/design-system/implementation-planner",
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
        label: "For Designers",
        icon: PaintBrushHouseholdIcon,
        children: [],
        href: "/design-system/for-designers",
      },
      {
        label: "Accessible Palettes",
        icon: PaletteIcon,
        children: [],
        href: "/design-system/accessible-palettes",
      },
      {
        label: "Foundation",
        icon: DotsThreeOutline,
        children: [
          { label: "Layout", href: "/design-system/foundation/layout", icon: GridFour },
          { label: "Typography", href: "/design-system/foundation/typography", icon: TextT },
          { label: "Spacing", href: "/design-system/foundation/spacing", icon: ArrowsOutLineVertical },
          {
            label: "Logo Placement",
            href: "/design-system/foundation/logo-placement",
            icon: SquareLogoIcon,
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

  // Create a flat list of all focusable items
  const allFocusableItems = useMemo(() => {
    const items = [];

    navItems.forEach((section, sectionIndex) => {
      // Add parent item
      items.push({
        id: `parent-${sectionIndex}`,
        type: "parent",
        item: section,
        index: sectionIndex,
      });

      // Add children items if section is open
      if (
        currentOpenSections[section.label] &&
        section.children &&
        section.children.length > 0
      ) {
        section.children.forEach((child, childIndex) => {
          items.push({
            id: `child-${child.href}`,
            type: "child",
            item: child,
            parentIndex: sectionIndex,
            childIndex: childIndex,
          });
        });
      }
    });

    return items;
  }, [navItems, currentOpenSections]);

  // Create a flat list of all searchable items
  const allSearchableItems = useMemo(() => {
    const items = [];
    navItems.forEach((section) => {
      if (section.children && section.children.length > 0) {
        section.children.forEach((child) => {
          items.push({
            ...child,
            section: section.label,
            sectionIcon: section.icon,
          });
        });
      } else {
        // Include top-level items that have no children (e.g. Accessible Palettes, Accessibility)
        items.push({
          ...section,
          section: "Design System",
          sectionIcon: section.icon,
        });
      }
    });
    return items;
  }, [navItems]);

  // Filter items based on search term
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return [];

    return allSearchableItems.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.label.toLowerCase().includes(searchLower) ||
        item.section.toLowerCase().includes(searchLower)
      );
    });
  }, [searchTerm, allSearchableItems]);

  // Handle search input change
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setIsSearching(value.trim().length > 0);
    resetFocus();
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setIsSearching(false);
    resetFocus();
  };

  useEffect(() => {
    getComponentsForSidebar()
      .then((response) => {
        if (response.error) {
          console.warn("Sidebar components unavailable (VPN required):", response.error);
          setComponents([]);
          return;
        }

        const componentsData = [
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
        ];

        componentsData.sort((a, b) => a.label.localeCompare(b.label));

        setComponents(componentsData);
      })
      .catch((error) => {
        console.error("Failed to fetch components:", error);
        setComponents([]);
      });
  }, []);

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
      aria-label="Design system navigation"
    >
      {/* Header; title + collapse toggle */}
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
            sx={{ fontSize: "1.25rem", lineHeight: "1.5rem", whiteSpace: "nowrap" }}
          >
            Design System
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

      {/* Search; hidden when collapsed */}
      {!collapsed && (
        <Box sx={{ borderColor: "divider", backgroundColor: "background.paper", zIndex: 1 }}>
          <Stack spacing={"12px"}>
            {/* Search Input */}
            <TextField
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" || e.key === "Tab") {
                  e.preventDefault();
                  focusItem(0);
                }
              }}
              size="small"
              variant="outlined"
              aria-label="Search design system components"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlass size={18} color={theme.palette.text.secondary} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  backgroundColor: "background.paper",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
                },
              }}
              sx={{ mx: "8px" }}
            />
            {/* Clear search button when searching */}
            {isSearching && (
              <Box sx={{ px: "8px" }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""} found
                  </Typography>
                  <ButtonBase
                    onClick={clearSearch}
                    sx={{
                      px: 1, py: 0.5, borderRadius: 1, fontSize: "12px", color: "text.secondary",
                      "&:hover": { backgroundColor: "action.hover" },
                      "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: "2px" },
                    }}
                    aria-label="Clear search"
                  >
                    Clear
                  </ButtonBase>
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>
      )}

      {/* Scrollable Content Section */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          pt: "12px",
          pl: "4px",
          pr: "6px",
          paddingBottom: "40px",
          /* Hide scrollbar for Chrome, Safari, and Opera */
          "&::-webkit-scrollbar": {
            display: "none",
          },

          /* Hide scrollbar for Firefox */
          scrollbarWidth: "none",

          /* Hide scrollbar for IE, Edge (legacy) */
          msOverflowStyle: "none",
        }}
        role="list"
        aria-label={isSearching ? "Search results" : "Navigation items"}
      >
        {/* Search Results or Regular Navigation */}
        {isSearching ? (
          <Stack spacing={1}>
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <SearchResultItem
                  key={index}
                  item={item}
                  searchTerm={searchTerm}
                  index={index}
                  register={register}
                  onKeyDown={onKeyDown}
                  focusedIndex={focusedIndex}
                />
              ))
            ) : (
              <Box sx={{ px: "8px", py: 2, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No results found for &quot;{searchTerm}&quot;
                </Typography>
              </Box>
            )}
          </Stack>
        ) : (
          <Stack sx={{ gap: "8px" }}>
            {navItems.map((item, parentIndex) => {
              // Find the correct index for this parent in allFocusableItems
              const parentGlobalIndex = allFocusableItems.findIndex(
                (focusableItem) =>
                  focusableItem.type === "parent" &&
                  focusableItem.index === parentIndex
              );

              return (
                <SidebarItem
                  key={parentIndex}
                  item={item}
                  onKeyDown={onKeyDown}
                  register={register}
                  index={parentGlobalIndex}
                  focusedIndex={focusedIndex}
                  allFocusableItems={allFocusableItems}
                  currentOpenSections={currentOpenSections}
                  setCurrentOpenSections={setCurrentOpenSections}
                  showMandatory={item.label === "Foundation"}
                  collapsed={collapsed}
                />
              );
            })}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
