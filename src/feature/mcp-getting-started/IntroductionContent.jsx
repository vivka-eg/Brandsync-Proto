"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import Link from "next/link";
import BetaCtaBanner from "@/feature/mcp-getting-started/components/BetaCtaBanner";
import Breadcrumb from "@/feature/mcp-getting-started/components/Breadcrumb";
import PageHeader from "@/feature/mcp-getting-started/components/PageHeader";
import SectionHeading from "@/feature/mcp-getting-started/components/SectionHeading";
import PageNav from "@/feature/mcp-getting-started/components/PageNav";
import { useAuthContext } from "@/context/auth/AuthContext";

export default function IntroductionContent() {
  const { isMcpBetaUser } = useAuthContext();

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 4, width: "100%" }}>
      <Stack spacing={4}>
        {/* Breadcrumb + Hero */}
        <Stack spacing={3}>
          <Breadcrumb current="Introduction" />
          <PageHeader
            title="Introduction"
            subtitle="Understand what BrandSync MCP is, how the two servers work, and how they fit into your development workflow."
          />
        </Stack>

        {/* What is BrandSync MCP? */}
        <Box>
          <SectionHeading title="What is BrandSync MCP?" />
          <Typography
            sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
          >
            BrandSync MCP is a local Model Context Protocol server that wires
            your design system directly into Claude. When you ask Claude to
            build a UI, it doesn&apos;t guess. Instead, it reads your actual
            tokens, your component specs, your usage rules, and your live Figma
            file before generating a single line of code. The result is
            components that are consistent, production-ready, and on-brand
            without manual correction, without token lookups, and without
            back-and-forth review cycles.
          </Typography>
        </Box>

        <Divider />

        {/* How it fits your workflow */}
        <Stack spacing={3}>
          <Box>
            <SectionHeading title="How it fits your workflow" />
            <Typography
              sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
            >
              BrandSync sits between your design system and your AI assistant.
              You don&apos;t change how you work. You just stop losing
              information in translation.
            </Typography>
          </Box>

          {/* Comparison cards */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            {/* Without BrandSync */}
            <Box
              sx={{
                flex: 1,
                bgcolor: "#fcecea",
                borderRadius: "12px",
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: "8px",
                  overflow: "hidden",
                  width: "100%",
                  aspectRatio: "508 / 312",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/mcp/without-brandsync.png"
                  alt="Without BrandSync: workflow showing gaps between Figma, tokens, developer and AI"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </Box>

              <Stack spacing={1.25}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 700,
                    lineHeight: "20px",
                    color: "#982a2a",
                  }}
                >
                  Without BrandSync
                </Typography>
                <Stack spacing={0.75}>
                  {WITHOUT_STEPS.map((step, i) => (
                    <Typography
                      key={i}
                      sx={{
                        fontSize: "16px",
                        color: "#53585c",
                        lineHeight: "24px",
                      }}
                    >
                      {`${i + 1}. ${step}`}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </Box>

            {/* With BrandSync */}
            <Box
              sx={{
                flex: 1,
                bgcolor: "#e5f5e9",
                borderRadius: "12px",
                p: 2.5,
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: "8px",
                  overflow: "hidden",
                  width: "100%",
                  aspectRatio: "508 / 312",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/mcp/with-brandsync.png"
                  alt="With BrandSync MCP bridging Figma, tokens, developer and AI for accurate output"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </Box>

              <Stack spacing={1.25}>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 700,
                    lineHeight: "20px",
                    color: "#1b5d43",
                  }}
                >
                  With BrandSync
                </Typography>
                <Stack spacing={0.75}>
                  {WITH_STEPS.map((step, i) => (
                    <Typography
                      key={i}
                      sx={{
                        fontSize: "16px",
                        color: "#53585c",
                        lineHeight: "24px",
                      }}
                    >
                      {`${i + 1}. ${step}`}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Stack>

        {/* Beta CTA */}
        <BetaCtaBanner
          title="See it for yourself"
          description="BrandSync MCP is in closed beta. Request access and connect it to your workflow today."
          show={!isMcpBetaUser}
        />

        <Divider />

        <PageNav
          next={{
            href: "/mcp/getting-started/installation",
            label: "Next: Installation",
          }}
        />
      </Stack>
    </Box>
  );
}

const WITHOUT_STEPS = [
  "Designer documents component in Figma",
  "Design tokens live in a separate file",
  "Developer prompts AI — which has seen neither",
  "AI invents values, ignores rules, produces generic output",
  "Developer corrects, re-prompts, or gives up",
];

const WITH_STEPS = [
  "Designer documents component in Figma",
  "Design tokens published to brandsync-tokens",
  "Developer prompts Claude — which has read both via MCP",
  "Claude returns spec-accurate, token-referenced output",
  "Developer pastes, and its done",
];
