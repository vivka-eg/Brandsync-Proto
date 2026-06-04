"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Box from "@mui/material/Box";

const MotionBox = motion(Box);

const VW = 410;
const VH = 250;
const Y  = 20;

const w = (px) => `${((px / VW) * 100).toFixed(3)}%`;
const h = (px) => `${((px / VH) * 100).toFixed(3)}%`;

const VECTORS = [
  // path starts top-right (BrandSync side), runs leftward  → reveal right-to-left
  { src: "/mcp-landing/s2/fn/vector-1.svg", left: w(105),   top: h(74   + Y), width: w(91), clipStart: "inset(0 0% 0 100%)"   },
  { src: "/mcp-landing/s2/fn/vector-2.svg", left: w(133),   top: h(74   + Y), width: w(67), clipStart: "inset(0 0% 0 100%)"   },
  // path starts top-left (BrandSync side), runs rightward  → reveal left-to-right
  { src: "/mcp-landing/s2/fn/vector-3.svg", left: w(210),   top: h(74   + Y), width: w(67), clipStart: "inset(0 100% 0 0%)"   },
  // pure vertical line drawn downward from BrandSync       → reveal top-to-bottom
  { src: "/mcp-landing/s2/fn/vector-4.svg", left: w(204.5), top: h(74.5 + Y), width: w(2),  clipStart: "inset(100% 0% 0% 0%)" },
  // path starts top-left (BrandSync side), runs rightward  → reveal left-to-right
  { src: "/mcp-landing/s2/fn/vector-5.svg", left: w(215),   top: h(74   + Y), width: w(90), clipStart: "inset(0 100% 0 0%)"   },
];

// Each tile SVG is 65×63 with 10px internal shadow padding; subtract 10 to align with Figma coordinates
const TILES = [
  { src: "/mcp-landing/s2/fn/frame-react.svg",    left: w(60  - 10), top: h(90  + Y - 10), glow: "#61dafb" },
  { src: "/mcp-landing/s2/fn/frame-angular.svg",  left: w(110 - 10), top: h(147 + Y - 10), glow: "#e23237" },
  { src: "/mcp-landing/s2/fn/frame-vue.svg",      left: w(182 - 10), top: h(173 + Y - 10), glow: "#41b883" },
  { src: "/mcp-landing/s2/fn/frame-flutter.svg",  left: w(255 - 10), top: h(147 + Y - 10), glow: "#00b5f8" },
  { src: "/mcp-landing/s2/fn/frame-dotnet.svg",   left: w(305 - 10), top: h(90  + Y - 10), glow: "#621ee5" },
];

export function FrameworkHubCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Box ref={ref} sx={{ position: "relative", width: "100%", paddingTop: "61.0%", overflow: "hidden" }}>

      {/* 1. BrandSync logo — pops in first with a spring scale */}
      <Box sx={{ position: "absolute", left: "50%", top: h(34 + Y - 37), width: w(121), transform: "translateX(-50%)", zIndex: 2 }}>
        <MotionBox
          initial={{ opacity: 0, scale: 0.4 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.2 }}
        >
          <Box component="img" src="/mcp-landing/s2/fn/brandsync.svg" alt="BrandSync" sx={{ width: "100%", height: "auto", display: "block" }} />
        </MotionBox>
      </Box>

      {/* 2. Connectors — each drawn from BrandSync outward simultaneously */}
      {VECTORS.map(({ src, left, top, width, clipStart }) => (
        <MotionBox
          key={src}
          initial={{ clipPath: clipStart }}
          animate={inView ? { clipPath: "inset(0 0% 0 0%)" } : {}}
          transition={{ duration: 0.65, delay: 0.7, ease: "easeInOut" }}
          sx={{ position: "absolute", left, top, width }}
        >
          <Box component="img" src={src} alt="" sx={{ width: "100%", height: "auto", display: "block", zIndex: 0 }} />
        </MotionBox>
      ))}

      {/* 3. Framework logos — all rise up together once connectors are in */}
      <MotionBox
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 1.5, ease: "easeOut" }}
        sx={{ position: "absolute", inset: 0 }}
      >
        {TILES.map(({ src, left, top, glow }) => (
          <Box key={src} component="img" src={src} alt=""
            sx={{ position: "absolute", left, top, width: w(65), height: "auto", filter: `drop-shadow(0 0 5px ${glow})`, zIndex: 1 }} />
        ))}
      </MotionBox>

    </Box>
  );
}

const DRIFT_CARDS = [
  { src: "/mcp-landing/s2/zero-token-drift-1.svg", top: "8.3%",  left: "8.25%", width: "83.5%", zIndex: 0, delay: 0.2  },
  { src: "/mcp-landing/s2/zero-token-drift-2.svg", top: "26.1%", left: "6.6%",  width: "86.8%", zIndex: 1, delay: 0.7  },
  { src: "/mcp-landing/s2/zero-token-drift-3.svg", top: "46.1%", left: "4.85%", width: "90.3%", zIndex: 2, delay: 1.2  },
];

