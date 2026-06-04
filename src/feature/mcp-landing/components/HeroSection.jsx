"use client";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import SectionBadge from "./SectionBadge";
import TerminalWindow from "./TerminalWindow";
import { darkButtonSx, outlinedDarkButtonSx } from "../utils/buttonStyles";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionStack = motion(Stack);

export default function HeroSection() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        bgcolor: "background.paper",
        pt: { xs: 8, md: 12 },
        pb: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
        maxHeight: { xs: 560, sm: 680, md: 820 },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.12) 1px, transparent 0)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Radial glow — #7AA6F2 dome anchored at section bottom, clipped to terminal height */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "220%", sm: "165%", md: "110%" },
          height: "42%",
          pointerEvents: "none",
          zIndex: 0,
          background: "radial-gradient(ellipse 75% 55% at 50% 100%, #7AA6F2 0%, #7AA6F2 20%, rgba(122, 166, 242, 0.5) 52%, rgba(122, 166, 242, 0.1) 78%, transparent 90%)",
          filter: "blur(40px)",
        }}
      />

      <Stack
        spacing={3}
        alignItems="center"
        sx={{ maxWidth: 768, width: "100%", px: 2, textAlign: "center", position: "relative", zIndex: 1 }}
      >
        <MotionBox
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SectionBadge sx={{ letterSpacing: "0.12px" }}>AI&amp;MCP</SectionBadge>
        </MotionBox>

        <MotionTypography
          component="h1"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
          sx={{ fontSize: { xs: "2.5rem", md: "3rem" }, fontWeight: 700, lineHeight: "56px", color: "text.primary", letterSpacing: 0 }}
        >
          BrandSync Design system,
          <br />
          <Box
            component="span"
            sx={{
              background: "linear-gradient(to right, #0073e1 44%, #57b1ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            wired into the agent.
          </Box>
        </MotionTypography>

        <MotionTypography
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22, ease: "easeOut" }}
          sx={{ fontSize: "16px", color: "text.secondary", lineHeight: "24px", maxWidth: 600 }}
        >
          Stop pasting hex codes and guessing margins. Wire your AI agent directly into live
          BrandSync tokens and patterns to generate brand-perfect UI in seconds.
        </MotionTypography>

        <MotionStack
          direction="row"
          spacing={2}
          justifyContent="center"
          flexWrap="wrap"
          useFlexGap
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32, ease: "easeOut" }}
          sx={{ rowGap: 2 }}
        >
          <Button component={Link} href="/mcp/getting-started/installation" variant="contained" disableElevation sx={darkButtonSx}>
            Connect to our server
          </Button>
          <Button component={Link} href="/mcp/patterns" variant="outlined" disableElevation sx={outlinedDarkButtonSx}>
            View Patterns
          </Button>
        </MotionStack>
      </Stack>

      <MotionBox
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
        sx={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            mx: "auto",
            px: { xs: 2, md: 0 },
            width: "100%",
            maxWidth: 1015,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Frosted-glass frame around the terminal — matches Figma backdrop blur + tint */}
          <Box
            sx={{
              bgcolor: "rgba(0, 98, 193, 0.08)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: "12px",
              p: "12px",
            }}
          >
            <TerminalWindow />
          </Box>
        </Box>
      </MotionBox>
    </Box>
  );
}
