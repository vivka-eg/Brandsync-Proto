"use client";
import React from "react";
import { Box, Typography } from "@mui/material";
import {
  BatteryFull,
  WifiHigh,
  CellSignalHigh,
  Envelope,
  MapTrifold,
  Camera,
  MusicNote,
  CreditCard,
  NoteBlank,
  Heart,
  Folder,
} from "phosphor-react";
import { motion } from "motion/react";

// ─── Dummy neighbour apps ─────────────────────────────────────────────────────
// Simple coloured rounded-square icons to simulate the surrounding app grid

const DUMMY_APPS = [
  { color: "#3B82F6", label: "Mail",    Icon: Envelope   },
  { color: "#10B981", label: "Maps",    Icon: MapTrifold },
  { color: "#F59E0B", label: "Photos",  Icon: Camera     },
  { color: "#EF4444", label: "Music",   Icon: MusicNote  },
  { color: "#8B5CF6", label: "Wallet",  Icon: CreditCard },
  { color: "#06B6D4", label: "Notes",   Icon: NoteBlank  },
  { color: "#EC4899", label: "Health",  Icon: Heart      },
  { color: "#F97316", label: "Files",   Icon: Folder     },
];

const pulseKeyframes = `
  @keyframes iconPulse {
    0%   { box-shadow: 0 0 0 0px rgba(255,255,255,0.7), 0 2px 6px rgba(0,0,0,0.22); }
    50%  { box-shadow: 0 0 0 4px rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.22); }
    100% { box-shadow: 0 0 0 0px rgba(255,255,255,0.7), 0 2px 6px rgba(0,0,0,0.22); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const shimmerStyle = (isDark) => ({
  background: isDark
    ? "linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%)"
    : "linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.4s ease-in-out infinite",
});

function SkeletonIcon({ isDark, size = ICON_SIZE, radius = ICON_RADIUS }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: radius,
        flexShrink: 0,
        ...shimmerStyle(isDark),
      }}
    />
  );
}

const ICON_SIZE = 36;
const ICON_RADIUS = "9px";
const DOCK_ICON_SIZE = 40;
const DOCK_ICON_RADIUS = "10px";

function DummyApp({ color, label, Icon, isDark }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", minWidth: 0, width: "100%" }}>
      <Box
        sx={{
          width: ICON_SIZE,
          height: ICON_SIZE,
          borderRadius: ICON_RADIUS,
          bgcolor: color,
          boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.15,
          filter: "saturate(0.1) contrast(0.6)",
          flexShrink: 0,
        }}
      >
        <Icon size={18} weight="bold" color="#fff" />
      </Box>
      <Typography
        sx={{
          fontSize: 8,
          color: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
          lineHeight: 1,
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

function AppIconCell({ logoUrl, logoName, isDark, isLoading }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", minWidth: 0, width: "100%" }}>
      <style>{pulseKeyframes}</style>
      {isLoading ? (
        <SkeletonIcon isDark={isDark} />
      ) : (
        <Box
          sx={{
            width: ICON_SIZE,
            height: ICON_SIZE,
            borderRadius: ICON_RADIUS,
            bgcolor: "#ffffff",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1.5px solid",
            borderColor: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.3)",
            animation: "iconPulse 2s ease-in-out infinite",
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/proxy-image?url=${encodeURIComponent(logoUrl)}`}
            alt={logoName}
            style={{ width: ICON_SIZE - 8, height: ICON_SIZE - 8, objectFit: "contain" }}
          />
        </Box>
      )}
      <Typography
        sx={{
          fontSize: 8,
          fontWeight: 600,
          color: isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.7)",
          lineHeight: 1.25,
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          px: 0.5,
          textAlign: "center",
        }}
      >
        {isLoading ? "\u00A0" : logoName?.replace(/^EG\s+/i, "")}
      </Typography>
    </Box>
  );
}

// ─── Phone frame ──────────────────────────────────────────────────────────────

