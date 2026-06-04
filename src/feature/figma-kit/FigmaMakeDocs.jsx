"use client";

import React, { useState, useMemo } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
} from "@mui/material";
import { FigmaLogo, Sparkle, ArrowRight, Copy, Check } from "phosphor-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";
import colorPalettesInput from "brandsync-tokens/themebuilder.json";

const orbit = keyframes`
  from { transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg); }
`;

const MotionBox = motion(Box);

// ---------------------------------------------------------------------------
// Helpers
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

// 14 BrandSync brand palettes (matches design-system/accessible-palettes)
const BRAND_PALETTE_NAMES = [
  "purple", "cobalt", "blue", "steel", "teal", "jade", "green", "lime",
  "yellow", "amber", "orange", "magenta", "maroon", "violet",
];

const SHADE_KEYS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

const LAYOUT_PROMPTS = [
  { id: "", name: "None" },
  {
    id: "navigation-header",
    name: "Navigation Header",
    specHref: "/design-system/components/Navigation Header?single=1",
    prompt:
      "Build a BrandSync Navigation Header: app bar with logo area (left), primary nav links, and action area (right). Use BrandSync semantic tokens for background and text, 8px spacing scale, and the design system typography. Responsive: collapse to a menu on small breakpoints. Match the BrandSync Navigation Header spec.",
  },
  {
    id: "navigation-drawer",
    name: "Navigation Drawer",
    specHref: "/design-system/components/Navigation Drawer",
    prompt:
      "Build a BrandSync Navigation Drawer: side drawer with logo area at top, nav links/list items, and optional footer. Use BrandSync semantic tokens for surface and text, 8px spacing scale, and the design system typography. Support collapsed (icon-only) and expanded states. Match the BrandSync Navigation Drawer spec.",
  },
];

