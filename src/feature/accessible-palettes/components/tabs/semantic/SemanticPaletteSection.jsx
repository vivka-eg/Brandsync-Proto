"use client";
import { Box, Stack, Typography } from "@mui/material";
import GridPalletView from "../primary/GridPalletView";
import ListView from "../primary/listView";

function SemanticPaletteSection({ name, color, sectionKey, view, data }) {
  return (
    <Stack sx={{ gap: "12px" }}>
      <Stack direction="row" sx={{ gap: "4px", alignItems: "center" }}>
        <Box
          sx={{
            bgcolor: color,
            width: "12px",
            height: "12px",
            borderRadius: "50%",
          }}
        ></Box>
        <Typography fontWeight={700} color="text.primary" fontSize={20}>
          {name}
        </Typography>
      </Stack>

      {view === "grid" ? (
        <GridPalletView colorPalette={data} />
      ) : (
        <ListView colorPalette={data} />
      )}
    </Stack>
  );
}

export default SemanticPaletteSection;
