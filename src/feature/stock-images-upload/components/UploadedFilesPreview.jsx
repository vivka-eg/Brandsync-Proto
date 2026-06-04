"use client";
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  IconButton,
} from "@mui/material";
import { X } from "@phosphor-icons/react";

export default function UploadedFilesPreview({
  files,
  onRemove,
  maxFiles,
}) {
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (files.length === 0) return null;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Selected Images ({files.length}/{maxFiles})
      </Typography>
      <Grid container spacing={2}>
        {files.map((file, index) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
            <Card
              sx={{
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardMedia
                component="img"
                height="120"
                image={file.preview}
                alt={file.name}
                sx={{ objectFit: "cover" }}
              />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "white",
                  "&:hover": { bgcolor: "error.main" },
                }}
              >
                <X size={16} />
              </IconButton>
              <Box sx={{ p: 1.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: 500,
                  }}
                >
                  {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(file.size)}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
