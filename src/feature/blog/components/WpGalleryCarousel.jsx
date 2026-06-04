"use client";

import React, { useCallback, useEffect, useState } from "react";
import NextImage from "next/image";
import { Box, IconButton } from "@mui/material";
import { CaretLeft, CaretRight } from "phosphor-react";

/**
 * @typedef {{ src: string, alt: string, width: number | null, height: number | null }} WpGalleryImage
 */

/**
 * @param {{ images: WpGalleryImage[] }} props
 */
export default function WpGalleryCarousel({ images }) {
  const count = images.length;
  const [active, setActive] = useState(0);
  const hasMany = count > 1;
  const current = images[Math.min(active, count - 1)];

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

  if (!current) return null;

  const iw = current.width || 960;
  const ih = current.height || 540;

  return (
    <Box
      component="figure"
      role="region"
      aria-roledescription={hasMany ? "carousel" : undefined}
      aria-label={hasMany ? `Image gallery, slide ${active + 1} of ${count}` : "Image gallery"}
      sx={{
        position: "relative",
        width: "100%",
        my: 4,
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "action.hover",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: { xs: 200, sm: 280 },
        }}
      >
        <NextImage
          key={current.src}
          src={current.src}
          alt={current.alt || `Gallery image ${active + 1}`}
          width={iw}
          height={ih}
          sizes="(max-width: 900px) 100vw, 860px"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "min(70vh, 640px)",
            display: "block",
            objectFit: "contain",
          }}
        />
      </Box>

      {hasMany ? (
        <>
          <IconButton
            aria-label="Previous image"
            onClick={goPrev}
            size="medium"
            sx={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: 1,
              "&:hover": { bgcolor: "background.paper" },
            }}
          >
            <CaretLeft size={20} weight="bold" />
          </IconButton>
          <IconButton
            aria-label="Next image"
            onClick={goNext}
            size="medium"
            sx={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: 1,
              "&:hover": { bgcolor: "background.paper" },
            }}
          >
            <CaretRight size={20} weight="bold" />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              py: 1.5,
              px: 2,
              bgcolor: "background.paper",
              borderTop: "1px solid",
              borderColor: "divider",
              overflowX: "auto",
              justifyContent: { xs: "flex-start", sm: "center" },
              scrollbarWidth: "thin",
            }}
          >
            {images.map((img, index) => {
              const isActive = index === active;
              const thumbW = img.width || 960;
              const thumbH = img.height || 540;
              return (
                <Box
                  key={img.src}
                  component="button"
                  type="button"
                  aria-label={`Go to image ${index + 1}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => setActive(index)}
                  sx={{
                    position: "relative",
                    flexShrink: 0,
                    width: 88,
                    height: 56,
                    p: 0,
                    border: "2px solid",
                    borderColor: isActive ? "primary.main" : "transparent",
                    borderRadius: 1,
                    overflow: "hidden",
                    cursor: "pointer",
                    bgcolor: "action.hover",
                    opacity: isActive ? 1 : 0.65,
                    transition: "opacity 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                    boxShadow: isActive ? 2 : 0,
                    "&:hover": { opacity: 1 },
                    "&:focus-visible": {
                      outline: "2px solid",
                      outlineColor: "primary.main",
                      outlineOffset: 2,
                    },
                  }}
                >
                  <NextImage
                    src={img.src}
                    alt=""
                    width={thumbW}
                    height={thumbH}
                    sizes="88px"
                    aria-hidden
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </>
      ) : null}
    </Box>
  );
}
