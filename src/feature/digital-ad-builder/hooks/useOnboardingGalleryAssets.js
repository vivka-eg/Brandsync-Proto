"use client";

import { useState, useEffect } from "react";

/**
 * Loads a few WebP thumbnails from the digital-assets gallery for onboarding (portrait + landscape).
 */
export default function useOnboardingGalleryAssets(enabled) {
  const [portrait, setPortrait] = useState([]);
  const [landscape, setLandscape] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return undefined;

    let cancelled = false;
    setLoading(true);

    async function load() {
      try {
        const [pRes, lRes] = await Promise.all([
          fetch("/api/digital-assets?page=1&pageSize=20&orientation=portrait"),
          fetch("/api/digital-assets?page=1&pageSize=20&orientation=landscape"),
        ]);
        const pJson = await pRes.json().catch(() => ({}));
        const lJson = await lRes.json().catch(() => ({}));
        if (cancelled) return;

        const pItems = (pJson.success && Array.isArray(pJson.data) ? pJson.data : [])
          .filter((a) => a?.thumbnail)
          .slice(0, 2);
        const lItems = (lJson.success && Array.isArray(lJson.data) ? lJson.data : [])
          .filter((a) => a?.thumbnail)
          .slice(0, 2);

        setPortrait(pItems);
        setLandscape(lItems);
      } catch {
        if (!cancelled) {
          setPortrait([]);
          setLandscape([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { portrait, landscape, loading };
}
