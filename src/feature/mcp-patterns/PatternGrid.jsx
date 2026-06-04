"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PatternCard from "./PatternCard";

export default function PatternGrid({ patterns, onDelete }) {
  if (!patterns || patterns.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="body2" color="text.disabled">
          No patterns found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {patterns.map((pattern) => (
        <PatternCard key={pattern.id} pattern={pattern} onDelete={onDelete} />
      ))}
    </Box>
  );
}
