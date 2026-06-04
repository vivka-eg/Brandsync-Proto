"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { getComponentsByCategory } from "@/api/mcp/admin/categories";
import { deleteComponent } from "@/api/mcp/admin/components";
import PatternGrid from "./PatternGrid";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

export default function PatternLibraryPanel({ category, search, sx }) {
  const [patterns, setPatterns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const sentinelRef = useRef(null);
  const debounceRef = useRef(null);
  const currentFetchKey = useRef(null);

  // Reset and fetch first page when category or search changes
  useEffect(() => {
    if (!category?.id) return;

    clearTimeout(debounceRef.current);

    const fetchKey = `${category.id}-${search}`;

    const doFetch = () => {
      currentFetchKey.current = fetchKey;
      setLoading(true);
      setPatterns([]);
      setOffset(0);
      setHasMore(false);

      getComponentsByCategory(category.id, {
        limit: PAGE_SIZE,
        offset: 0,
        search: search.trim() || undefined,
      })
        .then((res) => {
          if (currentFetchKey.current !== fetchKey) return;
          setPatterns(res.data.components ?? []);
          setHasMore(res.data.hasMore ?? false);
          setOffset(PAGE_SIZE);
        })
        .catch(() => {
          if (currentFetchKey.current !== fetchKey) return;
          setPatterns([]);
          setHasMore(false);
        })
        .finally(() => {
          if (currentFetchKey.current !== fetchKey) return;
          setLoading(false);
        });
    };

    if (search.trim()) {
      debounceRef.current = setTimeout(doFetch, SEARCH_DEBOUNCE_MS);
    } else {
      doFetch();
    }

    return () => clearTimeout(debounceRef.current);
  }, [category?.id, search]);

  // Load next page
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore || !category?.id) return;

    setLoadingMore(true);
    getComponentsByCategory(category.id, {
      limit: PAGE_SIZE,
      offset,
      search: search.trim() || undefined,
    })
      .then((res) => {
        setPatterns((prev) => [...prev, ...(res.data.components ?? [])]);
        setHasMore(res.data.hasMore ?? false);
        setOffset((prev) => prev + PAGE_SIZE);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }, [category?.id, search, offset, hasMore, loadingMore]);

  // Sentinel observer triggers loadMore
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) loadMore();
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadMore]);

  async function handleDelete(id) {
    try {
      await deleteComponent(id);
      setPatterns((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete pattern:", err);
    }
  }

  return (
    <Box sx={{ flex: 1, minWidth: 0, ...sx }}>
      {loading ? (
        <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <>
          <PatternGrid patterns={patterns} onDelete={handleDelete} />

          {/* Sentinel for infinite scroll */}
          <Box ref={sentinelRef} sx={{ py: 1 }} />

          {loadingMore && (
            <Box sx={{ py: 2, display: "flex", justifyContent: "center" }}>
              <CircularProgress size={24} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
