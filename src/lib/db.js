import { Pool } from 'pg';

// Shared Postgres pool + small helpers used by every Brandsync Make API
// route (projects, project files, my-patterns, generate). All callers
// connect to the same Supabase via DATABASE_URL, so one pool is enough
// — and lazy-init means missing env at build time doesn't crash.
//
// The pool is stashed on globalThis so Next.js dev hot-reloads REUSE the
// same pool. A plain module-level `let` resets on every hot-reload, which
// leaks the old pool's open connections — they accumulate against
// Supabase's pooler client cap (pool_size 15, session mode) and eventually
// throw "EMAXCONNSESSION: max clients reached". `max` keeps us well under
// that cap and idleTimeoutMillis returns idle connections to the pooler.
//
// SERVERLESS (Vercel): each warm function instance keeps its own pool, so many
// instances × max connections blows past the pooler cap fast. There, set
// PG_POOL_MAX=1 and point DATABASE_URL at Supabase's TRANSACTION pooler (port
// 6543), which is built for many short-lived serverless connections. Locally /
// on a persistent host, the default of 5 against the session pooler is fine.
const PG_POOL_MAX = Number(process.env.PG_POOL_MAX) || 5;
export function getPool() {
  if (!globalThis.__bsPgPool) {
    globalThis.__bsPgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: PG_POOL_MAX,
      idleTimeoutMillis: 10_000,     // release idle connections back to the pooler
      connectionTimeoutMillis: 10_000,
    });
  }
  return globalThis.__bsPgPool;
}

export async function resolveUserId(client, userEmail) {
  const { rows } = await client.query('SELECT id FROM users WHERE email = $1', [userEmail]);
  return rows[0]?.id ?? null;
}

export async function userOwnsProject(client, projectId, userId) {
  const { rows } = await client.query(
    'SELECT 1 FROM projects WHERE id = $1 AND user_id = $2',
    [projectId, userId],
  );
  return rows.length > 0;
}

// ── Org helpers ──────────────────────────────────────────────────────────

// The org a user's content belongs to: their membership (admin first, then
// oldest join), falling back to the default org so a user with no explicit
// membership still writes into the everyone-org rather than NULL.
export async function resolveUserOrgId(client, userId) {
  const { rows } = await client.query(
    `SELECT org_id FROM org_members
      WHERE user_id = $1
      ORDER BY (role = 'admin') DESC, created_at ASC
      LIMIT 1`,
    [userId],
  );
  if (rows[0]?.org_id) return rows[0].org_id;
  const def = await client.query('SELECT id FROM orgs WHERE is_default = true LIMIT 1');
  return def.rows[0]?.id ?? null;
}

export async function userIsOrgAdmin(client, orgId, userId) {
  const { rows } = await client.query(
    `SELECT 1 FROM org_members WHERE org_id = $1 AND user_id = $2 AND role = 'admin'`,
    [orgId, userId],
  );
  return rows.length > 0;
}

// Orgs a user can see: every default org PLUS any they're a member of.
export async function userVisibleOrgIds(client, userId) {
  const { rows } = await client.query(
    `SELECT id FROM orgs WHERE is_default = true
     UNION
     SELECT org_id FROM org_members WHERE user_id = $1`,
    [userId],
  );
  return rows.map((r) => r.id);
}
