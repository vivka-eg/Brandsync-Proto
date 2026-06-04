"use client";

import { getIcons } from "@/api/icons/icons";
import { useHomePageContext } from "../context/HomePageContext";
import { useIconTypesAndCategoryContext } from "@/context/digital-assets/IconTypesAndCategoryContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PAGE_SIZE = 100;

// Module-level cache: baseParams key → full mapped array (populated across pages)
const iconsCache = new Map();

export function clearIconsCache() {
  iconsCache.clear();
}

function getCacheKey(params) {
  // Sort arrays so ["A","B"] and ["B","A"] produce the same key
  const stable = JSON.parse(JSON.stringify(params));
  if (stable.filters?.icon_category?.id?.$in) {
    stable.filters.icon_category.id.$in = [...stable.filters.icon_category.id.$in].sort();
  }
  if (stable.filters?.icon_type?.id?.$in) {
    stable.filters.icon_type.id.$in = [...stable.filters.icon_type.id.$in].sort();
  }
  return JSON.stringify(stable);
}

function mapIcon(icon) {
  return {
    id: icon.documentId,
    name: icon.icon_name,
    type: icon.icon_type?.type_name ?? "",
    typeId: icon.icon_type?.documentId ?? null,
    categories: (icon.icon_category ?? []).map((cat) => ({
      id: cat.documentId,
      name: cat.category_name,
    })),
    tags: (icon.icon_tags ?? []).map((tag) => ({
      id: tag.documentId,
      name: tag.tag_name,
    })),
    downloads: icon.downloads,
    uploadDate: new Date(icon.createdAt).toLocaleDateString(),
    uploadTimestamp: new Date(icon.createdAt).getTime(),
    status: icon.status,
    svg_content: icon.icon_content,
  };
}

function buildBaseParams({ categories, styles, debouncedSearch, allCats, allTypes }) {
  const isSearchActive = debouncedSearch.trim().length > 0;

  if (isSearchActive) {
    return {
      filters: { icon_name: { $containsi: debouncedSearch.trim() } },
      populate: "*",
    };
  }

  const selectedCategoryIds = categories
    .map((name) => allCats.find((c) => c.name === name)?.numericId)
    .filter((id) => id != null);

  const selectedTypeIds = styles
    .map((name) => allTypes.find((t) => t.name === name)?.numericId)
    .filter((id) => id != null);

  const filters = {};
  if (selectedCategoryIds.length > 0) {
    filters.icon_category = { id: { $in: selectedCategoryIds } };
  }
  if (selectedTypeIds.length > 0) {
    filters.icon_type = { id: { $in: selectedTypeIds } };
  }

  return {
    populate: "*",
    ...(Object.keys(filters).length > 0 && { filters }),
  };
}

function applyClientFilters(icons, { categories, isSearchActive }) {
  if (isSearchActive && categories.length > 0) {
    return icons.filter((ic) =>
      ic.categories.some((c) => categories.includes(c.name))
    );
  }
  return icons;
}

