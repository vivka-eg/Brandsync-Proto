"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { CaretLeft, CaretRight } from "phosphor-react";
import { formatPostDate } from "@/feature/blog/utils/formatPostDate";

/**
 * @param {{ id: number, slug: string, title: string, excerpt: string, date: string, featuredImageUrl: string | null, featuredImageWidth?: number | null, featuredImageHeight?: number | null, href: string }} post
 * @param {{ imagePriority: boolean }} opts
 */
function FeaturedHeroSlide({ post, imagePriority }) {
  const hasImage = Boolean(post.featuredImageUrl);
  const iw = post.featuredImageWidth;
  const ih = post.featuredImageHeight;
  const hasIntrinsicSize =
    typeof iw === "number" && typeof ih === "number" && iw > 0 && ih > 0;

  const imageLinkFrameSx = {
    bgcolor: "transparent",
    textDecoration: "none",
    lineHeight: 0,
    fontSize: 0,
    outline: "none",
    boxShadow: "none",
    border: "none",
    overflow: "visible",
    "&:focus-visible": {
      outline: "2px solid",
      outlineColor: "primary.main",
      outlineOffset: 4,
      borderRadius: "4px",
    },
    "& > span": {
      display: "block",
      lineHeight: 0,
      maxWidth: "100% !important",
      backgroundColor: "transparent !important",
      boxShadow: "none",
      border: "none",
    },
    "& img": {
      display: "block",
      border: "none",
      outline: "none",
      boxShadow: "none",
    },
  };

  return (
    <Box
      component="article"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "center", md: "stretch" },
        justifyContent: "flex-start",
        width: "100%",
        gap: { xs: 5, md: 6 },
      }}
    >
      <Box
        sx={{
          flex: { xs: "none", md: 1 },
          minWidth: 0,
          width: { xs: "100%", md: "auto" },
          textAlign: { xs: "center", md: "left" },
          maxWidth: { xs: "100%", md: "560px" },
          order: { xs: 2, md: 1 },
        }}
      >
        <Typography
          variant="overline"
          sx={{
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(0, 0, 0, 0.5)",
            display: "block",
            mb: 1.5,
          }}
        >
          Featured
        </Typography>

        <Typography
          variant="caption"
          component="p"
          sx={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "rgba(0, 0, 0, 0.45)",
            mb: 2,
          }}
        >
          {formatPostDate(post.date)}
        </Typography>

        <Typography
          id="featured-hero-title"
          variant="h1"
          component="h1"
          sx={{
            fontSize: {
              xs: "2.5rem",
              sm: "3.25rem",
              md: "3.75rem",
              lg: "4.25rem",
            },
            fontWeight: 800,
            lineHeight: 1.08,
            color: "#000000",
            mb: post.excerpt ? 2 : 4,
          }}
        >
          {post.title}
        </Typography>

        {post.excerpt ? (
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1.05rem", md: "1.2rem" },
              color: "#5c6570",
              lineHeight: 1.75,
              mb: 4,
            }}
          >
            {post.excerpt.length > 360 ? `${post.excerpt.slice(0, 357)}…` : post.excerpt}
          </Typography>
        ) : null}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: { xs: "center", md: "flex-start" },
            flexWrap: "wrap",
          }}
        >
          <Link href={post.href} style={{ textDecoration: "none" }}>
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "14px 32px",
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: "8px",
                background: "linear-gradient(135deg, #424242 0%, #1a1a1a 100%)",
                color: "#ffffff",
                border: "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            >
              Read article
            </motion.button>
          </Link>

          <Link href="/blog" style={{ textDecoration: "none" }}>
            <motion.button
              type="button"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "14px 32px",
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: "8px",
                background: "transparent",
                color: "#1a1a1a",
                border: "2px solid #1a1a1a",
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
            >
              All posts
            </motion.button>
          </Link>
        </Box>
      </Box>

      <Box
        sx={{
          flex: { xs: "none", md: 1 },
          minWidth: 0,
          width: { xs: "100%", md: "auto" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          order: { xs: 1, md: 2 },
        }}
      >
        <Box
          sx={{
            width: hasIntrinsicSize ? "fit-content" : "100%",
            maxWidth: "100%",
            ...(hasImage
              ? {
                  bgcolor: "transparent",
                  border: "none",
                  boxShadow: "none",
                  overflow: "visible",
                }
              : {
                  background: "#ffffff",
                  borderRadius: "24px",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  overflow: "hidden",
                  transition: "box-shadow 0.2s ease, transform 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 16px 48px rgba(0, 0, 0, 0.14)",
                    transform: "translateY(-2px)",
                  },
                }),
            p: !hasImage ? 3 : 0,
            minHeight: !hasImage ? { xs: 200, sm: 220 } : undefined,
            display: "flex",
            flexDirection: "column",
            alignItems: hasIntrinsicSize ? "center" : "stretch",
          }}
        >
          {hasImage && hasIntrinsicSize ? (
            <Box
              component={Link}
              href={post.href}
              sx={{
                display: "block",
                width: "max-content",
                maxWidth: "100%",
                ...imageLinkFrameSx,
              }}
            >
              <NextImage
                src={post.featuredImageUrl}
                alt={post.title}
                width={iw}
                height={ih}
                priority={imagePriority}
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "min(100%, 640px)",
                  maxHeight: "min(65vh, 680px)",
                  display: "block",
                  borderRadius: "24px",
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                }}
              />
            </Box>
          ) : hasImage ? (
            <Box
              sx={{
                width: "100%",
                maxWidth: { md: "min(700px, 100%)" },
                height: { xs: "min(56vw, 460px)", sm: "480px", md: "600px" },
                maxHeight: { md: "min(65vh, 680px)" },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                component={Link}
                href={post.href}
                sx={{
                  flex: 1,
                  minHeight: 0,
                  display: "block",
                  position: "relative",
                  ...imageLinkFrameSx,
                }}
              >
                <NextImage
                  src={post.featuredImageUrl}
                  alt={post.title}
                  fill
                  priority={imagePriority}
                  sizes="(max-width: 900px) 100vw, 700px"
                  style={{
                    objectFit: "contain",
                    objectPosition: "center bottom",
                    borderRadius: "24px",
                    backgroundColor: "transparent",
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                  }}
                />
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                flex: 1,
                width: "100%",
                minHeight: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "grey.100",
                px: 3,
              }}
            >
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Add a featured image to this post in WordPress to show it here.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

/**
 * Featured WordPress posts — light grid hero. One post: static layout. Several: carousel
 * with arrows (desktop) and dot indicators.
 *
 * @param {{ posts?: Array<Parameters<typeof FeaturedHeroSlide>[0]['post']>, post?: Parameters<typeof FeaturedHeroSlide>[0]['post'] }} props
 */
export default function BlogFeaturedHero({ posts: postsProp, post: legacyPost }) {
  const posts = useMemo(() => {
    if (Array.isArray(postsProp) && postsProp.length > 0) return postsProp;
    if (legacyPost) return [legacyPost];
    return [];
  }, [postsProp, legacyPost]);

  const [active, setActive] = useState(0);
  const count = posts.length;
  const hasMany = count > 1;
  const current = posts[Math.min(active, count - 1)];

  useEffect(() => {
    if (active >= count) setActive(0);
  }, [active, count]);

  const goPrev = useCallback(() => {
    setActive((i) => (i - 1 + count) % count);
  }, [count]);

  const goNext = useCallback(() => {
    setActive((i) => (i + 1) % count);
  }, [count]);

  useEffect(() => {
    if (!hasMany) return undefined;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasMany, goPrev, goNext]);

  if (count === 0) return null;

  const slideKey = current.id;

  return (
    <Box
      component="section"
      aria-labelledby="featured-hero-title"
      aria-roledescription={hasMany ? "carousel" : undefined}
      aria-label={hasMany ? `Featured articles, ${active + 1} of ${count}` : undefined}
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: "min(92vh, 820px)", md: "min(88vh, 900px)" },
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
          opacity: 0.75,
        }}
      />

      {hasMany ? (
        <>
          <IconButton
            aria-label="Previous featured article"
            onClick={goPrev}
            size="large"
            sx={{
              display: { xs: "none", md: "flex" },
              position: "absolute",
              left: { md: 16, lg: 24 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 4,
              bgcolor: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: 1,
              "&:hover": { bgcolor: "background.paper" },
            }}
          >
            <CaretLeft size={22} weight="bold" />
          </IconButton>
          <IconButton
            aria-label="Next featured article"
            onClick={goNext}
            size="large"
            sx={{
              display: { xs: "none", md: "flex" },
              position: "absolute",
              right: { md: 16, lg: 24 },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 4,
              bgcolor: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: 1,
              "&:hover": { bgcolor: "background.paper" },
            }}
          >
            <CaretRight size={22} weight="bold" />
          </IconButton>
        </>
      ) : null}

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "1400px",
          mx: "auto",
          px: { xs: 3, md: 6 },
          py: { xs: 6, md: 6 },
        }}
      >
        {hasMany ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slideKey}
              role="group"
              aria-roledescription="slide"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              style={{ width: "100%" }}
            >
              <FeaturedHeroSlide post={current} imagePriority={active === 0} />
            </motion.div>
          </AnimatePresence>
        ) : (
          <FeaturedHeroSlide post={posts[0]} imagePriority />
        )}

        {hasMany ? (
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: { xs: 3, md: 4 } }}
            role="tablist"
            aria-label="Featured article slides"
          >
            {posts.map((p, i) => (
              <Box
                key={p.id}
                component="button"
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show featured article ${i + 1}: ${p.title}`}
                onClick={() => setActive(i)}
                sx={{
                  width: i === active ? 28 : 8,
                  height: 8,
                  p: 0,
                  minWidth: 0,
                  border: "none",
                  borderRadius: 999,
                  cursor: "pointer",
                  bgcolor: i === active ? "grey.900" : "rgba(0,0,0,0.2)",
                  transition: "width 0.2s ease, background-color 0.2s ease",
                  "&:focus-visible": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: 2,
                  },
                }}
              />
            ))}
          </Stack>
        ) : null}

        {hasMany ? (
          <Stack direction="row" justifyContent="center" spacing={2} sx={{ display: { xs: "flex", md: "none" }, mt: 2 }}>
            <IconButton aria-label="Previous featured article" onClick={goPrev} size="small">
              <CaretLeft size={20} weight="bold" />
            </IconButton>
            <IconButton aria-label="Next featured article" onClick={goNext} size="small">
              <CaretRight size={20} weight="bold" />
            </IconButton>
          </Stack>
        ) : null}
      </Box>
    </Box>
  );
}
