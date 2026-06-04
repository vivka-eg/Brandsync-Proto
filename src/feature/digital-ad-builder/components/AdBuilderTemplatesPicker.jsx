"use client";

import React, { useMemo, useState } from "react";
import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { AD_SIZE_PRESET_MAP } from "../adSizePresets";
import AdArtboard from "../AdArtboard";
import { resolveLogoUrl } from "../lib/logoUrls";
import { proxyImageUrl } from "../lib/proxyImageUrl";
import { getMidShadeKeyForPalette, getShadeHex } from "../brandPalettes";
import { presetOrientation } from "./AdBuilderRightPanelProperties";
import { getAdTemplatesFor } from "../adTemplates";
import { prepareTemplatePatch } from "../templateApplyUtils";

function computeLogoUrl({ selectedLogo, logoTone, logoOrientation }) {
  const raw = selectedLogo ? resolveLogoUrl(selectedLogo, logoTone, logoOrientation) : null;
  return proxyImageUrl(raw);
}

function buildArtboardPropsForPreview({ state, templatePatch, logoUrl }) {
  const merged = { ...state, ...templatePatch };

  const bgHex = getShadeHex(merged.bgPalette, merged.bgShade);
  const frostHex = getShadeHex(merged.frostPalette, merged.frostShade);
  const primaryHex = getShadeHex(merged.bgPalette, getMidShadeKeyForPalette(merged.bgPalette));

  return {
    width: merged._previewWidth,
    height: merged._previewHeight,
    headline: merged.headline,
    headlineRich: typeof merged.headlineRich === "string" ? merged.headlineRich : null,
    subtext: merged.subtext,
    subtextRich: typeof merged.subtextRich === "string" ? merged.subtextRich : null,
    cta: merged.cta,
    bgHex,
    primaryHex,
    frostHex,
    frostPanelEnabled: merged.frostPanelEnabled,
    frostOpacity: merged.frostOpacity,
    imageScale: merged.imageScale,
    imageOffsetX: merged.imageOffsetX,
    imageOffsetY: merged.imageOffsetY,
    backgroundImageUrl: merged._previewBackgroundImageUrl,
    logoUrl,
    adLayout: merged.adLayout,
    photoBandHeightRatio: merged.photoBandHeightRatio,
    photoBandPosition: merged.photoBandPosition,
    photoBandCtaPlacement: merged.photoBandCtaPlacement,
    photoBandCtaOnPhotoVertical: ["top", "center", "bottom"].includes(merged.photoBandCtaOnPhotoVertical)
      ? merged.photoBandCtaOnPhotoVertical
      : "bottom",
    headlineFontScale: merged.headlineFontScale,
    subtextFontScale: merged.subtextFontScale,
    headlineLineHeight: merged.headlineLineHeight,
    subtextLineHeight: merged.subtextLineHeight,
    headlineSpacing: typeof merged.headlineSpacing === "number" ? merged.headlineSpacing : 1,
    ctaRadius: typeof merged.ctaRadius === "number" ? merged.ctaRadius : 0,
    headlineAlign: merged.headlineAlign,
    subtextAlign: merged.subtextAlign,
    ctaShowIcon: Boolean(merged.ctaShowIcon),
    frostPanelScale: merged.frostPanelScale,
    frostPanelOffsetX: merged.frostPanelOffsetX,
    frostPanelOffsetY: merged.frostPanelOffsetY,
    logoScale: merged.logoScale,
    logoAlign: merged.logoAlign,
    logoPlacement: merged.logoPlacement,
    ctaAlign: merged.ctaAlign,
    ctaFontScale: typeof merged.ctaFontScale === "number" ? merged.ctaFontScale : 1,
    ctaPaddingScale: typeof merged.ctaPaddingScale === "number" ? merged.ctaPaddingScale : 1,
    ctaOffsetX: typeof merged.ctaOffsetX === "number" ? merged.ctaOffsetX : 0,
    ctaOffsetY: typeof merged.ctaOffsetY === "number" ? merged.ctaOffsetY : 0,
    logoLoading: false,
    // Preview only (no interactions).
    onHeadlineChange: undefined,
    onSubtextChange: undefined,
    onImageOffsetChange: undefined,
    previewInteractionScale: 1,
  };
}

