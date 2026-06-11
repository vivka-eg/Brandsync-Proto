import { getPool } from '@/lib/db';
import { DAILY_TOKEN_LIMIT } from '@/constants/tokenBudget';

// GET /api/brandsync-make/usage?userEmail=...
//
// Returns aggregate token consumption for Brandsync Make generations
// (rows where tool_name = 'brandsync_make.generate') for the given
// user. Three windows so a header chip can show "today" while a
// dashboard can pull the rest.
//
// Why aggregate server-side: the user-visible widget should be a
// single number, not 1k+ rows fetched and reduced in the browser.
// Postgres can sum-with-filter in microseconds.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const userEmail = new URL(request.url).searchParams.get('userEmail');
  if (!userEmail) {
    return Response.json({ error: 'userEmail required' }, { status: 400 });
  }
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
  }

  try {
    const pool = getPool();
    // "Today" = calendar day (server/UTC) so the meters reset at midnight,
    // matching the per-project daily allotment.
    const { rows } = await pool.query(
      `SELECT
         COALESCE(SUM(input_tokens)  FILTER (WHERE created_at >= date_trunc('day', now())), 0)::int AS in_today,
         COALESCE(SUM(output_tokens) FILTER (WHERE created_at >= date_trunc('day', now())), 0)::int AS out_today,
         COALESCE(SUM(input_tokens)  FILTER (WHERE created_at >= now() - interval '7 days'),   0)::int AS in_7d,
         COALESCE(SUM(output_tokens) FILTER (WHERE created_at >= now() - interval '7 days'),   0)::int AS out_7d,
         COALESCE(SUM(input_tokens),  0)::int                                                          AS in_total,
         COALESCE(SUM(output_tokens), 0)::int                                                          AS out_total,
         COUNT(*) FILTER (WHERE created_at >= date_trunc('day', now()))::int                           AS gens_today,
         COUNT(*) FILTER (WHERE created_at >= now() - interval '7 days')::int                          AS gens_7d,
         COUNT(*)::int                                                                                 AS gens_total
       FROM tool_usage_logs
       WHERE user_email = $1
         AND tool_name = 'brandsync_make.generate'`,
      [userEmail],
    );

    // Per-project token consumption for today (input+output), so each
    // project's meter can fill against DAILY_TOKEN_LIMIT.
    // Only SUCCESSFUL generations count — a provider 503 or a rejected
    // edit shouldn't drain the project's daily allotment.
    const { rows: projRows } = await pool.query(
      `SELECT project_id,
              COALESCE(SUM(input_tokens + output_tokens), 0)::int AS used
         FROM tool_usage_logs
        WHERE user_email = $1
          AND tool_name = 'brandsync_make.generate'
          AND success = true
          AND project_id IS NOT NULL
          AND created_at >= date_trunc('day', now())
        GROUP BY project_id`,
      [userEmail],
    );
    const by_project = {};
    for (const r of projRows) by_project[r.project_id] = r.used;

    return Response.json({ ...rows[0], daily_limit: DAILY_TOKEN_LIMIT, by_project });
  } catch (err) {
    console.error('[api/brandsync-make/usage] query error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}
