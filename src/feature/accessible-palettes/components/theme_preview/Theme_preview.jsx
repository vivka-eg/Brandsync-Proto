import React, { useState } from "react";
import { Box, Stack, Typography, Tabs, Tab } from "@mui/material";
import Button from "./tabs/Button";
import Input from "./tabs/Input";
import DataDisplay from "./tabs/DataDisplay";
import Feedback from "./tabs/Feedback";
import Navigation from "./tabs/Navigation";
import { useAccessiblePaletteContext } from "@/context/design-system/AccessiblePaletteContext";

function ThemePreview() {
  const [themeTab, setThemeTab] = useState(0);
  const [componentTab, setComponentTab] = useState(0);
  const { paletteData } = useAccessiblePaletteContext();
  const primaryColor =
    themeTab === 0 ? paletteData.primaryColor : paletteData.primaryColorDark;

  const handleThemeTabChange = (event, newValue) => {
    setThemeTab(newValue);
  };

  const handleComponentTabChange = (event, newValue) => {
    setComponentTab(newValue);
  };

  const componentTabs = [
    "Buttons",
    "Inputs",
    "Data Display",
    "Feedback",
    "Navigation",
  ];

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      <Stack sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ mb: 1 }}
          color="text.primary"
        >
          Theme Preview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Preview accessibility across different surfaces.
        </Typography>
      </Stack>

      {/* Theme Tabs (Light/Dark) */}
      <Tabs
        value={themeTab}
        onChange={handleThemeTabChange}
        sx={{
          mb: 3,
          borderBottom: 1,
          borderColor: "divider",
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
            color: "text.secondary",
            minHeight: 48,
            "&.Mui-selected": {
              color: "text.primary",
            },
          },
          "& .MuiTabs-indicator": {
            height: 3,
            backgroundColor: "primary.main",
          },
        }}
      >
        <Tab label="Light" />
        <Tab label="Dark" />
      </Tabs>

      {/* Content Area */}
      <Box
        sx={{
          backgroundColor: themeTab === 0 ? "#FBFBFB" : "#1D1B20",
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          p: { xs: 2, sm: 3 },
        }}
      >
        {/* Component Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={componentTab}
            onChange={handleComponentTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 40,
              borderBottom: "1px solid",
              borderColor: themeTab === 0 ? "#E8EAED" : "#3A3F4A",
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.875rem",
                color: themeTab === 0 ? "#636970" : "#A2AAB2",
                minHeight: 40,
                "&.Mui-selected": {
                  color: primaryColor,
                },
              },
              "& .MuiTabs-indicator": {
                height: 2,
                backgroundColor: primaryColor,
              },
            }}
          >
            {componentTabs.map((tab) => (
              <Tab key={tab} label={tab} />
            ))}
          </Tabs>
        </Box>

        {/* Tab Content */}
        {componentTab === 0 && <Button themeTab={themeTab} />}
        {componentTab === 1 && <Input themeTab={themeTab} />}
        {componentTab === 2 && <DataDisplay themeTab={themeTab} />}
        {componentTab === 3 && <Feedback themeTab={themeTab} />}
        {componentTab === 4 && <Navigation themeTab={themeTab} />}
      </Box>
    </Box>
  );
}

export default ThemePreview;
