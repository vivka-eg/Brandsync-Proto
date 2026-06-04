import { Box, keyframes } from "@mui/material";

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

function SkeletonLoader({ width, height, borderRadius = "12px", variant = "rectangular" }) {
  return (
    <Box
      sx={{
        width: width || "100%",
        height: height || "100%",
        borderRadius: variant === "circular" ? "50%" : borderRadius,
        background: "linear-gradient(90deg, #e8e8e8 0%, #f5f5f5 20%, #ffffff 40%, #f5f5f5 60%, #e8e8e8 100%)",
        backgroundSize: "1000px 100%",
        animation: `${shimmer} 1.8s ease-in-out infinite`,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    />
  );
}

export default SkeletonLoader;
