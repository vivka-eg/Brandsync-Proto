"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  defaultAdArtworkState,
  defaultBannerCreative,
  emptyAdArtworkState,
  toSerializableAdArtwork,
  migrateAdArtworkStateIfNeeded,
  getActiveArtboard,
  createArtboardSlot,
  isBannerCreativeField,
  BANNER_CREATIVE_FIELD_KEYS,
  placementForSatelliteIndex,
  reassignBoardPlacements,
} from "./adArtworkState";
import { DEFAULT_AD_BUILDER_BACKGROUND_IMAGE_URL } from "./defaultAdBackgroundImageUrl";
import { getShadeHex, getMidShadeKeyForPalette, resolveShadeKeyForPalette } from "./brandPalettes";
import { isSpacePanBlockedTarget } from "./lib/keyboardPan";
import { prepareTemplatePatch } from "./templateApplyUtils";

const MAX_HISTORY = 50;
const EMPTY_BOARD_ROOT_FALLBACK_FIELDS = new Set(["logoDocumentId", "logoTone", "logoOrientation"]);

export default function useAdBuilderState() {
  const [state, setState] = useState(() => migrateAdArtworkStateIfNeeded(emptyAdArtworkState()));
  const pastRef = useRef([]);
  const futureRef = useRef([]);
  const restoringRef = useRef(false);
  // Tracks the creative-field snapshot for each artboard at the moment it was created/reset.
  // Used to determine whether the user has modified the artboard (enables the Reset button).
  const artboardSnapshotsRef = useRef({});

  useEffect(() => {
    setState((prev) => {
      const LEGACY = "/digital-ad-builder/default-ad-background.svg";
      if (!prev.artboards?.length) return prev;
      let changed = false;
      const nextBoards = prev.artboards.map((ab) => {
        if (ab.backgroundImageUrl === LEGACY) {
          changed = true;
          return { ...ab, backgroundImageUrl: DEFAULT_AD_BUILDER_BACKGROUND_IMAGE_URL };
        }
        return ab;
      });
      return changed ? { ...prev, artboards: nextBoards } : prev;
    });
  }, []);

  const setField = useCallback((key, value, opts) => {
    const skipHistory = opts?.skipHistory === true;

    if (key === "selectedSizeId") {
      setState((prev) => {
        const activeId = prev.activeArtboardId;
        const idx = prev.artboards.findIndex((a) => a.id === activeId);
        if (idx === -1) return prev;
        if (prev.artboards[idx].selectedSizeId === value) return prev;
        if (!skipHistory && !restoringRef.current) {
          pastRef.current = [...pastRef.current, structuredClone(prev)].slice(-MAX_HISTORY);
          futureRef.current = [];
        }
        const nextBoards = [...prev.artboards];
        nextBoards[idx] = { ...nextBoards[idx], selectedSizeId: value };
        return { ...prev, artboards: nextBoards };
      });
      return;
    }

    if (isBannerCreativeField(key)) {
      setState((prev) => {
        const activeId = prev.activeArtboardId;
        const idx = prev.artboards.findIndex((a) => a.id === activeId);
        if (idx === -1) {
          if (!EMPTY_BOARD_ROOT_FALLBACK_FIELDS.has(key)) return prev;
          if (Object.is(prev[key], value)) return prev;
          if (!skipHistory && !restoringRef.current) {
            pastRef.current = [...pastRef.current, structuredClone(prev)].slice(-MAX_HISTORY);
            futureRef.current = [];
          }
          return { ...prev, [key]: value };
        }
        const clearsRich =
          (key === "headline" && prev.artboards[idx].headlineRich != null) ||
          (key === "subtext" && prev.artboards[idx].subtextRich != null);
        if (prev.artboards[idx][key] === value && !clearsRich) return prev;
        if (!skipHistory && !restoringRef.current) {
          pastRef.current = [...pastRef.current, structuredClone(prev)].slice(-MAX_HISTORY);
          futureRef.current = [];
        }
        const nextBoards = [...prev.artboards];
        const nextBoard = { ...nextBoards[idx], [key]: value };
        // Plain text edits from side panels should reset any stale inline rich formatting.
        if (key === "headline") nextBoard.headlineRich = null;
        if (key === "subtext") nextBoard.subtextRich = null;
        nextBoards[idx] = nextBoard;
        return { ...prev, artboards: nextBoards };
      });
      return;
    }

    setState((prev) => {
      if (Object.is(prev[key], value)) return prev;
      if (!skipHistory && !restoringRef.current) {
        pastRef.current = [...pastRef.current, structuredClone(prev)].slice(-MAX_HISTORY);
        futureRef.current = [];
      }
      return { ...prev, [key]: value };
    });
  }, []);

  const setFieldsPatch = useCallback((patch, opts) => {
    const skipHistory = opts?.skipHistory === true;
    setState((prev) => {
      let changed = false;
      const next = { ...prev };
      const activeId = prev.activeArtboardId;
      const idx = prev.artboards.findIndex((a) => a.id === activeId);
      let nextBoards = prev.artboards;

      for (const [k, v] of Object.entries(patch)) {
        if (k === "selectedSizeId") {
          if (idx === -1) continue;
          if (prev.artboards[idx].selectedSizeId !== v) {
            changed = true;
            if (nextBoards === prev.artboards) nextBoards = [...prev.artboards];
            nextBoards[idx] = { ...nextBoards[idx], selectedSizeId: v };
          }
          continue;
        }
        if (isBannerCreativeField(k)) {
          if (idx === -1) {
            if (!EMPTY_BOARD_ROOT_FALLBACK_FIELDS.has(k)) continue;
            if (!Object.is(prev[k], v)) {
              changed = true;
              next[k] = v;
            }
            continue;
          }
          if (prev.artboards[idx][k] !== v) {
            changed = true;
            if (nextBoards === prev.artboards) nextBoards = [...prev.artboards];
            nextBoards[idx] = { ...nextBoards[idx], [k]: v };
          }
          continue;
        }
        if (!Object.is(prev[k], v)) {
          changed = true;
          next[k] = v;
        }
      }
      if (!changed) return prev;
      if (idx !== -1 && nextBoards !== prev.artboards) {
        const touchedKeys = new Set(Object.keys(patch));
        // If patch updates plain text but not rich text counterpart, clear stale rich runs.
        if (touchedKeys.has("headline") && !touchedKeys.has("headlineRich")) {
          if (nextBoards[idx].headlineRich != null) {
            nextBoards[idx] = { ...nextBoards[idx], headlineRich: null };
          }
        }
        if (touchedKeys.has("subtext") && !touchedKeys.has("subtextRich")) {
          if (nextBoards[idx].subtextRich != null) {
            nextBoards[idx] = { ...nextBoards[idx], subtextRich: null };
          }
        }
      }
      if (nextBoards !== prev.artboards) {
        next.artboards = nextBoards;
      }
      if (!skipHistory && !restoringRef.current) {
        pastRef.current = [...pastRef.current, structuredClone(prev)].slice(-MAX_HISTORY);
        futureRef.current = [];
      }
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return;
    const snapshot = pastRef.current.pop();
    restoringRef.current = true;
    setState((current) => {
      futureRef.current = [...futureRef.current, structuredClone(current)].slice(-MAX_HISTORY);
      return migrateAdArtworkStateIfNeeded(snapshot);
    });
    queueMicrotask(() => {
      restoringRef.current = false;
    });
  }, []);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const snapshot = futureRef.current.pop();
    restoringRef.current = true;
    setState((current) => {
      pastRef.current = [...pastRef.current, structuredClone(current)].slice(-MAX_HISTORY);
      return migrateAdArtworkStateIfNeeded(snapshot);
    });
    queueMicrotask(() => {
      restoringRef.current = false;
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (!e.metaKey && !e.ctrlKey) return;
      if (isSpacePanBlockedTarget(e.target)) return;
      if (e.key === "z" || e.key === "Z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (e.key === "y" || e.key === "Y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo]);

  useEffect(() => {
    const bg = resolveShadeKeyForPalette(state.bgPalette, state.bgShade);
    const frost = resolveShadeKeyForPalette(state.frostPalette, state.frostShade);
    if (bg !== state.bgShade) setField("bgShade", bg, { skipHistory: true });
    if (frost !== state.frostShade) setField("frostShade", frost, { skipHistory: true });
  }, [state.bgPalette, state.bgShade, state.frostPalette, state.frostShade, setField]);

  const resetToDefaults = useCallback((rootOverride) => {
    pastRef.current = [];
    futureRef.current = [];
    setState(defaultAdArtworkState(rootOverride));
  }, []);

  const resetToEmpty = useCallback((paletteOverride) => {
    pastRef.current = [];
    futureRef.current = [];
    const base = emptyAdArtworkState();
    setState(
      paletteOverride
        ? {
            ...base,
            bgPalette: paletteOverride.bgPalette ?? base.bgPalette,
            bgShade: paletteOverride.bgShade ?? base.bgShade,
            frostPalette: paletteOverride.frostPalette ?? base.frostPalette,
            frostShade: paletteOverride.frostShade ?? base.frostShade,
          }
        : base,
    );
  }, []);

  const resetActiveArtboard = useCallback(() => {
    setState((prev) => {
      const activeId = prev.activeArtboardId;
      const idx = prev.artboards.findIndex((a) => a.id === activeId);
      if (idx === -1) return prev;
      pastRef.current = [...pastRef.current, structuredClone(prev)].slice(-MAX_HISTORY);
      futureRef.current = [];
      const existing = prev.artboards[idx];
      // Restore to the snapshot taken at creation (template patch included).
      // Fall back to bare defaults for loaded boards that have no snapshot.
      const snapshot = artboardSnapshotsRef.current[existing.id];
      const freshCreative = snapshot ?? defaultBannerCreative();
      const nextBoards = [...prev.artboards];
      nextBoards[idx] = {
        ...freshCreative,
        id: existing.id,
        selectedSizeId: existing.selectedSizeId,
        placement: existing.placement,
        posX: existing.posX,
        posY: existing.posY,
      };
      // For loaded boards (no snapshot), anchor snapshot to the reset state so the button
      // re-disables immediately rather than staying permanently enabled.
      if (!snapshot) {
        const newSnap = {};
        for (const key of BANNER_CREATIVE_FIELD_KEYS) newSnap[key] = freshCreative[key];
        artboardSnapshotsRef.current[existing.id] = newSnap;
      }
      return { ...prev, artboards: nextBoards };
    });
  }, []);

  const addArtboardWithPatch = useCallback((rawPatch) => {
    setState((prev) => {
      const active = getActiveArtboard(prev);
      const baseLayout = rawPatch?.adLayout ?? active?.adLayout ?? "frostedPanel";
      const raw = rawPatch && typeof rawPatch === "object" ? { ...rawPatch } : {};
      const newSlotSizeId =
        typeof raw.selectedSizeId === "string" && raw.selectedSizeId.length > 0
          ? raw.selectedSizeId
          : null;
      delete raw.selectedSizeId;
      const patchToApply = prepareTemplatePatch(raw, baseLayout);
      const sizeId = newSlotSizeId ?? active?.selectedSizeId ?? "300x250";
      // First artboard is always the center; subsequent ones get satellite slots.
      const placement =
        prev.artboards.length === 0
          ? "center"
          : placementForSatelliteIndex(prev.artboards.length - 1);
      const inheritedLogo = {
        logoDocumentId: active?.logoDocumentId !== undefined ? active.logoDocumentId : prev.logoDocumentId,
        logoTone: active?.logoTone !== undefined ? active.logoTone : prev.logoTone,
        logoOrientation: active?.logoOrientation !== undefined ? active.logoOrientation : prev.logoOrientation,
      };
      const newSlot = createArtboardSlot(sizeId, placement, {
        ...patchToApply,
        ...inheritedLogo,
        backgroundAssetId: active?.backgroundAssetId ?? null,
        backgroundImageUrl: active?.backgroundImageUrl ?? DEFAULT_AD_BUILDER_BACKGROUND_IMAGE_URL,
      });
      // Snapshot the fresh creative so the Reset button stays disabled until the user actually edits.
      const creativeSnapshot = {};
      for (const key of BANNER_CREATIVE_FIELD_KEYS) creativeSnapshot[key] = newSlot[key];
      artboardSnapshotsRef.current[newSlot.id] = creativeSnapshot;
      if (!restoringRef.current) {
        pastRef.current = [...pastRef.current, structuredClone(prev)].slice(-MAX_HISTORY);
        futureRef.current = [];
      }
      return {
        ...prev,
        artboards: [...prev.artboards, newSlot],
        activeArtboardId: newSlot.id,
      };
    });
  }, []);

  const updateArtboardPosition = useCallback((id, posX, posY) => {
    setState((prev) => {
      const idx = prev.artboards.findIndex((a) => a.id === id);
      if (idx === -1) return prev;
      if (prev.artboards[idx].posX === posX && prev.artboards[idx].posY === posY) return prev;
      if (!restoringRef.current) {
        pastRef.current = [...pastRef.current, structuredClone(prev)].slice(-MAX_HISTORY);
        futureRef.current = [];
      }
      const nextBoards = [...prev.artboards];
      nextBoards[idx] = { ...nextBoards[idx], posX, posY };
      return { ...prev, artboards: nextBoards };
    });
  }, []);

  const reorderArtboards = useCallback((fromIndex, toIndex) => {
    setState((prev) => {
      const len = prev.artboards.length;
      if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= len || toIndex >= len) return prev;
      const next = [...prev.artboards];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      const reordered = reassignBoardPlacements(next);
      if (!restoringRef.current) {
        pastRef.current = [...pastRef.current, structuredClone(prev)].slice(-MAX_HISTORY);
        futureRef.current = [];
      }
      return { ...prev, artboards: reordered };
    });
  }, []);

  const removeArtboard = useCallback((id) => {
    setState((prev) => {
      const nextBoards = prev.artboards.filter((a) => a.id !== id);
      let nextActive = prev.activeArtboardId;
      if (nextActive === id) {
        nextActive = nextBoards.length > 0 ? nextBoards[0].id : null;
      }
      const reordered = reassignBoardPlacements(nextBoards);
      if (!restoringRef.current) {
        pastRef.current = [...pastRef.current, structuredClone(prev)].slice(-MAX_HISTORY);
        futureRef.current = [];
      }
      return { ...prev, artboards: reordered, activeArtboardId: nextActive };
    });
  }, []);

  const setActiveArtboardId = useCallback((id) => {
    setState((prev) => {
      if (id === null) {
        if (prev.activeArtboardId === null) return prev;
        return { ...prev, activeArtboardId: null };
      }
      if (!prev.artboards.some((a) => a.id === id)) return prev;
      if (prev.activeArtboardId === id) return prev;
      return { ...prev, activeArtboardId: id };
    });
  }, []);

  const CONTENT_FIELDS = [
    "headline", "headlineRich", "subtext", "subtextRich", "cta",
    "headlineFontScale", "subtextFontScale",
    "headlineLineHeight", "subtextLineHeight",
    "headlineSpacing", "headlineAlign", "subtextAlign",
    "ctaShowIcon", "ctaAlign", "ctaFontScale", "ctaPaddingScale",
    "ctaOffsetX", "ctaOffsetY", "ctaRadius",
  ];

  const copyContentToAllArtboards = useCallback(() => {
    setState((prev) => {
      if (!prev.artboards?.length) return prev;
      const activeId = prev.activeArtboardId;
      const source = prev.artboards.find((a) => a.id === activeId) ?? prev.artboards[0];
      const patch = {};
      for (const key of CONTENT_FIELDS) {
        if (key in source) patch[key] = source[key];
      }
      if (!Object.keys(patch).length) return prev;
      pastRef.current = [...pastRef.current, structuredClone(prev)].slice(-MAX_HISTORY);
      futureRef.current = [];
      const nextBoards = prev.artboards.map((ab) =>
        ab.id === source.id ? ab : { ...ab, ...patch },
      );
      return { ...prev, artboards: nextBoards };
    });
  }, []);

  const applyBackgroundImageToAllArtboards = useCallback((assetId, imageUrl) => {
    setState((prev) => {
      if (!prev.artboards?.length) return prev;
      if (!restoringRef.current) {
        pastRef.current = [...pastRef.current, structuredClone(prev)].slice(-MAX_HISTORY);
        futureRef.current = [];
      }
      const nextBoards = prev.artboards.map((ab) => ({
        ...ab,
        backgroundAssetId: assetId,
        backgroundImageUrl: imageUrl,
      }));
      return { ...prev, artboards: nextBoards };
    });
  }, []);

  const isActiveArtboardModified = useMemo(() => {
    const active = getActiveArtboard(state);
    if (!active) return false;
    const snapshot = artboardSnapshotsRef.current[active.id];
    if (!snapshot) return true; // loaded board — treat as modified so Reset is available
    for (const key of BANNER_CREATIVE_FIELD_KEYS) {
      if (JSON.stringify(active[key]) !== JSON.stringify(snapshot[key])) return true;
    }
    return false;
  }, [state]);

  const colors = useMemo(
    () => ({
      bgHex: getShadeHex(state.bgPalette, state.bgShade),
      frostHex: getShadeHex(state.frostPalette, state.frostShade),
      primaryHex: getShadeHex(state.bgPalette, getMidShadeKeyForPalette(state.bgPalette)),
    }),
    [state.bgPalette, state.bgShade, state.frostPalette, state.frostShade],
  );

  const serializable = useMemo(() => toSerializableAdArtwork(state), [state]);

  const canUndo = pastRef.current.length > 0;
  const canRedo = futureRef.current.length > 0;

  return {
    state,
    setState,
    setField,
    setFieldsPatch,
    resetToDefaults,
    resetToEmpty,
    resetActiveArtboard,
    isActiveArtboardModified,
    undo,
    redo,
    canUndo,
    canRedo,
    colors,
    serializable,
    addArtboardWithPatch,
    removeArtboard,
    reorderArtboards,
    updateArtboardPosition,
    setActiveArtboardId,
    applyBackgroundImageToAllArtboards,
    copyContentToAllArtboards,
  };
}
