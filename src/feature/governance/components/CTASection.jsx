"use client";
import { Box, Container, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "phosphor-react";

const MotionBox = motion(Box);

function CTASection() {
  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        bgcolor: "#111827",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(1200px 400px at 50% 50%, rgba(99,102,241,0.15), transparent)",
          pointerEvents: "none",
        }}
      />
      <Container maxWidth="md" sx={{ position: "relative" }}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          sx={{ textAlign: "center" }}
        >
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              fontSize: { xs: "2rem", md: "2.75rem" },
              color: "#FFFFFF",
              mb: 3,
              letterSpacing: -0.5,
            }}
          >
            Ready to See It in Action?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", md: "1.125rem" },
              color: "#D1D5DB",
              lineHeight: 1.8,
              mb: 5,
            }}
          >
            Explore our design system, components, and foundations to see how governance translates into real, usable design standards.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              component={Link}
              href="/design-system"
              variant="contained"
              size="large"
              endIcon={<ArrowRight size={20} weight="bold" />}
              sx={{
                borderRadius: 2,
                px: 3.5,
                py: 1.5,
                backgroundColor: "#FFFFFF",
                color: "#111827",
                fontWeight: 700,
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#F3F4F6",
                },
              }}
            >
              Explore Design System
            </Button>
            <Button
              component={Link}
              href="/team"
              variant="outlined"
              size="large"
              sx={{
                borderRadius: 2,
                px: 3.5,
                py: 1.5,
                borderColor: "#FFFFFF",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#F3F4F6",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Meet the Panel
            </Button>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
}

export default CTASection;
