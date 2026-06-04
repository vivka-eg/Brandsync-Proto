"use client";
import { getRecentDownloads } from "@/api/download-tracking";
import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 10;

/**
 * Fetches the authenticated user's recent downloads with load-more pagination.
 * Initial load fetches the first page. Call `loadMore` to append the next page.
 *
 * @param {{ assetType?: 'logo'|'icon'|'digital_asset' }} [params]
 */
export default function useRecentDownloads(params = {}) {
  const [downloads, setDownloads] = useState([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const offsetRef = useRef(0);

  // Initial fetch — resets state when assetType filter changes
  useEffect(() => {
    let cancelled = false;

    const fetchFirst = async () => {
      offsetRef.current = 0;
      setLoading(true);
      setError(null);
      setDownloads([]);
      try {
        const result = await getRecentDownloads({
          limit: PAGE_SIZE,
          offset: 0,
          ...(params.assetType ? { assetType: params.assetType } : {}),
        });
        if (!cancelled) {
          setDownloads(result.data);
          setTotal(result.total);
          setHasMore(result.hasMore);
          offsetRef.current = result.data.length;
        }
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchFirst();

    return () => {
      cancelled = true;
    };
  }, [params.assetType]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const result = await getRecentDownloads({
        limit: PAGE_SIZE,
        offset: offsetRef.current,
        ...(params.assetType ? { assetType: params.assetType } : {}),
      });
      setDownloads((prev) => [...prev, ...result.data]);
      setTotal(result.total);
      setHasMore(result.hasMore);
      offsetRef.current += result.data.length;
    } catch (err) {
      setError(err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, params.assetType]);

  return { downloads, total, hasMore, loading, loadingMore, loadMore, error };
}
