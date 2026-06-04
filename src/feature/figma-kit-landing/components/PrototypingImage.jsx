"use client";
import { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import gsap from "gsap";

const BASE = "/figma-kit/landing/Section%204(Benefits)";
const PROTO = `${BASE}/Prototype`;

const Img = ({ src, sx = {} }) => (
  <Box component="img" src={src} alt="" aria-hidden sx={{ ...sx }} />
);

// clipRectRef    ; animates the clip reveal
// motionPathRef  ; hidden SVG path used as cursor guide
// widgetRef      ; outer Box, lets us measure SVG position in DOM
const NavigateToWidget = ({ clipRectRef, motionPathRef, widgetRef }) => (
  <Box
    ref={widgetRef}
    aria-hidden
    sx={{
      position: "absolute", top: "85px", left: "120px", width: "31%", zIndex: 3,
      "@media (min-width: 1592px) and (min-height: 865px)": { top: "95px", left: "142px", width: "33%" },
    }}
  >
    <svg width="100%" viewBox="0 0 209 165" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="nav-reveal-clip">
          <rect ref={clipRectRef} x="-10" y="0" width="230" height="0" />
        </clipPath>
      </defs>

      {/* Hidden centerline path used only for getPointAtLength */}
      <path
        ref={motionPathRef}
        d="M 2 2 C 54 4 132 16 150 32 C 165 48 168 90 167 121 C 166 131 165 141 165 149 L 169 165"
        fill="none"
        stroke="none"
        visibility="hidden"
      />

      {/* Curved connector arrow + label; revealed by clip */}
      <g clipPath="url(#nav-reveal-clip)">
        <path
          d="M2.06301 0.0726788L0.0632638 0.0409172L-0.000259399 4.04041L1.99949 4.07217L2.03125 2.07243L2.06301 0.0726788ZM169.37 164.887C170.412 165.253 171.553 164.704 171.919 163.662L177.873 146.675C178.238 145.633 177.689 144.491 176.647 144.126C175.605 143.761 174.463 144.309 174.098 145.352L168.805 160.451L153.706 155.158C152.664 154.793 151.523 155.342 151.157 156.384C150.792 157.427 151.341 158.568 152.383 158.933L169.37 164.887ZM150.964 30.648L149.57 32.0821L150.964 30.648ZM166.559 149L168.551 148.819L166.559 149ZM2.03125 2.07243L1.99949 4.07217C26.7369 4.46507 54.8053 2.95634 81.3478 5.66674C107.84 8.37195 132.255 15.2517 149.57 32.0821L150.964 30.648L152.358 29.2139C134.076 11.4432 108.562 4.42489 81.7542 1.68744C54.9975 -1.04483 26.3977 0.459182 2.06301 0.0726788L2.03125 2.07243ZM150.964 30.648L149.57 32.0821C165.21 47.2848 168.361 67.8958 167.825 89.2403C167.557 99.909 166.375 110.612 165.434 120.837C164.498 131 163.797 140.72 164.568 149.181L166.559 149L168.551 148.819C167.818 140.769 168.479 131.39 169.417 121.204C170.349 111.08 171.551 100.183 171.824 89.3407C172.368 67.6639 169.225 45.6092 152.358 29.2139L150.964 30.648ZM166.559 149L164.568 149.181C165.058 154.572 166.153 159.551 168.229 163.867L170.031 163L171.834 162.133C170.034 158.391 169.016 153.922 168.551 148.819L166.559 149Z"
          fill="#9C25F1"
        />
        <rect x="111.031" y="25" width="97" height="35" rx="2" fill="#9C25F1" />
        <text
          x="159.531"
          y="47"
          textAnchor="middle"
          fill="white"
          fontFamily="Roboto, sans-serif"
          fontSize="14"
          fontWeight="500"
        >
          Navigate to
        </text>
      </g>
    </svg>
  </Box>
);

export default function PrototypingImage() {
  const clipRectRef  = useRef(null);
  const motionPathRef = useRef(null);
  const widgetRef    = useRef(null);
  const containerRef = useRef(null);
  const pointerRef   = useRef(null);

  useEffect(() => {
    const clip       = clipRectRef.current;
    const motionPath = motionPathRef.current;
    const widget     = widgetRef.current;
    const container  = containerRef.current;
    const ptr        = pointerRef.current;
    if (!clip || !motionPath || !widget || !container || !ptr) return;

    const totalLength = motionPath.getTotalLength();

    const proxy       = { t: 0 };
    const cursorProxy = { t: 0 };

    const updateClip = () => {
      const pt    = motionPath.getPointAtLength(proxy.t * totalLength);
      gsap.set(clip, { attr: { height: pt.y + 5 } });
    };

    const updateCursor = () => {
      const pt      = motionPath.getPointAtLength(cursorProxy.t * totalLength);
      const svgEl   = widget.querySelector("svg");
      const svgRect = svgEl.getBoundingClientRect();
      const cRect   = container.getBoundingClientRect();
      const scaleX  = svgRect.width  / 209;
      const scaleY  = svgRect.height / 165;
      const relLeft = svgRect.left - cRect.left + pt.x * scaleX;
      const relTop  = svgRect.top  - cRect.top  + pt.y * scaleY;
      gsap.set(ptr, {
        left: (relLeft / cRect.width)  * 100 + "%",
        top:  (relTop  / cRect.height) * 100 + "%",
      });
    };

    const animate = () => {
      proxy.t = 0;
      cursorProxy.t = 0;
      updateClip();
      updateCursor();

      const tl = gsap.timeline({
        onComplete: () => gsap.delayedCall(0.2, animate),
      });

      // Cursor finishes faster; appears to lead the arrow
      tl.to(cursorProxy, { t: 1, duration: 1.2, ease: "power2.out", onUpdate: updateCursor }, 0)
        .to(proxy, {
          t: 1,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: updateClip,
        }, 0)
        .to({}, { duration: 0.6 }); // hold at end
    };

    animate();

    return () => {
      gsap.killTweensOf(proxy);
      gsap.killTweensOf(cursorProxy);
    };
  }, []);

  return (
    <>
      {/* Invisible full-size ref to measure container bounds */}
      <Box ref={containerRef} sx={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      <Img src={`${PROTO}/Frame%20336.svg`} sx={{ position: "absolute", top: "32px", left: "0px", width: "40%", borderRadius: "10px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", zIndex: 2 }} />

      <NavigateToWidget
        clipRectRef={clipRectRef}
        motionPathRef={motionPathRef}
        widgetRef={widgetRef}
      />

      {/* Frame 379; small floating arrow near the connector start */}
      <motion.img
        src={`${PROTO}/Frame%20379.svg`}
        alt="" aria-hidden
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
        style={{ position: "absolute", top: "15%", left: "18.5%", width: "11%", zIndex: 5 }}
      />

      {/* pointer; follows the arrow curve via getPointAtLength */}
      <Box
        ref={pointerRef}
        component="img"
        src={`${PROTO}/pointer.svg`}
        alt="" aria-hidden
        sx={{ position: "absolute", top: "17%", left: "24%", width: "12%", zIndex: 6 }}
      />

      <Img src={`${PROTO}/Frame%20337.svg`} sx={{ position: "absolute", bottom: "0px", right: "0px", width: "70%", borderRadius: "10px", boxShadow: "0 4px 24px rgba(0,0,0,0.12)", zIndex: 4 }} />
    </>
  );
}
