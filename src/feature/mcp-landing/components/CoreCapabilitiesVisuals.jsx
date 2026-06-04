"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Box from "@mui/material/Box";

const MotionBox = motion(Box);

const CARD_BG = "linear-gradient(160deg, #dce8ff 0%, #e3eaff 100%)";

export function Feature1Visual() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Box
      ref={ref}
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: CARD_BG,
      }}
    >
      {/* Card 1 — Jira, appears first */}
      <MotionBox
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <Box
          component="img"
          src="/mcp-landing/s3/f1/frame-1.svg"
          alt=""
          sx={{
            position: "absolute",
            left: "21.2%",
            top: "7.9%",
            width: "57.7%",
            height: "auto",
            zIndex: 2,
          }}
        />
      </MotionBox>

      {/* Card 2 — FigJam, appears after card 1 */}
      <MotionBox
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.7, ease: "easeOut" }}
        sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <Box
          component="img"
          src="/mcp-landing/s3/f1/frame-2.svg"
          alt=""
          sx={{
            position: "absolute",
            left: "17.7%",
            top: "26.5%",
            width: "64.7%",
            height: "auto",
            zIndex: 2,
          }}
        />
      </MotionBox>

      {/* Connector 1 — draws top-to-bottom after card 2 */}
      <Box
        sx={{
          position: "absolute",
          left: "47.4%",
          top: "21.5%",
          width: "5.1%",
          zIndex: 3,
        }}
      >
        <MotionBox
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={inView ? { clipPath: "inset(0% 0% 0% 0%)" } : {}}
          transition={{ duration: 0.5, delay: 1.25, ease: "easeInOut" }}
        >
          <Box
            component="img"
            src="/mcp-landing/s3/f1/connector.svg"
            alt=""
            sx={{ width: "100%", height: "auto", display: "block" }}
          />
        </MotionBox>
      </Box>

      {/* Card 3 — Live UI, appears after connector 1 */}
      <MotionBox
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 1.85, ease: "easeOut" }}
        sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <Box
          component="img"
          src="/mcp-landing/s3/f1/visual.svg"
          alt=""
          sx={{
            position: "absolute",
            left: "21.2%",
            top: "52.3%",
            width: "57.7%",
            height: "auto",
            zIndex: 2,
            // "@media (min-width: 1400px)": { top: "58%" },
            // "@media (min-width: 1450px)": { top: "61%" },
          }}
        />
      </MotionBox>

      {/* Connector 2 — draws top-to-bottom after card 3 */}
      <Box
        sx={{
          position: "absolute",
          left: "47.4%",
          top: "46.3%",
          width: "5.1%",
          zIndex: 3,
        }}
      >
        <MotionBox
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={inView ? { clipPath: "inset(0% 0% 0% 0%)" } : {}}
          transition={{ duration: 0.5, delay: 2.35, ease: "easeInOut" }}
        >
          <Box
            component="img"
            src="/mcp-landing/s3/f1/connector.svg"
            alt=""
            sx={{ width: "100%", height: "auto", display: "block" }}
          />
        </MotionBox>
      </Box>
    </Box>
  );
}

export function Feature3Visual() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Box
      ref={ref}
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: CARD_BG,
      }}
    >
      {/* 1. Visual screen (visual-2) — fades in first */}
      <Box
        sx={{
          position: "absolute",
          left: "31.7%",
          top: "8.1%",
          width: "86.7%",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        <MotionBox
          initial={{ opacity: 0, y: -10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
        >
          <Box
            component="img"
            src="/mcp-landing/s3/f3/visual-2.svg"
            alt=""
            sx={{ width: "100%", height: "auto", display: "block" }}
          />
        </MotionBox>
      </Box>

      {/* 2. Button — fades up into place */}
      <Box
        sx={{
          position: "absolute",
          left: "22.6%",
          top: "52.9%",
          width: "30.5%",
          zIndex: 4,
          // "@media (min-width: 1400px)": { top: "42%" },
        }}
      >
        <MotionBox
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.4, delay: 0.75, ease: "easeOut" }}
        >
          <Box
            component="img"
            src="/mcp-landing/s3/f3/eg-button.svg"
            alt=""
            sx={{ width: "100%", height: "auto", display: "block" }}
          />
        </MotionBox>
      </Box>

      {/* 3. Connector — draws from button end toward visual screen */}
      <Box
        sx={{
          position: "absolute",
          left: "7.4%",
          top: "53.3%",
          width: "12.3%",
          zIndex: 3,
          transform: "rotate(31.8deg)",
          transformOrigin: "center center",
          // "@media (min-width: 1400px)": { top: "42%" },
        }}
      >
        <MotionBox
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={
            inView
              ? { clipPath: "inset(0% 0% 0% 0%)" }
              : { clipPath: "inset(0% 0% 100% 0%)" }
          }
          transition={{ duration: 0.6, delay: 1.25, ease: "easeInOut" }}
        >
          <Box
            component="img"
            src="/mcp-landing/s3/f3/vector-4.svg"
            alt=""
            sx={{ width: "100%", height: "auto", display: "block" }}
          />
        </MotionBox>
      </Box>

      {/* 4. Prompt screen (visual) — slides up last */}
      <Box
        sx={{
          position: "absolute",
          left: "2.5%",
          bottom: -40,
          width: "109.2%",
          zIndex: 2,
        }}
      >
        <MotionBox
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.45, delay: 1.75, ease: "easeOut" }}
        >
          <Box
            component="img"
            src="/mcp-landing/s3/f3/visual.svg"
            alt=""
            sx={{ width: "100%", height: "auto", display: "block" }}
          />
        </MotionBox>
      </Box>
    </Box>
  );
}

