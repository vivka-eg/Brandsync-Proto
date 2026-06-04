"use client";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Swap } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import AccessibleCombination from "./AccessibleCombination";
import { useAccessiblePaletteContext } from "@/context/design-system/AccessiblePaletteContext";
import { isColorDark } from "@/utils/design-system/color-palette/luminance";

const SectionHeader = ({ indicatorColor, title, handleSwapColors }) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      sx={{ gap: { xs: 1, sm: "24px" } }}
      alignItems={{ xs: "flex-start", sm: "center" }}
    >
      <Stack direction="row" sx={{ flex: 1, alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            height: "16px",
            width: "16px",
            borderRadius: "4px",
            border: "1px solid",
            borderColor: "neutral.border",
            bgcolor: indicatorColor,
            flexShrink: 0,
          }}
        ></Box>
        <Typography
          fontWeight={700}
          color="text.primary"
          sx={{ fontSize: { xs: "16px", sm: "20px" }, lineHeight: "24px" }}
        >
          {title}
        </Typography>
      </Stack>
      <Button
        sx={{
          padding: "12px 20px 12px 12px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          flexShrink: 0,
        }}
        onClick={handleSwapColors}
      >
        <Swap size={24} /> Swap Colors
      </Button>
    </Stack>
  );
};

function AccessibleCombinationsSection({
  indicatorColor,
  title,
  sectionKey,
  copyBoth,
}) {
  const { paletteData } = useAccessiblePaletteContext();

  const [cardsData, setCardsData] = useState(
    paletteData.accessibleCombinations[sectionKey]
  );
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setCardsData(paletteData.accessibleCombinations[sectionKey]);
    setAnimationKey((prev) => prev + 1);
  }, [paletteData]);

  const handleSwapColors = () => {
    const swappedData = cardsData.map((card) => ({
      ...card,
      name: card.name.split(" on ").reverse().join(" on "),
      color: card.background,
      background: card.color,
      isDarkerColor: isColorDark(card.color),
    }));
    setCardsData(swappedData);
  };

  return (
    <Stack sx={{ gap: 3, width: "100%" }}>
      {/* section header */}
      <SectionHeader
        indicatorColor={indicatorColor}
        title={title}
        handleSwapColors={handleSwapColors}
      />

      {/* combination cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 2,
          width: "100%",
        }}
      >
        {cardsData.map((card, index) => (
          <Box
            key={`${card.name}-${animationKey}`}
            sx={{
              animation: "slideInUp 0.5s ease-out forwards",
              animationDelay: `${index * 0.07}s`,
              opacity: 0,
              "@keyframes slideInUp": {
                "0%": {
                  opacity: 0,
                  transform: "translateY(30px) scale(0.95)",
                },
                "100%": {
                  opacity: 1,
                  transform: "translateY(0) scale(1)",
                },
              },
            }}
          >
            <AccessibleCombination cardData={card} copyBoth={copyBoth} />
          </Box>
        ))}
      </Box>
    </Stack>
  );
}

export default AccessibleCombinationsSection;
