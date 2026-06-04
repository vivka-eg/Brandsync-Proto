"use client";
import { Box } from "@mui/material";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SupportForm from "@/components/shared/SupportForm";

export default function SupportPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ mt: "64px" }}>
        <SupportForm />
      </Box>
      <Footer />
    </Box>
  );
}
