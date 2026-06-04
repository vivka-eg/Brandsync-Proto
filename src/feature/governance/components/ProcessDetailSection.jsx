"use client";
import { Box, Container, Typography, Card } from "@mui/material";
import { motion } from "framer-motion";
import { CheckCircle } from "phosphor-react";

const MotionBox = motion(Box);

function ProcessDetailSection({ step, index }) {
  const isEven = index % 2 === 0;
  const Icon = step.icon;

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: isEven ? "#FFFFFF" : "#F9FAFB",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: { xs: "block", md: "grid" },
            gridTemplateColumns: { md: "1fr 1fr" },
            gap: { xs: 4, md: 8 },
            alignItems: "center",
            flexDirection: isEven ? "row" : "row-reverse",
          }}
        >
          {/* Content Side */}
          <MotionBox
            initial={{ opacity: 0, x: isEven ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            sx={{ order: isEven ? 1 : 2 }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.5,
                mb: 2,
                px: 2,
                py: 1,
                borderRadius: 3,
                backgroundColor: `${step.color}15`,
              }}
            >
              <Icon size={24} color={step.color} weight="duotone" />
              <Typography
                variant="overline"
                sx={{
                  color: step.color,
                  fontWeight: 700,
                  letterSpacing: 1,
                }}
              >
                Step {step.id}
              </Typography>
            </Box>

            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                color: "#111827",
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              {step.phase}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", md: "1.125rem" },
                color: "#6B7280",
                mb: 4,
                lineHeight: 1.7,
              }}
            >
              {step.description}
            </Typography>

            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                color: "#374151",
                mb: 2,
              }}
            >
              What Happens in This Phase
            </Typography>

            <Box sx={{ mb: 4 }}>
              {step.details.map((detail, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    gap: 2,
                    mb: 1.5,
                    alignItems: "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: step.color,
                      mt: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4B5563",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {detail}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                color: "#374151",
                mb: 2,
              }}
            >
              Key Benefits
            </Typography>

            <Box>
              {step.benefits.map((benefit, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    gap: 2,
                    mb: 1.5,
                    alignItems: "flex-start",
                  }}
                >
                  <CheckCircle size={20} color={step.color} weight="fill" />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4B5563",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {benefit}
                  </Typography>
                </Box>
              ))}
            </Box>
          </MotionBox>

          {/* Visual Side */}
          <MotionBox
            initial={{ opacity: 0, x: isEven ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            sx={{ order: isEven ? 2 : 1 }}
          >
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                background: `linear-gradient(135deg, ${step.color}15 0%, ${step.color}08 100%)`,
                border: `2px solid ${step.color}30`,
                p: { xs: 4, md: 6 },
                minHeight: { xs: "300px", md: "400px" },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${step.color}20, transparent)`,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: -60,
                  left: -60,
                  width: 250,
                  height: 250,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${step.color}15, transparent)`,
                }}
              />
              <Icon size={120} color={step.color} weight="duotone" style={{ opacity: 0.3 }} />
            </Card>
          </MotionBox>
        </Box>
      </Container>
    </Box>
  );
}

export default ProcessDetailSection;
