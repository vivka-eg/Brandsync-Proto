"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ArrowClockwise,
  Lock,
  DotsThreeVertical,
  X,
  Plus,
} from "phosphor-react";

// macOS Chrome colour palette
const CHROME_BG    = "#DEE1E6";   // overall frame background
const CHROME_DARK  = "#C8CAD0";   // slightly darker accent / separator
const URL_BG       = "#F1F3F4";   // URL bar fill
const ICON_COLOR   = "#5F6368";   // standard Chrome icon gray
const ICON_DISABLED= "#BDBDBD";   // disabled forward arrow

/**
 * macOS Chrome-style browser frame wrapping a screenshot.
 * @param {ReactNode}                    props.children
 * @param {"desktop"|"tablet"|"mobile"} props.device
 */
export default function BrowserFrame({ children, device = "desktop" }) {
  const isMobile = device === "mobile";

  return (
    <Box
      sx={{
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.20), 0 0 0 1px rgba(0,0,0,0.08)",
        bgcolor: CHROME_BG,
        width: "100%",
        border: "5px solid #c6c6c6",
      }}
    >
      {/* ── Tab bar ──────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          px: "12px",
          pt: "5px",
          pb: 0,
          bgcolor: CHROME_BG,
          gap: "24px",
          minHeight: 28,
        }}
      >
        {/* Traffic lights */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px", pb: "4px", flexShrink: 0 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#FF5F57", border: "0.5px solid rgba(0,0,0,0.12)" }} />
          <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#FEBC2E", border: "0.5px solid rgba(0,0,0,0.12)" }} />
          <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#28C840", border: "0.5px solid rgba(0,0,0,0.12)" }} />
        </Box>

        {/* Active tab; white pill that sits on top of the address bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            bgcolor: "white",
            borderRadius: "6px 6px 0 0",
            px: "10px",
            py: "3px",
            minWidth: isMobile ? 90 : 160,
            maxWidth: isMobile ? 140 : 240,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          <Image src="/BrandSync_logomark.svg" width={14} height={14} alt="" style={{ flexShrink: 0 }} />
          <Typography
            noWrap
            sx={{
              flex: 1,
              fontSize: "0.68rem",
              lineHeight: 1,
              color: "#202124",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: 500,
            }}
          >
            EG BrandSync
          </Typography>
          <X size={11} color={ICON_COLOR} style={{ flexShrink: 0 }} />
        </Box>

        {/* New tab button */}
        <Box sx={{ pb: "4px", display: "flex", alignItems: "center" }}>
          <Plus size={14} color={ICON_COLOR} />
        </Box>
      </Box>

      {/* ── Address / navigation bar ─────────────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "4px" : "6px",
          px: "12px",
          py: "6px",
          bgcolor: CHROME_BG,
          borderTop: `1px solid ${CHROME_DARK}`,
          borderBottom: `1px solid ${CHROME_DARK}`,
        }}
      >
        {/* Back / Forward / Refresh */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
          <Box sx={{ p: "3px", borderRadius: "50%", display: "flex", "&:hover": { bgcolor: "rgba(0,0,0,0.06)" } }}>
            <ArrowLeft size={14} color={ICON_COLOR} weight="bold" />
          </Box>
          <Box sx={{ p: "3px", borderRadius: "50%", display: "flex", "&:hover": { bgcolor: "rgba(0,0,0,0.06)" } }}>
            <ArrowRight size={14} color={ICON_DISABLED} weight="bold" />
          </Box>
          {!isMobile && (
            <Box sx={{ p: "3px", borderRadius: "50%", display: "flex", "&:hover": { bgcolor: "rgba(0,0,0,0.06)" } }}>
              <ArrowClockwise size={14} color={ICON_COLOR} weight="bold" />
            </Box>
          )}
        </Box>

        {/* URL bar; pill shape */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "5px",
            bgcolor: URL_BG,
            borderRadius: "20px",
            border: "1px solid rgba(0,0,0,0.08)",
            px: "10px",
            py: "4px",
            overflow: "hidden",
          }}
        >
          <Lock size={11} color={ICON_COLOR} weight="bold" style={{ flexShrink: 0 }} />
          <Typography
            noWrap
            sx={{
              flex: 1,
              fontSize: "0.66rem",
              color: "#202124",
              lineHeight: 1,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            https://www.brand.egsync.com
          </Typography>
          <DotsThreeVertical size={13} color={ICON_COLOR} style={{ flexShrink: 0 }} />
        </Box>
      </Box>

      {/* ── Screenshot content ───────────────────────────── */}
      <Box sx={{ lineHeight: 0 }}>
        {children}
      </Box>
    </Box>
  );
}
