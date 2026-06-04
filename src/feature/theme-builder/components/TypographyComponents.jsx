"use client";
import { ExpandMore } from "@mui/icons-material";
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from "@mui/material";

// Typography row component
export const TypographyRow = ({ item }) => {
  const getFontSizePreview = (name) => {
    if (name.startsWith("Display")) {
      const num = parseInt(name.split(" ")[1]);
      return { fontSize: Math.max(56 - (num - 1) * 4, 32), fontWeight: 700 };
    }
    if (name.startsWith("h")) {
      const num = parseInt(name.slice(1));
      return { fontSize: Math.max(42 - (num - 1) * 5, 18), fontWeight: 700 };
    }
    if (name.includes("lg"))
      return {
        fontSize: 16,
        fontWeight: name.includes("semibold")
          ? 600
          : name.includes("medium")
            ? 500
            : 400,
      };
    if (name.includes("md"))
      return {
        fontSize: 14,
        fontWeight: name.includes("semibold")
          ? 600
          : name.includes("medium")
            ? 500
            : 400,
      };
    if (name.includes("sm"))
      return {
        fontSize: 12,
        fontWeight: name.includes("semibold")
          ? 600
          : name.includes("medium")
            ? 500
            : 400,
      };
    return { fontSize: 14, fontWeight: 400 };
  };

  const previewStyle = getFontSizePreview(item.name);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        py: 2.5,
        px: 3,
        // borderBottom: "1px solid #E5E7EB",
        "&:last-child": { borderBottom: "none" },
        gap: "16px",
      }}
    >
      {/* Name */}
      <Box sx={{ width: 200, flexShrink: 0 }}>
        <Typography
          sx={{
            fontSize: "20px",
            lineHeight: "24px",
            fontWeight: 700,
            color: "text.primary",
          }}
        >
          {item.name}
        </Typography>
      </Box>

      {/* Details */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "1rem",
            lineHeight: "1.5rem",
            fontWeight: 600,
            color: "text.primary",
            mb: 0.25,
          }}
        >
          {item.fontFamily}
        </Typography>
        <Typography
          sx={{
            fontSize: "1rem",
            lineHeight: "1.5rem",
            color: "text.primary",
          }}
        >
          {item.fontWeight} | Font size: {item.fontSize} | Line height:{" "}
          {item.lineHeight} | Paragraph spacing: {item.paragraphSpacing}
        </Typography>
      </Box>

      {/* Preview */}
      <Box sx={{ width: 80, textAlign: "right", flexShrink: 0 }}>
        <Typography
          sx={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: item.fontSize,
            fontWeight: item.fontWeight,
            color: "text.primary",
            lineHeight: item.lineHeight + "px",
          }}
        >
          Aa
        </Typography>
      </Box>
    </Box>
  );
};

// Typography section component
export const TypographySection = ({ title, items }) => {
  const theme = useTheme();

  const sectionDescription = {
    Display:
      "Large, attention-grabbing text used for prominent headings and titles.",
    Headings:
      "Large, attention-grabbing text used for prominent headings and titles.",
    Body: "Standard text used for paragraphs and general content.",
    Caption: "Smaller text used for captions and annotations.",
  };

  return (
    <Box sx={{ mb: 4, display: "flex", flexDirection: "column", gap: 2 }}>
      {/* accordion */}

      <Accordion
        defaultExpanded
        disableGutters
        elevation={0}
        sx={{
          backgroundColor: "transparent",
          borderBottom: `1px solid ${theme.palette.neutral.border}`,
        }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography
            color="text.primary"
            sx={{ fontSize: 24, fontWeight: 700, lineHeight: "28px" }}
          >
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {sectionDescription[title] && (
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 400,
                lineHeight: "24px",
                color: "text.body",
              }}
            >
              {sectionDescription[title]}
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <Paper
        elevation={0}
        sx={{
          // borderRadius: 2,
          // border: "1px solid #E5E7EB",
          backgroundColor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        {items.map((item, index) => (
          <TypographyRow key={index} item={item} />
        ))}
      </Paper>
    </Box>
  );
};
