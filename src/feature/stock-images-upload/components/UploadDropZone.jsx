"use client";
import React from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import { CloudArrowUp } from "@phosphor-icons/react";

export default function UploadDropZone({
  isDragging,
  onDrop,
  onDragOver,
  onDragLeave,
  onClick,
  fileInputRef,
  onFileSelect,
  uploadedCount,
  maxFiles,
  uploadLimitError,
  onClearError,
}) {
  const hasReachedLimit = uploadedCount >= maxFiles;

  return (
    <Box>
      {uploadLimitError && (
        <Alert severity="warning" sx={{ mb: 2 }} onClose={onClearError}>
          {uploadLimitError}
        </Alert>
      )}

      <Box
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={hasReachedLimit ? null : onClick}
        sx={{
          border: "2px dashed",
          borderColor: isDragging ? "primary.main" : "divider",
          borderRadius: 3,
          p: { xs: 4, md: 8 },
          textAlign: "center",
          cursor: hasReachedLimit ? "not-allowed" : "pointer",
          bgcolor: isDragging ? "primary.50" : "background.paper",
          opacity: hasReachedLimit ? 0.6 : 1,
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: hasReachedLimit ? "divider" : "primary.main",
            bgcolor: hasReachedLimit ? "background.paper" : "primary.50",
          },
        }}
      >
        <CloudArrowUp
          size={80}
          weight="duotone"
          color={isDragging ? "#1976d2" : "#9e9e9e"}
        />
        <Typography variant="h5" sx={{ mt: 3, fontWeight: 600 }}>
          Drag and drop images here
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          or click to browse from your computer
        </Typography>
        <Typography variant="body2" color="text.disabled" sx={{ mt: 2 }}>
          Supports JPG, PNG, WebP (Max 30MB per file, {maxFiles} images per upload)
        </Typography>
        <Button
          variant="contained"
          disabled={hasReachedLimit}
          sx={{ mt: 3, textTransform: "none", fontWeight: 600 }}
          onClick={(e) => {
            e.stopPropagation();
            if (!hasReachedLimit) {
              fileInputRef.current?.click();
            }
          }}
        >
          {hasReachedLimit ? "Maximum Images Reached" : "Select Images"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onFileSelect}
          style={{ display: "none" }}
        />
      </Box>
    </Box>
  );
}
