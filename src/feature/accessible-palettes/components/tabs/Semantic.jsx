"use client";
import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SemanticPaletteSection from "./semantic/SemanticPaletteSection";
import { GridFour, Table } from "phosphor-react";
import { fetchSemanticPalettes } from "@/api/design-system/color-palette";

function Semantic() {
  const semanticPaletteSections = [
    { name: "Success Color Palette", color: "#45A270", sectionKey: "success" },
    { name: "Error Color Palette", color: "#CF2E33", sectionKey: "error" },
    { name: "Warning Color Palette", color: "#D29100", sectionKey: "warning" },
    {
      name: "Information Color Palette",
      color: "#1D4ED8",
      sectionKey: "information",
    },
  ];
  const [view, setView] = useState("grid");
  const [semanticPalettes, setSemanticPalettes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchSemanticPalettes().then((data) => {
      setSemanticPalettes(data);
      // console.log(data);

      setLoading(false);
    });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <Stack sx={{ gap: "40px" }}>
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
            Semantic Color Palette
          </Typography>

          <Typography color="text.body">
            System colors for status messages, alerts, and feedback states.
          </Typography>
        </Stack>

        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, newView) => setView(newView)}
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

      <Stack sx={{ gap: "60px" }}>
        {semanticPaletteSections.map((section) => (
          <SemanticPaletteSection
            key={section.sectionKey}
            {...section}
            view={view}
            onViewChange={(newView) => setView(newView)}
            data={semanticPalettes[section.sectionKey]?.primarySection}
          />
        ))}
      </Stack>
    </Stack>
  );
}

export default Semantic;
