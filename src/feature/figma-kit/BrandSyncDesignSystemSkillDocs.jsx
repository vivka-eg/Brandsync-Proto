"use client";

import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableContainer,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
} from "@mui/material";
import { Robot, Copy, Check } from "phosphor-react";
import { motion } from "framer-motion";
import HeroAgentSkillVisual from "./components/HeroAgentSkillVisual";

const MotionBox = motion(Box);

// ---------------------------------------------------------------------------
// Helpers (aligned with BrandSyncStudioDocs)
// ---------------------------------------------------------------------------

function CodeBlock({ children }) {
  return (
    <Box
      component="pre"
      sx={{
        bgcolor: "#1E1E2E",
        color: "#CDD6F4",
        p: 2.5,
        borderRadius: "8px",
        overflow: "auto",
        fontSize: "13px",
        lineHeight: 1.7,
        fontFamily: "'Roboto Mono', monospace",
        border: "1px solid",
        borderColor: "divider",
        my: 1,
      }}
    >
      <Box component="code">{children}</Box>
    </Box>
  );
}

function CodeBlockWithCopy({ children }) {
  const [copied, setCopied] = useState(false);
  const text = typeof children === "string" ? children : String(children);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 0,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "8px",
        bgcolor: "#1E1E2E",
        overflow: "hidden",
        my: 1,
      }}
    >
      <Box
        component="pre"
        sx={{
          flex: 1,
          color: "#CDD6F4",
          p: 2.5,
          m: 0,
          fontSize: "13px",
          lineHeight: 1.7,
          fontFamily: "'Roboto Mono', monospace",
          overflow: "auto",
        }}
      >
        <Box component="code">{children}</Box>
      </Box>
      <Tooltip title={copied ? "Copied!" : "Copy"} arrow placement="left">
        <IconButton
          onClick={handleCopy}
          size="small"
          sx={{
            alignSelf: "stretch",
            borderRadius: 0,
            color: copied ? "success.main" : "#CDD6F4",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.08)",
              color: copied ? "success.main" : "#E4E4E7",
            },
          }}
          aria-label={copied ? "Copied" : "Copy"}
        >
          {copied ? <Check size={18} weight="bold" /> : <Copy size={18} weight="regular" />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function SectionHeading({ children }) {
  return (
    <Typography
      variant="h2"
      fontWeight={700}
      color="text.primary"
      sx={{ fontSize: { xs: "2rem", md: "2.5rem" }, mt: 5, mb: 2 }}
    >
      {children}
    </Typography>
  );
}

function SubHeading({ children }) {
  return (
    <Typography
      variant="h5"
      fontWeight={700}
      color="text.primary"
      sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" }, mt: 3, mb: 1.5 }}
    >
      {children}
    </Typography>
  );
}

function Paragraph({ children, ...props }) {
  return (
    <Typography
      variant="body1"
      color="text.secondary"
      sx={{ lineHeight: 1.7, fontSize: "1.1rem", mb: 1.5 }}
      {...props}
    >
      {children}
    </Typography>
  );
}

function DocTable({ headers, rows }) {
  return (
    <TableContainer
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: "8px",
        overflow: "hidden",
        my: 2,
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: "action.hover" }}>
            {headers.map((h, i) => (
              <TableCell
                key={i}
                sx={{ fontWeight: 700, fontSize: "14px", py: 1.5 }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {row.map((cell, j) => (
                <TableCell key={j} sx={{ fontSize: "14px", py: 1.5 }}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function PromptTemplate({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      setCopied(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "8px",
        bgcolor: "#1E1E2E",
        overflow: "hidden",
        my: 1,
      }}
    >
      <Box
        component="pre"
        sx={{
          flex: 1,
          color: "#CDD6F4",
          p: 2,
          m: 0,
          fontSize: "13px",
          lineHeight: 1.6,
          fontFamily: "'Roboto Mono', monospace",
          overflow: "auto",
        }}
      >
        <Box component="code" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {text}
        </Box>
      </Box>
      <Tooltip title={copied ? "Copied!" : "Copy prompt"} arrow placement="left">
        <IconButton
          onClick={handleCopy}
          size="small"
          sx={{
            alignSelf: "stretch",
            borderRadius: 0,
            color: copied ? "success.main" : "#CDD6F4",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.08)",
              color: copied ? "success.main" : "#E4E4E7",
            },
          }}
          aria-label={copied ? "Copied" : "Copy prompt"}
        >
          {copied ? <Check size={18} weight="bold" /> : <Copy size={18} weight="regular" />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}

function CategorySection({ description, prompts }) {
  return (
    <Box sx={{ pt: 2 }}>
      {description && <Paragraph>{description}</Paragraph>}
      <Stack spacing={0}>
        {prompts.map((prompt, i) => (
          <PromptTemplate key={i} text={prompt} />
        ))}
      </Stack>
    </Box>
  );
}

const PROMPT_CATEGORIES = [
  {
    id: "general",
    label: "General",
    description:
      "Broad questions about BrandSync foundations, typography, and layout.",
    prompts: [
      "What does the BrandSync design system include? List colors, typography, spacing, and grid.",
      "What are the BrandSync typography scale and breakpoints for desktop, tablet, and mobile?",
      "Give me the grid specs: column counts, margins, and gutters for each breakpoint.",
      "What are the BrandSync logo placement rules for nav headers and drawers (logomark size, padding, background)?",
    ],
  },
  {
    id: "development",
    label: "Development",
    description:
      "Token exports, implementation-ready code, and prompts to align new or existing pages with BrandSync (layout, grid, spacing, components).",
    prompts: [
      "Export BrandSync design tokens for the teal palette as CSS custom properties.",
      "Give me all BrandSync tokens (colors, spacing, typography, elevation) as a JSON file. Use the purple palette.",
      "Generate SCSS variables for the cobalt brand palette and the 8px spacing scale.",
      "Create a primary button component using BrandSync semantic tokens and the 8px spacing scale.",
      "I'm building a new dashboard page. How should I structure the layout using BrandSync grid, spacing, and breakpoints?",
      "I'm creating a form page. Give me a layout that uses BrandSync spacing tokens, typography scale, and semantic colors for inputs and buttons.",
      "Refactor this page to use BrandSync design tokens: replace hardcoded colors, spacing, and font sizes with the correct token names.",
      "What BrandSync spacing and typography tokens should I use for a content page with a hero, sections, and a CTA block?",
      "How do I align an existing React page with BrandSync? List the token categories to swap in (colors, spacing, radius, elevation) and the order to apply them.",
    ],
  },
  {
    id: "design",
    label: "Design & tokens",
    description:
      "Semantic tokens, theming, and palette-specific token names.",
    prompts: [
      "List the semantic token names for buttons (default, hover, focused, pressed) in BrandSync light and dark mode.",
      "What are the container and container-hover tokens for surfaces in the jade palette?",
      "What elevation (shadow) levels does BrandSync define? Give me the token names and use cases.",
    ],
  },
  {
    id: "accessibility",
    label: "Accessibility",
    description:
      "WCAG-compliant color pairs and accessible semantic combinations.",
    prompts: [
      "What foreground/background color pairs from the purple palette meet WCAG AA for body text?",
      "Recommend accessible semantic colors for a primary button (default, hover, focused) in light and dark mode.",
      "Which BrandSync neutral shades pass WCAG AAA for small text on white?",
    ],
  },
];

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

const BRAND_COLORS =
  "purple, cobalt, blue, steel, teal, jade, green, lime, yellow, amber, orange, magenta, maroon, violet";

export default function BrandSyncDesignSystemSkillDocs() {
  const [promptTab, setPromptTab] = useState(0);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        p: 1,
        bgcolor: "background.default",
        pb: "130px",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          bgcolor: "white",
          mb: 6,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            py: { xs: 6, md: 8 },
            px: { xs: 3, md: 6 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 6, md: 8 },
          }}
        >
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            sx={{
              flex: 1,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "#F5F5F5",
                borderRadius: "20px",
                px: 2,
                py: 0.75,
                mb: 3,
              }}
            >
              <Robot size={14} weight="bold" />
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "text.secondary",
                  letterSpacing: "0.05em",
                }}
              >
                AGENT SKILL
              </Typography>
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontSize: {
                  xs: "2.5rem",
                  sm: "3rem",
                  md: "3.5rem",
                  lg: "4rem",
                },
                fontWeight: 800,
                mb: 2,
                background:
                  "linear-gradient(135deg, #000000 0%, #424242 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.2,
              }}
            >
               BrandSync System Skill
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                color: "text.secondary",
                mb: 4,
                lineHeight: 1.7,
                fontWeight: 400,
                maxWidth: 600,
              }}
            >
              Give your AI coding assistant full knowledge of the EG BrandSync
              design system, including colors, typography, spacing, tokens, and
              accessibility, so it can generate pixel-perfect, on-brand code.
            </Typography>
            <Button
              component="a"
              href="#how-to-install"
              variant="contained"
              size="large"
              sx={{
                px: 3,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: 2,
                textTransform: "none",
                background: "linear-gradient(135deg, #424242 0%, #1a1a1a 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              Get the skills
            </Button>
          </MotionBox>

          <HeroAgentSkillVisual />
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ px: { xs: 3, md: 6 } }}>
        <SectionHeading>What is it?</SectionHeading>
        <Paragraph>
          The <strong>brandsync-design-system</strong> skill is a Claude Code
          agent skill that gives AI assistants (e.g. in Cursor or Claude Code)
          full knowledge of the EG BrandSync design foundations. When the skill
          is active, the agent can answer questions about colors, typography,
          spacing, grid, accessibility, and token structure, and generate
          correct design token exports (CSS, SCSS, JSON, JS) aligned with
          BrandSync.
        </Paragraph>
        <Paragraph>
          It is <strong>reference-only</strong>: Markdown-based documentation
          installed via <code>npx skills add</code>. No executable code, no
          build, no tests.
        </Paragraph>

        <SectionHeading>What the skill does</SectionHeading>
        <DocTable
          headers={["Area", "What the skill provides"]}
          rows={[
            [
              "Color",
              "14 brand palettes (purple, cobalt, blue, steel, teal, jade, green, lime, yellow, amber, orange, magenta, maroon, violet), each with a full shade scale (50–950). One neutral scale (13 shades). Four semantic colors: success, error, warning, information.",
            ],
            [
              "Semantic tokens",
              "Three-layer token hierarchy: primitive (raw hex) → semantic (default, hover, focused, pressed, container, container-hover) → component. Light and dark mode mappings so the agent can suggest themeable, accessible combinations.",
            ],
            [
              "Typography",
              "Roboto font family and responsive type scales for desktop, tablet, and mobile viewports (display, heading, body, caption).",
            ],
            [
              "Spacing & radius",
              "8px base unit, 25 spacing tokens (-600 to 1500), 8 border-radius tokens (0 to full).",
            ],
            [
              "Grid & layout",
              "Three breakpoints: mobile (4-col), tablet (8-col), desktop (12-col), with margins and gutters.",
            ],
            [
              "Elevation",
              "Seven shadow levels: none, level 1–5, and inner.",
            ],
            [
              "Logo placement",
              "Rules for sizing and positioning logos in navigation headers, drawers, and splash screens (logomark vs full logo, 44×44 / 64×64 boxes, spacing, background treatment).",
            ],
            [
              "Accessibility",
              "Pre-computed WCAG AA/AAA contrast data for all color shades so the agent can recommend accessible foreground/background pairs.",
            ],
          ]}
        />
        <Paragraph>
          The agent can <strong>export</strong> tokens in:
        </Paragraph>
        <Stack component="ul" sx={{ pl: 3, my: 1.5, "& ul": { my: 0.5 } }}>
          <li>
            <Typography component="span" color="text.secondary">
              CSS custom properties
            </Typography>
          </li>
          <li>
            <Typography component="span" color="text.secondary">
              SCSS variables
            </Typography>
          </li>
          <li>
            <Typography component="span" color="text.secondary">
              JSON
            </Typography>
          </li>
          <li>
            <Typography component="span" color="text.secondary">
              JavaScript
            </Typography>
          </li>
        </Stack>

        <SectionHeading>When to use it</SectionHeading>
        <Paragraph>
          Use the skill when you or your team:
        </Paragraph>
        <Stack component="ul" sx={{ pl: 3, my: 1.5 }}>
          <li>
            <Typography component="span" color="text.secondary">
              Build or refactor UI components that should follow BrandSync.
            </Typography>
          </li>
          <li>
            <Typography component="span" color="text.secondary">
              Need the correct design tokens (colors, spacing, typography,
              elevation) for a given brand color.
            </Typography>
          </li>
          <li>
            <Typography component="span" color="text.secondary">
              Implement themes, dark mode, or semantic color usage.
            </Typography>
          </li>
          <li>
            <Typography component="span" color="text.secondary">
              Want WCAG-compliant color combinations and semantic token
              mappings.
            </Typography>
          </li>
          <li>
            <Typography component="span" color="text.secondary">
              Need logo placement rules for nav headers, drawers, or splash
              screens.
            </Typography>
          </li>
          <li>
            <Typography component="span" color="text.secondary">
              Generate design token files (CSS/SCSS/JSON/JS) for a product.
            </Typography>
          </li>
        </Stack>

        <Box component="section" id="how-to-install" sx={{ scrollMarginTop: 24 }}>
          <SectionHeading>How to install</SectionHeading>
        </Box>
        <Paragraph>
          From a project that uses{" "}
          <Typography
            component="a"
            href="https://github.com/anthropics/skills-cli"
            target="_blank"
            rel="noopener noreferrer"
            color="primary.main"
            sx={{ textDecoration: "underline" }}
          >
            Claude Code agent skills
          </Typography>{" "}
          (or compatible tooling):
        </Paragraph>
        <CodeBlockWithCopy>{`npx skills add EG-A-S/EG-brandSync-agent-skills-foundations --skill brandsync-design-system`}</CodeBlockWithCopy>
        <Paragraph sx={{ fontStyle: "italic", color: "text.secondary" }}>
          (Replace with your actual org/repo and package name if different.)
        </Paragraph>

        <SectionHeading>Example prompts & commands</SectionHeading>
        <Paragraph>
          Use these in your AI assistant (Cursor, Claude Code, etc.) when the
          skill is active. Click <strong>Copy</strong> to paste into the chat.
          Swap brand color or format as needed.
        </Paragraph>

        <Tabs
          value={promptTab}
          onChange={(_, v) => setPromptTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            mb: 0,
            "& .MuiTab-root": { fontWeight: 600, textTransform: "none", fontSize: "1rem", minHeight: 48 },
            "& .Mui-selected": { color: "primary.main" },
          }}
        >
          {PROMPT_CATEGORIES.map((cat, i) => (
            <Tab key={cat.id} label={cat.label} id={`prompt-tab-${i}`} aria-controls={`prompt-tabpanel-${i}`} />
          ))}
        </Tabs>
        {PROMPT_CATEGORIES.map((cat, i) => (
          <Box
            key={cat.id}
            role="tabpanel"
            id={`prompt-tabpanel-${i}`}
            aria-labelledby={`prompt-tab-${i}`}
            hidden={promptTab !== i}
            sx={{ minHeight: 200 }}
          >
            {promptTab === i && (
              <CategorySection description={cat.description} prompts={cat.prompts} />
            )}
          </Box>
        ))}

        <SectionHeading>Parameterized by brand color</SectionHeading>
        <Paragraph>
          The skill can be scoped to a single brand palette by passing a color
          name as the skill argument. The agent will then use only that palette
          for examples and exports.
        </Paragraph>
        <Paragraph>
          <strong>Available brand colors:</strong>
          <br />
          <Box
            component="code"
            sx={{
              display: "inline-block",
              mt: 0.5,
              px: 1,
              py: 0.5,
              bgcolor: "action.hover",
              borderRadius: 1,
              fontSize: "0.9rem",
            }}
          >
            {BRAND_COLORS}
          </Box>
        </Paragraph>
        <Paragraph>
          If no color is provided, the agent may default to <strong>purple</strong> or
          ask which brand color to use.
        </Paragraph>

        <SectionHeading>Summary</SectionHeading>
        <DocTable
          headers={["", ""]}
          rows={[
            ["Skill name", "brandsync-design-system"],
            [
              "Purpose",
              "Give AI agents full BrandSync design system knowledge (tokens, typography, grid, elevation, logo, accessibility).",
            ],
            [
              "Outputs",
              "Correct token values, semantic mappings, and exports in CSS, SCSS, JSON, or JS.",
            ],
            [
              "Audience",
              "Developers and designers building EG products with AI-assisted coding.",
            ],
          ]}
        />
        <Paragraph>
          Install the skill, pick your brand color, and let your AI assistant
          handle the rest: consistent, accessible, on-brand code every time.
        </Paragraph>
      </Box>
    </Box>
  );
}