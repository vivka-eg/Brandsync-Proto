"use client";
import Box from "@mui/material/Box";
// import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
// import Logo from "./Logo";
import logoWhite from "../../public/BrandSync_Logo_white.svg";
import Image from "next/image";

const NavLinks = () => {
  const links = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "Design System",
      href: "/design-system",
    },
    {
      label: "UX Governance",
      href: "/governance",
    },
    {
      label: "FAQs",
      href: "/faqs",
    },
    {
      label: "Support",
      href: "/support",
    },
    {
      label: "Sitemap",
      href: "/sitemap",
    },
    {
      label: "Roadmap",
      href: "/roadmap",
    },
  ];



  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: { xs: "center", md: "flex-start" },
      }}
    >
      {links.map((link) => (
        <Box
          key={link.label}
          component="a"
          href={link.href}
          style={{ cursor: "pointer" }}
          sx={{
            fontWeight: 500,
            fontSize: 14,
            color: "#ffffff",
            textDecoration: "none",
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
              cursor: "pointer",
            },
          }}
        >
          {link.label}
        </Box>
      ))}
    </Box>
  );
};

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: "#101318",
        width: "100%",
        // Ensure the footer is always painted above fixed left sidebars.
        // (Some utility pages use `position: fixed` sidebars with z-index.)
        position: "relative",
        zIndex: 1200,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: { xs: "center", md: "space-between" },
          alignItems: "center",
          gap: { xs: 3, md: 2 },
          color: "white",
          py: { xs: 3, md: 2 },
          px: { xs: 3, md: 1 },
          maxWidth: "1300px",
          mx: "auto",
        }}
      >
        {/* Logo */}
        <Box sx={{ flexShrink: 0 }}>
          <Image
            src={logoWhite}
            alt="BrandSync Make"
            width={200}
            height={40}
          />
        </Box>

        <NavLinks />

        {/* Copyright */}
        <Typography
          variant="body2"
          sx={{
            color: "white",
            textAlign: { xs: "center", md: "right" },
            flexShrink: 0,
          }}
        >
          &copy; {new Date().getFullYear()} BrandSync Make. All rights reserved.
        </Typography>
      </Box>
      
    </Box>
  );
};

export default Footer;
