import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { motion } from "motion/react";
import ShimmerOverlay from "./ShimmerOverlay";
import { BatteryFull, CellSignalHigh, WifiHigh } from "phosphor-react";
import { CelluarFull, WifiFull } from "@/components/icons";

export const StatusBar = ({ color = "#fff" }) => (
  <Stack
    gap={2}
    alignItems="center"
    justifyContent="space-between"
    direction="row"
    sx={{
      px: "20px",
      py: "10px",
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 10,
    }}
  >
    <Typography sx={{ color: color, fontSize: "10px" }}>9:46</Typography>

    <Stack
      direction="row"
      sx={{ color: color, alignItems: "center", gap: "6px" }}
    >
      <CellSignalHigh height={12} width={12} />
      <WifiHigh height={12} width={12} />
      <BatteryFull height={12} width={12} />
    </Stack>
  </Stack>
);

function SplashScreenMockup({ logo, brandColor }) {
  const [showShimmer, setShowShimmer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [displayedLogo, setDisplayedLogo] = useState(logo);
  const [displayedColor, setDisplayedColor] = useState(brandColor);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRef = useRef(null);

  // Handle logo changes with transition
  useEffect(() => {
    if (logo.id !== displayedLogo.id) {
      setIsTransitioning(true);
      const transitionTimer = setTimeout(() => {
        setDisplayedLogo(logo);
        setIsTransitioning(false);

        // Trigger shimmer after transition completes
        setShowShimmer(true);
        const shimmerTimer = setTimeout(() => {
          setShowShimmer(false);
        }, 800);

        return () => clearTimeout(shimmerTimer);
      }, 300);
      return () => clearTimeout(transitionTimer);
    }
  }, [logo.id, displayedLogo.id]);

  // Handle color changes smoothly and trigger shimmer
  useEffect(() => {
    setDisplayedColor(brandColor);

    // Trigger shimmer on color change
    setShowShimmer(true);
    const timer = setTimeout(() => {
      setShowShimmer(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [brandColor]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      <Box sx={{ width: "100%", mb: 4 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Splash Screen
        </Typography>

        <Box>
          {/* First Row */}
          <Stack direction="row" spacing={4} justifyContent="center" mb={4}>
            {/* Dark Background with Icon + Text (Horizontal) */}
            <motion.div
              animate={{
                backgroundColor: displayedColor,
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{
                width: "220px",
                height: "450px",
                borderRadius: "10px",
                border: "8px solid #E5E7EB",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StatusBar />

              {/* Logo */}
              <motion.img
                key={displayedLogo.id + "-horizontal-light"}
                src={displayedLogo.assets.light.horizontal}
                alt={displayedLogo.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: isTransitioning ? 0 : 1,
                  scale: isTransitioning ? 0.9 : 1,
                }}
                transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
                style={{
                  width: `${
                    displayedLogo.sizes.horizontalSizes?.width || 190
                  }px`,
                  height: `${
                    displayedLogo.sizes.horizontalSizes?.height || 90
                  }px`,
                  marginLeft: `${
                    displayedLogo.sizes.horizontalSizes?.marginLeft || 0
                  }px`,
                  objectFit: "contain",
                  display: "block",
                }}
              />

              {showShimmer && <ShimmerOverlay />}

              {/* Home Indicator */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "100px",
                  height: "4px",
                  bgcolor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: "2px",
                }}
              />
            </motion.div>

            {/* Light Background with Icon + Text */}
            <Box
              sx={{
                width: "220px",
                height: "450px",
                borderRadius: "10px",
                border: "8px solid #E5E7EB",
                bgcolor: "white",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StatusBar color="#000" />

              {/* Logo */}
              <motion.img
                key={displayedLogo.id + "-horizontal-dark"}
                src={displayedLogo.assets.dark.horizontal}
                alt={displayedLogo.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: isTransitioning ? 0 : 1,
                  scale: isTransitioning ? 0.9 : 1,
                }}
                transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
                style={{
                  width: `${
                    displayedLogo.sizes.horizontalSizes?.width || 190
                  }px`,
                  height: `${
                    displayedLogo.sizes.horizontalSizes?.height || 90
                  }px`,
                  marginLeft: `${
                    displayedLogo.sizes.horizontalSizes?.marginLeft || 0
                  }px`,
                  objectFit: "contain",
                  display: "block",
                }}
              />

              {showShimmer && <ShimmerOverlay />}

              {/* Home Indicator */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "100px",
                  height: "4px",
                  bgcolor: "#D1D5DB",
                  borderRadius: "2px",
                }}
              />
            </Box>

            {/* Light Background with Background Image */}
            <Box
              sx={{
                width: "220px",
                height: "450px",
                borderRadius: "10px",
                border: "8px solid #E5E7EB",
                bgcolor: "#B4B4B4",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  zIndex: 1,
                },
              }}
            >
              <StatusBar />

              {/* Logo */}
              <Box
                sx={{
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <motion.img
                  key={displayedLogo.id + "-horizontal-negative"}
                  src={displayedLogo.assets.negative.horizontal}
                  alt={displayedLogo.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: isTransitioning ? 0 : 1,
                    scale: isTransitioning ? 0.9 : 1,
                  }}
                  transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
                  style={{
                    width: `${
                      displayedLogo.sizes.horizontalSizes?.width || 190
                    }px`,
                    height: `${
                      displayedLogo.sizes.horizontalSizes?.height || 90
                    }px`,
                    marginLeft: `${
                      displayedLogo.sizes.horizontalSizes?.marginLeft || 0
                    }px`,
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </Box>

              {showShimmer && <ShimmerOverlay />}

              {/* Home Indicator */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "100px",
                  height: "4px",
                  bgcolor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: "2px",
                  zIndex: 10,
                }}
              />
            </Box>
          </Stack>

          {/* Second Row */}
          <Stack direction="row" spacing={4} justifyContent="center">
            {/* Dark Background with Icon + Text (Vertical) */}
            <motion.div
              animate={{
                backgroundColor: displayedColor,
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{
                width: "220px",
                height: "450px",
                borderRadius: "10px",
                border: "8px solid #E5E7EB",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StatusBar />

              {/* Logo */}
              <motion.img
                key={displayedLogo.id + "-vertical-light"}
                src={displayedLogo.assets.light.vertical}
                alt={displayedLogo.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: isTransitioning ? 0 : 1,
                  scale: isTransitioning ? 0.9 : 1,
                }}
                transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
                style={{
                  width: `${displayedLogo.sizes.verticalSizes?.width || 140}px`,
                  height: `${
                    displayedLogo.sizes.verticalSizes?.height || 180
                  }px`,
                  marginLeft: `${
                    displayedLogo.sizes.verticalSizes?.marginLeft || 0
                  }px`,
                  objectFit: "contain",
                  display: "block",
                }}
              />

              {showShimmer && <ShimmerOverlay />}

              {/* Home Indicator */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "100px",
                  height: "4px",
                  bgcolor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: "2px",
                }}
              />
            </motion.div>

            {/* Light Background with Icon + Text (Vertical) */}
            <Box
              sx={{
                width: "220px",
                height: "450px",
                borderRadius: "10px",
                border: "8px solid #E5E7EB",
                bgcolor: "white",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <StatusBar color="#000" />

              {/* Logo */}
              <motion.img
                key={displayedLogo.id + "-vertical-dark"}
                src={displayedLogo.assets.dark.vertical}
                alt={displayedLogo.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: isTransitioning ? 0 : 1,
                  scale: isTransitioning ? 0.9 : 1,
                }}
                transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
                style={{
                  width: `${displayedLogo.sizes.verticalSizes?.width || 140}px`,
                  height: `${
                    displayedLogo.sizes.verticalSizes?.height || 180
                  }px`,
                  marginLeft: `${
                    displayedLogo.sizes.verticalSizes?.marginLeft || 0
                  }px`,
                  objectFit: "contain",
                  display: "block",
                }}
              />

              {showShimmer && <ShimmerOverlay />}

              {/* Home Indicator */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "100px",
                  height: "4px",
                  bgcolor: "#D1D5DB",
                  borderRadius: "2px",
                }}
              />
            </Box>

            {/* Light Background with Background Image - Alternative */}
            <Box
              sx={{
                width: "220px",
                height: "450px",
                borderRadius: "10px",
                border: "8px solid #E5E7EB",
                bgcolor: "#B4B4B4",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  zIndex: 1,
                },
              }}
            >
              <StatusBar />

              {/* Logo with Brand Color */}
              <Box
                sx={{
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <motion.img
                  key={displayedLogo.id + "-vertical-negative"}
                  src={displayedLogo.assets.negative.vertical}
                  alt={displayedLogo.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: isTransitioning ? 0 : 1,
                    scale: isTransitioning ? 0.9 : 1,
                  }}
                  transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
                  style={{
                    width: `${
                      displayedLogo.sizes.verticalSizes?.width || 140
                    }px`,
                    height: `${
                      displayedLogo.sizes.verticalSizes?.height || 180
                    }px`,
                    marginLeft: `${
                      displayedLogo.sizes.verticalSizes?.marginLeft || 0
                    }px`,
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </Box>

              {showShimmer && <ShimmerOverlay />}
              {/* Home Indicator */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 8,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "100px",
                  height: "4px",
                  bgcolor: "rgba(255, 255, 255, 0.5)",
                  borderRadius: "2px",
                  zIndex: 10,
                }}
              />
            </Box>
          </Stack>

        </Box>
      </Box>
    </motion.div>
  );
}

export default SplashScreenMockup;
