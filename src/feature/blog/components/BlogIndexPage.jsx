"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  InputAdornment,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { ArrowClockwise, ArrowRight, GridFour, ListBullets, MagnifyingGlass } from "phosphor-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogFeaturedImage from "@/feature/blog/components/BlogFeaturedImage";
import {
  formatPostDate,
  formatRelativePostDate,
} from "@/feature/blog/utils/formatPostDate";

/**
 * @typedef {Object} BlogCategory
 * @property {number} id
 * @property {string} name
 * @property {string} slug
 */

/**
 * @typedef {Object} BlogPostSummary
 * @property {number} id
 * @property {string} slug
 * @property {string} title
 * @property {string} excerpt
 * @property {string} date
 * @property {string | null} featuredImageUrl
 * @property {number | null} featuredImageWidth
 * @property {number | null} featuredImageHeight
 * @property {string} href
 * @property {string} authorName
 * @property {string | null} authorAvatarUrl
 * @property {Array<{ id: number, name: string, slug: string }>} categories
 */

function excerptSnippet(text, max = 160) {
  if (!text) return "";
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function getEditorialSplit(featuredPosts, posts) {
  const fp = Array.isArray(featuredPosts) ? featuredPosts : [];
  const p = Array.isArray(posts) ? posts : [];
  let hero = null;
  let secondary = null;
  if (fp.length >= 1) {
    hero = fp[0];
    secondary = fp.length >= 2 ? fp[1] : p[0] ?? null;
  } else {
    hero = p[0] ?? null;
    secondary = p[1] ?? null;
  }
  const shown = new Set();
  if (hero) shown.add(hero.id);
  if (secondary) shown.add(secondary.id);
  const pool = [];
  for (const x of fp) {
    if (!shown.has(x.id)) pool.push(x);
  }
  for (const x of p) {
    if (!shown.has(x.id)) pool.push(x);
  }
  const sidebar = pool.slice(0, 4);
  const belowGrid = pool.slice(4);
  return { hero, secondary, sidebar, belowGrid };
}

function primaryCategoryLabel(post) {
  const c = post.categories?.[0];
  const name = c?.name?.trim();
  return name || "Uncategorized";
}

function editorialMetaRow(post) {
  const cat = primaryCategoryLabel(post);
  return (
    <Stack direction="row" alignItems="center" spacing={1.25} flexWrap="wrap" sx={{ mb: 1.5 }}>
      <Chip
        label={cat.toUpperCase()}
        size="small"
        variant="outlined"
        color="primary"
        sx={{ fontWeight: 700, fontSize: "0.65rem", height: 24, letterSpacing: "0.06em" }}
      />
      <Typography variant="caption" color="text.secondary">
        {formatPostDate(post.date)}
      </Typography>
    </Stack>
  );
}

/**
 * @param {{ post: BlogPostSummary }} props
 */
function BlogEditorialHeroCard({ post }) {
  const imgAlt = post.title ? `${post.title} cover` : "Article cover";
  const excerpt = excerptSnippet(post.excerpt, 220);
  return (
    <Paper
      component={Link}
      href={post.href}
      elevation={0}
      sx={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        bgcolor: "background.paper",
        transition: "box-shadow 0.2s, border-color 0.2s",
        "&:hover": {
          borderColor: "action.selected",
          boxShadow: 3,
        },
      }}
    >
      {post.featuredImageUrl ? (
        <BlogFeaturedImage
          src={post.featuredImageUrl}
          alt={imgAlt}
          width={post.featuredImageWidth}
          height={post.featuredImageHeight}
          sizes="(max-width: 900px) 100vw, 960px"
          maxHeight={{ xs: "min(56vw, 360px)", md: 420 }}
          borderRadius={0}
        />
      ) : null}
      <Box sx={{ p: { xs: 2.5, md: 3 } }}>
        {editorialMetaRow(post)}
        <Typography variant="h4" component="span" display="block" fontWeight={800} sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, letterSpacing: "-0.02em", mb: 1.5 }}>
          {post.title}
        </Typography>
        {excerpt ? (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
            {excerpt}
          </Typography>
        ) : null}
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            color: "primary.main",
            fontWeight: 700,
            fontSize: "0.95rem",
          }}
        >
          Read article
          <ArrowRight size={20} weight="bold" aria-hidden />
        </Box>
      </Box>
    </Paper>
  );
}

