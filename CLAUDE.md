# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EG BrandSync is a brand management and design system platform. This is the **frontend**; a Next.js 15 app using React 19, Material-UI v7, and Emotion for styling.

## Commands

```bash
npm run dev          # Start dev server with Turbopack (port 3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint (flat config, next/core-web-vitals)
```

There is no test framework configured.

## Architecture

### Routing & Layout

Next.js App Router. The provider hierarchy in the root layout is:

```
ThemeRegistry (Emotion cache + ThemeProvider) → SkipLink → ToastProvider → AuthContextProvider → ClientLayout → {children}
```

- `ThemeRegistry` (`components/ThemeRegistry.js`) sets up the Emotion cache for SSR and wraps `ThemeProvider` from `theme/ThemeContext.js` internally.
- `ClientLayout` is a loading wrapper that shows a `Loader` on initial render.
- `SkipLink` is an accessibility skip-navigation element rendered before the main content.

Auth route group: `(auth)/login`. Major route segments:

| Route | Notes |
|-------|-------|
| `/` | Home page |
| `/assets` | Asset management |
| `/brand-guideline` | Brand guidelines |
| `/design-system` | Design system (nested: components, foundations, accessibility, etc.) |
| `/digital-assets` | Digital assets (nested: stock-images, upload) |
| `/faqs` | FAQs |
| `/figma-kit` | Figma Kit (nested: agent-skills, figma-make, figma-plugins) |
| `/governance` | Governance |
| `/logos` | Logo management (nested: `/logos/upload`, `/logos/manage`) |
| `/mcp` | MCP section (nested: foundations, getting-started, patterns, patterns/upload) |
| `/mcp-coming-soon` | MCP coming soon placeholder |
| `/roadmap` | Roadmap |
| `/settings` | Settings (nested: profile, generate-token) |
| `/sitemap` | Site map |
| `/support` | Support |
| `/theme-builder` | Theme builder tool |

> **Note:** `/mcp` and `/settings` pages are conditionally rendered based on environment (`NEXT_PUBLIC_APP_ENV`).

### State Management

React Context API only; no Redux or Zustand. Key contexts:
- **AuthContext** (`context/auth/`); user, role, auth state. Keycloak-based but **disabled in dev** with a mock SUPERADMIN user.
- **ToastContext** (`context/shared/`); toast notifications
- **ThemeContext** (`theme/ThemeContext.js`); light/dark mode, persisted to localStorage. Exports `useTheme` hook. Wrapped inside `ThemeRegistry`, not in the root layout directly.
- **AccessiblePaletteContext** (`context/design-system/`); accessible palette state
- **McpContext** (`context/mcp/`); MCP authentication and state
- Feature-specific contexts in `context/assets/icons/` for icon management

Each context exports a custom hook (e.g., `useAuthContext`) that throws if used outside its provider.

### API Layer

Three separate API integrations:

1. **Assets API** (`api/assets/`); Custom `ApiRequest` class wrapping axios. Instance created at `api/assets/instance.js` using `NEXT_PUBLIC_ICONS_BACKEND_BASE_URL`. Endpoints: icons, categories, types, tags, downloads, digital-assets, dashboard, users.

2. **Design System / Strapi API** (`api/design-system/`); `ApiHandler` class using `@strapi/client`. Initialized via `NEXT_PUBLIC_STRAPI_API_URL` with a token fetched from the `/api/env` route. Endpoints: components, foundations, logos, logo-upload, product-logos, accessibility, color-palette, introduction, for-designers, design-philosophy, image-gallery, old-logo-placement. Population strategies defined in `strapi/populate.js`.

3. **MCP API** (`api/mcp/`); Axios instance at `api/mcp/instance.js` using `NEXT_PUBLIC_BRANDSYNC_MCP_URL`. Bearer token managed in-memory via `setMcpToken`/`clearMcpToken`. Endpoints: auth, admin (business-units, categories, components), client (components).

Next.js API routes at `app/api/` act as server-side proxies and utilities:

