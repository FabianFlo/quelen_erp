"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ComunaSelect from "@/components/ui/ComunaSelect";
import { Button } from "@/components/ui/button";
import { UserRound, BotIcon, HandIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProductorWizard } from "../../context/ProductorWizardContext";
import { API_URL, COD_EMP, COD_TEM } from "@/lib/config";

// Helpers
function parseRut(raw: string | undefined) {
  if (!raw) return { rutPro: undefined as number | undefined, dv: undefined as string | undefined };
  const s = String(raw).replace(/\./g, "").trim().toUpperCase(); // limpia puntos y espacios
  const parts = s.split("-");
  if (parts.length === 2) {
    const num = parseInt(parts[0].replace(/\D/g, ""), 10);
    const dv = parts[1].trim();
    return { rutPro: isNaN(num) ? undefined : num, dv: dv || undefined };
  }
  // Si viene sin guión, intentamos tomar el último char como DV
  const num = parseInt(s.slice(0, -1).replace(/\D/g, ""), 10);
  const dv = s.slice(-1);
  return { rutPro: isNaN(num) ? undefined : num, dv: dv || undefined };
}

export default function Page() {
  const router = useRouter();
  const { productor, setProductor } = useProductorWizard();

  const onChange =
    (field: keyof typeof productor) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setProductor({ ...productor, [field]: e.target.value });

  // Validación mínima antes de enviar
  function validate() {
    const errors: string[] = [];
    if (!COD_EMP) errors.push("Falta NEXT_PUBLIC_COD_EMP");
    if (!COD_TEM) errors.push("Falta NEXT_PUBLIC_COD_TEM");
    if (!API_URL) errors.push("Falta NEXT_PUBLIC_API_URL");
    if (!productor.codigo?.trim()) errors.push("Código del productor es requerido");
    if (!productor.nombre?.trim()) errors.push("Nombre del productor es requerido");
    // ZON es obligatorio en BDD; si no tienes campo, usa “C” por defecto (ajústalo si tu negocio define otro)
    return errors;
  }

  async function handleGuardar() {
    const errs = validate();
    if (errs.length) {
      alert("Corrige:\n- " + errs.join("\n- "));
      return;
    }

    const { rutPro, dv } = parseRut(productor.rut);

    // Si seleccionó en el combo, enviamos el código; si NO, usamos “Ciudad” como nombre de comuna.
    const comunaCodigo = productor.comuna?.trim() || null;
    const comunaNombre = !comunaCodigo && productor.ciudad?.trim() ? productor.ciudad.trim().toUpperCase() : null;

    // ZON requerido por la BDD; usa tu valor de negocio (aquí “C” por tu ejemplo)
    const zon = "C";

    const payload = {
      codEmp: COD_EMP,
      codTem: COD_TEM,
      codPro: productor.codigo?.trim(),
      nomPro: productor.nombre?.trim(),
      zon,

      rutPro: rutPro ?? undefined,
      dv: dv ?? undefined,
      dirPro: productor.direccion?.trim() || undefined,
      ggn: productor.ggn?.trim() || undefined,

      comunaCodigo,  // ej. "13302"
      comunaNombre,  // ej. "PAINE" (solo si no hay código)
    };

    try {
      const res = await fetch(`${API_URL}/productores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${txt}`);
      }

      const data = await res.json().catch(() => ({} as any));
      // Espera { created: boolean, codPro: string, message: string }
      if (data?.created) {
        alert(`Productor ${data.codPro} creado correctamente`);
        // Si quieres redirigir a listado:
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
        <div className="space-y-1.5">
          <Label>Código</Label>
          <Input placeholder="Ej: A5004" value={productor.codigo} onChange={onChange("codigo")} />
        </div>

        <div className="space-y-1.5">
          <Label>Nombre del Productor</Label>
          <Input placeholder="Ej: MALLARAUCO S.A" value={productor.nombre} onChange={onChange("nombre")} />
        </div>

        <div className="space-y-1.5">
          <Label>RUT</Label>
          <Input placeholder="Ej: 96604510-8" value={productor.rut} onChange={onChange("rut")} />
        </div>

        <div className="space-y-1.5">
          <Label>Dirección</Label>
          <Input placeholder="Ej: FUNDO PATRIA VIEJA S/N" value={productor.direccion} onChange={onChange("direccion")} />
        </div>

        <div className="space-y-1.5">
          <Label>Ciudad</Label>
          <Input placeholder="Ej: MELIPILLA" value={productor.ciudad} onChange={onChange("ciudad")} />
        </div>

        <div className="space-y-1.5">
          <Label>Comuna</Label>
          <ComunaSelect
            value={productor.comuna ?? ""}
            onChange={(codigo) => setProductor({ ...productor, comuna: codigo })}
            placeholder="Escribe para buscar..."
          />
        </div>

        <div className="space-y-1.5 md:col-span-3">
          <Label>GGN</Label>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Input
              placeholder="Ej: 4049929590856"
              className="flex-1 min-w-[250px]"
              value={productor.ggn}
              onChange={onChange("ggn")}
            />
            <Button type="button" className="bg-slate-600 hover:bg-slate-700 text-white" onClick={() => console.log("Auto GGN")}>
              <BotIcon size={16} className="mr-1" />
              Auto
            </Button>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <a href="https://database.globalgap.org/globalgap/search/SearchMain.faces" target="_blank" rel="noopener noreferrer">
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
