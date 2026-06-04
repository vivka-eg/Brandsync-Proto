"use client";

import {
  Paper,
  TextField,
  List,
  ListItem,
  Chip,
  Divider,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Backdrop,
} from "@mui/material";
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { getComponentsForSidebar } from "@/api/design-system/component-list";

const MotionPaper = motion.create(Paper);

// Helper function to calculate fuzzy match score
function fuzzyMatch(text, query) {
  if (!text || !query) return { match: false, score: 0 };

  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  // Exact match gets highest score
  if (textLower === queryLower) return { match: true, score: 100 };

  // Starts with query gets high score
  if (textLower.startsWith(queryLower)) return { match: true, score: 90 };

  // Contains exact query gets good score
  if (textLower.includes(queryLower)) return { match: true, score: 80 };

  // Fuzzy matching - check if all characters in query exist in order
  let queryIndex = 0;
  let matchCount = 0;
  let consecutiveMatches = 0;
  let maxConsecutive = 0;

  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      matchCount++;
      queryIndex++;
      consecutiveMatches++;
      maxConsecutive = Math.max(maxConsecutive, consecutiveMatches);
    } else {
      consecutiveMatches = 0;
    }
  }

  if (queryIndex === queryLower.length) {
    // Calculate score based on match quality
    const matchRatio = matchCount / textLower.length;
    const consecutiveBonus = maxConsecutive / queryLower.length;
    const score = Math.floor(50 * matchRatio + 30 * consecutiveBonus);
    return { match: true, score };
  }

  return { match: false, score: 0 };
}

// Helper function to calculate relevance score for search results
function calculateRelevanceScore(item, query) {
  const titleMatch = fuzzyMatch(item.title, query);
  const descriptionMatch = fuzzyMatch(item.description, query);
  const sectionMatch = fuzzyMatch(item.section, query);

  let totalScore = 0;

  // Title matches are most important (3x weight)
  if (titleMatch.match) totalScore += titleMatch.score * 3;

  // Section matches are somewhat important (1.5x weight)
  if (sectionMatch.match) totalScore += sectionMatch.score * 1.5;

  // Description matches are least important (1x weight)
  if (descriptionMatch.match) totalScore += descriptionMatch.score;

  return {
    item,
    score: totalScore,
    titleMatch: titleMatch.match,
    descriptionMatch: descriptionMatch.match,
    sectionMatch: sectionMatch.match,
  };
}

