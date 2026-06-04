"use client";
import React, { useState, useRef, useEffect } from "react";
import { Box, Stack, Typography, Chip, Tabs, Tab, ToggleButton, ToggleButtonGroup, IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import SyntaxHighlighter from "@/components/shared/SyntaxHighlight";

// Module-level cache — fetched once, reused across all previews
let _tokensCss = null;
let _tokensFetch = null;
function fetchTokensCss() {
  if (_tokensCss) return Promise.resolve(_tokensCss);
  if (!_tokensFetch) {
    _tokensFetch = fetch("/api/tokens")
      .then((r) => r.text())
      .then((css) => { _tokensCss = css; return css; });
  }
  return _tokensFetch;
}

// Split a code blob into { html, css, js }
function parseCodeParts(code = "") {
  const cssMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const jsMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  const cssText = cssMatch ? cssMatch[1].trim() : "";
  const jsText = jsMatch ? jsMatch[1].trim() : "";
  const htmlText = code
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .trim();
  return { html: htmlText, css: cssText, js: jsText };
}

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);
  return (
    <Tooltip title={copied ? "Copied!" : "Copy"}>
      <IconButton
        size="small"
        onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        sx={{ color: "text.secondary" }}
      >
        {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}

function CodeBlock({ code: rawCode }) {
  const theme = useTheme();
  const { html, css: cssText, js } = parseCodeParts(rawCode);
  const tabs = [
    html && { label: "HTML", lang: "xml", code: html },
    cssText && { label: "CSS", lang: "css", code: cssText },
    js && { label: "JS", lang: "javascript", code: js },
  ].filter(Boolean);

  const [activeTab, setActiveTab] = useState(0);
  if (!tabs.length) return null;

  const current = tabs[activeTab] ?? tabs[0];

  return (
    <Box sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid", borderColor: "divider", maxWidth: 720, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 1, borderBottom: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{ minHeight: 36, "& .MuiTab-root": { minHeight: 36, textTransform: "none", fontWeight: 500, fontSize: 13, px: 2 } }}
        >
          {tabs.map((t) => <Tab key={t.label} label={t.label} />)}
        </Tabs>
        <CopyButton code={current.code} />
      </Box>
      <SyntaxHighlighter
        language={current.lang}
        customStyle={{
          backgroundColor: theme.palette.neutral?.light ?? "#f5f5f5",
          margin: 0,
          padding: "16px",
          fontSize: 13,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          maxHeight: 320,
          overflowY: "auto",
        }}
      >
        {current.code}
      </SyntaxHighlighter>
    </Box>
  );
}

const SIZES = {
  SM: { padding: "6px 14px",  fontSize: "12px", borderRadius: "6px"  },
  MD: { padding: "10px 20px", fontSize: "14px", borderRadius: "8px"  },
  LG: { padding: "12px 24px", fontSize: "16px", borderRadius: "8px"  },
  XL: { padding: "16px 32px", fontSize: "18px", borderRadius: "10px" },
};

function normalizeSizeKey(val = "") {
  const v = val.toUpperCase().trim();
  if (SIZES[v]) return v;
  const map = { SMALL: "SM", MEDIUM: "MD", LARGE: "LG", XLARGE: "XL", "X-LARGE": "XL", "EXTRA LARGE": "XL" };
  return map[v] ?? null;
}

function LivePreview({ code, isDark, onToggle, size = "MD", sizeKeys, activeSize, onSizeChange }) {
  const hostRef = useRef(null);
  const [tokensCss, setTokensCss] = useState(_tokensCss ?? "");
  const bg = isDark ? "#2C2C2E" : "#F8F9FA";
  const borderColor = isDark ? "#333" : "#e0e0e0";
  const { padding, fontSize, borderRadius } = SIZES[size] ?? SIZES.MD;

  // Fetch tokens once; if already cached, useState initialised it above
  useEffect(() => {
    if (!_tokensCss) fetchTokensCss().then(setTokensCss);
  }, []);

  useEffect(() => {
    if (!tokensCss) return;
    const host = hostRef.current;
    if (!host) return;
    const shadow = host.shadowRoot ?? host.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>${tokensCss}</style>
      <style>
        :host {
          display: block; width: 100%; background: ${bg};
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          /* Shadow elevation tokens (no --bs- equivalent in package yet) */
          --bs-shadow-elevation-none: none;
          --bs-shadow-elevation-xs: 0 1px 2px rgba(33,38,46,0.06), 0 1px 3px rgba(33,38,46,0.10);
          --bs-shadow-elevation-sm: 0 1px 3px rgba(33,38,46,0.08), 0 2px 6px rgba(33,38,46,0.12);
          --bs-shadow-elevation-md: 0 2px 8px rgba(33,38,46,0.10), 0 4px 16px rgba(33,38,46,0.16);
          --bs-shadow-elevation-lg: 0 4px 16px rgba(33,38,46,0.12), 0 8px 32px rgba(33,38,46,0.20);
          --bs-shadow-elevation-xl: 0 8px 24px rgba(33,38,46,0.14), 0 16px 48px rgba(33,38,46,0.24);
          --bs-shadow-elevation-2xl: 0 16px 48px rgba(33,38,46,0.20), 0 32px 64px rgba(33,38,46,0.32);
          /* --bs-border-radius-full override: package uses 120px, pill needs 9999px */
          --bs-border-radius-full: 9999px;
        }
        .preview-inner { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: center; padding: 48px 32px 32px; min-height: 140px; }
        * { box-sizing: border-box; }
      </style>
      <div class="preview-inner"${isDark ? ' data-theme="dark"' : ''}>${code}</div>
      <style>.btn { padding: ${padding} !important; font-size: ${fontSize} !important; border-radius: ${borderRadius} !important; } .chip { padding: ${padding} !important; font-size: ${fontSize} !important; }</style>
    `;

    // innerHTML never executes <script> tags — re-run them with document scoped to shadow root
    shadow.querySelectorAll("script").forEach((s) => {
      try {
        new Function("document", s.textContent)({
          querySelectorAll: (sel) => shadow.querySelectorAll(sel),
          querySelector: (sel) => shadow.querySelector(sel),
          getElementById: (id) => shadow.getElementById ? shadow.getElementById(id) : shadow.querySelector(`#${id}`),
        });
      } catch (e) { /* ignore script errors in preview */ }
    });
  }, [code, bg, isDark, padding, fontSize, borderRadius, tokensCss]);

  return (
    <Box
      sx={{ position: "relative", borderRadius: 2, overflow: "hidden", border: "1px solid", borderColor, maxWidth: 720, mx: "auto", transition: "border-color 0.2s" }}
    >
      {/* Size tabs — top left */}
      {sizeKeys?.length > 1 && (
        <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}>
          <ToggleButtonGroup
            value={sizeKeys[activeSize]}
            exclusive
            onChange={(_, val) => { if (val != null) onSizeChange(sizeKeys.indexOf(val)); }}
            size="small"
            sx={{
              bgcolor: isDark ? "#2a2a2a" : "white",
              borderRadius: "8px",
              "& .MuiToggleButton-root": {
                border: "none", borderRadius: "8px !important", px: 1.2, py: 0.5,
                fontSize: 12, fontWeight: 500,
                color: isDark ? "#aaa" : "#666",
                "&.Mui-selected": { bgcolor: isDark ? "#444" : "#f0f0f0", color: isDark ? "#fff" : "#111" },
              },
            }}
          >
            {sizeKeys.map((s) => <ToggleButton key={s} value={s}>{s}</ToggleButton>)}
          </ToggleButtonGroup>
        </Box>
      )}
      {/* Dark/light toggle — top right */}
      <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
        <ToggleButtonGroup
          value={isDark ? "dark" : "light"}
          exclusive
          onChange={(_, val) => { if (val) onToggle(val === "dark"); }}
          size="small"
          sx={{
            bgcolor: isDark ? "#2a2a2a" : "white",
            borderRadius: "8px",
            "& .MuiToggleButton-root": {
              border: "none", borderRadius: "8px !important", px: 1, py: 0.5,
              color: isDark ? "#aaa" : "#666",
              "&.Mui-selected": { bgcolor: isDark ? "#444" : "#f0f0f0", color: isDark ? "#fff" : "#111" },
            },
          }}
        >
          <ToggleButton value="light"><LightModeIcon sx={{ fontSize: 16 }} /></ToggleButton>
          <ToggleButton value="dark"><DarkModeIcon sx={{ fontSize: 16 }} /></ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box ref={hostRef} component="div" sx={{ display: "block", width: "100%" }} />
    </Box>
  );
}

