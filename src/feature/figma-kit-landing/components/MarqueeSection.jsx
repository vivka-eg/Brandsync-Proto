"use client";
import { Box } from "@mui/material";

const BASE = "/figma-kit/landing/Marquee%20section";

const allImages = [
  { src: `${BASE}/Frame%20362.svg`, alt: "EG BrandSync Dashboard" },
  { src: `${BASE}/Frame%20367.svg`, alt: "EG App Screen 1" },
  { src: `${BASE}/Frame%20367-1.svg`, alt: "EG App Screen 2" },
  { src: `${BASE}/Frame%20368.svg`, alt: "EG App Screen 3" },
  { src: `${BASE}/Frame%20368-1.svg`, alt: "EG App Screen 4" },
  { src: `${BASE}/Frame%20369.svg`, alt: "EG App Screen 5" },
  { src: `${BASE}/Frame%20369-1.svg`, alt: "EG App Screen 6" },
  { src: `${BASE}/Frame%20370.svg`, alt: "EG App Screen 7" },
];

function MarqueeRow({ images, reverse = false, speed = 60 }) {
  return (
    <Box
      sx={{
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 3,
          width: "max-content",
          animation: `marquee${reverse ? "-reverse" : ""} ${speed}s linear infinite`,
          "@keyframes marquee": {
            "0%": { transform: "translateX(0)" },
            "100%": { transform: "translateX(-50%)" },
          },
          "@keyframes marquee-reverse": {
            "0%": { transform: "translateX(-50%)" },
            "100%": { transform: "translateX(0)" },
          },
          "&:hover": { animationPlayState: "paused" },
        }}
      >
        {[...images, ...images].map((img, i) => (
          <Box
            key={i}
            component="img"
            src={img.src}
            alt={img.alt}
            sx={{
              height: "280px",
              width: "auto",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.06)",
              flexShrink: 0,
              display: "block",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default function MarqueeSection() {
  return (
    <Box sx={{ mx: -4, py: 6, display: "flex", flexDirection: "column", gap: 3 }}>
      <MarqueeRow images={allImages} speed={90} />
      <MarqueeRow images={allImages} speed={90} reverse />
    </Box>
  );
}