function PromptGeneratorBlock({ promptText, onCopy, copied }) {
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
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        <Box component="code">{promptText}</Box>
      </Box>
      <Tooltip title={copied ? "Copied!" : "Copy prompt"} arrow placement="left">
        <IconButton
          onClick={onCopy}
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

const LAYOUT_OPTIONS = LAYOUT_PROMPTS.filter((item) => item.id && item.prompt);

function FigmaMakePromptGenerator() {
  const [tab, setTab] = useState(0);
  const [palette, setPalette] = useState("purple");
  const [copiedTab, setCopiedTab] = useState(null);
  const [copiedLayoutId, setCopiedLayoutId] = useState(null);

  const shades = useMemo(() => {
    const data = colorPalettesInput[palette];
    if (!data?.shades) return {};
    return data.shades;
  }, [palette]);

  const fullPromptText = useMemo(() => {
    const label = palette.charAt(0).toUpperCase() + palette.slice(1);
    const paletteData = colorPalettesInput[palette];
    const shadeList = SHADE_KEYS.filter((k) => paletteData?.shades?.[k])
      .map((k) => `${k}: ${paletteData.shades[k]}`)
      .join(", ");
    const hex600 = paletteData?.shades?.["600"] || "";
    const colorLine = hex600
      ? `Use the BrandSync ${label} palette as the brand primary. Primary (shade 600): ${hex600}. Full palette: ${shadeList}. Use shade 600 for main UI elements (e.g. primary buttons, links); use semantic tokens (primary, container, container-hover, surface) for light and dark mode.`
      : `Use the BrandSync ${label} palette as the brand primary. Use semantic tokens (primary, container, container-hover, surface) for light and dark mode; use shade 600 for main UI elements (e.g. primary buttons, links).`;
    return `Use the BrandSync design system for everything in this project. That means:

• Colors: ${colorLine}

• Spacing: Apply the 8px spacing scale for padding, margins, and gaps (e.g. 8, 16, 24, 32px).

• Typography: Use the BrandSync typography scale and breakpoint-appropriate font sizes and line heights.

• Layout: Use the BrandSync grid (12 columns desktop, 8 tablet, 4 mobile) with the defined margins and gutters per breakpoint.

• Components: Use border-radius, elevation (shadows), and semantic colors from the design system for buttons, inputs, cards, and surfaces. Keep contrast and accessibility (WCAG AA) in mind.

• Navigation: Include a BrandSync Navigation Header: app bar with logo area (left), primary nav links, and action area (right). Use BrandSync semantic tokens for background and text, 8px spacing scale, and design system typography. Responsive: collapse to a menu on small breakpoints. Match the BrandSync Navigation Header spec.

Now build the following:`;
  }, [palette]);

  const handleCopyFull = async () => {
    if (!fullPromptText) return;
    try {
      await navigator.clipboard.writeText(fullPromptText);
      setCopiedTab(0);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch {
      setCopiedTab(null);
    }
  };

  const handleCopyLayout = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLayoutId(id);
      setTimeout(() => setCopiedLayoutId(null), 2000);
    } catch {
      setCopiedLayoutId(null);
    }
  };

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 3,
        bgcolor: "background.paper",
        my: 2,
      }}
    >
      <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ mb: 1 }}>
        Prompt generator
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 2, minHeight: 40, "& .MuiTab-root": { minHeight: 40, py: 0 } }}
      >
        <Tab label="Full design system" id="gen-tab-0" aria-controls="gen-panel-0" />
        <Tab label="Layout / component" id="gen-tab-1" aria-controls="gen-panel-1" />
        <Tab label="Specifics" id="gen-tab-2" aria-controls="gen-panel-2" />
        <Tab label="Logo" id="gen-tab-3" aria-controls="gen-panel-3" />
      </Tabs>

      {tab === 0 && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
            Pick a palette and copy the prompt below. Paste it into Figma Make first, then add what you want to build (e.g. a login form or settings page).
          </Typography>
          <FormControl size="small" sx={{ minWidth: 160, mb: 2, display: "block" }}>
            <InputLabel id="combined-palette-label">Palette</InputLabel>
            <Select
              labelId="combined-palette-label"
              value={palette}
              label="Palette"
              onChange={(e) => setPalette(e.target.value)}
            >
              {BRAND_PALETTE_NAMES.map((name) => (
                <MenuItem key={name} value={name}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
            Shades (base 600 is used in prompts)
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {SHADE_KEYS.filter((k) => shades[k]).map((s) => (
              <Tooltip key={s} title={`${s}: ${shades[s]}`} arrow>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1,
                    bgcolor: shades[s],
                    border: 2,
                    borderColor: s === "600" ? "primary.main" : "transparent",
                    boxShadow: s === "600" ? 1 : 0,
                  }}
                  aria-hidden
                />
              </Tooltip>
            ))}
          </Box>
          <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
            Generated prompt (add what you want to build after pasting)
          </Typography>
          <PromptGeneratorBlock promptText={fullPromptText} onCopy={handleCopyFull} copied={copiedTab === 0} />
        </Box>
      )}

      {tab === 1 && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Copy a layout or menu prompt below and paste it in Figma Make to generate a Navigation Header, Navigation Drawer, or similar.
          </Typography>
          <Stack spacing={3}>
            {LAYOUT_OPTIONS.map(({ id, name, specHref, prompt }) => (
              <Box key={id}>
                <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
                  <Link href={specHref} style={{ fontWeight: 600, color: "inherit" }}>
                    {name}
                  </Link>
                  {" - "}
                  <Typography component="span" variant="body2" color="text.secondary" fontWeight={400}>
                    spec
                  </Typography>
                </Typography>
                <PromptGeneratorBlock
                  promptText={prompt}
                  onCopy={() => handleCopyLayout(prompt, id)}
                  copied={copiedLayoutId === id}
                />
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {tab === 2 && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Specifics that target elements on the page: example directions and what to include in your Figma Make prompts.
          </Typography>
          <SubHeading>Example prompts</SubHeading>
          <CodeBlock>{`"Create a primary button using BrandSync: semantic tokens for default, hover, and focus; 8px spacing scale; border-radius from the design system."`}</CodeBlock>
          <CodeBlock>{`"Build a dashboard layout with BrandSync grid: 12 columns desktop, 8 tablet, 4 mobile; use spacing tokens and typography scale from the design system."`}</CodeBlock>
          <CodeBlock>{`"Generate a form section with BrandSync semantic colors for inputs and labels, spacing tokens between fields, and a submit button using primary semantic tokens."`}</CodeBlock>
          <CodeBlock>{`"Refactor this component to use BrandSync design tokens: replace hardcoded colors and spacing with semantic token names and the 8px spacing scale."`}</CodeBlock>
          <SubHeading>What to include in prompts</SubHeading>
          <DocTable
            headers={["Aspect", "What to say"]}
            rows={[
              ["Colors", "Reference a palette (e.g. purple, teal) and semantic roles (primary, container, surface)."],
              ["Spacing", "Mention the 8px spacing scale and token-based padding/margins."],
              ["Typography", "Ask for BrandSync typography scale and breakpoint-appropriate sizes."],
              ["Layout", "Specify grid columns, margins, and gutters per breakpoint from BrandSync."],
            ]}
          />
        </Box>
      )}

      {tab === 3 && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add your product logo to generated UIs (e.g. Navigation Header or drawer).
          </Typography>
          <SubHeading>Adding your product logo</SubHeading>
          <Paragraph>
            To use your own product logo in Figma Make (e.g. in a Navigation Header or drawer):
          </Paragraph>
          <Stack component="ol" sx={{ pl: 2.5, my: 2, "& li": { mb: 1 } }}>
            <Typography component="li" color="text.secondary" sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
              Download your logo pack from{" "}
              <Link href="/logos" style={{ fontWeight: 600, color: "inherit" }}>
                Logos
              </Link>.
            </Typography>
            <Typography component="li" color="text.secondary" sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
              Unzip the downloaded file.
            </Typography>
            <Typography component="li" color="text.secondary" sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
              Use the <strong>horizontal</strong> logo in <strong>.png</strong> format from the pack.
            </Typography>
            <Typography component="li" color="text.secondary" sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
              Add that .png as a file in Figma Make so the generated UI can reference it (e.g. for the header or drawer logo).
            </Typography>
          </Stack>
          <Paragraph>
            Then in your prompt you can say e.g. “use the uploaded logo image in the Navigation Header” or “place the logo in the drawer header.”
          </Paragraph>
        </Box>
      )}
    </Box>
  );
}

