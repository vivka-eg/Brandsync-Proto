"use client";
import React, { useState, useEffect } from "react";
import { Box, Stack } from "@mui/material";
import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import TopHeader from "@/components/shared/TopHeader";
import { SingleComponentTabs } from "@/constants";
import ComponentTabs from "@/components/shared/ComponentTabs";
import VpnContentAlert from "@/components/shared/VpnContentAlert";
import Loader from "@/components/shared/Loader";
import { useLayoutContext } from "@/app/design-system/layout";
import { getComponentByName, getSingleTypeComponent } from "@/api/design-system/components";

const Overview = dynamic(() => import("./components/Overview"));
const Specifications = dynamic(() => import("./components/Specifications"));
const Usage = dynamic(() => import("./components/Usage"));
const Guidelines = dynamic(() => import("./components/Guidelines"));
const Accessibility = dynamic(() => import("./components/Accessibility"));
const CodeExamples = dynamic(() => import("./components/CodeExamples"));

function IndividualComponent({ initialData: propData }) {
  const params = useParams();
  const searchParams = useSearchParams();
  const [initialData, setInitialData] = useState(propData ?? null);
  const [loading, setLoading] = useState(!propData);
  const [currentTab, setCurrentTab] = useState(0);
  const { layoutRef } = useLayoutContext();

  useEffect(() => {
    if (propData) return;
    const id = params?.id;
    if (!id) return;
    const decodedName = decodeURIComponent(id);
    const isSingle = searchParams?.get("single") === "1";
    const fetcher = isSingle ? getSingleTypeComponent : getComponentByName;
    fetcher(decodedName).then((result) => {
      setInitialData(result?.error ? null : (result ?? null));
      setLoading(false);
    });
  }, [params?.id, searchParams, propData]);

  if (loading) return <Loader />;

  const handleTabChange = (_, newValue) => {
    setCurrentTab(newValue);
    layoutRef?.current?.scrollTo(0, 0);
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return <Overview Overview={initialData.Overview} />;
      case 1:
        return <Specifications Specification={initialData.Specification} />;
      case 2:
        return <Usage usage={initialData.Usage} />;
      case 3:
        return <Guidelines Guidelines={initialData.Guidelines} />;
      case 4:
        return <Accessibility Accessibility={initialData.Accessiblity} />;
      case 5:
        return <CodeExamples codeExamples={initialData.CodeExamples} specification={initialData.Specification} />;
      default:
        return null;
    }
  };

  if (!initialData) return <VpnContentAlert title="Component" />;

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
      <TopHeader
        title={initialData.Title}
        description={initialData.Description}
        assetURL={initialData.Image}
      />

      <Stack spacing="40px">
        <ComponentTabs
          tabs={SingleComponentTabs}
          currentTab={currentTab}
          onChange={handleTabChange}
        />

        <Box sx={{ display: "flex" }} role="tabpanel">
          <Box sx={{ flex: 1, p: 1 }}>
            {renderTabContent()}
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}

export default IndividualComponent;