function VariantPanel({ examples, sizeKeys }) {
  const [isDark, setIsDark] = useState(false);
  const [activeVariant, setActiveVariant] = useState(0);
  const [activeSize, setActiveSize] = useState(0);
  const current = examples[activeVariant] ?? examples[0];

  return (
    <Stack spacing="20px">
      {/* Variant chips */}
      {examples.length > 1 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {examples.map((ex, i) => (
            <Chip
              key={i}
              label={ex.Variant || `Variant ${i + 1}`}
              onClick={() => setActiveVariant(i)}
              variant={activeVariant === i ? "filled" : "outlined"}
              sx={{
                cursor: "pointer",
                fontWeight: activeVariant === i ? 600 : 400,
                bgcolor: activeVariant === i ? "primary.main" : "transparent",
                color: activeVariant === i ? "white" : "text.primary",
                borderColor: activeVariant === i ? "primary.main" : "divider",
                "&:hover": { bgcolor: activeVariant === i ? "primary.dark" : "action.hover" },
              }}
            />
          ))}
        </Box>
      )}

      {/* Live preview */}
      {current?.Code && (
        <LivePreview
          code={current.Code}
          isDark={isDark}
          onToggle={setIsDark}
          size={sizeKeys[activeSize]}
          sizeKeys={sizeKeys}
          activeSize={activeSize}
          onSizeChange={setActiveSize}
        />
      )}

      {/* Code block with HTML / CSS / JS tabs */}
      {current?.Code && <CodeBlock code={current.Code} />}
    </Stack>
  );
}

