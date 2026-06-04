"use client";
import { Stack } from "@mui/material";
import React, { useMemo } from "react";
import ExampleScreen from "./example-screens/ExampleScreen";
import LoginScreenPreview from "./example-screens/LoginScreenPreview";
import FormPagePreview from "./example-screens/FormPagePreview";
import DashboardPreview from "./example-screens/DashboardPreview";
import LocationsPreview from "./example-screens/LocationsPreview";

function ExampleScreens({ primaryColor, selectedColor, firstMatchingLogo }) {
  const exampleScreens = useMemo(() => {
    return [
      {
        name: "Login screen",
        PreviewComponent: (
          <LoginScreenPreview
            primaryColor={primaryColor}
            selectedColor={selectedColor}
          />
        ),
      },
      {
        name: "Dashboard",
        PreviewComponent: (
          <DashboardPreview
            primaryColor={primaryColor}
            selectedColor={selectedColor}
          />
        ),
      },
      {
        name: "Form Page",
        PreviewComponent: (
          <FormPagePreview
            primaryColor={primaryColor}
            selectedColor={selectedColor}
          />
        ),
      },
      {
        name: "Locations",
        PreviewComponent: (
          <LocationsPreview
            primaryColor={primaryColor}
            selectedColor={selectedColor}
          />
        ),
      },
    ];
  }, [primaryColor, selectedColor]);
  return (
    <Stack gap={8}>
      {exampleScreens.map(({ name, PreviewComponent }) => (
        <ExampleScreen key={name} name={name} firstMatchingLogo={firstMatchingLogo}>
          {PreviewComponent && PreviewComponent}
        </ExampleScreen>
      ))}
    </Stack>
  );
}

export default ExampleScreens;
