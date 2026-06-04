"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Tabs,
  Tab,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import { ContentCopy, ArrowBack, Check } from "@mui/icons-material";
import Link from "next/link";

const codeExamples = {
  css: {
    setup: `/* 1. Add your CSS variables to your root stylesheet */
/* Save this file as: styles/tokens.css */

:root {
  /* Primary Palette - Blue */
  --primary-50: #EFF6FF;
  --primary-100: #DBEAFE;
  --primary-200: #BFDBFE;
  --primary-500: #3B82F6;
  --primary-600: #2563EB;
  --primary-700: #1D4ED8;

  /* Typography - Desktop */
  --font-h1-size: 48px;
  --font-h1-line-height: 60px;
  --font-body-md-regular-size: 16px;
  --font-body-md-regular-line-height: 24px;
}

/* For tablet viewport, use media queries */
@media (max-width: 1024px) {
  :root {
    --font-h1-size: 40px;
    --font-h1-line-height: 52px;
  }
}

/* For mobile viewport */
@media (max-width: 768px) {
  :root {
    --font-h1-size: 32px;
    --font-h1-line-height: 44px;
  }
}`,
    usage: `/* 2. Use the CSS variables in your styles */

.button-primary {
  background-color: var(--primary-500);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.button-primary:hover {
  background-color: var(--primary-600);
}

.heading-1 {
  font-size: var(--font-h1-size);
  line-height: var(--font-h1-line-height);
  font-weight: 700;
  color: var(--neutral-900);
}

.card {
  background-color: white;
  border: 1px solid var(--neutral-200);
  border-radius: 12px;
  padding: 24px;
}

.card:hover {
  border-color: var(--primary-200);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}`,
    import: `/* 3. Import in your main stylesheet or HTML */

/* In your main CSS file */
@import './tokens.css';

/* Or in HTML */
<link rel="stylesheet" href="styles/tokens.css">`,
  },
  scss: {
    setup: `// 1. Create a tokens file
// Save this file as: styles/_tokens.scss

// Primary Palette - Blue
$primary-50: #EFF6FF;
$primary-100: #DBEAFE;
$primary-200: #BFDBFE;
$primary-500: #3B82F6;
$primary-600: #2563EB;
$primary-700: #1D4ED8;

// Typography - Desktop
$font-h1-size: 48px;
$font-h1-line-height: 60px;
$font-body-md-regular-size: 16px;
$font-body-md-regular-line-height: 24px;

// Typography maps for responsive design
$typography-desktop: (
  h1-size: 48px,
  h1-line-height: 60px,
  h2-size: 40px,
  h2-line-height: 52px,
);

$typography-tablet: (
  h1-size: 40px,
  h1-line-height: 52px,
  h2-size: 34px,
  h2-line-height: 46px,
);

$typography-mobile: (
  h1-size: 32px,
  h1-line-height: 44px,
  h2-size: 28px,
  h2-line-height: 40px,
);`,
    usage: `// 2. Use the SCSS variables in your styles

@import './tokens';

.button-primary {
  background-color: $primary-500;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: $primary-600;
  }

  &:active {
    background-color: $primary-700;
  }
}

.heading-1 {
  font-size: $font-h1-size;
  line-height: $font-h1-line-height;
  font-weight: 700;

  @media (max-width: 1024px) {
    font-size: map-get($typography-tablet, h1-size);
    line-height: map-get($typography-tablet, h1-line-height);
  }

  @media (max-width: 768px) {
    font-size: map-get($typography-mobile, h1-size);
    line-height: map-get($typography-mobile, h1-line-height);
  }
}`,
    import: `// 3. Import in your main SCSS file

@import './tokens';
@import './components/buttons';
@import './components/typography';`,
  },
  json: {
    setup: `// 1. Save the JSON tokens file
// Save this file as: tokens/theme.json

{
  "theme": "blue",
  "viewport": "desktop",
  "colors": {
    "primary": {
      "50": "#EFF6FF",
      "100": "#DBEAFE",
      "500": "#3B82F6",
      "600": "#2563EB"
    },
    "neutrals": {
      "50": "#F9FAFB",
      "900": "#111827"
    }
  },
  "typography": {
    "headings": {
      "h1": {
        "fontSize": 48,
        "lineHeight": 60,
        "fontWeight": "Bold"
      }
    }
  }
}`,
    usage: `// 2. Import and use in JavaScript/TypeScript

import theme from './tokens/theme.json';

// Access colors
const primaryColor = theme.colors.primary["500"];
const backgroundColor = theme.colors.neutrals["50"];

// Access typography
const h1Styles = {
  fontSize: theme.typography.headings.h1.fontSize,
  lineHeight: \`\${theme.typography.headings.h1.lineHeight}px\`,
  fontWeight: theme.typography.headings.h1.fontWeight === "Bold" ? 700 : 400,
};

// Use with styled-components
const Button = styled.button\`
  background-color: \${theme.colors.primary["500"]};
  &:hover {
    background-color: \${theme.colors.primary["600"]};
  }
\`;

// Use with inline styles in React
<h1 style={h1Styles}>Hello World</h1>`,
    import: `// 3. TypeScript type definitions (optional)

// types/theme.d.ts
interface ThemeColors {
  primary: Record<string, string>;
  neutrals: Record<string, string>;
  success: Record<string, string>;
  error: Record<string, string>;
}

interface ThemeTypography {
  headings: Record<string, {
    fontSize: number;
    lineHeight: number;
    fontWeight: string;
  }>;
}

interface Theme {
  theme: string;
  viewport: string;
  colors: ThemeColors;
  typography: ThemeTypography;
}

declare module './tokens/theme.json' {
  const theme: Theme;
  export default theme;
}`,
  },
  js: {
    setup: `// 1. Save the JS tokens file
// Save this file as: tokens/theme.js

// Blue Theme - Desktop Viewport

export const blueTheme = {
  colors: {
    primary: {
      "50": "#EFF6FF",
      "100": "#DBEAFE",
      "200": "#BFDBFE",
      "500": "#3B82F6",
      "600": "#2563EB",
      "700": "#1D4ED8",
    },
    neutrals: {
      "50": "#F9FAFB",
      "100": "#F3F4F6",
      "900": "#111827",
    },
    success: {
      "500": "#22C55E",
    },
    error: {
      "500": "#EF4444",
    },
  },
  typography: {
    headings: {
      "h1": { fontSize: 48, lineHeight: 60, fontWeight: "Bold" },
      "h2": { fontSize: 40, lineHeight: 52, fontWeight: "Bold" },
      "h3": { fontSize: 32, lineHeight: 44, fontWeight: "Bold" },
    },
    body: {
      "md-regular": { fontSize: 16, lineHeight: 24, fontWeight: "Regular" },
    },
  },
};`,
    usage: `// 2. Import and use in your React/Next.js components

import { blueTheme } from './tokens/theme';

// Create a Button component
function Button({ children, variant = 'primary' }) {
  const styles = {
    backgroundColor: blueTheme.colors.primary["500"],
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: blueTheme.typography.body["md-regular"].fontSize,
  };

  return <button style={styles}>{children}</button>;
}

// Create responsive typography hook
function useTypography(viewport = 'desktop') {
  const themes = {
    desktop: blueTheme,
    tablet: tabletTheme,  // Import tablet theme
    mobile: mobileTheme,  // Import mobile theme
  };

  return themes[viewport].typography;
}

// Usage in component
function Heading({ level = 1, children }) {
  const typography = useTypography();
  const headingKey = \`h\${level}\`;

  const styles = {
    fontSize: typography.headings[headingKey].fontSize,
    lineHeight: \`\${typography.headings[headingKey].lineHeight}px\`,
    fontWeight: 700,
  };

  return <h1 style={styles}>{children}</h1>;
}`,
    import: `// 3. Create a theme provider for your app

import { createContext, useContext } from 'react';
import { blueTheme } from './tokens/theme';

const ThemeContext = createContext(blueTheme);

export function ThemeProvider({ children, theme = blueTheme }) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Usage in your app
function App() {
  return (
    <ThemeProvider theme={blueTheme}>
      <YourApp />
    </ThemeProvider>
  );
}

// In any component
function MyComponent() {
  const theme = useTheme();

  return (
    <div style={{ color: theme.colors.primary["500"] }}>
      Hello World
    </div>
  );
}`,
  },
};

