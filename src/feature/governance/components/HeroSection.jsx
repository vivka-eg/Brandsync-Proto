"use client";
import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import GovernanceVisualization from "@/components/shared/GovernanceVisualization";

const MotionBox = motion(Box);

const reviewSteps = [
  { phase: "Planning & Drafting", description: "Careful planning and comprehensive documentation", color: "#6366F1" },
  { phase: "Rigorous Review", description: "Quality checks and panel discussions", color: "#10B981" },
  { phase: "Iterative Refinement", description: "Systematic tracking and refinement cycles", color: "#8B5CF6" },
  { phase: "Final Publication", description: "Upload to BrandSync for team access", color: "#F59E0B" },
];

function HeroSection() {

  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 10, md: 16 },
        bgcolor: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* Background Gradient */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: {
            xs: "radial-gradient(800px 300px at 50% 0%, rgba(99,102,241,0.12), transparent)",
            md: "radial-gradient(1200px 400px at 50% 0%, rgba(99,102,241,0.12), transparent)",
          },
          pointerEvents: "none",
        }}
      />

      {/* Animated Grid Lines */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {/* Vertical Grid Lines */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
          <MotionBox
            key={`v-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0.15, 0] }}
            transition={{
              duration: 8,
              delay: index * 0.3,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            sx={{
              position: "absolute",
              left: `${(index * 100) / 7}%`,
              top: 0,
              bottom: 0,
              width: 1,
              background: "linear-gradient(to bottom, transparent, rgba(59,130,246,0.35) 50%, transparent)",
            }}
          />
        ))}

        {/* Horizontal Grid Lines */}
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <MotionBox
            key={`h-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.15, 0.15, 0] }}
            transition={{
              duration: 8,
              delay: index * 0.4 + 1,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            sx={{
              position: "absolute",
              top: `${(index * 100) / 5}%`,
              left: 0,
              right: 0,
              height: 1,
              background: "linear-gradient(to right, transparent, rgba(59,130,246,0.35) 50%, transparent)",
            }}
          />
        ))}

        {/* Diagonal Grid Lines - Top Left to Bottom Right */}
        {[0, 1, 2].map((index) => (
          <MotionBox
            key={`d1-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.12, 0.12, 0] }}
            transition={{
              duration: 10,
              delay: index * 0.5 + 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
            sx={{
              position: "absolute",
              left: `${index * 30}%`,
              top: 0,
              width: 1,
              height: "141.4%", // sqrt(2) * 100% for diagonal
              transformOrigin: "top left",
              transform: "rotate(45deg)",
              background: "linear-gradient(to bottom, transparent, rgba(59,130,246,0.25) 50%, transparent)",
            }}
          />
        ))}
      </Box>

      {/* Animated Blue Orbs */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        {/* Orb 1 - Bright Indigo Blue */}
        <MotionBox
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          sx={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: { xs: 200, md: 300 },
            height: { xs: 200, md: 300 },
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.08) 50%, transparent 100%)",
            filter: "blur(40px)",
          }}
        />

        {/* Orb 2 - Deep Blue */}
        <MotionBox
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          sx={{
            position: "absolute",
            top: "50%",
            right: "15%",
            width: { xs: 250, md: 350 },
            height: { xs: 250, md: 350 },
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(59,130,246,0.06) 50%, transparent 100%)",
            filter: "blur(50px)",
          }}
        />

        {/* Orb 3 - Light Sky Blue */}
        <MotionBox
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          sx={{
            position: "absolute",
            bottom: "15%",
            left: "20%",
            width: { xs: 180, md: 280 },
            height: { xs: 180, md: 280 },
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(96,165,250,0.15) 0%, rgba(96,165,250,0.05) 50%, transparent 100%)",
            filter: "blur(45px)",
          }}
        />

        {/* Orb 4 - Royal Blue */}
        <MotionBox
          animate={{
            x: [0, -70, 0],
            y: [0, 50, 0],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 23,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          sx={{
            position: "absolute",
            top: "30%",
            right: "5%",
            width: { xs: 150, md: 250 },
            height: { xs: 150, md: 250 },
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.14) 0%, rgba(37,99,235,0.04) 50%, transparent 100%)",
            filter: "blur(35px)",
          }}
        />

        {/* Orb 5 - Cyan Blue */}
        <MotionBox
          animate={{
            x: [0, 90, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          sx={{
            position: "absolute",
            bottom: "20%",
            right: "25%",
            width: { xs: 160, md: 260 },
            height: { xs: 160, md: 260 },
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,211,238,0.12) 0%, rgba(34,211,238,0.04) 50%, transparent 100%)",
            filter: "blur(40px)",
          }}
        />

        {/* Orb 6 - Soft Periwinkle */}
        <MotionBox
          animate={{
            x: [0, -50, 0],
            y: [0, 70, 0],
            scale: [1, 1.18, 1],
          }}
          transition={{
            duration: 21,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          sx={{
            position: "absolute",
            top: "60%",
            left: "5%",
            width: { xs: 170, md: 270 },
            height: { xs: 170, md: 270 },
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(129,140,248,0.16) 0%, rgba(129,140,248,0.05) 50%, transparent 100%)",
            filter: "blur(42px)",
          }}
        />

        {/* Orb 7 - Azure Blue */}
        <MotionBox
          animate={{
            x: [0, 80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0,
          }}
          sx={{
            position: "absolute",
            top: "20%",
            left: "38%",
            width: { xs: 240, md: 380 },
            height: { xs: 240, md: 380 },
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,0.3) 0%, rgba(56,189,248,0.15) 50%, transparent 100%)",
            filter: "blur(60px)",
          }}
        />

        {/* Orb 8 - Electric Blue */}
        <MotionBox
          animate={{
            x: [0, -70, 0],
            y: [0, 50, 0],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 19,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0,
          }}
          sx={{
            position: "absolute",
            bottom: "8%",
            right: "12%",
            width: { xs: 250, md: 370 },
            height: { xs: 250, md: 370 },
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(14,165,233,0.32) 0%, rgba(14,165,233,0.16) 50%, transparent 100%)",
            filter: "blur(65px)",
          }}
        />
      </Box>


      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            textAlign: "center",
            maxWidth: { xs: "100%", md: "800px", lg: "900px" },
            mx: "auto",
            py: 2,
          }}
        >
            <Typography
              variant="h1"
              fontWeight={800}
              sx={{
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem", lg: "5.5rem" },
                color: "#000000",
                mb: 3,
                lineHeight: 1.1,
              }}
            >
               UX Governance
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", md: "1.125rem" },
                color: "#374151",
                lineHeight: 1.8,
                mb: 2,
                fontWeight: 500,
              }}
            >
              UX Governance is the framework that ensures design consistency, quality, and strategic alignment across all products and teams, without slowing down innovation.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "0.9375rem", md: "1rem" },
                color: "#4B5563",
                lineHeight: 1.7,
                mb: 5,
              }}
            >
              Think of it as the guardrails that keep everyone moving in the same direction while still allowing teams the freedom to innovate and solve problems creatively.
            </Typography>

            {/* Review Process Animation - Governance Visualization */}
            <Box
              sx={{
                width: "100%",
                maxWidth: { xs: "100%", md: "700px" },
                mx: "auto",
                mt: 6,
                p: { xs: 2, md: 3 },
                bgcolor: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                border: "1px solid rgba(229, 231, 235, 0.6)",
              }}
            >
              <GovernanceVisualization processSteps={reviewSteps} />
            </Box>
        </MotionBox>
      </Container>
    </Box>
  );
}

export default HeroSection;