function useHomePageIcons() {
  const { categories, styles, debouncedSearch, sortOrder } = useHomePageContext();
  const { categories: allCategories, iconTypes } = useIconTypesAndCategoryContext();

  // Keep refs so async callbacks always read the latest values
  const allCategoriesRef = useRef(allCategories);
  const iconTypesRef = useRef(iconTypes);
  allCategoriesRef.current = allCategories;
  iconTypesRef.current = iconTypes;

  const [icons, setIcons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(null);

  // Tracks which page we've fetched up to for the current filter set
  const pageRef = useRef(0);
  const pageCountRef = useRef(1);
  const fetchingRef = useRef(false);
  const generationRef = useRef(0);
  const baseParamsRef = useRef(null);

  // Reset everything when filters change, then kick off page 1
  useEffect(() => {
    const gen = ++generationRef.current;
    fetchingRef.current = false;
    pageRef.current = 0;
    pageCountRef.current = 1;

    setIcons([]);
    setLoading(true);
    setLoadingMore(false);
    setHasMore(false);
    setTotal(null);

    const baseParams = buildBaseParams({
      categories,
      styles,
      debouncedSearch,
      allCats: allCategoriesRef.current,
      allTypes: iconTypesRef.current,
    });
    baseParamsRef.current = baseParams;

    const cacheKey = getCacheKey(baseParams);

    if (iconsCache.has(cacheKey)) {
      if (gen !== generationRef.current) return;
      const cached = iconsCache.get(cacheKey);
      const filtered = applyClientFilters(cached, {
        categories,
        isSearchActive: debouncedSearch.trim().length > 0,
      });
      setIcons(filtered);
      setTotal(cached.length);
      setLoading(false);
      setHasMore(false); // full set already in cache
      return;
    }

    // Fetch page 1
    fetchingRef.current = true;
    getIcons({ ...baseParams, pagination: { page: 1, pageSize: PAGE_SIZE } })
      .then((res) => {
        if (gen !== generationRef.current) return;
        const pageCount = res?.meta?.pagination?.pageCount ?? 1;
        const totalCount = res?.meta?.pagination?.total ?? null;
        pageCountRef.current = pageCount;
        pageRef.current = 1;
        setTotal(totalCount);

        const mapped = (res.data ?? []).map(mapIcon);
        const filtered = applyClientFilters(mapped, {
          categories,
          isSearchActive: debouncedSearch.trim().length > 0,
        });

        // If everything fits in one page, cache it now
        if (pageCount <= 1) {
          iconsCache.set(cacheKey, mapped);
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setIcons(filtered);
        setLoading(false);
        fetchingRef.current = false;
      })
      .catch(() => {
        if (gen !== generationRef.current) return;
        setLoading(false);
        fetchingRef.current = false;
      });
  }, [categories, styles, debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Called by the grid when the user is near the bottom
  const loadMore = useCallback(() => {
    if (fetchingRef.current) return;
    if (pageRef.current >= pageCountRef.current) return;

    const gen = generationRef.current;
    const baseParams = baseParamsRef.current;
    if (!baseParams) return;

    const nextPage = pageRef.current + 1;
    fetchingRef.current = true;
    setLoadingMore(true);

    getIcons({ ...baseParams, pagination: { page: nextPage, pageSize: PAGE_SIZE } })
      .then((res) => {
        if (gen !== generationRef.current) return;
        pageRef.current = nextPage;

        const mapped = (res.data ?? []).map(mapIcon);
        const isSearchActive = debouncedSearch.trim().length > 0;

        setIcons((prev) => {
          const seen = new Set(prev.map((i) => i.id));
          const newOnes = mapped.filter((i) => !seen.has(i.id));

          const filtered = applyClientFilters(newOnes, {
            categories,
            isSearchActive,
          });

          const next = [...prev, ...filtered];

          // Once all pages loaded, cache the full unfiltered set
          if (nextPage >= pageCountRef.current) {
            const cacheKey = getCacheKey(baseParams);
            // Rebuild full unfiltered list — we don't have it handy so skip caching here;
            // the cache is only populated on single-page results or future navigations.
            iconsCache.set(cacheKey, next);
            setHasMore(false);
          }

          return next;
        });

        setLoadingMore(false);
        fetchingRef.current = false;
      })
      .catch(() => {
        if (gen !== generationRef.current) return;
        setLoadingMore(false);
        fetchingRef.current = false;
      });
  }, [categories, debouncedSearch]);

  const sortedIcons = useMemo(() => {
    const sorted = [...icons];
    switch (sortOrder) {
      case "za":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "downloads":
        sorted.sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0));
        break;
      case "newest":
        sorted.sort((a, b) => (b.uploadTimestamp ?? 0) - (a.uploadTimestamp ?? 0));
        break;
      case "az":
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return sorted;
  }, [icons, sortOrder]);

  return {
    icons,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    filteredIcons: sortedIcons,
    total,
  };
}

export default useHomePageIcons;
