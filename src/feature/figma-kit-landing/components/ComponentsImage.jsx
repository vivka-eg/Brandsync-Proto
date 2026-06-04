"use client";
import { useRef, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import gsap from "gsap";
import CustomSwitch from "@/components/shared/CustomSwitch";

const BASE = "/figma-kit/landing/Section%204(Benefits)";
const COMP = `${BASE}/Components`;

const Img = ({ src, sx = {} }) => (
  <Box component="img" src={src} alt="" aria-hidden sx={{ ...sx }} />
);

// ── SwitchWidget ─────────────────────────────────────────────────────────────
const SwitchWidget = () => {
  const [on, setOn] = useState(true);
  const onRef = useRef(true);
  const timerRef = useRef(null);

  useEffect(() => {
    const toggle = () => {
      onRef.current = !onRef.current;
      setOn(onRef.current);
      timerRef.current = gsap.delayedCall(3, toggle);
    };
    timerRef.current = gsap.delayedCall(3, toggle);
    return () => timerRef.current?.kill();
  }, []);

  return (
    <Box sx={{ position: "absolute", top: "50%", left: "4%", zIndex: 4, transform: "scale(0.65)", transformOrigin: "left center" }}>
      <CustomSwitch
        checked={on}
        onChange={(e) => setOn(e.target.checked)}
        sx={{
          "& .MuiSwitch-track": { borderRadius: "24px" },
          "& .MuiSwitch-thumb": { borderRadius: "24px" },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#0062C1" },
        }}
      />
    </Box>
  );
};

// ── InputWidget ───────────────────────────────────────────────────────────────
const PLACEHOLDER = "Placeholder";
const MAX_DOTS = 8;

const InputWidget = () => {
  const [typed, setTyped] = useState("");
  const [dots, setDots] = useState(0);
  const timers = useRef([]);

  useEffect(() => {
    const kill = () => timers.current.forEach((t) => t?.kill());

    const startCycle = () => {
      kill();
      timers.current = [];
      setTyped("");
      setDots(0);

      PLACEHOLDER.split("").forEach((_, i) => {
        timers.current.push(
          gsap.delayedCall(i * 0.1, () => setTyped(PLACEHOLDER.slice(0, i + 1)))
        );
      });

      const dotsStart = PLACEHOLDER.length * 0.1 + 0.4;
      for (let d = 0; d < MAX_DOTS; d++) {
        timers.current.push(
          gsap.delayedCall(dotsStart + d * 0.18, () => setDots(d + 1))
        );
      }

      const cycleEnd = dotsStart + MAX_DOTS * 0.18 + 1.2;
      timers.current.push(gsap.delayedCall(cycleEnd, startCycle));
    };

    startCycle();
    return kill;
  }, []);

  const StarIcon = () => (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
      <path d="M10 2l2.4 4.9 5.4.8-3.9 3.8.9 5.3L10 14.3l-4.8 2.5.9-5.3L2.2 7.7l5.4-.8z" stroke="#21262E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <Box sx={{ position: "absolute", top: "28%", right: "-40px", width: "130px", zIndex: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "5px", mb: "4px" }}>
        <StarIcon />
        <Typography sx={{ fontSize: "11.5px", fontWeight: 600, color: "#21262E", fontFamily: "Roboto" }}>
          Text Input <Box component="span" sx={{ color: "#982A2A" }}>*</Box>
        </Typography>
      </Box>
      <Box sx={{ border: "1px solid #C2C7D3", borderRadius: "6px", background: "#fff", display: "flex", alignItems: "center", gap: "7px", px: "9px", py: "8px", mb: "10px", overflow: "hidden" }}>
        <svg width="13" height="13" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
          <rect x="2" y="4" width="16" height="13" rx="2" stroke="#4D535F" strokeWidth="1.8"/>
          <path d="M2 7l8 5 8-5" stroke="#4D535F" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <Typography sx={{ fontSize: "9px", color: "#848991", fontFamily: "Roboto", whiteSpace: "nowrap", minWidth: "70px" }}>
          {typed || ""}
          {typed.length > 0 && typed.length < PLACEHOLDER.length && (
            <Box component="span" sx={{ borderRight: "1px solid #848991", ml: "1px", animation: "blink 0.7s step-end infinite", "@keyframes blink": { "50%": { opacity: 0 } } }} />
          )}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "5px", mb: "4px" }}>
        <StarIcon />
        <Typography sx={{ fontSize: "11.5px", fontWeight: 600, color: "#21262E", fontFamily: "Roboto", whiteSpace: "nowrap" }}>
          Password Input
        </Typography>
      </Box>
      <Box sx={{ border: "1px solid #C2C7D3", borderRadius: "6px", background: "#fff", display: "flex", alignItems: "center", gap: "5px", px: "9px", py: "10px", minHeight: "35px", overflow: "hidden" }}>
        {[...Array(dots)].map((_, i) => (
          <Box key={i} sx={{ width: 5, height: 5, borderRadius: "50%", background: "#21262E", flexShrink: 0 }} />
        ))}
      </Box>
    </Box>
  );
};

