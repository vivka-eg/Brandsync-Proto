/**
 * Server-side WordPress REST helpers.
 *
 * CMS base URL is fixed in code (see WORDPRESS_CMS_BASE_URL). Optional env:
 * - WORDPRESS_ANNOUNCEMENT_CATEGORY_SLUG — category slug for home hero (default: announcement)
 * - WORDPRESS_FEATURED_TAG_SLUG — optional exact tag slug tried first for featured hero (default: featured)
 */

const REVALIDATE_SECONDS = 120;

/** WordPress site origin — no trailing slash. REST is called via `index.php?rest_route=/wp/v2/...`. */
const WORDPRESS_CMS_BASE_URL = "https://brand.cmsegsync.com";

function getWordPressBaseUrl() {
  return WORDPRESS_CMS_BASE_URL.replace(/\/+$/, "");
}

export function isWordPressConfigured() {
  return Boolean(getWordPressBaseUrl());
}

function stripHtml(html) {
  if (!html || typeof html !== "string") return "";

  /** Hex / decimal character references plus chained `&amp;#8230;` style escapes. */
  const decodeCharacterReferences = (s) =>
    s
      .replace(/&#x([0-9a-fA-F]+);/gi, (_, hex) => {
        const cp = parseInt(hex, 16);
        return Number.isNaN(cp) || cp < 1 || cp > 0x10ffff ? `&#x${hex};` : String.fromCodePoint(cp);
      })
      .replace(/&#(\d+);/g, (_, dec) => {
        const cp = parseInt(dec, 10);
        return Number.isNaN(cp) || cp < 1 || cp > 0x10ffff ? `&#${dec};` : String.fromCodePoint(cp);
      })
      .replace(/&amp;/g, "&");

  let text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/&nbsp;/gi, " ");

  text = decodeCharacterReferences(text);
  text = decodeCharacterReferences(text);

  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&hellip;/gi, "…")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&ldquo;/g, "\u201c")
    .replace(/&rdquo;/g, "\u201d")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function featuredImageDimensionsFromPost(post) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return { width: null, height: null };
  const w = Number(media.media_details?.width ?? media.width);
  const h = Number(media.media_details?.height ?? media.height);
  return {
    width: Number.isFinite(w) && w > 0 ? Math.round(w) : null,
    height: Number.isFinite(h) && h > 0 ? Math.round(h) : null,
  };
}

function featuredImageFromPost(post) {
  const embedded = post._embedded;
  const media = embedded?.["wp:featuredmedia"]?.[0];
  if (media?.source_url) {
    const sizes = media.media_details?.sizes;
    return (
      sizes?.full?.source_url ||
      sizes?.["medium_large"]?.source_url ||
      sizes?.large?.source_url ||
      sizes?.medium?.source_url ||
      media.source_url
    );
  }
  if (typeof post.jetpack_featured_media_url === "string" && post.jetpack_featured_media_url.startsWith("http")) {
    return post.jetpack_featured_media_url;
  }
  return null;
}

function authorFromEmbeddedPost(post) {
  const authors = post._embedded?.["wp:author"];
  if (!Array.isArray(authors) || authors.length === 0) {
    return { authorName: "BrandSync", authorAvatarUrl: null };
  }
  const a = authors[0];
  const authorName = stripHtml(a.name || a.slug || "Author");
  const authorAvatarUrl =
    a.avatar_urls?.["96"] || a.avatar_urls?.["48"] || a.avatar_urls?.["24"] || null;
  return { authorName, authorAvatarUrl };
}

function categoriesFromEmbeddedPost(post) {
  const termGroups = post._embedded?.["wp:term"];
  if (!Array.isArray(termGroups)) return [];
  const out = [];
  for (const group of termGroups) {
    if (!Array.isArray(group)) continue;
    for (const t of group) {
      if (t.taxonomy === "category") {
        out.push({
          id: t.id,
          name: stripHtml(typeof t.name === "string" ? t.name : ""),
          slug: t.slug,
        });
      }
    }
  }
  return out;
}

export function normalizeWpPostSummary(post) {
  const dims = featuredImageDimensionsFromPost(post);
  const { authorName, authorAvatarUrl } = authorFromEmbeddedPost(post);
  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title?.rendered),
    excerpt: stripHtml(post.excerpt?.rendered),
    date: post.date,
    featuredImageUrl: featuredImageFromPost(post),
    featuredImageWidth: dims.width,
    featuredImageHeight: dims.height,
    href: `/blog/${post.slug}`,
    authorName,
    authorAvatarUrl,
    categories: categoriesFromEmbeddedPost(post),
  };
}

export function normalizeWpPostFull(post) {
  return {
    ...normalizeWpPostSummary(post),
    contentHtml: post.content?.rendered || "",
  };
}

/**
 * Build REST URL. Some WordPress/nginx setups return HTML for `/wp-json/...`
 * while `index.php?rest_route=/wp/v2/...` returns JSON (plain permalinks).
 */
