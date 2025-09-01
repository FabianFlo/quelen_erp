"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ComunaSelect from "@/components/ui/ComunaSelect";
import { Button } from "@/components/ui/button";
import { UserRound, BotIcon, HandIcon } from "lucide-react";
import ExportadorSelect from "@/components/ui/ExportadorSelect";
import { useRouter } from "next/navigation";
import { useProductorWizard } from "../../context/ProductorWizardContext";
import { API_URL, COD_EMP, COD_TEM } from "@/lib/config";
import { ToastProvider, useToast } from "@/components/ui/toast";

/* =========================
   Helpers
   ========================= */
const toUpperMax = (v: string, max: number) => (v || "").toUpperCase().slice(0, max);
const normalizeGGN = (raw: string) => (raw || "").replace(/[^0-9A-Za-z]/g, "").slice(0, 16);
const normalizeDireccion = (raw: string) => toUpperMax(raw || "", 50);
const normalizeCiudad = (raw: string) => toUpperMax(raw || "", 15);
const normalizeCodigo = (raw: string) => toUpperMax(raw || "", 16);
const normalizeNombre = (raw: string) => toUpperMax(raw || "", 100);

function formatRutInput(raw: string): string {
  if (!raw) return "";

  let v = raw.replace(/[^0-9kK]/g, "").toUpperCase();

  if (v.length > 10) v = v.slice(0, 10);

  let num = v.slice(0, -1);
  let dv = v.slice(-1);

  if (num) {
    const n = Number(num);
    num = isNaN(n) ? "" : String(n);
  }

  if (num) num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return dv ? `${num}-${dv}` : num;
}

function parseRut(raw: string | undefined) {
  const invalid = { rutPro: undefined as number | undefined, dv: undefined as string | undefined };
  if (!raw) return invalid;

  const s = String(raw).replace(/\./g, "").trim().toUpperCase();
  const parts = s.split("-");

  let numStr = "";
  let dv = "";

  if (parts.length === 2) {
    numStr = parts[0].replace(/\D/g, "");
    dv = (parts[1] || "").trim().slice(0, 1);
  } else {
    numStr = s.replace(/\D/g, "");
    const tail = s.replace(/[0-9\-\.]/g, "");
    dv = (tail.slice(-1) || s.slice(-1) || "").toUpperCase();
    if (!/[0-9K]/i.test(dv)) dv = "";
  }

  if (numStr.length < 7 || numStr.length > 9) return invalid;

  const num = Number(numStr);
  if (!Number.isInteger(num) || num <= 0 || num > 2147483647) return invalid;

  if (!dv || dv.length !== 1 || !/^[0-9K]$/i.test(dv)) return invalid;

  return { rutPro: num, dv: dv.toUpperCase() };
}

function normalizeCodCom(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  let s = String(value).trim();
  const onlyDigits = s.match(/\d+/)?.[0] || "";
  if (!onlyDigits) return null;
  return onlyDigits;
}

/* =========================
   Inner Form Component
   ========================= */
