"use client";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "phosphor-react";
import MemberCard from "@/components/shared/MemberCard";
import GovernanceVisualization from "@/components/shared/GovernanceVisualization";
import { zoomInView, withDelay } from "@/utils/animations";

const MotionBox = motion(Box);

const members = [
  {
    name: "Petri Tolppanen",
    title: "Senior UX Designer",
    department: "Facility Management",
    businessUnit: "Facility Management"
  },
  {
    name: "Lukas Gavril Gnaur",
    title: "UX Designer",
    department: "Housing",
    businessUnit: "Housing"
  },
  {
    name: "Kavya Kommineni",
    title: "Junior UX Designer",
    department: "Industrials",
    businessUnit: "Industrials"
  },
  {
    name: "Børre Syvertsen Ødegaard",
    title: "Lead UX Designer",
    department: "Retail and Wholesale",
    businessUnit: "Retail and Wholesale"
  },
  {
    name: "Anton Karlkvist",
    title: "UX Designer",
    department: "EMS",
    businessUnit: "EMS"
  },
  {
    name: "Emil Semkuruto Løvø",
    title: "Senior UX Designer",
    department: "Payroll, Rostering & Finance",
    businessUnit: "Payroll, Rostering & Finance"
  },
  {
    name: "Adrian Finnanger",
    title: "Team Manager",
    department: "Retail & Wholesale",
    businessUnit: "Retail & Wholesale"
  },
  {
    name: "Sunniva Stuvøy Heggen",
    title: "UX Designer",
    department: "Healthcare",
    businessUnit: "Healthcare"
  },
  {
    name: "Rajshree Nautiyal",
    title: "UX Designer",
    department: "Industrials",
    businessUnit: "Industrials"
  },
  {
    name: "Lea Ruzicova",
    title: "UX Designer",
    department: "Industrials",
    businessUnit: "Industrials"
  },
  {
    name: "Gary Paul Smith",
    title: "Solutions Architect",
    department: "Transport Product Management",
    businessUnit: "Transport Product Management"
  },
  {
    name: "René Thorsted",
    title: "UX Designer",
    department: "EG Xena",
    businessUnit: "EG Xena"
  },
  {
    name: "Manjeeth Shenoy",
    title: "Program Manager",
    department: "Technology Integration & Transformation",
    businessUnit: "Technology Integration & Transformation"
  },
  {
    name: "Sasha Lara Dsouza",
    title: "Junior UX Designer",
    department: "Technology Integration & Transformation",
    businessUnit: "Technology Integration & Transformation"
  },
  {
    name: "Mehnaz Zahur",
    title: "Junior UX Designer",
    department: "Technology Integration & Transformation",
    businessUnit: "Technology Integration & Transformation"
  },
  {
    name: "Nishanth Shenoy",
    title: "Junior UX Designer",
    department: "Technology Integration & Transformation",
    businessUnit: "Technology Integration & Transformation"
  },
  {
    name: "Vignesh V Kamath",
    title: "Senior UX Designer",
    department: "Technology Integration & Transformation",
    businessUnit: "Technology Integration & Transformation"
  },
];

const processSteps = [
  {
    id: 1,
    phase: "Planning & Drafting",
    description: "Careful planning and comprehensive documentation",
    color: "#6366F1"
  },
  {
    id: 2,
    phase: "Rigorous Review",
    description: "Quality checks and panel discussions",
    color: "#8B5CF6"
  },
  {
    id: 3,
    phase: "Iterative Refinement",
    description: "Systematic tracking and refinement cycles",
    color: "#EC4899"
  },
  {
    id: 4,
    phase: "Final Publication",
    description: "Upload to BrandSync for team access",
    color: "#10B981"
  }
];

