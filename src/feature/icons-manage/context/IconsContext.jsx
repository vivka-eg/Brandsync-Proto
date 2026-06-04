"use client";
import useIcons from "../hooks/manage/useIcons";
import React, { useContext } from "react";
import { createContext } from "react";

export const IconsContext = createContext({});

export const IconsContextProvider = ({ children }) => {
  const contextValue = useIcons();
  return (
    <IconsContext.Provider value={contextValue}>
      {children}
    </IconsContext.Provider>
  );
};

export function useIconsContext() {
  const context = useContext(IconsContext);
  if (!context) {
    throw new Error(
      "useIconsContext must be used within an IconsContextProvider"
    );
  }
  return context;
}

export default IconsContext;
