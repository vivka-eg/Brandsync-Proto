"use client";
import { Box, Stack, Typography } from "@mui/material";
import ColorSwatch from "./ColorSwatch";

const PaletteRow = ({
  label,
  colors,
  onColorClick,
  animationKey,
  description = "",
}) => (
  <Box sx={{ mb: 3, display: "flex", flexDirection: "column", gap: "16px" }}>
    <Stack>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          color: "text.primary",
          mb: 1,
          fontSize: "20px",
        }}
      >
        {label}
      </Typography>
      <Typography color="text.body">{description}</Typography>
    </Stack>
    <Box
      sx={{
        pt: 1,
      }}
    >
      <Box
        key={animationKey}
        sx={{
          display: "flex",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          position: "relative",
          "&::after": animationKey
            ? {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
                animation: "shimmer 0.6s ease-out forwards",
                pointerEvents: "none",
              }
            : {},
          "@keyframes shimmer": {
            "0%": {
              left: "-100%",
            },
            "100%": {
              left: "100%",
            },
          },
        }}
      >
        {colors.map((item, index) => (
          <ColorSwatch
            key={index}
            color={item.color}
            name={item.name}
            onClick={onColorClick}
          />
        ))}
      </Box>
    </Box>
  </Box>
);

export default PaletteRow;
