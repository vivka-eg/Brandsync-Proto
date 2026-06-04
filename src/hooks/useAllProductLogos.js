"use client";
import { getProductLogos, getProductLogoById } from "@/api/design-system/product-logos";
import { useEffect, useState, useCallback } from "react";

/**
 * Fetches all product logos (up to 100) and manages selection with full detail loading.
 * Used by the App Icon Generator — avoids pagination so all logos are always visible.
 */
function useAllProductLogos({ initialLogoId } = {}) {
  const [logos, setLogos] = useState([]);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [logoDetailsById, setLogoDetailsById] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    async function fetchAll() {
      setIsLoading(true);
      try {
        const { data } = await getProductLogos({ page: 1, pageSize: 100 });
        setLogos(data);
        if (data.length > 0) {
          const targetId = initialLogoId
            ? data.find((l) => l.id?.toString() === initialLogoId.toString())?.id ?? data[0].id
            : data[0].id;
          setIsDetailLoading(true);
          const details = await getProductLogoById(targetId);
          setLogoDetailsById((prev) => ({ ...prev, [targetId]: details }));
          setSelectedLogo(details);
          setIsDetailLoading(false);
        }
      } catch (err) {
        const msg = err?.message || "Failed to fetch";
        if (!/fetch failed|ECONNREFUSED|ENOTFOUND|network|Failed to fetch/i.test(msg)) {
          console.error("useAllProductLogos error:", err);
        }
        setFetchError(msg);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLogoDetails = useCallback(async (logoOrId) => {
    const logoId = typeof logoOrId === "object" ? logoOrId?.id : logoOrId;
    if (!logoId) return null;
    if (logoDetailsById[logoId]) return logoDetailsById[logoId];
    const details = await getProductLogoById(logoId);
    setLogoDetailsById((prev) => ({ ...prev, [logoId]: details }));
    return details;
  }, [logoDetailsById]);

  const selectLogo = useCallback(async (logo) => {
    if (!logo) {
      setSelectedLogo(null);
      return;
    }
    setIsDetailLoading(true);
    try {
      const details = await getLogoDetails(logo);
      setSelectedLogo(details);
    } catch (err) {
      console.error("selectLogo error:", err);
    } finally {
      setIsDetailLoading(false);
    }
  }, [getLogoDetails]);

  return { logos, selectedLogo, logoDetailsById, getLogoDetails, isLoading, isDetailLoading, selectLogo, fetchError };
}

export default useAllProductLogos;
