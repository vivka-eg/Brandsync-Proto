import React from "react";
import { Box, Typography, Grid, IconButton } from "@mui/material";
import { Check, X } from "@phosphor-icons/react";

export default function ThumbnailSidebar({
  uploadedFiles,
  filesMetadata,
  selectedFileIndex,
  onSelectFile,
  onRemoveFile,
  onStepChange,
}) {
  return (
    <Box
      sx={{
        width: { xs: "100%", md: 220 },
        flexShrink: 0,
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        p: 2,
        overflowY: "auto",
        maxHeight: { md: "60vh" },
      }}
    >
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ mb: 2, fontWeight: 600 }}
      >
        {uploadedFiles.length} {uploadedFiles.length === 1 ? "Image" : "Images"}
      </Typography>
      <Grid container spacing={1}>
        {uploadedFiles.map((file, index) => (
          <Grid item xs={4} md={12} key={index}>
            <Box
              onClick={() => onSelectFile(index)}
              sx={{
                cursor: "pointer",
                borderRadius: 2,
                overflow: "hidden",
                border: "3px solid",
                borderColor:
                  selectedFileIndex === index ? "primary.main" : "transparent",
                transition: "all 0.2s ease",
                position: "relative",
                "&:hover": {
                  borderColor:
                    selectedFileIndex === index ? "primary.main" : "primary.light",
                  "& .delete-btn": {
                    opacity: 1,
                  },
                },
              }}
            >
              <Box
                component="img"
                src={file.preview}
                alt={file.name}
                sx={{
                  width: "100%",
                  height: { xs: 60, md: 80 },
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <IconButton
                className="delete-btn"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  if (uploadedFiles.length === 1) {
                    onRemoveFile(index);
                    onStepChange(0);
                  } else {
                    onRemoveFile(index);
                  }
                }}
                sx={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "white",
                  opacity: { xs: 1, md: 0 },
                  transition: "opacity 0.2s ease",
                  width: 22,
                  height: 22,
                  "&:hover": { bgcolor: "error.main" },
                }}
              >
                <X size={12} />
              </IconButton>
              {filesMetadata[index]?.title &&
                filesMetadata[index]?.businessUnit &&
                filesMetadata[index]?.description && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 4,
                      right: 4,
                      bgcolor: "success.main",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Check size={12} color="white" weight="bold" />
                  </Box>
                )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
