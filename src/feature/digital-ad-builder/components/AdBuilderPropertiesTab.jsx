"use client";

import React from "react";
import { Box, Stack, Alert } from "@mui/material";
import AdBuilderMiniPanel from "./AdBuilderMiniPanel";
import AdBuilderLogosTab from "./AdBuilderLogosTab";
import AdBuilderEditImagePanel from "./AdBuilderEditImagePanel";
import AdBuilderContentTab from "./AdBuilderContentTab";
import AdBuilderCtaTab from "./AdBuilderCtaTab";
import AdBuilderShapesTab from "./AdBuilderShapesTab";
import {
  AD_BUILDER_PANEL_LOGO,
  AD_BUILDER_PANEL_IMAGE,
  AD_BUILDER_PANEL_CONTENT,
  AD_BUILDER_PANEL_CTA,
  AD_BUILDER_PANEL_SHAPES,
} from "../adBuilderPanelIds";

/**
 * Logo, Image, Content, CTA, shapes  -  after a template is applied from Layout.
 */
export default function AdBuilderPropertiesTab({
  state,
  setField,
  setFieldsPatch,
  /** When false, user must select a banner in the preview before editing these controls. */
  hasActiveArtboard = true,
  hasBackgroundImage,
  selectedLogo,
  isLeaderboardFormat,
  templateControlsUnlocked,
  logos,
  selectLogo,
  isLoading,
  isDetailLoading,
  fetchError,
  onResetToDefaults,
  bgImageLoading,
  onOpenStockDialog,
  lockedPaletteName,
  lockedPaletteLabel,
  lockedSwatchHex,
  openPanelId,
  onTogglePanel,
}) {
  const layoutTabValue = state.adLayout === "photoBand" ? "photoBand" : "frostedPanel";
  const shapesSummary =
    layoutTabValue === "photoBand" ? "Photo band" : "Text card";

  if (!templateControlsUnlocked) {
    return (
      <Alert severity="info" variant="outlined" sx={{ borderRadius: 1, py: 1 }}>
        Choose a canvas size and apply a <strong>template</strong> from the <strong>Layout</strong> tab to unlock Logo,
        Image, Content, and shape controls here.
      </Alert>
    );
  }

  if (!hasActiveArtboard) {
    return (
      <Alert severity="info" variant="outlined" sx={{ borderRadius: 1, py: 1 }}>
        Select a banner in the preview to edit logo, image, copy, and CTA for that slot.
      </Alert>
    );
  }

  return (
    <Stack
      spacing={1}
      sx={{
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        component="section"
        aria-label="Template customization sections"
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflow: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          pr: 0.25,
          scrollbarGutter: "stable",
          scrollbarWidth: "thin",
          scrollbarColor: `${theme.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"} transparent`,
        })}
      >
        <AdBuilderMiniPanel
          id={AD_BUILDER_PANEL_LOGO}
          title="Logo"
          expanded={openPanelId === AD_BUILDER_PANEL_LOGO}
          onToggle={() => onTogglePanel(AD_BUILDER_PANEL_LOGO)}
        >
          <AdBuilderLogosTab
            dense
            logos={logos}
            selectedLogo={selectedLogo}
            selectLogo={selectLogo}
            setField={setField}
            setFieldsPatch={setFieldsPatch}
            isLoading={isLoading || isDetailLoading}
            fetchError={fetchError}
            logoScale={state.logoScale}
            logoAlign={state.logoAlign}
            logoPlacement={state.logoPlacement}
            logoTone={state.logoTone}
            logoOrientation={state.logoOrientation}
            bgPalette={state.bgPalette}
            bgShade={state.bgShade}
            lockedPaletteName={lockedPaletteName}
            lockedPaletteLabel={lockedPaletteLabel}
            lockedSwatchHex={lockedSwatchHex}
          />
        </AdBuilderMiniPanel>

        <AdBuilderMiniPanel
          id={AD_BUILDER_PANEL_IMAGE}
          title="Image"
          expanded={openPanelId === AD_BUILDER_PANEL_IMAGE}
          onToggle={() => onTogglePanel(AD_BUILDER_PANEL_IMAGE)}
        >
          <AdBuilderEditImagePanel
            dense
            hasBackgroundImage={hasBackgroundImage}
            bgImageLoading={bgImageLoading}
            backgroundImageUrl={state.backgroundImageUrl}
            imageScale={state.imageScale}
            imageOffsetX={state.imageOffsetX}
            imageOffsetY={state.imageOffsetY}
            setField={setField}
            onOpenStockDialog={onOpenStockDialog}
          />
        </AdBuilderMiniPanel>

        <AdBuilderMiniPanel
          id={AD_BUILDER_PANEL_CONTENT}
          title="Content"
          expanded={openPanelId === AD_BUILDER_PANEL_CONTENT}
          onToggle={() => onTogglePanel(AD_BUILDER_PANEL_CONTENT)}
        >
          <AdBuilderContentTab dense state={state} setField={setField} onResetToDefaults={onResetToDefaults} />
        </AdBuilderMiniPanel>

        <AdBuilderMiniPanel
          id={AD_BUILDER_PANEL_CTA}
          title="Call to action"
          expanded={openPanelId === AD_BUILDER_PANEL_CTA}
          onToggle={() => onTogglePanel(AD_BUILDER_PANEL_CTA)}
        >
          <AdBuilderCtaTab dense hideSectionHeading state={state} setField={setField} selectedLogo={selectedLogo} />
        </AdBuilderMiniPanel>

        <AdBuilderMiniPanel
          id={AD_BUILDER_PANEL_SHAPES}
          title={shapesSummary}
          expanded={openPanelId === AD_BUILDER_PANEL_SHAPES}
          onToggle={() => onTogglePanel(AD_BUILDER_PANEL_SHAPES)}
        >
          <AdBuilderShapesTab
            dense
            hasBackgroundImage={hasBackgroundImage}
            state={state}
            setField={setField}
            isLeaderboardFormat={isLeaderboardFormat}
          />
        </AdBuilderMiniPanel>
      </Box>
    </Stack>
  );
}
