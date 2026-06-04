import React from "react";
import { Box, Typography, LinearProgress } from "@mui/material";

export default function UploadProgressSummary({ uploadProgress, totalFiles }) {
  const successCount = Object.values(uploadProgress).filter(
    (p) => p.status === "success"
  ).length;
  const progressPercentage = (successCount / totalFiles) * 100;

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Uploading Images...
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {successCount} / {totalFiles}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progressPercentage}
        sx={{
          borderRadius: 1,
          height: 8,
          bgcolor: "rgba(25, 118, 210, 0.15)",
          "& .MuiLinearProgress-bar": {
            bgcolor: "primary.main",
          },
        }}
      />
    </Box>
  );
}
