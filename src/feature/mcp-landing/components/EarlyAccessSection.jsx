"use client";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import { MCP_BETA_ACCESS_FORM_URL } from "@/constants";

const MotionBox = motion(Box);

export default function EarlyAccessSection() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 15 },
        px: { xs: 3, md: 8 },
        bgcolor: "background.default",
      }}
    >
      <MotionBox
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        sx={{
          maxWidth: 1280,
          mx: "auto",
          borderRadius: "12px",
          overflow: "hidden",
          px: { xs: 4, md: 8 },
          py: { xs: 6, md: 8 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "30px",
          background:
            "#000 radial-gradient(ellipse 130% 50% at 50% 100%, #000 0%, #001530 15%, #002A54 30%, #003870 40%, #0062C1 60%, #004A91 70%, #001930 85%, #000 95%)",
        }}
      >
        {/* Badge */}
        <Box
          sx={{
            bgcolor: "#eef2ff",
            borderRadius: "6px",
            px: "14px",
            py: "4px",
          }}
        >
          <Typography
            sx={{
              color: "#4361ee",
              fontSize: "12.8px",
              fontWeight: 500,
              letterSpacing: "0.12px",
              lineHeight: "19.2px",
            }}
          >
            Early Access
          </Typography>
        </Box>

        {/* Heading + subtitle */}
        <Stack spacing="12px" alignItems="center" sx={{ maxWidth: 640 }}>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 700,
              lineHeight: 1.2,
              textAlign: "center",
              color: "white",
              "& .blue": { color: "#1b85ff" },
            }}
          >
            <span className="blue">Request early access.</span> <br />
            Be the first to ship with BrandSync MCP
          </Typography>

          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: 1.5,
              textAlign: "center",
              color: "white",
            }}
          >
            Generate brand-aligned, token-correct UI before public release.
          </Typography>
        </Stack>

        {/* CTA button */}
        <Button
          component={Link}
          href={MCP_BETA_ACCESS_FORM_URL}
          variant="contained"
          disableElevation
          sx={{
            bgcolor: "white",
            color: "text.primary",
            borderRadius: "8px",
            height: 48,
            px: 3,
            fontWeight: 500,
            fontSize: "16px",
            textTransform: "none",
            boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.25)",
            "&:hover": { bgcolor: "grey.100" },
          }}
        >
          Request access
        </Button>
      </MotionBox>
    </Box>
  );
}
