"use client";
import { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import gsap from "gsap";

const BASE = "/figma-kit/landing/Section%204(Benefits)";
const COLORS = `${BASE}/Colors`;

const colorGroups = [
  { src: "Group%2012.svg", sx: { top: "74%",   left: "-6%",    width: "35%", zIndex: 5 } },
  { src: "Group%2013.svg", sx: { top: "16%",   left: "50%",    width: "35%", zIndex: 3 } },
  { src: "Group%2014.svg", sx: { top: "25%",   left: "30%",    width: "35%", zIndex: 3 } },
  { src: "Group%2015.svg", sx: { top: "67.1%", left: "52.2%",  width: "35%", zIndex: 4 } },
  { src: "Group%2019.svg", sx: { top: "46%",   left: "-7%",    width: "35%", zIndex: 4 } },
  { src: "Group%2016.svg", sx: { top: "56.2%", left: "70.2%",  width: "35%", zIndex: 3 } },
  { src: "Group%2017.svg", sx: { top: "75%",   left: "34%",    width: "35%", zIndex: 3 } },
  { src: "Group%2018.svg", sx: { top: "56%",   left: "-27.5%", width: "35%", zIndex: 3 } },
  { src: "Group%2020.svg", sx: { top: "31%",   left: "68%",    width: "35%", zIndex: 2 } },
  { src: "Group%2024.svg", sx: { top: "33%",   left: "10%",    width: "38%", zIndex: 2 } },
  { src: "Group%2025.svg", sx: { top: "89%",   left: "17%",    width: "35%", zIndex: 2 } },
  { src: "Group%2021.svg", sx: { top: "31%",   left: "50%",    width: "35%", zIndex: 3 } },
  { src: "Group%2022.svg", sx: { top: "42%",   left: "32%",    width: "35%", zIndex: 3 } },
  { src: "Group%2023.svg", sx: { top: "52%",   left: "14.5%",  width: "35%", zIndex: 4 } },
];

const STAGGER_INDICES = new Set([11, 12, 13]);

export default function ColorGroupsImage() {
  const stackRefs = useRef([]);

  useEffect(() => {
    stackRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        y: -14,
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: i * 1.1,
      });
    });

    return () => {
      stackRefs.current.forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
    };
  }, []);

  return (
    <>
      {colorGroups.map(({ src, sx }, i) => {
        const isStaggered = STAGGER_INDICES.has(i);
        const staggerPos = [11, 12, 13].indexOf(i);
        return (
          <Box
            key={src}
            component="img"
            src={`${COLORS}/${src}`}
            alt=""
            aria-hidden
            ref={isStaggered ? (el) => { stackRefs.current[staggerPos] = el; } : undefined}
            sx={{ position: "absolute", ...sx }}
          />
        );
      })}
    </>
  );
}