function buildWpApiUrl(pathWithQuery) {
  const base = getWordPressBaseUrl();
  const raw = pathWithQuery.startsWith("/") ? pathWithQuery : `/${pathWithQuery}`;
  const question = raw.indexOf("?");
  const pathOnly = question === -1 ? raw : raw.slice(0, question);
  const queryString = question === -1 ? "" : raw.slice(question + 1);
  const restRoute = `/wp/v2${pathOnly}`;
  const url = new URL(`${base}/index.php`);
  url.searchParams.set("rest_route", restRoute);
  if (queryString) {
    const extra = new URLSearchParams(queryString);
    extra.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
  }
  return url.toString();
}

async function wpFetchJson(pathWithQuery) {
  const base = getWordPressBaseUrl();
  if (!base) return null;
  const url = buildWpApiUrl(pathWithQuery);
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return null;
    }
    return res.json();
  } catch {
    return null;
  }
}

async function wpFetchPostsList(pathWithQuery, options = {}) {
  const cacheMode = options.cacheMode || "revalidate";
  const revalidate = options.revalidate ?? REVALIDATE_SECONDS;
  const base = getWordPressBaseUrl();
  if (!base) {
    return { posts: [], total: 0, totalPages: 0, error: true };
  }
  const url = buildWpApiUrl(pathWithQuery);
  const fetchInit =
    cacheMode === "no-store"
      ? { cache: "no-store", headers: { Accept: "application/json" } }
      : { next: { revalidate }, headers: { Accept: "application/json" } };
  try {
    const res = await fetch(url, fetchInit);
    if (!res.ok) {
      return { posts: [], total: 0, totalPages: 0, error: true };
    }
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return { posts: [], total: 0, totalPages: 0, error: true };
    }
    const json = await res.json();
    const total = Number.parseInt(res.headers.get("x-wp-total") || "0", 10) || 0;
    const totalPages = Number.parseInt(res.headers.get("x-wp-totalpages") || "0", 10) || 0;
    if (!Array.isArray(json)) {
      return { posts: [], total: 0, totalPages: 0, error: true };
    }
    return {
      posts: json.map((p) => normalizeWpPostSummary(p)),
      total,
      totalPages,
      error: false,
    };
  } catch {
    return { posts: [], total: 0, totalPages: 0, error: true };
  }
}

export async function getCategoryIdBySlug(slug) {
  const data = await wpFetchJson(`/categories?slug=${encodeURIComponent(slug)}`);
  if (!Array.isArray(data) || data.length === 0) return null;
  return data[0].id;
}

export async function getAnnouncementPosts(limit = 4) {
  const slug =
    process.env.WORDPRESS_ANNOUNCEMENT_CATEGORY_SLUG || "announcement";
  const categoryId = await getCategoryIdBySlug(slug);
  if (!categoryId) return [];
  const posts = await wpFetchJson(
    `/posts?categories=${categoryId}&per_page=${limit}&_embed=1&orderby=date&order=desc`
  );
  if (!Array.isArray(posts)) return [];
  return posts.map((p) => normalizeWpPostSummary(p));
}

export async function getRecentPosts(perPage = 20) {
  const posts = await wpFetchJson(
    `/posts?per_page=${perPage}&_embed=1&orderby=date&order=desc`
  );
  if (posts === null) {
    return { posts: [], error: true };
  }
  if (!Array.isArray(posts)) {
    return { posts: [], error: true };
  }
  return { posts: posts.map((p) => normalizeWpPostSummary(p)), error: false };
}

export async function getPostBySlug(slug) {
  const posts = await wpFetchJson(
    `/posts?slug=${encodeURIComponent(slug)}&_embed=1`
  );
  if (!Array.isArray(posts) || posts.length === 0) return null;
  return normalizeWpPostFull(posts[0]);
}

/**
 * Related posts: same categories first, then recent posts as backfill.
 *
 * @param {{ postId: number, categoryIds?: number[], limit?: number }} options
 */
export async function getRelatedPosts({ postId, categoryIds = [], limit = 3 } = {}) {
  const safeLimit = Math.min(6, Math.max(1, Number(limit) || 3));
  const pid = Number(postId);
  if (!Number.isFinite(pid) || pid <= 0) return [];

  const catIds = (Array.isArray(categoryIds) ? categoryIds : [])
    .map((id) => Number(id))
    .filter((n) => Number.isFinite(n) && n > 0);

  /** @type {ReturnType<typeof normalizeWpPostSummary>[]} */
  let related = [];

  if (catIds.length > 0) {
    const params = new URLSearchParams();
    params.set("per_page", String(safeLimit));
    params.set("page", "1");
    params.set("_embed", "1");
    params.set("orderby", "date");
    params.set("order", "desc");
    params.set("categories", catIds.join(","));
    params.set("exclude", String(pid));

    const result = await wpFetchPostsList(`/posts?${params.toString()}`);
    if (!result.error) {
      related = result.posts.filter((p) => p.id !== pid).slice(0, safeLimit);
    }
  }

  if (related.length < safeLimit) {
    const seen = new Set([pid, ...related.map((p) => p.id)]);
    const backfill = await getPostsList({
      page: 1,
      perPage: safeLimit + seen.size,
      excludeIds: [...seen],
    });
    for (const p of backfill.posts) {
      if (related.length >= safeLimit) break;
      if (!seen.has(p.id)) {
        related.push(p);
        seen.add(p.id);
      }
    }
  }

  return related;
}

