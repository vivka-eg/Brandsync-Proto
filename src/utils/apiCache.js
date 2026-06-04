/**
 * Simple in-memory cache for API responses.
 * Lives at module scope — persists for the user's session (until tab is closed).
 * TTL default: 5 minutes.
 */
const cache = new Map();
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export async function withCache(key, fetcher, ttl = DEFAULT_TTL) {
  const cached = cache.get(key);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const data = await fetcher();
  cache.set(key, { data, expiresAt: Date.now() + ttl });
  return data;
}