function LayoutComponentPrompts() {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <Stack spacing={3} sx={{ mt: 2, mb: 3 }}>
      {LAYOUT_OPTIONS.map(({ id, name, specHref, prompt }) => (
        <Box key={id}>
          <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
            <Link href={specHref} style={{ fontWeight: 600, color: "inherit" }}>
              {name}
            </Link>
            {" - "}
            <Typography component="span" variant="body2" color="text.secondary" fontWeight={400}>
              spec
            </Typography>
          </Typography>
          <PromptGeneratorBlock
            promptText={prompt}
            onCopy={() => handleCopy(prompt, id)}
            copied={copiedId === id}
          />
        </Box>
      ))}
      <Typography variant="body2" color="text.secondary">
        More components:{" "}
        <Link href="/design-system/components" style={{ fontWeight: 600, color: "inherit" }}>
          Design system → Components
        </Link>
      </Typography>
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function FigmaMakeDocs() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
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
              <Sparkle size={14} weight="bold" />
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "text.secondary",
                  letterSpacing: "0.05em",
                }}
              >
                FIGMA MAKE
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
              Figma Make
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
              Use Figma&apos;s AI-powered prompt-to-code tool with the BrandSync
              design system in Figma. Keep generated UIs on-brand with our 14
              palettes, semantic tokens, 8px spacing scale, typography, and
              grid.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <Button
                component={Link}
                href="https://www.figma.com/make"
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                size="large"
                startIcon={<FigmaLogo size={20} weight="bold" />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                  background:
                    "linear-gradient(135deg, #424242 0%, #1a1a1a 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                Open Figma Make
              </Button>
              <Button
                component={Link}
                href="/theme-builder"
                variant="outlined"
                size="large"
                endIcon={<ArrowRight size={20} weight="bold" />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Theme builder
              </Button>
            </Box>
          </MotionBox>

          {/* Right Side - Three logos */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 3, md: 4 },
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: { xs: 200, md: 260 },
                height: { xs: 200, md: 260 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Orbiting dots */}
              {[
                { color: "#000000", size: 8, duration: "8s", delay: "0s" },
                { color: "#ffffff", size: 6, duration: "10s", delay: "-3s" },
                { color: "#000000", size: 7, duration: "12s", delay: "-6s" },
                { color: "#ffffff", size: 5, duration: "9s", delay: "-2s" },
                { color: "#000000", size: 6, duration: "11s", delay: "-5s" },
              ].map((dot, i) => (
                <Box
                  key={i}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: dot.size,
                    height: dot.size,
                    borderRadius: "50%",
                    bgcolor: dot.color,
                    marginTop: `-${dot.size / 2}px`,
                    marginLeft: `-${dot.size / 2}px`,
                    "--orbit-radius": { xs: "100px", md: "130px" },
                    animation: `${orbit} ${dot.duration} linear infinite`,
                    animationDelay: dot.delay,
                    opacity: 0.7,
                  }}
                />
              ))}

              {/* Logo */}
              <Box
                component="img"
                src="/figma-kit/make.png"
                alt="Figma Make"
                sx={{
                  height: { xs: 180, md: 240 },
                  objectFit: "contain",
                  borderRadius: "50%",
                  border: "2px solid",
                  borderColor: "divider",
                  p: "10px",
                }}
              />
            </Box>
          </MotionBox>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ px: { xs: 3, md: 6 }, width: "100%" }}>
        <SectionHeading>Prompt generator</SectionHeading>
        <Paragraph>
          For colour and layout in Figma Make, use the BrandSync design system.
          Go to{" "}
          <Link
            href="/design-system/accessible-palettes"
            style={{ fontWeight: 600, color: "inherit" }}
          >
            Accessible Palettes
          </Link>{" "}
          to see all 14 brand palettes and copy hex values. Or use the generator
          below: choose a palette and copy the generated prompt (with hex codes) into Figma Make, then add what you want to build.
        </Paragraph>
        <FigmaMakePromptGenerator />

        <SectionHeading>Best practices</SectionHeading>
        <Stack spacing={1.5} sx={{ my: 2 }}>
          <Paragraph>
            <strong>Paste the prompt first, then say what to build.</strong> Use the generator above: copy the full prompt (it already includes your palette and hex values), paste it into Figma Make, then add e.g. “a login form” or “a settings page”. Starting with “use the design system” and no token/hex context gives worse results.
          </Paragraph>
          <Paragraph>
            <strong>One palette per prompt.</strong> The prompt is tied to the palette you picked. Need a different brand colour? Change the palette in the generator, copy the new prompt, and paste that into Figma Make instead.
          </Paragraph>
          <Paragraph>
            <strong>Refine in chat with concrete asks.</strong> After the first generation, ask for specific changes: “use 8px spacing between these sections”, “primary button should use shade 600”, “12 columns, 24px gutter”. Naming tokens and values works better than “make it more on-brand”.
          </Paragraph>
          <Paragraph>
            <strong>Design in Figma, code in Make.</strong> Designs live in Figma with the BrandSync Studio plugin (same palettes, grid, tokens). Figma Make spits out React/TSX. Using the generator prompt keeps the output aligned with what design already has so you’re not reverse‑engineering from screenshots.
          </Paragraph>
        </Stack>

        <SectionHeading>Prompting tips</SectionHeading>
        <Paragraph>
          The generated prompt above gives Figma Make the BrandSync tokens and palette data it needs.
          These tips help you get better results from the second half of that prompt, the part
          where you describe <em>what</em> to build.
        </Paragraph>

        <SubHeading>1. Front-load your first prompt with context</SubHeading>
        <Paragraph>
          The clearer your initial prompt, the fewer follow-ups you&apos;ll need. A useful
          structure is <strong>TOKEN</strong>:
        </Paragraph>
        <DocTable
          headers={["Letter", "Meaning", "What to include"]}
          rows={[
            ["T", "Task", "What should Figma Make build? e.g. \"a settings page\" or \"an asset detail card\"."],
            ["O", "Output", "Fidelity level: wireframe, high-fidelity screen, or a single component."],
            ["K", "Key elements", "Which BrandSync components, content blocks, or navigation patterns to include."],
            ["E", "Expected behaviors", "States, transitions, and interaction logic (hover, empty state, loading)."],
            ["N", "Notable constraints", "Responsive rules, WCAG requirements, or brand guidelines to respect."],
          ]}
        />
        <Paragraph>
          <strong>Example:</strong> After pasting the generated BrandSync prompt, add:
        </Paragraph>
        <CodeBlock>{`Task:
Build a brand asset library page where users browse, filter,
and download approved logos and icons.

Output:
High-fidelity responsive screen, production-ready layout.

Key elements:
- BrandSync Navigation Header (logo left, nav links, profile action right)
- Search bar with category filter dropdown
- Asset grid: cards showing thumbnail, asset name, and download button
- Sidebar with tag filters (file type, palette, usage rights)

Expected behaviors:
- Download button uses primary (shade 600); hover shows container-hover token
- Empty state when no assets match the active filters
- Cards scale from 4-column grid (desktop) to single column (mobile)

Notable constraints:
- BrandSync 12/8/4 column grid with 8px spacing scale
- WCAG AA contrast on all interactive elements
- Support light and dark mode via semantic tokens`}</CodeBlock>

        <SubHeading>2. Break complex pages into focused follow-ups</SubHeading>
        <Paragraph>
          After the first generation, refine one thing at a time instead of cramming multiple
          changes into a single prompt. Smaller scope gives more relevant output.
        </Paragraph>
        <Paragraph>
          Use the format: <strong>Fix [element] - [how it should change]</strong>
        </Paragraph>
        <CodeBlock>{`"Fix the Navigation Header - the logo should be 32px tall and left-aligned with 24px margin"

"Fix the asset cards - use 16px padding, 8px gap, and the BrandSync border-radius token"

"Fix the filter sidebar - switch to a collapsible accordion using semantic surface tokens"`}</CodeBlock>
        <Paragraph>
          <strong>Pro tip:</strong> Attach a screenshot of the specific area you want refined.
          This is especially helpful for spacing or alignment issues that are hard to describe in words.
        </Paragraph>

        <SubHeading>3. Describe intent, not just appearance</SubHeading>
        <Paragraph>
          Figma Make produces better results when it understands <em>why</em> something exists,
          not just what it looks like. Intent-driven prompts lead to smarter layout and hierarchy
          decisions.
        </Paragraph>
        <DocTable
          headers={["Approach", "Prompt"]}
          rows={[
            [
              "Visual only",
              "\"Make the download button bigger and brighter\".",
            ],
            [
              "Intent-driven",
              "\"Emphasize the download action; users come to this page specifically to grab approved assets quickly, so it should be the most prominent interactive element on each card\".",
            ],
          ]}
        />
        <Paragraph>
          If you can&apos;t explain why an element exists, try asking Figma Make to evaluate:
          <em> &ldquo;Is the tag filter sidebar useful on this page, or would inline chip
          filters reduce clicks?&rdquo;</em>
        </Paragraph>

        <SubHeading>4. Use constraints to sharpen output</SubHeading>
        <Paragraph>
          Constraints aren&apos;t limitations &mdash; they help Figma Make avoid generic layouts and
          stay consistent with BrandSync. Reference specific tokens, scales, and rules.
        </Paragraph>
        <DocTable
          headers={["Constraint", "BrandSync example"]}
          rows={[
            ["Spacing", "8px scale: use 16px card padding, 24px section gaps"],
            ["Color", "Primary buttons use shade 600; surfaces use the semantic surface token"],
            ["Grid", "12 columns desktop (24px gutter), 8 tablet, 4 mobile"],
            ["Accessibility", "WCAG AA contrast; no color-only status indicators"],
            ["Typography", "BrandSync type scale; breakpoint-appropriate sizes"],
          ]}
        />
        <Paragraph>
          For even better results, add your brand constraints to the <strong>Guidelines.md</strong> file
          inside Figma Make (click &ldquo;Select library&rdquo; → &ldquo;Edit guidelines&rdquo;).
          This acts as a persistent reference so you don&apos;t repeat the same rules every prompt.
        </Paragraph>
        <CodeBlock>{`# BrandSync Design Guidelines

## Colors
- Use the selected BrandSync palette; shade 600 for primary actions
- Semantic tokens for surfaces, containers, and states (light + dark)

## Spacing
- 8px spacing scale for all padding, margins, and gaps
- Consistent card padding (16px) and section spacing (24px/32px)

## Typography
- BrandSync typography scale
- Breakpoint-appropriate font sizes and line heights

## Grid
- 12 columns desktop, 8 tablet, 4 mobile
- Defined margins and gutters per breakpoint

## Components
- Border-radius, elevation, and semantic colors from the design system
- Buttons, inputs, cards, and surfaces follow BrandSync specs

## Accessibility
- WCAG AA color contrast minimum
- Never rely on color alone to convey meaning`}</CodeBlock>
        <Paragraph>
          Then in future prompts just say: <em>&ldquo;Follow the BrandSync guidelines
          defined in Guidelines.md.&rdquo;</em>
        </Paragraph>

      </Box>
    </Box>
  );
}