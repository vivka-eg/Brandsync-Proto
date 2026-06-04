"use client";
import useAuth from "@/hooks/useAuth";
import { createContext, useContext } from "react";

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const context = useAuth();

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
  return context;
};
