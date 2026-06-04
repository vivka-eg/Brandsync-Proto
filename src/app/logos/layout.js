"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Box } from "@mui/material";

function Layout({ children }) {
  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Header />
      <Box
        id="logos-scroll"
        sx={{
          height: "calc(100vh - 64px)",
          overflowY: "auto",
          overflowX: "hidden",
          mt: "64px",
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flex: 1 }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}

export default Layout;