function CodeExamples({ codeExamples, specification }) {
  const [activeGroup, setActiveGroup] = useState(0);

  // Extract size keys from Specification, fallback to standard set
  const sizeKeys = (() => {
    if (specification?.SpecificationSizePresent && specification.SpecificationElement?.length) {
      const keys = specification.SpecificationElement
        .map((el) => normalizeSizeKey(el.SizeValue))
        .filter(Boolean);
      if (keys.length) return keys;
    }
    return ["MD"];
  })();

  if (!codeExamples?.length) {
    return (
      <Stack spacing="24px" alignItems="center" sx={{ py: 8 }}>
        <Typography variant="h6" color="text.secondary">No code examples yet</Typography>
        <Typography variant="body2" color="text.disabled" textAlign="center" maxWidth={400}>
          Code examples will be added to this component soon.
        </Typography>
      </Stack>
    );
  }

  const htmlExamples = codeExamples.filter((ex) => (ex.Framework ?? "HTML") === "HTML");
  const examples = htmlExamples.length ? htmlExamples : codeExamples;

  // Check if any example has a Group — if so, use group tabs
  const hasGroups = examples.some((ex) => ex.Group);

  if (hasGroups) {
    // Build ordered unique group names (preserving first-seen order)
    const groupNames = [];
    examples.forEach((ex) => {
      const g = ex.Group || "Other";
      if (!groupNames.includes(g)) groupNames.push(g);
    });
    const groupExamples = groupNames.map((g) => examples.filter((ex) => (ex.Group || "Other") === g));
    const safeGroup = Math.min(activeGroup, groupNames.length - 1);

    return (
      <Stack spacing="20px">
        <Tabs
          value={safeGroup}
          onChange={(_, v) => setActiveGroup(v)}
          sx={{ borderBottom: "1px solid", borderColor: "divider", "& .MuiTab-root": { textTransform: "none", fontWeight: 500 } }}
        >
          {groupNames.map((g) => <Tab key={g} label={g} />)}
        </Tabs>
        <VariantPanel key={groupNames[safeGroup]} examples={groupExamples[safeGroup]} sizeKeys={sizeKeys} />
      </Stack>
    );
  }

  // No groups — render flat variant chips as before
  return <VariantPanel examples={examples} sizeKeys={sizeKeys} />;
}

export default CodeExamples;