// ── SlotChipRow ───────────────────────────────────────────────────────────────
const SLOT_SIZE = 38;
const SLOT_GAP = 14;
const SLOT_STEP = SLOT_SIZE + SLOT_GAP;

const SlotChipRow = () => {
  const refs = useRef([]);
  const tlRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const els = refs.current.filter(Boolean);
    const stackX = (els.length - 1) * SLOT_STEP;

    const doStack = () => {
      tlRef.current?.kill();
      const tl = gsap.timeline({
        onComplete: () => { timerRef.current = gsap.delayedCall(0.6, doFanOut); },
      });
      [...els].reverse().forEach((el, i) => {
        const origIdx = els.length - 1 - i;
        tl.to(el, { x: stackX, opacity: 1 - origIdx * 0.25, duration: 0.4, ease: "power2.inOut" }, i * 0.1);
      });
      tlRef.current = tl;
    };

    const doFanOut = () => {
      tlRef.current?.kill();
      const tl = gsap.timeline({
        onComplete: () => { timerRef.current = gsap.delayedCall(1.2, doStack); },
      });
      els.forEach((el, i) => {
        tl.to(el, { x: i * SLOT_STEP, opacity: 1, duration: 0.5, ease: "power2.out" }, i * 0.18);
      });
      tlRef.current = tl;
    };

    els.forEach((el, i) => gsap.set(el, { x: stackX, opacity: 1 - i * 0.25 }));
    timerRef.current = gsap.delayedCall(0.6, doFanOut);

    return () => {
      tlRef.current?.kill();
      timerRef.current?.kill();
      els.forEach((el) => gsap.killTweensOf(el));
    };
  }, []);

  return (
    <Box sx={{ position: "absolute", top: "270px", left: "-30px", width: `${SLOT_SIZE * 3 + SLOT_GAP * 2}px`, height: `${SLOT_SIZE}px`, zIndex: 3, "@media (min-width: 1592px) and (min-height: 865px)": { top: "330px" } }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          ref={(el) => (refs.current[i] = el)}
          sx={{ position: "absolute", top: 0, left: 0, width: `${SLOT_SIZE}px`, height: `${SLOT_SIZE}px`, border: "2px dashed #0062C1", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent" }}
        >
          <Typography sx={{ fontSize: "11px", fontFamily: "Roboto", color: "#000", fontWeight: 400 }}>
            slot
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

// ── TooltipWidget ─────────────────────────────────────────────────────────────
const TOOLTIP_TEXT = [
  { text: "I'm a tooltip. I show extra information when you hover or focus.", color: "#fff" },
];

const TooltipWidget = () => {
  const tooltipRef = useRef(null);

  useEffect(() => {
    const el = tooltipRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, scale: 0.5, transformOrigin: "left center" });

    const show = () => {
      gsap.to(el, {
        opacity: 1, scale: 1,
        duration: 0.7, ease: "power1.inOut",
        onComplete: () => { gsap.delayedCall(2.5, hide); },
      });
    };

    const hide = () => {
      gsap.to(el, {
        opacity: 0, scale: 0.5,
        duration: 0.6, ease: "power1.inOut",
        onComplete: () => { gsap.delayedCall(1.2, show); },
      });
    };

    const timer = gsap.delayedCall(0.8, show);
    return () => { timer.kill(); gsap.killTweensOf(el); };
  }, []);

  return (
    <Box sx={{ position: "absolute", bottom: "77%", left: "69%", width: "50%", zIndex: 3, display: "flex", alignItems: "center" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="11" stroke="#21262E" strokeWidth="2" />
        <circle cx="12" cy="7.8" r="1.2" fill="#21262E" />
        <path d="M11.4 10.8h1.2v6.4" stroke="#21262E" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <Box ref={tooltipRef} sx={{ display: "flex", alignItems: "center", ml: "3px", flex: 1 }}>
        <Box sx={{ width: 0, height: 0, borderTop: "4px solid transparent", borderBottom: "4px solid transparent", borderRight: "6px solid #21262E", flexShrink: 0 }} />
        <Box sx={{ background: "#21262E", borderRadius: "6px", px: "14px", py: "6px", flex: 1 }}>
          {TOOLTIP_TEXT.map((chunk, i) => (
            <Typography key={i} sx={{ fontSize: "13px", color: chunk.color, fontFamily: "var(--typography-font-family-body, Roboto)", lineHeight: "1.6", wordBreak: "break-word" }}>
              {chunk.text}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

// ── ComponentsImage ───────────────────────────────────────────────────────────
export default function ComponentsImage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const currentIdx = useRef(0);
  const timerRef = useRef(null);
  const btn1Ref = useRef(null);
  const btn2Ref = useRef(null);
  const snackbarRef = useRef(null);

  useEffect(() => {
    if (!snackbarRef.current) return;
    gsap.to(snackbarRef.current, { y: -8, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
    return () => gsap.killTweensOf(snackbarRef.current);
  }, []);

  useEffect(() => {
    if (!btn1Ref.current || !btn2Ref.current) return;
    gsap.to(btn1Ref.current, { y: -4, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0 });
    gsap.to(btn2Ref.current, { y: -4, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.8 });
    return () => {
      gsap.killTweensOf(btn1Ref.current);
      gsap.killTweensOf(btn2Ref.current);
    };
  }, []);

  useEffect(() => {
    const switchTab = () => {
      currentIdx.current = (currentIdx.current + 1) % 3;
      setSelectedTab(currentIdx.current);
      timerRef.current = gsap.delayedCall(4, switchTab);
    };
    timerRef.current = gsap.delayedCall(4, switchTab);
    return () => timerRef.current?.kill();
  }, []);

  const handleTabClick = (i) => {
    currentIdx.current = i;
    setSelectedTab(i);
    timerRef.current?.kill();
    const switchTab = () => {
      currentIdx.current = (currentIdx.current + 1) % 3;
      setSelectedTab(currentIdx.current);
      timerRef.current = gsap.delayedCall(1.2, switchTab);
    };
    timerRef.current = gsap.delayedCall(1.2, switchTab);
  };

  return (
    <>
      <Img src={`${COMP}/EG%20File%20Upload.svg`} sx={{ position: "absolute", top: "25px", left: "-4px", width: "42%", zIndex: 2 }} />
      <SlotChipRow />
      <InputWidget />
      <Box ref={btn1Ref} component="img" src={`${COMP}/EG%20Button.svg`} alt="" aria-hidden sx={{ position: "absolute", top: "22%", left: "37%", width: "17%", zIndex: 4 }} />
      <Box ref={btn2Ref} component="img" src={`${COMP}/EG%20Button-1.svg`} alt="" aria-hidden sx={{ position: "absolute", top: "27%", left: "51%", width: "17%", zIndex: 4 }} />
      <Img src={`${COMP}/Container.svg`} sx={{ position: "absolute", top: "35%", left: "8%", width: "15.5%", zIndex: 3 }} />
      <SwitchWidget />
      <TooltipWidget />
      {/* Tabs */}
      <Box
        sx={{
          position: "absolute", bottom: "19.5%", right: "-6%", zIndex: 4,
          display: "inline-flex", backgroundColor: "#F3F4F6",
          borderRadius: "100px", padding: "4px", gap: "2px",
        }}
      >
        {["Tab", "Tab", "Tab"].map((label, i) => (
          <Box
            key={i}
            onClick={() => handleTabClick(i)}
            sx={{
              minWidth: "64px", px: 3, py: 1, fontSize: "14px", fontWeight: 500,
              fontFamily: "Roboto", cursor: "pointer", borderRadius: "100px",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s ease",
              backgroundColor: selectedTab === i ? "#0070F2" : "transparent",
              color: selectedTab === i ? "#fff" : "#121212",
              "&:hover": selectedTab !== i ? { backgroundColor: "rgba(0,0,0,0.06)" } : {},
            }}
          >
            {label}
          </Box>
        ))}
      </Box>
      <Img src={`${COMP}/EG%20Diaog.svg`} sx={{ position: "absolute", bottom: "0px", left: "-3px", width: "38%", zIndex: 5 }} />
      <Box ref={snackbarRef} component="img" src={`${COMP}/EG%20Snackbar.svg`} alt="" aria-hidden sx={{ position: "absolute", bottom: "-8px", left: "35%", width: "65%", zIndex: 6 }} />
      <Img src={`${COMP}/Frame%20349.svg`} sx={{ position: "absolute", top: "43%", right: "100px", width: "53%", zIndex: 3 }} />
    </>
  );
}
