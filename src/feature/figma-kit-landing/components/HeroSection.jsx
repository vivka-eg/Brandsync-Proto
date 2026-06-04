"use client";
import { Box, Typography, Button } from "@mui/material";
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from "framer-motion";
import { zoomIn, withDelay } from "@/utils/animations";
import { captureEvent } from "@/lib/analytics/posthog";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Eye } from "phosphor-react";
import gsap from "gsap";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const BASE = "/figma-kit/landing/Hero%20Section";

const EMAIL = "brandsync@eg.dk";

export default function HeroSection() {
  const bubbleControls = useAnimation();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    const el = emailRef.current;
    const pwEl = passwordRef.current;
    if (!el || !pwEl) return;

    const timers = [];
    const kill = () => timers.forEach((t) => t?.kill());

    const startCycle = () => {
      kill();
      timers.length = 0;
      el.textContent = "";
      pwEl.textContent = "";

      // Type each character at 0.1s per char (matches ComponentsImage InputWidget)
      EMAIL.split("").forEach((_, i) => {
        timers.push(gsap.delayedCall(i * 0.1, () => {
          el.textContent = EMAIL.slice(0, i + 1);
        }));
      });

      // After email + 0.4s pause, type 8 password dots at 0.18s each
      const passwordStart = EMAIL.length * 0.1 + 0.4;
      for (let d = 0; d < 8; d++) {
        timers.push(gsap.delayedCall(passwordStart + d * 0.18, () => {
          pwEl.textContent = "•".repeat(d + 1);
        }));
      }

      // Hold 1.2s after password done then restart
      const cycleEnd = passwordStart + 8 * 0.18 + 1.2;
      timers.push(gsap.delayedCall(cycleEnd, startCycle));
    };

    startCycle();
    return kill;
  }, []);

  useEffect(() => {
    bubbleControls.start({ opacity: 1, scale: 1, transition: { duration: 0.35, delay: 0.75 } });
  }, []);

  const [isDragging, setIsDragging] = useState(false);
  const [sophiePos, setSophiePos] = useState(null);
  const collageRef = useRef(null);

  // Normalised mouse position: -0.5 → 0.5
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Smooth springs
  const smoothX = useSpring(rawX, { stiffness: 30, damping: 18, mass: 1.8 });
  const smoothY = useSpring(rawY, { stiffness: 30, damping: 18, mass: 1.8 });

  // Dashboard; further away, moves less
  const dashX = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const dashY = useTransform(smoothY, [-0.5, 0.5], [-9, 9]);

  // Login form; closer, moves more
  const loginX = useTransform(smoothX, [-0.5, 0.5], [-26, 26]);
  const loginY = useTransform(smoothY, [-0.5, 0.5], [-20, 20]);

  // Bubble; subtle parallax
  const bubbleX = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const bubbleY = useTransform(smoothY, [-0.5, 0.5], [-6, 6]);

  const handleCollageMouseMove = (e) => {
    const rect = collageRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left - rect.width / 2) / rect.width);
    rawY.set((e.clientY - rect.top - rect.height / 2) / rect.height);
  };

  const handleCollageMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e) => {
      const rect = collageRef.current?.getBoundingClientRect();
      if (!rect) return;
      const sophieW = rect.width * 0.18;
      setSophiePos({
        x: Math.max(0, Math.min(e.clientX - rect.left, rect.width - sophieW)),
        y: Math.max(0, Math.min(e.clientY - rect.top, rect.height - 40)),
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isDragging]);

  const handleSophieClick = (e) => {
    e.stopPropagation();
    setIsDragging((prev) => !prev);
  };

  return (
    <Box
      onMouseMove={handleCollageMouseMove}
      onMouseLeave={handleCollageMouseLeave}
      sx={{
        position: "relative",
        overflowX: "clip",
        overflowY: "visible",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        minHeight: "660px",
        mx: -4,
        pl: 4,
        pr: 0,
        mt: -4,
        pt: 4,
        "@media (max-width: 1600px)": { minHeight: "520px" },
      }}
    >
      <Box
        sx={{
          width: "100%",
          py: 0,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          minHeight: "660px",
          "@media (max-width: 1600px)": { minHeight: "520px" },
        }}
      >
        {/* ── Left: text content ── */}
        <Box sx={{ flex: "0 0 44%", maxWidth: "44%", pr: 4 }}>
          {/* Badge */}
          <MotionBox
            {...zoomIn}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              bgcolor: "#E6F0FF",
              borderRadius: "8px",
              px: 2,
              py: 0.75,
              mb: 3,
            }}
          >
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 500, color: "#1D4ED8", letterSpacing: "0.01em" }}>
              BrandSync Figma UI Kit
            </Typography>
          </MotionBox>

          {/* Heading */}
          <MotionTypography
            component="h1"
            {...withDelay(zoomIn, 0.1)}
            sx={{
              fontSize: "3.25rem",
              "@media (max-width: 1600px)": { fontSize: "2.5rem" },
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "#121212",
              mb: 2.5,
            }}
          >
            Every component
            <br />
            your team needs.
          </MotionTypography>

          {/* Description */}
          <MotionTypography
            {...withDelay(zoomIn, 0.2)}
            sx={{ fontSize: "1rem", color: "#6c757d", lineHeight: 1.75, mb: 4.5, maxWidth: "420px" }}
          >
            The official EG Figma UI Kit; token-first, WCAG&nbsp;2.1&nbsp;AA
            compliant, and built for teams who ship consistent products without
            rebuilding from scratch.
          </MotionTypography>

          {/* CTA buttons */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              component="a"
              href="https://www.figma.com/design/zF98rGtaPpBjSc2PpPK5vo/EG-Brand-Sync-UI-Kit---v1.0?m=auto&node-id=7009-158749&t=C8HsxOYFCwqOGwCj-1"
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              disableElevation
              onClick={() => captureEvent("figma_kit_downloaded", { source: "hero_section" })}
              sx={{
                px: 3, py: 1.5, fontSize: "0.95rem", fontWeight: 600,
                borderRadius: "8px", textTransform: "none",
                bgcolor: "#121212", color: "#fff",
                "&:hover": { bgcolor: "#000000" },
              }}
            >
              Get the Figma Kit
            </Button>
            <Button
              component={Link}
              href="/figma-kit/figma-plugins/brandsync-studio"
              variant="outlined"
              disableElevation
              sx={{
                px: 3, py: 1.5, fontSize: "0.95rem", fontWeight: 600,
                borderRadius: "8px", textTransform: "none",
                borderColor: "#121212", borderWidth: "1.5px",
                color: "#121212", bgcolor: "#ffffff",
                "&:hover": { borderWidth: "1.5px", borderColor: "#121212", bgcolor: "rgba(0,0,0,0.04)" },
              }}
            >
              Explore Plugins
            </Button>
          </Box>
        </Box>

        {/* ── Right: screenshot collage ── */}
        <MotionBox
          ref={collageRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          sx={{
            flex: "1 1 56%",
            position: "relative",
            height: "600px",
            overflow: "visible",
            "@media (max-width: 1600px)": { height: "460px" },
          }}
        >
          {/* Frame 362; dashboard window; moves less (further away) */}
          <MotionBox
            style={{ x: dashX, y: dashY }}
            sx={{ position: "absolute", top: "4%", right: "15%", width: "82%", zIndex: 2 }}
          >
            <MotionBox
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              component="img"
              src={`${BASE}/Frame%20362.svg`}
              alt="EG BrandSync Dashboard"
              sx={{ width: "130%", borderRadius: "10px" }}
            />
          </MotionBox>

          {/* Login form; component */}
          <MotionBox
            style={{ x: loginX, y: loginY }}
            sx={{ position: "absolute", bottom: "0%", left: "0%", width: "35%", zIndex: 4, "@media (max-width: 1316px) and (max-height: 865px)": { width: "37%" } }}
          >
            <MotionBox
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, delay: 1 }}
            >
            <MotionBox
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              sx={{
                width: "100%",
                borderRadius: "10px",
                background: "#fff",
                border: "8px solid #EBEBEB",
                boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                p: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {/* Email field */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "3px", mb: "6px" }}>
                  <Box sx={{ fontSize: "12px", fontWeight: 600, color: "#21262E", fontFamily: "Roboto" }}>Email</Box>
                  <Box sx={{ fontSize: "12px", color: "#E53935", fontFamily: "Roboto" }}>*</Box>
                </Box>
                <Box sx={{ border: "1px solid #C2C7D3", borderRadius: "6px", px: "10px", py: "8px", fontSize: "11px", color: "#4D535F", fontFamily: "Roboto", background: "#fff", minHeight: "32px", display: "flex", alignItems: "center" }}>
                  <span ref={emailRef} />
                  <Box component="span" sx={{ borderRight: "1px solid #4D535F", ml: "1px", animation: "blink 0.7s step-end infinite", "@keyframes blink": { "50%": { opacity: 0 } } }} />
                </Box>
              </Box>

              {/* Password field */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "3px", mb: "6px" }}>
                  <Box sx={{ fontSize: "12px", fontWeight: 600, color: "#21262E", fontFamily: "Roboto" }}>Password</Box>
                  <Box sx={{ fontSize: "12px", color: "#E53935", fontFamily: "Roboto" }}>*</Box>
                </Box>
                <Box sx={{ border: "1px solid #C2C7D3", borderRadius: "6px", px: "10px", py: "2px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", minHeight: "32px" }}>
                  <Box sx={{ fontSize: "26px", color: "#21262E", letterSpacing: "1px", lineHeight: 1 }}><span ref={passwordRef} /></Box>
                  <Eye size={16} color="#5D6427" />
                </Box>
              </Box>

              {/* Button + annotation */}
              <Box sx={{ position: "relative" }}>
                {/* Figma-style selection border with handles */}
                <Box sx={{ position: "relative", border: "1.5px solid #1B85FF", borderRadius: "6px", p: "3px" }}>
                  {/* Corner + midpoint handles */}
                  {[
                    { top: "-3px", left: "-3px" },
                    // { top: "-3px", left: "50%", transform: "translateX(-50%)" },
                    { top: "-3px", right: "-3px" },
                    // { top: "50%", left: "-3px", transform: "translateY(-50%)" },
                    // { top: "50%", right: "-3px", transform: "translateY(-50%)" },
                    { bottom: "-3px", left: "-3px" },
                    // { bottom: "-3px", left: "50%", transform: "translateX(-50%)" },
                    { bottom: "-3px", right: "-3px" },
                  ].map((pos, i) => (
                    <Box key={i} sx={{ position: "absolute", width: "6px", height: "6px", background: "#fff", border: "1.5px solid #1B85FF", borderRadius: "1px", ...pos }} />
                  ))}
                  <Box sx={{ background: "#0062C1", borderRadius: "4px", py: "9px", textAlign: "center", fontSize: "12px", fontWeight: 600, color: "#fff", fontFamily: "Roboto" }}>
                    Label
                  </Box>
                </Box>
                {/* Dotted vertical line */}
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", my: "2px" }}>
                  <Box sx={{ width: "1.5px", height: "12px", borderLeft: "1.5px dashed #1B85FF" }} />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Box sx={{ display: "inline-block", background: "#1B85FF", borderRadius: "0px", px: "10px", py: "0px", fontSize: "8px", color: "#fff", fontFamily: '"Geist Mono", monospace', fontWeight: 500 }}>
                    color/text/action
                  </Box>
                </Box>
              </Box>
            </MotionBox>
            </MotionBox>
          </MotionBox>

          {/* Group 27 copy; chip */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ x: loginX, y: loginY }}
            transition={{ duration: 0.35, delay: 0.65 }}
            component="img"
            src={`${BASE}/Group%2027%20copy.svg`}
            alt=""
            aria-hidden
            sx={{ position: "absolute", top: "20%", left: "1.5%", width: "20%", zIndex: 6 }}
          />

          {/* Group 27; dashed line */}
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ x: loginX, y: loginY }}
            transition={{ duration: 0.35, delay: 0.70 }}
            component="img"
            src={`${BASE}/Group%2027.svg`}
            alt=""
            aria-hidden
            sx={{ position: "absolute", top: "22.5%", left: "17%", width: "5%", zIndex: 6 }}
          />

          {/* Group 5 copy; "This looks great!!" bubble */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.88 }}
            animate={bubbleControls}
            style={{ x: bubbleX, y: bubbleY }}
            transition={{ duration: 0.35, delay: 0.75 }}
            component="img"
            src={`${BASE}/Group%205%20copy.svg`}
            alt=""
            aria-hidden
            onHoverStart={async () => {
              await bubbleControls.start({ x: -5, y: -5, transition: { duration: 0.2, ease: "easeOut" } });
              await bubbleControls.start({ x: 0, y: 0, transition: { duration: 0.4, ease: "easeOut" } });
            }}
            sx={{ position: "absolute", top: "24%", left: "-6%", width: "30%", zIndex: 6, cursor: "pointer" }}
          />

          {/* Group 3 copy; Sophie cursor */}
          <MotionBox
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            style={!isDragging ? { x: loginX, y: loginY } : undefined}
            transition={{ duration: 0.35, delay: 0.82 }}
            component="img"
            src={`${BASE}/Group%203%20copy.svg`}
            alt="Sophie"
            onClick={handleSophieClick}
            sx={{
              position: "absolute",
              ...(sophiePos
                ? { top: sophiePos.y, left: sophiePos.x, bottom: "unset" }
                : { bottom: "-5%", left: "25%" }),
              width: "18%",
              zIndex: 8,
              cursor: isDragging ? "none" : "pointer",
              userSelect: "none",
            }}
          />
        </MotionBox>
      </Box>
    </Box>
  );
}
