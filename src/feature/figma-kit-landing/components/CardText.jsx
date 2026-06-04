"use client";
import { Box, Typography } from "@mui/material";

export default function CardText({ title, description }) {
  return (
    <Box sx={{ position: "relative", zIndex: 10 }}>
      <Typography
        sx={{
          color: "#000",
          fontFamily: "Roboto",
          fontSize: "27px",
          "@media (max-width: 1595px)": { fontSize: "20px" },
          fontWeight: 600,
          lineHeight: "120%",
          mb: 0.75,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          color: "#4D535F",
          fontFamily: "Roboto",
          fontSize: "15px",
          "@media (max-width: 1595px)": { fontSize: "12px" },
          fontWeight: 400,
          lineHeight: "150%",
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}
