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

const STEP_COLORS = ["#6366F1", "#0EA5E9", "#F59E0B", "#10B981"];

function ProcessStep({ number, title, description, color }) {
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
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function EGProductLogosDocs() {
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
              EG Product Logos plugin
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
              Browse and search product logos, select the format you need, and
              insert them directly into your designs with one click. All logos
              are synced from the central brand, ensuring you always use the
              latest, approved versions.
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
                href="https://www.figma.com/community/plugin/1609443938513609012"
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
                  Multiple
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  logo formats
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
                  One-click
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  insert to canvas
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
                  Always
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  latest approved versions
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
              src="/figma-kit/product-logos-header.png"
              alt="EG Product Logos plugin"
              sx={{
                width: "100%",
                maxWidth: { xs: "280px", md: "380px" },
                height: "auto",
                borderRadius: "8px",
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
            </Box>
          </Stack>

          <Stack gap={2}>
            <SubHeading>Install the EG Product Logos plugin</SubHeading>
            <Paragraph>
              The EG Product Logos plugin is available on the Figma Community.
              Install it directly from Figma:
            </Paragraph>
            <Box
              component="a"
              href="https://www.figma.com/community/plugin/1609443938513609012"
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
              Get the EG Product Logos plugin on Figma
            </Box>
          </Stack>
        </Stack>

        {/* --------------------------------------------------------------- */}
        {/* How It Works */}
        {/* --------------------------------------------------------------- */}
        <Stack gap={3}>
          <SectionHeading>How It Works</SectionHeading>
          <Paragraph>
            Four simple steps: open the plugin in Figma, browse or search for a
            product logo, pick the format you need, and insert it directly onto
            your canvas.
          </Paragraph>
          <Stack gap={3}>
            {[
              {
                title: "Open the EG Product Logos plugin from Figma",
                description:
                  "From the Figma menu or plugins panel, run the EG Product Logos plugin to open the logo browser.",
              },
              {
                title: "Browse or search for a product logo",
                description:
                  "Use the search bar to find logos by product name, or browse through the full list of available product logos.",
              },
              {
                title: "Select the format you need",
                description:
                  "Choose from available formats such as horizontal, vertical, light, dark, or negative versions of the logo.",
              },
              {
                title: "Insert into your design",
                description:
                  "Click the insert button to place the logo directly onto your Figma canvas. The logo is added as a vector and can be resized without quality loss.",
              },
            ].map((step, i) => (
              <ProcessStep
                key={i}
                number={i + 1}
                title={step.title}
                description={step.description}
                color={STEP_COLORS[i]}
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
            The EG Product Logos plugin opens a panel inside Figma with a
            streamlined interface for finding and inserting logos.
            Here&apos;s what each section does:
          </Paragraph>
          <DocTable
            headers={["Section", "Description"]}
            rows={[
              [
                "Search Bar",
                "Type a product name to quickly find the logo you need. Results update as you type.",
              ],
              [
                "Logo List",
                "Displays all available product logos. Click any logo to see its available formats.",
              ],
              [
                "Format Selector",
                "Choose between logo formats: horizontal, vertical, light, dark, and negative.",
              ],
            ]}
          />
        </Stack>

        {/* --------------------------------------------------------------- */}
        {/* Logo Formats */}
        {/* --------------------------------------------------------------- */}
        <Stack gap={3}>
          <SectionHeading>Logo Formats</SectionHeading>
          <Paragraph>
            Each product logo is available in multiple formats to fit different
            design contexts and backgrounds.
          </Paragraph>
          <DocTable
            headers={["Format", "Description"]}
            rows={[
              [
                "Horizontal",
                "Landscape orientation with the logo mark and product name side by side.",
              ],
              [
                "Vertical",
                "Portrait orientation with the logo mark stacked above the product name.",
              ],
              [
                "Light",
                "Designed for use on light backgrounds with dark-colored logo elements.",
              ],
              [
                "Dark",
                "Designed for use on dark backgrounds with light-colored logo elements.",
              ],
              [
                "Negative",
                "Single-color inverted version for use on solid or complex backgrounds.",
              ],
            ]}
          />
        </Stack>

        {/* --------------------------------------------------------------- */}
        {/* Features */}
        {/* --------------------------------------------------------------- */}
        <Stack gap={4}>
          <SectionHeading>Features</SectionHeading>

          <Stack gap={2}>
            <SubHeading>Product Logo Search</SubHeading>
            <Paragraph>
              Search across all product logos by name. Results update instantly
              as you type, making it fast to find the exact logo you need.
            </Paragraph>
          </Stack>

          <Stack gap={2}>
            <SubHeading>Multiple Logo Formats</SubHeading>
            <Paragraph>
              Each product logo comes in multiple formats including horizontal,
              vertical, light, dark, and negative. Select the right version for
              your design context without needing to ask the brand team.
            </Paragraph>
          </Stack>

          <Stack gap={2}>
            <SubHeading>One-Click Insert</SubHeading>
            <Paragraph>
              Insert any logo directly onto your Figma canvas with a single
              click. Logos are inserted as high-quality assets and can be freely
              resized without quality loss.
            </Paragraph>
          </Stack>

          <Stack gap={2}>
            <SubHeading>Synced with EG BrandSync</SubHeading>
            <Paragraph>
              The plugin connects to the central EG BrandSync brand asset
              library in real time. When logos are updated or new products are
              added on the platform, they are immediately available inside
              Figma.
            </Paragraph>
          </Stack>

          <Stack gap={2}>
            <SubHeading>Consistent Branding at Scale</SubHeading>
            <Paragraph>
              By pulling logos from a single source of truth, the plugin ensures
              every designer uses the latest, approved logo versions. No more
              outdated logos or incorrect formats in your designs.
            </Paragraph>
          </Stack>
        </Stack>

        {/* --------------------------------------------------------------- */}
        {/* Tips */}
        {/* --------------------------------------------------------------- */}
        <Stack gap={3}>
          <SectionHeading>Tips</SectionHeading>
          <Box component="ul" sx={{ m: 0, pl: 3, color: "text.secondary" }}>
            <li>
              <Paragraph component="span">
                <strong>Match the format to your background.</strong> Use the
                light version on light backgrounds and the dark version on dark
                backgrounds for optimal contrast and readability.
              </Paragraph>
            </li>
            <li>
              <Paragraph component="span">
                <strong>Use horizontal for headers, vertical for compact
                spaces.</strong> The horizontal format works well in navigation
                bars and headers, while vertical is better suited for cards and
                compact layouts.
              </Paragraph>
            </li>
            <li>
              <Paragraph component="span">
                <strong>Logos stay up to date automatically.</strong> When the
                brand team updates a logo in EG BrandSync, the latest version
                is immediately available in the plugin. No need to reinstall or
                refresh.
              </Paragraph>
            </li>
            <li>
              <Paragraph component="span">
                <strong>Works with any Figma file.</strong> The plugin can be
                used in any Figma file, whether it&apos;s a design file,
                FigJam board, or prototype.
              </Paragraph>
            </li>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
