// Minimal Anthropic Messages helper for one-shot, non-streaming completions
// (e.g. authoring a handoff manifest body). The main generation loop in
// app/api/generate/route.js has its own streaming + tool-use machinery; this is
// intentionally separate and lightweight so secondary model passes don't depend
// on — or risk regressing — that core path.

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
export const DEFAULT_MODEL = 'claude-sonnet-4-6';

const RETRYABLE_STATUS = new Set([408, 409, 429, 500, 502, 503, 504, 529]);
const MAX_ATTEMPTS = 3;
// Hard ceiling per request so a stalled connection can't hang the route
// forever (this helper is non-streaming, so there's no idle watchdog). Set
// high enough that one attempt gets the real budget — a timeout is terminal
// (we DON'T retry it; retrying from scratch would just burn the deadline).
const CALL_TIMEOUT_MS = 240_000;

/**
 * Run a single Claude completion and return the concatenated text output.
 * @param {Object} opts
 * @param {string} opts.apiKey
 * @param {string} [opts.model]
 * @param {string} opts.system        system prompt
 * @param {Array}  opts.messages      Anthropic messages array
 * @param {number} [opts.maxTokens]
 * @param {number} [opts.deadline]    epoch ms; abort retries past this
 * @returns {Promise<{ text: string, usage: Object, model: string, stopReason: string }>}
 */
export async function callClaudeText({ apiKey, model = DEFAULT_MODEL, system, messages, maxTokens = 16000, deadline }) {
  let lastErr;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (deadline && Date.now() > deadline) {
      throw new Error('Handoff model pass timed out.');
    }
    let res;
    try {
      res = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': ANTHROPIC_VERSION,
        },
        body: JSON.stringify({ model, max_tokens: maxTokens, system, messages }),
        signal: AbortSignal.timeout(CALL_TIMEOUT_MS),
      });
    } catch (err) {
      // A timeout/abort is terminal — out of budget, retrying won't help.
      if (err?.name === 'TimeoutError' || err?.name === 'AbortError') {
        throw new Error(`Anthropic call timed out after ${CALL_TIMEOUT_MS / 1000}s`);
      }
      lastErr = err; // genuine network error — retry
      continue;
    }

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      lastErr = new Error(`Anthropic ${res.status}: ${body.slice(0, 300)}`);
      if (!RETRYABLE_STATUS.has(res.status)) throw lastErr;
      // backoff scaled by attempt; no jitter needed for a low-traffic path
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
      continue;
    }

    const json = await res.json();
    const text = (Array.isArray(json.content) ? json.content : [])
      .filter((c) => c.type === 'text' && typeof c.text === 'string')
      .map((c) => c.text)
      .join('');
    return { text, usage: json.usage ?? {}, model: json.model ?? model, stopReason: json.stop_reason };
  }
  throw lastErr ?? new Error('Anthropic request failed');
}

/** Strip ```json fences / prose and parse a JSON object from model output. */
export function parseJsonLoose(text) {
  let s = String(text ?? '').trim();
  // Remove a leading ```json / ``` fence and trailing ```
  s = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  // If there's surrounding prose, grab the outermost {...}
  if (s[0] !== '{') {
    const start = s.indexOf('{');
    const end = s.lastIndexOf('}');
    if (start !== -1 && end > start) s = s.slice(start, end + 1);
  }
  return JSON.parse(s);
}
