"use client";
import Header from "@/components/Header";
import { Box } from "@mui/material";

function Layout({ children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
      <Box
        component="main"
        sx={{
          mt: "64px",
          flex: 1,
          overflowX: "hidden",
          bgcolor: "background.default",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
