"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { UploadSimple, X, Image, CheckCircle } from "phosphor-react";
import { motion, AnimatePresence, color } from "motion/react";
import { getPaletteColor } from "./LogoUploadPage";

function LogoVariantUploader({
  label,
  file,
  onUpload,
  accept = { "image/svg+xml": [] },
  singleUpload = false,
  variant,
  colorPalette,
}) {
  const [isPressed, setIsPressed] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    onUpload(null);
  };

  const getBackgroundColor = () => {
    if (file) return "#F0FDF4";
    if (isPressed) return "#F3F4F6";
    if (isDragActive) return "#E5E7EB";
    return "#FAFAFA";
  };

  const getBorderColor = () => {
    if (file) return "#86EFAC";
    if (isDragActive) return "#9CA3AF";
    return "#E5E7EB";
  };

  const previewBackgroundColor = () => {
    if (variant === "dark") return "#fff";
    if(variant === "light") return getPaletteColor(colorPalette) ;
    return "#1F2937";
  };

  return (
    <Box>
      {label && (
        <Typography
          variant="body2"
          fontWeight={500}
          mb={1}
          color="text.secondary"
        >
          {label}
        </Typography>
      )}

      <Box
        {...getRootProps()}
        sx={{
          p: 3,
          textAlign: "center",
          borderRadius: 2,
          border: `2px dashed ${getBorderColor()}`,
          bgcolor: getBackgroundColor(),
          transition: "all 0.2s ease-in-out",
          cursor: "pointer",
          position: "relative",
          minHeight: 160,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          "&:hover": {
            borderColor: file ? "#86EFAC" : "#9CA3AF",
            bgcolor: file ? "#F0FDF4" : "#F3F4F6",
          },
        }}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="uploaded"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              {/* Preview */}
              <Box
                sx={{
                  width: "100%",
                  height: 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  bgcolor: previewBackgroundColor(),
                  borderRadius: 1,
                  p: 1,
                }}
              >
                <img
                  src={file.url}
                  alt={file.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "#16A34A",
                }}
              >
                <CheckCircle size={18} weight="fill" />
                <Typography variant="body2" fontWeight={500}>
                  {file.name}
                </Typography>
              </Box>

              {/* Remove button */}
              <IconButton
                onClick={handleRemove}
                size="small"
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "#fff",
                  border: "1px solid #E5E7EB",
                  "&:hover": {
                    bgcolor: "#FEE2E2",
                    borderColor: "#FECACA",
                  },
                }}
              >
                <X size={16} />
              </IconButton>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: "#E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                {isDragActive ? (
                  <Image size={24} color="#6B7280" />
                ) : (
                  <UploadSimple size={24} color="#6B7280" />
                )}
              </Box>

              {isDragActive ? (
                <Typography variant="body2" color="text.secondary">
                  Drop the file here
                </Typography>
              ) : (
                <>
                  <Typography variant="body2" fontWeight={500} mb={0.5}>
                    Drop SVG file here
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    or click to browse
                  </Typography>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}

export default LogoVariantUploader;
