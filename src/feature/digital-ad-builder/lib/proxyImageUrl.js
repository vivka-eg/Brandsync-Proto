/**
 * Proxies remote images through the app to avoid CORS issues.
 * Same-origin paths (Next.js `/public`) are returned as-is so the proxy never receives a bare
 * path (which would break) and static defaults work for preview + export.
 */
export function proxyImageUrl(url) {
  if (!url) return null;
  if (typeof url === "string" && url.startsWith("/") && !url.startsWith("//")) {
    return url;
  }
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}

/** For DOM attributes that expect a string (e.g. img src when empty). */
export function proxyImageUrlOrEmpty(url) {
  return proxyImageUrl(url) ?? "";
}