// Static pages data
const staticPages = [
  // Home
  {
    title: "Home",
    href: "/",
    section: "home",
    description: "EG BrandSync home page",
  },

  // Design System
  {
    title: "Introduction",
    href: "/design-system",
    section: "design system",
    description: "EG Design System overview; components, foundations, accessibility and design guidelines",
  },
  {
    title: "Quick Start Guide",
    href: "/design-system/quick-start-guide",
    section: "design system",
    description: "Quick start guide for getting up and running with the design system",
  },
  {
    title: "Implementation Planner",
    href: "/design-system/implementation-planner",
    section: "design system",
    description: "Implementation planner and adoption steps for the design system",
  },
  {
    title: "Accessibility",
    href: "/design-system/accessibility",
    section: "design system",
    description: "Accessibility guidelines and best practices",
  },
  {
    title: "Design Philosophy",
    href: "/design-system/design-philosophy",
    section: "design system",
    description: "Design philosophy and core principles behind the design system",
  },
  {
    title: "For Designers",
    href: "/design-system/for-designers",
    section: "design system",
    description: "Resources and guidance for designers using the design system",
  },
  {
    title: "Accessible Palettes",
    href: "/design-system/accessible-palettes",
    section: "design system",
    description: "Accessible color palettes and WCAG-compliant color combinations",
  },
  {
    title: "Components",
    href: "/design-system/components",
    section: "design system",
    description: "Browse all design system components and their usage guidelines",
  },

  // Foundation
  {
    title: "Layout",
    href: "/design-system/foundation/layout",
    section: "foundation",
    description: "Layout principles and grid system for building consistent UIs",
  },
  {
    title: "Spacing",
    href: "/design-system/foundation/spacing",
    section: "foundation",
    description: "Spacing scale and guidelines for consistent visual rhythm",
  },
  {
    title: "Typography",
    href: "/design-system/foundation/typography",
    section: "foundation",
    description: "Typography scale, font usage, and text hierarchy",
  },
  {
    title: "Logo Placement",
    href: "/design-system/foundation/logo-placement",
    section: "foundation",
    description: "Logo placement guidelines and best practices",
  },

  // Logos
  {
    title: "Logos",
    href: "/logos",
    section: "logos",
    description: "Browse and download EG product logos",
  },
  {
    title: "Manage Logos",
    href: "/logos/manage",
    section: "logos",
    description: "Manage and organise product logos (admin)",
  },
  {
    title: "Upload Logo",
    href: "/logos/upload",
    section: "logos",
    description: "Upload new product logos to the library (admin)",
  },

  // Digital Assets
  {
    title: "Digital Assets",
    href: "/digital-assets",
    section: "digital assets",
    description: "Browse and manage digital assets for your projects",
  },
  {
    title: "AD Studio",
    href: "/digital-assets/digital-ad-builder",
    section: "digital assets",
    description:
      "Create display ads with product logos, stock images, and brand palette tokens",
  },
  {
    title: "Stock Images",
    href: "/digital-assets/stock-images",
    section: "digital assets",
    description: "Browse and download stock images for use in your designs",
  },
  {
    title: "Upload Stock Image",
    href: "/digital-assets/stock-images/upload",
    section: "digital assets",
    description: "Upload new stock images to the digital assets library (admin)",
  },

  // Theme Builder
  {
    title: "Theme Builder",
    href: "/theme-builder",
    section: "theme builder",
    description: "Build and export custom themes using design tokens",
  },
  {
    title: "Theme Builder Usage Guide",
    href: "/theme-builder/usage-guide",
    section: "theme builder",
    description: "Learn how to use the theme builder and integrate exported tokens",
  },

  // Figma Kit
  {
    title: "Figma Kit",
    href: "/figma-kit",
    section: "designer tools",
    description: "Figma resources, plugins, and tools for the EG design system",
  },
  {
    title: "Agent Skills",
    href: "/figma-kit/agent-skills",
    section: "designer tools",
    description: "AI coding agent skill documentation for the design system",
  },
  {
    title: "Figma Make",
    href: "/figma-kit/figma-make",
    section: "designer tools",
    description: "Figma Make integration and usage guide",
  },
  {
    title: "BrandSync Studio Plugin",
    href: "/figma-kit/figma-plugins/brandsync-studio",
    section: "designer tools",
    description: "BrandSync Studio Figma plugin documentation and setup",
  },
  {
    title: "EG Product Logos Plugin",
    href: "/figma-kit/figma-plugins/eg-product-logos",
    section: "designer tools",
    description: "EG Product Logos Figma plugin documentation and setup",
  },
  {
    title: "EG Stock Images Plugin",
    href: "/figma-kit/figma-plugins/eg-stock-images",
    section: "designer tools",
    description: "EG Stock Images Figma plugin documentation and setup",
  },

  // AI & MCP
  {
    title: "MCP",
    href: "/mcp",
    section: "AI & MCP",
    description: "Model Context Protocol integration and AI tools for BrandSync",
  },

  // Brand Guideline
  {
    title: "Brand Guideline",
    href: "/brand-guideline",
    section: "brand",
    description: "Official EG brand guidelines and usage rules",
  },

  // Governance
  {
    title: "Governance",
    href: "/governance",
    section: "governance",
    description: "Design system governance, contribution process, and decision making",
  },

  // Support & Info
  {
    title: "Support",
    href: "/support",
    section: "support",
    description: "Get help and support for BrandSync and the design system",
  },
  {
    title: "FAQs",
    href: "/faqs",
    section: "support",
    description: "Frequently asked questions about BrandSync and the design system",
  },
  {
    title: "Roadmap",
    href: "/roadmap",
    section: "support",
    description: "Upcoming features and planned improvements for BrandSync",
  },
  {
    title: "Sitemap",
    href: "/sitemap",
    section: "support",
    description: "Full sitemap of all pages and sections in BrandSync",
  },
];

function highlightText(text, term) {
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
    ),
  );
}

