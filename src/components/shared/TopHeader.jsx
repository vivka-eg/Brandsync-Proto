"use client";
import { Stack, Typography, Box } from "@mui/material";
import { getStrapiURL } from "@/strapi/utils";
import LazyImage from "@/components/shared/LazyImage";
import { keyframes } from "@mui/system";

const float1 = keyframes`
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.8;
  }
  25% {
    transform: translate(70px, -50px) scale(1.15);
    opacity: 1;
  }
  50% {
    transform: translate(-60px, 70px) scale(0.85);
    opacity: 0.7;
  }
  75% {
    transform: translate(50px, 40px) scale(1.1);
    opacity: 0.9;
  }
`;

const float2 = keyframes`
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.75;
  }
  25% {
    transform: translate(-70px, 60px) scale(0.9);
    opacity: 0.85;
  }
  50% {
    transform: translate(80px, -50px) scale(1.12);
    opacity: 1;
  }
  75% {
    transform: translate(-40px, 30px) scale(0.95);
    opacity: 0.8;
  }
`;

const float3 = keyframes`
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.7;
  }
  25% {
    transform: translate(calc(-50% + 60px), calc(-50% + 70px)) scale(1.2);
    opacity: 0.9;
  }
  50% {
    transform: translate(calc(-50% - 75px), calc(-50% - 60px)) scale(0.88);
    opacity: 0.65;
  }
  75% {
    transform: translate(calc(-50% + 45px), calc(-50% - 50px)) scale(1.05);
    opacity: 0.8;
  }
`;

function TopHeader({
  title,
  description,
  assetURL = "",
  videoURL = "",
  relativePath = false,
}) {
  return (
    <Stack
      direction="row"
      sx={{
        height: "300px",
        borderRadius: "12px",
        "@media (max-width: 600px)": {
          flexDirection: "column",
          gap: "20px",
          height: "auto",
          alignItems: "start",
        },
        gap: "16px",
      }}
    >
      {/* left */}
      <Stack
        spacing={1}
        alignItems="flex-start"
        sx={{
          "@media (max-width: 600px)": {
            order: 1,
            width: "100%",
          },
          bgcolor: "#FBFBFB",
          padding: "36px",
          borderRadius: "12px",
          height: "100%",
          width: assetURL || videoURL ? "50%" : "100%",
        }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          gutterBottom
          color="text.primary"
        >
          {title}
        </Typography>
        <Typography variant="body1" color="text.body">
          {description}
        </Typography>
      </Stack>

      {/* right */}
      {assetURL && (
        <Box
          sx={{
            borderRadius: "24px",
            width: "50%",
            height: "auto",
            position: "relative",
            overflow: "hidden",
            bgcolor: "#F5F7FA",
            "@media (max-width: 600px)": {
              alignSelf: "start",
              justifyContent: "start",
              alignItems: "start",
              width: "100%",
              height: "auto",
            },
          }}
        >
          {/* Orb 1 - Top Right */}
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              right: "15%",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(59, 130, 246, 0.6) 0%, rgba(96, 165, 250, 0.5) 100%)",
              filter: "blur(30px)",
              animation: `${float1} 15s ease-in-out 2s infinite`,
              zIndex: 0,
              willChange: "transform, opacity",
            }}
          />

          {/* Orb 2 - Bottom Left */}
          <Box
            sx={{
              position: "absolute",
              bottom: "15%",
              left: "10%",
              width: "220px",
              height: "220px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(37, 99, 235, 0.55) 0%, rgba(59, 130, 246, 0.45) 100%)",
              filter: "blur(30px)",
              animation: `${float2} 18s ease-in-out 2s infinite`,
              zIndex: 0,
              willChange: "transform, opacity",
            }}
          />

          {/* Orb 3 - Center */}
          <Box
            sx={{
              position: "absolute",
              top: "40%",
              left: "50%",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(96, 165, 250, 0.58) 0%, rgba(59, 130, 246, 0.48) 100%)",
              filter: "blur(30px)",
              animation: `${float3} 16s ease-in-out 2s infinite`,
              zIndex: 0,
              willChange: "transform, opacity",
            }}
          />

          {/* Component Image */}
          <LazyImage
            src={relativePath ? assetURL : getStrapiURL(assetURL)}
            alt={`${title}-component`}
            width={100}
            height={100}
            enableModal={false}
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              zIndex: 1,
            }}
            sx={{
              width: "100%",
              height: "100%",
              position: "relative",
              zIndex: 1,
            }}
          />
        </Box>
      )}
    </Stack>
  );
}

export default TopHeader;
