"use client";

import React, { useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import gsap from "gsap";

const SKILL_LABELS = ["Design tokens", "Claude", "Cursor", "Agent"];

const DIAGRAM_SIZE = 220;
const CENTER = DIAGRAM_SIZE / 2;
const INNER_R = 44;
const OUTER_R = 92;

function getLineEnd(i) {
  const angleDeg = (i / 4) * 360 - 90;
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x1: CENTER + INNER_R * Math.cos(rad),
    y1: CENTER + INNER_R * Math.sin(rad),
    x2: CENTER + OUTER_R * Math.cos(rad),
    y2: CENTER + OUTER_R * Math.sin(rad),
  };
}

export default function HeroAgentSkillVisual() {
  const heroVisualRef = useRef(null);
  const agentRef = useRef(null);
  const skillNodesRef = useRef(null);
  const diagramRef = useRef(null);

  useEffect(() => {
    if (!heroVisualRef.current || !agentRef.current || !skillNodesRef.current || !diagramRef.current) return;

    const ctx = gsap.context(() => {
      const skillEls = skillNodesRef.current?.querySelectorAll(".hero-skill-node") ?? [];
      const agent = agentRef.current;
      const dots = diagramRef.current?.querySelectorAll(".hero-line-dot") ?? [];

      gsap.set(agent, { opacity: 0, scale: 0.7 });
      gsap.set(skillEls, { opacity: 0, y: 16 });
      gsap.set(dots, { opacity: 0 });

      const tl = gsap.timeline({ delay: 0.2 });
      tl.to(agent, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.2)",
      }).to(
        skillEls,
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: "power2.out",
        },
        "-=0.3"
      );

      tl.to(dots, { opacity: 1, duration: 0.3 }, "-=0.2");

      dots.forEach((dot, i) => {
        const { x2, y2 } = getLineEnd(i);
        const startX = x2 - 4;
        const startY = y2 - 4;
        gsap.set(dot, { left: startX, top: startY });
        gsap.to(dot, {
          left: CENTER - 4,
          top: CENTER - 4,
          duration: 1.8,
          ease: "power2.in",
          repeat: -1,
          repeatDelay: 0.6,
          delay: 1.2 + i * 0.4,
          onRepeat: () => {
            gsap.set(dot, { left: startX, top: startY });
          },
        });
      });

      gsap.to(agent, {
        y: -8,
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1,
      });

      skillEls.forEach((el, i) => {
        gsap.to(el, {
          y: -4,
          duration: 2 + i * 0.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.2 + i * 0.15,
        });
      });
    }, heroVisualRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      <Box
        ref={heroVisualRef}
        sx={{
          width: "100%",
          maxWidth: { xs: "350px", md: "500px" },
          height: { xs: "400px", md: "500px" },
          background: "#ffffff",
          borderRadius: "24px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "hidden",
          p: { xs: 3, md: 5 },
        }}
      >
        <Box
          sx={{
            flex: 1,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Box
            ref={diagramRef}
            sx={{
              position: "relative",
              width: 220,
              height: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              viewBox="0 0 220 220"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
                pointerEvents: "none",
              }}
            >
              {[0, 1, 2, 3].map((i) => {
                const angleDeg = (i / 4) * 360 - 90;
                const rad = (angleDeg * Math.PI) / 180;
                const x1 = 110 + INNER_R * Math.cos(rad);
                const y1 = 110 + INNER_R * Math.sin(rad);
                const x2 = 110 + OUTER_R * Math.cos(rad);
                const y2 = 110 + OUTER_R * Math.sin(rad);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(0, 0, 0, 0.12)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                );
              })}
            </svg>
            {[0, 1, 2, 3].map((i) => {
              const angleDeg = (i / 4) * 360 - 90;
              const rad = (angleDeg * Math.PI) / 180;
              const x = 110 + 92 * Math.cos(rad) - 4;
              const y = 110 + 92 * Math.sin(rad) - 4;
              return (
                <Box
                  key={i}
                  className="hero-line-dot"
                  sx={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "grey.500",
                    zIndex: 0.5,
                    pointerEvents: "none",
                  }}
                />
              );
            })}
            <Box
              ref={agentRef}
              sx={{
                position: "relative",
                zIndex: 1,
                width: 88,
                height: 88,
                borderRadius: "50%",
                bgcolor: "grey.100",
                border: "2px solid",
                borderColor: "grey.300",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "grey.700",
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src="/bot.svg"
                alt="Agent"
                sx={{ width: 44, height: 44, display: "block" }}
              />
            </Box>
            <Box
              ref={skillNodesRef}
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
              }}
            >
              {SKILL_LABELS.map((label, i) => {
                const angleDeg = (i / SKILL_LABELS.length) * 360 - 90;
                const rad = (angleDeg * Math.PI) / 180;
                const radiusPct = 42;
                const x = 50 + radiusPct * Math.cos(rad);
                const y = 50 + radiusPct * Math.sin(rad);
                return (
                  <Box
                    key={label}
                    className="hero-skill-node"
                    sx={{
                      position: "absolute",
                      left: `${x}%`,
                      top: `${y}%`,
                      zIndex: 0,
                      transform: "translate(-50%, -50%)",
                      px: 1.5,
                      py: 0.75,
                      borderRadius: "20px",
                      bgcolor: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      border: "1px solid",
                      borderColor: "grey.200",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary",
                        fontSize: "0.7rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
        <Typography
          variant="caption"
          sx={{
            textAlign: "center",
            color: "text.secondary",
            fontWeight: 500,
            width: "100%",
            pt: 2,
          }}
        >
          Your AI assistant (Cursor, Claude) uses this skill to answer design-system questions.
        </Typography>
      </Box>
    </Box>
  );
}
