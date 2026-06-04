"use client";

import { styled, alpha } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

const CustomSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => {
  const dark = "#1E2128"; // selected bg
  const light = "#E0E5E9"; // unselected bg
  const focusOutline = "#29303B"; // focus outline color

  return {
    width: 48,
    height: 28,
    padding: 0,
    display: "flex",
    
    // Focus state for the whole switch container
    "&.Mui-focusVisible": {
      outline: `2px solid ${focusOutline}`,
      outlineOffset: "2px",
      borderRadius: "16px", // Slightly larger than track for better visual
    },
    
    "& .MuiSwitch-switchBase": {
      padding: 1,
      margin: 1,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(20px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: dark,
          opacity: 1,
          boxShadow: "none",
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          backgroundColor: light,
          opacity: 1,
        },
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: light,
      },
      
      // Remove focus from the switchBase (thumb container)
      "&.Mui-focusVisible": {
        "& .MuiSwitch-thumb": {
          outline: "none", // Remove thumb outline
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      width: 24,
      height: 24,
      borderRadius: "50%",
      backgroundColor: "#fff",
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: light,
      opacity: 1,
      transition: theme.transitions.create(["background-color", "box-shadow"]),
    },
    
    // Remove the thumb-specific focus styles
    // "& .Mui-focusVisible .MuiSwitch-thumb": {
    //   outline: `2px solid ${focusOutline}`,
    //   outlineOffset: 2,
    // },
  };
});

export default CustomSwitch;