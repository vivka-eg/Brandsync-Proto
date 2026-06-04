"use client";
import { useArrowKeyNavigation } from "@/hooks/useArrowKeyNavigation";
import { Button, Stack, useTheme } from "@mui/material";

export default function DeviceTypes({
  active,
  setActive,
  deviceTypes,
  sx = {},
}) {
  const { register, onKeyDown } = useArrowKeyNavigation();
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        // "@media (max-width: 600px)": {
        backgroundColor: "neutral.container",
        minHeight: "52px",
        alignItems: "center",
        px: "4px",
        borderRadius: "120px",
        gap: "4px",
        py: "4px",
        justifyContent: "center",
        // },
        flexWrap: "wrap",
        gap: 1,
        ...sx,
      }}
    >
      {deviceTypes.map((device, index) => {
        const isActive = active === device.value;

        return (
          <Button
            key={device.value}
            onClick={() => setActive(device.value)}
            // startIcon={device.icon}
            disableFocusRipple
            disableRipple
            sx={{
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: isActive ? "action.active" : "neutral.container",
              color: isActive ? "white" : "text.disabled",
              borderRadius: "50px",
              px: 2,
              py: 1,
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
            }}
            ref={register(index)}
            onKeyDown={(e) => onKeyDown(e, index)}
          >
            {device.label}
          </Button>
        );
      })}
    </Stack>
  );
}
