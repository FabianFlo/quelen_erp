"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LoadingPage() {
    const router = useRouter();
    const params = useSearchParams();

    const next = useMemo(() => decodeURIComponent(params.get("next") || "/dashboard"), [params]);
    const msg = useMemo(() => decodeURIComponent(params.get("msg") || "Cargando tu experiencia..."), [params]);
    const duration = useMemo(() => {
        const d = Number(params.get("duration") || "1500");
        return isNaN(d) ? 1500 : Math.max(400, d); // mínimo 400ms para que se vea
    }, [params]);

    useEffect(() => {
        // Protección básica: si no hay usuario, volver a login
        try {
            const user = localStorage.getItem("usuario");
            if (!user) {
                router.replace("/login");
                return;
            }
        } catch {
            router.replace("/login");
            return;
        }

        const t = setTimeout(() => {
            router.replace(next);
        }, duration);

        return () => clearTimeout(t);
    }, [router, next, duration]);

    return (
        <div className="h-screen w-screen bg-white text-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Fondo suave */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-slate-50" />

            {/* Logo + pulso */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 flex flex-col items-center gap-6"
            >
                <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-2xl opacity-40" />
                    <Image src="/logo.png" alt="Logo" width={96} height={96} priority />
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="text-sm text-slate-600 text-center max-w-md px-6"
                >
                    {msg}
                </motion.p>

                {/* Barra de progreso *falsa* solo visual */}
                <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: "10%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: Math.min(duration / 1000, 2), ease: "easeInOut" }}
                        className="h-full bg-orange-500"
                    />
                </div>

                <p className="text-xs text-slate-400">Esto tomará un momento…</p>
            </motion.div>

            {/* Burbuja decorativa */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 0.25, y: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute -bottom-12 -right-10 w-64 h-64 rounded-full bg-orange-200 blur-3xl"
            />
        </div>
    );
}
