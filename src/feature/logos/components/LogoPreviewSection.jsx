import React from "react";
import { Box, Stack, Typography, CircularProgress } from "@mui/material";
import LogoPreviewCard from "./LogoPreviewCard";
import ColorPreviewTabs from "./ColorPreviewTabs";
import ColorPreviewBox from "./ColorPreviewBox";
import DownloadSection from "./DownloadSection";

function LogoPreviewSection({
  selectedLogo,
  mainPreviewColor,
  selectedColorTab,
  onTabChange,
  previewColors,
  hoveredColorIndex,
  copiedColorIndex,
  onColorHover,
  onColorLeave,
  onColorClick,
  onDownload,
  onCviDownload,
  onPptDownload,
  isLoading,
}) {
  return (
    <Box sx={{ display: "flex", gap: 3, position: "relative" }}>
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(255, 255, 255, 0.8)",
            zIndex: 10,
            backdropFilter: "blur(4px)",
            borderRadius: 3,
          }}
        >
          <CircularProgress size={40} sx={{ color: "#111" }} />
        </Box>
      )}
      {/* Large Logo Preview */}
      <LogoPreviewCard
        selectedLogo={selectedLogo}
        backgroundColor={mainPreviewColor}
      />

      {/* Preview Options */}
      <Box
        sx={{
          width: "420px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" fontWeight={600} mb={3}>
          Preview on different backgrounds:
        </Typography>

        <ColorPreviewTabs
          selectedColorTab={selectedColorTab}
          onTabChange={onTabChange}
        />

        {/* Preview Backgrounds */}
        <Stack direction="row" spacing={2} mt={3}>
          {previewColors.map((color, index) => (
            <ColorPreviewBox
              key={`${selectedLogo.id}-${selectedColorTab}-${index}`}
              color={color}
              index={index}
              selectedLogo={selectedLogo}
              selectedColorTab={selectedColorTab}
              isHovered={hoveredColorIndex === index}
              isCopied={copiedColorIndex === index}
              isHighlighted={hoveredColorIndex === null && index === 1}
              onMouseEnter={() => onColorHover(index, color)}
              onMouseLeave={onColorLeave}
              onClick={() => onColorClick(color, index)}
            />
          ))}
        </Stack>

        <DownloadSection onDownload={onDownload} onCviDownload={onCviDownload} onPptDownload={onPptDownload} selectedLogo={selectedLogo} />
      </Box>
    </Box>
  );
}

export default LogoPreviewSection;
