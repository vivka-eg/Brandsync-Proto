"use client";
import ComponentTabs from "@/components/shared/ComponentTabs";
import { Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { MANAGE_ICONS_TABS } from "@/constants/assets";
import AllIcons from "./components/manage/AllIcons";
import Categories from "./components/manage/Categories";
import IconTypes from "./components/manage/IconTypes";

function ManageIcons() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (_, newValue) => {
    setCurrentTab(newValue);
  };

  const renderCurrentTabContent = () => {
    switch (currentTab) {
      case 0:
        return <AllIcons />;
      case 1:
        return <Categories />;
      case 2:
        return <IconTypes />;
      default:
        return null;
    }
  };

  return (
    <Stack spacing="24px">
      <Typography variant="h5" fontWeight={700}>
        Manage Icons
      </Typography>

      <Stack spacing="24px">
        <ComponentTabs
          tabs={MANAGE_ICONS_TABS}
          currentTab={currentTab}
          onChange={handleTabChange}
        />

        {renderCurrentTabContent()}
      </Stack>
    </Stack>
  );
}

export default ManageIcons;
