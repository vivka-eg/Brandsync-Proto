"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Box } from "@mui/material";
import { usePathname } from "next/navigation";

function Layout({ children }) {
  const pathname = usePathname();
  const hideFooter =
    pathname === "/utilities/ico-generator" ||
    pathname === "/utilities/app-icons" ||
    pathname === "/utilities/email-signature";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", bgcolor: "background.default", minHeight: "100vh" }}>
      <Header />
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.default",
          mt: "64px",
          flex: 1,
        }}
      >
        {children}
      </Box>
      {!hideFooter && <Footer />}
    </Box>
  );
}

export default Layout;
