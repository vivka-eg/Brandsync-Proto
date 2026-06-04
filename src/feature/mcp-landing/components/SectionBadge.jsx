import Box from "@mui/material/Box";

export default function SectionBadge({ children, fontWeight = 500, sx }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: "14px",
        py: "4px",
        borderRadius: "6px",
        bgcolor: "#eef2ff",
        color: "#4361ee",
        fontSize: "12.8px",
        fontWeight,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
