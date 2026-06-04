"use client";
import Sidebar from "@/feature/icons-manage/components/Sidebar";
import { Box, Container } from "@mui/material";

function Layout({ children }) {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "flex-start",
        bgcolor: "background.default",
      }}
    >
      <Sidebar />
      {/* Spacer to offset fixed sidebar */}
      <Box aria-hidden sx={{ width: 230, flexShrink: 0 }} />

      <Box
        sx={{
          flex: 1,
          py: 4,
          px: 4,
          bgcolor: "background.default",
          minWidth: 0,
        }}
      >
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  );
}

export default Layout;
