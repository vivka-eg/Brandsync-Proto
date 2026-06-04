"use client";
import React from "react";
import { Box, Stack, Typography, Button, Chip } from "@mui/material";
import { FilePdf, PresentationChart } from "phosphor-react";

function BrandAssetCard({ icon, title, description, previewLabel, buttonLabel, onDownload, comingSoon }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        flex: 1,
        p: 2.5,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          minWidth: 40,
          borderRadius: 1.5,
          bgcolor: "action.hover",
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={0.25}>
          <Typography variant="body2" fontWeight={600}>
            {title}
          </Typography>
          {comingSoon && (
            <Chip label="Coming soon" size="small" sx={{ height: 18, fontSize: "0.65rem" }} />
          )}
        </Stack>
        <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
          {description}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          disabled={comingSoon}
          onClick={onDownload}
        >
          {buttonLabel}
        </Button>
      </Box>
    </Stack>
  );
}

function BrandAssetsSection({ selectedLogo, onDownload }) {
  const handleCviDownload = () => {
    if (onDownload) onDownload("cvi");
  };

  const handlePptDownload = () => {
    if (onDownload) onDownload("ppt");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Brand Assets
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <BrandAssetCard
          icon={<FilePdf size={22} />}
          title="Product CVI"
          description="Download the Corporate Visual Identity guidelines PDF for this product."
          buttonLabel="Download CVI PDF"
          onDownload={handleCviDownload}
          comingSoon
        />
        <BrandAssetCard
          icon={<PresentationChart size={22} />}
          title="PowerPoint Template"
          description="Get the branded PowerPoint presentation template for this product."
          buttonLabel="Download Template"
          onDownload={handlePptDownload}
          comingSoon
        />
      </Stack>
    </Box>
  );
}

export default BrandAssetsSection;
