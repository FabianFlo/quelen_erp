"use client";
import { useEffect, useState, useCallback } from "react";
import { API_URL, COD_TEM } from "@/lib/config";

export function useExportadores() {
  const [exportadores, setExportadores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExportadores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!API_URL) throw new Error("Falta NEXT_PUBLIC_API_URL");
      if (!COD_TEM) throw new Error("Falta NEXT_PUBLIC_COD_TEM");

      // Normaliza base y garantiza /api una sola vez (igual que comunas)
      const base = (API_URL || "").replace(/\/+$/, "");
      const API = base.endsWith("/api") ? base : `${base}/api`;
      const url = `${API}/productores/exportador/${COD_TEM}`;

      console.log("GET exportadores =>", url);

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${txt}`);
      }

      // Backend: List<String> "COD_EXP - NOM_EXP"
      const data: string[] = await res.json();

      const parsed = data.map((s) => {
        const [code, ...rest] = s.split(" - ");
        const name = rest.join(" - ").trim();
        const label = rest.length ? `${code.trim()} - ${name}` : code.trim();
        return { value: code.trim(), name, label };
      });

      // Orden por nombre
      parsed.sort((a: any, b: any) => a.name.localeCompare(b.name, "es"));

      setExportadores(parsed);
    } catch (e: any) {
      setError(e?.message ?? "Error cargando exportadores");
      setExportadores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchExportadores(); }, [fetchExportadores]);

  return { exportadores, loading, error, refresh: fetchExportadores };
}
