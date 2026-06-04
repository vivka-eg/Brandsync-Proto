"use client";
import React, { useEffect, useState, useMemo } from "react";
import NextLink from "next/link";
import {
  Box,
  Typography,
  Stack,
  Grid,
  Paper,
  Container,
  alpha,
  useTheme,
  TextField,
  InputAdornment,
  Chip,
  Fade,
  Link as MuiLink,
} from "@mui/material";
import { getComponentsForSidebar } from "@/api/design-system/component-list";
import ApiHandler from "@/api/design-system";
import Loader from "@/components/shared/Loader";
import {
  House,
  BookOpen,
  ArrowRight,
  MagnifyingGlass,
  Palette,
  CirclesFour,
  Folder,
  ImageSquare,
} from "phosphor-react";
import { CompassTool, Toolbox } from "@phosphor-icons/react";
import Footer from "@/components/Footer";

// Static routes organized by section
const staticRoutes = {
  main: [
    { label: "Home", href: "/" },
    { label: "Design System", href: "/design-system" },
    { label: "UX Governance", href: "/governance" },
    { label: "FAQs", href: "/faqs" },
    { label: "Support", href: "/support" },
    { label: "Figma Kit", href: "/figma-kit" },
    { label: "Theme Builder", href: "/theme-builder" },
    { label: "Logos", href: "/logos" },
    { label: "MCP", href: "/mcp" },
  ],
  designSystemOverview: [
    { label: "Introduction", href: "/design-system" },
    { label: "Quick Start Guide", href: "/design-system/quick-start-guide" },
    { label: "For Designers", href: "/design-system/for-designers" },
    { label: "Accessibility", href: "/design-system/accessibility" },
    {
      label: "Accessible Palettes",
      href: "/design-system/accessible-palettes",
    },
    { label: "Design Philosophy", href: "/design-system/design-philosophy" },
  ],
  designerTools: [
    { label: "Figma Kit", href: "/figma-kit" },
    { label: "Figma Make", href: "/figma-kit/figma-make" },
    {
      label: "BrandSync Studio",
      href: "/figma-kit/figma-plugins/brandsync-studio",
    },
    {
      label: "EG Stock Images",
      href: "/figma-kit/figma-plugins/eg-stock-images",
    },
    {
      label: "EG Product Logos",
      href: "/figma-kit/figma-plugins/eg-product-logos",
    },
    { label: "Agent Skills", href: "/figma-kit/agent-skills" },
  ],
  themeBuilder: [
    { label: "Theme Builder", href: "/theme-builder" },
    { label: "Usage Guide", href: "/theme-builder/usage-guide" },
  ],
  productLogos: [
    { label: "Product Logos", href: "/logos" },
    { label: "Manage Logos", href: "/logos/manage" },
    { label: "Upload Logo", href: "/logos/upload" },
  ],
  assets: [
    { label: "Assets", href: "/assets" },
    { label: "Icons", href: "/assets/icons" },
    { label: "Manage Icons", href: "/assets/icons/admin/manage" },
    { label: "Upload Icon", href: "/assets/icons/admin/upload" },
  ],
  digitalAssets: [
    { label: "Digital Assets", href: "/digital-assets" },
    { label: "AD Studio", href: "/digital-assets/digital-ad-builder" },
    { label: "Stock Images", href: "/digital-assets/stock-images" },
  ],
};

