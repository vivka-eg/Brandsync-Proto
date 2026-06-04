"use client";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import { darkButtonSx, outlinedDarkButtonSx } from "../utils/buttonStyles";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionStack = motion(Stack);

export default function CtaSection() {
  return (
    <Box sx={{ py: { xs: 8, md: 14 }, px: { xs: 3, md: 8 }, bgcolor: "background.default" }}>
      <MotionBox
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        sx={{
          maxWidth: 1280,
          mx: "auto",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.1)",
          background:
            "radial-gradient(ellipse 100% 200% at 50% -10%, rgba(255,255,255,0) 0%, rgba(206,222,250,0.36) 20%, rgba(164,194,246,0.68) 60%, rgba(122,166,242,1) 100%)",
          pt: "125px",
          pb: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <MotionBox
          initial={{ opacity: 0, scale: 0.82 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
          sx={{ width: 200, height: 200, borderRadius: "24px", overflow: "hidden", flexShrink: 0 }}
        >
          <Box
            component="img"
            src="/mcp-landing/cta/logo.svg"
            alt="BrandSync"
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </MotionBox>

        <Stack
          spacing={4}
          alignItems="center"
          textAlign="center"
          sx={{ px: { xs: 3, md: 5 }, maxWidth: 768, width: "100%" }}
        >
          <MotionTypography
            component="h2"
            initial={{ opacity: 0, scale: 1.08 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.25, ease: "easeOut" }}
            sx={{ fontSize: { xs: "2rem", md: "3rem" }, fontWeight: 700, lineHeight: 1.2, color: "text.primary" }}
          >
            Connect once, generate forever
          </MotionTypography>

          <MotionStack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
            sx={{ rowGap: 2 }}
          >
            <Button component={Link} href="/mcp/getting-started/installation" variant="contained" disableElevation sx={darkButtonSx}>
              Connect to our server
            </Button>
            <Button component={Link} href="/mcp/getting-started/introduction" variant="outlined" disableElevation sx={outlinedDarkButtonSx}>
              Read Documentation
            </Button>
          </MotionStack>
        </Stack>
      </MotionBox>
    </Box>
  );
}
