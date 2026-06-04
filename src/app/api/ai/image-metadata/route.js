/**
 * POST /api/ai/image-metadata
 * Body: { imageDataUrl: "data:image/png;base64,..." }
 *
 * Returns: { title: string, description: string, tags: string[], containsPeople: boolean }
 *
 * Fallback chain: Claude → OpenAI → local (empty metadata)
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

function parseImageDataUrl(imageDataUrl) {
  if (typeof imageDataUrl !== "string") return null;
  const match = imageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], base64Data: match[2] };
}

function parseAndValidate(text) {
  const cleaned = stripCodeFences(text);

  let jsonToParse = cleaned;
  if (!cleaned.trim().endsWith("}")) {
    const lastBrace = cleaned.lastIndexOf("}");
    const lastBracket = cleaned.lastIndexOf("]");
    const lastQuote = cleaned.lastIndexOf('"');
    if (lastBracket > lastBrace && lastBracket > lastQuote) {
      jsonToParse = cleaned.slice(0, lastBracket + 1) + "]}";
    } else if (lastQuote > lastBrace && lastQuote > lastBracket) {
      jsonToParse = cleaned.slice(0, lastQuote + 1) + "]}";
    } else {
      jsonToParse = cleaned + "}";
    }
  }

  const parsedOut = JSON.parse(jsonToParse);

  const title = typeof parsedOut?.title === "string" ? parsedOut.title.trim() : "";
  const description = typeof parsedOut?.description === "string" ? parsedOut.description.trim() : "";
  const tags = normalizeTags(parsedOut?.tags);
  const containsPeople = Boolean(parsedOut?.containsPeople);

  const validGenders = ["Male", "Female", "Multiple", "None"];
  const gender = validGenders.includes(parsedOut?.gender) ? parsedOut.gender : "None";

  const validEthnicities = ["Asian", "African", "American", "European", "Multiple", "None"];
  const ethnicity = validEthnicities.includes(parsedOut?.ethnicity) ? parsedOut.ethnicity : "None";

  if (!title && !description && !tags.length && !containsPeople) throw new Error("Empty AI response");

  return { title, description, tags, containsPeople, gender, ethnicity };
}

const SYSTEM_PROMPT = [
  "You are an assistant that extracts metadata for a digital asset photo library.",
  "Analyze the image and return STRICT JSON only (no markdown, no backticks, no extra text).",
  "Schema:",
  "{",
  '  "title": string,',
  '  "description": string,',
  '  "tags": string[],',
  '  "containsPeople": boolean,',
  '  "gender": "Male" | "Female" | "Multiple" | "None",',
  '  "ethnicity": "Asian" | "African" | "American" | "European" | "Multiple" | "None"',
  "}",
  "Rules:",
  "- title: 2-5 words, short and simple, descriptive name for the image.",
  "- description: 1-2 concise sentences, factual, no speculation.",
  "- tags: 5-12 lowercase keywords; no hashtags; no duplicates; prefer nouns.",
  "- containsPeople: true if any people are visible; otherwise false.",
  '- gender: if containsPeople is false, use "None". If multiple people are visible (regardless of gender) use "Multiple". If a single male is the subject use "Male". If a single female is the subject use "Female". If gender cannot be determined use "None".',
  '- ethnicity: This is a stock photo library classification field based on visible appearance. If containsPeople is false, use "None". If multiple people are visible and they appear to have different or mixed ethnicities, use "Multiple". Otherwise, classify the predominant visible appearance of the person(s) using one of these fixed categories: use "Asian" if the person appears to have East Asian, South Asian, or Southeast Asian features; use "African" if the person appears to have African or Black features; use "American" if the person appears to have Hispanic, Latin, or Indigenous American features; use "European" if the person appears to have White or Caucasian features. You MUST pick the closest matching category based on visible appearance; only use "None" if truly no people are visible or the image is too obscured to see any features at all.',
].join("\n");

async function tryClause(apiKey, parsed) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: parsed.mimeType, data: parsed.base64Data },
            },
            { type: "text", text: "Analyze this image and extract metadata as specified." },
          ],
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
  return parseAndValidate(text);
}

async function tryOpenAI(apiKey, parsed) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 600,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${parsed.mimeType};base64,${parsed.base64Data}` },
            },
            { type: "text", text: "Analyze this image and extract metadata as specified." },
          ],
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
  return parseAndValidate(text);
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    const imageDataUrl = body?.imageDataUrl;
    const parsed = parseImageDataUrl(imageDataUrl);
    if (!parsed) {
      return Response.json(
        { error: "Invalid payload. Expected { imageDataUrl: 'data:image/...;base64,...' }" },
        { status: 400 }
      );
    }

    const claudeKey = process.env.CLAUDE_API_KEY?.trim().replace(/^["']|["']$/g, "") || null;
    const openaiKey = process.env.OPENAI_API_KEY?.trim().replace(/^["']|["']$/g, "") || null;

    const errors = [];

    // 1. Try OpenAI (temporary primary)
    if (openaiKey) {
      try {
        const result = await tryOpenAI(openaiKey, parsed);
        return Response.json({ ...result, provider: "openai" });
      } catch (err) {
        errors.push(`OpenAI: ${err.message}`);
        console.warn("[image-metadata] OpenAI failed, trying Claude:", err.message);
      }
    } else {
      errors.push("OpenAI: OPENAI_API_KEY not set");
    }

    // 2. Try Claude (temporary fallback)
    if (claudeKey) {
      try {
        const result = await tryClause(claudeKey, parsed);
        return Response.json({ ...result, provider: "claude" });
      } catch (err) {
        errors.push(`Claude: ${err.message}`);
        console.warn("[image-metadata] Claude failed, falling back to local:", err.message);
      }
    } else {
      errors.push("Claude: CLAUDE_API_KEY not set");
    }

    // 3. Local fallback — return empty metadata so the upload can still proceed
    return Response.json({
      title: "",
      description: "",
      tags: [],
      containsPeople: false,
      gender: "None",
      ethnicity: "None",
      provider: "local",
      _errors: errors,
    });
  } catch (err) {
    return Response.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
