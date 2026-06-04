"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { ArrowLeft } from "phosphor-react";

export default function BuilderBackLink({ onNavigate, sx }) {
  return (
    <Box
      onClick={onNavigate}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        mb: 2,
        cursor: "pointer",
        color: "text.secondary",
        transition: "color 0.2s ease",
        "& svg": { transition: "transform 0.2s ease" },
        "&:hover": {
          color: "text.primary",
          "& svg": { transform: "translateX(-3px)" },
        },
        ...sx,
      }}
    >
      <ArrowLeft size={16} />
      <Typography variant="body2">Digital Assets</Typography>
    </Box>
  );
}