/**
 * @param {{ post: BlogPostSummary }} props
 */
function BlogEditorialMainCard({ post }) {
  const imgAlt = post.title ? `${post.title} cover` : "Article cover";
  const excerpt = excerptSnippet(post.excerpt, 180);
  return (
    <Paper
      component={Link}
      href={post.href}
      elevation={0}
      sx={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        height: "100%",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        bgcolor: "background.paper",
        transition: "box-shadow 0.2s, border-color 0.2s",
        "&:hover": {
          borderColor: "action.selected",
          boxShadow: 3,
        },
      }}
    >
      {post.featuredImageUrl ? (
        <BlogFeaturedImage
          src={post.featuredImageUrl}
          alt={imgAlt}
          width={post.featuredImageWidth}
          height={post.featuredImageHeight}
          sizes="(max-width: 900px) 100vw, 640px"
          maxHeight={{ xs: "min(50vw, 320px)", md: 380 }}
          borderRadius={0}
        />
      ) : null}
      <Box sx={{ p: { xs: 2, md: 2.5 } }}>
        {editorialMetaRow(post)}
        <Typography variant="h5" component="span" display="block" fontWeight={800} sx={{ fontSize: { xs: "1.2rem", md: "1.35rem" }, letterSpacing: "-0.02em", mb: 1.25 }}>
          {post.title}
        </Typography>
        {excerpt ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
            {excerpt}
          </Typography>
        ) : null}
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            color: "primary.main",
            fontWeight: 700,
            fontSize: "0.9rem",
          }}
        >
          Read article
          <ArrowRight size={18} weight="bold" aria-hidden />
        </Box>
      </Box>
    </Paper>
  );
}

/**
 * @param {{ post: BlogPostSummary }} props
 */
function BlogLatestRowCard({ post }) {
  const imgAlt = post.title ? `${post.title} cover` : "Article cover";
  const excerpt = excerptSnippet(post.excerpt, 90);
  return (
    <Paper
      component={Link}
      href={post.href}
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        gap: 2,
        p: 1.75,
        textDecoration: "none",
        color: "inherit",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        transition: "box-shadow 0.2s, border-color 0.2s",
        "&:hover": {
          borderColor: "action.selected",
          boxShadow: 2,
        },
      }}
    >
      {post.featuredImageUrl ? (
        <BlogFeaturedImage
          src={post.featuredImageUrl}
          alt={imgAlt}
          width={post.featuredImageWidth}
          height={post.featuredImageHeight}
          sizes="96px"
          fixedSize={{ width: 96, height: 96 }}
        />
      ) : null}
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" sx={{ mb: 0.75 }}>
          <Chip
            label={primaryCategoryLabel(post).toUpperCase()}
            size="small"
            variant="outlined"
            color="primary"
            sx={{ fontWeight: 700, fontSize: "0.6rem", height: 22, letterSpacing: "0.05em" }}
          />
          <Typography variant="caption" color="text.secondary">
            {formatPostDate(post.date)}
          </Typography>
        </Stack>
        <Typography
          variant="subtitle1"
          fontWeight={800}
          sx={{
            fontSize: "0.95rem",
            lineHeight: 1.35,
            mb: 0.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.title}
        </Typography>
        {excerpt ? (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.45,
            }}
          >
            {excerpt}
          </Typography>
        ) : null}
      </Box>
    </Paper>
  );
}

