"use client";
import { useAccessiblePaletteContext } from "@/context/design-system/AccessiblePaletteContext";
import { Stack, Typography } from "@mui/material";
import React, { useMemo } from "react";
import AccessibleCombinationsSection from "./accessible-combinations/AccessibleCombinationsSection";

function AccessibleCombinations() {
  const { paletteData } = useAccessiblePaletteContext();
  const sections = useMemo(() => {
    return [
      {
        indicatorColor: "#fff",
        title: "Primary Colors and White",
        sectionKey: "primaryOnWhiteBackground",
      },
      {
        indicatorColor: "#000",
        title: "Primary Colors and Black",
        sectionKey: "primaryOnBlackBackground",
      },
      {
        indicatorColor: paletteData?.primaryColor || "#000",
        title: "Primary Color Text on Primary Color Backgrounds",
        sectionKey: "primaryOnPrimaryBackground",
        copyBoth: true,
      },
    ];
  }, [paletteData]);

  return (
    <Stack sx={{ gap: 4, width: "100%" }}>
      <Stack>
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ mb: 1 }}
          color="text.primary"
        >
          Accessible Combinations
        </Typography>

        <Typography color="text.body">
          Production-ready color pairings that meet or exceed WCAG accessibility
          standards for text and UI elements.
        </Typography>
      </Stack>

      {/* accessible combinations sections */}
      <Stack sx={{ gap: 6, width: "100%" }}>
        {sections.map((section) => (
          <AccessibleCombinationsSection
            {...section}
            key={section.sectionKey}
          />
        ))}
      </Stack>
    </Stack>
  );
}

export default AccessibleCombinations;
