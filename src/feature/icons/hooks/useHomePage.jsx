"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

function useHomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Hydrate initial state from URL on first mount (lazy initialisers)
  const [categories, setCategories] = useState(() =>
    searchParams.get("categories")?.split(",").filter(Boolean) ?? []
  );
  const [styles, setStyles] = useState(() =>
    searchParams.get("styles")?.split(",").filter(Boolean) ?? []
  );
  const [searchValue, setSearchValue] = useState(() =>
    searchParams.get("search") ?? ""
  );
  const [debouncedSearch, setDebouncedSearch] = useState(() =>
    searchParams.get("search") ?? ""
  );
  const [isSearching, setIsSearching] = useState(false);

  // Grid density — compact / comfortable / spacious (not URL-persisted, cosmetic pref)
  const [density, setDensity] = useState("comfortable");

  // Colour preview — null means use the default theme colour (not URL-persisted)
  const [previewColour, setPreviewColour] = useState(null);

  // Sort order — "az" | "za" | "downloads" | "newest"
  const [sortOrder, setSortOrder] = useState(() =>
    searchParams.get("sort") ?? "az"
  );

  // Bulk selection — lives here so the page header can read it
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [lastSelectedIndex, setLastSelectedIndex] = useState(null);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setLastSelectedIndex(null);
  }, []);

  // Refs for bulk action handlers registered by Icons (avoids prop drilling filtered icons up)
  const copyAllRef = useRef(null);
  const downloadZipRef = useRef(null);

  // Ref to the scrollable column — shared so Icons can use it for the virtualizer
  const scrollContainerRef = useRef(null);

  // Debounce search input → debouncedSearch drives API calls
  useEffect(() => {
    if (!searchValue.trim()) {
      setIsSearching(false);
      setDebouncedSearch("");
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Write filter state to URL whenever it changes (debounced to avoid history spam)
  // One-directional only: state → URL. URL hydrates state at mount only.
  const urlWriteTimerRef = useRef(null);
  useEffect(() => {
    clearTimeout(urlWriteTimerRef.current);
    urlWriteTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (categories.length > 0) params.set("categories", categories.join(","));
      if (styles.length > 0) params.set("styles", styles.join(","));
      if (sortOrder !== "az") params.set("sort", sortOrder);

      const query = params.toString();
      router.replace(pathname + (query ? `?${query}` : ""), { scroll: false });
    }, 400);

    return () => clearTimeout(urlWriteTimerRef.current);
  }, [debouncedSearch, categories, styles, sortOrder, pathname, router]);

  return {
    categories,
    setCategories,
    styles,
    setStyles,
    searchValue,
    setSearchValue,
    debouncedSearch,
    isSearching,
    density,
    setDensity,
    previewColour,
    setPreviewColour,
    sortOrder,
    setSortOrder,
    selectedIds,
    setSelectedIds,
    lastSelectedIndex,
    setLastSelectedIndex,
    clearSelection,
    copyAllRef,
    downloadZipRef,
    scrollContainerRef,
  };
}

export default useHomePage;
