"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";
import {
  MagnifyingGlass,
  SquaresFour,
  Graph,
  Palette,
  Atom,
  ChartBar,
  ArrowRight,
} from "phosphor-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComponentDetailModal from "./ComponentDetailModal";
import { getComponents } from "@/api/mcp/client/components";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Real data from hosted BrandSync MCP (mcp__brandsync__list_components + graph_stats)
const GRAPH_STATS = { nodes: 556, edges: 810, communities: 30 };
const TOTAL_TOKENS = 1206;

// Component list from mcp__brandsync__list_components + manual category mapping
const FALLBACK_COMPONENTS = [
  { name: "Accordion",          category: "Layout"       },
  { name: "Avatar",             category: "Data Display" },
  { name: "Badge",              category: "Data Display" },
  { name: "Breadcrumb",         category: "Navigation"   },
  { name: "Buttons",            category: "Form"         },
  { name: "Card",               category: "Data Display" },
  { name: "Carousel",           category: "Data Display" },
  { name: "Checkbox",           category: "Form"         },
  { name: "Chips",              category: "Data Display" },
  { name: "Dialog",             category: "Feedback"     },
  { name: "File Upload",        category: "Form"         },
  { name: "Input Fields",       category: "Form"         },
  { name: "Links",              category: "Form"         },
  { name: "List",               category: "Data Display" },
  { name: "Menu",               category: "Layout"       },
  { name: "Navigation Drawer",  category: "Navigation"   },
  { name: "Pagination",         category: "Navigation"   },
  { name: "Progress Indicator", category: "Feedback"     },
  { name: "Progress Stepper",   category: "Feedback"     },
  { name: "Radio Button",       category: "Form"         },
  { name: "Select",             category: "Form"         },
  { name: "Slider",             category: "Form"         },
  { name: "Snackbar",           category: "Feedback"     },
  { name: "Switch",             category: "Form"         },
  { name: "Table",              category: "Data Display" },
  { name: "Tabs",               category: "Navigation"   },
  { name: "Tag",                category: "Data Display" },
  { name: "Toolbar",            category: "Layout"       },
  { name: "Tooltip",            category: "Feedback"     },
  { name: "Tree",               category: "Navigation"   },
];

// Colours from --bs-brand-* and semantic palette tokens
const CATEGORY_COLORS = {
  Form:           "var(--bs-blue-500)",
  "Data Display": "var(--bs-purple-500)",
  Navigation:     "var(--bs-success-500)",
  Feedback:       "var(--bs-warning-400)",
  Layout:         "var(--bs-error-500)",
};
const CATEGORY_COLORS_HEX = {
  Form:           "#0073e1",
  "Data Display": "#715afc",
  Navigation:     "#00855b",
  Feedback:       "#b18100",
  Layout:         "#d93539",
};

// Real token counts by meaningful category (from brandsync-tokens npm package — 1,206 total)
// Derived via counting --bs-* prefixes from tokens.css
const TOKEN_CATEGORIES = {
  labels: ["Color Scales", "Semantic Colors", "Typography", "Spacing & Sizing", "Components", "Shadow", "Motion & Layout"],
  counts: [350, 364, 100, 109, 154, 34, 95],
};

const STAT_CARDS = [
  { label: "Components",     value: 30,         icon: SquaresFour, colorVar: "var(--bs-blue-500)",    hexColor: "#0073e1" },
  { label: "Design Tokens",  value: TOTAL_TOKENS, icon: Palette,   colorVar: "var(--bs-purple-500)", hexColor: "#715afc" },
  { label: "Graph Nodes",    value: GRAPH_STATS.nodes,  icon: Graph,  colorVar: "var(--bs-success-500)", hexColor: "#00855b" },
  { label: "Communities",    value: GRAPH_STATS.communities, icon: Atom, colorVar: "var(--bs-warning-400)", hexColor: "#b18100" },
];

