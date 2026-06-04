"use client";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Stack,
  Button,
  useTheme,
} from "@mui/material";
import {
  DesktopIcon,
  DeviceMobileIcon,
  DeviceTablet,
} from "@phosphor-icons/react";
import React, { useState } from "react";

function DeviceTabs({ currentTab, onChange }) {
  const tabs = [
    {
      label: "Desktop",
      icon: DesktopIcon,
    },

    {
      label: "Tablet",
      icon: DeviceTablet,
    },
    {
      label: "Mobile",
      icon: DeviceMobileIcon,
    },
  ];

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        // zIndex: 10,
        bgcolor: "background.default",
        width: "100%",
        overflowX: "auto", // allows horizontal scrolling
        flex: 1,
      }}
    >
      <Tabs
        value={currentTab}
        onChange={onChange}
        variant="scrollable"
        scrollButtons="auto" // shows arrows when needed
        allowScrollButtonsMobile
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          overflow: "visible",
        }}
      >
        {tabs.map(({ label, icon: Icon }) => (
          <Tab
            key={label}
            label={label}
            disableFocusRipple
            icon={<Icon size={24} />}
            iconPosition="start"
          />
        ))}
      </Tabs>
    </Box>
  );
}

function ExampleScreen({ name, children, firstMatchingLogo }) {
  const [currentTab, setCurrentTab] = useState(0);
  const [mode, setMode] = useState("light");
  const theme = useTheme();

  const handleTabChange = (_, newValue) => {
    setCurrentTab(newValue);
  };

  // Map tab index to device name
  const getDeviceName = (tabIndex) => {
    const devices = ["desktop", "tablet", "mobile"];
    return devices[tabIndex];
  };

  // Clone children and pass device and mode props
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        device: getDeviceName(currentTab),
        mode: mode,
        firstMatchingLogo: firstMatchingLogo,
      });
    }
    return child;
  });

  return (
    <Box>
      <Typography
        variant="h4"
        color="text.primary"
        sx={{
          marginBottom: "16px",
          fontSize: "24px",
          lineHeight: "32px",
        }}
      >
        {name}
      </Typography>

      {/* device tabs & mode tabs */}
      <Stack spacing={2} direction="row" sx={{ marginBottom: "32px" }}>
        <DeviceTabs currentTab={currentTab} onChange={handleTabChange} />
        <Stack
          sx={{
            borderRadius: "120px",
            bgcolor: "neutral.container",
            padding: "8px",
            gap: "8px",
          }}
          direction="row"
        >
          {["light", "dark"].map((label, index) => {
            const isActive = mode === label;
            return (
              <Button
                key={label}
                onClick={() => setMode(label)}
                // startIcon={device.icon}
                disableFocusRipple
                disableRipple
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  backgroundColor: isActive
                    ? "action.active"
                    : "neutral.container",
                  color: isActive ? "white" : "text.disabled",
                  borderRadius: "50px",
                  px: 4,
                  py: 2,
                  minWidth: "auto",
                  "&:hover": {
                    backgroundColor: isActive
                      ? "action.active"
                      : "neutral.containerHovered",
                    color: isActive ? "white" : "text.body",
                  },

                  ":active": {
                    backgroundColor: isActive
                      ? "action.pressed"
                      : "neutral.containerPressed",
                    color: isActive ? "white" : theme.palette.text.body,
                  },

                  "&:focus-visible": {
                    outline: "2px solid " + theme.palette.action.active,
                    outlineOffset: "2px",
                  },
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
              >
                {label.charAt(0).toUpperCase() + label.slice(1)}
              </Button>
            );
          })}
        </Stack>
      </Stack>

      {/* example screen */}
      {childrenWithProps}
    </Box>
  );
}

export default ExampleScreen;