export function Feature4Visual() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Box
      ref={ref}
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: CARD_BG,
      }}
    >
      {/* 1. Background visual — slides up from bottom */}
      <Box
        sx={{
          position: "absolute",
          left: "28.75%",
          bottom: 0,
          width: "99.1%",
          zIndex: 1,
        }}
      >
        <MotionBox
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <Box
            component="img"
            src="/mcp-landing/s3/f4/visual.svg"
            alt=""
            sx={{ width: "100%", height: "auto", display: "block" }}
          />
        </MotionBox>
      </Box>

      {/* 2. Overlay panel — slides up after the background */}
      <Box
        sx={{
          position: "absolute",
          left: "1.1%",
          top: "68.9%",
          width: "94.2%",
          zIndex: 2,
        }}
      >
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.45, delay: 0.75, ease: "easeOut" }}
        >
          <Box
            component="img"
            src="/mcp-landing/s3/f4/visual-2.svg"
            alt=""
            sx={{ width: "100%", height: "auto", display: "block" }}
          />
        </MotionBox>
      </Box>
    </Box>
  );
}

const VIRT_W = 600;
const VIRT_H = 640;
const pctW = (px) => `${((px / VIRT_W) * 100).toFixed(3)}%`;
const pctH = (px) => `${((px / VIRT_H) * 100).toFixed(3)}%`;

const CARD_VW = 108.171;
const CARD_VH = 125.442;
const NOTCH = 20;

const C1_DX = 9.09;
const C1_DY = 4.55;
const C2_DX = 68.17;
const C2_DY = 100.9;

const COMP_CARDS = [
  // top row
  {
    x: -31.85,
    y: 103,
    c1: ["Cards", "#ffdea1", "#6b4d00"],
    c2: ["14 states", "#ffdea1", "#6b4d00"],
  },
  {
    x: 117.84,
    y: 103,
    c1: ["Checkbox", "#d6e3f8", "#005592"],
    c2: ["16 states", "#d6e3f8", "#005592"],
  },
  {
    x: 267.53,
    y: 103,
    c1: ["Chips", "#ffdad7", "#982a2a"],
    c2: ["4 States", "#ffdad7", "#982a2a"],
  },
  {
    x: 412.67,
    y: 102,
    c1: ["Dialog", "#eff0f8", "#000"],
    c2: ["4 States", "#eff0f8", "#000"],
  },
  {
    x: 557.81,
    y: 104,
    c1: ["Avatar", "#c5ebd5", "#1b5d43"],
    c2: ["4 States", "#ffdad7", "#982a2a"],
  },
  // mid row
  {
    x: -42,
    y: 255,
    c1: ["Button", "#ffdea1", "#6b4d00"],
    c2: ["14 states", "#ffdea1", "#6b4d00"],
  },
  {
    x: 107.69,
    y: 255,
    c1: ["Button", "#d6e3f8", "#005592"],
    c2: ["16 states", "#d6e3f8", "#005592"],
  },
  {
    x: 391.77,
    y: 258,
    c1: ["Accordion", "#ffdad7", "#982a2a"],
    c2: ["4 States", "#ffdad7", "#982a2a"],
  },
  {
    x: 536.92,
    y: 259,
    c1: ["Avatar", "#c5ebd5", "#1b5d43"],
    c2: ["4 States", "#ffdad7", "#982a2a"],
  },
  // bottom row
  {
    x: -108.2,
    y: 412.72,
    c1: ["Button", "#ffdea1", "#005592"],
    c2: ["14 states", "#c5ebd5", "#1b5d43"],
  },
  {
    x: 41.48,
    y: 412.72,
    c1: ["Button", "#eff0f8", "#000"],
    c2: ["16 states", "#eff0f8", "#000"],
  },
  {
    x: 191.17,
    y: 412.72,
    c1: ["File Upload", "#ffdad7", "#982a2a"],
    c2: ["3 States", "#ffdad7", "#982a2a"],
  },
  {
    x: 336.31,
    y: 411.81,
    c1: ["Breadcrumbs", "#c5ebd5", "#1b5d43"],
    c2: ["2 States", "#c5ebd5", "#1b5d43"],
  },
  {
    x: 481.45,
    y: 412.72,
    c1: ["Cards", "#ffdad7", "#982a2a"],
    c2: ["4 States", "#ffdad7", "#982a2a"],
  },
];

