"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
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
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Creamos un contenedor dedicado en <body> para evitar cualquier stacking context
    const el = document.createElement("div");
    el.id = "toast-portal";
    // Posición y z-index ABSOLUTAMENTE arriba de todo
    el.style.position = "fixed";
    el.style.top = "1rem";
    el.style.right = "1rem";
    el.style.zIndex = "99999999999"; // más alto que cualquier header/tabs loco
    el.style.pointerEvents = "none"; // que no bloquee clics debajo salvo en los toasts
    document.body.appendChild(el);
    setPortalEl(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const Stack = (
    <>
      <div
        className="flex flex-col gap-3"
        style={{
          // ya está fixed en el contenedor, acá solo por claridad
          pointerEvents: "none",
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-md border text-sm font-medium animate-slideIn
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
              aria-label="Cerrar notificación"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

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
    </>
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {portalEl ? createPortal(Stack, portalEl) : null}
    </ToastContext.Provider>
  );
}
