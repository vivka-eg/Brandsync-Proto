import Box from "@mui/material/Box";
import { keyframes } from "@mui/system";

export const float = keyframes`
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(100px, -80px) scale(1.3);
  }
  66% {
    transform: translate(-80px, 60px) scale(0.8);
  }
`;

export const float2 = keyframes`
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(-100px, 80px) scale(1.4);
  }
  66% {
    transform: translate(60px, -50px) scale(0.75);
  }
`;

export const float3 = keyframes`
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  25% {
    transform: translate(90px, 70px) scale(1.35);
  }
  50% {
    transform: translate(-70px, -60px) scale(0.85);
  }
  75% {
    transform: translate(50px, -80px) scale(1.2);
  }
`;

export const float4 = keyframes`
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(80px, 70px) scale(1.25);
  }
  66% {
    transform: translate(-60px, -40px) scale(0.9);
  }
`;

export const float5 = keyframes`
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  25% {
    transform: translate(-90px, -70px) scale(1.3);
  }
  50% {
    transform: translate(70px, 80px) scale(0.8);
  }
  75% {
    transform: translate(-50px, 60px) scale(1.15);
  }
`;

export default function AnimatedOrb({
  width = "350px",
  height = "350px",
  color = "rgba(84, 158, 255, 0.8)",
  blur = "70px",
  position = {},
  animation,
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        width,
        height,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, ${color.replace(/[\d.]+\)/, "0)")} 70%)`,
        filter: `blur(${blur})`,
        animation,
        ...position,
      }}
    />
  );
}
