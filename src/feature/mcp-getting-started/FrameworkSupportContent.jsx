"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { CaretDown, CaretUp, ArrowRight } from "phosphor-react";
import Link from "next/link";
import BetaCtaBanner from "@/feature/mcp-getting-started/components/BetaCtaBanner";
import Breadcrumb from "@/feature/mcp-getting-started/components/Breadcrumb";
import PageHeader from "@/feature/mcp-getting-started/components/PageHeader";
import SectionHeading from "@/feature/mcp-getting-started/components/SectionHeading";
import CodeBlock from "@/feature/mcp-getting-started/components/CodeBlock";
import PageNav from "@/feature/mcp-getting-started/components/PageNav";
import { useAuthContext } from "@/context/auth/AuthContext";

// ── Collapsible Framework Section ─────────────────────────────────────────────

function FrameworkSection({ title, code, defaultExpanded = false }) {
  const [open, setOpen] = useState(defaultExpanded);

  return (
    <Stack spacing={1.5}>
      <Typography
        sx={{
          fontSize: "20px",
          fontWeight: 700,
          lineHeight: "24px",
          color: "text.primary",
        }}
      >
        {title}
      </Typography>
      <Box>
        {open ? (
          <CodeBlock label={title} code={code} />
        ) : (
          <Box
            sx={{
              bgcolor: "#f7f7f5",
              borderRadius: "12px",
              px: 2.5,
              py: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              minHeight: 52,
            }}
            onClick={() => setOpen(true)}
          >
            <Typography
              sx={{
                fontFamily: "'Roboto Mono', Consolas, monospace",
                fontWeight: 500,
                fontSize: "16px",
                color: "#6d7585",
              }}
            >
              {title}
            </Typography>
            <IconButton size="small" sx={{ color: "text.secondary" }}>
              <CaretDown size={18} />
            </IconButton>
          </Box>
        )}
        {open && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              sx={{
                color: "text.secondary",
                "&:hover": { color: "text.primary" },
              }}
            >
              <CaretUp size={18} />
            </IconButton>
          </Box>
        )}
      </Box>
    </Stack>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function FrameworkSupportContent() {
  const { isMcpBetaUser } = useAuthContext();

  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 4, width: "100%" }}>
      <Stack spacing={4}>
        {/* Breadcrumb + Hero */}
        <Stack spacing={3}>
          <Breadcrumb current="Framework Support" />
          <PageHeader
            title="Framework Support"
            subtitle="How BrandSync generates framework-native output — HTML, React, Vue, and beyond."
          />
        </Stack>

        {/* How framework output works */}
        <Box>
          <SectionHeading title="How framework output works" />
          <Typography
            sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
          >
            <Box
              component="span"
              sx={{
                fontFamily: "'Roboto Mono', Consolas, monospace",
                fontWeight: 500,
                color: "text.primary",
              }}
            >
              brandsync-mcp{" "}
            </Box>
            is framework-agnostic. The token system and component specs are
            format-independent — they describe structure, rules, and values, not
            syntax. When you specify a framework in your prompt, Claude
            generates output in that framework&apos;s native idiom, with the
            same token references throughout.
          </Typography>
        </Box>

        <Divider />

        {/* Official Integrations */}
        <Stack spacing={3}>
          <Box>
            <SectionHeading title="Official Integrations" />
            <Typography
              sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
            >
              Tokens are organized in three layers. Primitives define raw
              values. Semantics describe intent and purpose. Components apply
              tokens to create cohesive UI patterns.
            </Typography>
          </Box>

          {FRAMEWORKS.map((fw) => (
            <FrameworkSection
              key={fw.id}
              title={fw.label}
              code={fw.code}
              defaultExpanded={fw.defaultExpanded}
            />
          ))}
        </Stack>

        {/* Other frameworks */}
        <Box>
          <SectionHeading title="Other frameworks" />
          <Typography
            sx={{
              fontSize: "16px",
              color: "#53585c",
              lineHeight: "24px",
              mb: 0.75,
            }}
          >
            Claude can generate output for any framework you specify — Svelte,
            Angular, Web Components, or others. The token layer is always the
            same. Only the component syntax changes.
          </Typography>
          <Typography
            sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
          >
            Always name the exact framework and version. The more specific you
            are, the more idiomatic the output.
          </Typography>
        </Box>

        {/* Beta CTA */}
        <BetaCtaBanner
          title="Your framework is supported. Your project should be too."
          description="Request access to the beta and start generating framework-native UI directly from your design system."
          show={!isMcpBetaUser}
        />

        <Divider />

        {/* Resolved values for non-CSS targets */}
        <Stack spacing={3}>
          <Box>
            <SectionHeading title="Resolved values for non-CSS targets" />
            <Typography
              sx={{
                fontSize: "16px",
                color: "#53585c",
                lineHeight: "24px",
                mb: 0.75,
              }}
            >
              If your framework resolves tokens at build time (React Native,
              Flutter, Swift UI, Tailwind config), Claude can output flat
              resolved values instead of CSS custom property references.
            </Typography>
            <Typography
              sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
            >
              {`Use get_tokens with format: "flat" to get the full resolved set, then specify in your prompt that you need hardcoded values rather than CSS variable references.`}
            </Typography>
          </Box>

          {/* Prompt Example */}
          <Stack spacing={1}>
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: "32px",
                color: "#121212",
              }}
            >
              Prompt Example
            </Typography>
            <Box sx={{ bgcolor: "#f7f7f5", borderRadius: "12px", p: 2.5 }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  color: "#5d6472",
                  lineHeight: "19px",
                  mb: 1,
                }}
              >
                Generate this component for React Native.
              </Typography>
              <Typography
                sx={{ fontSize: "16px", color: "#5d6472", lineHeight: "19px" }}
              >
                Use resolved token values, not CSS custom properties.
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* Your framework not supported CTA */}
        <Box
          sx={{
            bgcolor: "#edf0fa",
            borderRadius: "12px",
            p: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Stack spacing={0.5}>
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 700,
                lineHeight: "32px",
                color: "text.primary",
              }}
            >
              Your framework not supported?
            </Typography>
            <Typography
              sx={{ fontSize: "16px", color: "#53585c", lineHeight: "24px" }}
            >
              Request it and help us prioritize what to build next.
            </Typography>
          </Stack>
          <Button
            component="a"
            href="/support"
            endIcon={<ArrowRight size={18} />}
            sx={{
              fontWeight: 500,
              fontSize: "16px",
              color: "#005592",
              flexShrink: 0,
              textTransform: "none",
              "&:hover": {
                bgcolor: "transparent",
                textDecoration: "underline",
              },
            }}
          >
            Request for new framework
          </Button>
        </Box>

        <Divider />

        <PageNav
          prev={{
            href: "/mcp/getting-started/understand-tokens",
            label: "Previous",
          }}
          next={{
            href: "/mcp/how-it-works/working-with-jira",
            label: "Next: Working with Jira",
          }}
        />
      </Stack>
    </Box>
  );
}

