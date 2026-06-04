"use client";

import MCPAuthWrapper from "@/components/auth/MCPAuthWrapper";
import { MCPAuthContextProvider } from "@/context/mcp/MCPAuthContext";
import { McpCategoriesProvider } from "@/context/mcp/McpCategoriesContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import McpSidebar from "@/components/mcp/McpSidebar";
import { Box, Container } from "@mui/material";
import React from "react";
import { usePathname } from "next/navigation";

function McpShell({ children }) {
  const pathname = usePathname();
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
          width: "100vw",
          mt: "64px",
        }}
      >
        <Box sx={{ display: "flex", flex: 1 }}>
          <McpSidebar />
          {pathname == "/mcp" ? (
            children
          ) : (
            <Container
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 4,
                p: 4,
                bgcolor: "background.default",
                minWidth: 0,
                "@media (max-width: 950px)": { width: "100%" },
                "@media (max-width: 600px)": { p: 1 },
              }}
            >
              {children}
            </Container>
          )}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}

function Layout({ children }) {
  return (
    <MCPAuthContextProvider>
      <MCPAuthWrapper>
        <McpCategoriesProvider>
          <McpShell>{children}</McpShell>
        </McpCategoriesProvider>
      </MCPAuthWrapper>
    </MCPAuthContextProvider>
  );
}

export default Layout;
