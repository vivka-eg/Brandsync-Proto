"use client";

import React from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import AdBuilderTemplatesPicker from "./AdBuilderTemplatesPicker";

const SMALL_BANNER_IDS = ["320x50", "320x100", "728x90"];

const SECTION_DESCRIPTIONS = {
  frostedPanel:
    "Headline, copy and logo on a panel over your image. Choose Solid or Frosted glass in Properties after you apply a template.",
  photoBand:
    "Photo area and a solid colour band for text. Adjust size and position in Properties after you apply a template.",
};

function SectionLabel({ title, description }) {
  return (
    <Stack spacing={0.25} sx={{ flexShrink: 0, mb: 1 }}>
      <Typography variant="caption" fontWeight={700} color="text.primary">
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.45 }}>
        {description}
      </Typography>
    </Stack>
  );
}

/**
 * Both layout groups (Text card + Photo + band) shown in one scrollable container
 * with a labelled divider between them. Selecting a template automatically switches
 * adLayout via the patch — no separate tab click needed.
 */
export default function AdBuilderLayoutTemplatesSection({
  state,
  setField,
  setFieldsPatch,
  hasBackgroundImage,
  selectedLogo,
  isLeaderboardFormat,
  activeTemplateId,
  onTemplateApplied,
  onAddTemplateToBoard,
}) {
  const isSmallBanner = SMALL_BANNER_IDS.includes(state.selectedSizeId);

  const sharedPickerProps = {
    state,
    setFieldsPatch,
    selectedLogo,
    hasBackgroundImage,
    isLeaderboardFormat,
    hideTitleRow: true,
    appliedTemplateId: activeTemplateId,
    onTemplateApplied,
    onAddTemplateToBoard,
    disableScroll: true,
  };

  return (
    <Box
      sx={(theme) => ({
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        p: 1.5,
        bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "grey.50",
        flex: 1,
        minHeight: 0,
        mt: 1.5,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      })}
    >
      {/* Section heading */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ flexShrink: 0, mb: 1 }}
      >
        <Typography variant="subtitle2" fontWeight={800}>
          Templates
        </Typography>
        {isSmallBanner && (
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.45, textAlign: "right", maxWidth: 200 }}>
            Narrow banners use Photo + band only.
          </Typography>
        )}
      </Stack>

      <Box
        sx={(theme) => ({
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          pr: 0.75,
          mr: -0.5,
          scrollbarWidth: "thin",
          scrollbarColor: `${alpha(theme.palette.text.primary, 0.2)} transparent`,
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: alpha(theme.palette.text.primary, 0.18),
            borderRadius: 999,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: alpha(theme.palette.text.primary, 0.34),
          },
        })}
      >
        {!isSmallBanner && (
          <>
            <SectionLabel title="Text card" description={SECTION_DESCRIPTIONS.frostedPanel} />
            <AdBuilderTemplatesPicker {...sharedPickerProps} adLayoutOverride="frostedPanel" />
            <Divider sx={{ my: 2 }} />
          </>
        )}

        <SectionLabel title="Photo + band" description={SECTION_DESCRIPTIONS.photoBand} />
        <AdBuilderTemplatesPicker {...sharedPickerProps} adLayoutOverride="photoBand" />
      </Box>
    </Box>
  );
}
