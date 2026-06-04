"use client";
import React, { useState } from "react";
import { Box, Stack, Alert } from "@mui/material";
import VpnContentAlert from "@/components/shared/VpnContentAlert";
import Link from "next/link";
import { MagnifyingGlass, Palette } from "phosphor-react";
import TopHeader from "@/components/shared/TopHeader";
import { AccessibilityTabs } from "@/constants";
import ComponentTabs from "@/components/shared/ComponentTabs";
import Overview from "./components/Overview";
import PrinciplesOrFoundations from "./components/PrinciplesOrFoundations";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";
import { useLayoutContext } from "@/app/design-system/layout";

function AccessibilityPage({ data: accessibility }) {
  const [currentTab, setCurrentTab] = useState(0);
  const { layoutRef } = useLayoutContext();

  // Handle tab change :
  const handleTabChange = (_, newValue) => {
    setCurrentTab(newValue);
    layoutRef?.current.scrollTo(0, 0);
  };

  // render function for tabs :
  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <Stack spacing={2}>
            <Alert severity="info" sx={{ borderRadius: 2 }} icon={<MagnifyingGlass size={20} weight="duotone" />}>
              Want to see these principles in action? Browse our{" "}
              <Link href="/design-system/components" style={{ fontWeight: 600, color: "inherit", textDecoration: "underline" }}>
                Component Library
              </Link>{" "}
              to view pre-built, fully accessible UI components.
            </Alert>
            <Overview Overview={accessibility.Overview} />
          </Stack>
        );
      case 1:
        return (
          <PrinciplesOrFoundations
            PrinciplesOrFoundations={accessibility.Principles}
            key={"Principles"}
          />
        );
      case 2:
        return (
          <Stack spacing={2}>
            <Alert severity="info" sx={{ borderRadius: 2 }} icon={<Palette size={20} weight="duotone" />}>
              Need to test color contrast? Use our{" "}
              <Link href="/design-system/accessible-palettes" style={{ fontWeight: 600, color: "inherit", textDecoration: "underline" }}>
                Accessible Palettes tool
              </Link>{" "}
              to automatically verify your brand colors against WCAG standards.
            </Alert>
            <PrinciplesOrFoundations
              PrinciplesOrFoundations={accessibility.Foundation}
              key={"Foundations"}
            />
          </Stack>
        );
      case 3:
        return <MarkdownRenderer content={accessibility.TestingAndTools.Text} />;
      default:
        return null;
    }
  };

  if (!accessibility) return <VpnContentAlert title="Accessibility" />;

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
        title={accessibility.Title || "Accessibility"}
        description={accessibility.Description}
        assetURL={accessibility.Video}
      />

      {/* Tab Section */}
      <ComponentTabs
        tabs={AccessibilityTabs}
        currentTab={currentTab}
        onChange={handleTabChange}
      />

      {/* Main Content Section */}

      <Box sx={{ display: "flex" }}>
        {/* left section */}
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

export default AccessibilityPage;
