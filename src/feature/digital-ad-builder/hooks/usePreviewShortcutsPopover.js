"use client";

import { useCallback, useState } from "react";

export default function usePreviewShortcutsPopover() {
  const [previewShortcutsAnchor, setPreviewShortcutsAnchor] = useState(null);

  const openPreviewShortcuts = useCallback((e) => {
    setPreviewShortcutsAnchor(e.currentTarget);
  }, []);

  const closePreviewShortcuts = useCallback(() => {
    setPreviewShortcutsAnchor(null);
  }, []);

  const togglePreviewShortcuts = useCallback((e) => {
    setPreviewShortcutsAnchor((prev) => (prev ? null : e.currentTarget));
  }, []);

  return {
    previewShortcutsAnchor,
    setPreviewShortcutsAnchor,
    openPreviewShortcuts,
    closePreviewShortcuts,
    togglePreviewShortcuts,
  };
}
