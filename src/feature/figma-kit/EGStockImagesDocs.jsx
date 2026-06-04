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
import { FigmaLogo, Image } from "phosphor-react";
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

export default function EGStockImagesDocs() {
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
              EG Stock Images plugin
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
              Browse, search, and insert high-quality stock images directly
              into your Figma designs. Access your entire EG BrandSync stock
              image library without leaving the canvas.
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
                href="https://www.figma.com/files/1389562972559636636/resources/internal?fuid=1413856563943166493"
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
                  Search
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  by keyword & category
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
                  High-res
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "text.secondary",
                    mt: 0.5,
                  }}
                >
                  production-ready images
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
              src="/figma-kit/eg-stock-header.png"
              alt="EG Stock Images plugin"
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
              <li>
                <Paragraph component="span">

                  <strong>VPN connection</strong> required. Images are
                  company-owned and protected. You must be connected to the
                  corporate VPN to browse, view, and download images
                </Paragraph>
              </li>
            </Box>
          </Stack>

          <Stack gap={2}>
            <SubHeading>Install the EG Stock Images plugin</SubHeading>
            <Paragraph>
              The EG Stock Images plugin is available on the Figma Community.
              Install it directly from Figma:
            </Paragraph>
            <Box
              component="a"
              href="https://www.figma.com/files/1389562972559636636/resources/internal?fuid=1413856563943166493"
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
              Get the EG Stock Images plugin on Figma
            </Box>
          </Stack>
        </Stack>

        {/* --------------------------------------------------------------- */}
        {/* How It Works */}
        {/* --------------------------------------------------------------- */}
        <Stack gap={3}>
          <SectionHeading>How It Works</SectionHeading>
          <Paragraph>
            Four simple steps: open the plugin in Figma, browse or search for
            images, select the one you need, and insert it directly onto your
            canvas.
          </Paragraph>
          <Stack gap={3}>
            {[
              {
                title: "Open the EG Stock Images plugin from Figma",
                description:
                  "From the Figma menu or plugins panel, run the EG Stock Images plugin to open the image browser.",
              },
              {
                title: "Browse or search for images",
                description:
                  "Use the search bar to find images by keyword, or browse through categories to discover the right image for your design.",
              },
              {
                title: "Preview and select an image",
                description:
                  "Click on any image to see a larger preview with details including dimensions, categories, and tags.",
              },
              {
                title: "Insert into your design",
                description:
                  "Click the insert button to place the image directly onto your Figma canvas. The image is added at its original resolution and can be resized as needed.",
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
            The EG Stock Images plugin opens a panel inside Figma with a
            streamlined interface for finding and inserting images.
            Here&apos;s what each section does:
          </Paragraph>
          <DocTable
            headers={["Section", "Description"]}
            rows={[
              [
                "Search Bar",
                "Type keywords to search across image titles, descriptions, and tags. Results update as you type.",
              ],
              [
                "Category Filter",
                "Filter images by category such as People, Nature, Business, Technology, and more.",
              ],
              [
                "Image Grid",
                "A responsive grid displaying image thumbnails. Click any image to preview it.",
              ],
              [
                "Image Preview",
                "Shows a larger view of the selected image with metadata such as dimensions, file size, and tags.",
              ],
              [
                "Insert Button",
                "Places the selected image directly onto your Figma canvas at the current viewport position.",
              ],
            ]}
          />
        </Stack>

        {/* --------------------------------------------------------------- */}
        {/* Features */}
        {/* --------------------------------------------------------------- */}
        <Stack gap={4}>
          <SectionHeading>Features</SectionHeading>

          {/* Search */}
          <Stack gap={2}>
            <SubHeading>Keyword Search</SubHeading>
            <Paragraph>
              Search across the entire stock image library using keywords. The
              search matches against image titles, descriptions, tags, and
              category names, making it easy to find exactly what you need.
            </Paragraph>
          </Stack>

          {/* Categories */}
          <Stack gap={2}>
            <SubHeading>Category Browsing</SubHeading>
            <Paragraph>
              Browse images organized by categories. Filter by one or more
              categories to narrow down results. Categories are managed through
              the EG BrandSync platform and stay in sync with the plugin.
            </Paragraph>
          </Stack>

          {/* Insert */}
          <Stack gap={2}>
            <SubHeading>One-Click Insert</SubHeading>
            <Paragraph>
              Insert any image directly onto your Figma canvas with a single
              click. Images are placed at their original resolution and can be
              freely resized, cropped, or styled using Figma&apos;s built-in
              tools.
            </Paragraph>
          </Stack>

          {/* High-res */}
          <Stack gap={2}>
            <SubHeading>High-Resolution Images</SubHeading>
            <Paragraph>
              All images in the library are high-resolution and
              production-ready. They are suitable for both design mockups and
              final deliverables without quality loss.
            </Paragraph>
          </Stack>

          {/* Synced Library */}
          <Stack gap={2}>
            <SubHeading>Synced with EG BrandSync</SubHeading>
            <Paragraph>
              The plugin connects to your EG BrandSync stock image library in
              real time. Any images uploaded or categorized on the platform are
              immediately available inside Figma.
            </Paragraph>
          </Stack>
        </Stack>

        {/* --------------------------------------------------------------- */}
        {/* Image Categories */}
        {/* --------------------------------------------------------------- */}
        <Stack gap={3}>
          <SectionHeading>Image Categories</SectionHeading>
          <Paragraph>
            Many categories are available depending on your use cases. Categories
            are managed through the EG BrandSync platform and stay in sync with
            the plugin automatically.
          </Paragraph>
        </Stack>

        {/* --------------------------------------------------------------- */}
        {/* Tips */}
        {/* --------------------------------------------------------------- */}
        <Stack gap={3}>
          <SectionHeading>Tips</SectionHeading>
          <Box component="ul" sx={{ m: 0, pl: 3, color: "text.secondary" }}>
            <li>
              <Paragraph component="span">
                <strong>Use specific keywords.</strong> The more specific your
                search terms, the more relevant the results. Try
                &quot;business meeting&quot; instead of just
                &quot;business&quot;.
              </Paragraph>
            </li>
            <li>
              <Paragraph component="span">
                <strong>Combine search with categories.</strong> Use both the
                search bar and category filters together to quickly narrow down
                results.
              </Paragraph>
            </li>
            <li>
              <Paragraph component="span">
                <strong>Images are inserted at full resolution.</strong> You
                can scale them down in Figma without losing quality. Use
                Figma&apos;s fill or fit modes for responsive layouts.
              </Paragraph>
            </li>
            <li>
              <Paragraph component="span">
                <strong>Library stays in sync.</strong> New images added to
                EG BrandSync are automatically available in the plugin. No
                need to reinstall or refresh.
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
