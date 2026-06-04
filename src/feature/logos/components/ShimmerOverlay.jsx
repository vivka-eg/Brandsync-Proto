import { Box, keyframes } from "@mui/material";

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
`;

function ShimmerOverlay() {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 100,
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)",
          animation: `${shimmer} 1.2s ease-in-out`,
        },
      }}
    />
  );
}

export default ShimmerOverlay;
