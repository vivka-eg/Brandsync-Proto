"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import FaqAccordionItem from "@/components/shared/FaqAccordionItem";
import PageHeader from "./components/PageHeader";
import SectionHeading from "./components/SectionHeading";
import SubSection from "./components/SubSection";
import CodeBlock from "./components/CodeBlock";
import DataTable from "./components/DataTable";
import ImagePlaceholder from "./components/ImagePlaceholder";
import MediaPlaceholder from "./components/MediaPlaceholder";
import PageNav from "./components/PageNav";

export default function BrandsyncFoundationsContent() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 4, width: "100%" }}>
      <Stack spacing={4}>

        <PageHeader
          current="BrandSync Foundations"
          title="BrandSync Foundations"
          subtitle="Build your design foundation once, use it everywhere. Foundations generates production-ready theme code that brings EG's design tokens to life in your framework of choice."
        />

        {/* <MediaPlaceholder
          type="video"
          title="Video demo · BrandSync Foundations"
          description="Walkthrough of generating a production-ready theme with BrandSync Foundations"
          dimensions="1112 × 626"
          height={626}
        /> */}

        <SectionHeading
          title="Why Foundations exists"
          body="Theme infrastructure is the backbone of consistent design. Without it, every project ends up redefining the same variables, every engineer invents their own naming scheme, and every design-system update turns into weeks of manual work. Foundations solves this by generating a comprehensive, framework-native theme package in minutes. Your design tokens become executable code, ready to power components, patterns, and every screen you build."
        />

        <Divider />

        <SectionHeading
          title="What Foundations generates"
          body="Three outputs, produced together from the same token source. Each one is idiomatic for the framework you selected, not a thin wrapper on a generic export."
        />

        <SubSection
          title="Framework-native code"
          body="The generated code follows your framework's conventions. React hooks and context providers. Flutter ThemeData. Angular services. .NET resource dictionaries. Each output is idiomatic and production-ready, not a generic dump that needs translation."
        />

        <SubSection
          title="Token-to-code translation"
          body="BrandSync tokens are automatically converted into framework-ready variables. CSS custom properties for web. Theme objects for mobile. Resource dictionaries for .NET. One source of truth, emitted in the shape your framework expects."
        />

        <SubSection
          title="Full-featured theme"
          body="Light and dark modes. Typography scales. Spacing units. Semantic color systems. Component tokens. Everything your design system needs, delivered as a single, extensible package you can drop into a running project."
        />

        <Divider />

        <SectionHeading
          title="Built into your workflow"
          body="Four characteristics define how Foundations integrates with real projects. None of them require configuration files, manual wiring, or team-specific workarounds."
        />

        <DataTable rows={WORKFLOW_FEATURES} />

        <SectionHeading
          title="Supported frameworks"
          body="Foundations is optimized for the most common modern frameworks used across EG products. More are added monthly based on team requests, so if your stack is not listed, reach out and it gets prioritized."
        />

        <DataTable rows={FRAMEWORKS} />

        <Divider />

        <SectionHeading
          title="From design tokens to production code"
          body="Three steps, about 15 minutes end to end the first time you do it. After the initial install, every subsequent regeneration takes a handful of minutes."
        />

        <DataTable rows={WORKFLOW_STEPS} />

        <SectionHeading
          title="Your complete theme package"
          body="The deliverables that ship with every generation. Five categories, all of them regeneration-safe so updating one does not break the others."
        />

        <DataTable rows={THEME_DELIVERABLES} />

        <Divider />

        <SectionHeading
          title="See it in action"
          body="A React generation produces two primary files: a JavaScript theme object that consumes CSS variables, and a stylesheet that defines those variables with light and dark mode support. Both files are emitted together, and regenerating the theme updates both in lockstep."
        />

        <CodeBlock
          title="theme.js"
          lines={[
            "export const BrandSyncTheme = {",
            "  colors: {",
            "    primary: 'var(--color-primary-default)',",
            "    surface: 'var(--color-surface-primary)',",
            "    text:    'var(--color-text-primary)',",
            "    error:   'var(--color-error-default)',",
            "  },",
            "  spacing: {",
            "    xs: 'var(--space-xs)',",
            "    sm: 'var(--space-sm)',",
            "    md: 'var(--space-md)',",
            "    lg: 'var(--space-lg)',",
            "  },",
            "  typography: {",
            "    h1:    'var(--font-h1)',",
            "    body:  'var(--font-body)',",
            "    small: 'var(--font-small)',",
            "  },",
            "};",
            " ",
            "export function BrandSyncProvider({ children }) {",
            "  return (",
            '    <div className="brandsync-theme">',
            "      {children}",
            "    </div>",
            "  );",
            "}",
          ]}
        />

        <CodeBlock
          title="tokens.css"
          lines={[
            ":root {",
            "  /* Colors */",
            "  --color-primary-default: #534AB7;",
            "  --color-surface-primary: #FFFFFF;",
            "  --color-text-primary:    #1A1A18;",
            "  --color-error-default:   #E24B4A;",
            " ",
            "  /* Spacing */",
            "  --space-xs: 4px;",
            "  --space-sm: 8px;",
            "  --space-md: 16px;",
            "  --space-lg: 24px;",
            " ",
            "  /* Typography */",
            "  --font-h1:    28px;",
            "  --font-body:  14px;",
            "  --font-small: 12px;",
            "}",
            " ",
            "@media (prefers-color-scheme: dark) {",
            "  :root {",
            "    --color-primary-default: #6B5BDA;",
            "    --color-surface-primary: #1A1A18;",
            "    --color-text-primary:    #FFFFFF;",
            "    /* ... remaining dark overrides */",
            "  }",
            "}",
          ]}
        />

        <Divider />

        <SectionHeading
          title="How Foundations fits the ecosystem"
          body="Foundations is the base. Patterns consume it. Brain answers questions about both. Each piece does one thing well, and together they cover the full path from design tokens to shipped screens."
        />

        {/* <ImagePlaceholder /> */}

        <DataTable rows={ECOSYSTEM} />

        <SectionHeading
          title="Getting started"
          body="Foundations has a short list of prerequisites. The total time from zero to a generated theme is about 10 to 15 minutes, and most of that is the one-time MCP install."
        />

        <CodeBlock
          title="Prerequisites"
          lines={[
            "✓ BrandSync MCP Server installed (required)",
            "✓ Your target framework (React, Angular, Flutter, .NET MAUI, .NET WPF)",
            "✓ Basic understanding of your framework's theme system",
            "  Optional: Claude or Claude Code (for pattern generation afterwards)",
          ]}
        />

        <Divider />

        <SectionHeading
          title="Common questions"
          body="Six questions that come up most often when teams evaluate Foundations for the first time."
        />

        <Stack spacing={2.5}>
          {FAQ.map((item, i) => (
            <FaqAccordionItem
              key={item.question}
              question={item.question}
              answer={item.answer}
              expanded={expandedFaq === i}
              onChange={(_, isExpanded) => setExpandedFaq(isExpanded ? i : null)}
            />
          ))}
        </Stack>

        <Divider />

        <PageNav
          prev={{ href: "/mcp/how-it-works/handoff-to-development", label: "Previous" }}
          next={{ href: "/mcp/patterns", label: "Next: Patterns" }}
        />

      </Stack>
    </Box>
  );
}

