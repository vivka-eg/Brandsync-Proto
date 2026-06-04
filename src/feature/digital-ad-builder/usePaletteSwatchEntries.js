"use client";

import { useMemo } from "react";

/**
 * Shared palette list for background/frosted swatches (logo palettes + extras + current).
 */
export default function usePaletteSwatchEntries(brandPalettes, logos, selectedLogo, state) {
  return useMemo(() => {
    const logoNames = new Set();
    logos.forEach((l) => {
      if (l?.colorPalette) logoNames.add(l.colorPalette);
    });
    (state.extraBrandPaletteNames ?? []).forEach((n) => logoNames.add(n));
    if (state.bgPalette) logoNames.add(state.bgPalette);
    if (state.frostPalette) logoNames.add(state.frostPalette);
    if (selectedLogo?.colorPalette) logoNames.add(selectedLogo.colorPalette);

    let finalEntries = brandPalettes.filter((p) => logoNames.has(p.name));
    if (finalEntries.length === 0) {
      finalEntries = brandPalettes.filter((p) =>
        [state.bgPalette, state.frostPalette].filter(Boolean).includes(p.name),
      );
    }
    if (finalEntries.length === 0 && brandPalettes[0]) {
      finalEntries = [brandPalettes[0]];
    }

    const visibleNames = new Set(finalEntries.map((p) => p.name));
    const addable = brandPalettes.filter((p) => !visibleNames.has(p.name));

    return { paletteEntriesForSwatches: finalEntries, addablePalettes: addable };
  }, [
    brandPalettes,
    logos,
    selectedLogo?.colorPalette,
    state.extraBrandPaletteNames,
    state.bgPalette,
    state.frostPalette,
  ]);
}
