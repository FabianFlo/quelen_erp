"use client";

import Image from "next/image";
import { useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Ticket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    const [loading, setLoading] = useState(false);

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
        setLoading(true);

        try {
            const result = await login({ userId: usuario, password });

            // Guardar datos simples de sesión
            localStorage.setItem("usuario", result.usuario);
            localStorage.setItem("tipo", result.tipo);

            router.push("/dashboard");
        } catch (error: any) {
            setFormError(error.message || "Error al iniciar sesión.");
            setLoading(false);
        }
    };

    return (
        <div className="relative flex h-screen bg-white text-slate-900 overflow-hidden">
            {/* Pantalla animada corta */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        key="loading"
                        className="absolute inset-0 z-50 bg-white flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <motion.div
                            initial={{ scale: 0.6, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.6, opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 180,
                                damping: 20,
                                duration: 0.45,
                            }}
                            className="text-center"
                        >
                            <Image src="/logo.png" alt="Logo" width={120} height={120} priority />
                            <motion.p
                                initial={{ y: 15, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 15, opacity: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                                className="mt-6 text-base text-slate-600 font-medium"
                            >
                                Cargando...
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Login formulario */}
            <div className="w-full lg:w-[30%] h-screen px-6 sm:px-8 flex flex-col justify-center space-y-6 sm:space-y-4 overflow-y-auto">
                <div className="flex justify-center mb-4">
                    <Image src="/logo.png" alt="Logo" width={96} height={96} />
                </div>

                <div className="text-center">
                    <h1 className="text-xl font-semibold">Iniciar sesión</h1>
                    <p className="text-sm mt-1">
                        ¿No tienes cuenta?{" "}
                        <a
                            href="http://192.168.7.25/help-desk2/views/formulario_solicitudes/index.php"
                            className="inline-flex items-center gap-2 text-orange-600 hover:underline font-medium"
                        >
                            Soporte
                            <Ticket className="w-4 h-5" />
                        </a>
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="usuario" className="mb-3">Usuario SDT</Label>
                        <Input
                            id="usuario"
                            value={usuario}
                            onChange={handleUsuarioChange}
                            onKeyDown={handleCapsLock}
                            autoComplete="off"
                            disabled={loading}
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
                            disabled={loading}
                        />
                        {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
                        {capsLock && <p className="text-xs text-yellow-600 mt-1">Mayúsculas activadas</p>}
                    </div>

                    {formError && (
                        <div className="text-sm text-red-600 font-medium text-center">{formError}</div>
                    )}

                    <Button
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        Iniciar
                    </Button>
                </div>

                <div className="text-center mt-8 text-xs text-slate-500">
                    <p>Versión 0.1 – Ambiente: Dev</p>
                </div>
                <div className="mt-6 text-xs text-slate-400 text-center space-x-2">
                    <a href="#" className="hover:underline">Término de condiciones</a>
                    <span>·</span>
                    <a href="#" className="hover:underline">Política de privacidad</a>
                </div>
            </div>

            {/* Imagen decorativa derecha */}
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
