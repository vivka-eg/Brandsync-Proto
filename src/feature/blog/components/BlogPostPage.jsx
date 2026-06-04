"use client";

import React from "react";
import Link from "next/link";
import { Box, Typography, Button, Container } from "@mui/material";
import BlogFeaturedImage from "@/feature/blog/components/BlogFeaturedImage";
import BlogPostContent from "@/feature/blog/components/BlogPostContent";
import BlogRelatedPosts from "@/feature/blog/components/BlogRelatedPosts";
import { ArrowLeft } from "phosphor-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPostDate } from "@/feature/blog/utils/formatPostDate";

/**
 * @param {{
 *   post: {
 *     title: string,
 *     date: string,
 *     featuredImageUrl: string | null,
 *     featuredImageWidth?: number | null,
 *     featuredImageHeight?: number | null,
 *     contentHtml: string,
 *     categories?: Array<{ id: number, name: string, slug: string }>,
 *   },
 *   relatedPosts?: Array<{
 *     id: number,
 *     slug: string,
 *     title: string,
 *     excerpt: string,
 *     date: string,
 *     featuredImageUrl: string | null,
 *     featuredImageWidth?: number | null,
 *     featuredImageHeight?: number | null,
 *     href: string,
 *     categories?: Array<{ id: number, name: string, slug: string }>,
 *   }>,
 * }} props
 */
export default function BlogPostPage({ post, relatedPosts = [] }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box component="main" id="main-content" sx={{ flex: 1, pt: 10, pb: 8 }}>
        <Container maxWidth="md">
          <Button
            component={Link}
            href="/blog"
            startIcon={<ArrowLeft size={18} />}
            sx={{ mb: 3 }}
            color="inherit"
          >
            Blog
          </Button>
          <Box sx={{ width: "100%", textAlign: "left", mb: 3 }}>
            <Typography
              component="p"
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                width: "100%",
                m: 0,
                mb: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                lineHeight: 1.4,
                letterSpacing: "0.02em",
                textTransform: "none",
              }}
            >
              {formatPostDate(post.date)}
            </Typography>
            <Typography
              component="h1"
              variant="h1"
              sx={{
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                fontWeight: 800,
                m: 0,
                lineHeight: 1.2,
              }}
            >
              {post.title}
            </Typography>
          </Box>
          {post.featuredImageUrl ? (
            <Box sx={{ mb: 4 }}>
              <BlogFeaturedImage
                src={post.featuredImageUrl}
                alt={post.title}
                width={post.featuredImageWidth}
                height={post.featuredImageHeight}
                priority
                sizes="(max-width: 900px) 100vw, 860px"
                maxHeight="min(70vh, 640px)"
                borderRadius={2}
              />
            </Box>
          ) : null}
          <BlogPostContent contentHtml={post.contentHtml} />
          <BlogRelatedPosts posts={relatedPosts} />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
