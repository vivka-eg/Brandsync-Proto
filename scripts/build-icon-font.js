#!/usr/bin/env node
/**
 * build-icon-font.js
 *
 * Fetches all published SVG icons from the icons backend and compiles them
 * into an icon font (woff2, woff, ttf) plus a CSS file with named classes.
 *
 * Usage:
 *   node scripts/build-icon-font.js
 *
 * Required env vars (read from .env or the shell):
 *   NEXT_PUBLIC_ICONS_BACKEND_BASE_URL  — base URL of the icons API
 *   ICON_FONT_TOKEN                     — Bearer token for the icons API
 *                                         (get one from Settings → Generate Token)
 *
 * Optional env vars:
 *   ICON_FONT_OUTPUT_DIR   — where to write the font files (default: ./public/fonts/eg-icons)
 *   ICON_FONT_NAME         — font family name (default: eg-icons)
 *   ICON_FONT_PREFIX       — CSS class prefix  (default: eg-icon)
 *   ICON_FONT_PAGE_SIZE    — how many icons to fetch per page (default: 100)
 */

"use strict";

const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

// ---------------------------------------------------------------------------
// Load .env (best-effort — the script also works with real env vars in shell)
// ---------------------------------------------------------------------------
function loadDotEnv() {
  const envPath = path.resolve(__dirname, "../.env");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = val;
  }
}
loadDotEnv();

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const BASE_URL = (process.env.NEXT_PUBLIC_ICONS_BACKEND_BASE_URL || "").replace(/\/$/, "");
const TOKEN = process.env.ICON_FONT_TOKEN || "";
const OUTPUT_DIR = path.resolve(
  process.env.ICON_FONT_OUTPUT_DIR || path.join(__dirname, "../public/fonts/eg-icons")
);
const FONT_NAME = process.env.ICON_FONT_NAME || "eg-icons";
const PREFIX = process.env.ICON_FONT_PREFIX || "eg-icon";
const PAGE_SIZE = parseInt(process.env.ICON_FONT_PAGE_SIZE || "100", 10);

if (!BASE_URL) {
  console.error("ERROR: NEXT_PUBLIC_ICONS_BACKEND_BASE_URL is not set.");
  process.exit(1);
}
if (!TOKEN) {
  console.error(
    "ERROR: ICON_FONT_TOKEN is not set.\n" +
    "Generate a token in Settings → Generate Token and set it as ICON_FONT_TOKEN=<token>."
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Simple HTTP fetch (no external deps beyond what's already installed)
// ---------------------------------------------------------------------------
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === "https:" ? https : http;
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
      path: parsed.pathname + parsed.search,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/json",
      },
    };
    const req = lib.get(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => (raw += chunk));
      res.on("end", () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}\n${raw}`));
          return;
        }
        try {
          resolve(JSON.parse(raw));
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`));
        }
      });
    });
    req.on("error", reject);
  });
}

// ---------------------------------------------------------------------------
// Fetch all icons (paginated)
// ---------------------------------------------------------------------------
async function fetchAllIcons() {
  const icons = [];
  let page = 1;
  let total = null;

  console.log(`\nFetching icons from ${BASE_URL} …`);

  while (true) {
    const url =
      `${BASE_URL}/api/icons` +
      `?pagination[page]=${page}` +
      `&pagination[pageSize]=${PAGE_SIZE}` +
      `&populate=*` +
      `&filters[status][$eq]=PUBLISHED`;

    const res = await fetchJSON(url);

    const batch = res.data ?? [];
    if (batch.length === 0) break;

    icons.push(...batch);

    if (total === null) {
      total = res.meta?.pagination?.total ?? null;
      console.log(`  Total icons reported by API: ${total ?? "unknown"}`);
    }

    console.log(`  Page ${page}: fetched ${batch.length} icons (running total: ${icons.length})`);

    if (batch.length < PAGE_SIZE) break;
    page++;
  }

  return icons;
}

