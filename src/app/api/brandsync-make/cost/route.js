import { getPool } from '@/lib/db';

// GET /api/brandsync-make/cost?userEmail=...
//
// Aggregates tool_usage_logs (tool_name = 'brandsync_make.generate') into a
// cost view for the savings dashboard: token totals + estimated USD across
// time windows, a per-project breakdown, and a 30-day daily series for the
// trend chart. Cost is computed server-side from the tokens we actually log
// (uncached input, cache reads, output) so the number is honest.
//
// NOTE: the log doesn't store the model per row, so we price everything at the
// default model's rate (Sonnet 4.6). That's the model the vast majority of
// generations use; Opus runs would be undercounted. Easy to revisit if we
// start logging the model column.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// USD per token (Anthropic list price, Claude Sonnet 4.6).
//   input (uncached): $3 / Mtok · cache read: $0.30 / Mtok · output: $15 / Mtok
// Cache-creation tokens aren't logged (a small, mostly one-off cost) so they're
// omitted — this slightly UNDER-states our cost, i.e. the savings shown are
// conservative.
const PRICE = {
  input: 3 / 1_000_000,
  cacheRead: 0.30 / 1_000_000,
  output: 15 / 1_000_000,
};

function costOf({ in_tok = 0, cache_tok = 0, out_tok = 0 }) {
  return in_tok * PRICE.input + cache_tok * PRICE.cacheRead + out_tok * PRICE.output;
}

export async function GET(request) {
  const userEmail = new URL(request.url).searchParams.get('userEmail');
  if (!userEmail) return Response.json({ error: 'userEmail required' }, { status: 400 });
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
  }

  const pool = getPool();
  try {
    // One row, four time windows. "screens" counts successful generations (a
    // failed call produced no screen); tokens sum ALL rows so the cost reflects
    // reality (failed attempts still burn output tokens).
    const { rows: w } = await pool.query(
      `WITH base AS (
         SELECT * FROM tool_usage_logs
          WHERE user_email = $1 AND tool_name = 'brandsync_make.generate'
       )
       SELECT
         -- screens (successful generations) + token sums, per window
         ${['today', '7d', '30d', 'all'].map((k) => {
            const pred = k === 'today'
              ? `created_at >= date_trunc('day', now())`
              : k === 'all'
                ? `TRUE`
                : `created_at >= now() - interval '${k === '7d' ? '7 days' : '30 days'}'`;
            return `
         COUNT(*) FILTER (WHERE success AND ${pred})::int            AS screens_${k},
         COUNT(*) FILTER (WHERE ${pred})::int                        AS gens_${k},
         COALESCE(SUM(input_tokens)       FILTER (WHERE ${pred}),0)::bigint AS in_${k},
         COALESCE(SUM(cache_read_tokens)  FILTER (WHERE ${pred}),0)::bigint AS cache_${k},
         COALESCE(SUM(output_tokens)      FILTER (WHERE ${pred}),0)::bigint AS out_${k}`;
          }).join(',')}
       FROM base`,
      [userEmail],
    );
    const row = w[0] ?? {};

    const windows = {};
    for (const k of ['today', '7d', '30d', 'all']) {
      const in_tok = Number(row[`in_${k}`] ?? 0);
      const cache_tok = Number(row[`cache_${k}`] ?? 0);
      const out_tok = Number(row[`out_${k}`] ?? 0);
      windows[k] = {
        screens: row[`screens_${k}`] ?? 0,
        gens: row[`gens_${k}`] ?? 0,
        inTokens: in_tok,
        cacheTokens: cache_tok,
        outTokens: out_tok,
        cost: costOf({ in_tok, cache_tok, out_tok }),
      };
    }

    // Per-project breakdown (last 30 days), joined for human names.
    const { rows: projRows } = await pool.query(
      `SELECT t.project_id,
              p.name,
              COUNT(*) FILTER (WHERE t.success)::int AS screens,
              COUNT(*)::int                          AS gens,
              COALESCE(SUM(t.input_tokens),0)::bigint      AS in_tok,
              COALESCE(SUM(t.cache_read_tokens),0)::bigint AS cache_tok,
              COALESCE(SUM(t.output_tokens),0)::bigint     AS out_tok
         FROM tool_usage_logs t
         LEFT JOIN projects p ON p.id::text = t.project_id
        WHERE t.user_email = $1
          AND t.tool_name = 'brandsync_make.generate'
          AND t.project_id IS NOT NULL
          AND t.created_at >= now() - interval '30 days'
        GROUP BY t.project_id, p.name
        ORDER BY out_tok DESC`,
      [userEmail],
    );
    const byProject = projRows.map((r) => ({
      projectId: r.project_id,
      name: r.name || 'Untitled project',
      screens: r.screens,
      gens: r.gens,
      inTokens: Number(r.in_tok),
      cacheTokens: Number(r.cache_tok),
      outTokens: Number(r.out_tok),
      cost: costOf({ in_tok: Number(r.in_tok), cache_tok: Number(r.cache_tok), out_tok: Number(r.out_tok) }),
    }));

    // 30-day daily series for the trend chart.
    const { rows: dayRows } = await pool.query(
      `SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day,
              COUNT(*) FILTER (WHERE success)::int          AS screens,
              COALESCE(SUM(input_tokens),0)::bigint      AS in_tok,
              COALESCE(SUM(cache_read_tokens),0)::bigint AS cache_tok,
              COALESCE(SUM(output_tokens),0)::bigint     AS out_tok
         FROM tool_usage_logs
        WHERE user_email = $1
          AND tool_name = 'brandsync_make.generate'
          AND created_at >= now() - interval '30 days'
        GROUP BY 1
        ORDER BY 1`,
      [userEmail],
    );
    const daily = dayRows.map((r) => ({
      day: r.day,
      screens: r.screens,
      cost: costOf({ in_tok: Number(r.in_tok), cache_tok: Number(r.cache_tok), out_tok: Number(r.out_tok) }),
    }));

    return Response.json({
      pricing: { inputPerMtok: 3, cacheReadPerMtok: 0.3, outputPerMtok: 15, model: 'claude-sonnet-4-6' },
      windows,
      byProject,
      daily,
    });
  } catch (err) {
    console.error('[api/brandsync-make/cost] error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}