function FileIconCard({ x, y }) {
  const path = [
    `M 8 0`,
    `H ${CARD_VW - NOTCH}`,
    `L ${CARD_VW} ${NOTCH}`,
    `V ${CARD_VH - 8}`,
    `Q ${CARD_VW} ${CARD_VH} ${CARD_VW - 8} ${CARD_VH}`,
    `H 8`,
    `Q 0 ${CARD_VH} 0 ${CARD_VH - 8}`,
    `V 8`,
    `Q 0 0 8 0 Z`,
  ].join(" ");

  const foldPath = `M ${CARD_VW - NOTCH} 0 L ${CARD_VW - NOTCH} ${NOTCH} L ${CARD_VW} ${NOTCH} Z`;

  return (
    <Box
      sx={{
        position: "absolute",
        left: pctW(x),
        top: pctH(y),
        width: pctW(CARD_VW),
        aspectRatio: `${CARD_VW} / ${CARD_VH}`,
        zIndex: 2,
        filter: "drop-shadow(0px 3px 8px rgba(0,0,0,0.10))",
      }}
    >
      <svg
        viewBox={`0 0 ${CARD_VW} ${CARD_VH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <path d={path} fill="white" />
        <path d={foldPath} fill="#edf0f8" />
        <path
          d={`M ${CARD_VW - NOTCH} 0 V ${NOTCH} H ${CARD_VW}`}
          stroke="#dde1ed"
          strokeWidth="0.5"
        />
      </svg>
      <Box
        component="img"
        src="/mcp-landing/s3/f2/brandsync-logo-dimmed.svg"
        alt=""
        sx={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: "28%",
          width: "50%",
          height: "50%",
        }}
      />
    </Box>
  );
}

// cqw units keep chips proportional to the container width as it scales
function Chip({ label, bg, color, left, top }) {
  return (
    <Box
      sx={{
        position: "absolute",
        left,
        top,
        bgcolor: bg,
        color,
        borderRadius: "1.642cqw",
        px: "1.642cqw",
        py: "0.410cqw",
        fontSize: "1.667cqw",
        fontFamily: "'Roboto', sans-serif",
        fontWeight: 400,
        whiteSpace: "nowrap",
        lineHeight: "3.283cqw",
        zIndex: 5,
      }}
    >
      {label}
    </Box>
  );
}

function ComponentCard({ x, y, c1, c2 }) {
  return (
    <>
      <FileIconCard x={x} y={y} />
      <Chip
        label={c1[0]}
        bg={c1[1]}
        color={c1[2]}
        left={pctW(x + C1_DX)}
        top={pctH(y + C1_DY)}
      />
      <Chip
        label={c2[0]}
        bg={c2[1]}
        color={c2[2]}
        left={pctW(x + C2_DX)}
        top={pctH(y + C2_DY)}
      />
    </>
  );
}

// Pre-shuffled delays for 14 component cards so they appear in a random-looking order
const CARD_DELAYS = [
  1.2, 0.7, 1.6, 0.9, 1.4, 1.8, 0.6, 1.1, 0.8, 1.5, 1.0, 1.3, 1.7, 0.5,
];

export function Feature2Visual() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Box
      ref={ref}
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: CARD_BG,
        containerType: "inline-size",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: "30%",
          top: "45%",
          width: "158%",
          height: "110%",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(180,210,255,0.55) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          left: "-90%",
          top: "-45%",
          width: "173%",
          height: "110%",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(180,210,255,0.55) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Component cards — each fades in at a random-looking delay after the logo */}
      {COMP_CARDS.map(({ x, y, c1, c2 }, i) => (
        <MotionBox
          key={i}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{
            duration: 0.35,
            delay: CARD_DELAYS[i],
            ease: "easeOut",
          }}
          sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          <ComponentCard x={x} y={y} c1={c1} c2={c2} />
        </MotionBox>
      ))}

      {/* BrandSync logo — pops in first with a spring */}
      <Box
        sx={{
          position: "absolute",
          left: "calc(50% + 4.57px - 60.2px)",
          top: "calc(50% + 1.2px - 73.2px)",
          zIndex: 10,
        }}
      >
        <MotionBox
          initial={{ opacity: 0, scale: 0.65 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 22,
            delay: 0.2,
          }}
        >
          <Box
            component="img"
            src="/mcp-landing/s3/f2/brandsync-logo.png"
            alt="BrandSync"
            sx={{
              width: "118px",
              height: "118px",
              borderRadius: "20px",
              display: "block",
            }}
          />
        </MotionBox>
      </Box>
    </Box>
  );
}
