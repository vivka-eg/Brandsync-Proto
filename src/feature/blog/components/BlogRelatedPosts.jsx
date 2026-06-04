"use client";

import React from "react";
import Link from "next/link";
import { Box, Chip, Paper, Typography } from "@mui/material";
import BlogFeaturedImage from "@/feature/blog/components/BlogFeaturedImage";
import { formatPostDate } from "@/feature/blog/utils/formatPostDate";

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
 * @property {Array<{ id: number, name: string, slug: string }>} categories
 */

function primaryCategoryLabel(post) {
  const c = post.categories?.[0];
  const name = c?.name?.trim();
  return name || "Uncategorized";
}

/**
 * @param {{ post: BlogPostSummary }} props
 */
function BlogRelatedPostCard({ post }) {
  const imgAlt = post.title ? `${post.title} cover` : "Article cover";
  return (
    <Paper
      component={Link}
      href={post.href}
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
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
          sizes="(max-width: 600px) 100vw, 280px"
          maxHeight={180}
          borderRadius={0}
        />
      ) : (
        <Box sx={{ height: 120, bgcolor: "action.hover" }} />
      )}
      <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 1 }}>
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
        </Box>
        <Typography
          variant="subtitle1"
          fontWeight={800}
          sx={{
            fontSize: "0.95rem",
            lineHeight: 1.35,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.title}
        </Typography>
      </Box>
    </Paper>
  );
}

/**
 * @param {{ posts: BlogPostSummary[] }} props
 */
export default function BlogRelatedPosts({ posts }) {
  if (!Array.isArray(posts) || posts.length === 0) return null;

  return (
    <Box
      component="section"
      aria-labelledby="related-posts-heading"
      sx={{
        mt: 6,
        pt: 5,
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        id="related-posts-heading"
        variant="h5"
        component="h2"
        fontWeight={800}
        sx={{ mb: 2.5, fontSize: { xs: "1.15rem", md: "1.35rem" } }}
      >
        Related articles
      </Typography>
      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: {
            xs: "1fr",
            sm: posts.length >= 2 ? "repeat(2, minmax(0, 1fr))" : "1fr",
            md: `repeat(${Math.min(posts.length, 3)}, minmax(0, 1fr))`,
          },
        }}
      >
        {posts.map((post) => (
          <BlogRelatedPostCard key={post.id} post={post} />
        ))}
      </Box>
    </Box>
  );
}
