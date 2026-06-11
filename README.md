# BrandSync Make (Proto)

**Describe an idea, and BrandSync Make builds the UI from your design system.**

BrandSync Make is an AI design tool: a product manager or designer types a prompt
("a dashboard with active/archived tabs", "a sign-in card") and the app generates
on-brand **HTML/CSS** grounded in EG's real design system — its components, design
tokens, and reference patterns — instead of generic AI output.

This repo is a **standalone prototype** carved out of the larger `eg-brandsync`
app, trimmed to just the Make experience. It does not depend on Keycloak, Strapi
CMS, or WordPress to run.

---

## How it works

```
Prompt  →  /api/generate  →  BrandSync MCP (design-system grounding)  →  scoped patch  →  live preview
                │                                                              │
                └── Anthropic (Claude) tool-use loop ──────────────────────────┘
```

1. **Prompt bar** ([src/feature/brandsync-make/BrandsyncMakePage.jsx](src/feature/brandsync-make/BrandsyncMakePage.jsx)) — describe the idea, pick a model, optionally attach a project/org context.
2. **Workbench** ([src/app/brandsync-make/my-patterns/page.js](src/app/brandsync-make/my-patterns/page.js)) — chat panel + sandboxed live `<iframe>` preview + source editor, with click-to-edit inspect mode and live theme/palette injection.
3. **Generation** ([src/app/api/generate/route.js](src/app/api/generate/route.js)) — the core:
   - Opens an MCP session ([src/lib/mcp-client.js](src/lib/mcp-client.js)) and lets Claude call read tools (`list_components`, `get_component`, `get_pattern`, `search_guidelines`, `get_tokens`) so output uses real `--bs-*` tokens and pre-built `.bs-*` kit classes.
   - Runs a tool-use loop with Anthropic prompt caching.
   - Claude returns a **scoped-patch envelope** (`edit` / `css-only` / `section` / `full` / `chat`) that [src/lib/patch.js](src/lib/patch.js) folds into the existing pattern — so small edits cost ~30–50× less than re-emitting the whole thing.
   - Persists to `corpus_entries` (Postgres) and logs token usage (incl. cache-write cost) to `tool_usage_logs`.

## Tech stack

- **Next.js 15** (App Router, Turbopack) · **React 19** · **MUI v7** + Emotion · JavaScript
- **Postgres** (`pg`) — projects, patterns, orgs, usage telemetry
- **Anthropic API** (Claude) — generation
- **BrandSync MCP server** — design-system retrieval (graph-backed; separate repo, hosted at `mcp.proto.brand.egsync.com`)

## Routes

| Route | Purpose |
|-------|---------|
| `/` → `/brandsync-make` | Make landing (prompt bar) |
| `/brandsync-make/my-patterns` | The generation workbench (chat + preview + editor) |
| `/brandsync-make/kit` · `/usage` | Component kit · usage/cost dashboards |
| `/mcp` | MCP documentation (getting started, how-it-works, patterns) |
| `/brandsync-stats` | Live metrics from the design-system graph |
| `/settings` | Profile, token generation, MCP analytics |

## Getting started

```bash
cp .env.example .env.local   # then fill in the values below
npm install
npm run dev                  # http://localhost:3000  (redirects to /brandsync-make)
```

`npm run build` / `npm run start` for production; `npm run lint` for ESLint.

### Environment

The Make flow needs three external services (see `.env.example` for the full list):

| Var | What |
|-----|------|
| `DATABASE_URL` | Postgres holding corpus/patterns/projects/orgs/usage |
| `CLAUDE_API_KEY` | Anthropic API key (generation) |
| `MCP_SERVER_URL` + `MCP_SERVICE_TOKEN` | BrandSync MCP server the generation route calls (server-side) |
| `NEXT_PUBLIC_BRANDSYNC_MCP_URL` | MCP base URL used client-side |
| `NEXT_PUBLIC_APP_ENV` | `local` / `dev` / `prod` |

> Secrets live in `.env.local` (gitignored); only `.env.example` is committed.

## Architecture notes

- **Folder layout** follows [Bulletproof React](https://github.com/alan2207/bulletproof-react) (adapted): `feature/` for product code, `app/` for thin route wrappers + API handlers, shared `components/`/`hooks/`/`lib/`. See [CLAUDE.md](CLAUDE.md) for the full guide.
- **Multi-tenant:** content is scoped by **org** (`org_members`), grouped into **projects**; a shared component **kit** can have per-org approved overrides.
- **Handoff pipeline:** a ticket-keyed design→code pipeline (`save_handoff` / `load_handoff` / `get_attempt_history` on the MCP) lets accepted solutions and detected gaps feed back into the corpus.
- **Auth is currently mocked** (`BYPASS_AUTH` in [src/hooks/useAuth.jsx](src/hooks/useAuth.jsx)) — a fixed SUPERADMIN dev user. Real Keycloak login is not wired in this build.
