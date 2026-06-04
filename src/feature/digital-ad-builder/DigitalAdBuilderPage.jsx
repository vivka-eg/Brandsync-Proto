"use client";

import React, { useRef, useCallback, useMemo, useState, useEffect } from "react";
import {
  Box,
  Alert,
  Button,
  useMediaQuery,
  Stack,
  Tooltip,
  IconButton,
  Typography,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Header from "@/components/Header";
import useAllProductLogos from "@/hooks/useAllProductLogos";
import Loader from "@/components/shared/Loader";
import VpnContentAlert from "@/components/shared/VpnContentAlert";
import { useRouter, notFound } from "next/navigation";
import { useToast } from "@/context/shared/ToastContext";
import { useAppEnv } from "@/hooks/useAppEnv";

import useAdBuilderState from "./useAdBuilderState";
import { AD_SIZE_PRESET_MAP, isSameAdSize } from "./adSizePresets";
import {
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  Rows,
  ArrowCounterClockwise as UndoIcon,
  Repeat as RedoIcon,
} from "phosphor-react";
import { PREVIEW_ZOOM_MIN, PREVIEW_ZOOM_MAX } from "./lib/previewConstants";
import { getBrandPaletteEntries } from "./brandPalettes";
import StockImagePickerDialog from "./StockImagePickerDialog";
import { proxyImageUrl } from "./lib/proxyImageUrl";
import { resolveLogoUrl } from "./lib/logoUrls";
import usePreviewViewport from "./hooks/usePreviewViewport";
import useAdBuilderOnboarding from "./hooks/useAdBuilderOnboarding";
import usePreviewShortcutsPopover from "./hooks/usePreviewShortcutsPopover";
import useBackgroundImageLoadState from "./hooks/useBackgroundImageLoadState";
import useAdExport from "./hooks/useAdExport";
import useLoadingToasts from "./hooks/useLoadingToasts";
import usePaletteSwatchEntries from "./usePaletteSwatchEntries";
import { getLockedPaletteSwatchHex } from "./components/AdBuilderRightPanelProperties";
import BuilderBackLink from "./components/BuilderBackLink";
import AdBuilderPreviewColumn from "./components/AdBuilderPreviewColumn";
import AdBuilderRightPanel from "./components/AdBuilderRightPanel";
import MobileExportDock from "./components/MobileExportDock";
import OffscreenExportArtboard from "./components/OffscreenExportArtboard";
import AdBuilderOnboardingDialog from "./components/AdBuilderOnboardingDialog";
import SaveBoardDialog from "./components/SaveBoardDialog";
import LoadBoardsDrawer from "./components/LoadBoardsDrawer";
import { saveNewBoard, updateBoardState } from "./api/adBoardsApi";
import { getDigitalAssetById } from "@/api/assets/digital-assets";
import {
  defaultAdArtworkState,
  emptyAdArtworkState,
  getActiveArtboard,
  getActiveSelectedSizeId,
  getMergedStateForArtboard,
  mergeActiveArtboardForUi,
  migrateAdArtworkStateIfNeeded,
} from "./adArtworkState";
import {
  DEFAULT_AD_BUILDER_BRAND_PALETTE,
  DEFAULT_AD_BUILDER_LOGO_NAME,
} from "./adBuilderDefaults";
import {
  AD_BUILDER_PANEL_CONTENT,
  AD_BUILDER_PANEL_CTA,
  AD_BUILDER_PANEL_IMAGE,
  AD_BUILDER_PANEL_LOGO,
  AD_BUILDER_PANEL_SHAPES,
} from "./adBuilderPanelIds";
import { AD_TEMPLATES } from "./adTemplates";
import { MAX_ARTBOARDS_ON_BOARD } from "./adBuilderBoardLimits";
function buildArtboardPropsFromMerged(merged, {
  colors,
  logoUrl,
  displayScale,
  onArtboardImageOffsetChange,
  onArtboardPhotoBandHeightRatioChange,
  onInlineTextEditingChange,
  isDetailLoading,
  activeInlineTextRole,
  isActive,
}) {
  const s = merged;
  return {
    headline: s.headline,
    headlineRich: typeof s.headlineRich === "string" ? s.headlineRich : null,
    subtext: s.subtext,
    subtextRich: typeof s.subtextRich === "string" ? s.subtextRich : null,
    headlineFontScale: typeof s.headlineFontScale === "number" ? s.headlineFontScale : 1,
    subtextFontScale: typeof s.subtextFontScale === "number" ? s.subtextFontScale : 1,
    headlineLineHeight: typeof s.headlineLineHeight === "number" ? s.headlineLineHeight : 1.1,
    subtextLineHeight: typeof s.subtextLineHeight === "number" ? s.subtextLineHeight : 1.15,
    headlineSpacing: typeof s.headlineSpacing === "number" ? s.headlineSpacing : 1,
    ctaRadius: typeof s.ctaRadius === "number" ? s.ctaRadius : 0,
    headlineAlign: ["left", "center", "right"].includes(s.headlineAlign) ? s.headlineAlign : "left",
    subtextAlign: ["left", "center", "right"].includes(s.subtextAlign) ? s.subtextAlign : "left",
    ctaShowIcon: Boolean(s.ctaShowIcon),
    ctaAlign: ["left", "center", "right"].includes(s.ctaAlign) ? s.ctaAlign : "left",
    ctaFontScale: typeof s.ctaFontScale === "number" ? s.ctaFontScale : 1,
    ctaPaddingScale: typeof s.ctaPaddingScale === "number" ? s.ctaPaddingScale : 1,
    ctaOffsetX: typeof s.ctaOffsetX === "number" ? s.ctaOffsetX : 0,
    ctaOffsetY: typeof s.ctaOffsetY === "number" ? s.ctaOffsetY : 0,
    cta: s.cta,
    bgHex: colors.bgHex,
    frostHex: colors.frostHex,
    primaryHex: colors.primaryHex,
    frostPanelEnabled: s.frostPanelEnabled ?? true,
    frostOpacity: s.frostOpacity,
    frostPanelScale: typeof s.frostPanelScale === "number" ? s.frostPanelScale : 1,
    frostPanelOffsetX: typeof s.frostPanelOffsetX === "number" ? s.frostPanelOffsetX : 0,
    frostPanelOffsetY: typeof s.frostPanelOffsetY === "number" ? s.frostPanelOffsetY : 0,
    backgroundImageUrl: s.backgroundImageUrl ? proxyImageUrl(s.backgroundImageUrl) : null,
    imageScale: s.imageScale,
    imageOffsetX: s.imageOffsetX,
    imageOffsetY: s.imageOffsetY,
    logoUrl,
    logoScale: typeof s.logoScale === "number" ? s.logoScale : 1,
    logoAlign: ["left", "center", "right"].includes(s.logoAlign) ? s.logoAlign : "left",
    logoPlacement: ["inLayout", "onPhotoTop"].includes(s.logoPlacement) ? s.logoPlacement : "inLayout",
    adLayout: s.adLayout ?? "frostedPanel",
    photoBandHeightRatio: typeof s.photoBandHeightRatio === "number" ? s.photoBandHeightRatio : 0.495,
    photoBandPosition: ["top", "bottom", "left", "right"].includes(s.photoBandPosition)
      ? s.photoBandPosition
      : "bottom",
    photoBandCtaPlacement:
      s.photoBandCtaPlacement === "onPhoto" || s.photoBandCtaPlacement === "underLogo"
        ? s.photoBandCtaPlacement
        : "onBand",
    photoBandCtaOnPhotoVertical: ["top", "center", "bottom"].includes(s.photoBandCtaOnPhotoVertical)
      ? s.photoBandCtaOnPhotoVertical
      : "bottom",
    onImageOffsetChange: isActive ? onArtboardImageOffsetChange : undefined,
    onPhotoBandHeightRatioChange: isActive ? onArtboardPhotoBandHeightRatioChange : undefined,
    previewInteractionScale: displayScale > 0 ? displayScale : 1,
    onInlineTextEditingChange: isActive ? onInlineTextEditingChange : undefined,
    logoLoading: isDetailLoading,
    activeInlineRole: isActive ? activeInlineTextRole : null,
  };
}

export default function DigitalAdBuilderPage() {
  const { isDev } = useAppEnv();
  if (!isDev) notFound();

  const router = useRouter();
  const { setToast } = useToast();
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", {
    defaultMatches: false,
  });
  const {
    logos,
    selectedLogo,
    logoDetailsById,
    getLogoDetails,
    isLoading,
    isDetailLoading,
    selectLogo,
    fetchError,
  } = useAllProductLogos({ preferredName: DEFAULT_AD_BUILDER_LOGO_NAME });

  const {
    state,
    setState,
    setField,
    setFieldsPatch,
    resetActiveArtboard,
    isActiveArtboardModified,
    undo,
    redo,
    canUndo,
    canRedo,
    colors,
    addArtboardWithPatch,
    removeArtboard,
    reorderArtboards,
    updateArtboardPosition,
    setActiveArtboardId,
    applyBackgroundImageToAllArtboards,
    copyContentToAllArtboards,
  } = useAdBuilderState();

  const activeSelectedSizeId = useMemo(() => getActiveSelectedSizeId(state), [state]);
  const stateView = useMemo(() => mergeActiveArtboardForUi(state), [state]);
  const hasActiveLogoOverride = stateView.logoDocumentId !== undefined;
  const activeLogoId = hasActiveLogoOverride ? stateView.logoDocumentId : null;
  const activeSelectedLogo = hasActiveLogoOverride
    ? activeLogoId
      ? logoDetailsById[activeLogoId] ?? null
      : null
    : selectedLogo;

  const { exporting, exportError, handleExport, setExportRef } = useAdExport({
    artboards: state.artboards,
    activeArtboardId: state.activeArtboardId,
    selectedLogoName: activeSelectedLogo?.name ?? selectedLogo?.name,
    setToast,
  });

  const [stockDialogOpen, setStockDialogOpen] = useState(false);

  // Save / load board state
  const [savedBoardId, setSavedBoardId] = useState(null);
  const [savedBoardName, setSavedBoardName] = useState(null);
  const [saveBoardDialogOpen, setSaveBoardDialogOpen] = useState(false);
  const [loadBoardsDrawerOpen, setLoadBoardsDrawerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newBoardDialogOpen, setNewBoardDialogOpen] = useState(false);

  // Dismiss any active toast when leaving this page
  useEffect(() => {
    return () => setToast((prev) => ({ ...prev, open: false }));
  }, [setToast]);

  // Restore draft state saved before navigating to /support (back-button flow)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("ad_builder_nav_draft");
      if (raw) {
        const { adState, boardId, boardName } = JSON.parse(raw);
        if (adState) {
          const migrated = migrateAdArtworkStateIfNeeded(adState);
          setState(migrated);
          if ((migrated.artboards ?? []).length > 0) setTemplateControlsUnlocked(true);
        }
        if (boardId) setSavedBoardId(boardId);
        if (boardName) setSavedBoardName(boardName);
      }
    } catch {}
    sessionStorage.removeItem("ad_builder_nav_draft");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Which contentEditable block has focus  -  drives the inline text toolbar. */
  const [activeInlineTextRole, setActiveInlineTextRole] = useState(null);
  /** DOM node for the focused headline/subtext  -  positions the floating toolbar. */
  const [inlineTextAnchorEl, setInlineTextAnchorEl] = useState(null);
  /** Drives Properties accordion + tab when user focuses a preview region (logo, image, copy, CTA). */
  const [propertiesPanelExpandSignal, setPropertiesPanelExpandSignal] = useState(() => ({
    id: null,
    nonce: 0,
  }));
  /** Unlocks Logo / Image / Content / Shapes accordions (true once a template is applied). */
  const [templateControlsUnlocked, setTemplateControlsUnlocked] = useState(false);
  /** Which template id was last applied (shown when browsing the template list again). */
  const [activeTemplateId, setActiveTemplateId] = useState(null);
  /** Pending Add to board when duplicate size confirmation is needed. */
  const [duplicateSizeDialog, setDuplicateSizeDialog] = useState(null);
  /** After picking stock image when multiple banners exist — choose scope before applying. */
  const [pendingStockImage, setPendingStockImage] = useState(null);
  /** After picking a new pixel size in Layout — replace active banner vs add a new slot. */
  const [pendingSizeChange, setPendingSizeChange] = useState(null);

  const artboardCount = state.artboards?.length ?? 0;
  const hasActiveArtboard = state.activeArtboardId != null;

  /** Opens the naming dialog to save as a new board. */
  const handleSaveAs = useCallback(() => {
    setSaveBoardDialogOpen(true);
  }, []);

  /**
   * Quick save: overwrites the currently loaded board.
   * Falls back to opening the "Save as" dialog when no board is loaded yet.
   */
  const handleSave = useCallback(async () => {
    if (!savedBoardId) {
      setSaveBoardDialogOpen(true);
      return;
    }
    setIsSaving(true);
    try {
      await updateBoardState({ id: savedBoardId, name: savedBoardName, state });
      setToast({ open: true, type: "success", message: `"${savedBoardName}" saved.` });
    } catch {
      setToast({ open: true, type: "error", message: "Failed to save board. Please try again." });
    } finally {
      setIsSaving(false);
    }
  }, [savedBoardId, savedBoardName, state, setToast]);

  /** Auto-save every 2 minutes when a board is loaded. Silently overwrites; no toast on success. */
  useEffect(() => {
    if (!savedBoardId) return;
    const interval = setInterval(async () => {
      try {
        await updateBoardState({ id: savedBoardId, name: savedBoardName, state });
      } catch {
        // Silent auto-save failure — user can always manually save.
      }
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [savedBoardId, savedBoardName, state]);

  /** Called by SaveBoardDialog on confirm with the user-supplied name. */
  const handleSaveNewBoard = useCallback(async (name) => {
    const result = await saveNewBoard({ name, state });
    setSavedBoardId(result.data.id);
    setSavedBoardName(result.data.name);
    setToast({ open: true, type: "success", message: `"${result.data.name}" saved as a new board.` });
  }, [state, setToast]);

  /** Restores a saved board snapshot, replacing the current canvas. */
  const handleLoadBoard = useCallback(async (stateSnapshot, { id, name }) => {
    if (!stateSnapshot) return;

    // Re-hydrate backgroundImageUrl from backgroundAssetId BEFORE migration.
    // sanitiseStateForSave sets backgroundImageUrl to null; migrateAdArtworkStateIfNeeded
    // then replaces null with the default URL via `null ?? DEFAULT`, so we must restore
    // the real URL from the assetId while it is still explicitly null in the raw snapshot.
    const rehydratedArtboards = await Promise.all(
      (stateSnapshot.artboards ?? []).map(async (ab) => {
        if (ab.backgroundAssetId && ab.backgroundImageUrl == null) {
          try {
            const asset = await getDigitalAssetById(ab.backgroundAssetId);
            if (asset?.thumbnail) {
              return { ...ab, backgroundImageUrl: asset.thumbnail };
            }
          } catch {
            // Asset may have been deleted — migration will fall back to the default image.
          }
        }
        return ab;
      }),
    );

    const migrated = migrateAdArtworkStateIfNeeded({
      ...stateSnapshot,
      artboards: rehydratedArtboards,
    });

    setState(migrated);
    setSavedBoardId(id);
    setSavedBoardName(name);
    if ((migrated.artboards ?? []).length > 0) setTemplateControlsUnlocked(true);
    setToast({ open: true, type: "success", message: `"${name}" loaded.` });

    // Re-select the saved logo so the logo picker reflects the loaded board.
    // logos is already fetched by this point; if not found, leave current selection.
    const loadedActive = getActiveArtboard(migrated);
    const loadedLogoId = loadedActive?.logoDocumentId ?? migrated.logoDocumentId;
    if (loadedLogoId) {
      const match = logos.find((l) => l.id === loadedLogoId);
      if (match) selectLogo(match);
    }
  }, [setState, setToast, logos, selectLogo]);

  const {
    previewZoom,
    setPreviewZoom,
    previewPan,
    spacePanHeld,
    panDraggingUi,
    panTargetRef,
    bindPreviewWheelRef,
    onPreviewPointerDown,
    onPreviewPointerMove,
    onPreviewPointerUp,
    resetViewport,
  } = usePreviewViewport(activeSelectedSizeId);

  const bgImageLoading = useBackgroundImageLoadState(stateView.backgroundImageUrl);

  const {
    open: onboardingOpen,
    hydrated: onboardingHydrated,
    dismissPermanent: dismissOnboardingPermanent,
    dismissForNow: dismissOnboardingForNow,
    openHelp: openOnboardingHelp,
  } = useAdBuilderOnboarding();

  const {
    previewShortcutsAnchor,
    closePreviewShortcuts,
    togglePreviewShortcuts,
  } = usePreviewShortcutsPopover();

  useEffect(() => {
    const logoId = stateView.logoDocumentId ?? null;
    if (!logoId) return;
    if (selectedLogo?.id === logoId && logoDetailsById[logoId]) return;
    const match = logos.find((l) => l.id === logoId) ?? { id: logoId };
    selectLogo(match);
  }, [logoDetailsById, logos, selectLogo, selectedLogo, stateView.logoDocumentId]);

  useEffect(() => {
    const ids = Array.from(
      new Set(
        (state.artboards ?? [])
          .map((ab) => (ab.logoDocumentId !== undefined ? ab.logoDocumentId : state.logoDocumentId))
          .filter(Boolean),
      ),
    );
    ids.forEach((logoId) => {
      if (!logoDetailsById[logoId]) {
        getLogoDetails(logoId).catch(() => {});
      }
    });
  }, [getLogoDetails, logoDetailsById, state.artboards, state.logoDocumentId]);

  const logoUrlRaw = useMemo(
    () =>
      activeSelectedLogo
        ? resolveLogoUrl(activeSelectedLogo, stateView.logoTone, stateView.logoOrientation)
        : null,
    [activeSelectedLogo, stateView.logoTone, stateView.logoOrientation],
  );

  const logoUrl = useMemo(() => proxyImageUrl(logoUrlRaw), [logoUrlRaw]);

  const isLeaderboardFormat = useMemo(() => {
    const preset = AD_SIZE_PRESET_MAP[activeSelectedSizeId];
    if (!preset) return false;
    return preset.height <= 140 && preset.width >= preset.height * 2.2;
  }, [activeSelectedSizeId]);

  const hasBackgroundImage = Boolean(stateView.backgroundImageUrl);

  const previewPreset = useMemo(() => {
    return AD_SIZE_PRESET_MAP[activeSelectedSizeId] ?? null;
  }, [activeSelectedSizeId]);

  const previewScale = useMemo(() => {
    if (!previewPreset) return 1;
    const maxPreviewW = 720;
    const maxPreviewH = 560;
    return Math.min(
      maxPreviewW / previewPreset.width,
      maxPreviewH / previewPreset.height,
      1,
    );
  }, [previewPreset]);

  const displayScale = previewPreset ? previewScale * previewZoom : 0;

  const onArtboardImageOffsetChange = useCallback(
    (patch, opts) => {
      setFieldsPatch(patch, { skipHistory: opts?.recordHistory !== true });
    },
    [setFieldsPatch],
  );

  const onArtboardPhotoBandHeightRatioChange = useCallback(
    (ratio, opts) => {
      setField("photoBandHeightRatio", ratio, { skipHistory: opts?.recordHistory !== true });
    },
    [setField],
  );

  const onInlineTextEditingChange = useCallback((role, anchorEl) => {
    if (role === "shapes") {
      setPropertiesPanelExpandSignal((s) => ({
        id: AD_BUILDER_PANEL_SHAPES,
        nonce: s.nonce + 1,
      }));
      setActiveInlineTextRole(null);
      setInlineTextAnchorEl(null);
      return;
    }
    setActiveInlineTextRole(role);
    setInlineTextAnchorEl(anchorEl ?? null);
    if (role) {
      const nextId =
        role === "logo"
          ? AD_BUILDER_PANEL_LOGO
          : role === "image"
            ? AD_BUILDER_PANEL_IMAGE
            : role === "headline" || role === "subtext"
              ? AD_BUILDER_PANEL_CONTENT
              : role === "cta"
                ? AD_BUILDER_PANEL_CTA
                : null;
      if (nextId) {
        setPropertiesPanelExpandSignal((s) => ({ id: nextId, nonce: s.nonce + 1 }));
      }
    }
  }, []);

  /** Opens stock picker from the preview image toolbar and closes that bar. */
  const onOpenStockFromInlineToolbar = useCallback(() => {
    setStockDialogOpen(true);
    setActiveInlineTextRole(null);
    setInlineTextAnchorEl(null);
  }, []);

  const applyStockImageScope = useCallback(
    (scope) => {
      if (!pendingStockImage) return;
      if (scope === "all") {
        applyBackgroundImageToAllArtboards(
          pendingStockImage.assetId,
          pendingStockImage.webpUrl,
        );
      } else {
        setField("backgroundAssetId", pendingStockImage.assetId);
        setField("backgroundImageUrl", pendingStockImage.webpUrl);
      }
      setPendingStockImage(null);
    },
    [pendingStockImage, applyBackgroundImageToAllArtboards, setField],
  );

  const handleStockAssetSelect = useCallback(
    (asset) => {
      if (!asset) return;
      const webpUrl = asset.thumbnail;
      if (!webpUrl) {
        setToast({
          open: true,
          type: "warning",
          message:
            "This image has no WebP preview available. Please pick another stock image.",
        });
        return;
      }
      if (artboardCount <= 1) {
        if (state.activeArtboardId == null) {
          setToast({
            open: true,
            type: "info",
            message: "Select a banner on the canvas first.",
          });
          return;
        }
        setField("backgroundAssetId", asset.id);
        setField("backgroundImageUrl", webpUrl);
        return;
      }
      setPendingStockImage({ assetId: asset.id, webpUrl });
    },
    [artboardCount, state.activeArtboardId, setField, setToast],
  );

  /** Dismiss floating image toolbar on Escape or click outside (image area + toolbar). */
  useEffect(() => {
    if (activeInlineTextRole !== "image" || !inlineTextAnchorEl) return;
    const anchor = inlineTextAnchorEl;
    const clear = () => {
      setActiveInlineTextRole(null);
      setInlineTextAnchorEl(null);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        clear();
      }
    };
    const onPointerDown = (e) => {
      const t = e.target;
      if (typeof t.closest === "function" && t.closest("[data-ad-inline-format-toolbar]")) return;
      if (anchor.contains(t)) return;
      clear();
    };
    window.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [activeInlineTextRole, inlineTextAnchorEl]);

  useEffect(() => {
    if (state.activeArtboardId == null) {
      setActiveInlineTextRole(null);
      setInlineTextAnchorEl(null);
    }
  }, [state.activeArtboardId]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      const el = document.activeElement;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || el?.isContentEditable) return;
      if (activeInlineTextRole) return;
      if (!state.activeArtboardId) return;
      if ((state.artboards?.length ?? 0) <= 1) return;
      e.preventDefault();
      removeArtboard(state.activeArtboardId);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state.activeArtboardId, state.artboards, activeInlineTextRole, removeArtboard]);

  const handleLayoutSizeSelect = useCallback(
    (targetSizeId) => {
      const active = getActiveArtboard(state);
      const slot = active ?? state.artboards?.[0];
      if (!slot) {
        // Blank board — create the first artboard with the selected size.
        addArtboardWithPatch({ selectedSizeId: targetSizeId });
        setTemplateControlsUnlocked(true);
        return;
      }
      if (state.activeArtboardId == null) {
        setActiveArtboardId(slot.id);
      }
      if (isSameAdSize(slot.selectedSizeId, targetSizeId)) return;
      setPendingSizeChange({ targetSizeId });
    },
    [state, setActiveArtboardId, addArtboardWithPatch],
  );

  const confirmSizeChangeReplace = useCallback(() => {
    if (!pendingSizeChange) return;
    const { targetSizeId } = pendingSizeChange;
    setPendingSizeChange(null);
    setField("selectedSizeId", targetSizeId);
  }, [pendingSizeChange, setField]);

  const confirmSizeChangeAddNew = useCallback(() => {
    if (!pendingSizeChange) return;
    const { targetSizeId } = pendingSizeChange;
    setPendingSizeChange(null);
    if (state.artboards.length >= MAX_ARTBOARDS_ON_BOARD) {
      setToast({
        open: true,
        type: "warning",
        message: `You can add up to ${MAX_ARTBOARDS_ON_BOARD} banners on one board. Remove one to add more.`,
      });
      return;
    }
    const sameSizeCount = state.artboards.filter((a) => a.selectedSizeId === targetSizeId).length;
    if (sameSizeCount >= 2) {
      setDuplicateSizeDialog({ type: "sizeAdd", targetSizeId });
      return;
    }
    addArtboardWithPatch({ selectedSizeId: targetSizeId });
  }, [pendingSizeChange, state.artboards, addArtboardWithPatch, setToast]);

  const artboardProps = useMemo(
    () =>
      buildArtboardPropsFromMerged(stateView, {
        colors,
        logoUrl,
        displayScale,
        onArtboardImageOffsetChange,
        onArtboardPhotoBandHeightRatioChange,
        onInlineTextEditingChange,
        isDetailLoading,
        activeInlineTextRole,
        isActive: hasActiveArtboard,
      }),
    [
      stateView,
      colors,
      logoUrl,
      onArtboardImageOffsetChange,
      onArtboardPhotoBandHeightRatioChange,
      displayScale,
      onInlineTextEditingChange,
      isDetailLoading,
      activeInlineTextRole,
      hasActiveArtboard,
    ],
  );

  const artboardPropsById = useMemo(() => {
    const map = {};
    for (const ab of state.artboards ?? []) {
      const merged = getMergedStateForArtboard(state, ab.id);
      const hasLogoOverride = merged.logoDocumentId !== undefined;
      const artboardLogoId = hasLogoOverride ? merged.logoDocumentId : null;
      const artboardLogo = hasLogoOverride
        ? artboardLogoId
          ? logoDetailsById[artboardLogoId]
          : null
        : selectedLogo;
      const artboardLogoUrlRaw = artboardLogo
        ? resolveLogoUrl(artboardLogo, merged.logoTone, merged.logoOrientation)
        : null;
      // displayScale is intentionally omitted — it is only used for interaction drag
      // math (image-pan, band-resize) and changes on every zoom step, which would
      // invalidate all artboard renders unnecessarily. AdBuilderPreviewColumn passes
      // compositeDisplayScale directly to each AdArtboard as previewInteractionScale.
      map[ab.id] = buildArtboardPropsFromMerged(merged, {
        colors,
        logoUrl: proxyImageUrl(artboardLogoUrlRaw),
        displayScale: 1,
        onArtboardImageOffsetChange,
        onArtboardPhotoBandHeightRatioChange,
        onInlineTextEditingChange,
        isDetailLoading,
        activeInlineTextRole,
        isActive: ab.id === state.activeArtboardId,
      });
    }
    return map;
  }, [
    state,
    state.artboards,
    state.activeArtboardId,
    colors,
    logoDetailsById,
    selectedLogo,
    onArtboardImageOffsetChange,
    onArtboardPhotoBandHeightRatioChange,
    onInlineTextEditingChange,
    isDetailLoading,
    activeInlineTextRole,
  ]);

  useLoadingToasts({
    isLoading,
    isDetailLoading,
    prefersReducedMotion,
    setToast,
  });

  const brandPalettes = useMemo(() => getBrandPaletteEntries(), []);

  const { paletteEntriesForSwatches } = usePaletteSwatchEntries(
    brandPalettes,
    logos,
    activeSelectedLogo,
    state,
  );

  const lockedPaletteEntry = useMemo(() => {
    const logoPaletteName = activeSelectedLogo?.colorPalette;
    if (logoPaletteName) {
      const fromLogo = brandPalettes.find((p) => p.name === logoPaletteName);
      if (fromLogo) return fromLogo;
    }
    return paletteEntriesForSwatches[1] ?? paletteEntriesForSwatches[0];
  }, [activeSelectedLogo?.colorPalette, brandPalettes, paletteEntriesForSwatches]);

  const lockedPaletteName = lockedPaletteEntry?.name ?? null;
  const lockedPaletteLabel = lockedPaletteEntry?.label ?? lockedPaletteName;

  const lockedSwatchHex = useMemo(
    () => getLockedPaletteSwatchHex(lockedPaletteName, state.bgShade),
    [lockedPaletteName, state.bgShade],
  );

  /** Merged default template (Hero Frost copy + scales); used when entering small banner formats. */
  const templateMergedDefaults = useMemo(() => mergeActiveArtboardForUi(defaultAdArtworkState()), []);
  const prevSelectedSizeIdRef = useRef(null);
  const prevLogoIdRef = useRef({});

  const SMALL_BANNER_IDS = useMemo(
    () => ["320x50", "320x100", "728x90"],
    [],
  );

  useEffect(() => {
    if (stateView.logoDocumentId && !activeSelectedLogo) return;
    const logoId = activeSelectedLogo?.id ?? null;
    const logoSlotKey = stateView.activeArtboardId ?? "root";
    const prevLogoId = prevLogoIdRef.current[logoSlotKey];
    const didChangeLogo = prevLogoId != null && prevLogoId !== logoId;
    const patch = { logoDocumentId: logoId };
    const isWorksense =
      activeSelectedLogo?.name?.trim().toLowerCase() ===
      DEFAULT_AD_BUILDER_LOGO_NAME.trim().toLowerCase();
    const key = isWorksense ? DEFAULT_AD_BUILDER_BRAND_PALETTE : activeSelectedLogo?.colorPalette;
    if (key && brandPalettes.some((p) => p.name === key)) {
      patch.bgPalette = key;
      patch.frostPalette = key;
      patch.bgShade = "2";
      patch.frostShade = "2";
    }
    // If logo changed, reset inline word-color formatting for heading + paragraph.
    if (didChangeLogo) {
      patch.headlineRich = null;
      patch.subtextRich = null;
    }
    setFieldsPatch(patch);
    prevLogoIdRef.current[logoSlotKey] = logoId;
  }, [
    activeSelectedLogo?.id,
    activeSelectedLogo?.name,
    activeSelectedLogo?.colorPalette,
    brandPalettes,
    setFieldsPatch,
    stateView.logoDocumentId,
    stateView.activeArtboardId,
  ]);

  // Small leaderboard / mobile banners: shorter default copy and base headline scale than Hero Frost,
  // so the template headline and description do not dominate the strip.
  useEffect(() => {
    const prev = prevSelectedSizeIdRef.current;
    prevSelectedSizeIdRef.current = activeSelectedSizeId;
    const nowSmall = SMALL_BANNER_IDS.includes(activeSelectedSizeId);
    const fromNonSmall = prev === null || !SMALL_BANNER_IDS.includes(prev);
    if (!nowSmall || !fromNonSmall) return;
    const merged = templateMergedDefaults;
    if (stateView.headline === merged.headline) {
      setField("headline", "Your campaign", { skipHistory: true });
    }
    if (stateView.subtext === merged.subtext) {
      setField("subtext", "Supporting copy that explains your offer.", { skipHistory: true });
    }
    if (stateView.headlineFontScale === merged.headlineFontScale) {
      setField("headlineFontScale", 0.88, { skipHistory: true });
    }
    if (stateView.subtextFontScale === merged.subtextFontScale) {
      setField("subtextFontScale", 0.88, { skipHistory: true });
    }
  }, [
    SMALL_BANNER_IDS,
    activeSelectedSizeId,
    stateView.headline,
    stateView.subtext,
    stateView.headlineFontScale,
    stateView.subtextFontScale,
    templateMergedDefaults,
    setField,
  ]);

  // For very small mobile / banner sizes, force Photo + colour band layout.
  useEffect(() => {
    if (!SMALL_BANNER_IDS.includes(activeSelectedSizeId)) return;
    if (stateView.adLayout === "photoBand") return;
    setField("adLayout", "photoBand", { skipHistory: true });
    setToast({
      open: true,
      type: "info",
      message: "Small banner format requires Photo layout. Layout automatically switched.",
    });
  }, [SMALL_BANNER_IDS, activeSelectedSizeId, stateView.adLayout, setField, setToast]);

  useEffect(() => {
    if (
      stateView.photoBandCtaPlacement === "underLogo" &&
      (!activeSelectedLogo || stateView.logoPlacement === "onPhotoTop") &&
      stateView.adLayout === "photoBand"
    ) {
      setField("photoBandCtaPlacement", "onBand");
    }
  }, [stateView.photoBandCtaPlacement, stateView.adLayout, activeSelectedLogo, stateView.logoPlacement, setField]);

  useEffect(() => {
    const preset = AD_SIZE_PRESET_MAP[activeSelectedSizeId];
    if (!preset) return;
    const lb = preset.height <= 140 && preset.width >= preset.height * 2.2;
    if (stateView.adLayout !== "photoBand") return;
    const pos = stateView.photoBandPosition;
    if (lb && (pos === "top" || pos === "bottom")) {
      setField("photoBandPosition", "right");
    } else if (!lb && (pos === "left" || pos === "right")) {
      setField("photoBandPosition", "bottom");
    }
  }, [activeSelectedSizeId, stateView.adLayout, stateView.photoBandPosition, setField]);

  const handleResetToDefaults = useCallback(() => {
    resetActiveArtboard();
    setActiveInlineTextRole(null);
    setInlineTextAnchorEl(null);
  }, [resetActiveArtboard]);

  /**
   * "New board" — shows a warning dialog if there's anything worth losing
   * (a named board is loaded, or the user has made undoable changes).
   */
  const handleNewBoard = useCallback(() => {
    if (savedBoardId || canUndo) {
      setNewBoardDialogOpen(true);
    } else {
      // Nothing worth losing — clear immediately.
      setState(emptyAdArtworkState());
      setActiveTemplateId(null);
      resetViewport();
      setActiveInlineTextRole(null);
      setInlineTextAnchorEl(null);
      setTemplateControlsUnlocked(false);
    }
  }, [savedBoardId, canUndo, setState, resetViewport]);

  const confirmNewBoard = useCallback(() => {
    setNewBoardDialogOpen(false);
    setState(emptyAdArtworkState());
    setSavedBoardId(null);
    setSavedBoardName(null);
    setActiveTemplateId(null);
    resetViewport();
    setActiveInlineTextRole(null);
    setInlineTextAnchorEl(null);
    setTemplateControlsUnlocked(false);
  }, [setState, resetViewport]);

  const handleSupportNavigation = useCallback(() => {
    try {
      sessionStorage.setItem("ad_builder_nav_draft", JSON.stringify({
        adState: state,
        boardId: savedBoardId,
        boardName: savedBoardName,
      }));
    } catch {}
    router.push("/support");
  }, [state, savedBoardId, savedBoardName, router]);

  const onTemplateApplied = useCallback(
    (templateId) => {
      setTemplateControlsUnlocked(true);
      if (templateId) setActiveTemplateId(templateId);
      const t = AD_TEMPLATES.find((x) => x.id === templateId);
      setToast({
        open: true,
        type: "success",
        message: `${t ? `${t.title} loaded` : "Template loaded"}. Use Properties to tweak settings.`,
      });
    },
    [setToast],
  );

  const runAddTemplateToBoard = useCallback(
    (patch, templateId, isFirstBoard = false) => {
      addArtboardWithPatch(patch);
      setTemplateControlsUnlocked(true);
      if (templateId) setActiveTemplateId(templateId);
      const t = AD_TEMPLATES.find((x) => x.id === templateId);
      setToast({
        open: true,
        type: "success",
        message: isFirstBoard
          ? `${t ? `${t.title} loaded` : "Template loaded"}. Use Properties to tweak settings.`
          : `${t ? `${t.title} added` : "Layout added"} around your main banner. Select a size tab to edit that banner independently.`,
      });
    },
    [addArtboardWithPatch, setToast],
  );

  const handleAddTemplateToBoard = useCallback(
    (patch, templateId) => {
      if (state.artboards.length >= MAX_ARTBOARDS_ON_BOARD) {
        setToast({
          open: true,
          type: "warning",
          message: `You can add up to ${MAX_ARTBOARDS_ON_BOARD} banners on one board. Remove one to add more.`,
        });
        return;
      }
      const isFirstBoard = state.artboards.length === 0;
      const targetSizeId = getActiveSelectedSizeId(state);
      const sameSizeCount = state.artboards.filter((a) => a.selectedSizeId === targetSizeId).length;
      if (sameSizeCount >= 2) {
        setDuplicateSizeDialog({ type: "template", patch, templateId, targetSizeId });
        return;
      }
      runAddTemplateToBoard(patch, templateId, isFirstBoard);
    },
    [state, runAddTemplateToBoard, setToast],
  );

  const confirmDuplicateSizeAdd = useCallback(() => {
    if (!duplicateSizeDialog) return;
    if (duplicateSizeDialog.type === "sizeAdd") {
      const { targetSizeId } = duplicateSizeDialog;
      setDuplicateSizeDialog(null);
      addArtboardWithPatch({ selectedSizeId: targetSizeId });
      return;
    }
    const { patch, templateId } = duplicateSizeDialog;
    setDuplicateSizeDialog(null);
    runAddTemplateToBoard(patch, templateId);
  }, [duplicateSizeDialog, runAddTemplateToBoard, addArtboardWithPatch]);

  const onArtboardHeadlineChange = useCallback(
    (payload) => {
      if (typeof payload === "string") {
        setField("headline", payload);
        return;
      }
      setFieldsPatch({
        headline: payload?.plain ?? "",
        headlineRich: payload?.rich ?? null,
      });
    },
    [setField, setFieldsPatch],
  );
  const onArtboardSubtextChange = useCallback(
    (payload) => {
      if (typeof payload === "string") {
        setField("subtext", payload);
        return;
      }
      setFieldsPatch({
        subtext: payload?.plain ?? "",
        subtextRich: payload?.rich ?? null,
      });
    },
    [setField, setFieldsPatch],
  );
  const onboardingModal = onboardingHydrated ? (
    <AdBuilderOnboardingDialog
      open={Boolean(onboardingOpen && !isLoading)}
      onGetStarted={dismissOnboardingPermanent}
      onRemindLater={dismissOnboardingForNow}
      galleryLogos={logos.slice(0, 3)}
    />
  ) : null;

  if (fetchError) return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <VpnContentAlert title="AD Studio" />
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        /* Lock builder to viewport on desktop so the preview column stays in view; side panels scroll inside. */
        height: { lg: "100dvh" },
        maxHeight: { lg: "100dvh" },
        overflow: { lg: "hidden" },
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          width: "100%",
          minWidth: 0,
          minHeight: 0,
          overflow: { lg: "hidden" },
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            px: { xs: 3, md: 5 },
            pt: 2,
            pb: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <BuilderBackLink onNavigate={() => router.push("/digital-assets")} />

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ display: { xs: "none", lg: "flex" }, mx: 2 }}
            >
              <Tooltip title="Undo (Ctrl+Z)">
                <span>
                  <IconButton onClick={undo} disabled={!canUndo || isLoading}>
                    <UndoIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Redo (Ctrl+Y)">
                <span>
                  <IconButton onClick={redo} disabled={!canRedo || isLoading}>
                    <RedoIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <Box sx={{ width: "1px", height: 24, bgcolor: "divider", mx: 1 }} />

              <Tooltip title="Zoom Out">
                <IconButton
                  onClick={() => setPreviewZoom((z) => Math.max(PREVIEW_ZOOM_MIN, z / 1.2))}
                  disabled={isLoading}
                >
                  <MagnifyingGlassMinus />
                </IconButton>
              </Tooltip>
              <Typography
                variant="caption"
                sx={{ minWidth: "4ch", textAlign: "center" }}
              >
                {Math.round(previewZoom * 100)}%
              </Typography>
              <Tooltip title="Zoom In">
                <IconButton
                  onClick={() => setPreviewZoom((z) => Math.min(PREVIEW_ZOOM_MAX, z * 1.2))}
                  disabled={isLoading}
                >
                  <MagnifyingGlassPlus />
                </IconButton>
              </Tooltip>
              <Tooltip title="Fit to Screen">
                <IconButton onClick={resetViewport} disabled={isLoading}>
                  <Rows />
                </IconButton>
              </Tooltip>
            </Stack>

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ ml: "auto" }}
            >
              <Button
                variant="text"
                size="small"
                onClick={openOnboardingHelp}
                aria-label="Take the tour: how the digital ad builder works"
                sx={{ color: "text.secondary" }}
              >
                Take the tour
              </Button>
              <Button
                variant="contained"
                onClick={handleExport}
                disabled={exporting || artboardCount === 0 || isLoading}
                sx={{ display: { xs: "none", lg: "inline-flex" } }}
              >
                {!hasActiveArtboard && artboardCount > 1 ? "Export All" : "Export Ad"}
              </Button>
            </Stack>
          </Box>

        </Box>

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: { lg: "hidden" },
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(340px, 420px) minmax(320px, 1fr)",
            },
            gridTemplateRows: { xs: "auto", lg: "minmax(0, 1fr)" },
            height: { lg: "100%" },
            width: "100%",
            alignItems: "stretch",
            pb: { xs: 10, lg: 0 },
          }}
        >
          <Box
            sx={(theme) => ({
              bgcolor: "background.paper",
              borderRight: "1px solid",
              borderColor: "divider",
              overflowY: "auto",
              position: "relative",
              scrollbarWidth: "thin",
              scrollbarColor: `${theme.palette.mode === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"} transparent`,
            })}
          >
            {isLoading ? (
              <Stack spacing={2} sx={{ p: 3 }}>
                <Skeleton variant="rectangular" height={40} />
                <Skeleton variant="rectangular" height={120} />
                <Skeleton variant="rectangular" height={200} />
                <Skeleton variant="rectangular" height={150} />
              </Stack>
            ) : (
              <AdBuilderRightPanel
                hasBackgroundImage={hasBackgroundImage}
                hasActiveArtboard={hasActiveArtboard}
                state={stateView}
                setField={setField}
                setFieldsPatch={setFieldsPatch}
                onLayoutSizeSelect={handleLayoutSizeSelect}
                logos={logos}
                selectedLogo={activeSelectedLogo}
                selectLogo={selectLogo}
                isLoading={isLoading}
                isDetailLoading={isDetailLoading}
                fetchError={fetchError}
                onResetToDefaults={handleResetToDefaults}
                bgImageLoading={bgImageLoading}
                onOpenStockDialog={() => setStockDialogOpen(true)}
                isLeaderboardFormat={isLeaderboardFormat}
                lockedPaletteName={lockedPaletteName}
                lockedPaletteLabel={lockedPaletteLabel}
                lockedSwatchHex={lockedSwatchHex}
                templateControlsUnlocked={templateControlsUnlocked}
                activeTemplateId={activeTemplateId}
                onTemplateApplied={onTemplateApplied}
                onAddTemplateToBoard={handleAddTemplateToBoard}
                propertiesPanelExpandSignal={propertiesPanelExpandSignal}
              />
            )}
          </Box>

          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              bgcolor: "background.default",
              backgroundImage: (theme) =>
                `radial-gradient(${alpha(
                  theme.palette.divider,
                  0.2,
                )} 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          >
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Skeleton variant="rectangular" width="80%" height="60%" />
              </Box>
            ) : (
              <AdBuilderPreviewColumn
                previewPreset={previewPreset}
                previewZoom={previewZoom}
                setPreviewZoom={setPreviewZoom}
                previewPan={previewPan}
                displayScale={displayScale}
                prefersReducedMotion={prefersReducedMotion}
                artboardProps={artboardProps}
                artboardPropsById={artboardPropsById}
                state={stateView}
                artboards={state.artboards ?? []}
                activeArtboardId={state.activeArtboardId}
                onSelectArtboard={setActiveArtboardId}
                onClearArtboardSelection={() => setActiveArtboardId(null)}
                onRemoveArtboard={removeArtboard}
                onReorderArtboards={reorderArtboards}
                onUpdateArtboardPosition={updateArtboardPosition}
                exportError={exportError}
                exporting={exporting}
                onExport={handleExport}
                exportDisabled={artboardCount === 0}
                exportAll={!hasActiveArtboard && artboardCount > 1}
                bgImageLoading={bgImageLoading}
                spacePanHeld={spacePanHeld}
                panDraggingUi={panDraggingUi}
                panTargetRef={panTargetRef}
                bindPreviewWheelRef={bindPreviewWheelRef}
                onPreviewPointerDown={onPreviewPointerDown}
                onPreviewPointerMove={onPreviewPointerMove}
                onPreviewPointerUp={onPreviewPointerUp}
                onFitPreviewView={resetViewport}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
                onArtboardHeadlineChange={onArtboardHeadlineChange}
                onArtboardSubtextChange={onArtboardSubtextChange}
                activeInlineTextRole={activeInlineTextRole}
                inlineTextAnchorEl={inlineTextAnchorEl}
                setField={setField}
                onOpenStockDialog={onOpenStockFromInlineToolbar}
                shortcutsPopoverProps={{
                  anchorEl: previewShortcutsAnchor,
                  open: Boolean(previewShortcutsAnchor),
                  onClose: closePreviewShortcuts,
                  onToggle: togglePreviewShortcuts,
                }}
                onCopyContentToAll={copyContentToAllArtboards}
                onSave={handleSave}
                onSaveAs={handleSaveAs}
                isSaving={isSaving}
                onOpenLoadBoards={() => setLoadBoardsDrawerOpen(true)}
                onNewBoard={handleNewBoard}
                onReset={handleResetToDefaults}
                hasActiveArtboard={hasActiveArtboard}
                isActiveArtboardModified={isActiveArtboardModified}
                savedBoardId={savedBoardId}
                currentBoardName={savedBoardName}
                onSupportNavigation={handleSupportNavigation}
              />
            )}
          </Box>
        </Box>

        <StockImagePickerDialog
          open={stockDialogOpen}
          onClose={() => setStockDialogOpen(false)}
          selectedId={stateView.backgroundAssetId}
          onSelect={handleStockAssetSelect}
        />

        <SaveBoardDialog
          open={saveBoardDialogOpen}
          onClose={() => setSaveBoardDialogOpen(false)}
          onConfirm={handleSaveNewBoard}
          initialName={savedBoardName ?? undefined}
        />

        <LoadBoardsDrawer
          open={loadBoardsDrawerOpen}
          onClose={() => setLoadBoardsDrawerOpen(false)}
          onLoadBoard={handleLoadBoard}
          currentBoardId={savedBoardId}
        />

        <Dialog
          open={Boolean(pendingSizeChange)}
          onClose={() => setPendingSizeChange(null)}
          aria-labelledby="size-change-dialog-title"
        >
          <DialogTitle id="size-change-dialog-title">Change banner size?</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              You picked a different pixel size. Replace the selected banner’s dimensions, or add a new banner with this
              size?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, flexWrap: "wrap", gap: 1 }}>
            <Button onClick={() => setPendingSizeChange(null)} color="inherit">
              Cancel
            </Button>
            <Button variant="outlined" onClick={confirmSizeChangeReplace}>
              Replace selected banner
            </Button>
            <Button variant="contained" onClick={confirmSizeChangeAddNew}>
              Add new banner
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={Boolean(pendingStockImage)}
          onClose={() => setPendingStockImage(null)}
          aria-labelledby="stock-scope-dialog-title"
        >
          <DialogTitle id="stock-scope-dialog-title">Apply this image where?</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              You have multiple banners on the board. Apply this stock image only to the currently
              selected banner, or to every banner?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, flexWrap: "wrap", gap: 1 }}>
            <Button onClick={() => setPendingStockImage(null)} color="inherit">
              Cancel
            </Button>
            <Button variant="outlined" onClick={() => applyStockImageScope("selected")}>
              Selected banner only
            </Button>
            <Button variant="contained" onClick={() => applyStockImageScope("all")}>
              All banners
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={Boolean(duplicateSizeDialog)}
          onClose={() => setDuplicateSizeDialog(null)}
          aria-labelledby="duplicate-size-dialog-title"
        >
          <DialogTitle id="duplicate-size-dialog-title">This size is already on the board</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              {duplicateSizeDialog ? (
                <>
                  You already have multiple banners with size{" "}
                  <strong>
                    {AD_SIZE_PRESET_MAP[duplicateSizeDialog.targetSizeId]?.label ??
                      duplicateSizeDialog.targetSizeId}
                  </strong>
                  . Add another banner with the same dimensions?
                </>
              ) : null}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDuplicateSizeDialog(null)}>Cancel</Button>
            <Button variant="contained" onClick={confirmDuplicateSizeAdd}>
              Add another
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={newBoardDialogOpen}
          onClose={() => setNewBoardDialogOpen(false)}
          aria-labelledby="new-board-dialog-title"
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle id="new-board-dialog-title">Start a new board?</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              {savedBoardName
                ? <>Your current work on <strong>{savedBoardName}</strong> has been saved. Starting a new board will clear the canvas — any unsaved changes will be lost.</>
                : "Starting a new board will clear the current canvas. Any unsaved changes will be lost."}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button onClick={() => setNewBoardDialogOpen(false)} color="inherit">
              Keep editing
            </Button>
            <Button variant="contained" color="error" onClick={confirmNewBoard}>
              Discard &amp; start new
            </Button>
          </DialogActions>
        </Dialog>

        <MobileExportDock
          exporting={exporting}
          disabled={exporting || artboardCount === 0}
          onExport={handleExport}
        />
      </Box>

      <OffscreenExportArtboard
        artboards={state.artboards}
        artboardPropsById={artboardPropsById}
        setExportRef={setExportRef}
      />

      {onboardingModal}
    </Box>
  );
}
