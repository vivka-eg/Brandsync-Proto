"use client";
import Sidebar from "@/components/shared/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Box, Container } from "@mui/material";
import React, { createContext, useContext, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

const LayoutContext = createContext({});

export const useLayoutContext = () => useContext(LayoutContext);

function Layout({ children }) {
  const layoutRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (layoutRef.current) {
      layoutRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  return (
    <LayoutContext.Provider value={{ layoutRef }}>
      <Box sx={{ bgcolor: "background.default" }}>
        <Header />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 64px)",
            bgcolor: "background.default",
            overflowY: "auto",
            width: "100vw",
            mt: "64px",
          }}
          id="design-system-layout"
          ref={layoutRef}
        >
          <Box sx={{ display: "flex", flex: 1 }}>
            <Sidebar />
            <Container
              sx={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: 4,
                p: 4,
                bgcolor: "background.default",
                "@media (max-width: 600px)": { p: 1 },
              }}
              id="main-content"
            >
              {children}
            </Container>
          </Box>
          <Footer />
        </Box>
      </Box>
    </LayoutContext.Provider>
  );
}

export default Layout;
