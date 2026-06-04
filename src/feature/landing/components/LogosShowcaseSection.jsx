"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box, Stack, Typography, Button, Alert, AlertTitle } from "@mui/material";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { WifiSlash } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { zoomInView, animateTextZoomIn } from "@/utils/animations";
import { getProductLogos } from "@/api/design-system/product-logos";

gsap.registerPlugin(ScrollTrigger);

const MotionBox = motion(Box);

export default function LogosShowcaseSection() {
  const router = useRouter();
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const [logos, setLogos] = useState([]);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const titleAnim = animateTextZoomIn(gsap, titleRef.current);
    const descAnim = animateTextZoomIn(gsap, descRef.current, { delay: 0.1 });

    return () => {
      titleAnim?.kill();
      descAnim?.kill();
    };
  }, []);

  useEffect(() => {
    getProductLogos({ pageSize: 100 })
      .then(({ data }) => setLogos(data))
      .catch(() => setFetchError(true));
  }, []);

  const handleExplore = () => {
    router.push("/logos");
  };

  return (
    <Box
      sx={{
        position: "relative",
        background: "linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)",
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 6 },
        overflow: "hidden",
      }}
    >
      <Box
        sx={{ maxWidth: "1200px", mx: "auto", position: "relative", zIndex: 2 }}
      >
        <Stack
          spacing={2}
          alignItems="center"
          textAlign="center"
          sx={{ mb: 6 }}
        >
          <Typography
            ref={titleRef}
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2rem", md: "2.75rem", lg: "3rem" },
              lineHeight: 1.2,
              color: "#212529",
            }}
          >
            Download EG Product Logos
          </Typography>
          <Typography
            ref={descRef}
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", md: "1.2rem" },
              color: "#6c757d",
              lineHeight: 1.8,
              maxWidth: "800px",
              mx: "auto",
            }}
          >
            Download your EG product logo, preview on different screens and
            devices. See how it looks on brand colors and neutral backgrounds.
          </Typography>
        </Stack>

        {/* Scrolling logos container */}
        {fetchError && (
          <Alert severity="warning" icon={<WifiSlash size={20} />} sx={{ mb: 4 }}>
            <AlertTitle>VPN connection required</AlertTitle>
            This content is only accessible on the EG network. Make sure
            you&apos;re connected to the <strong>EG VPN</strong> and then refresh the page.
          </Alert>
        )}
        <Box
          sx={{
            overflow: "hidden",
            py: 2,
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "fit-content",
              animation: "scroll 60s linear infinite",
              willChange: "transform",
              "&:hover": {
                animationPlayState: "paused",
              },
              "@keyframes scroll": {
                "0%": {
                  transform: "translateX(0)",
                },
                "100%": {
                  transform: "translateX(-50%)",
                },
              },
            }}
          >
            {/* Duplicate logos for seamless infinite scroll */}
            {[...logos, ...logos].map((logo, index) => (
              <Box
                key={`${logo.id}-${index}`}
                onClick={handleExplore}
                sx={{
                  flexShrink: 0,
                  width: 140,
                  height: 140,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05) translateY(-8px)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={logo.assets.logo}
                    alt={logo.name}
                    width={80}
                    height={80}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 600,
                    color: "#374151",
                    textAlign: "center",
                    px: 1,
                    fontSize: "0.75rem",
                  }}
                >
                  {logo.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* CTA Button */}
        <Box sx={{ textAlign: "center" }}>
          <MotionBox {...zoomInView}>
            <Button
              variant="contained"
              size="large"
              onClick={handleExplore}
              sx={{
                bgcolor: "#000000",
                color: "#ffffff",
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 700,
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                "&:hover": {
                  bgcolor: "#1a1a1a",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Download Logos
            </Button>
          </MotionBox>
        </Box>
      </Box>
    </Box>
  );
}
