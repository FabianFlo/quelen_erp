"use client";
import { useEffect, useState, useCallback } from "react";
import { API_URL, COD_TEM } from "@/lib/config";

export function useProductores() {
  const [productores, setProductores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProductores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!API_URL) throw new Error("Falta NEXT_PUBLIC_API_URL");
      if (!COD_TEM) throw new Error("Falta NEXT_PUBLIC_COD_TEM");

      const base = (API_URL || "").replace(/\/+$/, "");
      const API = base.endsWith("/api") ? base : `${base}/api`;
      const url = `${API}/productores/${COD_TEM}/lookup`;

      console.log("GET productores =>", url);

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${txt}`);
      }

      // Backend: [{ codigo: "A5001", descripcion: "NOMBRE" }, ...]
      const data: { codigo: string; descripcion: string }[] = await res.json();

      const parsed = data.map((p) => {
        const code = p.codigo?.trim() ?? "";
        const name = p.descripcion?.trim() ?? "";
        return {
          value: code,
          name,
          label: `${code} - ${name}`,
        };
      });

      // Orden por nombre
      parsed.sort((a, b) => a.name.localeCompare(b.name, "es"));

      setProductores(parsed);
    } catch (e: any) {
      setError(e?.message ?? "Error cargando productores");
      setProductores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductores();
  }, [fetchProductores]);

  return { productores, loading, error, refresh: fetchProductores };
}
