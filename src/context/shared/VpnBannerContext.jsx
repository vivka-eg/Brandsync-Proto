"use client";
import React, { createContext, useContext, useState } from "react";

const VpnBannerContext = createContext(null);

export function VpnBannerProvider({ children }) {
  const [vpnError, setVpnError] = useState(false);
  return (
    <VpnBannerContext.Provider value={{ vpnError, setVpnError }}>
      {children}
    </VpnBannerContext.Provider>
  );
}

export function useVpnBanner() {
  const ctx = useContext(VpnBannerContext);
  if (!ctx) throw new Error("useVpnBanner must be used within VpnBannerProvider");
  return ctx;
}
