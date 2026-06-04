"use client";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";
import TopHeader from "@/components/shared/TopHeader";
import VpnContentAlert from "@/components/shared/VpnContentAlert";
import Loader from "@/components/shared/Loader";
import { Stack, Alert } from "@mui/material";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getIndividualFoundationPage } from "@/api/design-system/foundations";

function toTitleCase(slug) {
  return slug
    ?.replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function IndividualFoundationPage({ initialData: propData, slug: propSlug }) {
  const params = useParams();
  const slug = propSlug ?? (params?.id ? decodeURIComponent(params.id) : "");
  const [initialData, setInitialData] = useState(propData ?? null);
  const [loading, setLoading] = useState(!propData);

  useEffect(() => {
    if (propData) return;
    if (!slug) return;
    const title = toTitleCase(slug);
    getIndividualFoundationPage(title).then((result) => {
      setInitialData(Array.isArray(result) && !result?.error ? (result[0] ?? null) : null);
      setLoading(false);
    });
  }, [slug, propData]);

  if (loading) return <Loader />;

  if (!initialData?.Article) {
    return <VpnContentAlert title={toTitleCase(slug)} />;
  }

  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        p: 1,
        bgcolor: "background.default",
        paddingBottom: "100px",
      }}
    >
      <TopHeader
        title={initialData.Article.Title}
        description={initialData.Article.Description}
        assetURL={initialData.Article.Video}
      />

      {slug === "colors" && (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Need to check your color contrast? Use our{" "}
          <Link href="/design-system/accessible-palettes" style={{ fontWeight: 600, color: "inherit" }}>
            Accessible Palettes tool
          </Link>{" "}
          to automatically generate compliant combinations.
        </Alert>
      )}

      {slug === "typography" && (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          Want to see these fonts in action? Head over to the{" "}
          <Link href="/theme-builder" style={{ fontWeight: 600, color: "inherit" }}>
            Theme Builder
          </Link>{" "}
          to preview typography on real components.
        </Alert>
      )}

      {initialData.Article.Blocks.map(({ Content }, index) => (
        <MarkdownRenderer content={Content} key={index} />
      ))}
    </Stack>
  );
}

export default IndividualFoundationPage;