const WORKFLOW_FEATURES = [
  { left: "Zero manual configuration", right: "Select your framework and generate. The complete theme is ready in minutes with no manual variable definitions, no configuration files to edit, and no hand-off conversations between designers and engineers." },
  { left: "Semantic color system", right: "Colors are organized by context like surfaces, text, and states, not by raw names. Change one semantic token and everything that depends on it updates automatically across the generated theme." },
  { left: "Light and dark mode ready", right: "Both modes are pre-configured using semantic color mapping. No separate theme files, no duplicated definitions. One generation produces two complete, coordinated themes." },
  { left: "Speaks your language", right: "Generated code follows your framework's best practices. React conventions, Flutter patterns, Angular services, XAML resource dictionaries. Never generic, always idiomatic." },
];

const FRAMEWORKS = [
  { left: "React", right: ["Output: CSS variables + theme provider", "Best for: web applications, cross-platform consistency"] },
  { left: "Angular", right: ["Output: Angular services + theme injection", "Best for: enterprise web applications"] },
  { left: "Flutter", right: ["Output: ThemeData objects + Material Design", "Best for: mobile applications, cross-platform mobile"] },
  { left: ".NET MAUI", right: ["Output: resource dictionaries + style resources", "Best for: cross-platform desktop and mobile on .NET"] },
  { left: ".NET WPF", right: ["Output: XAML resources + code-behind", "Best for: Windows desktop applications"] },
  { left: "Not listed?", right: ["Status: coming soon", "Submit a request. Popular frameworks are added monthly."] },
];

