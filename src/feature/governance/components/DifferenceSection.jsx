"use client";
import { Box, Container, Typography, Card } from "@mui/material";
import { motion } from "framer-motion";
import { challenges } from "../governanceData";

const MotionBox = motion(Box);

function DifferenceSection() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#FFFFFF" }}>
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
            The Difference Governance Makes
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
            See how governance transforms chaos into clarity and enables teams to work smarter, not harder.
          </Typography>
        </MotionBox>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
          }}
        >
          {challenges.map((challenge, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: index === 0 ? "rgba(239, 68, 68, 0.05)" : "rgba(16, 185, 129, 0.05)",
                  border: `2px solid ${challenge.color}40`,
                  height: "100%",
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{
                    color: challenge.color,
                    mb: 3,
                    fontSize: { xs: "1.5rem", md: "1.75rem" },
                  }}
                >
                  {challenge.title}
                </Typography>
                <Box>
                  {(challenge.problems || challenge.solutions).map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        gap: 2,
                        mb: 2,
                        alignItems: "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: challenge.color,
                          mt: 1,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#4B5563",
                          fontSize: "1rem",
                          lineHeight: 1.7,
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Card>
            </MotionBox>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default DifferenceSection;