const SitemapSection = ({
  title,
  routes,
  loading = false,
  icon: Icon,
  searchQuery = "",
  index = 0,
}) => {
  const theme = useTheme();

  // Filter routes based on search query
  const filteredRoutes = useMemo(() => {
    if (!routes || !searchQuery) return routes;
    return routes.filter((route) =>
      route.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [routes, searchQuery]);

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={2}>
          {title}
        </Typography>
        <Stack spacing={1}>
          {[1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{
                height: 40,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.text.primary, 0.05),
                animation: "pulse 1.5s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 0.4 },
                  "50%": { opacity: 0.7 },
                },
              }}
            />
          ))}
        </Stack>
      </Paper>
    );
  }

  if (!filteredRoutes || filteredRoutes.length === 0) {
    if (searchQuery && routes?.length > 0) {
      return (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            opacity: 0.6,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            {Icon && (
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.text.secondary, 0.1),
                  color: "text.secondary",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={20} weight="duotone" />
              </Box>
            )}
            <Typography variant="h6" fontWeight={600} color="text.secondary">
              {title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            No matches found
          </Typography>
        </Paper>
      );
    }
    return null;
  }

  return (
    <Fade in timeout={300 + index * 100}>
      <Paper
        elevation={0}
        component="section"
        aria-labelledby={`section-${title.replace(/\s+/g, "-").toLowerCase()}`}
        sx={{
          p: 3,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.12)}`,
            borderColor: "primary.main",
          },
          "&:focus-within": {
            borderColor: "primary.main",
            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {Icon && (
              <Box
                sx={{
                  p: 1,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={20} weight="duotone" />
              </Box>
            )}
            <Typography
              variant="h6"
              fontWeight={600}
              id={`section-${title.replace(/\s+/g, "-").toLowerCase()}`}
            >
              {title}
            </Typography>
          </Box>
          <Chip
            label={`${filteredRoutes.length} ${filteredRoutes.length === 1 ? "link" : "links"}`}
            size="small"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              fontWeight: 500,
              fontSize: "0.75rem",
            }}
          />
        </Box>
        <Stack component="nav" aria-label={`${title} navigation`} spacing={0.5}>
          {filteredRoutes.map((route, routeIndex) => (
            <MuiLink
              key={routeIndex}
              component={NextLink}
              href={route.href}
              underline="none"
              sx={{
                color: "text.primary",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1.5,
                borderRadius: 2,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                outline: "none",
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  transform: "translateX(4px)",
                  "& .arrow-icon": {
                    opacity: 1,
                    transform: "translateX(4px)",
                  },
                },
                "&:focus-visible": {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.4)}`,
                  "& .arrow-icon": {
                    opacity: 1,
                  },
                },
                "&:active": {
                  transform: "translateX(2px) scale(0.99)",
                },
              }}
            >
              <Typography variant="body2" fontWeight={500}>
                {route.label}
              </Typography>
              <ArrowRight
                className="arrow-icon"
                size={16}
                weight="bold"
                aria-hidden="true"
                style={{
                  opacity: 0,
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  color: theme.palette.primary.main,
                }}
              />
            </MuiLink>
          ))}
        </Stack>
      </Paper>
    </Fade>
  );
};

