"use client";
import { Box, Typography } from "@mui/material";
import { adjustColor } from "../../utils/adjustColor";

const PrimaryScaleSection = ({ primaryColor }) => {
  const weights = [
    { label: "50", opacity: "08" },
    { label: "100", opacity: "15" },
    { label: "200", opacity: "25" },
    { label: "300", opacity: "40" },
    { label: "400", opacity: "60" },
    { label: "500", opacity: "FF", isBase: true },
    { label: "600", adjust: -10 },
    { label: "700", adjust: -20 },
    { label: "800", adjust: -30 },
    { label: "900", adjust: -40 },
  ];

  return (
    <Box>
      <Typography sx={{ fontSize: "0.75rem", color: "#6B7280", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        Primary Scale
      </Typography>
      <Box sx={{ display: "flex", borderRadius: 2, overflow: "hidden", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)" }}>
        {weights.map((w) => (
          <Box
            key={w.label}
            sx={{
              flex: 1,
              height: 48,
              backgroundColor: w.adjust ? adjustColor(primaryColor, w.adjust) : `${primaryColor}${w.opacity}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {w.isBase && (
              <Box
                sx={{
                  position: "absolute",
                  top: 2,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 6,
                  height: 6,
                  backgroundColor: "#FFFFFF",
                  borderRadius: "50%",
                }}
              />
            )}
          </Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", mt: 0.5 }}>
        {weights.map((w) => (
          <Typography
            key={w.label}
            sx={{
              flex: 1,
              textAlign: "center",
              fontSize: "0.65rem",
              color: "#9CA3AF",
              fontWeight: w.isBase ? 600 : 400,
            }}
          >
            {w.label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default PrimaryScaleSection;
