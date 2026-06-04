"use client";
import useIconTypesAndCategory from "@/hooks/useIconTypesAndCategory";
import React, { useContext } from "react";
import { createContext } from "react";

export const IconTypesAndCategoryContext = createContext({});

export const IconTypesAndCategoryContextProvider = ({ children }) => {
  const contextValue = useIconTypesAndCategory();
  return (
    <IconTypesAndCategoryContext.Provider value={contextValue}>
      {children}
    </IconTypesAndCategoryContext.Provider>
  );
};

export function useIconTypesAndCategoryContext() {
  const context = useContext(IconTypesAndCategoryContext);
  if (!context) {
    throw new Error(
      "IconTypesAndCategoryContext must be used within an IconTypesAndCategoryContext"
    );
  }
  return context;
}

export default IconTypesAndCategoryContextProvider;