export function ZeroTokenDriftCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Box ref={ref} sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", px: 3, py: 3, minHeight: 220 }}>
      <Box sx={{ position: "relative", width: "100%", paddingTop: "53.8%" }}>
        {DRIFT_CARDS.map(({ src, top, left, width, zIndex, delay }) => (
          <MotionBox
            key={src}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            sx={{ position: "absolute", top, left, width, zIndex }}
          >
            <Box component="img" src={src} alt="" sx={{ width: "100%", height: "auto", display: "block" }} />
          </MotionBox>
        ))}
      </Box>
    </Box>
  );
}

export function DesignContextCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <Box ref={ref} sx={{ position: "relative", width: "100%", paddingTop: "55.2%", overflow: "hidden", isolation: "isolate" }}>

      {/* Left card — slides in from the left */}
      <MotionBox
        initial={{ opacity: 0, x: -16 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        sx={{ position: "absolute", left: "-29.8%", top: "-5.7%", width: "65.7%", zIndex: 3 }}
      >
        <Box component="img" src="/mcp-landing/s2/design-context.svg" alt="" sx={{ width: "100%", height: "auto", display: "block" }} />
      </MotionBox>

      {/* Connector arrow — clip-path draws it left → right once left card is in */}
      <MotionBox
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={inView ? { clipPath: "inset(0 0% 0 0)" } : {}}
        transition={{ duration: 0.65, delay: 0.65, ease: "easeInOut" }}
        sx={{ position: "absolute", left: "35.3%", top: "38.3%", width: "24.1%", zIndex: 2 }}
      >
        <Box component="img" src="/mcp-landing/s2/design-context-arrow.svg" alt="" sx={{ width: "100%", height: "auto", display: "block" }} />
      </MotionBox>

      {/* Right card — fades in as the connector finishes drawing */}
      <MotionBox
        initial={{ opacity: 0, x: 16 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 1.15, ease: "easeOut" }}
        sx={{ position: "absolute", left: "60.1%", top: "-5.7%", width: "68.1%", zIndex: 1 }}
      >
        <Box component="img" src="/mcp-landing/s2/design-context-2.svg" alt="" sx={{ width: "100%", height: "auto", display: "block" }} />
      </MotionBox>

    </Box>
  );
}

const PATTERN_ITEMS = [
  { src: "/mcp-landing/s2/patterns.svg",  left: "-2.4%",  top: "-18.5%", width: "31.8%", zIndex: 0 },
  { src: "/mcp-landing/s2/pattern-1.svg", left: "31.4%",  top: "50.5%",  width: "34.5%", zIndex: 1 },
  { src: "/mcp-landing/s2/pattern-5.svg", left: "67.7%",  top: "-15.4%", width: "34.4%", zIndex: 2 },
  { src: "/mcp-landing/s2/pattern-4.svg", left: "68.0%",  top: "37.2%",  width: "40.8%", zIndex: 3 },
  { src: "/mcp-landing/s2/pattern-3.svg", left: "-8.8%",  top: "40.1%",  width: "38.2%", zIndex: 4 },
  { src: "/mcp-landing/s2/pattern-2.svg", left: "31.2%",  top: "3.9%",   width: "34.7%", zIndex: 5 },
];

export function PatternCollageCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Box ref={ref} sx={{ position: "relative", width: "100%", paddingTop: "61.1%", overflow: "hidden" }}>
      {PATTERN_ITEMS.map((item, i) => (
        <MotionBox
          key={item.src}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.45, delay: 0.15 + i * 0.1, ease: "easeOut" }}
          sx={{ position: "absolute", left: item.left, top: item.top, width: item.width, zIndex: item.zIndex }}
        >
          <Box component="img" src={item.src} alt="" sx={{ width: "100%", height: "auto", display: "block" }} />
        </MotionBox>
      ))}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          background: "radial-gradient(ellipse 54% 85% at 50% 49%, transparent 49%, white 100%)",
          pointerEvents: "none",
        }}
      />
    </Box>
  );
}

const SNACKBARS = [
  { src: "/mcp-landing/s2/snackbar.svg",   left: "13.7%", top: "24.3%", width: "42.4%", zIndex: 1, delay: 0.65 },
  { src: "/mcp-landing/s2/snackbar-1.svg", left: "8.9%",  top: "45.9%", width: "37.4%", zIndex: 2, delay: 1.0  },
  { src: "/mcp-landing/s2/snackbar-2.svg", left: "18.7%", top: "70.3%", width: "36.6%", zIndex: 3, delay: 1.35 },
];

export function ProdReadinessCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Box ref={ref} sx={{ position: "relative", width: "100%", paddingTop: "58.9%", overflow: "hidden" }}>

      {/* Code card — appears first */}
      <MotionBox
        initial={{ opacity: 0, scale: 0.93 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        sx={{ position: "absolute", left: "29.3%", top: "9.5%", width: "94.7%", zIndex: 0 }}
      >
        <Box component="img" src="/mcp-landing/s2/prod-readiness.svg" alt="" sx={{ width: "100%", height: "auto", display: "block" }} />
      </MotionBox>

      {/* Snackbars — slide in from the left one by one */}
      {SNACKBARS.map(({ src, left, top, width, zIndex, delay }) => (
        <MotionBox
          key={src}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.45, delay, ease: "easeOut" }}
          sx={{ position: "absolute", left, top, width, zIndex }}
        >
          <Box component="img" src={src} alt="" sx={{ width: "100%", height: "auto", display: "block" }} />
        </MotionBox>
      ))}

    </Box>
  );
}
