"use client";
import { getDownloadActivity } from "@/api/download-tracking";
import { useEffect, useState } from "react";

const DEFAULT_BREAKDOWN = { logo: 0, icon: 0, digital_asset: 0 };

/**
 * Fetches the authenticated user's total download count and per-type breakdown.
 *
 * @param {{ from?: string, to?: string }} [params]
 */
export default function useDownloadActivity(params = {}) {
  const [data, setData] = useState({ total: 0, breakdown: DEFAULT_BREAKDOWN });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getDownloadActivity(params);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();

    return () => {
      cancelled = true;
    };
  }, [params.from, params.to]);

  return { ...data, loading, error };
}
