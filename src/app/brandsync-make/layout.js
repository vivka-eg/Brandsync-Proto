"use client";
import { Box } from "@mui/material";

function Layout({ children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", bgcolor: "background.default", minHeight: "100vh" }}>
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.default",
          flex: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
