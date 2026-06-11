import { getPool, resolveUserId, userOwnsProject } from '@/lib/db';

// GET /api/brandsync-make/project-usage?userEmail=&projectId=
//
// Per-project token-consumption documentation: the project's totals plus a
// chronological per-generation ledger with a running cumulative cost. Powers
// the "document consumption as I design in this project" view. Cost is computed
// from the tokens we log (uncached input · cache reads · output) at the default
// model's list price — same basis as the savings dashboard.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TOOL = 'brandsync_make.generate';
const LEDGER_LIMIT = 500; // newest-N cap so a long-lived project stays bounded

// USD per token (Claude Sonnet 4.6 list price).
const PRICE = { input: 3 / 1e6, cacheRead: 0.3 / 1e6, output: 15 / 1e6 };
const costOf = (i = 0, c = 0, o = 0) => i * PRICE.input + c * PRICE.cacheRead + o * PRICE.output;

export async function GET(request) {
  const url = new URL(request.url);
  const userEmail = url.searchParams.get('userEmail');
  const projectId = url.searchParams.get('projectId');
  if (!userEmail) return Response.json({ error: 'userEmail required' }, { status: 400 });
  if (!projectId) return Response.json({ error: 'projectId required' }, { status: 400 });
  if (!process.env.DATABASE_URL) {
    return Response.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
  }

  const pool = getPool();
  try {
    const userId = await resolveUserId(pool, userEmail);
    if (!userId) return Response.json({ error: 'no such user' }, { status: 404 });
    // Ownership-checked, same as the project detail route.
    if (!(await userOwnsProject(pool, projectId, userId))) {
      return Response.json({ error: 'project not found' }, { status: 404 });
    }

    const { rows: projRows } = await pool.query(
      'SELECT id, name, created_at FROM projects WHERE id = $1',
      [projectId],
    );
    const project = projRows[0] ?? null;

    // Totals: all-time + today, screens (successful) + token sums.
    const { rows: tRows } = await pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE success)::int                          AS screens,
         COUNT(*)::int                                                 AS gens,
         COUNT(*) FILTER (WHERE success AND created_at >= date_trunc('day', now()))::int AS screens_today,
         COALESCE(SUM(input_tokens), 0)::bigint                        AS in_tok,
         COALESCE(SUM(cache_read_tokens), 0)::bigint                   AS cache_tok,
         COALESCE(SUM(output_tokens), 0)::bigint                       AS out_tok,
         COALESCE(SUM(input_tokens)      FILTER (WHERE created_at >= date_trunc('day', now())), 0)::bigint AS in_today,
         COALESCE(SUM(cache_read_tokens) FILTER (WHERE created_at >= date_trunc('day', now())), 0)::bigint AS cache_today,
         COALESCE(SUM(output_tokens)     FILTER (WHERE created_at >= date_trunc('day', now())), 0)::bigint AS out_today
       FROM tool_usage_logs
       WHERE tool_name = $1 AND project_id = $2`,
      [TOOL, projectId],
    );
    const t = tRows[0] ?? {};
    const num = (k) => Number(t[k] ?? 0);
    const totals = {
      screens: t.screens ?? 0,
      gens: t.gens ?? 0,
      screensToday: t.screens_today ?? 0,
      inTokens: num('in_tok'), cacheTokens: num('cache_tok'), outTokens: num('out_tok'),
      cost: costOf(num('in_tok'), num('cache_tok'), num('out_tok')),
      today: {
        inTokens: num('in_today'), cacheTokens: num('cache_today'), outTokens: num('out_today'),
        cost: costOf(num('in_today'), num('cache_today'), num('out_today')),
      },
    };

    // Per-generation ledger (chronological), newest-N capped.
    const { rows: ledRows } = await pool.query(
      `SELECT created_at, success, error, duration_ms,
              COALESCE(input_tokens,0)::int      AS in_tok,
              COALESCE(cache_read_tokens,0)::int AS cache_tok,
              COALESCE(output_tokens,0)::int     AS out_tok
         FROM tool_usage_logs
        WHERE tool_name = $1 AND project_id = $2
        ORDER BY created_at ASC
        LIMIT $3`,
      [TOOL, projectId, LEDGER_LIMIT],
    );
    let cumulative = 0;
    const ledger = ledRows.map((r) => {
      const cost = costOf(r.in_tok, r.cache_tok, r.out_tok);
      cumulative += cost;
      return {
        at: r.created_at.toISOString(),
        success: r.success,
        error: r.error || null,
        durationMs: r.duration_ms ?? null,
        inTokens: r.in_tok, cacheTokens: r.cache_tok, outTokens: r.out_tok,
        cost, cumulativeCost: cumulative,
      };
    });

    return Response.json({
      pricing: { inputPerMtok: 3, cacheReadPerMtok: 0.3, outputPerMtok: 15, model: 'claude-sonnet-4-6' },
      project,
      totals,
      ledger,
      truncated: ledRows.length === LEDGER_LIMIT,
    });
  } catch (err) {
    console.error('[api/brandsync-make/project-usage] error:', err);
    return Response.json({ error: err.message ?? 'unknown error' }, { status: 500 });
  }
}