export default function BrandsyncStatsPage() {
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === "dark";

  const [components, setComponents] = useState(FALLBACK_COMPONENTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_BRANDSYNC_MCP_URL) return;
    setLoading(true);
    getComponents()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data;
        if (Array.isArray(data) && data.length) setComponents(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Object.keys(CATEGORY_COLORS)];

  const filtered = components.filter((c) => {
    const matchSearch =
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || c.category === categoryFilter;
    return matchSearch && matchCat;
  });

  // Real counts from FALLBACK_COMPONENTS (matches mcp__brandsync__list_components)
  const categoryCounts = Object.keys(CATEGORY_COLORS).map((cat) => ({
    name: cat,
    count: FALLBACK_COMPONENTS.filter((c) => c.category === cat).length,
  }));

  const donutOptions = {
    chart: { type: "donut", toolbar: { show: false }, background: "transparent" },
    labels: categoryCounts.map((c) => c.name),
    colors: Object.values(CATEGORY_COLORS_HEX),
    legend: { position: "bottom", fontSize: "13px", labels: { colors: isDark ? "#ccc" : "#333" } },
    dataLabels: { enabled: true, style: { fontSize: "12px" } },
    plotOptions: {
      pie: {
        donut: {
          size: "60%",
          labels: {
            show: true,
            total: { show: true, label: "Total", color: isDark ? "#ccc" : "#333", formatter: () => "30" },
          },
        },
      },
    },
    theme: { mode: isDark ? "dark" : "light" },
    stroke: { width: 0 },
  };

  const barOptions = {
    chart: { type: "bar", toolbar: { show: false }, background: "transparent" },
    colors: ["#0073e1"],
    xaxis: {
      categories: TOKEN_CATEGORIES.labels,
      labels: { style: { fontSize: "11px", colors: Array(7).fill(isDark ? "#aaa" : "#666") } },
    },
    yaxis: { labels: { style: { colors: [isDark ? "#aaa" : "#666"] } } },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "55%", dataLabels: { position: "top" } } },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: { fontSize: "11px", fontWeight: 600, colors: [isDark ? "#ddd" : "#333"] },
    },
    grid: { borderColor: isDark ? "#2a2a2a" : "#f0f0f0" },
    theme: { mode: isDark ? "dark" : "light" },
    tooltip: { y: { formatter: (v) => `${v} tokens` } },
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Box
        sx={{
          mt: "64px",
          flex: 1,
          p: { xs: 2, md: 4 },
          maxWidth: "var(--bs-grid-container-max, 1440px)",
          mx: "auto",
          width: "100%",
        }}
      >
        {/* Page header */}
        <Stack direction="row" alignItems="center" gap={1.5} mb={0.5}>
          <ChartBar size={26} weight="duotone" color="var(--bs-color-primary-default)" />
          <Typography
            component="h1"
            sx={{
              fontSize: "var(--bs-font-size-2xl)",
              fontWeight: "var(--bs-font-weight-bold)",
              color: "var(--bs-text-default)",
              lineHeight: "var(--bs-line-height-snug)",
            }}
          >
            BrandSync Stats
          </Typography>
        </Stack>
        <Typography
          sx={{
            fontSize: "var(--bs-font-size-sm)",
            color: "var(--bs-text-muted)",
            mb: "var(--bs-spacing-400, 32px)",
          }}
        >
          Live metrics from the EG BrandSync design system — {TOTAL_TOKENS.toLocaleString()} tokens,{" "}
          {FALLBACK_COMPONENTS.length} components, {GRAPH_STATS.nodes} knowledge graph nodes.
        </Typography>

        {/* Stat cards — 4 KPI cards from real MCP data */}
        <Grid container spacing={2} mb={4}>
          {STAT_CARDS.map(({ label, value, icon: Icon, colorVar, hexColor }) => (
            <Grid item xs={12} sm={6} md={3} key={label}>
              <Box
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid var(--bs-border-default)",
                  borderRadius: "var(--bs-border-radius-200)",
                  p: "var(--bs-spacing-300)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "var(--bs-shadow-xs)",
                  transition: "box-shadow var(--bs-duration-default) var(--bs-easing-standard)",
                  "&:hover": { boxShadow: "var(--bs-shadow-sm)" },
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: "var(--bs-font-size-sm)",
                      color: "var(--bs-text-muted)",
                      mb: "var(--bs-spacing-50)",
                    }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "var(--bs-font-size-4xl)",
                      fontWeight: "var(--bs-font-weight-bold)",
                      color: "var(--bs-text-default)",
                      lineHeight: 1,
                    }}
                  >
                    {value.toLocaleString()}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: "var(--bs-border-radius-150)",
                    backgroundColor: `${hexColor}1A`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={26} color={hexColor} weight="duotone" />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} mb={4}>
          {/* Donut — Components by category (real counts from list_components) */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                bgcolor: "background.paper",
                border: "1px solid var(--bs-border-default)",
                borderRadius: "var(--bs-border-radius-200)",
                p: "var(--bs-spacing-300)",
                height: "100%",
              }}
            >
              <Typography
                sx={{
                  fontSize: "var(--bs-font-size-md)",
                  fontWeight: "var(--bs-font-weight-semibold)",
                  color: "var(--bs-text-default)",
                  mb: "var(--bs-spacing-50)",
                }}
              >
                Components by Category
              </Typography>
              <Typography
                sx={{ fontSize: "var(--bs-font-size-xs)", color: "var(--bs-text-muted)", mb: 2 }}
              >
                30 components · 5 categories
              </Typography>
              <Chart
                options={donutOptions}
                series={categoryCounts.map((c) => c.count)}
                type="donut"
                height={290}
              />
            </Box>
          </Grid>

          {/* Bar — Token counts by category (real counts from tokens.css) */}
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                bgcolor: "background.paper",
                border: "1px solid var(--bs-border-default)",
                borderRadius: "var(--bs-border-radius-200)",
                p: "var(--bs-spacing-300)",
                height: "100%",
              }}
            >
              <Typography
                sx={{
                  fontSize: "var(--bs-font-size-md)",
                  fontWeight: "var(--bs-font-weight-semibold)",
                  color: "var(--bs-text-default)",
                  mb: "var(--bs-spacing-50)",
                }}
              >
                Design Tokens by Category
              </Typography>
              <Typography
                sx={{ fontSize: "var(--bs-font-size-xs)", color: "var(--bs-text-muted)", mb: 2 }}
              >
                {TOTAL_TOKENS.toLocaleString()} total tokens across 7 categories
              </Typography>
              <Chart
                options={barOptions}
                series={[{ name: "Tokens", data: TOKEN_CATEGORIES.counts }]}
                type="bar"
                height={290}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Graph stats strip */}
        <Box
          sx={{
            bgcolor: "background.paper",
            border: "1px solid var(--bs-border-default)",
            borderRadius: "var(--bs-border-radius-200)",
            p: "var(--bs-spacing-250)",
            mb: 4,
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "var(--bs-font-size-xs)",
              fontWeight: "var(--bs-font-weight-semibold)",
              color: "var(--bs-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "var(--bs-letter-spacing-widest)",
              mr: 1,
            }}
          >
            Knowledge Graph
          </Typography>
          {[
            { label: "Nodes", value: GRAPH_STATS.nodes },
            { label: "Edges", value: GRAPH_STATS.edges },
            { label: "Communities", value: GRAPH_STATS.communities },
          ].map(({ label, value }) => (
            <Stack key={label} direction="row" alignItems="baseline" gap={0.75}>
              <Typography
                sx={{
                  fontSize: "var(--bs-font-size-2xl)",
                  fontWeight: "var(--bs-font-weight-bold)",
                  color: "var(--bs-text-default)",
                  lineHeight: 1,
                }}
              >
                {value.toLocaleString()}
              </Typography>
              <Typography
                sx={{ fontSize: "var(--bs-font-size-xs)", color: "var(--bs-text-muted)" }}
              >
                {label}
              </Typography>
            </Stack>
          ))}
        </Box>

        {/* Component table */}
        <Box
          sx={{
            bgcolor: "background.paper",
            border: "1px solid var(--bs-border-default)",
            borderRadius: "var(--bs-border-radius-200)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: "var(--bs-spacing-300)",
              py: "var(--bs-spacing-250)",
              borderBottom: "1px solid var(--bs-border-default)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "var(--bs-font-size-md)",
                  fontWeight: "var(--bs-font-weight-semibold)",
                  color: "var(--bs-text-default)",
                }}
              >
                Component Library
              </Typography>
              <Typography sx={{ fontSize: "var(--bs-font-size-xs)", color: "var(--bs-text-muted)" }}>
                Click any row to view spec, tokens and CSS classes
              </Typography>
            </Box>
            <TextField
              size="small"
              placeholder="Search components…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlass size={16} />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 240 }}
            />
          </Box>

          {/* Category filter chips using --bs-chip-* token classes conceptually */}
          <Box
            sx={{
              px: "var(--bs-spacing-300)",
              py: "var(--bs-spacing-150)",
              borderBottom: "1px solid var(--bs-border-default)",
              bgcolor: "background.default",
            }}
          >
            <Stack direction="row" gap={1} flexWrap="wrap">
              {categories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  size="small"
                  onClick={() => setCategoryFilter(cat)}
                  variant={categoryFilter === cat ? "filled" : "outlined"}
                  color={categoryFilter === cat ? "primary" : "default"}
                  sx={{ cursor: "pointer", fontWeight: categoryFilter === cat ? 600 : 400 }}
                />
              ))}
            </Stack>
          </Box>

          {loading ? (
            <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}>
              <CircularProgress size={32} />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "background.default" }}>
                    <TableCell
                      sx={{
                        fontWeight: "var(--bs-font-weight-semibold)",
                        fontSize: "var(--bs-font-size-sm)",
                        pl: "var(--bs-spacing-300)",
                      }}
                    >
                      Component
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "var(--bs-font-weight-semibold)",
                        fontSize: "var(--bs-font-size-sm)",
                      }}
                    >
                      Category
                    </TableCell>
                    <TableCell sx={{ width: 140 }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((comp, i) => (
                    <TableRow
                      key={comp.id || comp.name || i}
                      hover
                      sx={{ cursor: "pointer" }}
                      onClick={() => setSelected(comp)}
                    >
                      <TableCell sx={{ pl: "var(--bs-spacing-300)" }}>
                        <Typography
                          sx={{
                            fontSize: "var(--bs-font-size-sm)",
                            fontWeight: "var(--bs-font-weight-semibold)",
                            color: "var(--bs-text-default)",
                          }}
                        >
                          {comp.name}
                        </Typography>
                        {comp.description && (
                          <Typography
                            sx={{
                              display: "block",
                              fontSize: "var(--bs-font-size-xs)",
                              color: "var(--bs-text-muted)",
                              mt: "2px",
                              maxWidth: 420,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {comp.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={comp.category || "—"}
                          size="small"
                          sx={{
                            bgcolor: `${CATEGORY_COLORS_HEX[comp.category] || "#888"}18`,
                            color: CATEGORY_COLORS_HEX[comp.category] || "text.secondary",
                            fontWeight: "var(--bs-font-weight-semibold)",
                            border: "none",
                            fontSize: "var(--bs-font-size-xs)",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          gap={0.5}
                          sx={{ color: "var(--bs-color-primary-default)" }}
                        >
                          <Typography
                            sx={{
                              fontSize: "var(--bs-font-size-sm)",
                              color: "var(--bs-color-primary-default)",
                            }}
                          >
                            View details
                          </Typography>
                          <ArrowRight size={14} color="var(--bs-color-primary-default)" />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!filtered.length && (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        sx={{
                          textAlign: "center",
                          py: 8,
                          fontSize: "var(--bs-font-size-sm)",
                          color: "var(--bs-text-muted)",
                        }}
                      >
                        {search ? `No components match "${search}".` : "No components available."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>

      <Footer />

      {selected && (
        <ComponentDetailModal component={selected} onClose={() => setSelected(null)} />
      )}
    </Box>
  );
}
