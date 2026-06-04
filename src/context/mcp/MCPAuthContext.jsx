"use client";
import useMCPAuth from "@/hooks/useMCPAuth";
import { createContext, useContext } from "react";

export const MCPAuthContext = createContext({});

export const MCPAuthContextProvider = ({ children }) => {
  const context = useMCPAuth();

  return (
    <MCPAuthContext.Provider value={context}>{children}</MCPAuthContext.Provider>
  );
};

export const useMCPAuthContext = () => {
  const context = useContext(MCPAuthContext);
  if (!context) {
    throw new Error(
      "useMCPAuthContext must be used within a MCPAuthContextProvider"
    );
  }
  return context;
};
