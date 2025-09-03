"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { API_URL, COD_EMP, COD_TEM } from "@/lib/config";
import { MapPinHouse, BotIcon, HandIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { useState } from "react";
import ComunaSelect from "@/components/ui/ComunaSelect";
import ProductorSelect from "@/components/ui/ProductorSelect";

/* =========================
   Helpers
   ========================= */
const toUpperMax = (v: string, max: number) =>
  (v || "").toUpperCase().slice(0, max);

function normalizeCodCom(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  let s = String(value).trim();
  const onlyDigits = s.match(/\d+/)?.[0] || "";
  if (!onlyDigits) return null;
  return onlyDigits;
}

/* =========================
   Formulario interno
   ========================= */
function PredioForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [predio, setPredio] = useState({
    codPro: "",
    descripcion: "",
    direccion: "",
    comuna: "",
    csg: "",
  });

  const onChangeFmt =
    (field: keyof typeof predio, normalizer: (v: string) => string, maxLen?: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value ?? "";
      const value = normalizer(raw);
      setPredio({ ...predio, [field]: value });
      if (maxLen) e.currentTarget.maxLength = maxLen;
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };

  function validate() {
    const newErrors: Record<string, string> = {};

    if (!COD_EMP) newErrors.general = "Falta NEXT_PUBLIC_COD_EMP";
    if (!COD_TEM) newErrors.general = "Falta NEXT_PUBLIC_COD_TEM";
    if (!API_URL) newErrors.general = "Falta NEXT_PUBLIC_API_URL";

    if (!predio.codPro?.trim()) newErrors.codPro = "Código de productor requerido";
    else if (predio.codPro.length > 16)
      newErrors.codPro = "Código excede 16 caracteres";

    if (!predio.descripcion?.trim())
      newErrors.descripcion = "Descripción requerida";
    else if (predio.descripcion.length > 100)
      newErrors.descripcion = "Descripción excede 100 caracteres";

    if (!predio.direccion?.trim()) newErrors.direccion = "Dirección requerida";
    else if (predio.direccion.length > 50)
      newErrors.direccion = "Dirección excede 50 caracteres";

    const codCom = normalizeCodCom(predio.comuna);
    if (!codCom) newErrors.comuna = "Selecciona una comuna válida";

    if (!predio.csg?.trim()) newErrors.csg = "CSG requerido";
    else if (predio.csg.length > 12) newErrors.csg = "CSG excede 12 caracteres";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const guardarPredio = async () => {
    if (!validate()) {
      showToast("⚠️ Corrige los errores antes de continuar", "warning");
      return;
    }

    try {
      const body = {
        codEmp: COD_EMP,
        codTem: COD_TEM,
        codPro: predio.codPro?.trim(),
        codPre: predio.csg?.trim(),
        descripcion: predio.descripcion?.trim(),
        direccion: predio.direccion?.trim(),
        codCom: normalizeCodCom(predio.comuna),
      };

      const base = (API_URL || "").replace(/\/+$/, "");
      const API = base.endsWith("/api") ? base : `${base}/api`;
      const url = `${API}/predios`;

      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        let errMsg = `HTTP ${resp.status}`;
        try {
          const errData = await resp.json();
          if (errData?.message) errMsg = errData.message;
        } catch {
          const txt = await resp.text().catch(() => "");
          if (txt) errMsg = txt;
        }
        throw new Error(errMsg);
      }

      const data = await resp.json().catch(() => ({} as any));
      if (data?.created) {
        showToast(`✅ Predio ${data.codPre} creado correctamente`, "success");
        router.push("/productores/listar");
      } else {
        showToast(
          `⚠️ No se pudo crear: ${data?.message ?? "Error desconocido"}`,
          "warning"
        );
      }
    } catch (e: any) {
      showToast(`❌ Error al guardar: ${e?.message ?? e}`, "error");
    }
  };

  return (
    <>
      <div className="flex border-b pb-1 mb-6">
        <MapPinHouse />
        <h5 className="text-xl ml-4 font-extrabold text-gray-800 tracking-tight">
          Asignar Predios al Productor
        </h5>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Código Productor con ProductorSelect */}
        <div className="space-y-1.5 md:col-span-1">
          <Label>Productor (código)</Label>
          <ProductorSelect
            value={predio.codPro}
            onChange={(codigo) => {
              setPredio({ ...predio, codPro: codigo });
              setErrors((prev) => ({ ...prev, codPro: "" }));
            }}
          />
          {errors.codPro && <p className="text-sm text-red-600">{errors.codPro}</p>}
        </div>

        {/* Descripción */}
        <div className="space-y-1.5 md:col-span-2">
          <Label>Descripción</Label>
          <Input
            placeholder="Ej: PARCELA 27 LOS GUINDOS"
            value={predio.descripcion}
            onChange={onChangeFmt("descripcion", (v) => toUpperMax(v, 100), 100)}
          />
          {errors.descripcion && (
            <p className="text-sm text-red-600">{errors.descripcion}</p>
          )}
        </div>

        {/* Comuna con ComunaSelect */}
        <div className="space-y-1.5 md:col-span-1">
          <Label>Comuna</Label>
          <ComunaSelect
            value={predio.comuna}
            onChange={(codigo) => {
              setPredio({ ...predio, comuna: codigo as string });
              setErrors((prev) => ({ ...prev, comuna: "" }));
            }}
          />
          {errors.comuna && (
            <p className="text-sm text-red-600">{errors.comuna}</p>
          )}
        </div>

        {/* Dirección */}
        <div className="space-y-1.5 md:col-span-2">
          <Label>Dirección</Label>
          <Input
            placeholder="Ej: MALALHUE S/N"
            value={predio.direccion}
            onChange={onChangeFmt("direccion", (v) => toUpperMax(v, 50), 50)}
          />
          {errors.direccion && (
            <p className="text-sm text-red-600">{errors.direccion}</p>
          )}
        </div>

        {/* CSG */}
        <div className="space-y-1.5 md:col-span-3">
          <Label>CSG</Label>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Input
              placeholder="Ej: 105300"
              className={`flex-1 min-w-[250px] ${
                errors.csg ? "border-red-500 focus:ring-red-500" : ""
              }`}
              value={predio.csg}
              onChange={onChangeFmt("csg", (v) => toUpperMax(v, 12), 12)}
            />
            <Button
              type="button"
              className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-1.5"
              onClick={() => console.log("Buscar CSG automáticamente")}
            >
              <BotIcon size={16} />
              Auto
            </Button>
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-1.5"
            >
              <a
                href="https://sra.sag.gob.cl/SRA_COMUNES/SRA_ContComunExt.asp?opcMenu=BusCodSAG"
                target="_blank"
                rel="noopener noreferrer"
              >
                <HandIcon size={16} />
                Manual
              </a>
            </Button>
          </div>
          {errors.csg && <p className="text-sm text-red-600">{errors.csg}</p>}
        </div>
      </div>

      <div className="flex justify-end mt-10">
        <Button
          className="bg-emerald-600 hover:bg-emerald-800 text-white text-md px-6 py-2 rounded-lg shadow-md transition-all"
          onClick={guardarPredio}
        >
          Guardar Predio
        </Button>
      </div>
    </>
  );
}

/* =========================
   Export con ToastProvider
   ========================= */
export default function Page() {
  return (
    <ToastProvider>
      <PredioForm />
    </ToastProvider>
  );
}
