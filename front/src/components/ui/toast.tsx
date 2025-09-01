"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { X } from "lucide-react";

/* ===========================
   Contexto del sistema de toast
   =========================== */
type ToastType = "success" | "error" | "info" | "warning";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
};

/* ===========================
   Provider (envolver app)
   =========================== */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000); // auto-cierra en 4s
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Contenedor en esquina superior derecha */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-md border text-sm font-medium animate-slideIn
              ${toast.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : ""}
              ${toast.type === "error" ? "bg-red-50 text-red-800 border-red-200" : ""}
              ${toast.type === "info" ? "bg-sky-50 text-sky-800 border-sky-200" : ""}
              ${toast.type === "warning" ? "bg-amber-50 text-amber-800 border-amber-200" : ""}
            `}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Animación */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </ToastContext.Provider>
  );
}
