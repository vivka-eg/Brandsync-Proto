"use client";
import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, CircularProgress, Fade, Button } from "@mui/material";
import { getComponents } from "@/api/design-system/component-list";
import Loader from "@/components/shared/Loader";
import VpnContentAlert from "@/components/shared/VpnContentAlert";
import { FigmaLogo } from "phosphor-react";
import { getStrapiURL, getSignedUrl } from "@/strapi/utils";
import Link from "next/link";
import TopHeader from "@/components/shared/TopHeader";

export default function Components() {
  const [componentData, setComponentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signedUrls, setSignedUrls] = useState({});
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    getComponents().then((data) => {
      setComponentData(data?.error ? null : (data ?? null));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!componentData) return;
    // Get signed URLs for all component images
    const allComponents = Object.values(componentData).flat();
    allComponents.forEach(async (comp) => {
      const imageUrl = getStrapiURL(comp.image);
      if (imageUrl) {
        const signedUrl = await getSignedUrl(imageUrl);
        setSignedUrls((prev) => ({
          ...prev,
          [comp.title]: signedUrl,
        }));
      }
    });
  }, [componentData]);

  if (loading) return <Loader />;
  if (!componentData) return <VpnContentAlert title="Components" />;

  // Flatten all components from all categories into a single array
  const allComponents = Object.values(componentData).flat();

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
        title="Components"
        description="Collection of all available UI components on BrandSync"
        assetURL="/component/components.svg"
        relativePath
      />

      {/* Figma Kit CTA */}
      <Fade in timeout={300}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#F0F4F8",
            borderRadius: 3,
            p: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FigmaLogo size={32} weight="fill" color="#1E1E1E" />
            <Box>
              <Typography variant="h6" fontWeight={600} color="text.primary">
                Get the BrandSync Figma Kit
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Access all components in Figma and start designing today
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            href="/figma-kit"
            component={Link}
            size="medium"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
              background: "linear-gradient(135deg, #424242 0%, #1a1a1a 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #1a1a1a 0%, #000000 100%)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
              },
              transition: "all 0.3s ease",
            }}
          >
            View Figma Kit
          </Button>
        </Box>
      </Fade>

      {/* Component Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {allComponents.map((comp, index) => (
          <Fade in timeout={400 + index * 100} key={index}>
            <Link
              href={`/design-system/components/${encodeURIComponent(comp.title)}`}
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                  cursor: "pointer",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                {/* Component Preview Card */}
                <Box
                  sx={{
                    bgcolor: "#F0F4F8",
                    borderRadius: 3,
                    overflow: "hidden",
                    aspectRatio: "4/3",
                    display: "flex",
                    alignItems: ["Buttons", "Pagination", "Toolbar"].includes(comp.title)
                      ? "flex-start"
                      : "flex-end",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {(!signedUrls[comp.title] || !loadedImages[comp.title]) && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <CircularProgress size={32} />
                    </Box>
                  )}
                  {signedUrls[comp.title] && (
                    <img
                      src={signedUrls[comp.title]}
                      alt={comp.title}
                      onLoad={() =>
                        setLoadedImages((prev) => ({
                          ...prev,
                          [comp.title]: true,
                        }))
                      }
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "contain",
                        display: "block",
                        opacity: loadedImages[comp.title] ? 1 : 0,
                        transition: "opacity 0.3s ease-in-out",
                      }}
                    />
                  )}
                </Box>

                {/* Component Name */}
                <Typography
                  variant="body1"
                  fontWeight={500}
                  color="text.primary"
                >
                  {comp.title}
                </Typography>
              </Box>
            </Link>
          </Fade>
        ))}
      </Box>
    </Stack>
  );
}
