"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function PageNav({ prev, next }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Button
        component={Link}
        href={prev.href}
        variant="outlined"
        disableElevation
        startIcon={<CaretLeftIcon size={18} />}
        sx={{
          color: "#121212",
          borderColor: "#121212",
          borderRadius: "8px",
          height: 48,
          px: 2,
          fontWeight: 500,
          fontSize: "16px",
          textTransform: "none",
          "&:hover": { borderColor: "#121212", bgcolor: "rgba(0,0,0,0.04)" },
        }}
      >
        {prev.label}
      </Button>
      <Button
        component={Link}
        href={next.href}
        variant="contained"
        disableElevation
        endIcon={<CaretRightIcon size={18} />}
        sx={{
          bgcolor: "#21262e",
          color: "white",
          borderRadius: "8px",
          height: 48,
          px: 2,
          fontWeight: 500,
          fontSize: "16px",
          textTransform: "none",
          "&:hover": { bgcolor: "#2d3748" },
        }}
      >
        {next.label}
      </Button>
    </Box>
  );
}