function ProductorForm() {
  const router = useRouter();
  const { productor, setProductor, usuarioCreador, setUsuarioCreador } = useProductorWizard();
  const { showToast } = useToast();

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!usuarioCreador && typeof window !== "undefined") {
      const u = localStorage.getItem("usuario");
      if (u) setUsuarioCreador(u);
    }
  }, [usuarioCreador, setUsuarioCreador]);

  const onChangeFmt =
    (field: keyof typeof productor, normalizer: (v: string) => string, maxLen?: number) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value ?? "";
        const value = normalizer(raw);
        setProductor({ ...productor, [field]: value } as any);
        if (maxLen) e.currentTarget.maxLength = maxLen;
        setErrors((prev) => ({ ...prev, [field]: "" }));
      };

  function validate() {
    const newErrors: Record<string, string> = {};

    if (!COD_EMP) newErrors.general = "Falta NEXT_PUBLIC_COD_EMP";
    if (!COD_TEM) newErrors.general = "Falta NEXT_PUBLIC_COD_TEM";
    if (!API_URL) newErrors.general = "Falta NEXT_PUBLIC_API_URL";

    if (!productor.codigo?.trim()) newErrors.codigo = "Código requerido";
    else if (productor.codigo.length > 16) newErrors.codigo = "Código excede 16 caracteres";

    if (!productor.nombre?.trim()) newErrors.nombre = "Nombre requerido";
    else if (productor.nombre.length > 100) newErrors.nombre = "Nombre excede 100 caracteres";

    if (!productor.direccion?.trim()) newErrors.direccion = "Dirección requerida";
    else if (productor.direccion.length > 50) newErrors.direccion = "Dirección excede 50 caracteres";

    if (!productor.ciudad?.trim()) newErrors.ciudad = "Ciudad requerida";
    else if (productor.ciudad.length > 15) newErrors.ciudad = "Ciudad excede 15 caracteres";

    const { rutPro, dv } = parseRut(productor.rut);
    if (!rutPro) newErrors.rut = "RUT inválido (ej: 12.345.678-K)";
    if (!dv) newErrors.rut = "DV inválido (0-9 o K).";

    const codCom = normalizeCodCom(productor.comuna);
    if (!codCom) newErrors.comuna = "Selecciona una comuna válida";

    if (!productor.exportador) newErrors.exportador = "Exportador es requerido";

    if (!productor.ggn?.trim()) newErrors.ggn = "GGN requerido";
    else if (productor.ggn.length > 16) newErrors.ggn = "GGN excede 16 caracteres";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleGuardar() {
    if (!validate()) {
      showToast("⚠️ Corrige los errores antes de continuar", "warning");
      return;
    }

    const { rutPro, dv } = parseRut(productor.rut);
    const ciuPro = productor.ciudad?.trim().toUpperCase() || null;
    const codCom = normalizeCodCom(productor.comuna);
    const zon = "C";

    const payload = {
      codEmp: COD_EMP,
      codTem: COD_TEM,
      codPro: productor.codigo?.trim(),
      nomPro: productor.nombre?.trim(),
      zon,
      rutPro: rutPro!,
      dv: dv!,
      dirPro: productor.direccion?.trim(),
      ciuPro,
      codCom,
      comunaCodigo: codCom,
      ggn: productor.ggn?.trim(),
      creadoPor: usuarioCreador || null,
      expCodigo: productor.exportador || null,
    };

    try {
      const base = (API_URL || "").replace(/\/+$/, "");
      const API = base.endsWith("/api") ? base : `${base}/api`;
      const url = `${API}/productores`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // 🔹 Manejo de errores limpio
      if (!res.ok) {
        let errMsg = `HTTP ${res.status}`;
        try {
          const errData = await res.json();
          if (errData?.message) errMsg = errData.message; // solo mostrar el mensaje del back
        } catch {
          const txt = await res.text().catch(() => "");
          if (txt) errMsg = txt;
        }
        throw new Error(errMsg);
      }

      const data = await res.json().catch(() => ({} as any));
      if (data?.created) {
        showToast(`✅ Productor ${data.codPro} creado correctamente`, "success");
        // router.push("/productores");
      } else {
        showToast(`⚠️ No se pudo crear: ${data?.message ?? "Error desconocido"}`, "warning");
      }
    } catch (e: any) {
      showToast(`❌ Error al guardar: ${e?.message ?? e}`, "error");
    }
  }


  return (
    <>
      <div className="flex items-center border-b pb-1 mb-6">
        <UserRound />
        <h5 className="text-xl ml-4 font-extrabold text-gray-800 tracking-tight">
          Nuevo Productor
        </h5>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Código */}
        <div className="space-y-1.5">
          <Label>Código</Label>
          <Input
            placeholder="Ej: A5004"
            value={productor.codigo}
            onChange={onChangeFmt("codigo", (v) => normalizeCodigo(v), 16)}
          />
          {errors.codigo && <p className="text-sm text-red-600">{errors.codigo}</p>}
        </div>

        {/* Nombre */}
        <div className="space-y-1.5">
          <Label>Nombre del Productor</Label>
          <Input
            placeholder="Ej: MALLARAUCO S.A"
            value={productor.nombre}
            onChange={onChangeFmt("nombre", (v) => normalizeNombre(v), 100)}
          />
          {errors.nombre && <p className="text-sm text-red-600">{errors.nombre}</p>}
        </div>

        {/* RUT */}
        <div className="space-y-1.5">
          <Label>RUT</Label>
          <Input
            placeholder="Ej: 12.345.678-K"
            value={productor.rut}
            onChange={(e) => {
              const formatted = formatRutInput(e.target.value);
              setProductor({ ...productor, rut: formatted });
              setErrors((prev) => ({ ...prev, rut: "" }));
            }}
            maxLength={12} // suficiente para "12.345.678-K"
            inputMode="text"
          />

          {errors.rut && <p className="text-sm text-red-600">{errors.rut}</p>}
        </div>

        {/* Dirección */}
        <div className="space-y-1.5">
          <Label>Dirección</Label>
          <Input
            placeholder="Ej: FUNDO PATRIA VIEJA S/N"
            value={productor.direccion}
            onChange={onChangeFmt("direccion", (v) => normalizeDireccion(v), 50)}
          />
          {errors.direccion && <p className="text-sm text-red-600">{errors.direccion}</p>}
        </div>

        {/* Ciudad */}
        <div className="space-y-1.5">
          <Label>Ciudad</Label>
          <Input
            placeholder="Ej: MELIPILLA"
            value={productor.ciudad}
            onChange={onChangeFmt("ciudad", (v) => normalizeCiudad(v), 15)}
          />
          {errors.ciudad && <p className="text-sm text-red-600">{errors.ciudad}</p>}
        </div>

        {/* Comuna */}
        <div className="space-y-1.5">
          <Label>Comuna</Label>
          <ComunaSelect
            value={productor.comuna}
            onChange={(codigo) => {
              setProductor({ ...productor, comuna: codigo as any });
              setErrors((prev) => ({ ...prev, comuna: "" }));
            }}
          />
          {errors.comuna && <p className="text-sm text-red-600">{errors.comuna}</p>}
        </div>

        {/* Exportador */}
        <div className="space-y-1.5">
          <Label>Exportador</Label>
          <ExportadorSelect
            value={String(productor.exportador ?? "")}
            onChange={(codigo) => setProductor({ ...productor, exportador: codigo })}
          />
          {errors.exportador && <p className="text-sm text-red-600">{errors.exportador}</p>}
        </div>

        {/* GGN */}
        <div className="space-y-1.5 md:col-span-2">
          <Label>GGN</Label>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Input
              placeholder="Ej: 4049929590856"
              className={`flex-1 min-w-[250px] ${errors.ggn ? "border-red-500 focus:ring-red-500" : ""}`}
              value={productor.ggn ?? ""}
              onChange={(e) => {
                setProductor({ ...productor, ggn: normalizeGGN(e.target.value) });
                setErrors((prev) => ({ ...prev, ggn: "" })); // limpia el error al escribir
              }}
              maxLength={16}
            />
            <Button
              type="button"
              className="bg-slate-600 hover:bg-slate-700 text-white"
              onClick={() => console.log("Auto GGN")}
            >
              <BotIcon size={16} className="mr-1" />
              Auto
            </Button>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <a
                href="https://database.globalgap.org/globalgap/search/SearchMain.faces"
                target="_blank"
                rel="noopener noreferrer"
              >
                <HandIcon size={16} className="mr-1" />
                Manual
              </a>
            </Button>
          </div>
          {errors.ggn && <p className="text-sm text-red-600">{errors.ggn}</p>}
        </div>

      </div>

      <div className="flex justify-end items-center mt-10">
        <Button
          className="bg-emerald-600 hover:bg-emerald-800 text-white"
          onClick={handleGuardar}
        >
          Guardar Productor
        </Button>
      </div>
    </>
  );
}

/* =========================
   Export con ToastProvider
   ========================= */
export default function PageWithToast() {
  return (
    <ToastProvider>
      <ProductorForm />
    </ToastProvider>
  );
}
