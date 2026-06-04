import { Pool } from 'pg';

// Shared Postgres pool + small helpers used by every Brandsync Make API
// route (projects, project files, my-patterns, generate). All callers
// connect to the same Supabase via DATABASE_URL, so one pool is enough
// — and lazy-init means missing env at build time doesn't crash.

let pool;
export function getPool() {
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return pool;
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
