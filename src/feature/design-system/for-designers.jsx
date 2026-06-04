"use client";
import React, { useEffect, useState } from "react";
import { Box, Stack, Alert } from "@mui/material";
import Link from "next/link";
import { PaintBrush, Wrench, Wheelchair, Swatches } from "phosphor-react";
import TopHeader from "@/components/shared/TopHeader";
import { ForDesignersTabs } from "@/constants";
import ComponentTabs from "@/components/shared/ComponentTabs";
import Loader from "@/components/shared/Loader";
import VpnContentAlert from "@/components/shared/VpnContentAlert";
import DesignersSection from "./components/PhilosophySection";
import { getForDesigners } from "@/api/design-system/for-designers";
import { useLayoutContext } from "@/app/design-system/layout";

function ForDesigners() {
  const [forDesigners, setForDesigners] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const { layoutRef } = useLayoutContext();

  // Fetch component data :
  useEffect(() => {
    getForDesigners().then((data) => {
      setForDesigners(data?.error ? null : (data ?? null));
      setLoading(false);
    });
  }, []);

  // Handle tab change :
  const handleTabChange = (_, newValue) => {
    setCurrentTab(newValue);
    layoutRef.current?.scrollTo(0, 0);
  };

  // render function for tabs :
  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <Stack spacing={2}>
            <Alert severity="info" sx={{ borderRadius: 2 }} icon={<Swatches size={20} weight="duotone" />}>
              Explore our core token layers in action within our{" "}
              <Link href="/figma-kit" style={{ fontWeight: 600, color: "inherit", textDecoration: "underline" }}>
                Figma Kit Library
              </Link>.
            </Alert>
            <DesignersSection
              Section={forDesigners.TokenSystem}
              key="Token System"
            />
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={2}>
            <Alert severity="info" sx={{ borderRadius: 2 }} icon={<PaintBrush size={20} weight="duotone" />}>
              Need the actual assets? Download our{" "}
              <Link href="/figma-kit/figma-plugins/brandsync-studio" style={{ fontWeight: 600, color: "inherit", textDecoration: "underline" }}>
                BrandSync Studio Figma Plugin
              </Link>{" "}
              to get started right away.
            </Alert>
            <DesignersSection
              Section={forDesigners.GettingStartedInFigma}
              key="Getting Started in Figma"
            />
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={2}>
            <Alert severity="info" sx={{ borderRadius: 2 }} icon={<Wrench size={20} weight="duotone" />}>
              Ready to start customizing? Head over to our{" "}
              <Link href="/theme-builder" style={{ fontWeight: 600, color: "inherit", textDecoration: "underline" }}>
                Theme Builder
              </Link>{" "}
              to experiment with tokens visually.
            </Alert>
            <DesignersSection
              Section={forDesigners.CustomisingTokensForYourBrand}
              key="Customising Tokens for Your Brand"
            />
          </Stack>
        );
      case 3:
        return (
          <Stack spacing={2}>
            <Alert severity="info" sx={{ borderRadius: 2 }} icon={<Wheelchair size={20} weight="duotone" />}>
              Dive deeper into the rules: Read our comprehensive{" "}
              <Link href="/design-system/accessibility" style={{ fontWeight: 600, color: "inherit", textDecoration: "underline" }}>
                Accessibility Principles
              </Link>{" "}
              for detailed implementation guidelines.
            </Alert>
            <DesignersSection
              Section={forDesigners.ResponsiveBehaviourAndAccessibility}
              key="Responsive Behaviour and Accessibility"
            />
          </Stack>
        );
      default:
        return null;
    }
  };

  if (loading) return <Loader />;
  if (!forDesigners) return <VpnContentAlert title="For Designers" />;

  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 1,
        bgcolor: "background.default",
        paddingBottom: "100px",
      }}
    >
      {/* Header Section */}
      <TopHeader
        title={forDesigners.Title || "For Designers"}
        description={forDesigners.Description}
        assetURL={forDesigners.Video}
      />

      {/* Tab Section */}
      <ComponentTabs
        tabs={ForDesignersTabs}
        currentTab={currentTab}
        onChange={handleTabChange}
      />

      {/* Main Content Section */}
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            flex: 1,
            p: 1,
          }}
        >
          {" "}
          {renderTabContent()}
        </Box>
      </Box>
    </Stack>
  );
}

export default ForDesigners;
