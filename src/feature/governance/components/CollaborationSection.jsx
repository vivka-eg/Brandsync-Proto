"use client";
import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import AnimatedAvatarSection from "@/components/shared/AnimatedAvatarSection";

const MotionBox = motion(Box);

function CollaborationSection() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#F9FAFB" }}>
      <Container maxWidth="lg">
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          sx={{ textAlign: "center", mb: 6 }}
        >
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              fontSize: { xs: "2rem", md: "2.75rem" },
              color: "#111827",
              mb: 3,
              letterSpacing: -0.5,
            }}
          >
            Built on Collaboration
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", md: "1.125rem" },
              color: "#6B7280",
              lineHeight: 1.8,
              maxWidth: "700px",
              mx: "auto",
            }}
          >
            Our governance process brings together experts from across the organization to ensure every decision reflects diverse perspectives and collective wisdom.
          </Typography>
        </MotionBox>
        <AnimatedAvatarSection />
      </Container>
    </Box>
  );
}

export default CollaborationSection;
