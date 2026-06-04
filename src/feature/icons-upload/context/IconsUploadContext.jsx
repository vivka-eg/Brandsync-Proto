"use client";
import useIconsUpload from "../hooks/useIconsUpload";
import React, { useContext } from "react";
import { createContext } from "react";

export const IconsUploadContext = createContext({});

export const IconsUploadContextProvider = ({ children }) => {
  const contextValue = useIconsUpload();
  return (
    <IconsUploadContext.Provider
      value={contextValue}
    >
      {children}
    </IconsUploadContext.Provider>
  );
};

export function useIconsUploadContext() {
  const context = useContext(IconsUploadContext);
  if (!context) {
    throw new Error(
      "useIconsUploadContext must be used within an IconsUploadContextProvider"
    );
  }
  return context;
}

export default IconsUploadContext;
