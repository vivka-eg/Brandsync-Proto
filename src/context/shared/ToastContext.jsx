"use client";
import React, { createContext, useContext, useState } from "react";
import Toast from "@/components/shared/Toast";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ open: false, type: "success" });

  return (
    <ToastContext.Provider value={{ toast, setToast }}>
      {children}
      <Toast
        open={toast.open}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        message={toast.message}
        variant={toast.variant}
        position={toast.position}
        duration={toast.duration === null ? null : toast.duration ?? 6000}
        lottiePath={toast.lottiePath}
        showCloseButton={toast.showCloseButton !== false}
      />
    </ToastContext.Provider>
  );
};

export default ToastContext;
