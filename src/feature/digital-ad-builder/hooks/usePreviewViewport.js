"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { AD_SIZE_PRESET_MAP } from "../adSizePresets";
import { isSpacePanBlockedTarget } from "../lib/keyboardPan";
import { normalizeWheelDeltaY } from "../lib/wheel";
import {
  PREVIEW_ZOOM_MIN,
  PREVIEW_ZOOM_MAX,
  PREVIEW_WHEEL_ZOOM_SENSITIVITY,
} from "../lib/previewConstants";

/** Wheel zoom uses `selectedSizeId` preset. Pan/zoom are not auto-reset (use Fit to Screen). */
export default function usePreviewViewport(selectedSizeId) {
  const [previewZoom, setPreviewZoom] = useState(1);
  // Pan is kept as a ref during active dragging and only committed to state on pointer-up.
  // This avoids re-rendering the entire tree on every pointermove event.
  const [previewPan, setPreviewPan] = useState({ x: 0, y: 0 });
  const previewPanRef = useRef({ x: 0, y: 0 });
  const panTargetRef = useRef(null); // DOM node to apply live transform to
  const [spacePanHeld, setSpacePanHeld] = useState(false);
  const [panDraggingUi, setPanDraggingUi] = useState(false);
  const panDragRef = useRef({ active: false, lastX: 0, lastY: 0 });
  const selectedSizeIdForWheelRef = useRef(selectedSizeId);
  selectedSizeIdForWheelRef.current = selectedSizeId;

  const bindPreviewWheelRef = useCallback((node) => {
    if (!node) return;
    const onWheel = (e) => {
      const preset = AD_SIZE_PRESET_MAP[selectedSizeIdForWheelRef.current];
      if (!preset) return;
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      e.stopPropagation();
      const dy = normalizeWheelDeltaY(e);
      const factor = Math.exp(-dy * PREVIEW_WHEEL_ZOOM_SENSITIVITY);
      setPreviewZoom((z) => {
        const next = z * factor;
        return Math.max(PREVIEW_ZOOM_MIN, Math.min(PREVIEW_ZOOM_MAX, next));
      });
    };
    node.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => {
      node.removeEventListener("wheel", onWheel, { capture: true });
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code !== "Space" && e.key !== " ") return;
      if (e.repeat) return;
      if (isSpacePanBlockedTarget(e.target)) return;
      e.preventDefault();
      setSpacePanHeld(true);
    };
    const onKeyUp = (e) => {
      if (e.code !== "Space" && e.key !== " ") return;
      setSpacePanHeld(false);
    };
    const onWindowBlur = () => {
      setSpacePanHeld(false);
    };
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp, true);
    window.addEventListener("blur", onWindowBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("keyup", onKeyUp, true);
      window.removeEventListener("blur", onWindowBlur);
    };
  }, []);

  useEffect(() => {
    if (!spacePanHeld) {
      panDragRef.current.active = false;
      setPanDraggingUi(false);
    }
  }, [spacePanHeld]);

  const onPreviewPointerDown = useCallback(
    (e) => {
      if (!spacePanHeld || e.button !== 0) return;
      e.preventDefault();
      panDragRef.current = { active: true, lastX: e.clientX, lastY: e.clientY };
      setPanDraggingUi(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    },
    [spacePanHeld],
  );

  const onPreviewPointerMove = useCallback(
    (e) => {
      if (!spacePanHeld || !panDragRef.current.active) return;
      const dx = e.clientX - panDragRef.current.lastX;
      const dy = e.clientY - panDragRef.current.lastY;
      panDragRef.current.lastX = e.clientX;
      panDragRef.current.lastY = e.clientY;
      // Update ref immediately — no React re-render during drag.
      previewPanRef.current = {
        x: previewPanRef.current.x + dx,
        y: previewPanRef.current.y + dy,
      };
      // Apply transform directly to the canvas DOM node to avoid re-rendering.
      if (panTargetRef.current) {
        const { x, y } = previewPanRef.current;
        panTargetRef.current.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      }
    },
    [spacePanHeld],
  );

  const onPreviewPointerUp = useCallback((e) => {
    if (panDragRef.current.active) {
      panDragRef.current.active = false;
      setPanDraggingUi(false);
      // Commit the final pan position to React state only once, on release.
      setPreviewPan({ ...previewPanRef.current });
    }
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore if not captured */
    }
  }, []);

  const resetViewport = useCallback(() => {
    previewPanRef.current = { x: 0, y: 0 };
    setPreviewZoom(1);
    setPreviewPan({ x: 0, y: 0 });
  }, []);

  return {
    previewZoom,
    setPreviewZoom,
    previewPan,
    setPreviewPan,
    spacePanHeld,
    panDraggingUi,
    panTargetRef,
    bindPreviewWheelRef,
    onPreviewPointerDown,
    onPreviewPointerMove,
    onPreviewPointerUp,
    resetViewport,
  };
}
