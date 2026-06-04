"use client";

import React, { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Box, useTheme } from "@mui/material";
import AdBuilderInlineTextToolbar from "./AdBuilderInlineTextToolbar";
import AdBuilderLogoFormatToolbar from "./AdBuilderLogoFormatToolbar";
import AdBuilderImageFormatToolbar from "./AdBuilderImageFormatToolbar";

/**
 * Fixed-position toolbar anchored above the focused inline text (viewport coordinates).
 * Recomputes when the preview pans/zooms or typography changes so it stays near the text.
 */
export default function AdBuilderInlineTextToolbarPortal({
  open,
  anchorEl,
  role,
  state,
  setField,
  onOpenStockDialog,
  /** When these change, the anchor rect moves  -  reposition without relying only on scroll/resize. */
  repositionKey,
  prefersReducedMotion = false,
  showMiniPreview = false,
  onToggleMiniPreview,
}) {
  const theme = useTheme();
  const [coords, setCoords] = useState(null);

  useLayoutEffect(() => {
    if (!open || !anchorEl) {
      setCoords(null);
      return;
    }

    const update = () => {
      const r = anchorEl.getBoundingClientRect();
      const margin = 8;
      const w = typeof window !== "undefined" ? window.innerWidth : r.width + r.left * 2;
      const cx = r.left + r.width / 2;
      const left = Math.max(margin, Math.min(w - margin, cx));
      const top = r.top - margin;
      setCoords((prev) => {
        if (prev && prev.left === left && prev.top === top) return prev;
        return { left, top };
      });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(anchorEl);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, anchorEl, repositionKey]);

  if (
    typeof document === "undefined" ||
    !open ||
    !anchorEl ||
    !role ||
    !setField ||
    !coords ||
    (role === "image" && typeof onOpenStockDialog !== "function")
  ) {
    return null;
  }

  return createPortal(
    <Box
      data-ad-inline-format-toolbar
      onMouseDown={(e) => e.preventDefault()}
      sx={{
        position: "fixed",
        left: coords.left,
        top: coords.top,
        transform: "translate(-50%, -100%)",
        zIndex: theme.zIndex.modal + 2,
        pointerEvents: "auto",
        maxWidth: "calc(100vw - 16px)",
      }}
    >
      <Box
        key={role}
        sx={prefersReducedMotion ? undefined : {
          "@keyframes dabToolbarEnter": {
            from: { opacity: 0, transform: "translateY(6px) scale(0.97)" },
            to: { opacity: 1, transform: "translateY(0) scale(1)" },
          },
          animation: "dabToolbarEnter 0.18s cubic-bezier(0.25, 0.46, 0.45, 0.94) both",
        }}
      >
        {role === "logo" ? (
          <AdBuilderLogoFormatToolbar state={state} setField={setField} />
        ) : role === "image" ? (
          <AdBuilderImageFormatToolbar state={state} setField={setField} onOpenStockDialog={onOpenStockDialog} showMiniPreview={showMiniPreview} onToggleMiniPreview={onToggleMiniPreview} />
        ) : (
          <AdBuilderInlineTextToolbar role={role} state={state} setField={setField} anchorEl={anchorEl} />
        )}
      </Box>
    </Box>,
    document.body,
  );
}