function PhoneFrame({ isDark, logoUrl, logoName, appIconSlot, isLoading }) {
  const bg = isDark ? "#121212" : "#f5f5f5";
  const statusColor = isDark ? "#fff" : "#111";
  const dockBg = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)";

  const grid = [];
  let dummyIndex = 0;
  for (let i = 0; i < 12; i++) {
    if (i === appIconSlot) {
      grid.push({ type: "real" });
    } else {
      grid.push({ type: "dummy", ...DUMMY_APPS[dummyIndex % DUMMY_APPS.length] });
      dummyIndex++;
    }
  }

  return (
    <Box
      style={{
        width: "220px",
        height: "450px",
        borderRadius: "10px",
        border: "8px solid #E5E7EB",
        position: "relative",
        overflow: "hidden",
        background: bg,
        flexShrink: 0,
      }}
    >
      {/* Status bar */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          px: "14px",
          pt: "8px",
          pb: "4px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 5,
        }}
      >
        <Typography sx={{ fontSize: 9, fontWeight: 600, color: statusColor }}>9:41</Typography>
        <Box sx={{ display: "flex", gap: "3px", alignItems: "center", color: statusColor }}>
          <CellSignalHigh size={10} />
          <WifiHigh size={10} />
          <BatteryFull size={10} />
        </Box>
      </Box>

      {/* App grid */}
      <Box
        sx={{
          position: "absolute",
          top: 32,
          left: 0,
          right: 0,
          px: "12px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          columnGap: "8px",
          rowGap: "14px",
          alignItems: "start",
        }}
      >
        {grid.map((cell, i) =>
          cell.type === "real" ? (
            <AppIconCell key={i} logoUrl={logoUrl} logoName={logoName} isDark={isDark} isLoading={isLoading} />
          ) : (
            <DummyApp key={i} color={cell.color} label={cell.label} Icon={cell.Icon} isDark={isDark} />
          )
        )}
      </Box>

      {/* Dock */}
      <Box
        sx={{
          position: "absolute",
          bottom: 14,
          left: "12px",
          right: "12px",
          height: 60,
          borderRadius: "12px",
          bgcolor: dockBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          px: "12px",
        }}
      >
        {DUMMY_APPS.slice(0, 2).map((app, i) => {
          const DockIcon = app.Icon;
          return (
            <Box
              key={i}
              sx={{
                width: DOCK_ICON_SIZE,
                height: DOCK_ICON_SIZE,
                borderRadius: DOCK_ICON_RADIUS,
                bgcolor: app.color,
                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.15,
                filter: "saturate(0.1) contrast(0.6)",
              }}
            >
              <DockIcon size={20} weight="bold" color="#fff" />
            </Box>
          );
        })}
        {isLoading ? (
          <SkeletonIcon isDark={isDark} size={DOCK_ICON_SIZE} radius={DOCK_ICON_RADIUS} />
        ) : (
          <Box
            sx={{
              width: DOCK_ICON_SIZE,
              height: DOCK_ICON_SIZE,
              borderRadius: DOCK_ICON_RADIUS,
              bgcolor: "#ffffff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid",
              borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.07)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/proxy-image?url=${encodeURIComponent(logoUrl)}`}
              alt={logoName}
              style={{ width: DOCK_ICON_SIZE - 10, height: DOCK_ICON_SIZE - 10, objectFit: "contain" }}
            />
          </Box>
        )}
      </Box>

      {/* Home indicator */}
      <Box
        sx={{
          position: "absolute",
          bottom: 5,
          left: "50%",
          transform: "translateX(-50%)",
          width: 60,
          height: 3,
          borderRadius: "2px",
          bgcolor: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.15)",
        }}
      />
    </Box>
  );
}

// ─── Exported component ───────────────────────────────────────────────────────

function HomeScreenMockup({ logoUrl, logoName, isLoading }) {
  if (!logoUrl && !isLoading) return null;

  return (
    <Box>
      <Typography variant="overline" color="text.primary" fontWeight={1000} display="block" mb={0.5} sx={{ letterSpacing: "0.08em" }}>
        Home Screen Preview
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2.5}>
        How your app icon looks alongside other apps, in light and dark OS modes.
      </Typography>

      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            <PhoneFrame isDark={false} logoUrl={logoUrl} logoName={logoName} appIconSlot={2} isLoading={isLoading} />
          </motion.div>
          <Typography variant="caption" color="text.secondary">
            Light mode
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            <PhoneFrame isDark={true} logoUrl={logoUrl} logoName={logoName} appIconSlot={5} isLoading={isLoading} />
          </motion.div>
          <Typography variant="caption" color="text.secondary">
            Dark mode
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default HomeScreenMockup;
