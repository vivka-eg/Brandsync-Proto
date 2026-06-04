"use client";

import React from "react";
import { Box } from "@mui/material";
import AdArtboard from "../AdArtboard";
import { AD_SIZE_PRESET_MAP } from "../adSizePresets";

/**
 * Renders every artboard off-screen so html-to-image can capture them at full
 * resolution.  One <AdArtboard> per entry in `artboards`, keyed by artboard id.
 * Interactive handlers and inline-role styling are stripped so they never
 * pollute the exported image.
 */
export default function OffscreenExportArtboard({ artboards, artboardPropsById, setExportRef }) {
  if (!artboards?.length) return null;

  return (
    <Box
      aria-hidden
      sx={{
        position: "fixed",
        left: -20000,
        top: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      {artboards.map((ab) => {
        const preset = AD_SIZE_PRESET_MAP[ab.selectedSizeId];
        const props = artboardPropsById?.[ab.id];
        if (!preset || !props) return null;
        return (
          <AdArtboard
            key={ab.id}
            ref={setExportRef(ab.id)}
            width={preset.width}
            height={preset.height}
            {...props}
            // Strip interactive props — irrelevant for capture and avoids
            // inline-focus box-shadows appearing in the exported image.
            logoLoading={false}
            activeInlineRole={null}
            isExporting={true}
            onImageOffsetChange={undefined}
            onPhotoBandHeightRatioChange={undefined}
            onInlineTextEditingChange={undefined}
            onHeadlineChange={undefined}
            onSubtextChange={undefined}
          />
        );
      })}
    </Box>
  );
}
