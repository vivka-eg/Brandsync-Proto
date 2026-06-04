"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, IconButton, LinearProgress } from "@mui/material";
import {
  UploadSimple,
  X,
  FileZip,
  CheckCircle,
  FolderOpen,
} from "phosphor-react";
import { motion, AnimatePresence } from "motion/react";

function ZipUploadDropzone({ zipFile, setZipFile }) {
  const [isPressed, setIsPressed] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setZipFile({
          file,
          name: file.name,
          size: file.size,
        });
      }
    },
    [setZipFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/zip": [".zip"],
      "application/x-zip-compressed": [".zip"],
    },
    multiple: false,
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    setZipFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getBackgroundColor = () => {
    if (zipFile) return "#F0FDF4";
    if (isPressed) return "#F3F4F6";
    if (isDragActive) return "#E5E7EB";
    return "#FAFAFA";
  };

  const getBorderColor = () => {
    if (zipFile) return "#86EFAC";
    if (isDragActive) return "#9CA3AF";
    return "#E5E7EB";
  };

  return (
    <Box
      {...getRootProps()}
      sx={{
        p: 4,
        textAlign: "center",
        borderRadius: 2,
        border: `2px dashed ${getBorderColor()}`,
        bgcolor: getBackgroundColor(),
        transition: "all 0.2s ease-in-out",
        cursor: "pointer",
        position: "relative",
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        "&:hover": {
          borderColor: zipFile ? "#86EFAC" : "#9CA3AF",
          bgcolor: zipFile ? "#F0FDF4" : "#F3F4F6",
        },
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      <input {...getInputProps()} />

      <AnimatePresence mode="wait">
        {zipFile ? (
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
              maxWidth: 400,
            }}
          >
            {/* File Icon */}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2,
                bgcolor: "#DCFCE7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <FileZip size={32} color="#16A34A" weight="duotone" />
            </Box>

            {/* File Info */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#16A34A",
                mb: 1,
              }}
            >
              <CheckCircle size={18} weight="fill" />
              <Typography variant="body1" fontWeight={600}>
                {zipFile.name}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary">
              {zipFile.size &&formatFileSize(zipFile.size)}
            </Typography>

            {/* Remove button */}
            <IconButton
              onClick={handleRemove}
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                bgcolor: "#fff",
                border: "1px solid #E5E7EB",
                "&:hover": {
                  bgcolor: "#FEE2E2",
                  borderColor: "#FECACA",
                },
              }}
            >
              <X size={18} />
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
                width: 64,
                height: 64,
                borderRadius: 2,
                bgcolor: "#E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              {isDragActive ? (
                <FolderOpen size={32} color="#6B7280" />
              ) : (
                <FileZip size={32} color="#6B7280" />
              )}
            </Box>

            {isDragActive ? (
              <Typography variant="body1" color="text.secondary">
                Drop the ZIP file here
              </Typography>
            ) : (
              <>
                <Typography variant="body1" fontWeight={500} mb={1}>
                  Drag and drop your logo bundle
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  ZIP file containing all logo assets
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "#6B7280",
                  }}
                >
                  <UploadSimple size={18} />
                  <Typography variant="body2">
                    or click to browse
                  </Typography>
                </Box>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default ZipUploadDropzone;
