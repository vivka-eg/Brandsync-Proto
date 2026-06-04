"use client";
import React from "react";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "./components/HeroSection";
import BlogFeaturedHero from "./components/BlogFeaturedHero";
import BlogAnnouncementsHero from "./components/BlogAnnouncementsHero";

const RoleBasedSection = dynamic(() => import("./components/RoleBasedSection"));
const FoundationsSection = dynamic(() => import("./components/FoundationsSection"));
const AccessiblePalettesSection = dynamic(() => import("./components/AccessiblePalettesSection"));
const LogosShowcaseSection = dynamic(() => import("./components/LogosShowcaseSection"));
const FeaturesSection = dynamic(() => import("./components/FeaturesSection"));
const UXGovernancePanel = dynamic(() => import("./components/UXGovernancePanel"));
const FAQSection = dynamic(() => import("./components/FAQSection"));
const IntegrationsSection = dynamic(() => import("@/components/shared/IntegrationsSection"));

export default function LandingPage({
  announcements = [],
  featuredHeroPosts = [],
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box component="main" id="main-content">
        {featuredHeroPosts.length > 0 ? (
          <BlogFeaturedHero posts={featuredHeroPosts} />
        ) : (
          <HeroSection />
        )}
        <RoleBasedSection />
        <FoundationsSection />
        <AccessiblePalettesSection />
        <LogosShowcaseSection />
        <FeaturesSection />
        <UXGovernancePanel />
        <FAQSection />
        <IntegrationsSection />
        <BlogAnnouncementsHero posts={announcements} placement="bottom" />
      </Box>
      <Footer />
    </Box>
  );
}
