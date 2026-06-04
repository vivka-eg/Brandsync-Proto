"use client";
import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import MemberCard from "@/components/shared/MemberCard";
import { members } from "../governanceData";

const MotionBox = motion(Box);

function PanelMembersSection({ onMemberClick }) {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#FFFFFF" }}>
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
            Meet Our Expert Panel Members
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", md: "1.125rem" },
              color: "#6B7280",
              lineHeight: 1.8,
              maxWidth: "750px",
              mx: "auto",
            }}
          >
            Our governance panel brings together diverse expertise from design, research, accessibility, and product management to ensure every design decision meets our highest standards.
          </Typography>
        </MotionBox>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
            mb: 4,
          }}
        >
          {members.map((member, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <MemberCard {...member} onClick={() => onMemberClick(member)} />
            </MotionBox>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default PanelMembersSection;
