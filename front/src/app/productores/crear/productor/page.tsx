"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ComunaSelect from "@/components/ui/ComunaSelect";
import { Button } from "@/components/ui/button";
import { UserRound, BotIcon, HandIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProductorWizard } from "../../context/ProductorWizardContext";
import { API_URL, COD_EMP, COD_TEM } from "@/lib/config";

/* =========================
   Helpers de normalización
   ========================= */
const toUpperMax = (v: string, max: number) => (v || "").toUpperCase().slice(0, max);

// GGN: 16 varchar (alfanumérico)
const normalizeGGN = (raw: string) =>
  (raw || "").replace(/[^0-9A-Za-z]/g, "").slice(0, 16);

// Dirección: 50 varchar
const normalizeDireccion = (raw: string) => toUpperMax(raw || "", 50);

// Ciudad: 15 varchar en MAYÚSCULA
const normalizeCiudad = (raw: string) => toUpperMax(raw || "", 15);

// Código: 16 varchar en MAYÚSCULA
const normalizeCodigo = (raw: string) => toUpperMax(raw || "", 16);

// Nombre Productor: 100 varchar en MAYÚSCULA
const normalizeNombre = (raw: string) => toUpperMax(raw || "", 100);

/* =========================
   RUT: Formateo de input en vivo -> xx.xxx.xxx-x
   - Solo dígitos + K/k
   - Inserta puntos y guion automáticamente
   ========================= */
function formatRutInput(raw: string): string {
  if (!raw) return "";
  // Eliminar todo excepto dígitos y k/K
  let v = raw.replace(/[^0-9kK]/g, "").toUpperCase();

  // Separar número y DV
  let num = v.slice(0, -1);
  let dv = v.slice(-1);

  // Quitar ceros a la izquierda del número (visual)
  if (num) {
    const n = Number(num);
    num = isNaN(n) ? "" : String(n);
  }

  // Insertar puntos de miles
  if (num) num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return dv ? `${num}-${dv}` : num;
}

/* =========================
   parseRut con validación fuerte
   - DV: 1 carácter (0-9 o K)
   - RUT (num): 7 a 9 dígitos y <= 2147483647
   ========================= */
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

/* =========================
   Normalizador de código de comuna
   - Asegura string
   - Limpia no-dígitos por si el valor viene "921 - ANGOL"
   - Opcional: pad a 4 dígitos si tu diccionario lo usa así
   ========================= */
function normalizeCodCom(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  let s = String(value).trim();
  // Si viene "921 - ANGOL", quedarnos con "921"
  const onlyDigits = s.match(/\d+/)?.[0] || "";
  if (!onlyDigits) return null;
  // Si tu backend/diccionario usa 4 dígitos, activa el pad:
  // s = onlyDigits.padStart(4, "0");
  s = onlyDigits; // sin pad si tu catálogo acepta 3 o 4 según caso
  return s;
}

