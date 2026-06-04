"use client";
import { Tabs, Tab, Box } from "@mui/material";

function ComponentTabs({ tabs, currentTab, onChange }) {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        bgcolor: "background.default",
        pt: "20px",
        width: "100%",
        overflowX: "auto", // allows horizontal scrolling
      }}
    >
      <Tabs
        value={currentTab}
        onChange={onChange}
        variant="scrollable"
        scrollButtons="auto" // shows arrows when needed
        allowScrollButtonsMobile
        sx={{ borderBottom: 1, borderColor: "divider", overflow: "visible" }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab}
            label={tab}
            disableFocusRipple
          />
        ))}
      </Tabs>
    </Box>
  );
}

export default ComponentTabs;
