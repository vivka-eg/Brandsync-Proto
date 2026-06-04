/**
 * POST /api/ai/icon-metadata
 * Body: { filename: string }
 *
 * Returns: { name: string, tags: string[] }
 *
 * Fallback chain: Claude → OpenAI → local (derived from filename)
 * Server-only: reads CLAUDE_API_KEY and OPENAI_API_KEY from env.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function stripCodeFences(text) {
  if (!text) return "";
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```[a-zA-Z]*\n?/, "").replace(/```$/, "").trim();
  }
  return trimmed;
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return Array.from(
    new Set(
      tags
        .map((t) => (typeof t === "string" ? t.trim().toLowerCase() : ""))
        .filter(Boolean)
    )
  ).slice(0, 12);
}

// Convert a filename like "arrow-right-outline.svg" → "arrow right outline"
function filenameToLabel(filename) {
  return filename
    .replace(/\.svg$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

// Title-case a string: "arrow right" → "Arrow Right"
function toTitleCase(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildPrompt(label) {
  return [
    `Icon filename: "${label}"`,
    "",
    "Based on this icon name, return a JSON object with:",
    '- "name": a clean 1–4 word Title Case display name (e.g. "Arrow Right", "Bell Notification", "Shopping Cart")',
    '- "tags": 6–10 lowercase keywords covering the icon\'s shape, concept, category, and common UI use cases.',
    "",
    "Return STRICT JSON only. No markdown, no backticks, no explanation.",
    'Example: { "name": "Arrow Right", "tags": ["arrow", "direction", "next", "forward", "navigation", "chevron", "move", "right"] }',
  ].join("\n");
}

const SYSTEM = "You are an expert icon library cataloguer. Always return strict JSON only — no markdown, no backticks, no extra text.";

function parseResult(text) {
  const parsed = JSON.parse(stripCodeFences(text));
  const name = typeof parsed?.name === "string" ? parsed.name.trim() : "";
  const tags = normalizeTags(parsed?.tags);
  if (!name) throw new Error("Missing name in response");
  return { name, tags };
}

async function tryClaude(apiKey, label) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      system: SYSTEM,
      messages: [{ role: "user", content: buildPrompt(label) }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Claude ${res.status}: ${errText.slice(0, 300)}`);
  }

  const json = await res.json();
  const text = json?.content?.[0]?.text || "";
  if (!text) throw new Error("Empty Claude response");
  return parseResult(text);
}

async function tryOpenAI(apiKey, label) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 200,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: buildPrompt(label) },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`OpenAI ${res.status}: ${errText.slice(0, 300)}`);
  }

  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content || "";
  if (!text) throw new Error("Empty OpenAI response");
  return parseResult(text);
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    const { filename } = body ?? {};

    if (!filename || typeof filename !== "string") {
      return Response.json(
        { error: "Invalid payload. Expected { filename: string }" },
        { status: 400 }
      );
    }

    const label = filenameToLabel(filename);
    const claudeKey = process.env.CLAUDE_API_KEY?.trim().replace(/^["']|["']$/g, "") || null;
    const openaiKey = process.env.OPENAI_API_KEY?.trim().replace(/^["']|["']$/g, "") || null;

    // 1. Try Claude
    if (claudeKey) {
      try {
        const result = await tryClaude(claudeKey, label);
        return Response.json({ ...result, provider: "claude" });
      } catch (err) {
        console.warn("[icon-metadata] Claude failed, trying OpenAI:", err.message);
      }
    }

    // 2. Try OpenAI
    if (openaiKey) {
      try {
        const result = await tryOpenAI(openaiKey, label);
        return Response.json({ ...result, provider: "openai" });
      } catch (err) {
        console.warn("[icon-metadata] OpenAI failed, falling back to local:", err.message);
      }
    }

    // 3. Local fallback — derive name and basic tags from the filename
    const name = toTitleCase(label);
    const tags = normalizeTags(label.split(" ").filter((w) => w.length > 1));
    return Response.json({ name, tags, provider: "local" });
  } catch (err) {
    console.error("[icon-metadata]", err);
    return Response.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