// ── Framework data ─────────────────────────────────────────────────────────────

const FRAMEWORKS = [
  {
    id: "html",
    label: "HTML/CSS",
    defaultExpanded: true,
    code: `<button class="btn btn-primary">New order</button>

.btn-primary {
  background: var(--color-primary-default);
  color: var(--text-inverse);
  border-radius: var(--border-radius-75);
  padding: var(--spacing-100) var(--spacing-200);
}`,
  },
  {
    id: "react",
    label: "React",
    defaultExpanded: false,
    code: `import { Button } from '@mui/material';

export default function NewOrderButton() {
  return (
    <Button
      variant="contained"
      sx={{
        bgcolor: 'var(--color-primary-default)',
        color: 'var(--color-text-inverse)',
        borderRadius: 'var(--border-radius-75)',
        px: 'var(--spacing-200)',
        py: 'var(--spacing-100)',
        '&:hover': { bgcolor: 'var(--color-primary-hover)' },
      }}
    >
      New Order
    </Button>
  );
}`,
  },
  {
    id: "vue",
    label: "Vue",
    defaultExpanded: false,
    code: `<template>
  <button class="btn-primary">New Order</button>
</template>

<style scoped>
.btn-primary {
  background: var(--color-primary-default);
  color: var(--color-text-inverse);
  border-radius: var(--border-radius-75);
  padding: var(--spacing-100) var(--spacing-200);
  border: none;
  cursor: pointer;
}
</style>`,
  },
  {
    id: "maui",
    label: ".NET MAUI",
    defaultExpanded: false,
    code: `<Button
    Text="New Order"
    BackgroundColor="{StaticResource ColorPrimaryDefault}"
    TextColor="{StaticResource ColorTextInverse}"
    CornerRadius="6"
    Padding="16,8" />`,
  },
];
