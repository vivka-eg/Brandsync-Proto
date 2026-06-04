import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import SectionBadge from "./SectionBadge";

export default function BrainSection() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        minHeight: 800,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 3, md: 8 },
        py: { xs: 10, md: 16 },
        overflow: "hidden",
        background: "linear-gradient(135deg, #0d1117 0%, #161b22 40%, #1a2540 70%, #0f3060 100%)",
      }}
    >
      {/* Knowledge-graph ambient glow */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(27,133,255,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <Stack
        spacing={4}
        alignItems="center"
        textAlign="center"
        sx={{ position: "relative", zIndex: 1, maxWidth: 594 }}
      >
        <SectionBadge>BrandSync Brain</SectionBadge>

        <Typography
          component="h2"
          sx={{ fontSize: { xs: "2rem", md: "3rem" }, fontWeight: 700, lineHeight: 1.2, color: "white" }}
        >
          Your design system as a living knowledge graph
        </Typography>

        <Typography sx={{ fontSize: "18px", color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
          BrandSync Brain maps every token, component, and pattern into a connected graph. Your AI
          agent traverses it in real time — always pulling the most current, most relevant design
          context.
        </Typography>

        <Button
          component={Link}
          href="/mcp/foundations"
          variant="outlined"
          disableElevation
          sx={{
            color: "white",
            borderColor: "white",
            borderRadius: "0px",
            height: 48,
            px: 3,
            fontWeight: 400,
            fontSize: "16px",
            textTransform: "none",
            "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" },
          }}
        >
          View project
        </Button>
      </Stack>
    </Box>
  );
}
