import { useState, useEffect } from "react";
import { fetchColorPalette } from "@/api/design-system/color-palette";

/**
 * Custom hook to manage color preview logic
 * Handles fetching color palettes, computing preview colors, and loading states
 */
export function useColorPreview(selectedLogo, selectedColorTab) {
  const [paletteData, setPaletteData] = useState(null);
  const [isLoadingColors, setIsLoadingColors] = useState(false);

  // Fetch palette data when selected logo changes
  useEffect(() => {
    if (selectedLogo?.colorPalette) {
      setIsLoadingColors(true);
      // console.log("Fetching palette for:", selectedLogo.colorPalette);

      // Add a delay to show the elegant shimmer effect
      setTimeout(() => {
        fetchColorPalette(selectedLogo.colorPalette)
          .then((data) => {
            // console.log("Palette data received:", data);
            setPaletteData(data);
            setIsLoadingColors(false);
          })
          .catch((error) => {
            console.error("Error fetching palette data:", error);
            setIsLoadingColors(false);
          });
      }, 400);
    }
  }, [selectedLogo]);

  // Show loading state when color tab changes
  useEffect(() => {
    if (paletteData) {
      setIsLoadingColors(true);
      const timer = setTimeout(() => {
        setIsLoadingColors(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedColorTab, paletteData]);

  // Get colors for preview backgrounds based on selected tab
  const getPreviewColors = () => {
    if (!paletteData) return ["#E6F4F4", "#4DBBBB", "#003D3D"];

    if (selectedColorTab === "brand") {
      const primary = paletteData.primarySection || [];

      // Get light, medium, and dark shades from the brand colors
      // Most palettes have ~11-13 colors, indexed from 0 (darkest) to end (lightest)
      const lightShade =
        primary[10]?.color ||
        primary[9]?.color ||
        primary[primary.length - 1]?.color ||
        "#E6F4F4";
      const mediumShade =
        primary[6]?.color ||
        primary[5]?.color ||
        primary[Math.floor(primary.length / 2)]?.color ||
        "#4DBBBB";
      const darkShade =
        primary[2]?.color ||
        primary[1]?.color ||
        primary[0]?.color ||
        "#003D3D";

      return [lightShade, mediumShade, darkShade];
    } else {
      const neutral = paletteData.neutralSection || [];
      // Get light, medium, and dark neutral colors
      const lightNeutral = neutral[1]?.color || "#F9FAFB";
      const mediumNeutral = neutral[4]?.color || "#D1D5DB";
      const darkNeutral = neutral[7]?.color || "#374151";
      return [lightNeutral, mediumNeutral, darkNeutral];
    }
  };

  const previewColors = getPreviewColors();
  const defaultMainPreviewColor =
    selectedColorTab === "brand"
      ? paletteData?.primarySection?.[6]?.color ||
        paletteData?.primarySection?.[5]?.color ||
        "#4DBBBB"
      : paletteData?.neutralSection?.[7]?.color || "#374151";

  return {
    paletteData,
    isLoadingColors,
    previewColors,
    defaultMainPreviewColor,
  };
}
