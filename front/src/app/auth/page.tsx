"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";

export default function LoginPage() {
    const router = useRouter();

    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [capsLock, setCapsLock] = useState(false);
    const [usuarioError, setUsuarioError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const err = localStorage.getItem("login_error");
        if (err) {
            setFormError(err);
            localStorage.removeItem("login_error");
        }
    }, []);

    const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s/g, "").toLowerCase();
        setUsuarioError(/\s/.test(e.target.value) ? "No se permiten espacios." : "");
        setUsuario(value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s/g, "");
        setPasswordError(/\s/.test(e.target.value) ? "La contraseña no puede tener espacios." : "");
        setPassword(value);
    };

    const handleCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
        setCapsLock(e.getModifierState("CapsLock"));
    };

    const handleLogin = async () => {
        if (!usuario || !password || usuarioError || passwordError) {
            setFormError("Por favor, completa todos los campos correctamente.");
            return;
        }
        setFormError("");
        setSubmitting(true);

        try {
            const result = await login({ userId: usuario, password });

            if (typeof result?.tipo === "string" && result.tipo.startsWith("ERROR")) {
                setFormError(result.tipo);
                setSubmitting(false);
                return;
            }

            // Guardar sesión para Sidebar
            localStorage.setItem("usuario", result.usuario);
            localStorage.setItem("tipo", result.tipo);
            document.cookie = `usuario=${encodeURIComponent(result.usuario)}; path=/; max-age=3600; samesite=lax`;

            try {
                window.dispatchEvent(new StorageEvent("storage", { key: "usuario", newValue: result.usuario }));
            } catch {}

            const msg = encodeURIComponent("Cargando...");
            const next = encodeURIComponent("/dashboard");
            const duration = 1500; // ms
            router.push(`/loading?next=${next}&msg=${msg}&duration=${duration}`);
        } catch (error: any) {
            setFormError(error?.message || "Error al iniciar sesión.");
            setSubmitting(false);
        }
    };

    return (
        <div className="relative flex h-screen bg-white text-slate-900 overflow-hidden">
            {/* Columna izquierda: formulario */}
            <div className="w-full lg:w-[30%] h-screen px-6 sm:px-8 flex flex-col justify-center space-y-6 sm:space-y-4 overflow-y-auto">
                <div className="flex justify-center mb-4">
                    <Image src="/logo.png" alt="Logo" width={96} height={96} />
                </div>

                <div className="text-center">
                    <h1 className="text-xl font-semibold">Iniciar sesión</h1>
                    <p className="text-sm mt-1">
                        ¿No tienes cuenta?{" "}
                        <a
                            href="http://192.168.7.25/help-desk2/"
                            className="inline-flex items-center gap-2 text-orange-600 hover:underline font-medium"
                        >
                            Soporte
                            <Ticket className="w-4 h-5" />
                        </a>
                    </p>
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!submitting) handleLogin();
                    }}
                    className="space-y-4"
                >
                    <div>
                        <Label htmlFor="usuario" className="mb-3">Usuario SDT</Label>
                        <Input
                            id="usuario"
                            value={usuario}
                            onChange={handleUsuarioChange}
                            onKeyDown={handleCapsLock}
                            autoComplete="off"
                            disabled={submitting}
                        />
                        {usuarioError && <p className="text-xs text-red-500 mt-1">{usuarioError}</p>}
                    </div>

                    <div>
                        <Label htmlFor="password" className="mb-3">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            onKeyDown={handleCapsLock}
                            disabled={submitting}
                        />
                        {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
                        {capsLock && <p className="text-xs text-yellow-600 mt-1">Mayúsculas activadas</p>}
                    </div>

                    {formError && (
                        <div className="text-sm text-red-600 font-medium text-center">{formError}</div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                        disabled={submitting}
                    >
                        {submitting ? "Validando..." : "Iniciar"}
                    </Button>
                </form>

                <div className="text-center mt-8 text-xs text-slate-500">
                    <p>Versión 0.1 – Ambiente: Dev</p>
                </div>
                <div className="mt-6 text-xs text-slate-400 text-center space-x-2">
                    <a href="#" className="hover:underline">Término de condiciones</a>
                    <span>·</span>
                    <a href="#" className="hover:underline">Política de privacidad</a>
                </div>
            </div>

            {/* Columna derecha: imagen/intro */}
            <div className="hidden lg:flex w-[70%] relative h-screen overflow-hidden items-center justify-center bg-slate-100">
                <Image
                    src="/fondo.png"
                    alt="Fondo"
                    fill
                    className="object-cover"
                    priority
                />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="z-10"
                >
                    <Card className="bg-white/90 backdrop-blur-lg p-6 w-[300px] shadow-xl border border-slate-200 text-center">
                        <h2 className="text-lg font-semibold mb-2">Bienvenido a Quelen ERP</h2>
                        <p className="text-sm text-slate-600 mb-4">
                            Optimiza tus procesos, gestiona tu campo y mantente conectado con tu operación.
                        </p>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