export default function Page() {
  const router = useRouter();
  const { productor, setProductor } = useProductorWizard();

  // onChange genérico con normalizador por campo
  const onChangeFmt =
    (field: keyof typeof productor, normalizer: (v: string) => string, maxLen?: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value ?? "";
      const value = normalizer(raw);
      setProductor({ ...productor, [field]: value });
      if (maxLen) e.currentTarget.maxLength = maxLen;
    };

  // Validación mínima antes de enviar
  function validate() {
    const errors: string[] = [];
    if (!COD_EMP) errors.push("Falta NEXT_PUBLIC_COD_EMP");
    if (!COD_TEM) errors.push("Falta NEXT_PUBLIC_COD_TEM");
    if (!API_URL) errors.push("Falta NEXT_PUBLIC_API_URL");

    if (!productor.codigo?.trim()) errors.push("Código del productor es requerido");
    if (productor.codigo && productor.codigo.length > 16) errors.push("Código excede 16 caracteres");

    if (!productor.nombre?.trim()) errors.push("Nombre del productor es requerido");
    if (productor.nombre && productor.nombre.length > 100) errors.push("Nombre excede 100 caracteres");

    if (productor.direccion && productor.direccion.length > 50) errors.push("Dirección excede 50 caracteres");

    if (productor.ciudad && productor.ciudad.length > 15) errors.push("Ciudad excede 15 caracteres");

    if (productor.ggn && productor.ggn.length > 16) errors.push("GGN excede 16 caracteres");

    const { rutPro, dv } = parseRut(productor.rut);
    if (!rutPro) errors.push("RUT inválido: 7–9 dígitos + DV (<= 2147483647). Ej: 12.345.678-K");
    if (!dv) errors.push("DV inválido: debe ser 1 carácter (0-9 o K).");

    // Comuna obligatoria si el back la usa para el diccionario
    const codCom = normalizeCodCom(productor.comuna);
    if (!codCom) errors.push("Selecciona una comuna válida");

    return errors;
  }

  async function handleGuardar() {
    const errs = validate();
    if (errs.length) {
      alert("Corrige:\n- " + errs.join("\n- "));
      return;
    }

    const { rutPro, dv } = parseRut(productor.rut);

    const ciuPro = productor.ciudad?.trim().toUpperCase() || null; // CIU_PRO
    const codCom = normalizeCodCom(productor.comuna);               // COD_COM / comunaCodigo

    const zon = "C"; // ZON

    const payload = {
      codEmp: COD_EMP,                             // nvarchar(4)  NOT NULL
      codTem: COD_TEM,                             // nvarchar(2)  NOT NULL
      codPro: productor.codigo?.trim(),            // nvarchar(16) NOT NULL
      nomPro: productor.nombre?.trim(),            // nvarchar(100) NOT NULL
      zon,                                         // nvarchar(8)  NOT NULL

      rutPro: rutPro!,                             // int (validado)
      dv: dv!,                                     // nvarchar(1)

      dirPro: productor.direccion?.trim() || null, // nvarchar(50)
      ciuPro,                                      // nvarchar(15)
      codCom,                                      // nvarchar(8)

      // Por compatibilidad con el DTO del back (si espera 'comunaCodigo'):
      comunaCodigo: codCom,                        // <<<<< clave para evitar 'null' en el back

      ggn: productor.ggn?.trim() || null,          // nvarchar(16)
      // Otros campos derivados en el back pueden ir null
    };

    try {
      if (!API_URL) throw new Error("Falta NEXT_PUBLIC_API_URL");

      const base = (API_URL || "").replace(/\/+$/, "");
      const API = base.endsWith("/api") ? base : `${base}/api`;
      const url = `${API}/productores`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${txt}`);
      }

      const data = await res.json().catch(() => ({} as any));
      if (data?.created) {
        alert(`Productor ${data.codPro} creado correctamente`);
        // router.push("/productores");
      } else {
        alert(`No se pudo crear: ${data?.message ?? "Error desconocido"}`);
      }
    } catch (e: any) {
      console.error(e);
      alert(`Error al guardar: ${e?.message ?? e}`);
    }
  }

  return (
    <>
      <div className="flex items-center border-b pb-1 mb-6">
        <UserRound />
        <h5 className="text-xl ml-4 font-extrabold text-gray-800 tracking-tight">Nuevo Productor</h5>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Código: MAYÚSCULAS, máx 16 */}
        <div className="space-y-1.5">
          <Label>Código</Label>
          <Input
            placeholder="Ej: A5004"
            value={productor.codigo ?? ""}
            onChange={onChangeFmt("codigo", (v) => normalizeCodigo(v), 16)}
            maxLength={16}
            autoCapitalize="characters"
          />
        </div>

        {/* Nombre: MAYÚSCULAS, máx 100 */}
        <div className="space-y-1.5">
          <Label>Nombre del Productor</Label>
          <Input
            placeholder="Ej: MALLARAUCO S.A"
            value={productor.nombre ?? ""}
            onChange={onChangeFmt("nombre", (v) => normalizeNombre(v), 100)}
            maxLength={100}
            autoCapitalize="characters"
          />
        </div>

        {/* RUT: formato xx.xxx.xxx-x (con autocompletado de puntos y guion) */}
        <div className="space-y-1.5">
          <Label>RUT</Label>
          <Input
            placeholder="Ej: 12.345.678-K"
            value={productor.rut ?? ""}
            onChange={(e) => {
              const formatted = formatRutInput(e.target.value);
              setProductor({ ...productor, rut: formatted });
            }}
            maxLength={12}
            inputMode="text"
          />
        </div>

        {/* Dirección: máx 50 */}
        <div className="space-y-1.5">
          <Label>Dirección</Label>
          <Input
            placeholder="Ej: FUNDO PATRIA VIEJA S/N"
            value={productor.direccion ?? ""}
            onChange={onChangeFmt("direccion", (v) => normalizeDireccion(v), 50)}
            maxLength={50}
          />
        </div>

        {/* Ciudad: MAYÚSCULAS, máx 15 */}
        <div className="space-y-1.5">
          <Label>Ciudad</Label>
          <Input
            placeholder="Ej: MELIPILLA"
            value={productor.ciudad ?? ""}
            onChange={onChangeFmt("ciudad", (v) => normalizeCiudad(v), 15)}
            maxLength={15}
            autoCapitalize="characters"
          />
        </div>

        {/* Comuna (selector) */}
        <div className="space-y-1.5">
          <Label>Comuna</Label>
          <ComunaSelect
            value={productor.comuna ?? ""}
            onChange={(codigo) => {
              // Guarda el valor tal cual venga del select (string/number/label)
              setProductor({ ...productor, comuna: codigo as any });
            }}
            placeholder="Escribe para buscar..."
          />
        </div>

        {/* GGN: 16 varchar (alfanumérico) */}
        <div className="space-y-1.5 md:col-span-3">
          <Label>GGN</Label>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Input
              placeholder="Ej: 4049929590856"
              className="flex-1 min-w-[250px]"
              value={productor.ggn ?? ""}
              onChange={(e) => setProductor({ ...productor, ggn: normalizeGGN(e.target.value) })}
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
        </div>
      </div>

      <div className="flex justify-end items-center mt-10">
        <Button
          className="bg-emerald-600 hover:bg-emerald-800 text-white text-md px-6 py-2 rounded-lg shadow-md transition-all"
          onClick={handleGuardar}
        >
          Guardar Productor
        </Button>
      </div>
    </>
  );
}
