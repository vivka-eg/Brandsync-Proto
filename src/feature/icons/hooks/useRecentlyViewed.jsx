"use client";
import { useState, useEffect, useCallback } from "react";
import { getObjectURLFromSVG } from "@/utils/assets";

const STORAGE_KEY = "bs_recently_viewed_icons";
const MAX_ITEMS = 12;

function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Hydrate from localStorage on mount — regenerate object URLs
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const restored = parsed.map((icon) => ({
          ...icon,
          icon: getObjectURLFromSVG(icon.svg_content),
        }));
        setRecentlyViewed(restored);
      }
    } catch {
      // Silently ignore parse / storage errors
    }
  }, []);

  const addRecentlyViewed = useCallback((icon) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((i) => i.id !== icon.id);
      const updated = [icon, ...filtered].slice(0, MAX_ITEMS);
      try {
        // Exclude the object URL — it doesn't survive across sessions
        const storable = updated.map(({ icon: _objectUrl, ...rest }) => rest);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storable));
      } catch {
        // Ignore quota / security errors
      }
      return updated;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return { recentlyViewed, addRecentlyViewed, clearRecentlyViewed };
}

export default useRecentlyViewed;