/**
 * Tag slug or name includes the word "featured" as a whole word (hyphens count as separators).
 * Avoids matching substrings like "unfeatured".
 */
function tagHasFeaturedKeyword(tag) {
  if (!tag || typeof tag.slug !== "string") return false;
  const slugWords = tag.slug.toLowerCase().replace(/-/g, " ");
  const name = (tag.name || "").toLowerCase();
  return /\bfeatured\b/.test(slugWords) || /\bfeatured\b/.test(name);
}

async function resolveFeaturedTagIds() {
  const preferredSlug =
    process.env.WORDPRESS_FEATURED_TAG_SLUG || "featured";
  const exact = await wpFetchJson(
    `/tags?slug=${encodeURIComponent(preferredSlug)}`
  );
  if (Array.isArray(exact) && exact.length > 0) {
    return exact.map((t) => t.id);
  }

  const search = await wpFetchJson(`/tags?search=featured&per_page=100`);
  if (!Array.isArray(search) || search.length === 0) return [];

  const matched = search.filter(tagHasFeaturedKeyword);
  const ids = [...new Set(matched.map((t) => t.id))];
  return ids;
}

/**
 * Latest published post that has a tag whose slug or name contains the word "featured",
 * or the tag slug from WORDPRESS_FEATURED_TAG_SLUG (default `featured`) if it exists.
 */
export async function getFeaturedHeroPost() {
  if (!getWordPressBaseUrl()) return null;
  const tagIds = await resolveFeaturedTagIds();
  if (tagIds.length === 0) return null;

  const posts = await wpFetchJson(
    `/posts?tags=${tagIds.join(",")}&per_page=1&_embed=1&orderby=date&order=desc`
  );
  if (!Array.isArray(posts) || posts.length === 0) return null;
  return normalizeWpPostSummary(posts[0]);
}

/**
 * Latest posts tagged `featured` (see WORDPRESS_FEATURED_TAG_SLUG), up to `limit`.
 */
export async function getFeaturedPosts(limit = 3) {
  if (!getWordPressBaseUrl()) return [];
  const tagIds = await resolveFeaturedTagIds();
  if (tagIds.length === 0) return [];

  const posts = await wpFetchJson(
    `/posts?tags=${tagIds.join(",")}&per_page=${limit}&_embed=1&orderby=date&order=desc`
  );
  if (!Array.isArray(posts)) return [];
  return posts.map((p) => normalizeWpPostSummary(p));
}

export async function getBlogCategories() {
  const data = await wpFetchJson(
    "/categories?per_page=100&hide_empty=true&orderby=name&order=asc"
  );
  if (!Array.isArray(data)) return [];
  return data
    .filter((c) => c.slug && c.slug !== "uncategorized")
    .map((c) => ({
      id: c.id,
      name: typeof c.name === "string" ? stripHtml(c.name) : "",
      slug: c.slug,
      count: c.count,
    }));
}

/**
 * Paginated posts for the blog archive. Supports category filter, full-text search, and excluding IDs (e.g. featured).
 */
export async function getPostsList(
  {
    page = 1,
    perPage = 12,
    categoryId = null,
    search = "",
    excludeIds = [],
  } = {},
  fetchOptions = {}
) {
  const safePer = Math.min(100, Math.max(1, Number(perPage) || 12));
  const safePage = Math.max(1, Number(page) || 1);
  const params = new URLSearchParams();
  params.set("per_page", String(safePer));
  params.set("page", String(safePage));
  params.set("_embed", "1");
  params.set("orderby", "date");
  params.set("order", "desc");

  const cid = categoryId != null && categoryId !== "" ? Number(categoryId) : NaN;
  if (Number.isFinite(cid) && cid > 0) {
    params.set("categories", String(cid));
  }

  const q = typeof search === "string" ? search.trim() : "";
  if (q) params.set("search", q);

  const exclude = Array.isArray(excludeIds)
    ? excludeIds.map((id) => Number(id)).filter((n) => Number.isFinite(n) && n > 0)
    : [];
  if (exclude.length) params.set("exclude", exclude.join(","));

  return wpFetchPostsList(`/posts?${params.toString()}`, fetchOptions);
}
