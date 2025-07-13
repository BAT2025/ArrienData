"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Toast from "@/components/ui/Toast";

type ToastType = "success" | "error" | "info";

type ToastContextType = {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast debe usarse dentro de un ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    duration: number;
    key: number;
  } | null>(null);

  const showToast = (
    message: string,
    type: ToastType = "success",
    duration = 3000
  ) => {
    setToast({
      message,
      type,
      duration,
      key: Date.now(), // fuerza re-render
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
