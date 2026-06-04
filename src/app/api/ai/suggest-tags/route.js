/**
 * POST /api/ai/suggest-tags
 * Body: { title: string }
 *
 * Returns: { tags: string[] }
 *
 * Fallback chain: Claude → OpenAI → local (empty tags)
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
  const cleaned = tags
    .map((t) => (typeof t === "string" ? t.trim().toLowerCase() : ""))
    .filter(Boolean);
  return Array.from(new Set(cleaned)).slice(0, 12);
}

const SYSTEM_PROMPT = [
  "You are an expert at generating searchable tags for digital asset photos.",
  "Given a photo title, generate 5-12 relevant, lowercase, searchable tags.",
  "Return STRICT JSON only (no markdown, no backticks, no extra text).",
  'Schema: { "tags": ["tag1", "tag2", ...] }',
  "Rules:",
  "- Tags should be lowercase single words or short phrases",
  "- No hashtags, no duplicates",
  "- Focus on: objects, activities, locations, industries, concepts",
  "- Be specific and relevant to the title",
].join("\n");

function parseResult(text) {
  const parsed = JSON.parse(stripCodeFences(text));
  const tags = normalizeTags(parsed?.tags);
  if (!tags.length) throw new Error("No tags in response");
  return { tags };
}

async function tryClaude(apiKey, title) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate searchable tags for this photo title: "${title}"`,
        },
      ],
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

async function tryOpenAI(apiKey, title) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 300,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Generate searchable tags for this photo title: "${title}"`,
        },
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
    const title = body?.title;

    if (!title || typeof title !== "string" || !title.trim()) {
      return Response.json(
        { error: "Invalid payload. Expected { title: 'photo title' }" },
        { status: 400 }
      );
    }

    const claudeKey = process.env.CLAUDE_API_KEY?.trim().replace(/^["']|["']$/g, "") || null;
    const openaiKey = process.env.OPENAI_API_KEY?.trim().replace(/^["']|["']$/g, "") || null;

    // 1. Try Claude
    if (claudeKey) {
      try {
        const result = await tryClaude(claudeKey, title);
        return Response.json({ ...result, provider: "claude" });
      } catch (err) {
        console.warn("[suggest-tags] Claude failed, trying OpenAI:", err.message);
      }
    }

    // 2. Try OpenAI
    if (openaiKey) {
      try {
        const result = await tryOpenAI(openaiKey, title);
        return Response.json({ ...result, provider: "openai" });
      } catch (err) {
        console.warn("[suggest-tags] OpenAI failed, falling back to local:", err.message);
      }
    }

    // 3. Local fallback — return empty tags so the form can still proceed
    return Response.json({ tags: [], provider: "local" });
  } catch (err) {
    console.error("[suggest-tags]", err);
    return Response.json(
      { error: "Unexpected server error.", details: err.message },
      { status: 500 }
    );
  }
}