const WORKFLOW_STEPS = [
  { left: "1. Install BrandSync MCP", right: "Download and install the MCP server so your design system and local environment can communicate. One-time setup, 5 to 10 minutes." },
  { left: "2. Generate your theme", right: "Select your framework, click generate. Output is a complete theme package covering tokens, colors, typography, and spacing. Takes 2 to 5 minutes and the result is extensible." },
  { left: "3. Build or generate UI", right: "Use the theme to build components manually, or pair it with BrandSync Patterns to generate full screens. Either path produces framework-native code powered by the same theme." },
];

const THEME_DELIVERABLES = [
  { left: "Theme architecture", right: ["Contains: theme structure, hooks, providers", "Framework output: React context provider, Angular service, Flutter ThemeData", "Why it matters: a scalable, maintainable foundation that survives project growth"] },
  { left: "Color system", right: ["Contains: semantic colors (surfaces, text, states) plus light and dark modes", "Framework output: CSS variables, theme objects, resource dictionaries", "Why it matters: consistent meaning across every screen and component"] },
  { left: "Typography", right: ["Contains: font scales, weights, line heights", "Framework output: CSS classes, theme properties, XAML styles", "Why it matters: readable, consistent text hierarchy without reinvention"] },
  { left: "Spacing units", right: ["Contains: standardized spacing scale", "Framework output: utility classes, token objects, resource values", "Why it matters: aligned layout across every screen"] },
  { left: "Component tokens", right: ["Contains: pre-organized tokens for reusable components", "Framework output: ready-to-consume format for the target framework", "Why it matters: plug-and-play component building with zero token drift"] },
];

const ECOSYSTEM = [
  { left: "Foundations", right: "Generates theme architecture. Translates tokens to framework-native code. Produces the executable base every other piece consumes. Run this first." },
  { left: "Patterns", right: "Pre-built UI patterns (login flows, dashboards, forms) that automatically use your Foundations theme. Produces complete screens without hand-wiring tokens. Run this after Foundations." },
  { left: "Brain", right: "AI knowledge assistant. Answers questions about tokens, components, and patterns. Available in Claude and Claude Code. Runs alongside everything else, always on." },
];

const FAQ = [
  { question: "Can I customize the generated theme later?", answer: "Yes. Foundations provides the starting architecture, and it is designed to be extensible. You can modify colors, typography, spacing, and add custom tokens without losing the generated base. Changes propagate automatically the next time you regenerate." },
  { question: "Do I need anything besides the MCP server?", answer: "No. The tool handles framework detection, token mapping, and code generation automatically. Once the MCP server is installed, you are ready to generate." },
  { question: "Can I use the generated theme with BrandSync Patterns?", answer: "Yes, that is the point. Generate your foundation first, then use BrandSync Patterns to produce complete screens. Every pattern automatically uses the theme tokens from your Foundations package." },
  { question: "What if my framework is not listed?", answer: "Submit a request. Popular frameworks are added monthly based on team demand. In the meantime, you can adapt the generated code from the closest supported framework, or reach out to the design-system team for guidance." },
  { question: "Can I have multiple themes (light, dark, custom)?", answer: "Yes. Foundations generates light and dark modes by default using semantic color mapping. You can also create custom themes by extending the generated base without touching the originals." },
  { question: "Will my theme stay up to date if the design system changes?", answer: "Yes. Regenerate your theme anytime the underlying design tokens update. Foundations reflects the latest values automatically, and because everything references tokens, downstream components and patterns pick up the new values without code changes." },
];
