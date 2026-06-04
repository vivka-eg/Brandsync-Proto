"use client";

import { useTheme as useMuiTheme, styled } from "@mui/material/styles";
import { useTheme } from "@/theme/ThemeContext"; // your custom theme context
import { motion } from "framer-motion";
import { Sun, Moon } from "phosphor-react";

// Styled motion box for the toggle knob
const MotionToggle = styled(motion.div)(({ theme }) => ({
  width: 24,
  height: 24,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.paper,
  position: "absolute",
  top: 4,
  padding: 2,
}));

// Toggle container button
const ToggleButton = styled("button")(({ theme, isdark }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: 52,
  height: 32,
  borderRadius: 20,
  padding: 4,
  backgroundColor: isdark ? "action.active" : "#DFE5E6",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
}));

export default function ThemeToggle() {
  const { mode, toggleTheme } = useTheme();
  const isDark = mode === "dark";
  const muiTheme = useMuiTheme();

  return (
    <ToggleButton onClick={toggleTheme} isdark={isDark}>
      <MotionToggle
        layout
        animate={{ x: isDark ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon
            style={{ color: muiTheme.palette.action.active, fontSize: 16 }}
            format="stroke"
            weight="bold"

          />
        ) : (
          <Sun
            style={{ color: muiTheme.palette.action.active, fontSize: 16 }}
            format="stroke"
            weight="bold"

          />
        )}
      </MotionToggle>
    </ToggleButton>
  );
}
