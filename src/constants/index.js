"use client";
import { Chip } from "@mui/material";
import { useTheme } from "@mui/material";
import { CheckCircle, XCircle } from "phosphor-react";

const isDev = process.env.NEXT_PUBLIC_APP_ENV === "dev";

export const SingleComponentTabs = [
  "Overview",
  "Specification",
  "Usage",
  "Guidelines",
  "Accessibility",
  ...(isDev ? ["Code Examples"] : []),
];

export const AccessibilityTabs = [
  "Overview",
  "Principles",
  "Foundation",
  "Testing & Tools",
];

export const DesignPhilosophyTabs = [
  "Purpose",
  "Core Principles",
  "Approach",
  "How to use",
];

export const ForDesignersTabs = [
  "Token System",
  "Getting Started in Figma",
  "Customising Tokens for your Brand",
  "Responsive Behaviour & Accessibility",
];

export const AccessibilityPalletteTabs = [
  "Primary",
  "Neutrals",
  "Semantics",
  "Accessible Combinations",
];

export const MCP_BETA_ACCESS_FORM_URL =
  "https://forms.office.com/Pages/ResponsePage.aspx?id=qUe8sbziIEK9tXJEeZ9eSUP2WmORn95Cs7mbHtrjEb1UNEg2UTY3MDAyMkkyVlFXQ1NSTUpBWkVSVS4u";

/**
 * Returns a Chip component with the specified variant, using the correct colors
 * for the current theme mode.
 *
 * @param {Object} obj - The variant of the chip, either "Do" or "Dont"
 * @param {"Do" | "Dont"} obj.variant - The variant of the chip, either "Do" or "Dont"
 * @returns {Chip} The Chip component
 */
export const CustomChip = ({ variant, label = "", sx = {} }) => {
  const theme = useTheme();
  const mode = theme.palette.mode;

  const chipColors = {
    default: {
      light: {
        color: "text.body",
        bgcolor: "#EEF1F1",
      },
      dark: {
        color: "text.body",
        bgcolor: "#636970",
      },
    },
  };

  switch (variant) {
    case "Do":
      return (
        <Chip
          icon={
            <CheckCircle
              size={24}
              color={theme.palette.success.main}
              stroke="bold"
            />
          }
          label="Do"
          sx={{
            padding: "4px 16px",
            width: "100px",
            color: "success.main",
            bgcolor: "success.background",
            "& .MuiChip-label": {
              color: "success.main",
            },
            fontSize: "16px",
            lineHeight: "24px",
            fontWeight: 500,
            borderRadius: "120px",
            height: "36px",
            width: "fit-content",
          }}
        />
      );
    case "Dont":
      return (
        <Chip
          icon={
            <XCircle size={24} color={theme.palette.error.main} stroke="bold" />
          }
          label="Don't"
          sx={{
            padding: "4px 16px",
            width: "100px",
            color: "error.main",
            bgcolor: "error.background",
            "& .MuiChip-label": {
              color: "error.main",
              display: "flex",
            },
            fontSize: "16px",
            lineHeight: "24px",
            fontWeight: 500,
            borderRadius: "120px",
            height: "36px",
            width: "fit-content",
          }}
        />
      );
    case "default":
      return (
        <Chip
          label={label}
          sx={{
            padding: 1,
            minWidth: "100px",
            color: chipColors.default[mode].color,
            bgcolor: chipColors.default[mode].bgcolor,
            ...sx,
          }}
        />
      );

    case "info":
      return (
        <Chip
          label={label}
          sx={{
            padding: 1,
            minWidth: "100px",
            color: "info.main",
            bgcolor: "info.background",
            ...sx,
          }}
        />
      );
  }
};
