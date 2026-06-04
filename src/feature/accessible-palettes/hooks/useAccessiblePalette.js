"use client";
import { fetchColorPalette } from "@/api/design-system/color-palette";
import React, { useEffect, useState, useRef } from "react";

function useAccessiblePalette() {
  const [selectedProductColor, setSelectedProductColor] = useState("purple");
  const [paletteData, setPaletteData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const skipInitialFetch = useRef(false);

  // Check URL on mount - if color param exists, skip initial purple fetch
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const colorParam = params.get("color");
      if (colorParam) {
        console.log("URL has color param, skipping initial purple fetch");
        skipInitialFetch.current = true;
        // Don't set it here - let the component's useLayoutEffect handle it
      }
    }
  }, []);

  useEffect(() => {
    if (!selectedProductColor) {
      console.log("No color selected, skipping fetch");
      return;
    }
    
    // Skip the initial fetch for "purple" if URL has a color param
    if (skipInitialFetch.current && selectedProductColor === "purple") {
      console.log("Skipping initial purple fetch, waiting for URL color");
      skipInitialFetch.current = false; // Reset flag
      return;
    }
    
    console.log("Hook useEffect triggered for color:", selectedProductColor);
    setIsLoading(true);
    setPaletteData(null); // Clear previous data when color changes
    
    const fetchData = async () => {
      try {
        console.log("Fetching palette for:", selectedProductColor);
        const data = await fetchColorPalette(selectedProductColor);
        console.log("Fetched palette data for color:", selectedProductColor, "Data:", data);
        setPaletteData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching palette data:", error);
        setPaletteData(null);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedProductColor]);

  return {
    selectedProductColor,
    setSelectedProductColor,
    paletteData,
    isLoading,
  };
}

export default useAccessiblePalette;