const CodeBlock = ({ code, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton
        onClick={handleCopy}
        size="small"
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          color: "#9CA3AF",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          },
        }}
      >
        {copied ? <Check sx={{ fontSize: 18 }} /> : <ContentCopy sx={{ fontSize: 18 }} />}
      </IconButton>
      <Box
        sx={{
          backgroundColor: "#1F2937",
          borderRadius: 2,
          p: 2.5,
          overflow: "auto",
          maxHeight: 400,
        }}
      >
        <pre
          style={{
            margin: 0,
            color: "#E5E7EB",
            fontSize: "0.8rem",
            fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {code}
        </pre>
      </Box>
    </Box>
  );
};

const Section = ({ title, description, children, step }) => (
  <Box sx={{ mb: 5 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
      {step && (
        <Chip
          label={`Step ${step}`}
          size="small"
          sx={{
            backgroundColor: "#3B82F6",
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        />
      )}
      <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827" }}>
        {title}
      </Typography>
    </Box>
    {description && (
      <Typography sx={{ color: "#6B7280", mb: 2, fontSize: "0.95rem" }}>
        {description}
      </Typography>
    )}
    {children}
  </Box>
);

function ThemeUsageGuide() {
  const [formatTab, setFormatTab] = useState("css");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const handleCopy = () => {
    setSnackbar({ open: true, message: "Code copied to clipboard" });
  };

  const currentExamples = codeExamples[formatTab];

  return (
    <Box sx={{ backgroundColor: "#F9FAFB", minHeight: "100vh", pt: 12, pb: 6 }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Link href="/theme-builder" style={{ textDecoration: "none" }}>
          <Button
            startIcon={<ArrowBack />}
            sx={{
              mb: 4,
              color: "#3B82F6",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#EFF6FF",
              },
            }}
          >
            Back to Theme Builder
          </Button>
        </Link>

        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#111827",
              mb: 1.5,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
            }}
          >
            Theme Usage Guide
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#6B7280",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
              maxWidth: 700,
            }}
          >
            Learn how to implement EG design tokens in your projects. Choose your preferred format and follow the step-by-step instructions below.
          </Typography>
        </Box>

        {/* Format Selection */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: 1,
            borderRadius: 2,
            border: "1px solid #E5E7EB",
            backgroundColor: "#FFFFFF",
            display: "inline-block",
          }}
        >
          <Tabs
            value={formatTab}
            onChange={(_, v) => setFormatTab(v)}
            sx={{
              minHeight: 42,
              "& .MuiTab-root": {
                minHeight: 42,
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.9rem",
                px: 3,
              },
            }}
          >
            <Tab label="CSS Variables" value="css" />
            <Tab label="SCSS" value="scss" />
            <Tab label="JSON" value="json" />
            <Tab label="JS Constants" value="js" />
          </Tabs>
        </Paper>

        {/* Main Content */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: "1px solid #E5E7EB",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Section
            step={1}
            title="Create Your Tokens File"
            description="First, export your tokens from the Theme Builder and save them to a file in your project."
          >
            <CodeBlock code={currentExamples.setup} onCopy={handleCopy} />
          </Section>

          <Section
            step={2}
            title="Use Tokens in Your Styles"
            description="Now you can reference your tokens throughout your codebase for consistent styling."
          >
            <CodeBlock code={currentExamples.usage} onCopy={handleCopy} />
          </Section>

          <Section
            step={3}
            title="Import and Setup"
            description="Make sure to import your tokens file where needed in your project."
          >
            <CodeBlock code={currentExamples.import} onCopy={handleCopy} />
          </Section>

          {/* Tips Section */}
          <Box
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: "#EFF6FF",
              border: "1px solid #BFDBFE",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#1E40AF", mb: 2 }}
            >
              Pro Tips
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.5, color: "#1E40AF" }}>
              <Typography component="li" sx={{ mb: 1, fontSize: "0.9rem" }}>
                <strong>Responsive Typography:</strong> Export tokens for Desktop, Tablet, and Mobile viewports separately and use media queries to switch between them.
              </Typography>
              <Typography component="li" sx={{ mb: 1, fontSize: "0.9rem" }}>
                <strong>Color Accessibility:</strong> All EG color palettes are designed to meet WCAG accessibility standards. Use the provided contrast ratios when pairing colors.
              </Typography>
              <Typography component="li" sx={{ mb: 1, fontSize: "0.9rem" }}>
                <strong>Semantic Colors:</strong> Use semantic colors (success, error, warning, information) for their intended purposes to maintain consistency across products.
              </Typography>
              <Typography component="li" sx={{ mb: 1, fontSize: "0.9rem" }}>
                <strong>Version Control:</strong> Keep your tokens file in version control so the entire team uses the same design values.
              </Typography>
              <Typography component="li" sx={{ fontSize: "0.9rem" }}>
                <strong>Overriding Styles:</strong> To override existing styles, define your custom values after importing the tokens file. CSS variables can be overridden by redefining them in a more specific selector or later in the cascade. For SCSS/JS, simply reassign the values in your component-specific files.
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* CTA Section */}
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography
            sx={{ color: "#6B7280", mb: 2, fontSize: "0.95rem" }}
          >
            Ready to generate your theme tokens?
          </Typography>
          <Link href="/theme-builder" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#111827",
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "#1F2937",
                },
              }}
            >
              Go to Theme Builder
            </Button>
          </Link>
        </Box>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ThemeUsageGuide;