/**
 * @param {{ post: BlogPostSummary, variant?: 'grid' | 'list' }} props
 */
function BlogArticleCard({ post, variant = "grid" }) {
  const isList = variant === "list";
  const imgAlt = post.title ? `${post.title} cover` : "Article cover";
  const relative = formatRelativePostDate(post.date);
  const excerpt = excerptSnippet(post.excerpt, 140);

  const mediaBlock = post.featuredImageUrl ? (
    <BlogFeaturedImage
      src={post.featuredImageUrl}
      alt={imgAlt}
      width={post.featuredImageWidth}
      height={post.featuredImageHeight}
      sizes="(max-width: 600px) 100vw, 33vw"
      maxHeight={280}
    />
  ) : null;

  const metaRow = (
    <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.5 }}>
      <Avatar
        src={post.authorAvatarUrl || undefined}
        alt={post.authorName || ""}
        sx={{ width: 32, height: 32, fontSize: "0.85rem" }}
      >
        {(post.authorName || "?").slice(0, 1).toUpperCase()}
      </Avatar>
      <Typography variant="body2" fontWeight={600} color="text.primary">
        {post.authorName}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {relative || formatPostDate(post.date)}
      </Typography>
    </Stack>
  );

  const titleBlock = (
    <Box sx={{ mb: 1 }}>
      <Typography
        component={Link}
        href={post.href}
        variant="subtitle1"
        fontWeight={700}
        color="text.primary"
        sx={{
          textDecoration: "none",
          display: "block",
          "&:hover": { color: "primary.main" },
        }}
      >
        {post.title}
      </Typography>
      {excerpt ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.55 }}>
          {excerpt}{" "}
          <Box
            component={Link}
            href={post.href}
            sx={{ color: "primary.main", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}
          >
            Read more
          </Box>
        </Typography>
      ) : (
        <Box component={Link} href={post.href} sx={{ color: "primary.main", fontWeight: 600, mt: 1, display: "inline-block" }}>
          Read more
        </Box>
      )}
    </Box>
  );

  const inner = (
    <>
      {metaRow}
      {titleBlock}
      {mediaBlock}
    </>
  );

  if (isList) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          bgcolor: "background.paper",
        }}
      >
        {post.featuredImageUrl ? (
          <Box sx={{ width: { xs: "100%", sm: 200 }, flexShrink: 0 }}>
            <BlogFeaturedImage
              src={post.featuredImageUrl}
              alt={imgAlt}
              width={post.featuredImageWidth}
              height={post.featuredImageHeight}
              sizes="200px"
              maxHeight={160}
            />
          </Box>
        ) : null}
        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>{inner}</Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        transition: "box-shadow 0.2s, border-color 0.2s",
        "&:hover": {
          borderColor: "action.selected",
          boxShadow: 2,
        },
      }}
    >
      {inner}
    </Paper>
  );
}

/**
 * @param {{
 *   featuredPosts: BlogPostSummary[],
 *   categories: BlogCategory[],
 *   posts: BlogPostSummary[],
 *   totalPages: number,
 *   featuredPostIds: number[],
 *   loadError: boolean,
 *   configured?: boolean,
 * }} props
 */
