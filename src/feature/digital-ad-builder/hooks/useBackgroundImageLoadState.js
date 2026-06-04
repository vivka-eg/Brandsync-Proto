"use client";

import { useState, useEffect } from "react";
import { proxyImageUrl } from "../lib/proxyImageUrl";

export default function useBackgroundImageLoadState(backgroundImageUrl) {
  const [bgImageLoading, setBgImageLoading] = useState(false);

  useEffect(() => {
    if (!backgroundImageUrl) {
      setBgImageLoading(false);
      return;
    }
    setBgImageLoading(true);
    const src = proxyImageUrl(backgroundImageUrl);
    const img = new Image();
    let cancelled = false;
    img.onload = () => {
      if (!cancelled) setBgImageLoading(false);
    };
    img.onerror = () => {
      if (!cancelled) setBgImageLoading(false);
    };
    if (src) img.src = src;
    return () => {
      cancelled = true;
    };
  }, [backgroundImageUrl]);

  return bgImageLoading;
}
