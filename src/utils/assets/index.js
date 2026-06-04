export const formatBytes = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  if (bytes < 1024 * 1024 * 1024)
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
};

export const getObjectURLFromSVG = (svg) => {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  return URL.createObjectURL(blob);
};

/**
 * Constructs a full pathname by combining pathname and search parameters
 * @param {string} pathname - The base pathname (e.g., '/a/b/c')
 * @param {string|Object|URLSearchParams} searchParams - Search parameters
 * @returns {string} Full pathname with search parameters
 *
 * @example
 * constructFullPathname('/a/b/c', 'a=23&b=65')
 * // Returns: '/a/b/c?a=23&b=65'
 *
 * constructFullPathname('/a/b/c', { a: 23, b: 65 })
 * // Returns: '/a/b/c?a=23&b=65'
 *
 * constructFullPathname('/a/b/c', new URLSearchParams('a=23&b=65'))
 * // Returns: '/a/b/c?a=23&b=65'
 */
export function constructFullPathname(pathname, searchParams) {
  // Handle empty or null inputs
  if (!pathname) pathname = "/";
  if (!searchParams) return pathname;

  // Ensure pathname starts with '/'
  const normalizedPathname = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`;

  let queryString = "";

  // Handle different types of searchParams
  if (typeof searchParams === "string") {
    // Remove leading '?' if present
    queryString = searchParams.startsWith("?")
      ? searchParams.slice(1)
      : searchParams;
  } else if (searchParams instanceof URLSearchParams) {
    queryString = searchParams.toString();
  } else if (typeof searchParams === "object" && searchParams !== null) {
    // Convert object to query string
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, String(value));
      }
    });
    queryString = params.toString();
  }

  // Return pathname with or without query string
  return queryString
    ? `${normalizedPathname}?${queryString}`
    : normalizedPathname;
}
