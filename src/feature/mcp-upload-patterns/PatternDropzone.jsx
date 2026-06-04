"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useDropzone } from "react-dropzone";
import { UploadSimple, FolderOpen, FileZip, Image, X } from "phosphor-react";
import { useCallback } from "react";

function formatFileSize(bytes) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PatternDropzone({
  accept,
  label,
  file,
  onFile,
  onClear,
  optional = false,
}) {
  const isZip = label && label.toLowerCase().includes("zip");

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const f = acceptedFiles[0];
        const url = URL.createObjectURL(f);
        onFile({ file: f, name: f.name, size: f.size, url });
      }
    },
    [onFile],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept,
    multiple: false,
    noClick: true,
    noKeyboard: false,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed",
        borderColor: isDragActive ? "text.primary" : "divider",
        borderRadius: 2,
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: file && !label?.toLowerCase().includes("zip") ? "auto" : 300,
        position: "relative",
        bgcolor: isDragActive ? "action.hover" : file ? "#F9FAFB" : "#EFF0F8",
        transition: "border-color 0.2s, background-color 0.2s",
        cursor: "default",
      }}
    >
      <input {...getInputProps()} />

      {file ? (
        /* Filled state */
        <>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 1,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              "&:hover": {
                bgcolor: "error.lighter",
                borderColor: "error.light",
              },
            }}
          >
            <X size={16} />
          </IconButton>

          {isZip ? (
            /* ZIP: icon + name */
            <>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  bgcolor: "success.light",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <FileZip size={28} color="white" weight="fill" />
              </Box>
              <Typography variant="body2" fontWeight={700} sx={{ mb: 0.5 }}>
                {file.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(file.size)}
              </Typography>
            </>
          ) : (
            /* Image: actual preview */
            <Box sx={{ width: "100%", textAlign: "center" }}>
              <Box
                component="img"
                src={file.url}
                alt={file.name}
                sx={{
                  maxWidth: "100%",
                  maxHeight: 340,
                  borderRadius: 1,
                  display: "block",
                  mx: "auto",
                  mb: 1.5,
                  objectFit: "contain",
                  boxShadow: 2,
                }}
              />
              <Typography variant="body2" fontWeight={700} sx={{ mb: 0.25 }}>
                {file.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(file.size)}
              </Typography>
            </Box>
          )}
        </>
      ) : isDragActive ? (
        /* Drag active state */
        <>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: "background.default",
              boxShadow: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <FolderOpen size={28} weight="fill" />
          </Box>
          <Typography variant="body2" fontWeight={700}>
            Drop file here
          </Typography>
        </>
      ) : (
        /* Empty state */
        <>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "white",
              boxShadow: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <UploadSimple size={28} weight="bold" />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography variant="body2" fontWeight={700}>
              {label}
            </Typography>
            {optional && (
              <Typography variant="caption" sx={{ color: "text.secondary", bgcolor: "action.hover", px: 0.75, py: 0.25, borderRadius: 1 }}>
                Optional
              </Typography>
            )}
          </Box>

          <Button
            variant="outlined"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
            sx={{ borderRadius: 1 }}
          >
            Browse file
          </Button>
        </>
      )}
    </Box>
  );
}
