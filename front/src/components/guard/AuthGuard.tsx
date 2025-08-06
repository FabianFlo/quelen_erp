"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const usuario = localStorage.getItem("usuario");
        if (!usuario) {
            router.replace("/auth"); // redirige si no hay sesión
        }
    }, []);

    return <>{children}</>;
}
