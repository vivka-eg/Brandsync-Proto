"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { ArrowsIn, ArrowsOut } from "phosphor-react";
import StockImagePicker from "./StockImagePicker";

/**
 * Stock image grid in a modal; keeps the main builder layout uncluttered.
 */
export default function StockImagePickerDialog({
  open,
  onClose,
  selectedId,
  onSelect,
}) {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    if (!open) setMaximized(false);
  }, [open]);

  const handleDialogClose = () => {
    setMaximized(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth={maximized ? false : "lg"}
      fullScreen={maximized}
      scroll="paper"
      PaperProps={
        maximized
          ? {
              sx: {
                display: "flex",
                flexDirection: "column",
                height: "100%",
                maxHeight: "100%",
                m: 0,
                /* Let the stock grid scroll internally; avoid the whole Paper scrolling without a bar */
                overflow: "hidden",
              },
            }
          : undefined
      }
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          boxSizing: "border-box",
          pl: { xs: 2, sm: 3 },
          py: 2,
          /* Wider on the right so the full-screen control sits off the viewport edge */
          pr: {
            xs: "calc(24px + env(safe-area-inset-right, 0px))",
            sm: "calc(32px + env(safe-area-inset-right, 0px))",
          },
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1, pr: 1 }}>
          <Typography variant="h6" component="span" fontWeight={600}>
            Choose background image
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 400 }}>
            Pick from EG stock images. Images load from the digital assets library.
          </Typography>
        </Box>
        <Button
          type="button"
          variant="text"
          color="inherit"
          onClick={() => setMaximized((v) => !v)}
          aria-pressed={maximized}
          startIcon={
            maximized ? (
              <ArrowsIn size={22} weight="regular" aria-hidden />
            ) : (
              <ArrowsOut size={22} weight="regular" aria-hidden />
            )
          }
          sx={{
            flexShrink: 0,
            alignSelf: "flex-start",
            mt: -0.25,
            px: 1,
            textTransform: "none",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          {maximized ? "Exit full screen" : "Full screen"}
        </Button>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          pt: maximized ? 2 : 1,
          ...(maximized
            ? {
                flex: "1 1 0%",
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                overflow: "hidden",
              }
            : {}),
        }}
      >
        <StockImagePicker
          hideTitle
          expanded={maximized}
          selectionMode="select"
          selectedId={selectedId}
          onSelect={(asset) => {
            onSelect(asset);
            setMaximized(false);
            onClose();
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleDialogClose} color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
