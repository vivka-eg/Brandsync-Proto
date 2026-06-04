"use client";

import NextImage from "next/image";
import { Box } from "@mui/material";

/**
 * Featured image that shows the full asset without cropping.
 *
 * @param {{
 *   src: string,
 *   alt: string,
 *   width?: number | null,
 *   height?: number | null,
 *   sizes?: string,
 *   priority?: boolean,
 *   maxHeight?: string | number | object,
 *   borderRadius?: number | string,
 *   fixedSize?: { width: number, height: number },
 * }} props
 */
export default function BlogFeaturedImage({
  src,
  alt,
  width = null,
  height = null,
  sizes = "(max-width: 900px) 100vw, 640px",
  priority = false,
  maxHeight,
  borderRadius = 1.5,
  fixedSize,
}) {
  const hasIntrinsicSize =
    typeof width === "number" && typeof height === "number" && width > 0 && height > 0;

  if (fixedSize) {
    return (
      <Box
        sx={{
          position: "relative",
          width: fixedSize.width,
          height: fixedSize.height,
          flexShrink: 0,
          borderRadius,
          overflow: "hidden",
          bgcolor: "action.hover",
        }}
      >
        <NextImage
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: "contain", objectPosition: "center" }}
        />
      </Box>
    );
  }

  if (hasIntrinsicSize) {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          bgcolor: "action.hover",
          borderRadius,
          overflow: "hidden",
        }}
      >
        <NextImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes={sizes}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: maxHeight ?? "min(65vh, 520px)",
            display: "block",
            objectFit: "contain",
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        maxHeight: maxHeight ?? "min(65vh, 520px)",
        borderRadius,
        overflow: "hidden",
        bgcolor: "action.hover",
      }}
    >
      <NextImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        style={{ objectFit: "contain", objectPosition: "center" }}
      />
    </Box>
  );
}
