"use client";
import { Box, Container, Typography, Card } from "@mui/material";
import { motion } from "framer-motion";
import { whyGovernanceMatters } from "../governanceData";

const MotionBox = motion(Box);

function WhyGovernanceMatters() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#F9FAFB" }}>
      <Container maxWidth="lg">
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          sx={{ textAlign: "center", mb: 8 }}
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
            Why Governance Matters
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
            In a world of multiple products, teams, and platforms, governance is what keeps your design ecosystem healthy and sustainable.
          </Typography>
        </MotionBox>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
          }}
        >
          {whyGovernanceMatters.map((item, index) => {
            const Icon = item.icon;
            return (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    background: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(229, 231, 235, 0.8)",
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 12px 32px ${item.color}20`,
                      borderColor: item.color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      backgroundColor: `${item.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                    }}
                  >
                    <Icon size={28} color={item.color} weight="duotone" />
                  </Box>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                      color: "#1F2937",
                      mb: 2,
                      fontSize: { xs: "1.25rem", md: "1.4rem" },
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#6B7280",
                      fontSize: "1rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.description}
                  </Typography>
                </Card>
              </MotionBox>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}

export default WhyGovernanceMatters;
