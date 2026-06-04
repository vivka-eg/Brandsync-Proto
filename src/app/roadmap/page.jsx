"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  Image,
  Type,
  Contrast,
} from "lucide-react";
import { FileText } from "@phosphor-icons/react";
import FeatureItem from "@/components/shared/FeatureItem";
import TimelinePhase from "@/components/shared/TimelinePhase";

export default function RoadmapPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ mt: "64px", flex: 1 }}>
        <Box
          sx={{
            maxWidth: "1100px",
            mx: "auto",
            px: { xs: 2, md: 4 },
            py: { xs: 4, md: 6 },
          }}
        >
          {/* Header Section */}
          <Stack gap={2} sx={{ mb: 6, textAlign: "center", alignItems: "center" }}>
            <Typography variant="h3" fontWeight={700} color="text.primary">
              BrandSync Roadmap
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ lineHeight: 1.7, maxWidth: "800px" }}>
              Our phased approach to building a unified design ecosystem. Track upcoming features, releases, and enhancements planned for BrandSync.
            </Typography>
          </Stack>

          {/* Timeline Section */}
          <Stack gap={3}>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              Implementation Timeline
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              BrandSync follows a phased rollout with quarterly releases.
            </Typography>

            <Timeline
              sx={{
                p: 0,
                m: 0,
                "& .MuiTimelineItem-root": {
                  minHeight: "auto",
                  "&:before": {
                    flex: 0,
                    padding: 0,
                  },
                },
                "& .MuiTimelineContent-root": {
                  py: 0,
                  px: 2,
                },
              }}
            >
              <TimelinePhase
                date="DECEMBER 2025"
                title="Foundation release"
                isCompleted={true}
                features={[
                  <FeatureItem
                    key="logo"
                    icon={Image}
                    title="Logo & Branding"
                    description="Mandatory placement rules, spacing requirements, and padding guidelines"
                  />,
                  <FeatureItem
                    key="guidelines"
                    icon={FileText}
                    title="Basic Guidelines"
                    description="Simple, developer-focused documentation for spacing, grids, and typography"
                  />,
                  <FeatureItem
                    key="accessibility"
                    icon={Contrast}
                    title="Accessibility Tools"
                    description="WCAG compliance checkers and color contrast validators"
                  />,
                  <FeatureItem
                    key="figma"
                    icon={Type}
                    title="Figma Kit"
                    description="Tokenized design kit for product/teams who want structured design system support"
                  />
                ]}
              />

              <TimelinePhase
                date="JANUARY 2026"
                title="Theme Builder"
                description="Tool to generate WCAG-compliant color palettes"
                isCompleted={true}
              />
              <TimelinePhase
                date="March 2026"
                title="BrandSync MCP Server"
                description="Direct integration with Claude Code and MCP-compatible tools"
                isActive={true}
              />

              <TimelinePhase
                date="MID-2026"
                title="Component Library"
                description="Atomic design system components for faster development"
              />

              <TimelinePhase
                date="LATE-2026"
                title="Advanced Features"
                description="UI component styles, theme variations, and enhanced tooling"
                isLast={true}
              />
            </Timeline>
          </Stack>

          {/* Additional Info Section */}
          <Box
            sx={{
              mt: 6,
              p: 4,
              bgcolor: "#EDF9FF",
              border: "1px solid #BBDEFB",
              borderRadius: "12px",
            }}
          >
            <Typography variant="h6" fontWeight={600} color="text.primary" sx={{ mb: 1 }}>
              Stay Updated
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              This roadmap is updated quarterly as we refine our plans based on feedback and evolving needs.
              Please plan your development roadmap accordingly. Follow us on <Link href="https://engage.cloud.microsoft/main/groups/eyJfdHlwZSI6Ikdyb3VwIiwiaWQiOiI4OTI2NzcxIn0/all" target="_blank">UX i EG</Link> to stay updated.
            </Typography>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
