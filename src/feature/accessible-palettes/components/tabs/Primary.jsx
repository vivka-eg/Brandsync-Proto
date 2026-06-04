import React, { useState } from "react";
import GridPalletView from "./primary/GridPalletView";
import {
  Stack,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Box,
} from "@mui/material";
import ListView from "./primary/listView";
import { GridFour, Table } from "@phosphor-icons/react";
import { useAccessiblePaletteContext } from "@/context/design-system/AccessiblePaletteContext";

function Primary() {
  const [view, setView] = useState("grid");
  const { paletteData } = useAccessiblePaletteContext();
  const colorPalette = paletteData?.primarySection || [];

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <>
      <Stack sx={{ gap: 3, width: "100%" }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "flex-start" }}
          sx={{ gap: { xs: 1, sm: 0 } }}
        >
          <Stack>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ mb: 1 }}
              color="text.primary"
            >
              Primary Color Palette
            </Typography>

            <Typography color="text.body">
              Core identity colors that define your product's unique visual
              presence.
            </Typography>
          </Stack>

          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view toggle"
            sx={{
              backgroundColor: "#FFFFFF",
              borderColor: "divider",
              borderRadius: 1,
              gap: 1,
              "& .MuiToggleButton-root": {
                border: "none",
                borderRadius: "8px",
                p: "12px",
                color: "#29303B",
                "&.Mui-selected": {
                  backgroundColor: "rgba(162, 170, 178, 0.32)",
                  color: "text.primary",
                  "&:hover": {
                    backgroundColor: "rgba(162, 170, 178, 0.40)",
                  },
                },
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              },
            }}
          >
            <ToggleButton value="grid" aria-label="grid view">
              <GridFour size={24} />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <Table size={24} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {view === "grid" ? (
          <GridPalletView colorPalette={colorPalette} />
        ) : (
          <ListView colorPalette={colorPalette} />
        )}
      </Stack>
    </>
  );
}

export default Primary;
