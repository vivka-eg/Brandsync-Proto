import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import AnimatedOrb, {
  float,
  float2,
  float3,
  float4,
  float5,
} from "@/components/shared/AnimatedOrb";

export default function HeaderSection() {
  return (
    <Stack
      sx={{
        minHeight: "400px",
        borderRadius: "12px",
        bgcolor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 32px",
        position: "relative",
        overflow: "hidden",
        "@media (max-width: 600px)": {
          minHeight: "300px",
          padding: "48px 24px",
        },
      }}
    >
      {/* Animated Blue Orbs */}
      <AnimatedOrb
        width="350px"
        height="350px"
        color="rgba(84, 158, 255, 0.8)"
        blur="70px"
        position={{ top: "-150px", right: "-50px" }}
        animation={`${float} 8s ease-in-out infinite`}
      />
      <AnimatedOrb
        width="280px"
        height="280px"
        color="rgba(144, 202, 249, 0.75)"
        blur="60px"
        position={{ bottom: "-100px", left: "-50px" }}
        animation={`${float2} 10s ease-in-out infinite`}
      />
      <AnimatedOrb
        width="240px"
        height="240px"
        color="rgba(180, 216, 253, 0.7)"
        blur="55px"
        position={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        animation={`${float3} 12s ease-in-out infinite`}
      />
      <AnimatedOrb
        width="220px"
        height="220px"
        color="rgba(100, 181, 246, 0.65)"
        blur="50px"
        position={{ top: "20%", left: "10%" }}
        animation={`${float4} 9s ease-in-out infinite`}
      />
      <AnimatedOrb
        width="200px"
        height="200px"
        color="rgba(66, 165, 245, 0.7)"
        blur="45px"
        position={{ bottom: "20%", right: "15%" }}
        animation={`${float5} 11s ease-in-out infinite`}
      />

      {/* Header Content */}
      <Stack
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{
          maxWidth: "800px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h2"
          fontWeight={700}
          sx={{
            color: "#1A1A1A",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
          }}
        >
          BrandSync Quick Start Guide
        </Typography>
        <Typography
          variant="h6"
          fontWeight={400}
          sx={{
            color: "#53585C",
            fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
            maxWidth: "700px",
          }}
        >
          Everything you need to implement consistent, accessible branding
          across all EG products in just a few simple steps.
        </Typography>
      </Stack>
    </Stack>
  );
}
