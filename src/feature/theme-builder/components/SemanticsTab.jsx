"use client";
import { Box, Typography } from "@mui/material";
import PaletteRow from "./PaletteRow";
import semanticColors from "brandsync-tokens/accessibility.json";
import {
  SuccessComponentPreview,
  ErrorComponentPreview,
  WarningComponentPreview,
  InformationComponentPreview,
  NeutralsComponentPreview,
} from "./SemanticComponentPreviews";
import { useState } from "react";
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";

const SemanticSection = ({ semanticData, onColorClick }) => {
  const { label, colors, description, PreviewComponent } = semanticData;
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Box sx={{ mb: 6 }}>
      <PaletteRow
        label={label}
        colors={colors}
        onColorClick={onColorClick}
        description={description}
      />
      <Box
        sx={{
          mt: 3,
          backgroundColor: "#FBFBFB",
          borderRadius: "8px",
          display: "flex",
          gap: "8px",
          flexDirection: "column",
        }}
      >
        <Box
          role="button"
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? "Collapse" : "Expand"} component preview`}
          tabIndex={0}
          sx={{
            py: "12px",
            px: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setIsExpanded(!isExpanded); } }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "text.body",
              // textTransform: "uppercase",
              fontSize: "1rem",
              // letterSpacing: "0.1em",
            }}
          >
            Component preview
          </Typography>
          <Box>
            {isExpanded ? (
              <CaretUpIcon size={24} weight="bold" />
            ) : (
              <CaretDownIcon size={24} weight="bold" />
            )}
          </Box>
        </Box>
        {isExpanded && <PreviewComponent />}
      </Box>
    </Box>
  );
};

const SemanticsTab = ({ onColorClick }) => {
  // Reverse arrays to display from lightest to darkest (left to right) as shown in reference
  // Neutrals are already in correct order (50 to 950), so no need to reverse
  const neutralsColors = [
    ...(semanticColors.neutral?.primarySection || []),
  ].reverse();
  const successColors = [
    ...(semanticColors.success?.primarySection || []),
  ].reverse();
  const errorColors = [
    ...(semanticColors.error?.primarySection || []),
  ].reverse();
  const warningColors = [
    ...(semanticColors.warning?.primarySection || []),
  ].reverse();
  const informationColors = [
    ...(semanticColors.information?.primarySection || []),
  ].reverse();

  const semanticPaletteData = [
    {
      label: "Neutrals",
      colors: neutralsColors,
      description:
        "Used for backgrounds, text, borders, and surfaces to create balance and let other colors stand out.",
      PreviewComponent: NeutralsComponentPreview,
    },
    {
      label: "Success",
      colors: successColors,
      description:
        "Used to indicate positive outcomes, confirmations, and completed actions.",
      PreviewComponent: SuccessComponentPreview,
    },
    {
      label: "Error",
      colors: errorColors,
      description:
        "Used to indicate negative outcomes, errors, and failed actions.",
      PreviewComponent: ErrorComponentPreview,
    },
    {
      label: "Warning",
      colors: warningColors,
      description: "Used to indicate warnings, alerts, and potential issues.",
      PreviewComponent: WarningComponentPreview,
    },
    {
      label: "Information",
      colors: informationColors,
      description:
        "Used to provide additional information, instructions, or context.",
      PreviewComponent: InformationComponentPreview,
    },
  ];

  return (
    <>
      {semanticPaletteData.map((semanticData, index) => (
        <SemanticSection
          key={index}
          semanticData={semanticData}
          onColorClick={onColorClick}
        />
      ))}
    </>
  );
};

export default SemanticsTab;
