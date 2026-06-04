"use client";

import React, { useCallback, useLayoutEffect, useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { X, CaretLeft, CaretRight } from "phosphor-react";
import gsap from "gsap";
import useOnboardingGalleryAssets from "../hooks/useOnboardingGalleryAssets";
import OnboardingBrandGalleryMosaic from "./OnboardingBrandGalleryMosaic";

/** Center card uses local asset; side cards use gradients (carousel energy without extra requests). */
const REF_CARD_BG = "url(/digital-ad-builder/onboarding-carousel-ref.png)";

const SLIDES = [
  {
    headline: "A place to craft your display masterpiece.",
    subline:
      "Start from approved logos, palettes, and stock imagery, then compose layouts that stay faithful to your brand system.",
    /** Wider horizontal spread  -  cards reach toward the banner edges from center. */
    fanEdgeToEdge: true,
    cards: [
      {
        rot: -17,
        x: -172,
        y: 12,
        z: 1,
        bg: `linear-gradient(145deg, ${alpha("#312e81", 0.95)} 0%, ${alpha("#6366f1", 0.85)} 100%)`,
      },
      {
        rot: -8,
        x: -86,
        y: 6,
        z: 2,
        bg: `linear-gradient(145deg, ${alpha("#0f766e", 0.95)} 0%, ${alpha("#2dd4bf", 0.75)} 100%)`,
      },
      {
        rot: 0,
        x: 0,
        y: 0,
        z: 5,
        bg: REF_CARD_BG,
        cover: true,
      },
      {
        rot: 8,
        x: 86,
        y: 6,
        z: 2,
        bg: `linear-gradient(145deg, ${alpha("#9d174d", 0.9)} 0%, ${alpha("#f472b6", 0.75)} 100%)`,
      },
      {
        rot: 17,
        x: 172,
        y: 12,
        z: 1,
        bg: `linear-gradient(145deg, ${alpha("#1e3a5f", 0.95)} 0%, ${alpha("#38bdf8", 0.7)} 100%)`,
      },
    ],
    bubbles: [],
  },
  {
    headline: "Stay on brand, without the extra noise.",
    subline:
      "Approved product logos, curated stock images, and brand color palettes are already wired in. Drop in your copy, tune the layout, and ship. No hunting for “allowed” assets or palette guesswork.",
    visual: "brandGallery",
    galleryTall: true,
    cards: [],
    bubbles: [],
  },
  {
    headline: "Export files your team can traffic today.",
    subline:
      "Download PNG or JPEG at the exact pixel dimensions, named for your product and format so handoff stays painless.",
    cards: [
      {
        rot: -15,
        x: -90,
        y: 11,
        z: 1,
        bg: `linear-gradient(135deg, ${alpha("#292524", 0.96)} 0%, ${alpha("#78716c", 0.65)} 100%)`,
      },
      {
        rot: -7,
        x: -46,
        y: 5,
        z: 2,
        bg: `linear-gradient(135deg, ${alpha("#422006", 0.95)} 0%, ${alpha("#fb923c", 0.65)} 100%)`,
      },
      {
        rot: 0,
        x: 0,
        y: 0,
        z: 5,
        bg: `linear-gradient(135deg, ${alpha("#14532d", 0.92)} 0%, ${alpha("#4ade80", 0.55)} 100%)`,
        fauxUi: "export",
      },
      {
        rot: 7,
        x: 46,
        y: 5,
        z: 2,
        bg: `linear-gradient(135deg, ${alpha("#3b0764", 0.94)} 0%, ${alpha("#c084fc", 0.6)} 100%)`,
      },
      {
        rot: 15,
        x: 90,
        y: 11,
        z: 1,
        bg: `linear-gradient(135deg, ${alpha("#1c1917", 0.96)} 0%, ${alpha("#a8a29e", 0.55)} 100%)`,
      },
    ],
    bubbles: [
      { label: "PNG · JPEG", tone: "blue", left: "7%", top: "9%" },
      { label: "Pixel-perfect", tone: "mint", right: "8%", top: "15%" },
    ],
  },
];

function Bubble({ label, tone, sx: bubbleSx = {} }) {
  const bg =
    tone === "mint"
      ? (t) => alpha(t.palette.success.main, 0.92)
      : (t) => alpha(t.palette.primary.main, 0.92);
  return (
    <Box
      sx={{
        position: "absolute",
        px: 1.25,
        py: 0.5,
        borderRadius: 999,
        typography: "caption",
        fontWeight: 700,
        color: "common.white",
        boxShadow: 2,
        zIndex: 8,
        pointerEvents: "none",
        ...bubbleSx,
        bgcolor: (theme) => bg(theme),
      }}
    >
      {label}
    </Box>
  );
}

function CardFace({ cfg }) {
  const theme = useTheme();
  if (cfg.fauxUi === "preview") {
    return (
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          p: 1,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          justifyContent: "center",
        }}
      >
        <Box sx={{ height: 4, width: "55%", borderRadius: 1, bgcolor: alpha(theme.palette.common.white, 0.85) }} />
        <Box sx={{ height: 3, width: "80%", borderRadius: 1, bgcolor: alpha(theme.palette.common.white, 0.45) }} />
        <Box sx={{ height: 3, width: "40%", borderRadius: 1, bgcolor: alpha(theme.palette.common.white, 0.35) }} />
        <Box
          sx={{
            mt: 0.5,
            alignSelf: "center",
            px: 1,
            py: 0.25,
            borderRadius: 10,
            bgcolor: alpha(theme.palette.common.white, 0.25),
            fontSize: 9,
            fontWeight: 700,
            color: alpha(theme.palette.common.white, 0.95),
          }}
        >
          300×250
        </Box>
      </Box>
    );
  }
  if (cfg.fauxUi === "export") {
    return (
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 800,
            color: alpha(theme.palette.common.white, 0.95),
            letterSpacing: 0.02,
          }}
        >
          .png
        </Typography>
        <Box
          sx={{
            width: 36,
            height: 3,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.common.white, 0.5),
          }}
        />
      </Box>
    );
  }
  return null;
}

