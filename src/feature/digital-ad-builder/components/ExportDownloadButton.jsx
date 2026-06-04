"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button, ButtonGroup, Menu, MenuItem, Stack, Typography, Box } from "@mui/material";
import { CaretDown, DownloadSimple, CheckCircle } from "phosphor-react";

/**
 * Primary action: Download PNG. Chevron opens menu for PNG or JPEG with format details.
 *
 * When `exportAll` is true the labels reflect "all banners as ZIP" mode.
 */
export default function ExportDownloadButton({
  exporting,
  disabled,
  onExport,
  fullWidth = false,
  size = "medium",
  /** When true, no artboard is selected — export will zip all banners. */
  exportAll = false,
}) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [exported, setExported] = useState(false);
  const exportedTimerRef = useRef(null);
  const menuOpen = Boolean(menuAnchor);

  // Track when export transitions from true → false to trigger success flash
  const prevExportingRef = useRef(exporting);
  useEffect(() => {
    const wasExporting = prevExportingRef.current;
    prevExportingRef.current = exporting;
    if (wasExporting && !exporting) {
      setExported(true);
      clearTimeout(exportedTimerRef.current);
      exportedTimerRef.current = setTimeout(() => setExported(false), 2200);
    }
    return () => clearTimeout(exportedTimerRef.current);
  }, [exporting]);

  const closeMenu = () => setMenuAnchor(null);

  const run = (format) => {
    closeMenu();
    onExport(format);
  };

  const iconSize = size === "large" ? 22 : 20;

  return (
    <>
      <ButtonGroup
        variant="contained"
        fullWidth={fullWidth}
        sx={fullWidth ? { maxWidth: 420 } : undefined}
        aria-label="Download ad image"
      >
        <Button
          size={size}
          startIcon={
            exported ? (
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  color: "inherit",
                  "@keyframes iconSwapIn": {
                    from: { opacity: 0, transform: "scale(0.55) rotate(-20deg)" },
                    to: { opacity: 1, transform: "scale(1) rotate(0deg)" },
                  },
                  animation: "iconSwapIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) both",
                }}
              >
                <CheckCircle size={iconSize} weight="fill" />
              </Box>
            ) : (
              <DownloadSimple size={iconSize} />
            )
          }
          onClick={() => run("png")}
          disabled={disabled}
          sx={{
            ...(fullWidth ? { flex: 1, minWidth: 0 } : undefined),
            ...(exported && !exporting
              ? { bgcolor: "success.main", "&:hover": { bgcolor: "success.dark" } }
              : undefined),
            transition: "background-color 0.25s ease",
          }}
        >
          {exporting
            ? "Exporting…"
            : exported
              ? "Downloaded!"
              : exportAll
                ? "Export All"
                : "Export PNG"}
        </Button>
        <Button
          size={size}
          aria-label="Choose download format"
          aria-controls={menuOpen ? "export-format-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? "true" : undefined}
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          disabled={disabled}
          sx={{ px: fullWidth ? 1 : 1.25, minWidth: 44 }}
        >
          <CaretDown size={size === "large" ? 22 : 20} />
        </Button>
      </ButtonGroup>
      <Menu
        id="export-format-menu"
        anchorEl={menuAnchor}
        open={menuOpen}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: { minWidth: 280 },
          },
        }}
      >
        <MenuItem
          onClick={() => run("png")}
          disabled={exporting}
          sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5 }}
        >
          <Typography variant="body2" fontWeight={600}>
            {exportAll ? "PNG — All banners (ZIP)" : "PNG (Recommended)"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {exportAll
              ? "Every banner as a lossless PNG, packed into a single ZIP"
              : "Lossless compression, best for logos and sharp details"}
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => run("jpeg")}
          disabled={exporting}
          sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.5 }}
        >
          <Typography variant="body2" fontWeight={600}>
            {exportAll ? "JPEG — All banners (ZIP)" : "JPEG"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {exportAll
              ? "Every banner as a JPEG, packed into a single ZIP"
              : "Smaller file size, good for photos and web use"}
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
