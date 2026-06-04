"use client";
import useAccessiblePalette from "@/feature/accessible-palettes/hooks/useAccessiblePalette";
import { Snackbar, Alert, Box } from "@mui/material";
import { createContext, useContext, useState } from "react";

export const AccessiblePaletteContext = createContext({});

export const AccessiblePaletteContextProvider = ({ children }) => {
  const context = useAccessiblePalette();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
    logoImage: null,
    logoName: null,
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity, logoImage: null, logoName: null });
  };

  const showSnackbarWithLogo = (message, logoImage, logoName, severity = "success") => {
    setSnackbar({ open: true, message, severity, logoImage, logoName });
  };

  const hideSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <AccessiblePaletteContext.Provider value={{ ...context, showSnackbar, showSnackbarWithLogo }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            minWidth: "400px",
          },
        }}
      >
        <Alert
          onClose={hideSnackbar}
          severity="success"
          variant="standard"
          sx={{
            width: "100%",
            minWidth: "400px",
            bgcolor: "#F9FAFB",
            color: "text.primary",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            border: "1px solid #E5E7EB",
            py: 1.5,
            px: 2,
            "& .MuiAlert-icon": {
              color: "success.main",
            },
            "& .MuiAlert-message": {
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              width: "100%",
            },
          }}
          icon={snackbar.logoImage ? false : undefined}
        >
          {snackbar.logoImage && (
            <Box
              component="img"
              src={snackbar.logoImage}
              alt={snackbar.logoName || "Logo"}
              sx={{
                width: 40,
                height: 40,
                objectFit: "contain",
                flexShrink: 0,
                display: "inline-block",
                verticalAlign: "middle",
              }}
            />
          )}
          <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>{snackbar.message}</Box>
        </Alert>
      </Snackbar>
    </AccessiblePaletteContext.Provider>
  );
};

export const useAccessiblePaletteContext = () => {
  const context = useContext(AccessiblePaletteContext);
  if (!context) {
    throw new Error(
      "useAccessiblePaletteContext must be used within a AccessiblePaletteContextProvider"
    );
  }
  return context;
};