export default function AdBuilderOnboardingDialog({ open, onGetStarted, onRemindLater, galleryLogos = [] }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const compact = useMediaQuery(theme.breakpoints.down("md"));
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", { defaultMatches: false });

  const [index, setIndex] = useState(0);
  const fanRef = useRef(null);
  const brandGalleryRef = useRef(null);
  const textRef = useRef(null);
  const cardEls = useRef([]);

  const { portrait: stockPortrait, landscape: stockLandscape, loading: stockLoading } =
    useOnboardingGalleryAssets(open);
  const prevOpen = useRef(false);
  /** After slide-0 load fan-in finishes for this dialog open; reset when `open` becomes true. */
  const firstSlideIntroDoneRef = useRef(false);
  const indexRef = useRef(index);
  indexRef.current = index;

  const n = SLIDES.length;
  const slide = SLIDES[index];

  const getFanParams = useCallback(
    (slideIdx) => {
      const s = SLIDES[slideIdx];
      const edge = Boolean(s.fanEdgeToEdge);
      const scaleFan = edge ? (compact ? 0.92 : 1) : compact ? 0.72 : 1;
      return { cfg: s.cards, scaleFan };
    },
    [compact],
  );

  const go = useCallback(
    (dir) => {
      setIndex((i) => (i + dir + n) % n);
    },
    [n],
  );

  useEffect(() => {
    cardEls.current = [];
  }, [index]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  useEffect(() => {
    if (open && !prevOpen.current) {
      setIndex(0);
    }
    prevOpen.current = open;
  }, [open]);

  /** Allow slide-0 load fan-in every time the dialog opens (also fixes Strict Mode remount). */
  useLayoutEffect(() => {
    if (open) {
      firstSlideIntroDoneRef.current = false;
    }
  }, [open]);

  /**
   * Slide-0 stagger runs here  -  not in useLayoutEffect. MUI Dialog wraps content in Fade; the default
   * ~225ms enter kept the paper at opacity 0 while GSAP finished, so the fan-in was invisible.
   */
  const handleTransitionEntered = useCallback(() => {
    if (!open || reducedMotion) return;
    if (indexRef.current !== 0) return;
    if (firstSlideIntroDoneRef.current) return;

    const play = () => {
      const cards = cardEls.current.filter(Boolean);
      const { cfg, scaleFan } = getFanParams(0);
      if (cards.length < cfg.length) {
        requestAnimationFrame(play);
        return;
      }

      firstSlideIntroDoneRef.current = true;

      gsap.context(() => {
        cfg.forEach((c, i) => {
          const el = cards[i];
          if (!el) return;
          gsap.fromTo(
            el,
            {
              opacity: 0,
              y: 56,
              scale: 0.82,
              rotation: c.rot * 1.25,
              x: c.x * scaleFan * 0.18,
            },
            {
              opacity: 1,
              y: c.y,
              scale: 1,
              rotation: c.rot,
              x: c.x * scaleFan,
              zIndex: c.z,
              duration: 0.65,
              ease: "back.out(1.12)",
              delay: i * 0.07,
              overwrite: "auto",
            },
          );
        });
        if (textRef.current) {
          gsap.fromTo(
            textRef.current,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.48, delay: 0.12, ease: "power2.out", overwrite: "auto" },
          );
        }
      }, fanRef);
    };

    play();
  }, [open, reducedMotion, getFanParams]);

  /** If Fade never calls onEntered (edge cases), still run the fan-in once the dialog is up. */
  useEffect(() => {
    if (!open || reducedMotion || index !== 0 || firstSlideIntroDoneRef.current) return undefined;
    const id = window.setTimeout(() => {
      if (firstSlideIntroDoneRef.current) return;
      handleTransitionEntered();
    }, 80);
    return () => clearTimeout(id);
  }, [open, reducedMotion, index, handleTransitionEntered]);

  /** Prepare slide-0 “from” state; tween other slides / resize. Actual slide-0 intro = handleTransitionEntered. */
  useLayoutEffect(() => {
    if (!open || !fanRef.current) return undefined;

    const { cfg, scaleFan } = getFanParams(index);
    const cardCount = cfg.length;

    let cancelled = false;
    let ctx = null;

    const runAnimations = (cards) => {
      ctx = gsap.context(() => {
        const slideDef = SLIDES[index];
        if (slideDef.visual === "brandGallery") {
          if (reducedMotion) {
            if (brandGalleryRef.current) gsap.set(brandGalleryRef.current, { opacity: 1, y: 0 });
            if (textRef.current) gsap.set(textRef.current, { opacity: 1, y: 0 });
            return;
          }
          if (brandGalleryRef.current) {
            gsap.fromTo(
              brandGalleryRef.current,
              { opacity: 0, y: 22 },
              { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", overwrite: "auto" },
            );
          }
          if (textRef.current) {
            gsap.fromTo(
              textRef.current,
              { opacity: 0, y: 12 },
              { opacity: 1, y: 0, duration: 0.36, ease: "power2.out", overwrite: "auto" },
            );
          }
          return;
        }

        if (reducedMotion) {
          cfg.forEach((c, i) => {
            const el = cards[i];
            if (!el) return;
            gsap.set(el, {
              x: c.x * scaleFan,
              y: c.y,
              rotation: c.rot,
              zIndex: c.z,
              opacity: 1,
              scale: 1,
            });
          });
          if (textRef.current) gsap.set(textRef.current, { opacity: 1, y: 0 });
          if (index === 0) firstSlideIntroDoneRef.current = true;
          return;
        }

        if (index === 0 && !firstSlideIntroDoneRef.current) {
          cfg.forEach((c, i) => {
            const el = cards[i];
            if (!el) return;
            gsap.set(el, {
              opacity: 0,
              y: 56,
              scale: 0.82,
              rotation: c.rot * 1.25,
              x: c.x * scaleFan * 0.18,
              zIndex: c.z,
            });
          });
          if (textRef.current) gsap.set(textRef.current, { opacity: 0, y: 22 });
          return;
        }

        cfg.forEach((c, i) => {
          const el = cards[i];
          if (!el) return;
          gsap.to(el, {
            x: c.x * scaleFan,
            y: c.y,
            rotation: c.rot,
            zIndex: c.z,
            duration: 0.52,
            ease: "power2.inOut",
            overwrite: "auto",
          });
        });
        if (textRef.current) {
          gsap.fromTo(
            textRef.current,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.36, ease: "power2.out", overwrite: "auto" },
          );
        }
      }, fanRef);
    };

    const tryRun = (attempt) => {
      if (cancelled) return;
      if (SLIDES[index].visual === "brandGallery") {
        if (!brandGalleryRef.current && attempt < 32) {
          requestAnimationFrame(() => tryRun(attempt + 1));
          return;
        }
        runAnimations([]);
        return;
      }
      const cards = cardEls.current.filter(Boolean);
      if (cards.length < cardCount && attempt < 20) {
        requestAnimationFrame(() => tryRun(attempt + 1));
        return;
      }
      if (cards.length < cardCount) return;
      runAnimations(cards);
    };

    tryRun(0);

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [open, index, compact, reducedMotion, getFanParams]);

  const setCardRef = useCallback((i) => (el) => {
    cardEls.current[i] = el;
  }, []);

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
          onRemindLater();
        }
      }}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      scroll="paper"
      transitionDuration={{
        enter: 0,
        exit: theme.transitions.duration.leavingScreen,
      }}
      slotProps={{
        transition: {
          onEntered: handleTransitionEntered,
        },
      }}
      aria-labelledby="ad-builder-onboarding-title"
      aria-describedby="ad-builder-onboarding-desc"
      aria-roledescription="carousel"
      PaperProps={{
        elevation: 12,
        sx: {
          borderRadius: { xs: 0, sm: 3 },
          border: "1px solid",
          borderColor: "divider",
          background: (t) =>
            t.palette.mode === "dark"
              ? alpha(t.palette.background.paper, 0.98)
              : `linear-gradient(180deg, ${alpha("#fafaf9", 1)} 0%, ${alpha("#f5f5f4", 1)} 100%)`,
          overflow: "hidden",
          maxHeight: fullScreen ? "100%" : "min(92vh, 760px)",
        },
      }}
    >
      <IconButton
        aria-label="Close"
        onClick={onRemindLater}
        size="small"
        sx={{ position: "absolute", right: 12, top: 12, zIndex: 10 }}
      >
        <X size={22} />
      </IconButton>

      <Box sx={{ pt: { xs: 5, sm: 6 }, pb: 2.5, px: { xs: 2, sm: 4 } }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ letterSpacing: 0.14, display: "block", textAlign: "center", mb: 1 }}
        >
          AD Studio
        </Typography>

        <Box ref={textRef} sx={{ textAlign: "center", mb: { xs: 2, sm: 3 }, minHeight: { xs: 132, sm: 120 } }}>
          <Typography
            id="ad-builder-onboarding-title"
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              mb: 1.5,
              fontSize: { xs: "1.5rem", sm: "1.85rem", md: "2rem" },
              px: { xs: 0, sm: 2 },
            }}
          >
            {slide.headline}
          </Typography>
          <Typography
            id="ad-builder-onboarding-desc"
            variant="body1"
            color="text.secondary"
            sx={{ lineHeight: 1.65, maxWidth: 520, mx: "auto", fontSize: { xs: "0.95rem", sm: "1rem" } }}
          >
            {slide.subline}
          </Typography>
        </Box>

        <Box
          ref={fanRef}
          sx={{
            position: "relative",
            ...(slide.galleryTall
              ? {
                  height: "auto",
                  minHeight: { xs: 300, sm: 360 },
                }
              : {
                  height: { xs: 200, sm: 240 },
                }),
            mx: slide.fanEdgeToEdge ? { xs: -2, sm: -4 } : "auto",
            maxWidth: slide.fanEdgeToEdge ? "none" : 520,
            width: slide.fanEdgeToEdge ? { xs: "calc(100% + 16px)", sm: "calc(100% + 32px)" } : "100%",
            mb: 2,
          }}
        >
          {(slide.bubbles ?? []).map((b) => (
            <Bubble
              key={`${index}-${b.label}`}
              label={b.label}
              tone={b.tone}
              sx={{
                ...(b.left != null && { left: b.left }),
                ...(b.right != null && { right: b.right }),
                ...(b.top != null && { top: b.top }),
              }}
            />
          ))}

          {slide.visual === "brandGallery" ? (
            <OnboardingBrandGalleryMosaic
              ref={brandGalleryRef}
              portrait={stockPortrait}
              landscape={stockLandscape}
              stockLoading={stockLoading}
              logos={galleryLogos}
            />
          ) : (
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: "52%",
                width: slide.fanEdgeToEdge ? "100%" : { xs: 280, sm: 400 },
                maxWidth: slide.fanEdgeToEdge ? "100%" : undefined,
                height: { xs: 140, sm: 180 },
                transform: "translate(-50%, -50%)",
              }}
            >
              {slide.cards.map((cfg, i) => (
                <Box
                  key={i}
                  ref={setCardRef(i)}
                  data-ad-card
                  sx={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: { xs: 72, sm: 88 },
                    height: { xs: 96, sm: 118 },
                    ml: { xs: -4.5, sm: -5.5 },
                    mt: { xs: -6, sm: -7.25 },
                    borderRadius: 2.5,
                    transformOrigin: "center bottom",
                    boxShadow: (t) =>
                      `0 18px 40px ${alpha(t.palette.common.black, 0.2)}, 0 0 0 1px ${alpha(t.palette.common.black, 0.06)}`,
                    overflow: "hidden",
                    zIndex: cfg.z,
                    ...(cfg.cover
                      ? {
                          backgroundImage: cfg.bg,
                          backgroundSize: "cover",
                          backgroundPosition: "center 22%",
                          backgroundRepeat: "no-repeat",
                        }
                      : {
                          background: cfg.bg,
                        }),
                  }}
                >
                  {!cfg.cover && <CardFace cfg={cfg} />}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap={{ xs: 1, sm: 2 }}
          sx={{ mb: 2 }}
        >
          <IconButton aria-label="Previous slide" onClick={() => go(-1)} size="small">
            <CaretLeft size={22} />
          </IconButton>
          <Stack direction="row" gap={1} role="tablist" aria-label="Onboarding slides">
            {SLIDES.map((_, i) => (
              <Box
                key={i}
                role="tab"
                aria-selected={i === index}
                onClick={() => setIndex(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIndex(i);
                  }
                }}
                tabIndex={0}
                sx={{
                  width: i === index ? 22 : 8,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: i === index ? "primary.main" : "action.disabledBackground",
                  cursor: "pointer",
                  transition: "width 0.25s ease, background-color 0.2s ease",
                  "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
                }}
              />
            ))}
          </Stack>
          <IconButton aria-label="Next slide" onClick={() => go(1)} size="small">
            <CaretRight size={22} />
          </IconButton>
        </Stack>

        <DialogActions
          sx={{
            px: 0,
            pt: 1,
            pb: 0,
            flexDirection: { xs: "column-reverse", sm: "row" },
            gap: 1,
            justifyContent: "center",
          }}
        >
          <Button variant="text" color="inherit" onClick={onRemindLater} sx={{ minWidth: 140 }}>
            Remind me later
          </Button>
          <Button variant="contained" size="large" onClick={onGetStarted} sx={{ minWidth: 200, borderRadius: 999, px: 4 }}>
            Get started
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
