"use client";
import { Box, Container, Typography, Card } from "@mui/material";
import { motion } from "framer-motion";
import { processSteps } from "../governanceData";

const MotionBox = motion(Box);

function ProcessOverview() {
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
            Our 4-Phase Process
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
            Every design decision goes through a structured process that ensures quality, consistency, and alignment with business goals.
          </Typography>
        </MotionBox>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" },
            gap: 3,
          }}
        >
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <MotionBox
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: "rgba(255, 255, 255, 0.8)",
                    border: `2px solid ${step.color}40`,
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 12px 32px ${step.color}30`,
                      borderColor: step.color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: `${step.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <Icon size={24} color={step.color} weight="duotone" />
                  </Box>
                  <Typography
                    variant="overline"
                    sx={{
                      color: step.color,
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      letterSpacing: 1,
                    }}
                  >
                    STEP {step.id}
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      color: "#1F2937",
                      mb: 1,
                      fontSize: "1rem",
                      mt: 0.5,
                    }}
                  >
                    {step.phase}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6B7280",
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {step.description}
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

export default ProcessOverview;
