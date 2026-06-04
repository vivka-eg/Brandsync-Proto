"use client";

import Box from "@mui/material/Box";

export default function McpVideoPlayer({ src, poster }) {
  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
        border: "5px solid",
        borderColor: "divider",
        bgcolor: "#f7f7f5",
      }}
    >
      <video
        src={src}
        poster={poster}
        controls
        playsInline
        // muted
        style={{ width: "100%", display: "block", height: "auto" }}
      >
        Your browser does not support the video tag.
      </video>
    </Box>
  );
}