export default function BlogIndexPage({
  featuredPosts = [],
  categories = [],
  posts: initialPosts = [],
  totalPages: initialTotalPages = 0,
  featuredPostIds = [],
  loadError = false,
  configured = true,
}) {
  const [viewMode, setViewMode] = useState("grid");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [filterLoading, setFilterLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const skipFilterRef = useRef(true);

  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchArchive = useCallback(
    async (nextPage, { append } = { append: false }) => {
      if (!configured) {
        return { posts: [], totalPages: 0, error: false };
      }
      const params = new URLSearchParams();
      params.set("page", String(nextPage));
      params.set("per_page", "12");
      if (searchQuery) params.set("search", searchQuery);
      if (categorySlug) params.set("category", categorySlug);
      if (featuredPostIds.length) params.set("exclude", featuredPostIds.join(","));

      const res = await fetch(`/api/blog/posts?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        return { posts: [], totalPages: 0, error: true };
      }
      const nextPosts = Array.isArray(data.posts) ? data.posts : [];
      const tp = typeof data.totalPages === "number" ? data.totalPages : 0;
      if (append) {
        setPosts((prev) => {
          const seen = new Set(prev.map((p) => p.id));
          const merged = [...prev];
          for (const p of nextPosts) {
            if (!seen.has(p.id)) {
              seen.add(p.id);
              merged.push(p);
            }
          }
          return merged;
        });
      } else {
        setPosts(nextPosts);
      }
      setTotalPages(tp);
      setPage(nextPage);
      return { posts: nextPosts, totalPages: tp, error: Boolean(data.error) };
    },
    [categorySlug, configured, featuredPostIds, searchQuery]
  );

  useEffect(() => {
    if (!configured) return;
    if (skipFilterRef.current) {
      skipFilterRef.current = false;
      return;
    }
    let cancelled = false;
    (async () => {
      setFilterLoading(true);
      try {
        await fetchArchive(1, { append: false });
      } finally {
        if (!cancelled) setFilterLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [categorySlug, searchQuery, configured, fetchArchive]);

  const handleLoadMore = async () => {
    if (page >= totalPages || loadMoreLoading) return;
    setLoadMoreLoading(true);
    try {
      await fetchArchive(page + 1, { append: true });
    } finally {
      setLoadMoreLoading(false);
    }
  };

  const isFiltered = Boolean(searchQuery || categorySlug);
  const useEditorialLayout = configured && !loadError && !isFiltered;
  const { hero, secondary, sidebar, belowGrid } = getEditorialSplit(featuredPosts, posts);
  const showEditorialBlock = useEditorialLayout && Boolean(hero);
  const archiveForGrid = showEditorialBlock ? belowGrid : posts;
  const showArchiveToolbar = !showEditorialBlock || archiveForGrid.length > 0;
  const sectionLabelSx = {
    fontSize: "0.7rem",
    fontWeight: 800,
    letterSpacing: "0.14em",
    color: "text.secondary",
    display: "block",
  };

  const isArchiveEmpty =
    !loadError &&
    configured &&
    !filterLoading &&
    (isFiltered ? posts.length === 0 : !hero && posts.length === 0 && featuredPosts.length === 0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
      <Box component="main" id="main-content" sx={{ flex: 1, pt: { xs: 9, md: 10 }, pb: 8 }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "flex-start" }}
            sx={{ mb: 3 }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h1" sx={{ fontSize: { xs: "1.85rem", md: "2.5rem" }, fontWeight: 800, letterSpacing: "-0.02em" }}>
                BrandSync Blogs
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 520 }}>
                Expert insights, team updates, and best practices to build better.
              </Typography>
            </Box>
            <TextField
              size="small"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              disabled={!configured}
              sx={{
                width: { xs: "100%", md: 280 },
                "& .MuiOutlinedInput-root": { borderRadius: 999 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlass size={18} aria-hidden />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          {configured ? (
            <Stack direction="row" spacing={1} sx={{ overflowX: "auto", flexWrap: "nowrap", pb: 2, mb: 1, mx: -0.5 }}>
              <Chip
                label="Explore"
                onClick={() => setCategorySlug("")}
                color={categorySlug === "" ? "primary" : "default"}
                variant={categorySlug === "" ? "filled" : "outlined"}
                sx={{ flexShrink: 0, fontWeight: 600 }}
              />
              {categories.map((c) => (
                <Chip
                  key={c.id}
                  label={c.name}
                  onClick={() => setCategorySlug(c.slug)}
                  color={categorySlug === c.slug ? "primary" : "default"}
                  variant={categorySlug === c.slug ? "filled" : "outlined"}
                  sx={{ flexShrink: 0, fontWeight: 600 }}
                />
              ))}
            </Stack>
          ) : null}

          {filterLoading ? (
            <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />
          ) : null}

          {loadError && (
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
              <Typography color="text.secondary">
                We couldn&apos;t load posts from the WordPress CMS. The site may be down or blocking requests from this server.
              </Typography>
            </Paper>
          )}

          {!configured && !loadError && (
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
              <Typography color="text.secondary">
                WordPress posts could not be loaded. Try again later or contact support if this persists.
              </Typography>
            </Paper>
          )}

          {showEditorialBlock && hero ? (
            <Box sx={{ mb: { xs: 3, md: 4 } }}>
              <Typography variant="overline" sx={{ ...sectionLabelSx, mb: 1.5 }}>
                Featured
              </Typography>
              <BlogEditorialHeroCard post={hero} />
            </Box>
          ) : null}

          {showEditorialBlock && hero && (secondary || sidebar.length > 0) ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  sidebar.length > 0
                    ? { xs: "1fr", md: "minmax(0, 1.85fr) minmax(260px, 1fr)" }
                    : { xs: "1fr", md: "1fr" },
                gap: { xs: 2.5, md: 3 },
                mb: { xs: 4, md: 5 },
                alignItems: "start",
              }}
            >
              {secondary ? (
                <Box sx={{ minWidth: 0 }}>
                  <BlogEditorialMainCard post={secondary} />
                </Box>
              ) : (
                <Box sx={{ display: { xs: "none", md: "block" } }} />
              )}
              {sidebar.length > 0 ? (
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="overline" sx={{ ...sectionLabelSx, mb: 1.5 }}>
                    Latest
                  </Typography>
                  <Stack spacing={2}>
                    {sidebar.map((post) => (
                      <BlogLatestRowCard key={post.id} post={post} />
                    ))}
                  </Stack>
                </Box>
              ) : null}
            </Box>
          ) : null}

          {showArchiveToolbar ? (
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
              <Typography variant="h6" fontWeight={800}>
                {showEditorialBlock ? "More articles" : "All articles"}
              </Typography>
              <ToggleButtonGroup
                size="small"
                value={viewMode}
                exclusive
                onChange={(_, v) => v && setViewMode(v)}
                aria-label="View mode"
              >
                <ToggleButton value="grid" aria-label="Grid view">
                  <GridFour size={18} />
                </ToggleButton>
                <ToggleButton value="list" aria-label="List view">
                  <ListBullets size={18} />
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          ) : null}

          {isArchiveEmpty ? (
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {!searchQuery && !categorySlug ? "No articles published yet." : "No posts match your filters yet."}
            </Typography>
          ) : null}

          {archiveForGrid.length > 0 ? (
            viewMode === "grid" ? (
              <Box
                sx={{
                  display: "grid",
                  gap: 2.5,
                  gridTemplateColumns: "1fr",
                  "@media (min-width: 600px)": {
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  },
                  "@media (min-width: 768px)": {
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  },
                }}
              >
                {archiveForGrid.map((post) => (
                  <BlogArticleCard key={post.id} post={post} variant="grid" />
                ))}
              </Box>
            ) : (
              <Stack spacing={2}>
                {archiveForGrid.map((post) => (
                  <BlogArticleCard key={post.id} post={post} variant="list" />
                ))}
              </Stack>
            )
          ) : null}

          {configured && page < totalPages ? (
            <Stack alignItems="center" sx={{ mt: 5 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={handleLoadMore}
                disabled={loadMoreLoading}
                startIcon={loadMoreLoading ? <CircularProgress size={18} color="inherit" /> : <ArrowClockwise size={20} />}
                sx={{ borderRadius: 999, px: 3, fontWeight: 700 }}
              >
                Load more
              </Button>
            </Stack>
          ) : null}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
