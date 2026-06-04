"use client";
import React, { useState } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import NextImage from "next/image";

const MotionBox = motion(Box);

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function RelatedPhotoCard({ photo, onClick }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <MotionBox
      variants={itemVariants}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      sx={{
        cursor: "pointer",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Box
        sx={{
          aspectRatio: "4/3",
          bgcolor: "grey.100",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {!imageLoaded && !imageError && (
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        )}
        {imageError ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              fontSize: 12,
              textAlign: "center",
              p: 1.5,
            }}
          >
            {photo.title}
          </Box>
        ) : (
          <NextImage
            src={photo.thumbnail}
            alt={photo.title}
            fill
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 25vw"
            style={{
              objectFit: "cover",
              opacity: imageLoaded ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          />
        )}
      </Box>
      <Box sx={{ p: 1.5 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: { xs: "0.8rem", md: "0.875rem" },
          }}
        >
          {photo.title}
        </Typography>
      </Box>
    </MotionBox>
  );
}
