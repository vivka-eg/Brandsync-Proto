"use client";
import React, { useState } from "react";
import Loader from "./shared/Loader";
import { useAuthContext } from "@/context/auth/AuthContext";
import { Box, Typography } from "@mui/material";
import { useVpnBanner } from "@/context/shared/VpnBannerContext";
import { WifiSlash } from "@phosphor-icons/react";
import VpnContentAlert from "@/components/shared/VpnContentAlert";

function VpnBanner() {
  const { vpnError } = useVpnBanner();
  if (!vpnError) return null;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        px: 2,
        py: 1,
        bgcolor: "warning.main",
        color: "warning.contrastText",
      }}
    >
      <WifiSlash size={16} weight="bold" />
      <Typography variant="caption" fontWeight={600}>
        Connect to the EG VPN to access all features of EG BrandSync.
      </Typography>
    </Box>
  );
}

function ClientLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const { authError } = useAuthContext();
  const { setVpnError } = useVpnBanner();

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 150);
  }, []);

  React.useEffect(() => {
    fetch("/api/vpn-check")
      .then((res) => res.json())
      .then(({ reachable }) => { if (!reachable) setVpnError(true); })
      .catch(() => setVpnError(true));
  }, [setVpnError]);

  if (loading) {
    return <Loader />;
  }

  if (authError === "vpn_required") {
    return <VpnContentAlert />;
  }

  return (
    <>
      <VpnBanner />
      {children}
    </>
  );
}

export default ClientLayout;
