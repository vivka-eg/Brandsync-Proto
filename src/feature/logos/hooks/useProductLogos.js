"use client";
import {
  getProductLogos,
  getProductLogoById,
} from "@/api/design-system/product-logos";
import { useEffect, useState, useCallback, useRef } from "react";

function useProductLogos({ initialLogoId } = {}) {
  const isFirstRender = useRef(true);
  const [productLogos, setProductLogos] = useState([]);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSidebarLoading, setIsSidebarLoading] = useState(false);
  const [isLogoDetailsLoading, setIsLogoDetailsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [fetchError, setFetchError] = useState(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      // Reset to first page when search changes
      if (searchQuery !== debouncedSearchQuery) {
        setCurrentPage(1);
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch paginated logos for sidebar
  const fetchLogos = useCallback(
    async (page, isInitial = false, search = "") => {
      if (isInitial) {
        setIsInitialLoading(true);
      } else {
        setIsSidebarLoading(true);
      }
      setCurrentPage(page);
      try {
        const { data: logos, totalCount } = await getProductLogos({
          page,
          pageSize: 100,
          search,
        });
        setFetchError(null);
        setProductLogos(logos);
        setTotalPages(Math.ceil(totalCount / 100));
        if (logos.length > 0 && !selectedLogo) {
          // Restore the logo from the URL on initial load, otherwise default to first
          const targetId = isInitial && initialLogoId ? initialLogoId : logos[0].id;
          setIsLogoDetailsLoading(true);
          const logoDetails = await getProductLogoById(targetId);
          setSelectedLogo(logoDetails);
          setIsLogoDetailsLoading(false);
        }
        if (isInitial) {
          setIsInitialLoading(false);
        } else {
          setIsSidebarLoading(false);
        }
      } catch (error) {
        const msg = error?.message || "Failed to fetch";
        // Only log unexpected errors; VPN/network errors are handled in the UI
        if (!/fetch failed|ECONNREFUSED|ENOTFOUND|network|Failed to fetch/i.test(msg)) {
          console.error("Error fetching product logos:", error);
        }
        setFetchError(msg);
        setIsInitialLoading(false);
        setIsSidebarLoading(false);
      }
    },
    [selectedLogo, initialLogoId]
  );

  // Fetch individual logo details when clicked
  const fetchLogoDetails = useCallback(async (logoId) => {
    setIsLogoDetailsLoading(true);
    try {
      const logoDetails = await getProductLogoById(logoId);
      setSelectedLogo(logoDetails);
      setIsLogoDetailsLoading(false);
    } catch (error) {
      console.error("Error fetching logo details:", error);
      setIsLogoDetailsLoading(false);
    }
  }, []);

  // Fetch logos when debounced search changes (skip on first render; initial fetch handles that)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchLogos(1, false, debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  // Initial fetch on mount
  useEffect(() => {
    fetchLogos(1, true, "");
  }, []);

  // Sync selectedLogo with the URL param.
  // Handles the Next.js router cache case: navigating back can restore a stale
  // selectedLogo (e.g. the default logo[0]) while the URL already has ?logo=X.
  // When the IDs don't match and nothing is loading, fetch the correct logo.
  useEffect(() => {
    if (!initialLogoId || isInitialLoading || isLogoDetailsLoading) return;
    if (selectedLogo?.id?.toString() === initialLogoId.toString()) return;
    fetchLogoDetails(initialLogoId);
  }, [initialLogoId, selectedLogo, isInitialLoading, isLogoDetailsLoading]);

  return {
    productLogos,
    selectedLogo,
    isInitialLoading,
    isSidebarLoading,
    isLogoDetailsLoading,
    currentPage,
    searchQuery,
    debouncedSearchQuery,
    setSearchQuery,
    fetchLogos,
    fetchLogoDetails,
    totalPages,
    fetchError,
  };
}

export default useProductLogos;
