"use client";
import React from "react";
import {
  Box,
  Stack,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableContainer,
  Button,
} from "@mui/material";
import { FigmaLogo } from "phosphor-react";
import Link from "next/link";
import { motion } from "framer-motion";

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
      sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}
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
      sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
    >
      {children}
    </Typography>
  );
}

function SubSubHeading({ children }) {
  return (
    <Typography
      variant="h6"
      fontWeight={600}
      color="text.primary"
      sx={{ fontSize: "1.25rem" }}
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
      sx={{ lineHeight: 1.7, fontSize: "1.1rem" }}
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

const STEP_COLORS = ["#6366F1", "#0EA5E9", "#F59E0B"];

function ProcessStep({ number, title, description, color, image }) {
  return (
    <Box sx={{ display: "flex", gap: 2.5, alignItems: "flex-start" }}>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          bgcolor: color,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontWeight: 700,
          fontSize: "14px",
        }}
      >
        {number}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5, lineHeight: 1.6, fontSize: "1rem" }}
        >
          {description}
        </Typography>
        {image && (
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{
              width: "100%",
              maxWidth: 420,
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
              mt: 1.5,
            }}
          />
        )}
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function BrandSyncStudioDocs() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
        pb: "130px",
      }}
    >
      {/* ----------------------------------------------------------------- */}
      {/* Hero Section */}
      {/* ----------------------------------------------------------------- */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          bgcolor: "white",
          mb: 6,
        }}
      >
        {/* Grid Background Pattern */}
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
          {/* Left Side - Text Content */}
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            sx={{
              flex: 1,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {/* Badge */}
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
              <FigmaLogo size={14} weight="bold" />
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "text.secondary",
                  letterSpacing: "0.05em",
                }}
              >
                FIGMA PLUGIN
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
              BrandSync Studio plugin
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
              Generate a complete design system inside your Figma file: color
              styles, typography, elevation shadows, layout grids, reusable
              components, and color swatch documentation, all from a curated
              set of design tokens.
            </Typography>

            {/* CTA Button */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: { xs: "center", md: "flex-start" },
                mb: 4,
              }}
            >
              <Button
                component={Link}
                href="https://www.figma.com/community/plugin/1602933425766782230/brandsync-studio"
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
                  transition: "all 0.3s ease",
                }}
              >
                Install Plugin
              </Button>
            </Box>

            {/* Stats Row */}
            <Box
              sx={{
                display: "flex",
                gap: { xs: 4, md: 6 },
                flexWrap: "wrap",
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Typography
                  sx={{
                    fontSize: { xs: "1.75rem", md: "2rem" },
                    fontWeight: 700,
                    color: "text.primary",
                    lineHeight: 1,
                  }}
                >
                  14
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  brand palettes
                </Typography>
              </Box>
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Typography
                  sx={{
                    fontSize: { xs: "1.75rem", md: "2rem" },
                    fontWeight: 700,
                    color: "text.primary",
                    lineHeight: 1,
                  }}
                >
                  WCAG
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  compliant
                </Typography>
              </Box>
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Typography
                  sx={{
                    fontSize: { xs: "1.75rem", md: "2rem" },
                    fontWeight: 700,
                    color: "text.primary",
                    lineHeight: 1,
                  }}
                >
                  Light & dark
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  semantic theme modes
                </Typography>
              </Box>
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Typography
                  sx={{
                    fontSize: { xs: "1.75rem", md: "2rem" },
                    fontWeight: 700,
                    color: "text.primary",
                    lineHeight: 1,
                  }}
                >
                  Responsive
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  Desktop, Tablet, Mobile
                </Typography>
              </Box>
            </Box>
          </MotionBox>

          {/* Right Side - Hero Image */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src="/figma-plugin/main-hero.png"
              alt="BrandSync Studio plugin"
              sx={{
                width: "100%",
                maxWidth: { xs: "280px", md: "380px" },
                height: "auto",
                borderRadius: "24px",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                border: "1px solid rgba(0, 0, 0, 0.08)",
              }}
            />
          </MotionBox>
        </Box>
      </Box>

      <Stack gap="64px" sx={{ px: { xs: 2, md: 4 } }}>
        {/* --------------------------------------------------------------- */}
        {/* Getting Started */}
        {/* --------------------------------------------------------------- */}
        <Stack gap={3}>
          <SectionHeading>Getting Started</SectionHeading>

          <Stack gap={2}>
            <SubHeading>Prerequisites</SubHeading>
            <Box component="ul" sx={{ m: 0, pl: 3, color: "text.secondary" }}>
              <li>
                <Paragraph component="span">
                  <strong>Figma</strong> (Desktop app or Web)
                </Paragraph>
              </li>
              <li>
                <Paragraph component="span">
                  <strong>Roboto font</strong> must be available in your Figma
                  file (available via Google Fonts)
                </Paragraph>
              </li>
            </Box>
          </Stack>

          <Stack gap={2}>
            <SubHeading>Install the BrandSync Studio plugin</SubHeading>
            <Paragraph>
              The BrandSync Studio plugin is available on the Figma Community. Install it
              directly from Figma:
            </Paragraph>
            <Box
              component="a"
              href="https://www.figma.com/community/plugin/1602933425766782230/brandsync-studio"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.5,
                px: 3,
                py: 1.5,
                borderRadius: "8px",
                bgcolor: "#1E1E1E",
                color: "#FFFFFF",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "15px",
                alignSelf: "flex-start",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#333333",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <FigmaLogo size={20} weight="bold" />
              Get the BrandSync Studio plugin on Figma
            </Box>
          </Stack>
        </Stack>

        {/* --------------------------------------------------------------- */}
        {/* How It Works */}
        {/* --------------------------------------------------------------- */}
        <Stack gap={3}>
          <SectionHeading>How It Works</SectionHeading>
          <Paragraph>
            Three steps: open the BrandSync Studio plugin in Figma, pick a brand color, then
            choose what to generate, set options, and hit generate. The BrandSync Studio plugin
            is idempotent, so running it again won’t create duplicates.
          </Paragraph>
          <Stack gap={3}>
            {[
              {
                title: "Select the BrandSync Studio plugin from Figma (after installation)",
                description:
                  "From the Figma menu or plugins panel, run the BrandSync Studio plugin to open it.",
                image: "/figma-plugin/Seleect-plugin.png",
              },
              {
                title: "Select a brand color",
                description:
                  "Choose from 14 brand palettes in the color picker grid.",
                image: "/figma-plugin/select-brand-color.png",
              },
              {
                title: "Choose what to generate, configure options, and generate",
                description:
                  "Enable the categories you need (colors, typography, elevation, layout grids, components, color swatches), set color mode (light, dark, or both) and viewports (Desktop, Tablet, Mobile), then run the BrandSync Studio plugin. Styles are created on the current page.",
                image: "/figma-plugin/generate.png",
              },
            ].map((step, i) => (
              <ProcessStep
                key={i}
                number={i + 1}
                title={step.title}
                description={step.description}
                color={STEP_COLORS[i]}
                image={step.image}
              />
            ))}
          </Stack>
        </Stack>

        {/* --------------------------------------------------------------- */}
        {/* Plugin Interface */}
        {/* --------------------------------------------------------------- */}
        <Stack gap={3}>
          <SectionHeading>Plugin Interface</SectionHeading>
          <Paragraph>
            The BrandSync Studio plugin opens a panel that adapts to Figma&apos;s light/dark
            theme automatically. Here&apos;s what each section does:
          </Paragraph>
          <DocTable
            headers={["Section", "Description"]}
            rows={[
              [
                "Brand Color Picker",
                "A 7x2 grid of color swatches representing all 14 brand palettes. Click to select.",
              ],
              [
                "Style Categories",
                "Six checkboxes (all enabled by default): Colors, Typography, Elevation, Layout Grids, Components, Color Swatches.",
              ],
              [
                "Semantic Token Mode",
                "Radio buttons: Both (default), Light only, Dark only. Controls whether light/dark semantic tokens are generated.",
              ],
              [
                "Typography Viewports",
                "Checkboxes for Desktop (default), Tablet, Mobile. Controls which responsive text sizes are generated.",
              ],
              [
                "Generate / Cancel",
                "Primary action button to start generation, with a cancel button to close the BrandSync Studio plugin.",
              ],
              [
                "Remove All BrandSync Styles",
                "Danger button with a confirmation step to clean up all generated content.",
              ],
              [
                "Progress Bar",
                "Animated progress indicator shown during generation or cleanup.",
              ],
              [
                "Results Panel",
                "Summary of created/skipped/removed styles after an operation completes.",
              ],
            ]}
          />
        </Stack>

        {/* --------------------------------------------------------------- */}
        {/* What Gets Generated */}
        {/* --------------------------------------------------------------- */}
        <Stack gap={4}>
          <SectionHeading>What Gets Generated</SectionHeading>

          {/* Colors */}
          <Stack gap={2}>
            <SubHeading>Colors (Paint Styles)</SubHeading>
            <Paragraph>
              Generates Figma paint styles organized into folders. Approximately{" "}
              <strong>139 paint styles</strong> when generating both light and
              dark modes.
            </Paragraph>
            <DocTable
              headers={["Folder", "Contents", "Count"]}
              rows={[
                [
                  "Primary/{ColorName}/",
                  "Full shade scale (50–950) for the selected brand color",
                  "11",
                ],
                ["Neutral/", "Full neutral gray scale (25–950)", "12"],
                ["Semantic/Success/", "Success (green) shade scale", "11"],
                ["Semantic/Error/", "Error (red) shade scale", "11"],
                ["Semantic/Warning/", "Warning (gold) shade scale", "11"],
                [
                  "Semantic/Information/",
                  "Information (blue) shade scale",
                  "11",
                ],
                [
                  "Semantic/Light/{Category}/",
                  "Light mode semantic state tokens (default, hover, focused, pressed, container, etc.)",
                  "~20",
                ],
                [
                  "Semantic/Dark/{Category}/",
                  "Dark mode semantic state tokens",
                  "~20",
                ],
              ]}
            />
            <Paragraph>
              <strong>Style naming examples:</strong>
            </Paragraph>
            <CodeBlock>{`Primary/Purple/600
Neutral/400
Semantic/Success/300
Semantic/Light/Primary/Default
Semantic/Dark/Error/Container`}</CodeBlock>
          </Stack>

          {/* Typography */}
          <Stack gap={2}>
            <SubHeading>Typography (Text Styles)</SubHeading>
            <Paragraph>
              Generates Figma text styles using the Roboto font family.{" "}
              <strong>27 text styles per viewport</strong> when all three
              viewports are selected (<strong>81 text styles total</strong>).
            </Paragraph>
            <DocTable
              headers={["Category", "Styles", "Font Weight"]}
              rows={[
                ["Display 1–7", "7 styles", "Bold"],
                ["H1–H6", "6 styles", "Bold"],
                [
                  "Body LG/MD/SM",
                  "9 styles (3 sizes × Regular, Medium, SemiBold)",
                  "Varies",
                ],
                [
                  "Caption LG/MD/SM",
                  "5 styles",
                  "Regular / Medium / SemiBold",
                ],
              ]}
            />
            <Paragraph>
              Font sizes scale down at smaller viewports. For example, Display 1
              is 80px on Desktop, 64px on Tablet, and 48px on Mobile.
            </Paragraph>
          </Stack>

          {/* Elevation */}
          <Stack gap={2}>
            <SubHeading>Elevation (Effect Styles)</SubHeading>
            <Paragraph>
              Generates 6 Figma effect styles for visual depth hierarchy:
            </Paragraph>
            <DocTable
              headers={["Style", "Use Case", "Shadow Type"]}
              rows={[
                [
                  "Level 1",
                  "Cards, containers (subtle lift)",
                  "2 drop shadows",
                ],
                [
                  "Level 2",
                  "Dropdowns, popovers (raised)",
                  "2 drop shadows",
                ],
                [
                  "Level 3",
                  "Modals, dialogs (prominent)",
                  "2 drop shadows",
                ],
                [
                  "Level 4",
                  "Sticky headers, floating actions (high)",
                  "2 drop shadows",
                ],
                [
                  "Level 5",
                  "Toasts, alerts (maximum)",
                  "1 drop shadow",
                ],
                [
                  "Inner",
                  "Pressed states, input fields (inset)",
                  "1 inner shadow",
                ],
              ]}
            />
          </Stack>

          {/* Layout Grids */}
          <Stack gap={2}>
            <SubHeading>Layout Grids (Grid Styles)</SubHeading>
            <Paragraph>
              Generates 3 responsive grid styles for common breakpoints:
            </Paragraph>
            <DocTable
              headers={["Style", "Columns", "Gutter", "Margin"]}
              rows={[
                ["Mobile (4 col)", "4", "16px", "16px"],
                ["Tablet (8 col)", "8", "16px", "24px"],
                ["Desktop (12 col)", "12", "24px", "24px"],
              ]}
            />
          </Stack>

          {/* Components */}
          <Stack gap={2}>
            <SubHeading>Components</SubHeading>
            <Paragraph>
              Generates a <strong>&quot;BrandSync Components&quot;</strong> frame
              on the current page containing four component sets. All components
              link to your generated paint/text/effect styles automatically.
            </Paragraph>

            <SubSubHeading>Button (6 variants)</SubSubHeading>
            <DocTable
              headers={["Variant", "Fill", "Text", "Stroke"]}
              rows={[
                [
                  "Primary / Default",
                  "Brand primary",
                  "White",
                  "None",
                ],
                [
                  "Primary / Hover",
                  "Brand primary",
                  "White",
                  "None",
                ],
                [
                  "Secondary / Default",
                  "Neutral container",
                  "Dark text",
                  "None",
                ],
                [
                  "Secondary / Hover",
                  "Neutral container",
                  "Dark text",
                  "None",
                ],
                [
                  "Outline / Default",
                  "Transparent",
                  "Brand primary",
                  "Brand primary, 1px",
                ],
                [
                  "Outline / Hover",
                  "Transparent",
                  "Brand primary",
                  "Brand primary, 1px",
                ],
              ]}
            />

            <SubSubHeading>Text Input</SubSubHeading>
            <Paragraph>
              Label + input field with neutral fill and 1px border. 280px fixed
              width.
            </Paragraph>

            <SubSubHeading>Card</SubSubHeading>
            <Paragraph>
              Image placeholder (280&times;160px), content area with title and
              body text. 12px corner radius with Level 1 elevation shadow.
            </Paragraph>

            <SubSubHeading>Badge (5 variants)</SubSubHeading>
            <DocTable
              headers={["Variant", "Fill", "Text"]}
              rows={[
                ["Primary", "Primary container", "Primary default"],
                ["Success", "Success container", "Success default"],
                ["Error", "Error container", "Error default"],
                ["Warning", "Warning container", "Warning default"],
                ["Info", "Information container", "Information default"],
              ]}
            />
          </Stack>

          {/* Color Swatches */}
          <Stack gap={2}>
            <SubHeading>Color Swatches</SubHeading>
            <Paragraph>
              Generates a <strong>&quot;BrandSync Color Swatches&quot;</strong>{" "}
              documentation frame with visual swatch rows for every palette:
              Primary (11 shades), Neutral (12 shades), Success, Error, Warning,
              and Information (11 shades each).
            </Paragraph>
            <Paragraph>
              Each swatch cell shows the shade number, hex value, WCAG contrast
              rating (AAA, AA, AA18, or Fail), and auto-selected text color for
              readability.
            </Paragraph>
          </Stack>
        </Stack>

        {/* --------------------------------------------------------------- */}
        {/* Available Brand Palettes */}
        {/* --------------------------------------------------------------- */}
        <Stack gap={3}>
          <SectionHeading>Available Brand Palettes</SectionHeading>
          <Paragraph>
            14 palettes are available, each with 11 shades (50–950). Shade 600
            is the base shade used for primary UI elements.
          </Paragraph>
          <DocTable
            headers={["Palette", "Base (600) Hex", "Character"]}
            rows={[
              ["Purple", "#5E47E6", "Vibrant violet"],
              ["Cobalt", "#3B4EE9", "Deep blue-violet"],
              ["Blue", "#0062C1", "Classic blue"],
              ["Steel", "#2B6796", "Muted blue-gray"],
              ["Teal", "#116F6E", "Blue-green"],
              ["Jade", "#0E7060", "Green-teal"],
              ["Green", "#2A7043", "Natural green"],
              ["Lime", "#406F1D", "Yellow-green"],
              ["Yellow", "#746202", "Deep gold"],
              ["Amber", "#875B04", "Warm amber"],
              ["Orange", "#A24907", "Burnt orange"],
              ["Magenta", "#B62965", "Hot pink"],
              ["Maroon", "#983F98", "Rich purple-pink"],
              ["Violet", "#7750A8", "Soft purple"],
            ]}
          />
        </Stack>

        {/* --------------------------------------------------------------- */}
        {/* Semantic Tokens */}
        {/* --------------------------------------------------------------- */}
        <Stack gap={3}>
          <SectionHeading>Semantic Tokens</SectionHeading>

          <Stack gap={2}>
            <SubHeading>Semantic Palettes</SubHeading>
            <Paragraph>
              Four purpose-driven palettes for communicating meaning:
            </Paragraph>
            <DocTable
              headers={["Palette", "Purpose", "Base (600)"]}
              rows={[
                ["Success", "Confirmations, positive states", "#11714E"],
                ["Error", "Errors, destructive actions", "#B92F31"],
                ["Warning", "Cautions, alerts", "#805D00"],
                ["Information", "Informational messages", "#0066AE"],
              ]}
            />
          </Stack>

          <Stack gap={2}>
            <SubHeading>State Mappings</SubHeading>
            <Paragraph>
              Semantic tokens map shade values to interactive states for both
              light and dark modes:
            </Paragraph>
            <Paragraph>
              <strong>States:</strong> default, hover, focused, pressed,
              container, container-hover, container-focused, container-pressed
            </Paragraph>
            <Paragraph>
              <strong>Light mode</strong> uses darker shades (600–800) for
              foreground elements and lighter shades (25–200) for containers and
              backgrounds.
            </Paragraph>
            <Paragraph>
              <strong>Dark mode</strong> inverts this: lighter shades (200–400)
              for foreground, darker shades (700–950) for containers.
            </Paragraph>
          </Stack>
        </Stack>

        {/* --------------------------------------------------------------- */}
        {/* Removing Generated Styles */}
        {/* --------------------------------------------------------------- */}
        <Stack gap={3}>
          <SectionHeading>Removing Generated Styles</SectionHeading>
          <Paragraph>
            Use the <strong>&quot;Remove All BrandSync Styles&quot;</strong>{" "}
            button to clean up all generated content. A confirmation dialog
            prevents accidental deletion. The following items are removed:
          </Paragraph>
          <DocTable
            headers={["Content Type", "What Gets Removed"]}
            rows={[
              ["Color styles", "All styles under Primary/, Neutral/, Semantic/"],
              ["Text styles", "All styles under Typography/"],
              ["Effect styles", "All styles under Elevation/"],
              ["Grid styles", "All styles under Layout/"],
              [
                "Component frame",
                'The frame named "BrandSync Components"',
              ],
              [
                "Swatch frame",
                'The frame named "BrandSync Color Swatches"',
              ],
            ]}
          />
        </Stack>

        {/* --------------------------------------------------------------- */}
        {/* Tips */}
        {/* --------------------------------------------------------------- */}
        <Stack gap={3}>
          <SectionHeading>Tips</SectionHeading>
          <Box component="ul" sx={{ m: 0, pl: 3, color: "text.secondary" }}>
            <li>
              <Paragraph component="span">
                <strong>Run it multiple times safely.</strong> The BrandSync Studio plugin is
                idempotent, so existing styles are skipped, not duplicated.
              </Paragraph>
            </li>
            <li>
              <Paragraph component="span">
                <strong>Make sure Roboto is loaded.</strong> The BrandSync Studio plugin needs
                Roboto (Regular, Medium, SemiBold, Bold) to generate typography.
                It will show an error if the font isn&apos;t available.
              </Paragraph>
            </li>
            <li>
              <Paragraph component="span">
                <strong>Components auto-link to styles.</strong> Generated
                components reference your paint, text, and effect styles by name.
                Generate colors and typography first for best results.
              </Paragraph>
            </li>
            <li>
              <Paragraph component="span">
                <strong>Works on the current page.</strong> Components and
                swatch frames are created on whatever page is active when you run
                the BrandSync Studio plugin.
              </Paragraph>
            </li>
            <li>
              <Paragraph component="span">
                <strong>No internet required.</strong> The BrandSync Studio plugin runs entirely
                offline with no external requests.
              </Paragraph>
            </li>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}