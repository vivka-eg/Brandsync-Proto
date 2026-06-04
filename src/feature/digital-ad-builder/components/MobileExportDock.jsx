"use client";

import React from "react";
import { Box } from "@mui/material";
import ExportDownloadButton from "./ExportDownloadButton";

export default function MobileExportDock({ exporting, disabled, onExport }) {
  return (
    <Box
      component="nav"
      aria-label="Export download"
      sx={{
        display: { xs: "flex", sm: "none" },
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar - 1,
        px: 2,
        py: 1.5,
        pb: "max(12px, env(safe-area-inset-bottom))",
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        boxShadow: 3,
        justifyContent: "center",
      }}
    >
      <ExportDownloadButton
        fullWidth
        size="large"
        exporting={exporting}
        disabled={disabled}
        onExport={onExport}
      />
    </Box>
  );
}
