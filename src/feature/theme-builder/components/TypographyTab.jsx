"use client";
import { Stack } from "@mui/material";
import { TypographySection } from "./TypographyComponents";
import { viewportTabs, typographyData } from "../constants";
import DeviceTypes from "@/components/shared/DeviceTabs";

const TypographyTab = ({ viewportTab, onViewportChange }) => {
  return (
    <Stack gap={3}>
      {/* Viewport Tabs */}
      <DeviceTypes
        active={viewportTab}
        setActive={onViewportChange}
        deviceTypes={viewportTabs.map((item) => ({
          label: item.label,
          value: item.value,
        }))}
        sx={{ width: "265px" }}
      />

      <Stack>
        {/* Display Section */}
        <TypographySection
          key={`display-${viewportTab}`}
          title="Display"
          items={typographyData[viewportTab].display}
        />

        {/* Headings Section */}
        <TypographySection
          key={`headings-${viewportTab}`}
          title="Headings"
          items={typographyData[viewportTab].headings}
        />

        {/* Body Section */}
        <TypographySection
          key={`body-${viewportTab}`}
          title="Body"
          items={typographyData[viewportTab].body}
        />

        {/* Caption Section */}
        <TypographySection
          key={`caption-${viewportTab}`}
          title="Caption"
          items={typographyData[viewportTab].caption}
        />
      </Stack>
    </Stack>
  );
};

export default TypographyTab;
