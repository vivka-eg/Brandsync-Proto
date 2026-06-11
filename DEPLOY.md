# Deploying BrandSync Make

This app is **one of three services**. Hosting is split because they have different
runtime needs:

```
Browser
 └─ Vercel  ── Next.js: landing/studio + /api routes        (frontend + API layer)
      ├─ Anthropic API            generation (streamed)
      ├─ MCP server               design-system grounding + handoffs   ← separate host
      └─ Supabase Postgres        projects · usage · handoffs · corpus  ← shared DB
                                   + component kit + product logos
                MCP server ───────► Supabase Postgres (same DB)
```

| Service | What it is | Where it goes | Why |
|---|---|---|---|
| **Next app** (this repo) | Frontend + `/api` routes | **Vercel** | Native Next host; streaming + serverless functions |
| **MCP server** (separate repo, currently `localhost:3002`) | Design-system grounding + handoffs | **A persistent container host** (Cloud Run / Railway / Render / Fly) | It holds **stateful sessions** (`mcp-session-id`) — serverless would lose them |
| **Postgres** | corpus, projects, usage, handoffs, **component kit, logos** | **Supabase** (managed) | Single data layer; shared by the app *and* the MCP |

> **Strapi has been cut.** The component kit + product logos now live in Supabase
> (`kit_components`, `product_logos` — logos stored as base64 data URIs). No Strapi
> service or `STRAPI_*` tokens are needed. To refresh the kit/logos from a Strapi
> source again, re-run `scripts/migrate-strapi-to-supabase.mjs`.

---

## 1. Supabase (database) — shared by both the app and the MCP

Already hosted. Two connection strings matter:

- **Session pooler** (`...:5432`) — fine for the MCP server (persistent process) and local dev.
- **Transaction pooler** (`...:6543`) — **use this for Vercel.** It's built for many short-lived
  serverless connections. node-postgres works with it because our queries use unnamed
  parameterized statements (no server-side prepared statements).

No schema changes needed for deploy — the app + MCP already share these tables
(`corpus_entries`, `projects`, `project_files`, `handoffs`, `tool_usage_logs`, …).

---

## 2. MCP server (the backend) — host it yourself, not on Vercel

The MCP server is a **long-running, session-stateful** service (Streamable HTTP: it
returns an `mcp-session-id` on `initialize` and remembers it). It **cannot** run on
Vercel serverless. Deploy it as a container.

**Recommended: Google Cloud Run** (long-running, native SSE, scales to zero, cheap).
Railway / Render / Fly.io / a small VM all work too.

Steps (in the MCP server repo, not this one):
1. Containerize it (Dockerfile exposing its HTTP port).
2. Deploy to Cloud Run with **min instances ≥ 1** (or sticky routing) so sessions survive,
   and concurrency > 1 is fine for a single persistent instance.
3. Give it env: `DATABASE_URL` (Supabase **session** pooler `:5432`), `MCP_SERVICE_TOKEN`
   (the bearer token the Next app sends), plus whatever graph/data creds it needs.
4. Note the public URL, e.g. `https://brandsync-mcp-xxxx.run.app`.

That URL + token become `MCP_SERVER_URL` / `MCP_SERVICE_TOKEN` in the Vercel app (below).

> If the MCP is ever scaled to multiple instances, move its session store out of memory
> (Redis) or enable sticky sessions — otherwise `mcp-session-id` lookups miss across instances.

---

## 3. Next app on Vercel

### Code changes already made for serverless
- **`maxDuration = 300`** on `/api/generate` (Vercel Pro serverless max; raise via Fluid compute).
- **`GENERATION_DEADLINE_MS` defaults to 285s** (env-overridable) so generation aborts with a
  clean message *before* Vercel hard-kills the function. Big builds that exceed ~285s will
  fail — split them, or move to a host with a higher limit and set the env to `600000`.
- **`PG_POOL_MAX` env** (default 5) — set to **1** on Vercel and use the transaction pooler.

### Vercel setup
1. Import the repo in Vercel. Framework auto-detects as Next.js. Build: `next build` (default).
2. Add the env vars below (Project → Settings → Environment Variables).
3. Deploy.

### Required env vars (Vercel)
| Var | Value | Notes |
|---|---|---|
| `DATABASE_URL` | Supabase **transaction** pooler `...:6543/...` | serverless-safe connections |
| `PG_POOL_MAX` | `1` | one connection per warm instance |
| `CLAUDE_API_KEY` | `sk-ant-…` | a workspace with budget (mind the spend cap!) |
| `MCP_SERVER_URL` | the Cloud Run URL from step 2 | **not** `localhost:3002` |
| `MCP_SERVICE_TOKEN` | bearer token the MCP expects | must match the MCP host's |
| `GENERATION_DEADLINE_MS` | *(optional)* `285000` | keep < `maxDuration`; raise only on Fluid/persistent |
| `NEXT_PUBLIC_APP_ENV` | `prod` / `stage` | gates env-specific UI |
| `NEXT_PUBLIC_ICONS_BACKEND_BASE_URL`, `NEXT_PUBLIC_BRANDSYNC_MCP_URL`, `NEXT_PUBLIC_INTERNAL_API_URL` | per existing `.env.example` | |
| `NEXT_PUBLIC_KEYCLOAK_*` | Keycloak config | see auth note below |

---

## 4. Known gaps before a real (multi-user) production rollout

These don't block a demo deploy but matter for going live:

- **Auth is mocked.** The user is hardcoded (`vivka@eg.dk`) and Keycloak is effectively off.
  A multi-team rollout needs auth wired back on — which also makes per-user usage/cost real
  instead of single-user.
- **Secrets** must live only in Vercel / the MCP host env — never commit `.env.local`.
  Rotate any key that has been shared.
- **Generation > ~285s** fails on Vercel Pro serverless. For routinely-large builds, use Vercel
  Fluid compute (and bump `GENERATION_DEADLINE_MS`) or run generation on the persistent host.

---

## TL;DR
- **App → Vercel** (transaction pooler + `PG_POOL_MAX=1`; `maxDuration`/deadline already set).
- **MCP → Cloud Run** (or similar persistent host; it's session-stateful, not serverless).
- **DB → Supabase** (shared by both; session pooler for the MCP, transaction pooler for Vercel).
