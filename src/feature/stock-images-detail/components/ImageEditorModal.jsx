"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  X,
  DownloadSimple,
  ArrowCounterClockwise,
  Crop,
  ArrowLeft,
} from "@phosphor-icons/react";
import { Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";

const aspectRatios = [
  { label: "Free", value: "free" },
  { label: "Square", value: 1 },
  { label: "Portrait", value: 3 / 4 },
  { label: "Landscape", value: 16 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:2", value: 3 / 2 },
];

const getProxiedImageUrl = (url) => {
  if (!url) return null;
  if (url.includes("s3.eu-central-1.amazonaws.com")) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  return url;
};

export default function ImageEditorModal({ open, onClose, photo }) {
  const cropperRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("free");
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const proxiedImageUrl = photo ? getProxiedImageUrl(photo.fullImage) : null;

  useEffect(() => {
    if (open && proxiedImageUrl) {
      setImageLoading(true);
    }
  }, [open, proxiedImageUrl]);

  const handleAspectRatioChange = (event, newValue) => {
    if (newValue !== null) {
      setAspectRatio(newValue);
    }
  };

  const handleReset = () => {
    setAspectRatio("free");
    if (cropperRef.current) {
      cropperRef.current.reset();
    }
  };

  const handleClose = () => {
    setIsEditMode(false);
    setAspectRatio("free");
    onClose();
  };

  const handleBackToView = () => {
    setIsEditMode(false);
    setAspectRatio("free");
    setImageLoading(true);
  };


const handleDownloadOriginal = async () => {
    if (!photo) return;

    const downloadUrl = photo.fullImage || photo.fullSize;

    if (!downloadUrl) {
      alert("No image available for download.");
      return;
    }

    let extension = "jpg";
    const urlMatch = downloadUrl.match(/\.(jpg|jpeg|png|webp|tiff?|JPG|JPEG|PNG|WEBP|TIFF?)(\?|$)/i);
    if (urlMatch) {
      extension = urlMatch[1].toLowerCase();
    }

    const fileName = `${photo.title || "image"}-Original.${extension}`;

    try {
      const proxiedUrl = getProxiedImageUrl(downloadUrl);

      const response = await fetch(proxiedUrl, {
        method: "GET",
        cache: "default",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const arrayBuffer = await response.arrayBuffer();
      const contentType = response.headers.get("content-type") || `image/${extension}`;
      const blob = new Blob([arrayBuffer], { type: contentType });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to download image. Please try again.");
    }
  };


  const handleDownloadCropped = async () => {
    if (!cropperRef.current) return;

    setIsProcessing(true);

    try {
      const canvas = cropperRef.current.getCanvas();
      if (canvas) {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = `${photo?.title || "image"}-edited.jpg`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }
            setIsProcessing(false);
          },
          "image/jpeg",
          0.95
        );
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error downloading image:", error);
      setIsProcessing(false);
    }
  };

  if (!photo) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "95vw",
          maxWidth: 1200,
          height: "95vh",
          maxHeight: 900,
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          outline: "none",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isEditMode && (
              <IconButton onClick={handleBackToView} size="small">
                <ArrowLeft size={24} />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {isEditMode ? `Edit: ${photo.title}` : photo.title}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <X size={24} />
          </IconButton>
        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 400,
            bgcolor: "#1a1a1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
            flexShrink: 0,
            "& .advanced-cropper": {
              maxHeight: "60vh",
            },
          }}
        >
          {imageLoading && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                bgcolor: "#1a1a1a",
                zIndex: 10,
              }}
            >
              <CircularProgress size={48} sx={{ color: "primary.light" }} />
              <Typography variant="body2" sx={{ color: "grey.400" }}>
                Loading high-res image, please wait...
              </Typography>
            </Box>
          )}
          {isEditMode ? (
            <Cropper
              ref={cropperRef}
              src={proxiedImageUrl}
              stencilProps={{
                aspectRatio: aspectRatio === "free" ? undefined : aspectRatio,
              }}
              className="advanced-cropper"
              style={{
                height: "100%",
                width: "100%",
                opacity: imageLoading ? 0 : 1,
              }}
              onReady={() => setImageLoading(false)}
            />
          ) : (
            <Box
              component="img"
              src={proxiedImageUrl}
              alt={photo.title}
              onLoad={() => setImageLoading(false)}
              sx={{
                maxWidth: "100%",
                maxHeight: "60vh",
                objectFit: "contain",
                opacity: imageLoading ? 0 : 1,
                transition: "opacity 0.2s ease-in-out",
              }}
            />
          )}
        </Box>

        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            flexShrink: 0,
            minHeight: "fit-content",
          }}
        >
          {isEditMode ? (
            <>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, mb: 1, color: "text.secondary" }}
                >
                  Aspect Ratio
                </Typography>
                <ToggleButtonGroup
                  value={aspectRatio}
                  exclusive
                  onChange={handleAspectRatioChange}
                  size="small"
                  sx={{
                    flexWrap: "wrap",
                    "& .MuiToggleButton-root": {
                      px: 2,
                      py: 0.75,
                      textTransform: "none",
                      fontWeight: 500,
                      borderRadius: "8px !important",
                      border: "1px solid",
                      borderColor: "divider",
                      mr: 1,
                      mb: 1,
                      "&.Mui-selected": {
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        "&:hover": {
                          bgcolor: "primary.dark",
                        },
                      },
                    },
                  }}
                >
                  {aspectRatios.map((ratio) => (
                    <ToggleButton key={ratio.label} value={ratio.value}>
                      {ratio.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Button
                  variant="outlined"
                  startIcon={<ArrowCounterClockwise size={20} />}
                  onClick={handleReset}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                >
                  Reset
                </Button>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={handleBackToView}
                    sx={{
                      textTransform: "none",
                      fontWeight: 500,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<DownloadSimple size={20} weight="bold" />}
                    onClick={handleDownloadCropped}
                    disabled={isProcessing}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    {isProcessing ? "Processing..." : "Download Cropped"}
                  </Button>
                </Stack>
              </Stack>
            </>
          ) : (
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<Crop size={20} weight="bold" />}
                onClick={() => {
                  setImageLoading(true);
                  setIsEditMode(true);
                }}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Edit & Crop
              </Button>
              <Button
                variant="contained"
                startIcon={<DownloadSimple size={20} weight="bold" />}
                onClick={handleDownloadOriginal}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Download Original
              </Button>
            </Stack>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
