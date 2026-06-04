"use client";

import React, { useMemo } from "react";
import { Box } from "@mui/material";
import WpGalleryCarousel from "@/feature/blog/components/WpGalleryCarousel";
import { parseWpPostHtml } from "@/feature/blog/utils/parseWpPostHtml";

const wpContentSx = {
  "& p": { mb: 2, lineHeight: 1.75 },
  "& h2, & h3, & h4": { mt: 4, mb: 2, fontWeight: 700 },
  "& img": { maxWidth: "100%", height: "auto", borderRadius: 1 },
  "& a": { color: "primary.main", fontWeight: 500 },
  "& ul, & ol": { pl: 3, mb: 2 },
  "& blockquote": {
    borderLeft: "4px solid",
    borderColor: "divider",
    pl: 2,
    ml: 0,
    fontStyle: "italic",
    color: "text.secondary",
  },
  /* Hide any gallery markup that was not parsed (fallback). */
  "& figure.wp-block-gallery": { display: "none" },
};

/**
 * @param {{ contentHtml: string }} props
 */
export default function BlogPostContent({ contentHtml }) {
  const parts = useMemo(() => parseWpPostHtml(contentHtml), [contentHtml]);

  return (
    <Box className="wp-post-content" sx={wpContentSx}>
      {parts.map((part, index) => {
        if (part.type === "gallery") {
          return <WpGalleryCarousel key={`gallery-${index}`} images={part.images} />;
        }
        return (
          <Box
            key={`html-${index}`}
            component="div"
            sx={wpContentSx}
            dangerouslySetInnerHTML={{ __html: part.html }}
          />
        );
      })}
    </Box>
  );
}
