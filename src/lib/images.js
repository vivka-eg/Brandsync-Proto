// Shared helper for accepting user-attached images as model input. Used by
// /api/generate (build a pattern from a screenshot) and /api/kit/edit (edit a
// component against a reference). Anthropic accepts png/jpeg/webp/gif; we cap
// count + per-image size so a paste-bomb can't blow the request or the bill.

export const IMAGE_MEDIA_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
export const MAX_IMAGES = 4;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB decoded, per Anthropic's limit

// Normalize the request's `images` into [{ mediaType, data(base64) }].
// Accepts either a data: URL string or a { mediaType, data } object. Returns
// { list } on success or { error } on the first bad entry.
export function normalizeImages(raw) {
  if (!raw) return { list: [] };
  if (!Array.isArray(raw)) return { error: 'images must be an array' };
  if (raw.length > MAX_IMAGES) return { error: `at most ${MAX_IMAGES} images` };
  const list = [];
  for (const item of raw) {
    let mediaType, data;
    if (typeof item === 'string') {
      const m = item.match(/^data:([^;]+);base64,(.+)$/);
      if (!m) return { error: 'image must be a base64 data: URL' };
      mediaType = m[1]; data = m[2];
    } else if (item && typeof item === 'object') {
      mediaType = item.mediaType ?? item.media_type;
      data = item.data;
    } else {
      return { error: 'invalid image entry' };
    }
    if (!IMAGE_MEDIA_TYPES.has(mediaType)) return { error: `unsupported image type: ${mediaType}` };
    if (typeof data !== 'string' || !data) return { error: 'image data missing' };
    // base64 decodes to ~3/4 its length in bytes.
    if (Math.floor(data.length * 0.75) > MAX_IMAGE_BYTES) return { error: 'image exceeds 5MB' };
    list.push({ mediaType, data });
  }
  return { list };
}

// Build the Anthropic user-message `content` from text + optional images.
// Returns a plain string when there are no images (keeps the simple form),
// or a content-block array with the image blocks first.
export function userContentWithImages(text, images) {
  if (!Array.isArray(images) || !images.length) return text;
  return [
    ...images.map((img) => ({
      type: 'image',
      source: { type: 'base64', media_type: img.mediaType, data: img.data },
    })),
    { type: 'text', text },
  ];
}
