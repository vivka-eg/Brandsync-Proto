"use client";
import { useRef, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import gsap from "gsap";

const BASE = "/figma-kit/landing/Section%204(Benefits)";
const ACCESS = `${BASE}/Accessibility`;

export default function AccessibilityImage() {
  const circleBoxRef = useRef(null);
  const borderRef    = useRef(null);
  const pathRef      = useRef(null);
  const countRef     = useRef(null);
  const [imagesVisible, setImagesVisible] = useState(false);

  useEffect(() => {
    const circle  = circleBoxRef.current;
    const border  = borderRef.current;
    const path    = pathRef.current;
    const countEl = countRef.current;
    if (!circle || !border || !path || !countEl) return;

    const checkLength   = path.getTotalLength();
    const circumference = 2 * Math.PI * 77.5;
    const proxy = { val: 0 };

    // Start fully hidden
    gsap.set(circle, { opacity: 0, scale: 0.82 });
    gsap.set(border, { strokeDasharray: circumference, strokeDashoffset: circumference });
    gsap.set(path,   { strokeDasharray: checkLength,   strokeDashoffset: checkLength });
    countEl.textContent = "0%";

    // Build paused timeline; play() called by IntersectionObserver
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => setImagesVisible(true),
    });

    tl.to(circle, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" })
      .to(border, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, ">0.1")
      .to(path,   { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, "<")
      .to(proxy,  {
        val: 100,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => { countEl.textContent = Math.round(proxy.val) + "%"; },
      }, "<");

    // IntersectionObserver works correctly inside overflow:hidden containers
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tl.play();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(circle);
    return () => { observer.disconnect(); tl.kill(); };
  }, []);

  return (
    <>
      {/* Centre circle */}
      <Box
        ref={circleBoxRef}
        sx={{
          position: "absolute",
          top: "calc(50% - 80px)",
          left: "calc(50% - 80px)",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          zIndex: 2,
          boxShadow: "0 4px 24px rgba(29,110,230,0.12)",
          opacity: 0,
        }}
      >
        {/* Animated border */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
          viewBox="0 0 160 160"
          fill="none"
        >
          <circle
            ref={borderRef}
            cx="80" cy="80" r="77.5"
            stroke="#0073E1"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* Checkmark */}
        <svg width="72" height="72" viewBox="0 0 48 48" fill="none">
          <path
            ref={pathRef}
            d="M6 26L18 38L42 12"
            stroke="#0073E1"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Counter */}
        <Typography
          ref={countRef}
          sx={{
            fontSize: "13px",
            fontWeight: 500,
            color: "#0073E1",
            fontFamily: '"Geist Mono", monospace',
            lineHeight: 1,
          }}
        >
          0%
        </Typography>
      </Box>

      {/* "4.5:1 Contrast" badge; pops in once then floats */}
      <motion.img
        src={`${ACCESS}/Frame%20318.svg`}
        alt="" aria-hidden
        initial={{ opacity: 0, scale: 0.8 }}
        animate={imagesVisible ? { opacity: 1, scale: 1, y: [0, -14, 0] } : { opacity: 0, scale: 0.8 }}
        transition={{
          opacity: { duration: 0.35 },
          scale:   { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
          y:       { duration: 4, ease: "easeInOut", repeat: Infinity, delay: 0.4 },
        }}
        style={{ position: "absolute", top: "28%", right: "16%", width: "30%", zIndex: 4 }}
      />

      {/* "2.1 AA" badge; pops in once then floats */}
      <motion.img
        src={`${ACCESS}/Frame%20317.svg`}
        alt="" aria-hidden
        initial={{ opacity: 0, scale: 0.8 }}
        animate={imagesVisible ? { opacity: 1, scale: 1, y: [0, -14, 0] } : { opacity: 0, scale: 0.8 }}
        transition={{
          opacity: { duration: 0.35, delay: 0.15 },
          scale:   { duration: 0.35, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 },
          y:       { duration: 4, ease: "easeInOut", repeat: Infinity, delay: 0.55 },
        }}
        style={{ position: "absolute", top: "58%", left: "25%", width: "17%", zIndex: 4 }}
      />
    </>
  );
}
