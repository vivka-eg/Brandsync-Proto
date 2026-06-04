import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "motion/react";
import ShimmerOverlay from "./ShimmerOverlay";

function NavigationHeaderMockup({ logo, brandColor }) {
  const [showShimmer, setShowShimmer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const logoURL = logo?.assets?.dark.horizontal;
  // console.log();

  useEffect(() => {
    setShowShimmer(true);
    const timer = setTimeout(() => {
      setShowShimmer(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [logo.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
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
      transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      <Box sx={{ width: "100%", mb: 4 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Navigation Header
        </Typography>

        <Box
          sx={{
            borderTop: "10px solid #E5E7EB",
            borderLeft: "10px solid #E5E7EB",
            borderRight: "10px solid #E5E7EB",
            borderRadius: "24px 24px 0 0",
            overflow: "hidden",
          }}
        >
          {/* Navigation Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
              py: 2,
              bgcolor: "white",
            }}
          >
            {/* Left side - Logo, brand name, and nav links */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: "auto",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={logoURL}
                    alt={logo.name}
                    style={{
                      width: "auto",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                  {showShimmer && <ShimmerOverlay />}
                </Box>
                {/* <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{ color: "#1F2937" }}
                >
                  EG Infodoc
                </Typography> */}
              </Box>

              {/* Nav links */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: brandColor,
                    fontWeight: 500,
                    borderBottom: `2px solid ${brandColor}`,
                    pb: 0.4,
                    mt: 0.6,
                  }}
                >
                  Home
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#6B7280", fontWeight: 500 }}
                >
                  About
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#6B7280", fontWeight: 500 }}
                >
                  Statistics
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#6B7280", fontWeight: 500 }}
                >
                  Pricing
                </Typography>
              </Box>
            </Box>

            {/* Right side - Icons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                    stroke="#6B7280"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Box>
              <Box
                sx={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #E5E7EB",
                }}
              >
                <img
                  src="https://i.pravatar.cc/150?img=12"
                  alt="User Avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Content Area Below */}
          <Box sx={{ mt: 2, display: "flex", gap: 2, px: 2 }}>
            <Box
              sx={{
                flex: 1,
                height: "160px",
                bgcolor: "#E5E7EB",
                borderRadius: "8px 8px 0 0",
              }}
            />
            <Box
              sx={{
                width: "200px",
                height: "160px",
                bgcolor: "#E5E7EB",
                borderRadius: "8px 8px 0 0",
              }}
            />
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}

export default NavigationHeaderMockup;
