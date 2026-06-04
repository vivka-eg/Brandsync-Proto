"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createAppTheme } from "./themeConfig";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light");

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        localStorage.setItem("theme-mode", newMode);
      }
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
