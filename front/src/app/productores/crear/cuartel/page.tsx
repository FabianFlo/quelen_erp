"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LandPlot } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProductorWizard } from "../../context/ProductorWizardContext";

export default function Page() {
  const router = useRouter();
  const { cuartel, setCuartel, productor } = useProductorWizard();

  const onChange =
    (field: keyof typeof cuartel) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setCuartel({ ...cuartel, [field]: e.target.value });

  return (
    <>
      <div className="flex border-b pb-1 mb-6">
        <LandPlot />
        <h5 className="text-xl ml-4 font-extrabold text-gray-800 tracking-tight">Asignar Cuarteles al Predio</h5>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-gray-700 text-sm">Productor</Label>
          <Input placeholder="Ej: A5001 AGRICOLA LA CARRERA LTDA" value={`${productor.codigo} ${productor.nombre}`.trim()} readOnly />
        </div>

        <div className="space-y-1.5">
          <Label className="text-gray-700 text-sm">Predio</Label>
          <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={cuartel.predioId} onChange={onChange("predioId")}>
            <option value="">Seleccione un predio</option>
            <option value="98143">98143 AGRICOLA LA CARRERA LTDA</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-gray-700 text-sm">Cuartel / Sector</Label>
          <Input placeholder="Ej: NA-58792" value={cuartel.codigo} onChange={onChange("codigo")} />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-gray-700 text-sm">Descripción</Label>
          <Input placeholder="Ej: SDP 58792 NARANJAS CARA CARA" value={cuartel.descripcion} onChange={onChange("descripcion")} />
        </div>

        <div className="space-y-1.5">
          <Label className="text-gray-700 text-sm">Especie</Label>
          <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={cuartel.especie} onChange={onChange("especie")}>
            <option value="">Seleccione especie</option>
            <option value="41">41 NARANJAS</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-gray-700 text-sm">Variedad Principal</Label>
          <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={cuartel.variedad} onChange={onChange("variedad")}>
            <option value="">Seleccione variedad</option>
            <option value="4103">4103 CARA CARA</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-gray-700 text-sm">Tipo Cuartel</Label>
          <Input placeholder="Ej: PRODUCTIVO" value={cuartel.tipo} onChange={onChange("tipo")} />
        </div>
      </div>

      <div className="flex justify-end mt-10">
        <Button
          className="bg-emerald-600 hover:bg-emerald-800 text-white text-md px-6 py-2 rounded-lg shadow-md transition-all"
          onClick={() => console.log("Guardar Cuartel", cuartel)}
        >
          Guardar Cuartel
        </Button>
      </div>
    </>
  );
}
