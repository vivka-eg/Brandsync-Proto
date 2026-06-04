"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Skeleton,
} from "@mui/material";
import { Scissors, DownloadSimple, ArrowCounterClockwise } from "phosphor-react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

async function cropTransparentPadding(blob) {
  const bitmap = await createImageBitmap(blob);
  const { width, height } = bitmap;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const { data } = ctx.getImageData(0, 0, width, height);

  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX || maxY < minY) return blob;

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  const out = document.createElement("canvas");
  out.width = cropW;
  out.height = cropH;
  out.getContext("2d").drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

  return new Promise((resolve) => out.toBlob(resolve, "image/png"));
}

export default function BackgroundRemover({ photo, imageUrl }) {
  const [state, setState] = useState("loading");
  const [resultDataUrl, setResultDataUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [cutAnimationData, setCutAnimationData] = useState(null);
  const cutAnimLoadedRef = useRef(false);

  useEffect(() => {
    if (cutAnimLoadedRef.current) return;
    cutAnimLoadedRef.current = true;
    fetch("/animations/cut.json")
      .then((r) => r.json())
      .then(setCutAnimationData)
      .catch(() => {});
  }, []);

  const handleRemove = async () => {
    if (!imageUrl) return;
    setState("loading");
    setErrorMsg("");
    setResultDataUrl(null);

    try {
      const { removeBackground } = await import("@imgly/background-removal");

      const externalDomains = [
        "s3.eu-central-1.amazonaws.com",
        "api.brand.dev.egsync.com",
        "api.brand.stage.egsync.com",
        "api.brand.egsync.com",
      ];
      const fetchUrl = externalDomains.some((d) => imageUrl.includes(d))
        ? `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`
        : imageUrl;

      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error(`Could not load image (${res.status})`);
      const blob = await res.blob();

      const resultBlob = await removeBackground(blob);

      const croppedBlob = await cropTransparentPadding(resultBlob);

      const url = URL.createObjectURL(croppedBlob);
      setResultDataUrl(url);
      setState("done");
    } catch (err) {
      setErrorMsg(err.message || "Background removal failed. Please try again.");
      setState("error");
    }
  };

  const handleDownload = () => {
    if (!resultDataUrl) return;
    const link = document.createElement("a");
    link.href = resultDataUrl;
    link.download = `${photo?.title || "image"}-no-bg.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    if (resultDataUrl) URL.revokeObjectURL(resultDataUrl);
    setResultDataUrl(null);
    setErrorMsg("");
    setState("loading");
    handleRemove();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { handleRemove(); }, []);

  return (
    <Box
      sx={{
        mt: 3,
        p: 2.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <Scissors size={18} weight="bold" />
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Remove Background
        </Typography>
      </Box>

      {state === "error" && (
        <>
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {errorMsg}
          </Alert>
          <Button
            variant="contained"
            startIcon={<Scissors size={16} weight="bold" />}
            onClick={handleRemove}
            disableElevation
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, px: 2.5 }}
          >
            Try again
          </Button>
        </>
      )}

      {state === "loading" && (
        <Box>
          <Box sx={{ position: "relative", borderRadius: 2, overflow: "hidden", mb: 1.5 }}>
            <Skeleton variant="rounded" width="100%" height={220} sx={{ borderRadius: 2 }} />
            {cutAnimationData && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Lottie animationData={cutAnimationData} loop segments={[0, 150]} style={{ width: 120, height: 120 }} />
              </Box>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CircularProgress size={14} thickness={5} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Removing background… (may take a few seconds on first use)
            </Typography>
          </Box>
        </Box>
      )}

      {state === "done" && resultDataUrl && (
        <Box>
          <Box
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "divider",
              aspectRatio: "1/1",
              position: "relative",
              backgroundImage:
                "repeating-conic-gradient(#e0e0e0 0% 25%, #f5f5f5 0% 50%)",
              backgroundSize: "20px 20px",
              mb: 2,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resultDataUrl}
              alt={`${photo?.title || "image"} with background removed`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                position: "absolute",
                inset: 0,
              }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<DownloadSimple size={16} weight="bold" />}
              onClick={handleDownload}
              disableElevation
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, px: 2.5 }}
            >
              Download PNG
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowCounterClockwise size={16} weight="bold" />}
              onClick={handleReset}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, px: 2.5 }}
            >
              Try again
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