function GovernanceProcessFlow() {
  return (
    <Box sx={{
      position: "relative",
      p: { xs: 3, md: 5 },
      bgcolor: "rgba(255, 255, 255, 0.6)",
      borderRadius: 3,
      border: "1px solid rgba(229, 231, 235, 0.8)",
      boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
      backdropFilter: "blur(10px)",
    }}>
      {/* Two Column Section: Image + Content */}
      <Box
        sx={{
          display: { xs: "block", md: "grid" },
          gridTemplateColumns: { md: "1fr 1fr" },
          gap: { xs: 4, md: 6 },
          mb: 6,
          alignItems: "center",
        }}
      >
        {/* LEFT: Image/Illustration */}
        <MotionBox
          {...zoomInView}
          sx={{
            position: "relative",
            borderRadius: 4,
            overflow: "hidden",
            minHeight: { xs: "300px", md: "450px" },
            width: "100%",
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.08) 100%)",
            border: "1px solid rgba(229, 231, 235, 0.6)",
            p: { xs: 3, md: 4 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GovernanceVisualization processSteps={processSteps} />
        </MotionBox>

        {/* RIGHT: Content */}
        <MotionBox
          {...withDelay(zoomInView, 0.2)}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                color: "#111827",
                mb: 2,
                fontSize: { xs: "1.5rem", md: "1.75rem" },
                lineHeight: 1.3,
              }}
            >
              What is UX Governance?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#4B5563",
                mb: 2,
                lineHeight: 1.8,
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
UX Governance is a clear framework that keeps design consistent, high quality, and aligned across all EG products and teams.            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#4B5563",
                mb: 3,
                lineHeight: 1.8,
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
The EG UX Expert Panel reviews and approves design decisions to maintain strong standards while still allowing fast iteration and cross-functional collaboration.            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {processSteps.map((step, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: step.color,
                      flexShrink: 0,
                      mt: 0.5,
                    }}
                  />
                  <Box>
                    <Typography
                      variant="body1"
                      fontWeight={700}
                      sx={{
                        color: "#1F2937",
                        fontSize: { xs: "0.95rem", md: "1rem" },
                        mb: 0.25,
                      }}
                    >
                      {step.phase}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6B7280",
                        fontSize: { xs: "0.85rem", md: "0.9rem" },
                      }}
                    >
                      {step.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Button
              component={Link}
              href="/governance"
              sx={{
                mt: 3,
                borderRadius: 2,
                px: 2.6,
                py: 1.1,
                backgroundColor: "#111827",
                color: "#FFFFFF",
                textTransform: "none",
                fontWeight: 700,
                transition: "all 0.3s ease",
                '&:hover': {
                  backgroundColor: "#0b1220",
                  transform: "scale(1.05)",
                },
              }}
              endIcon={<ArrowRight size={18} />}
            >
              Read more
            </Button>
          </Box>
        </MotionBox>
      </Box>

      {/* Panel Members Section */}
      <Box sx={{ mt: 8 }}>
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{
            fontSize: { xs: "1.75rem", md: "2rem" },
            color: "#111827",
            mb: 2,
            textAlign: "center",
            letterSpacing: -0.5,
          }}
        >
          Meet our Expert Panel members
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: "1rem", md: "1.125rem" },
            color: "#6B7280",
            lineHeight: 1.8,
            maxWidth: "800px",
            mx: "auto",
            textAlign: "center",
            mb: 4,
          }}
        >
The governance panel combines expertise in design, research, accessibility, and product management to keep decisions aligned and high quality.        </Typography>

        {/* Two scrolling rows */}
        <Box sx={{ overflow: "hidden", mb: 4 }}>
          {/* First Row - Scroll Left */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              mb: 3,
              animation: "scroll-left 40s linear infinite",
              "@keyframes scroll-left": {
                "0%": {
                  transform: "translateX(0)",
                },
                "100%": {
                  transform: "translateX(-50%)",
                },
              },
              "&:hover": {
                animationPlayState: "paused",
              },
            }}
          >
            {/* Duplicate the first half of members twice for seamless loop */}
            {[...members.slice(0, Math.ceil(members.length / 2)), ...members.slice(0, Math.ceil(members.length / 2))].map((member, idx) => (
              <Box key={idx} sx={{ flexShrink: 0 }}>
                <MemberCard {...member} />
              </Box>
            ))}
          </Box>

          {/* Second Row - Scroll Right */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              animation: "scroll-right 40s linear infinite",
              "@keyframes scroll-right": {
                "0%": {
                  transform: "translateX(-50%)",
                },
                "100%": {
                  transform: "translateX(0)",
                },
              },
              "&:hover": {
                animationPlayState: "paused",
              },
            }}
          >
            {/* Duplicate the second half of members twice for seamless loop */}
            {[...members.slice(Math.ceil(members.length / 2)), ...members.slice(Math.ceil(members.length / 2))].map((member, idx) => (
              <Box key={idx} sx={{ flexShrink: 0 }}>
                <MemberCard {...member} />
              </Box>
            ))}
          </Box>
        </Box>

        {/* <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            component={Link}
            href="/team"
            sx={{
              borderRadius: 2,
              px: 2.6,
              py: 1.1,
              backgroundColor: "#111827",
              color: "#FFFFFF",
              textTransform: "none",
              fontWeight: 700,
              '&:hover': {
                backgroundColor: "#0b1220",
              },
            }}
            endIcon={<ArrowRight size={18} />}
          >
            See all panel members
          </Button>
        </Box> */}
      </Box>
    </Box>
  );
}

export default GovernanceProcessFlow;

