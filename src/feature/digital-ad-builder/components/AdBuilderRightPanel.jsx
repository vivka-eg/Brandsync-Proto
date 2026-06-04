"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Box, Stack, Alert, Tabs, Tab } from "@mui/material";
import { AD_BUILDER_PANEL_LOGO } from "../adBuilderPanelIds";
import AdBuilderRightPanelProperties from "./AdBuilderRightPanelProperties";
import AdBuilderLayoutTemplatesSection from "./AdBuilderLayoutTemplatesSection";
import AdBuilderPropertiesTab from "./AdBuilderPropertiesTab";

function TabPanel({ children, value, index, overflow = "auto", tabSwitchKey }) {
  const active = value === index;
  return (
    <Box
      role="tabpanel"
      hidden={!active}
      id={`ad-builder-right-tabpanel-${index}`}
      aria-labelledby={`ad-builder-right-tab-${index}`}
      sx={{
        flex: 1,
        minHeight: 0,
        display: active ? "flex" : "none",
        flexDirection: "column",
        overflow,
        pt: 2,
      }}
    >
      {active ? (
        <Box
          key={tabSwitchKey}
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow,
            "@keyframes tabPanelFadeIn": {
              from: { opacity: 0, transform: "translateY(4px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
            animation: "tabPanelFadeIn 0.18s ease-out both",
          }}
        >
          {children}
        </Box>
      ) : null}
    </Box>
  );
}

export default function AdBuilderRightPanel({
  hasBackgroundImage,
  /** When false, layout size and Properties editing require selecting a banner on the canvas first. */
  hasActiveArtboard = true,
  state,
  setField,
  setFieldsPatch,
  /** Called when user picks a pixel size in Layout (replace vs add-new is handled in the page). */
  onLayoutSizeSelect,
  logos,
  selectedLogo,
  selectLogo,
  isLoading,
  isDetailLoading,
  fetchError,
  onResetToDefaults,
  bgImageLoading,
  onOpenStockDialog,
  isLeaderboardFormat,
  lockedPaletteName,
  lockedPaletteLabel,
  lockedSwatchHex,
  templateControlsUnlocked,
  activeTemplateId,
  onTemplateApplied,
  onAddTemplateToBoard,
  /** When the user focuses an element in the preview, switch to Properties and expand this panel. */
  propertiesPanelExpandSignal,
}) {
  const handleOpenStockWhenActive = useCallback(() => {
    if (!hasActiveArtboard) return;
    onOpenStockDialog();
  }, [hasActiveArtboard, onOpenStockDialog]);

  /** 0 = Layout, 1 = Properties */
  const [tab, setTab] = useState(0);
  const [openPanelId, setOpenPanelId] = useState(AD_BUILDER_PANEL_LOGO);
  const togglePanel = useCallback((id) => {
    setOpenPanelId((prev) => (prev === id ? null : id));
  }, []);

  useEffect(() => {
    const id = propertiesPanelExpandSignal?.id;
    if (!id) return;
    setTab(1);
    setOpenPanelId(id);
  }, [propertiesPanelExpandSignal?.id, propertiesPanelExpandSignal?.nonce]);

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRight: { lg: "1px solid" },
        borderColor: "divider",
        p: { xs: 1.5, md: 2 },
        display: "flex",
        flexDirection: "column",
        order: { xs: 2, lg: 1 },
      }}
    >
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="fullWidth"
        aria-label="Builder panel sections"
        sx={{
          flexShrink: 0,
          minHeight: 40,
          borderBottom: "1px solid",
          borderColor: "divider",
          mb: 0,
          "& .MuiTab-root": { minHeight: 40, py: 1, typography: "body2", fontWeight: 600 },
        }}
      >
        <Tab label="Layout" id="ad-builder-right-tab-0" aria-controls="ad-builder-right-tabpanel-0" />
        <Tab label="Properties" id="ad-builder-right-tab-1" aria-controls="ad-builder-right-tabpanel-1" />
      </Tabs>

      <TabPanel value={tab} index={0} overflow="hidden" tabSwitchKey={tab === 0 ? "layout" : undefined}>
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box sx={{ flexShrink: 0 }}>
            <AdBuilderRightPanelProperties state={state} setField={setField} onSelectSize={onLayoutSizeSelect} />
            {!hasBackgroundImage && (
              <Alert severity="info" variant="outlined" sx={{ borderRadius: 1, py: 0.75, mt: 1.5 }}>
                <strong>Tip:</strong> add a background in <strong>Properties → Image</strong> (after you apply a template)
                for full shape and overlay controls.
              </Alert>
            )}
          </Box>
          <AdBuilderLayoutTemplatesSection
            state={state}
            setField={setField}
            setFieldsPatch={setFieldsPatch}
            hasBackgroundImage={hasBackgroundImage}
            selectedLogo={selectedLogo}
            isLeaderboardFormat={isLeaderboardFormat}
            activeTemplateId={activeTemplateId}
            onTemplateApplied={onTemplateApplied}
            onAddTemplateToBoard={onAddTemplateToBoard}
          />
        </Box>
      </TabPanel>

      <TabPanel value={tab} index={1} overflow="hidden" tabSwitchKey={tab === 1 ? "properties" : undefined}>
        <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <AdBuilderPropertiesTab
            state={state}
            setField={setField}
            setFieldsPatch={setFieldsPatch}
            hasActiveArtboard={hasActiveArtboard}
            hasBackgroundImage={hasBackgroundImage}
            selectedLogo={selectedLogo}
            isLeaderboardFormat={isLeaderboardFormat}
            templateControlsUnlocked={templateControlsUnlocked}
            logos={logos}
            selectLogo={selectLogo}
            isLoading={isLoading}
            isDetailLoading={isDetailLoading}
            fetchError={fetchError}
            onResetToDefaults={onResetToDefaults}
            bgImageLoading={bgImageLoading}
            onOpenStockDialog={handleOpenStockWhenActive}
            lockedPaletteName={lockedPaletteName}
            lockedPaletteLabel={lockedPaletteLabel}
            lockedSwatchHex={lockedSwatchHex}
            openPanelId={openPanelId}
            onTogglePanel={togglePanel}
          />
        </Box>
      </TabPanel>
    </Box>
  );
}