export default function SearchCard({ open, setOpen }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allSearchData, setAllSearchData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState([]);
  const router = useRouter();
  const searchRef = useRef(null);
  const selectedItemRef = useRef(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentSearches");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  }, []);

  // Save to recent searches
  const addToRecentSearches = useCallback((term, href) => {
    if (!term || term.length < 2) return;

    setRecentSearches((prev) => {
      const newSearch = { term, href, timestamp: Date.now() };
      const filtered = prev.filter((s) => s.href !== href);
      const updated = [newSearch, ...filtered].slice(0, 5); // Keep last 5 searches

      try {
        localStorage.setItem("recentSearches", JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving recent searches:", error);
      }

      return updated;
    });
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 150); // 150ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch dynamic data when component mounts
  const fetchSearchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch components
      const componentsData = await getComponentsForSidebar();
      const formattedComponents = componentsData.error
        ? []
        : componentsData.map((component) => ({
            title: component.title,
            href: `/design-system/components/${component.title}`,
            section: "component",
            description: `${component.title} component documentation and usage guidelines`,
          }));

      // Combine all search data
      const combinedData = [...staticPages, ...formattedComponents];
      setAllSearchData(combinedData);
      setComponents(formattedComponents);
    } catch (error) {
      console.error("Error fetching search data:", error);
      setAllSearchData(staticPages); // Fallback to static pages only
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and rank results based on search term with fuzzy matching
  const filteredResults = useMemo(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.length < 1) return [];

    const scoredResults = allSearchData
      .map((item) => calculateRelevanceScore(item, debouncedSearchTerm))
      .filter((result) => result.score > 0) // Only include matches
      .sort((a, b) => b.score - a.score); // Sort by relevance score (highest first)

    return scoredResults.map((result) => result.item);
  }, [debouncedSearchTerm, allSearchData]);

  // Handle navigation to a result
  const navigateToResult = useCallback(
    (item) => {
      addToRecentSearches(debouncedSearchTerm, item.href);
      router.push(item.href);
      setOpen(false);
    },
    [debouncedSearchTerm, router, setOpen, addToRecentSearches],
  );

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredResults.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredResults.length - 1,
      );
    } else if (e.key === "Enter" && filteredResults[selectedIndex]) {
      navigateToResult(filteredResults[selectedIndex]);
    }
  };

  // Handle backdrop click to close
  const handleBackdropClick = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setDebouncedSearchTerm("");
      setSelectedIndex(0);
    } else {
      // Fetch data when search opens
      if (allSearchData.length === 0) {
        fetchSearchData();
      }
    }
  }, [open, fetchSearchData, allSearchData.length]);

  // Reset selected index when search term changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [debouncedSearchTerm]);

  // Auto-scroll to keep selected item in view
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop to handle outside clicks */}
      <Backdrop
        open={open}
        onClick={handleBackdropClick}
        sx={{
          zIndex: 1999,
          backgroundColor: "rgba(0, 0, 0, 0.1)",
        }}
      />

      {/* Search Modal */}
      <MotionPaper
        ref={searchRef}
        initial={{ scale: 0.8, opacity: 0, x: "-50%" }}
        animate={{ scale: 1, opacity: 1, x: "-50%" }}
        exit={{ scale: 0.8, opacity: 0, x: "-50%" }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        elevation={12}
        onKeyDown={handleKeyDown}
        sx={{
          p: 2,
          height: "500px",
          width: "70%",
          "@media (max-width: 700px)": { width: "90%" },
          "@media (max-width: 450px)": { width: "95%" },
          maxWidth: "600px",
          position: "fixed",
          top: 70,
          left: "50%",
          zIndex: 2000,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          outline: "none", // Remove default focus outline
        }}
      >
        <TextField
          placeholder="Search components, pages..."
          variant="standard"
          fullWidth
          autoFocus
          InputProps={{
            disableUnderline: true,
            sx: {
              px: 1,
              py: 1.2,
              borderRadius: 2,
              backgroundColor: "background.paper",
              boxShadow: 1,
            },
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Divider sx={{ my: 2 }} />

        <List sx={{ overflowY: "auto", flexGrow: 1 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : !debouncedSearchTerm ? (
            <>
              <Box sx={{ textAlign: "center", py: 2 }}>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Start typing to search components, pages, and guidelines
                </Typography>
              </Box>

              {recentSearches.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ px: 2, fontWeight: 600, textTransform: "uppercase" }}
                  >
                    Recent Searches
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {recentSearches.map((recent, i) => (
                      <ListItem
                        key={i}
                        onClick={() => {
                          router.push(recent.href);
                          setOpen(false);
                        }}
                        sx={{
                          borderRadius: 2,
                          mb: 0.5,
                          px: 2,
                          py: 1.5,
                          cursor: "pointer",
                          transition: "0.2s",
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {recent.term}
                        </Typography>
                      </ListItem>
                    ))}
                  </Box>
                </Box>
              )}
            </>
          ) : filteredResults.length > 0 ? (
            filteredResults.map((item, i) => (
              <ListItem
                key={i}
                ref={selectedIndex === i ? selectedItemRef : null}
                onClick={() => navigateToResult(item)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  px: 2,
                  py: 1.5,
                  cursor: "pointer",
                  transition: "0.2s",
                  backgroundColor:
                    selectedIndex === i ? "action.selected" : "transparent",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">
                    {highlightText(item.title, debouncedSearchTerm)}
                  </Typography>
                  {item.description && (
                    <Typography variant="body2" color="text.secondary">
                      {highlightText(item.description, debouncedSearchTerm)}
                    </Typography>
                  )}
                </Box>
                {item.section && (
                  <Chip
                    label={item.section}
                    variant="outlined"
                    size="small"
                    sx={{ ml: 2, textTransform: "capitalize" }}
                  />
                )}
              </ListItem>
            ))
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="text.secondary" mb={1}>
                No results found for "{debouncedSearchTerm}"
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try different keywords or check for typos
              </Typography>
            </Box>
          )}
        </List>

        {/* Footer with keyboard shortcuts */}
        <Box
          sx={{
            pt: 1,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Chip label="↑↓ Navigate" size="small" variant="outlined" />
          <Chip label="Enter Select" size="small" variant="outlined" />
          <Chip label="Esc Close" size="small" variant="outlined" />
        </Box>
      </MotionPaper>
    </>
  );
}
