"use client";
import React, { useState, useEffect } from "react";
import { Box, Stack } from "@mui/material";
import { getDesignPhilosophy } from "@/api/design-system/design-philosophy";
import Loader from "@/components/shared/Loader";
import VpnContentAlert from "@/components/shared/VpnContentAlert";
import TopHeader from "@/components/shared/TopHeader";
import { DesignPhilosophyTabs } from "@/constants";
import ComponentTabs from "@/components/shared/ComponentTabs";
import PhilosophySection from "./components/PhilosophySection";
import { useLayoutContext } from "@/app/design-system/layout";

function DesignPhilosophyPage() {
  const [designPhilosophy, setDesignPhilosophy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const { layoutRef } = useLayoutContext();

  useEffect(() => {
    getDesignPhilosophy().then((data) => {
      setDesignPhilosophy(data?.error ? null : (data ?? null));
      setLoading(false);
    });
  }, []);

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
          <PhilosophySection Section={designPhilosophy.Purpose} key="Purpose" />
        );
      case 1:
        return (
          <PhilosophySection
            Section={designPhilosophy.CorePrinciples}
            key="CorePrinciples"
          />
        );

      case 2:
        return (
          <PhilosophySection
            Section={designPhilosophy.Approach}
            key="Approach"
          />
        );
      case 3:
        return (
          <PhilosophySection
            Section={designPhilosophy.HowToUse}
            key="HowToUse"
          />
        );
      default:
        return null;
    }
  };

  if (loading) return <Loader />;
  if (!designPhilosophy) return <VpnContentAlert title="Design Philosophy" />;

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
        title={designPhilosophy.Title || "Design Philosophy"}
        description={designPhilosophy.Description}
        assetURL={designPhilosophy.Video}
      />

      {/* Tab Section */}
      <ComponentTabs
        tabs={DesignPhilosophyTabs}
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

export default DesignPhilosophyPage;
