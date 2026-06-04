"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import BetaCtaBanner from "@/feature/mcp-getting-started/components/BetaCtaBanner";
import Breadcrumb from "@/feature/mcp-getting-started/components/Breadcrumb";
import PageHeader from "@/feature/mcp-getting-started/components/PageHeader";
import SectionHeading from "@/feature/mcp-getting-started/components/SectionHeading";
import PageNav from "@/feature/mcp-getting-started/components/PageNav";
import { useAuthContext } from "@/context/auth/AuthContext";

// ── Code Block (title-style, no copy button) ───────────────────────────────────

function CodeBlock({ title, children }) {
  return (
    <Box sx={{ bgcolor: "#f7f7f5", borderRadius: "8px", p: 2, width: "100%" }}>
      <Typography
        sx={{
          fontSize: "20px",
          fontWeight: 700,
          lineHeight: "32px",
          color: "#121212",
          mb: 1,
        }}
      >
        {title}
      </Typography>
      <Box
        component="pre"
        sx={{
          m: 0,
          fontFamily: "'Roboto Mono', Consolas, monospace",
          fontSize: "16px",
          lineHeight: "24px",
          color: "text.primary",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

// ── Table ──────────────────────────────────────────────────────────────────────

function TableRow({ left, right, leftMono = true }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        px: 2,
        py: 1.5,
        border: "0.5px solid #e5e5e3",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            fontFamily: leftMono
              ? "'Roboto Mono', Consolas, monospace"
              : "inherit",
            fontWeight: 500,
            fontSize: "16px",
            lineHeight: "21px",
            color: "#0066ae",
            whiteSpace: "nowrap",
          }}
        >
          {left}
        </Typography>
      </Box>
      <Box sx={{ flex: 1 }}>{right}</Box>
    </Box>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function UnderstandTokensContent() {
  const { isMcpBetaUser } = useAuthContext();

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 4, width: "100%" }}>
      <Stack spacing={4}>
        {/* Breadcrumb + Hero */}
        <Stack spacing={3}>
          <Breadcrumb current="Understand Tokens" />
          <PageHeader
            title="Understand Tokens"
            subtitle="How the token system works, the two-layer structure, and how Claude uses tokens during generation."
          />
        </Stack>

        {/* What tokens are */}
        <Box>
          <SectionHeading title="What tokens are and why they matter?" />
          <Typography
            sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
          >
            Design tokens are the atomic values of your design system, colors,
            spacing, typography, border radii, shadows — expressed as named CSS
            custom properties. Instead of writing color:{" "}
            <Box
              component="code"
              sx={{
                fontFamily: "'Roboto Mono', Consolas, monospace",
                color: "text.primary",
              }}
            >
              #0062C1
            </Box>
            , you write color:{" "}
            <Box
              component="code"
              sx={{
                fontFamily: "'Roboto Mono', Consolas, monospace",
                color: "text.primary",
              }}
            >
              var(--primary-600)
            </Box>
            . The name carries meaning. The value can change system-wide by
            changing one definition
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              color: "#53585c",
              lineHeight: "24px",
              mt: 0.75,
            }}
          >
            {
              "BrandSync's token system is defined in the brandsync-tokens package and follows a two-layer structure: primitives and semantic tokens."
            }
          </Typography>
        </Box>

        <Divider />

        {/* The Token Architecture */}
        <Box>
          <SectionHeading title="The Token Architecture" />
          <Typography
            sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
          >
            Tokens are organized in three layers. Primitives define raw values.
            Semantics describe intent and purpose. Components apply tokens to
            create cohesive UI patterns.
          </Typography>
        </Box>

        {/* Layer 1 — Primitive */}
        <Stack spacing={3}>
          <Box>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 700,
                lineHeight: "36px",
                color: "text.primary",
                mb: 0.5,
              }}
            >
              Layer 1 - Primitive
            </Typography>
            <Typography
              sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
            >
              Primitives are raw values with no usage intent attached. They form
              the palette.
            </Typography>
          </Box>
          <CodeBlock title="Primitive tokens">{`--primary-600: #0062C1;
--neutral-200: #C2C7D3;
--spacing-300: 24px;
--border-radius-200: 16px;`}</CodeBlock>
        </Stack>

        {/* Layer 2 — Secondary */}
        <Stack spacing={3}>
          <Box>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 700,
                lineHeight: "36px",
                color: "text.primary",
                mb: 0.5,
              }}
            >
              Layer 2 - Secondary
            </Typography>
            <Typography
              sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
            >
              Primitives are raw values with no usage intent attached. They form
              the palette.
            </Typography>
          </Box>
          <CodeBlock title="Secondary tokens">{`--color-primary-default:    var(--primary-600);
--surface-base:             var(--static-white);
--text-secondary:           var(--neutral-600);
--border-neutral-container: var(--neutral-200);`}</CodeBlock>
        </Stack>

        {/* Layer 3 — Components */}
        <Stack spacing={3}>
          <Box>
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 700,
                lineHeight: "36px",
                color: "text.primary",
                mb: 0.5,
              }}
            >
              Layer 3 - Components
            </Typography>
            <Typography
              sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
            >
              Primitives are raw values with no usage intent attached. They form
              the palette.
            </Typography>
          </Box>
          <CodeBlock title="Components tokens">{`--text-primary-color: var(--color-primary-default)
--border-primary-color: var(--color-border-primary)
--bg-default-color: var(--color-surface-raised)
--button-color: var(--color-primary-default)`}</CodeBlock>
        </Stack>

        <Divider />

        {/* How Claude uses tokens */}
        <Stack spacing={3}>
          <Box>
            <SectionHeading title="How Claude uses tokens" />
            <Typography
              sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
            >
              When you ask Claude to build a component,{" "}
              <Box
                component="code"
                sx={{
                  fontFamily: "'Roboto Mono', Consolas, monospace",
                  color: "#0066ae",
                }}
              >
                get_tokens
              </Box>{" "}
              is called first. Claude receives the full resolved token set —
              every name and its computed value. From that point, Claude
              generates output that only references tokens by name. It cannot
              invent a token that doesn&apos;t exist.
            </Typography>
          </Box>
          <CodeBlock title="What Claude produces">{`.card {
  background: var(--surface-raised);
  border: 1px solid var(--border-neutral-container);
  border-radius: var(--border-radius-200);
  padding: var(--spacing-300);
  box-shadow: var(--elevation-1);
}`}</CodeBlock>
        </Stack>

        {/* Beta CTA */}
        <BetaCtaBanner
          title="Get token-accurate output in your project"
          description="Join the beta and start generating components that reference your actual design tokens not invented values."
          show={!isMcpBetaUser}
        />

        {/* Design System as Executable Context */}
        <Box>
          <SectionHeading title="Design System as Executable Context" />
          <Typography
            sx={{ fontSize: "16px", color: "text.body", lineHeight: "24px" }}
          >
            BrandSync MCP gives Claude a complete design system schema so it
            understands how to break down and generate UI from screenshots,
            maintaining consistency automatically
          </Typography>
        </Box>

        {/* Tools table */}
        <Box sx={{ bgcolor: "#f9fafb", width: "100%" }}>
          {TOOLS.map(({ name, description }) => (
            <TableRow
              key={name}
              left={name}
              right={
                <Typography
                  sx={{
                    fontSize: "14px",
                    lineHeight: "21px",
                    color: "#53585c",
                  }}
                >
                  {description}
                </Typography>
              }
              leftMono
            />
          ))}
        </Box>

        {/* Token categories */}
        <Stack spacing={1.5}>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "36px",
              color: "#121212",
            }}
          >
            Token categories
          </Typography>
          <Box sx={{ bgcolor: "#f9fafb", width: "100%" }}>
            {TOKEN_CATEGORIES.map(({ name, values }) => (
              <TableRow
                key={name}
                left={name}
                leftMono={false}
                right={
                  <Box
                    component="pre"
                    sx={{
                      m: 0,
                      fontFamily: "'Roboto Mono', Consolas, monospace",
                      fontSize: "14px",
                      lineHeight: "19px",
                      color: "#5d6472",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {values}
                  </Box>
                }
              />
            ))}
          </Box>
        </Stack>

        <Divider />

        <PageNav
          prev={{
            href: "/mcp/getting-started/installation",
            label: "Previous",
          }}
          next={{
            href: "/mcp/getting-started/framework-support",
            label: "Next: Framework Support",
          }}
        />
      </Stack>
    </Box>
  );
}

