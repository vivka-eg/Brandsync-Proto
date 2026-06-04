import { Box, Stack } from "@mui/material";

function ColorPreviewTabs({ selectedColorTab, onTabChange }) {
  return (
    <Stack direction="row" spacing={2}>
      <Box
        onClick={() => onTabChange("brand")}
        sx={{
          px: 2,
          py: 1,
          borderRadius: "8px 8px 0 0",
          borderBottom: "2px solid",
          borderColor: selectedColorTab === "brand" ? "primary.main" : "transparent",
          fontWeight: selectedColorTab === "brand" ? 600 : 400,
          color: selectedColorTab === "brand" ? "text.primary" : "text.secondary",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            color: "text.primary",
          },
        }}
      >
        Brand colors
      </Box>
      <Box
        onClick={() => onTabChange("neutral")}
        sx={{
          px: 2,
          py: 1,
          borderRadius: "8px 8px 0 0",
          borderBottom: "2px solid",
          borderColor: selectedColorTab === "neutral" ? "primary.main" : "transparent",
          fontWeight: selectedColorTab === "neutral" ? 600 : 400,
          color: selectedColorTab === "neutral" ? "text.primary" : "text.secondary",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            color: "text.primary",
          },
        }}
      >
        Neutral colors
      </Box>
    </Stack>
  );
}

export default ColorPreviewTabs;
