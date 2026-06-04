"use client";
import Box from "@mui/material/Box";
import Header from "@/components/Header";
import SitemapPage from "@/feature/sitemap/SitemapPage";

function page() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <SitemapPage />
    </Box>
  );
}

export default page;