// ---------------------------------------------------------------------------
// Sanitise an icon name into a valid CSS identifier / filename stem
// ---------------------------------------------------------------------------
function sanitiseName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------------------------------------------------------------------------
// Write SVG files to a temp directory
// ---------------------------------------------------------------------------
function writeSvgFiles(icons, tmpDir) {
  fs.mkdirSync(tmpDir, { recursive: true });

  const written = [];
  const nameCount = {};

  for (const icon of icons) {
    const rawContent = icon.icon_content;
    if (!rawContent) continue;

    let svgString;
    // The API sometimes base64-encodes the content
    if (!rawContent.trimStart().startsWith("<")) {
      try {
        svgString = Buffer.from(rawContent, "base64").toString("utf8");
      } catch {
        console.warn(`  WARN: Could not decode icon "${icon.icon_name}" — skipping.`);
        continue;
      }
    } else {
      svgString = rawContent;
    }

    // Ensure it's actually an SVG
    if (!svgString.includes("<svg")) {
      console.warn(`  WARN: Icon "${icon.icon_name}" has no <svg> tag — skipping.`);
      continue;
    }

    let stem = sanitiseName(icon.icon_name || icon.documentId || `icon-${written.length}`);
    if (!stem) stem = `icon-${written.length}`;

    // Deduplicate names
    if (nameCount[stem] !== undefined) {
      nameCount[stem]++;
      stem = `${stem}-${nameCount[stem]}`;
    } else {
      nameCount[stem] = 0;
    }

    const filePath = path.join(tmpDir, `${stem}.svg`);
    fs.writeFileSync(filePath, svgString, "utf8");
    written.push({ stem, filePath });
  }

  return written;
}

// ---------------------------------------------------------------------------
// Generate the font with fantasticon
// ---------------------------------------------------------------------------
async function generateFont(tmpDir) {
  // fantasticon is a CommonJS/ESM hybrid in v3 — require the main entry
  let generateFonts;
  try {
    ({ generateFonts } = require("fantasticon"));
  } catch (e) {
    console.error("ERROR: Could not load fantasticon. Run: npm install --save-dev fantasticon@3");
    throw e;
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`\nGenerating font "${FONT_NAME}" …`);
  console.log(`  Input SVGs : ${tmpDir}`);
  console.log(`  Output     : ${OUTPUT_DIR}`);

  await generateFonts({
    inputDir: tmpDir,
    outputDir: OUTPUT_DIR,
    fontTypes: ["woff2", "woff", "ttf"],
    assetTypes: ["css", "json"],
    name: FONT_NAME,
    prefix: PREFIX,
    selector: `.${PREFIX}`,
    normalize: true,
    fontHeight: 300,
    descent: 0,
  });
}

// ---------------------------------------------------------------------------
// Print usage instructions
// ---------------------------------------------------------------------------
function printUsageInstructions(iconCount) {
  const cssFile = path.join(OUTPUT_DIR, `${FONT_NAME}.css`);
  const relOutput = path.relative(process.cwd(), OUTPUT_DIR);
  const relCss = path.relative(process.cwd(), cssFile);

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Icon font built successfully!
  ${iconCount} icons → ${relOutput}/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HOW TO USE
──────────
1. Import the CSS in your project:

     import '${relCss}';
     /* or in HTML: <link rel="stylesheet" href="/${relOutput}/${FONT_NAME}.css"> */

2. Use icons by class name (matches the icon_name from the API):

     <i class="${PREFIX} ${PREFIX}-arrow-right"></i>
     <i class="${PREFIX} ${PREFIX}-home"></i>

3. The full list of class names is in:
     ${path.join(relOutput, `${FONT_NAME}.json`)}

RE-RUNNING
──────────
  ICON_FONT_TOKEN=<your-token> node scripts/build-icon-font.js

  Add to package.json scripts:
    "build:icon-font": "ICON_FONT_TOKEN=\${ICON_FONT_TOKEN} node scripts/build-icon-font.js"
`);
}

// ---------------------------------------------------------------------------
// Cleanup temp dir
// ---------------------------------------------------------------------------
function cleanup(tmpDir) {
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {
    // non-fatal
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const tmpDir = path.join(require("os").tmpdir(), `eg-icons-${Date.now()}`);

  try {
    const icons = await fetchAllIcons();

    if (icons.length === 0) {
      console.error("\nNo published icons found. Nothing to do.");
      process.exit(1);
    }

    console.log(`\nWriting ${icons.length} SVG files to temp dir …`);
    const written = writeSvgFiles(icons, tmpDir);

    if (written.length === 0) {
      console.error("\nNo valid SVG content found in the fetched icons.");
      process.exit(1);
    }

    if (written.length < icons.length) {
      console.warn(`  WARN: ${icons.length - written.length} icons were skipped (see above).`);
    }

    console.log(`  ${written.length} SVGs ready.`);

    await generateFont(tmpDir);

    printUsageInstructions(written.length);
  } finally {
    cleanup(tmpDir);
  }
}

main().catch((err) => {
  console.error("\nFATAL:", err.message || err);
  process.exit(1);
});
