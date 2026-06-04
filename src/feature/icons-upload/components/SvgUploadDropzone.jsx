"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Button, Stack, useTheme } from "@mui/material";
import { UploadSimple as UploadIcon, FileX } from "phosphor-react";

export default function SvgUploadDropzone({ setIcons }) {
  const [isPressed, setIsPressed] = useState(false);
  const theme = useTheme();

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      setIcons((prevIcons) => [
        ...prevIcons,
        {
          id: Math.random().toString(36).substr(2, 9),
          file: file,
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          tags: [],
          categories: [],
          iconType: "",
          error: {
            categories: false,
            tags: false,
            iconType: false,
          },
        },
      ]);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/svg+xml": [],
      },
      multiple: true,
    });

  const getBorderColor = () => {
    if (isDragReject) return theme.palette.error.main;
    if (isDragActive) return theme.palette.action.active;
    return theme.palette.divider;
  };

  const getBackgroundColor = () => {
    if (isDragReject) return theme.palette.error.light + "18";
    if (isDragActive || isPressed) return theme.palette.action.hover;
    return theme.palette.background.default;
  };

  return (
    <Box
      {...getRootProps()}
      sx={{
        py: 8,
        px: 4,
        textAlign: "center",
        borderRadius: "16px",
        border: "2px dashed",
        borderColor: getBorderColor(),
        bgcolor: getBackgroundColor(),
        transition: "all 0.2s ease-in-out",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        "&:focus-visible": {
          outline: `2px solid ${theme.palette.action.active}`,
          outlineOffset: "2px",
        },
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      <input {...getInputProps()} />

      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "12px",
          bgcolor: isDragReject
            ? "error.light"
            : isDragActive
            ? "action.selected"
            : "neutral.light",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1,
          transition: "background-color 0.2s",
        }}
      >
        {isDragReject ? (
          <FileX size={28} color={theme.palette.error.main} />
        ) : (
          <UploadIcon
            size={28}
            color={
              isDragActive
                ? theme.palette.action.active
                : theme.palette.text.secondary
            }
          />
        )}
      </Box>

      {isDragReject ? (
        <Typography fontWeight={600} color="error.main">
          Only SVG files are accepted
        </Typography>
      ) : isDragActive ? (
        <Typography fontWeight={600} color="action.active">
          Drop your SVG files here
        </Typography>
      ) : (
        <>
          <Typography fontWeight={600}>Drag & drop SVG files here</Typography>
          <Typography variant="body2" color="text.secondary">
            or
          </Typography>
          <Button
            variant="outlined"
            disableElevation
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              borderColor: "divider",
              color: "text.primary",
              fontWeight: 500,
              px: 3,
              "&:hover": { borderColor: "text.primary", bgcolor: "transparent" },
            }}
          >
            Browse files
          </Button>
        </>
      )}

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.disabled">
          Accepted format: SVG only · Multiple files supported
        </Typography>
      </Stack>
    </Box>
  );
}
