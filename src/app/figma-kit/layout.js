"use client";
import FigmaKitSidebar from "@/feature/figma-kit/components/FigmaKitSidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Box, Container } from "@mui/material";

function Layout({ children }) {
  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 64px)",
          bgcolor: "background.default",
          overflowY: "auto",
          overflowX: "hidden",
          width: "100%",
          mt: "64px",
        }}
        id="figma-kit-layout"
      >
        <Box sx={{ display: "flex", flex: 1 }}>
          <FigmaKitSidebar />
          <Container
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              p: 4,
              bgcolor: "background.default",
              minWidth: 0,
              "@media (max-width: 1600px)": { p: 3 },
              "@media (max-width: 950px)": { width: "100%" },
              "@media (max-width: 600px)": { p: 2 },
            }}
            id="main-content"
          >
            {children}
          </Container>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}

export default Layout;
