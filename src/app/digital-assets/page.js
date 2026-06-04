"use client";
import React, { useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Chip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ImageSquare, Cube, VideoCamera, MegaphoneSimple } from "@phosphor-icons/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAppEnv } from "@/hooks/useAppEnv";

const MotionCard = motion(Card);

export default function DigitalAssetsPage() {
  const router = useRouter();
  const { isDev } = useAppEnv();

  const assetCategories = useMemo(
    () => [
      {
        id: "stock-images",
        title: "Stock Images",
        description:
          "Browse and download high-quality images organized by business unit",
        icon: ImageSquare,
        href: "/digital-assets/stock-images",
        color: "#1976d2",
        comingSoon: false,
      },
      {
        id: "icons",
        title: "Icons",
        description:
          "Download brand-approved icons for your applications and presentations",
        icon: Cube,
        href: "/digital-assets/icons",
        color: "#7c3aed",
        comingSoon: false,
        isNew: true,
      },
      {
        id: "video",
        title: "Video",
        description:
          "Access promotional videos and motion graphics for your projects",
        icon: VideoCamera,
        href: "/digital-assets/video",
        color: "#dc2626",
        comingSoon: true,
      },
      ...(isDev ? [{
        id: "digital-ad-builder",
        title: "AD Studio",
        description:
          "Compose display ads with logos, stock imagery, and brand colors; export standard sizes",
        icon: MegaphoneSimple,
        href: "/digital-assets/digital-ad-builder",
        color: "#008280",
        comingSoon: false,
        isNew: true,
      }] : []),
    ],
    [isDev],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          py: { xs: 6, md: 10 },
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                fontWeight: 700,
                mb: 2,
              }}
            >
              Digital Assets
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", md: "1.2rem" },
                color: "text.secondary",
                maxWidth: 600,
                mx: "auto",
                lineHeight: 1.7,
              }}
            >
              Access and download brand-approved digital assets for your
              projects
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 4,
              justifyItems: "center",
            }}
          >
            {assetCategories.map((category) => {
              const Icon = category.icon;
              return (
                <MotionCard
                  key={category.id}
                  whileHover={category.comingSoon ? {} : { scale: 1.03, y: -4 }}
                  whileTap={category.comingSoon ? {} : { scale: 0.98 }}
                  sx={{
                    width: "100%",
                    maxWidth: 360,
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "box-shadow 0.3s ease",
                    opacity: category.comingSoon ? 0.7 : 1,
                    "&:hover": {
                      boxShadow: category.comingSoon
                        ? "0 4px 20px rgba(0, 0, 0, 0.08)"
                        : "0 8px 30px rgba(0, 0, 0, 0.12)",
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() =>
                      !category.comingSoon && router.push(category.href)
                    }
                    disabled={category.comingSoon}
                    sx={{
                      height: "100%",
                      cursor: category.comingSoon ? "default" : "pointer",
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        p: 4,
                        position: "relative",
                      }}
                    >
                      {category.comingSoon && (
                        <Chip
                          label="Coming Soon"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            bgcolor: "grey.800",
                            color: "white",
                            fontWeight: 600,
                            fontSize: "0.7rem",
                          }}
                        />
                      )}
                      {category.isNew && !category.comingSoon && (
                        <Chip
                          label="NEW"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 16,
                            right: 16,
                            bgcolor: category.color,
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "0.65rem",
                            letterSpacing: "0.08em",
                            height: 24,
                            "& .MuiChip-label": { px: 1.25, py: 0 },
                          }}
                        />
                      )}
                      <Box
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: 3,
                          bgcolor: `${category.color}15`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 3,
                        }}
                      >
                        <Icon
                          size={48}
                          color={category.color}
                          weight="duotone"
                        />
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          mb: 1.5,
                        }}
                      >
                        {category.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          lineHeight: 1.6,
                        }}
                      >
                        {category.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </MotionCard>
              );
            })}
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
