"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import TopHeader from "@/components/shared/TopHeader";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";
import { getIntroduction } from "@/api/design-system/introduction";
import Loader from "@/components/shared/Loader";
import VpnContentAlert from "@/components/shared/VpnContentAlert";
import { Stack } from "@mui/material";
import { getOldLogoPlacement } from "@/api/design-system/old-logo-placement";

export default function IntroductionPage() {
  const [oldLogoPlacement, setOldLogoPlacement] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOldLogoPlacement().then((data) => {
      if (data.error) {
        setLoading(false);
        return;
      }
      setOldLogoPlacement(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!oldLogoPlacement || !oldLogoPlacement.Article) {
    return <VpnContentAlert title="Old Logo Placement" />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        p: 1,
        bgcolor: "background.default",
        // width: "calc(100vw - 280px)",
        pb: "130px",
      }}
    >
      {/* Header Section */}
      <TopHeader
        title={oldLogoPlacement.Article?.Title || "Old Logo Placement"}
        description={oldLogoPlacement.Article?.Description || ""}
        assetURL={oldLogoPlacement.Article?.Video}
      />

      <Stack gap={"64px"}>
        {/* Main Content Section */}
        <Stack gap={"64px"}>
          {oldLogoPlacement.Article?.Blocks?.map((block, index) => (
            <MarkdownRenderer content={block.Content} key={index} />
          )) || (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No content blocks available
              </Typography>
            </Box>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
