"use client";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import AvatarImage from "./AvatarImage";

const MotionBox = motion(Box);

function AnimatedAvatarSection() {
  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Box
        sx={{
          position: "relative",
          borderRadius: 4,
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(99, 102, 241, 0.08) 100%)",
          border: "1px solid rgba(229, 231, 235, 0.6)",
          py: { xs: 4, md: 6 },
          overflow: "hidden",
          minHeight: { xs: "200px", md: "250px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Avatar Rows Container */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 3,
            py: { xs: 4, md: 6 },
          }}
        >
          {/* First Row - Scrolling Left */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              animation: "scroll-avatars-left 30s linear infinite",
              "@keyframes scroll-avatars-left": {
                "0%": {
                  transform: "translateX(0)",
                },
                "100%": {
                  transform: "translateX(-50%)",
                },
              },
            }}
          >
            {/* Duplicate avatars for seamless loop */}
            {[...Array(2)].map((_, setIdx) => (
              <Box key={setIdx} sx={{ display: "flex", gap: 3 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <Box
                    key={num}
                    sx={{
                      position: "relative",
                      width: { xs: 60, md: 70 },
                      height: { xs: 60, md: 70 },
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "3px solid #228B57",
                      boxShadow: "0 4px 12px rgba(34, 139, 87, 0.2)",
                      flexShrink: 0,
                      bgcolor: "#FFFFFF",
                    }}
                  >
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${num + setIdx * 12}&mouth=smile,default&eyes=happy,default`}
                      alt={`User ${num}`}
                      num={num}
                    />
                  </Box>
                ))}
              </Box>
            ))}
          </Box>

          {/* Second Row - Scrolling Left (slightly slower) */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              animation: "scroll-avatars-left-slow 35s linear infinite",
              "@keyframes scroll-avatars-left-slow": {
                "0%": {
                  transform: "translateX(0)",
                },
                "100%": {
                  transform: "translateX(-50%)",
                },
              },
            }}
          >
            {/* Duplicate avatars for seamless loop */}
            {[...Array(2)].map((_, setIdx) => (
              <Box key={setIdx} sx={{ display: "flex", gap: 3 }}>
                {[13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((num) => (
                  <Box
                    key={num}
                    sx={{
                      position: "relative",
                      width: { xs: 60, md: 70 },
                      height: { xs: 60, md: 70 },
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "3px solid #228B57",
                      boxShadow: "0 4px 12px rgba(34, 139, 87, 0.2)",
                      flexShrink: 0,
                      bgcolor: "#FFFFFF",
                    }}
                  >
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${num + setIdx * 12}&mouth=smile,default&eyes=happy,default`}
                      alt={`User ${num}`}
                      num={num}
                    />
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Blurred gradient overlay - blur only in center */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        >
          {/* Blur layer with mask */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              maskImage: "radial-gradient(ellipse 600px 300px at center, black 2%, black 40%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse 600px 300px at center, black 0%, black 40%, transparent 75%)",
            }}
          />
          {/* Light blue gradient overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse 600px 300px at center, rgba(225, 240, 255, 0.95) 0%, rgba(200, 230, 255, 0.8) 40%, rgba(180, 220, 255, 0.4) 60%, transparent 75%)",
            }}
          />
        </Box>

        {/* Centered Text */}
        <Box
          sx={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            px: { xs: 3, md: 6 },
            maxWidth: "800px",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#111827",
              fontWeight: 800,
              fontSize: { xs: "1.25rem", md: "1.5rem" },
              lineHeight: 1.4,
              textShadow: "0 2px 4px rgba(255, 255, 255, 0.8)",
            }}
          >
            Alone we can do so little,
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "#111827",
              fontWeight: 800,
              fontSize: { xs: "1.25rem", md: "1.5rem" },
              lineHeight: 1.4,
              textShadow: "0 2px 4px rgba(255, 255, 255, 0.8)",
              mt: 0.5,
            }}
          >
            together we can do so much.
          </Typography>
        </Box>
      </Box>
    </MotionBox>
  );
}

export default AnimatedAvatarSection;


