"use client";
import { Box, Chip, Stack, Typography, useTheme } from "@mui/material";
import { CheckCircle } from "phosphor-react";
import React, { useState } from "react";
import CopyButton from "../../shared/CopyButton";

function AccessibleCombination({ cardData, copyBoth }) {
  const theme = useTheme();
  const { name, color, background, compliance, isDarkerColor } = cardData;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        py: "8px",
        px: "16px",
        border: "1px solid",
        borderColor: "neutral.border",
        borderRadius: 2,
        flex: 1,
        bgcolor: background,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: isHovered
          ? "0 12px 24px rgba(0, 0, 0, 0.15)"
          : "0 2px 8px rgba(0, 0, 0, 0.05)",
        cursor: "pointer",
      }}
    >
      <Box sx={{ padding: 1, height: "100%" }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography
            color={isDarkerColor ? "#fff" : "#000"}
            sx={{ fontSize: "14px", lineHeight: "20px" }}
          >
            {name}
          </Typography>
          {/* compliance chip */}
          <Chip
            label={compliance}
            size="small"
            sx={{
              backgroundColor: !isDarkerColor ? "#D7FFED" : "#0A5D3C",
              color: !isDarkerColor ? "#0A7146" : "#33F5A1",
              fontWeight: 600,
              height: 24,
              "& .MuiChip-label": {
                px: 1.5,
              },
              fontSize: "12px",
              width: "fit-content",
            }}
            icon={
              <CheckCircle
                size={16}
                weight="bold"
                color={!isDarkerColor ? "#0A7146" : "#33F5A1"}
              />
            }
          />
        </Stack>
        <Typography
          sx={{
            fontSize: "16px",
            lineHeight: "24px",
            mt: 2,
          }}
          color={color}
        >
          The quick brown fox jumps over the lazy dog
        </Typography>
        <Box sx={{ mt: 1 }} />
        {copyBoth ? (
          <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
            <CopyButton
              text={color}
              copyText={color}
              sx={{ color: isDarkerColor ? "#fff" : "#000" }}
            />
            <Typography color={isDarkerColor ? "#fff" : "#000"}>
              on
            </Typography>
            <CopyButton
              text={background}
              copyText={background}
              sx={{ color: isDarkerColor ? "#fff" : "#000" }}
            />
          </Stack>
        ) : (
          <CopyButton
            text={color}
            copyText={color}
            sx={{ color: isDarkerColor ? "#fff" : "#000" }}
          />
        )}
      </Box>
    </Box>
  );
}

export default AccessibleCombination;