| Route | Purpose |
|-------|---------|
| `/api/env` | Expose server-side env vars to client |
| `/api/proxy-image` | Image proxy |
| `/api/digital-assets` + `/api/digital-assets/[id]` + `/api/digital-assets/upload` | Digital assets CRUD |
| `/api/logos/upload` + `/api/logos/[id]` | Logo upload and edit/delete |
| `/api/palettes/generate`, `/api/palettes/primary-shades`, `/api/palettes/semantics`, `/api/palettes/[colorName]` | Palette generation |
| `/api/ai/image-metadata` + `/api/ai/suggest-tags` | AI image analysis |
| `/api/categories` | Categories |
| `/api/cookie` | Cookie management |
| `/api/download-asset` + `/api/download-count` | Asset downloads |
| `/api/support/create` | Support ticket creation |

### Feature Modules

`src/feature/` contains self-contained feature areas. Each feature is a flat folder — one level only, no nesting. Examples:
- **theme-builder/**; Interactive token builder with 14 brand colors, token export (CSS/SCSS/JSON/JS), component preview, semantic tokens, typography preview
- **assets/**; Asset management features
- **digital-ad-builder/**; Digital ad builder with its own api/, components/, hooks/, lib/

### Styling & Theme

MUI v7 with Emotion. Theme config split across `src/theme/`:
- `palettes.js`; light/dark color definitions
- `typography.js`; Roboto font configuration
- `componentOverrides.js`; MUI component style overrides (focus-visible states, custom tab/radio/chip styles)
- `themeConfig.js`; `createAppTheme()` combining the above

`ThemeRegistry` (`components/ThemeRegistry.js`) sets up the Emotion cache for SSR compatibility and internally renders `ThemeProvider` from `theme/ThemeContext.js`.

### Path Alias

`@/*` maps to `./src/*` (configured in `jsconfig.json`).

### Environment Detection

`useAppEnv` hook returns `{ env, isDev, isStage, isProd }` based on `NEXT_PUBLIC_APP_ENV`. Features like Digital Assets, MCP, and Settings are conditionally rendered by environment.

### Authentication

Keycloak is fully active in all environments:
- **Client-side** (`lib/keycloak.js`); initialises Keycloak with `check-sso` (silently detects an existing SSO session; does not redirect unauthenticated users on public pages). Exports `getKeycloakInstance`, `login`, `logout`, `getUserProfile`, `getToken`.
- **Server-side** (`lib/auth/keycloak.js`); JWT verification utility used in Next.js API routes to validate Bearer tokens and check roles via JWKS.

Roles: `SUPERADMIN`, `ADMIN`, `USER` (derived from Keycloak realm/client roles).

The MCP section has its own token-based auth (`api/mcp/auth/`) managed via `McpContext`.

### Animations

GSAP (with ScrollTrigger) and Motion (Framer Motion) are both used. Shared animation variants/configs live in `utils/animations.js`.

### Agent Skills Reference

Agent skills documentation lives under `/figma-kit/agent-skills`. Design system token references for AI agents are in `.agents/skills/brandsync-design-system/references/`; includes token values, typography specs, and semantic token documentation.

## Folder Structure

Based on [Bulletproof React](https://github.com/alan2207/bulletproof-react) principles, adapted for this Next.js 15 App Router project.

```
src/
├── app/                    # Next.js App Router — routes and server-side API handlers only
│   ├── (auth)/             # Auth route group (login)
│   ├── api/                # Server-side route handlers (proxies, AI, palettes, etc.)
│   ├── design-system/      # Route segment with its own layout.js
│   ├── ...                 # Other route segments (one folder per route)
│   ├── layout.js           # Root layout — provider hierarchy lives here
│   └── page.js             # Home page
│
├── api/                    # Client-side API integrations (fetchers, not hooks)
│   ├── assets/             # Assets backend (ApiRequest/axios)
│   ├── design-system/      # Strapi CMS (ApiHandler/@strapi-client)
│   └── mcp/                # MCP service (axios + in-memory token)
│
├── components/             # Shared UI components used across multiple features
│   ├── design-system/      # Components shared across design-system routes
│   └── shared/             # App-wide reusable primitives (LazyImage, Loader, etc.)
│
├── constants/              # App-wide constants, enums, and shared config values
│
├── context/                # Global state via React Context (equivalent to BP stores/)
│   ├── auth/               # Auth state (Keycloak)
│   ├── assets/             # Asset/icon management state
│   ├── design-system/      # Accessible palette state
│   ├── mcp/                # MCP auth and state
│   └── shared/             # Toast notifications
│
├── feature/                # Feature modules — the primary home for new product code
│   ├── [feature-name]/     # one folder per feature — code lives directly here
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── utils/
│   │   └── lib/            # only if needed
│   └── ...                 # e.g. assets/, logo-table/, logo-upload/, mcp-foundations/, etc.
│
├── hooks/                  # Shared hooks used across multiple features (useAppEnv, etc.)
│
├── lib/                    # Pre-configured third-party library wrappers
│   └── auth/               # Keycloak client and server-side JWT verification
│
├── strapi/                 # Strapi-specific utilities: getStrapiURL, populate configs
│
├── theme/                  # MUI theme: palettes, typography, componentOverrides, themeConfig
│
└── utils/                  # Pure shared utility functions (animations, helpers)
```

### Feature Module Structure

Every feature is a flat folder directly inside `src/feature/`. There is no nesting — no "main feature / sub-feature" hierarchy.

```
src/feature/
└── [feature-name]/    # one level only — code lives directly here
    ├── components/
    ├── hooks/
    ├── api/
    ├── utils/
    └── lib/           # only if needed
```

Only include the folders that the feature actually needs — don't pre-create empty directories.

### Where Does New Code Go?

| What you're adding | Where it lives |
|--------------------|----------------|
| A new feature | `src/feature/[feature-name]/` — code lives directly inside it |
| A new page/route | `src/app/[route]/page.js` — thin wrapper importing from the feature |
| A new server-side endpoint | `src/app/api/[endpoint]/route.js` |
| A component used only within one feature | `src/feature/[feature-name]/components/` |
| A component shared between 2+ features | `src/components/shared/` |
| A hook used only within one feature | `src/feature/[feature-name]/hooks/` |
| A hook shared across multiple features | `src/hooks/` |
| API fetchers for a specific feature | `src/feature/[feature-name]/api/` |
| API fetchers shared across multiple features | `src/api/[service]/` |
| Global state (new context) | `src/context/[domain]/` |
| A constant or enum | `src/constants/` |
| A pure utility function | `src/utils/` |

### Deviations from Bulletproof React

| BP-React standard | This project | Reason |
|---|---|---|
| `features/` (plural) | `feature/` (singular) | Existing convention — keep consistent |
| `stores/` for global state | `context/` with React Context | No Redux/Zustand; Context-only by design |
| kebab-case filenames | PascalCase for components (`.jsx`/`.js`), camelCase for hooks/utils | Established codebase convention |
| No cross-feature imports | Not enforced via ESLint yet | Avoid importing `feature/A` from `feature/B`; compose at the route level |
| Barrel files discouraged | Used sparingly | Avoid adding new barrel `index.js` files in shared component folders |

### Key Architectural Rules

1. **Unidirectional flow**: `utils/hooks/lib` → `components/context/api` → `feature/` → `app/`
2. **No cross-feature imports**: Features must not import from each other. Shared logic belongs in `components/`, `hooks/`, or `utils/`.
3. **`app/` is routing only**: Page files in `app/` should be thin wrappers that import from `feature/`. Business logic lives in `feature/`, not in `page.js` files.
4. **Colocate by feature**: If a component, hook, or util is only used inside one feature, it belongs inside that feature's folder — not in the shared `components/` or `hooks/` folders.

## Environment Variables

Copy `.env.example` and fill in:
- `NEXT_PUBLIC_KEYCLOAK_*`; Keycloak auth config
- `STRAPI_API_TOKEN` / `NEXT_PUBLIC_STRAPI_API_URL` / `NEXT_PUBLIC_STRAPI_URL`; Strapi CMS
- `NEXT_PUBLIC_ICONS_BACKEND_BASE_URL`; Assets API (default: localhost:8000)
- `NEXT_PUBLIC_BRANDSYNC_MCP_URL`; MCP service base URL
- `NEXT_PUBLIC_INTERNAL_API_URL`; Internal API URL
- `NEXT_PUBLIC_APP_ENV`; dev/stage/prod
- `CLAUDE_API_KEY`; AI image analysis (Anthropic Claude)

## Key Conventions

- JavaScript only (no TypeScript); uses `jsconfig.json` for path aliases
- All client components use `"use client"` directive
- Components use PascalCase filenames (`.jsx` or `.js`)
- Hooks use `use` prefix with camelCase
- Shared/reusable UI components live in `components/shared/`
- Feature-specific components live within their `feature/` directory
- Git workflow: feature branches → `dev` → `main`
