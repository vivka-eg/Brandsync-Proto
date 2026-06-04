"use client";

import { useState, useEffect, useCallback } from "react";

/** Bump when onboarding content changes so users see the new experience once. */
const STORAGE_KEY = "brandsync.digitalAdBuilder.onboarding.v2";

export default function useAdBuilderOnboarding() {
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const dismissed = window.localStorage.getItem(STORAGE_KEY);
      setOpen(!dismissed);
    } catch {
      setOpen(true);
    } finally {
      setHydrated(true);
    }
  }, []);

  const dismissPermanent = useCallback(() => {
    setOpen(false);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, "1");
      }
    } catch {
      /* ignore quota / private mode */
    }
  }, []);

  const dismissForNow = useCallback(() => {
    setOpen(false);
  }, []);

  const openHelp = useCallback(() => {
    setOpen(true);
  }, []);

  return {
    open,
    hydrated,
    dismissPermanent,
    dismissForNow,
    openHelp,
  };
}
