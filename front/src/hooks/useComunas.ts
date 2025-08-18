"use client";
import { useEffect, useState, useCallback } from "react";
import { API_URL, COD_TEM } from "@/lib/config";

export function useComunas() {
    const [comunas, setComunas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchComunas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            if (!API_URL) throw new Error("Falta NEXT_PUBLIC_API_URL");
            if (!COD_TEM) throw new Error("Falta NEXT_PUBLIC_COD_TEM");

            const res = await fetch(`${API_URL}/comunas/${COD_TEM}`, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            // Backend: List<String> "COD - DESCRIPCION"
            const data: string[] = await res.json();

            const parsed = data.map((s) => {
                const [code, ...rest] = s.split(" - ");
                const name = rest.join(" - ").trim();
                const label = rest.length ? `${code.trim()} - ${name}` : code.trim();
                return { value: code.trim(), name, label };
            });

            // Ordena por nombre asc para UX
            parsed.sort((a: any, b: any) => a.name.localeCompare(b.name, "es"));

            setComunas(parsed);
        } catch (e: any) {
            setError(e?.message ?? "Error cargando comunas");
            setComunas([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchComunas(); }, [fetchComunas]);

    return { comunas, loading, error, refresh: fetchComunas };
}
