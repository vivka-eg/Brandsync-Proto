"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";

const GREEN = "#22c55e";
const GRAY = "#7a7a7a";
const BLUE = "#1b85ff";
const ORANGE = "#d97757";
const WHITE = "#ffffff";

const CMD_WHITE = "run Jira pipeline : ";
const CMD_BLUE = "Ticket-247";
const FULL_CMD = CMD_WHITE + CMD_BLUE;
const TYPING_SPEED_MS = 40;
const INITIAL_DELAY_S = 0.4;

// Derived timing constants (all in seconds)
const CMD_DURATION = INITIAL_DELAY_S + (FULL_CMD.length * TYPING_SPEED_MS) / 1000;
const FOSTERING_DELAY = CMD_DURATION + 1.4;
const LINE_START = FOSTERING_DELAY + 0.7;
const LINE_STAGGER = 0.45;
const BOTTOM_DELAY = LINE_START + 5 * LINE_STAGGER + 0.3;
const LOOP_DURATION = BOTTOM_DELAY + 0.3 + 3;

const STATUS_LINES = [
  { text: "Ticket loaded - Serive Request wizard, 4 screens", color: GREEN },
  { text: "Querying Brain for matching patterns...", color: GRAY },
  { text: "Brain matched: Wizard/Multi-Step Form, Progress Stepper", color: GREEN },
  { text: "Generating user flow diagram...", color: GRAY },
  { text: "Flow diagram generated (4 screens, 2 decisions points)", color: GREEN },
];

function BlinkingCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{
        duration: 1.1,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.45, 0.5, 0.95],
      }}
      style={{ display: "inline-block" }}
    >
      <Box
        component="span"
        sx={{
          display: "inline-block",
          width: "0.4em",
          height: "1.05em",
          bgcolor: WHITE,
          verticalAlign: "text-bottom",
        }}
      />
    </motion.span>
  );
}

function SnowflakeIcon() {
  return (
    <motion.svg
      width="1em"
      height="1em"
      viewBox="0 0 19 19"
      fill="none"
      aria-hidden="true"
      animate={{ rotate: 360 }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      style={{ display: "inline-block", flexShrink: 0 }}
    >
      <rect x="7.5" y="0" width="4" height="19" rx="2" fill={ORANGE} />
      <rect x="7.5" y="0" width="4" height="19" rx="2" fill={ORANGE} transform="rotate(90 9.5 9.5)" />
      <rect x="7.5" y="0" width="4" height="19" rx="2" fill={ORANGE} transform="rotate(45 9.5 9.5)" />
      <rect x="7.5" y="0" width="4" height="19" rx="2" fill={ORANGE} transform="rotate(-45 9.5 9.5)" />
    </motion.svg>
  );
}

function AnimatedContent() {
  const [cmdCount, setCmdCount] = useState(0);

  useEffect(() => {
    let startTimer;
    let ticker;
    startTimer = setTimeout(() => {
      ticker = setInterval(() => {
        setCmdCount((c) => {
          if (c >= FULL_CMD.length) {
            clearInterval(ticker);
            return c;
          }
          return c + 1;
        });
      }, TYPING_SPEED_MS);
    }, INITIAL_DELAY_S * 1000);
    return () => {
      clearTimeout(startTimer);
      clearInterval(ticker);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cmdDone = cmdCount >= FULL_CMD.length;
  const whiteTyped = FULL_CMD.slice(0, Math.min(cmdCount, CMD_WHITE.length));
  const blueTyped = cmdCount > CMD_WHITE.length ? FULL_CMD.slice(CMD_WHITE.length, cmdCount) : "";

  return (
    <>
      {/* Command prompt with typing animation */}
      <Box component="p" sx={{ m: 0, whiteSpace: "nowrap", color: WHITE }}>
        <span>&gt;&nbsp;</span>
        <span>{whiteTyped}</span>
        <Box component="span" sx={{ color: BLUE }}>{blueTyped}</Box>
        {!cmdDone && <BlinkingCursor />}
      </Box>

      {/* In-progress line with rotating snowflake */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: FOSTERING_DELAY, duration: 0.3 }}
        style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.35em", whiteSpace: "nowrap" }}
      >
        <SnowflakeIcon />
        <Box component="span" sx={{ color: ORANGE }}>Fostering...</Box>
      </motion.p>

      {/* Status output lines — staggered fade + slide up */}
      {STATUS_LINES.map(({ text, color }, i) => (
        <motion.p
          key={text}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: LINE_START + i * LINE_STAGGER, duration: 0.35, ease: "easeOut" }}
          style={{ margin: 0, whiteSpace: "nowrap", paddingLeft: "2ch", color }}
        >
          {text}
        </motion.p>
      ))}

      {/* Bottom prompt with blinking cursor */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: BOTTOM_DELAY, duration: 0.3 }}
        style={{ margin: 0, whiteSpace: "nowrap", color: WHITE, display: "flex", alignItems: "center" }}
      >
        <span>&gt;&nbsp;</span>
        <BlinkingCursor />
      </motion.p>
    </>
  );
}

export default function TerminalWindow() {
  const [iteration, setIteration] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIteration((i) => i + 1), LOOP_DURATION * 1000);
    return () => clearTimeout(timer);
  }, [iteration]);

  return (
    <Box
      aria-hidden="true"
      sx={{
        bgcolor: "#231F20",
        borderRadius: "8px",
        overflow: "hidden",
        width: "100%",
        fontFamily: "var(--font-roboto-mono), 'Courier New', monospace",
        fontWeight: 500,
      }}
    >
      {/* macOS-style title bar */}
      <Box
        sx={{
          height: 35,
          bgcolor: "rgba(93, 100, 114, 0.5)",
          display: "flex",
          alignItems: "center",
          px: "11px",
          gap: "6px",
        }}
      >
        <Box sx={{ width: 15, height: 15, borderRadius: "50%", bgcolor: "#FF5F57" }} />
        <Box sx={{ width: 15, height: 15, borderRadius: "50%", bgcolor: "#FEBC2E" }} />
        <Box sx={{ width: 15, height: 15, borderRadius: "50%", bgcolor: "#28C840" }} />
      </Box>

      {/* Terminal body — key forces full remount on each loop */}
      <Box
        sx={{
          px: "26px",
          pt: "32px",
          pb: "28px",
          fontSize: { xs: "9px", sm: "13px", md: "20px" },
          lineHeight: 2.5,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <AnimatedContent key={iteration} />
      </Box>
    </Box>
  );
}
