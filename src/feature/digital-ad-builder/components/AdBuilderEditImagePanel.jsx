"use client";

import React from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Slider,
  Tooltip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import HelpOutline from "@mui/icons-material/HelpOutline";
import {
  AlignLeft,
  AlignCenterHorizontal,
  AlignRight,
  AlignCenterVertical,
  Trash,
  Image as ImageIcon,
  CornersIn,
} from "phosphor-react";
import { proxyImageUrl } from "../lib/proxyImageUrl";
import SliderValueInput from "./SliderValueInput";

function SliderBlock({
  label,
  valueBox,
  disabled,
  slider,
  minLabel,
  maxLabel,
}) {
  return (
    <Box sx={{ opacity: disabled ? 0.45 : 1 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        {valueBox}
      </Stack>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 0.25 }}>
        <Typography variant="caption" color="text.disabled" sx={{ minWidth: 28, fontVariantNumeric: "tabular-nums" }}>
          {minLabel}
        </Typography>
        <Box sx={{ flex: 1, minWidth: 0 }}>{slider}</Box>
        <Typography variant="caption" color="text.disabled" sx={{ minWidth: 28, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
          {maxLabel}
        </Typography>
      </Stack>
    </Box>
  );
}

export default function AdBuilderEditImagePanel({
  hasBackgroundImage,
  bgImageLoading,
  backgroundImageUrl,
  imageScale,
  imageOffsetX,
  imageOffsetY,
  setField,
  onOpenStockDialog,
  dense = false,
}) {
  const hPct = 50 + (typeof imageOffsetX === "number" ? imageOffsetX : 0);
  const vPct = 50 + (typeof imageOffsetY === "number" ? imageOffsetY : 0);
  const scalePct = Math.round((typeof imageScale === "number" ? imageScale : 1) * 100);

  const disabled = !hasBackgroundImage;

  return (
    <Stack spacing={dense ? 1 : 2} sx={{ mb: dense ? 0.5 : 1 }}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography
          variant="subtitle2"
          fontWeight={700}
          sx={dense ? { fontSize: "0.75rem", lineHeight: 1.2 } : undefined}
        >
          Edit Image
        </Typography>
        <Tooltip
          title="Adjust how the background fills the ad. Use Add an image or Change image to open the stock library."
          placement="top"
          arrow
        >
          <IconButton size="small" aria-label="About image editing" sx={{ p: dense ? 0.15 : 0.25 }}>
            <HelpOutline sx={{ fontSize: dense ? 16 : 18, color: "text.secondary" }} />
          </IconButton>
        </Tooltip>
      </Stack>

      <Box
        sx={{
          width: "100%",
          borderRadius: 1,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          aspectRatio: dense ? "2 / 1" : "16 / 9",
          maxHeight: dense ? 100 : undefined,
          bgcolor: "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {hasBackgroundImage && bgImageLoading && (
          <CircularProgress size={28} thickness={4} />
        )}
        {hasBackgroundImage && !bgImageLoading && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={proxyImageUrl(backgroundImageUrl) ?? ""}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}
        {!hasBackgroundImage && (
          <Typography variant="caption" color="text.secondary" sx={{ px: 2, textAlign: "center" }}>
            No image selected
          </Typography>
        )}
      </Box>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ width: "100%" }}>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          size={dense ? "small" : "medium"}
          startIcon={<ImageIcon size={dense ? 18 : 20} />}
          onClick={onOpenStockDialog}
          aria-label={hasBackgroundImage ? "Change background image" : "Add a background image"}
          sx={{
            flex: 1,
            minWidth: 0,
            py: dense ? 0.5 : 1,
            textTransform: "none",
            fontWeight: 600,
            fontSize: dense ? "0.75rem" : undefined,
          }}
        >
          {hasBackgroundImage ? "Change image" : "Add an image"}
        </Button>
        <Tooltip title="Remove background image">
          <span>
            <IconButton
              size={dense ? "small" : "medium"}
              color="error"
              disabled={!hasBackgroundImage}
              onClick={() => {
                setField("backgroundAssetId", null);
                setField("backgroundImageUrl", null);
              }}
              aria-label="Remove background image"
              sx={{
                flexShrink: 0,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <Trash size={dense ? 20 : 22} />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      <Stack spacing={dense ? 1 : 2}>
        <SliderBlock
          label="Image Size"
          valueBox={
            <SliderValueInput
              displayValue={scalePct}
              unit="%"
              min={50}
              max={200}
              step={5}
              disabled={disabled}
              onCommit={(v) => setField("imageScale", v / 100)}
            />
          }
          disabled={disabled}
          minLabel="50%"
          maxLabel="200%"
          slider={
            <Slider
              size="small"
              value={typeof imageScale === "number" ? imageScale : 1}
              min={0.5}
              max={2}
              step={0.05}
              disabled={disabled}
              onChange={(_, v) => setField("imageScale", v)}
            />
          }
        />
        <SliderBlock
          label="Horizontal Position"
          valueBox={
            <SliderValueInput
              displayValue={Math.round(hPct)}
              unit="%"
              min={0}
              max={100}
              step={1}
              disabled={disabled}
              onCommit={(v) => setField("imageOffsetX", v - 50)}
            />
          }
          disabled={disabled}
          minLabel="0%"
          maxLabel="100%"
          slider={
            <Slider
              size="small"
              value={typeof imageOffsetX === "number" ? imageOffsetX : 0}
              min={-50}
              max={50}
              step={1}
              disabled={disabled}
              onChange={(_, v) => setField("imageOffsetX", v)}
            />
          }
        />
        <SliderBlock
          label="Vertical Position"
          valueBox={
            <SliderValueInput
              displayValue={Math.round(vPct)}
              unit="%"
              min={0}
              max={100}
              step={1}
              disabled={disabled}
              onCommit={(v) => setField("imageOffsetY", v - 50)}
            />
          }
          disabled={disabled}
          minLabel="0%"
          maxLabel="100%"
          slider={
            <Slider
              size="small"
              value={typeof imageOffsetY === "number" ? imageOffsetY : 0}
              min={-50}
              max={50}
              step={1}
              disabled={disabled}
              onChange={(_, v) => setField("imageOffsetY", v)}
            />
          }
        />
      </Stack>

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        gap={0.5}
        sx={{ pt: 1, borderTop: "1px solid", borderColor: "divider" }}
      >
        <Tooltip title="Align image to the left">
          <span>
            <IconButton
              size="small"
              disabled={disabled}
              onClick={() => setField("imageOffsetX", -50)}
              aria-label="Align background to left"
            >
              <AlignLeft size={22} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Center horizontally">
          <span>
            <IconButton
              size="small"
              disabled={disabled}
              onClick={() => setField("imageOffsetX", 0)}
              aria-label="Center background horizontally"
            >
              <AlignCenterHorizontal size={22} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Align image to the right">
          <span>
            <IconButton
              size="small"
              disabled={disabled}
              onClick={() => setField("imageOffsetX", 50)}
              aria-label="Align background to right"
            >
              <AlignRight size={22} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Center vertically">
          <span>
            <IconButton
              size="small"
              disabled={disabled}
              onClick={() => setField("imageOffsetY", 0)}
              aria-label="Center background vertically"
            >
              <AlignCenterVertical size={22} />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Fit to artboard">
          <span>
            <IconButton
              size="small"
              disabled={disabled}
              onClick={() => {
                setField("imageScale", 1);
                setField("imageOffsetX", 0);
                setField("imageOffsetY", 0);
              }}
              aria-label="Fit to artboard"
            >
              <CornersIn size={22} />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