const TOOLS = [
  {
    name: "get_tokens",
    description:
      "Streams the live token set from brandsync-tokens. Filter by category (color, spacing, typography).",
  },
  {
    name: "get_component",
    description:
      "Returns the full spec for any component — anatomy, states, variants, usage rules, accessibility, and token references.",
  },
  {
    name: "list_components",
    description: "Lists all available components by name.",
  },
  {
    name: "search_guidelines",
    description:
      "Searches foundation articles (color, typography, layout, accessibility) by keyword.",
  },
];

const TOKEN_CATEGORIES = [
  {
    name: "Colors",
    values:
      "--color-primary-* (brand blue, CTAs)\n--color-neutral-* (borders, backgrounds)\n--color-success/warning/error/info-* (feedback states)",
  },
  {
    name: "Text",
    values:
      "--text-default (body copy)\n--text-secondary (labels)\n--text-muted (placeholders)\n--text-action (links)\n--text-inverse (text on dark backgrounds)",
  },
  {
    name: "Surface",
    values:
      "--surface-base (page bg)\n--surface-raised (cards)\n--surface-container (inset tinted)\n--surface-action (filled buttons)",
  },
  {
    name: "Border",
    values:
      "--border-neutral-container (card/input borders)\n--border-primary (focus rings, active indicators)",
  },
  {
    name: "Spacing",
    values:
      "--spacing-50 (2px) through --spacing-1500 (120px)\nConsistent scale used for all padding, margins, gaps",
  },
  {
    name: "Typography",
    values:
      "--font-size-xs through --font-size-6xl\n--font-weight-regular through --font-weight-bold\n--line-height-tight through --line-height-loose",
  },
  {
    name: "Elevation / Shadow",
    values:
      "--elevation-0 through --elevation-6\nFrom flat to full-screen overlay depth",
  },
];
