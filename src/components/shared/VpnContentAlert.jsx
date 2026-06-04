"use client";
import { Box, Alert, AlertTitle, Typography, Button, Divider } from "@mui/material";
import { WifiSlash, ArrowClockwise } from "@phosphor-icons/react";
import Lottie from "lottie-react";
import vpnAnimation from "../../../public/animations/vpn.json";
import BreakoutGame from "./BreakoutGame";

/**
 * Shown when CMS/API content is unreachable — typically because the user
 * is not connected to the EG VPN.
 *
 * @param {string} [title]  - Human-readable name of the content that failed
 *                            to load (e.g. "Introduction", "Logo Placement").
 *                            Defaults to a generic label.
 */
export default function VpnContentAlert({ title }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        p: { xs: 4, md: 6 },
        minHeight: "400px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          color: "text.disabled",
        }}
      >
        <Lottie animationData={vpnAnimation} loop={false} style={{ width: 135, height: 135 }} />
        <Typography variant="body2" color="text.disabled">
          This page is protected to safeguard company assets
        </Typography>
      </Box>

      <Alert
        severity="warning"
        icon={<WifiSlash size={18} />}
        sx={{ maxWidth: 480, width: "100%" }}
      >
        <AlertTitle>VPN connection required</AlertTitle>
        This content is only accessible on the EG network. Connect to the{" "}
        <strong>EG VPN</strong>, then click the button below to reload.
      </Alert>

      <Button
        variant="contained"
        startIcon={<ArrowClockwise size={18} weight="bold" />}
        onClick={() => window.location.reload()}
        sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 3 }}
      >
        Refresh page
      </Button>

      {/* Kill time while connecting */}
      <Box sx={{ width: "100%", maxWidth: 520, mt: 1 }}>
        <Divider sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.disabled" sx={{ px: 1 }}>
            kill time while you connect
          </Typography>
        </Divider>
        <BreakoutGame />
      </Box>
    </Box>
  );
}
