"use client";
import { Box, Skeleton } from "@mui/material";
import { useState } from "react";

// Avatar Image Component with Loading State
function AvatarImage({ src, alt, num }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <Skeleton
          variant="circular"
          width="100%"
          height="100%"
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(34, 139, 87, 0.1)",
          }}
          animation="wave"
        />
      )}
      <Box
        component="img"
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
    </>
  );
}

export default AvatarImage;


