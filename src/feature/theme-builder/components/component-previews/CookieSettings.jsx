"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Switch,
  Paper,
} from "@mui/material";

const CookieSettings = ({ primaryColor }) => {
  const [strictlyNecessary, setStrictlyNecessary] = useState(true);

  return (
    <Paper
      elevation={0}
      sx={{
        p: "16px",
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        backgroundColor: "#FFFFFF",
        // maxWidth: 360,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Typography sx={{ fontWeight: 600, color: "#111827" }}>
          Strictly Necessary
        </Typography>
        <Switch
          checked={strictlyNecessary}
          onChange={(e) => setStrictlyNecessary(e.target.checked)}
          sx={{
            width: 40,
            height: 25,
            padding: 0,
            "& .MuiSwitch-switchBase": {
              padding: 0,
              margin: 0,
              top: "2px",
              left: "2px",
              transitionDuration: "300ms",
              "&.Mui-checked": {
                transform: "translateX(15px)",
                color: "#fff",
                "& + .MuiSwitch-track": {
                  backgroundColor: primaryColor,
                  opacity: 1,
                  border: 0,
                },
              },
            },
            "& .MuiSwitch-thumb": {
              boxSizing: "border-box",
              width: 21,
              height: 21,
              boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
            },
            "& .MuiSwitch-track": {
              borderRadius: 25 / 2,
              backgroundColor: "#E9E9EA",
              opacity: 1,
              transition: "background-color 300ms",
            },
          }}
        />
      </Box>
      <Typography sx={{ fontSize: "0.875rem", color: "#6B7280", mb: 2.5 }}>
        These cookies are essential in order to use the website and it&apos;s features.
      </Typography>
      <Button
        fullWidth
        variant="outlined"
        sx={{
          py: 1,
          borderRadius: 1.5,
          textTransform: "none",
          fontWeight: 600,
          borderColor: "#D1D5DB",
          color: "#374151",
          backgroundColor: "neutral.container",
          "&:hover": {
            borderColor: "#9CA3AF",
            backgroundColor: "neutral.containerHovered",
          },
        }}
      >
        Save preferences
      </Button>
    </Paper>
  );
};

export default CookieSettings;
