"use client";
import { Tabs, Tab, Box } from "@mui/material";

function CustomTabs({ tabs, currentTab, onChange }) {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        bgcolor: "background.default",
      }}
    >
      <Tabs
        value={currentTab}
        onChange={onChange}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab}
            label={tab}
            sx={{
              "&.Mui-selected": {
                color: "action.active",
                borderBottom: (theme) =>
                  `2px solid ${theme.palette.action.active}`,
              },
              textTransform: "capitalize",
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
}

export default CustomTabs;