function TemplateCard({ template, selectedLogo, state, hasBackgroundImage, onUse, onAddToBoard, isInUse, onSelect }) {
  const currentPreset = AD_SIZE_PRESET_MAP[state.selectedSizeId] ?? AD_SIZE_PRESET_MAP["300x250"];
  const targetW = 170;
  const targetH = 120;
  const scale = Math.min(targetW / currentPreset.width, targetH / currentPreset.height);

  const logoUrl = useMemo(
    () =>
      computeLogoUrl({
        selectedLogo,
        logoTone: state.logoTone,
        logoOrientation: state.logoOrientation,
      }),
    [selectedLogo, state.logoTone, state.logoOrientation],
  );

  const previewBackgroundImageUrl = state.backgroundImageUrl
    ? proxyImageUrl(state.backgroundImageUrl)
    : null;

  const previewPatch = useMemo(() => {
    // If there's no background image yet, don't pre-tune image scale/offset.
    if (hasBackgroundImage) return template.patch;
    const p = { ...template.patch };
    delete p.imageScale;
    delete p.imageOffsetX;
    delete p.imageOffsetY;
    return p;
  }, [template.patch, hasBackgroundImage]);

  const artboardProps = useMemo(() => {
    const merged = {
      ...state,
      ...previewPatch,
      _previewWidth: currentPreset.width,
      _previewHeight: currentPreset.height,
      _previewBackgroundImageUrl: previewBackgroundImageUrl,
    };

    // Clamp missing values defensively (some templates intentionally omit keys).
    if (typeof merged.adLayout !== "string") merged.adLayout = state.adLayout ?? "frostedPanel";

    return buildArtboardPropsForPreview({ state: merged, templatePatch: {}, logoUrl });
  }, [currentPreset.width, currentPreset.height, logoUrl, previewBackgroundImageUrl, previewPatch, state]);

  const [burstNonce, setBurstNonce] = useState(0);

  return (
    <Box
      sx={(theme) => ({
        border: isInUse ? "2px solid" : "1px solid",
        borderColor: isInUse ? "primary.main" : "divider",
        borderRadius: 1,
        overflow: "visible",
        bgcolor: "background.paper",
        boxShadow: isInUse ? `0 0 0 1px ${alpha(theme.palette.primary.main, 0.25)}` : "none",
        position: "relative",
      })}
    >
      {burstNonce > 0 && (
        <Box
          key={burstNonce}
          aria-hidden
          sx={(theme) => ({
            position: "absolute",
            inset: -2,
            borderRadius: 1,
            pointerEvents: "none",
            zIndex: 2,
            "@keyframes templateBurst": {
              "0%": { boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0.5)}` },
              "70%": { boxShadow: `0 0 0 9px ${alpha(theme.palette.primary.main, 0)}` },
              "100%": { boxShadow: `0 0 0 0 ${alpha(theme.palette.primary.main, 0)}` },
            },
            animation: "templateBurst 0.45s ease-out both",
          })}
        />
      )}
      <Stack direction="row" spacing={2} sx={{ p: 1.25, alignItems: "center" }}>
        <Box
          sx={{
            width: targetW,
            height: targetH,
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
            bgcolor: "action.hover",
          }}
        >
          <Box
            sx={{
              width: currentPreset.width,
              height: currentPreset.height,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <AdArtboard {...artboardProps} />
          </Box>
        </Box>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack spacing={0.75}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1} sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                {template.title}
              </Typography>
              {isInUse ? (
                <Chip label="In use" size="small" color="primary" sx={{ height: 22, fontSize: "0.65rem", fontWeight: 700 }} />
              ) : null}
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.35 }}>
              {template.description}
            </Typography>
          </Stack>

          <Divider sx={{ my: 1 }} />

          <Stack spacing={0.75}>
            {isInUse ? (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                fullWidth
                onClick={() => { setBurstNonce((n) => n + 1); onUse(previewPatch, template.id); }}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                Reset artboard
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="small"
                fullWidth
                onClick={() => { setBurstNonce((n) => n + 1); onAddToBoard(previewPatch, template.id); }}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                Add to board
              </Button>
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

export default function AdBuilderTemplatesPicker({
  state,
  setFieldsPatch,
  selectedLogo,
  hasBackgroundImage,
  isLeaderboardFormat,
  /** When true, hides the "Templates" title row (e.g. parent uses sub-tabs). */
  hideTitleRow = false,
  /** Currently applied template id (highlights that card when browsing the list). */
  appliedTemplateId = null,
  /** Called after a template patch is applied (single undo step). Receives template id. */
  onTemplateApplied,
  /** Adds a new artboard size and applies the template (single undo step). */
  onAddTemplateToBoard,
  /** Override which adLayout is used for filtering and patch prep, regardless of state.adLayout. */
  adLayoutOverride = null,
  /** When true, the template list expands to its full height instead of scrolling internally. */
  disableScroll = false,
}) {
  const orientation = presetOrientation(state.selectedSizeId);
  const currentAdLayout = adLayoutOverride ?? state.adLayout ?? "frostedPanel";
  const photoBandMode = isLeaderboardFormat ? "leaderboard" : "tall";

  const templates = useMemo(() => {
    return getAdTemplatesFor({
      orientation,
      adLayout: currentAdLayout,
      photoBandMode,
      isLeaderboardFormat,
    });
  }, [currentAdLayout, orientation, photoBandMode]);

  const handleUse = (patch, templateId) => {
    const patchToApply = prepareTemplatePatch(patch, currentAdLayout);
    setFieldsPatch(patchToApply);
    onTemplateApplied?.(templateId);
  };

  const handleAddToBoard = (patch, templateId) => {
    onAddTemplateToBoard?.(patch, templateId);
  };

  if (!templates.length) {
    return (
      <Box sx={{ border: "1px dashed", borderColor: "divider", borderRadius: 1, p: 1.5 }}>
        <Typography variant="caption" color="text.secondary">
          No templates found for this layout yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: disableScroll ? undefined : 1,
        minHeight: 0,
        overflow: disableScroll ? "visible" : "hidden",
      }}
    >
      {!hideTitleRow ? (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          sx={{ flexShrink: 0, pb: 1.25 }}
        >
          <Typography variant="subtitle2" fontWeight={800}>
            Templates
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Add to board adds a new size
          </Typography>
        </Stack>
      ) : null}

      <Box
        sx={(theme) => ({
          flex: disableScroll ? undefined : 1,
          minHeight: 0,
          overflowY: disableScroll ? "visible" : "auto",
          overflowX: disableScroll ? "visible" : "hidden",
          pr: disableScroll ? 0 : 0.5,
          mr: disableScroll ? 0 : -0.25,
          scrollbarWidth: "thin",
          scrollbarColor: `${alpha(theme.palette.text.primary, 0.28)} ${alpha(theme.palette.action.hover, 0.5)}`,
          "&::-webkit-scrollbar": {
            width: 6,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: alpha(theme.palette.divider, 0.35),
            borderRadius: 999,
            marginBlock: 2,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: alpha(theme.palette.text.primary, 0.22),
            borderRadius: 999,
            border: "2px solid transparent",
            backgroundClip: "padding-box",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: alpha(theme.palette.text.primary, 0.38),
          },
        })}
      >
        <Stack spacing={1}>
          {templates.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              selectedLogo={selectedLogo}
              state={state}
              hasBackgroundImage={hasBackgroundImage}
              onUse={handleUse}
              onAddToBoard={handleAddToBoard}
              isInUse={Boolean(appliedTemplateId && appliedTemplateId === t.id)}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