export default function SitemapPage() {
  const theme = useTheme();
  const [foundations, setFoundations] = useState([]);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // All rendered sections (Assets section is commented out in the grid)
  const renderedSections = useMemo(
    () => [
      staticRoutes.main,
      staticRoutes.designerTools,
      staticRoutes.themeBuilder,
      staticRoutes.productLogos,
      staticRoutes.designSystemOverview,
      foundations,
      staticRoutes.digitalAssets,
      components,
    ],
    [foundations, components],
  );

  // Calculate total links
  const totalLinks = useMemo(() => {
    return renderedSections.reduce((sum, section) => sum + section.length, 0);
  }, [renderedSections]);

  const totalSections = useMemo(() => {
    return renderedSections.filter((s) => s.length > 0).length;
  }, [renderedSections]);

  // Calculate filtered total
  const filteredTotal = useMemo(() => {
    if (!searchQuery) return totalLinks;
    const filterFn = (route) =>
      route.label.toLowerCase().includes(searchQuery.toLowerCase());
    return (
      staticRoutes.main.filter(filterFn).length +
      staticRoutes.designSystemOverview.filter(filterFn).length +
      staticRoutes.designerTools.filter(filterFn).length +
      staticRoutes.themeBuilder.filter(filterFn).length +
      staticRoutes.productLogos.filter(filterFn).length +
      staticRoutes.assets.filter(filterFn).length +
      staticRoutes.digitalAssets.filter(filterFn).length +
      foundations.filter(filterFn).length +
      components.filter(filterFn).length
    );
  }, [searchQuery, totalLinks, foundations, components]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch components
        const componentsData = await getComponentsForSidebar();
        const formattedComponents =
          componentsData.error || !componentsData
            ? []
            : componentsData.map((component) => ({
                label: component.title,
                href: `/design-system/components/${encodeURIComponent(
                  component.title,
                )}`,
              }));

        // Fetch foundations
        const api = await ApiHandler.init();
        const foundationsResponse = await api.find("foundations");
        const foundationsData = foundationsResponse.error
          ? foundationsResponse
          : (foundationsResponse.data ?? []);
        const formattedFoundations =
          foundationsData.error || !foundationsData
            ? []
            : foundationsData.map((foundation) => {
                const title = foundation.Article?.Title || "";
                const slug = title.toLowerCase().replace(/\s+/g, "-");
                return {
                  label: title,
                  href: `/design-system/foundation/${slug}`,
                };
              });

        // Add "Old Logo Placement" to foundations
        const allFoundations = [
          ...formattedFoundations,
          {
            label: "Old Logo Placement",
            href: "/design-system/old-logo-placement",
          },
        ];

        setFoundations(allFoundations);
        setComponents(formattedComponents);
      } catch (error) {
        console.error("Error fetching sitemap data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Box
        component="main"
        sx={{
          bgcolor: "background.default",
          flex: 1,
          pt: "64px",
          pb: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ width: "100%", px: 2 }}>
          {/* Header */}
          <Box sx={{ mt: 4, mb: 4, textAlign: "center" }}>
            <Typography
              variant="h3"
              component="h1"
              fontWeight={700}
              mb={1.5}
              color="text.primary"
            >
              Sitemap
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: "600px", mx: "auto", mb: 3 }}
            >
              Complete overview of all pages and routes available in EG
              Brandsync
            </Typography>

            {/* Search */}
            <Box sx={{ maxWidth: 480, mx: "auto", mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search sitemap pages"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <MagnifyingGlass
                          size={20}
                          color={theme.palette.text.secondary}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "background.paper",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                    "&.Mui-focused": {
                      boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.15)}`,
                    },
                  },
                }}
              />
            </Box>

            {/* Stats */}
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? (
                <>
                  Showing <strong>{filteredTotal}</strong> of{" "}
                  <strong>{totalLinks}</strong> pages
                </>
              ) : (
                <>
                  <strong>{totalLinks}</strong> pages across{" "}
                  <strong>{totalSections}</strong> sections
                </>
              )}
            </Typography>
          </Box>

          {/* Grid; 3 explicit columns, sections distributed to balance height */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Grid
              container
              spacing={3}
              alignItems="flex-start"
              sx={{ maxWidth: "1200px" }}
            >
              {/* Column 1: Site navigation */}
              <Grid item xs={12} md={4}>
                <Stack spacing={3}>
                  <SitemapSection
                    title="Main Pages"
                    routes={staticRoutes.main}
                    icon={House}
                    searchQuery={searchQuery}
                    index={0}
                  />
                  <SitemapSection
                    title="Designer Tools"
                    routes={staticRoutes.designerTools}
                    icon={Toolbox}
                    searchQuery={searchQuery}
                    index={1}
                  />
                  <SitemapSection
                    title="Theme Builder"
                    routes={staticRoutes.themeBuilder}
                    icon={Palette}
                    searchQuery={searchQuery}
                    index={2}
                  />
                  <SitemapSection
                    title="Product Logos"
                    routes={staticRoutes.productLogos}
                    icon={CirclesFour}
                    searchQuery={searchQuery}
                    index={3}
                  />
                </Stack>
              </Grid>

              {/* Column 2: Design System + Assets */}
              <Grid item xs={12} md={4}>
                <Stack spacing={3}>
                  <SitemapSection
                    title="Design System Overview"
                    routes={staticRoutes.designSystemOverview}
                    icon={CompassTool}
                    searchQuery={searchQuery}
                    index={4}
                  />
                  <SitemapSection
                    title="Foundations"
                    routes={foundations}
                    loading={loading}
                    icon={BookOpen}
                    searchQuery={searchQuery}
                    index={5}
                  />
                  {/* <SitemapSection
                  title="Assets"
                  routes={staticRoutes.assets}
                  icon={Folder}
                  searchQuery={searchQuery}
                  index={6}
                /> */}
                  <SitemapSection
                    title="Digital Assets"
                    routes={staticRoutes.digitalAssets}
                    icon={ImageSquare}
                    searchQuery={searchQuery}
                    index={7}
                  />
                </Stack>
              </Grid>

              {/* Column 3: Components (fills full height) */}
              <Grid item xs={12} md={4}>
                <SitemapSection
                  title="Components"
                  routes={components}
                  loading={loading}
                  icon={BookOpen}
                  searchQuery={searchQuery}
                  index={8}
                />
              </Grid>
            </Grid>
          </Box>

          {/* No results message */}
          {searchQuery && filteredTotal === 0 && (
            <Fade in>
              <Box sx={{ textAlign: "center", mt: 4, py: 6 }}>
                <MagnifyingGlass
                  size={48}
                  weight="duotone"
                  color={theme.palette.text.secondary}
                />
                <Typography variant="h6" color="text.secondary" mt={2}>
                  No pages found for "{searchQuery}"
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Try searching with different keywords
                </Typography>
              </Box>
            </Fade>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
}
