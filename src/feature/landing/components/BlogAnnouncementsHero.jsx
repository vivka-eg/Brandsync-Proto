"use client";

import React from "react";
import Link from "next/link";
import NextImage from "next/image";
import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import { ArrowRight } from "phosphor-react";
import { formatPostDate } from "@/feature/blog/utils/formatPostDate";

/**
 * @param {object} props
 * @param {Array<{ id: number, slug: string, title: string, excerpt: string, date: string, featuredImageUrl: string | null, href: string }>} props.posts
 * @param {"bottom" | "top"} [props.placement] — `bottom` uses compact section layout for end-of-page placement.
 */
export default function BlogAnnouncementsHero({ posts = [], placement = "bottom" }) {
  if (posts.length === 0) {
    return null;
  }

  const isBottom = placement === "bottom";

  return (
    <Box
      component="section"
      aria-labelledby="announcements-heading"
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        bgcolor: isBottom ? "grey.50" : "#ffffff",
        borderTop: isBottom ? "1px solid" : "none",
        borderColor: "divider",
        minHeight: isBottom ? undefined : { xs: "auto", md: "min(100vh, 900px)" },
        px: { xs: 3, md: 6 },
        pt: isBottom ? { xs: 6, md: 8 } : { xs: 10, md: 12 },
        pb: isBottom ? { xs: 8, md: 10 } : { xs: 6, md: 8 },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          pointerEvents: "none",
          zIndex: 0,
          opacity: isBottom ? 0.4 : 1,
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          mx: "auto",
          width: "100%",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "flex-end" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography
              id="announcements-heading"
              variant="overline"
              sx={{
                letterSpacing: "0.2em",
                color: "text.secondary",
                fontWeight: 600,
                display: "block",
                mb: 1,
              }}
            >
              Announcements
            </Typography>
            <Typography
              variant={isBottom ? "h3" : "h1"}
              component="h2"
              sx={{
                fontSize: isBottom
                  ? { xs: "1.5rem", sm: "1.75rem", md: "2rem" }
                  : { xs: "2rem", sm: "2.75rem", md: "3.25rem" },
                fontWeight: 800,
                lineHeight: 1.2,
                color: "text.primary",
              }}
            >
              Latest from the blog
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/blog"
            variant="contained"
            color="primary"
            endIcon={<ArrowRight size={18} weight="bold" />}
            sx={{
              px: 2.5,
              py: 1,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            View all posts
          </Button>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(2, 1fr)",
            },
            gap: 3,
          }}
        >
          {posts.map((post) => (
              <Paper
                key={post.id}
                component={Link}
                href={post.href}
                elevation={0}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  overflow: "hidden",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  "&:hover": {
                    boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 9",
                    bgcolor: "neutral.container",
                  }}
                >
                  {post.featuredImageUrl ? (
                    <NextImage
                      src={post.featuredImageUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 600px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "text.disabled",
                        typography: "caption",
                      }}
                    >
                      EG BrandSync
                    </Box>
                  )}
                </Box>
                <Box sx={{ p: 2.5, flex: 1, display: "flex", flexDirection: "column" }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                    {formatPostDate(post.date)}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1, lineHeight: 1.3 }}>
                    {post.title}
                  </Typography>
                  {post.excerpt ? (
                    <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                      {post.excerpt.length > 160 ? `${post.excerpt.slice(0, 157)}…` : post.excerpt}
                    </Typography>
                  ) : null}
                  <Typography
                    variant="body2"
                    color="primary"
                    fontWeight={600}
                    sx={{ mt: 2, display: "inline-flex", alignItems: "center", gap: 0.5 }}
                  >
                    Read more
                    <ArrowRight size={16} weight="bold" />
                  </Typography>
                </Box>
              </Paper>
            ))}
        </Box>
      </Box>
    </Box>
  );
}
