"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPinHouse, BotIcon, HandIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProductorWizard } from "../../context/ProductorWizardContext";

export default function Page() {
  const router = useRouter();
  const { predio, setPredio, productor } = useProductorWizard();

  const onChange =
    (field: keyof typeof predio) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setPredio({ ...predio, [field]: e.target.value });

  return (
    <>
      <div className="flex border-b pb-1 mb-6">
        <MapPinHouse />
        <h5 className="text-xl ml-4 font-extrabold text-gray-800 tracking-tight">Asignar Predios al Productor</h5>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="space-y-1.5 md:col-span-1">
          <Label className="text-gray-700 text-sm">Productor (código)</Label>
          <Input placeholder="Ej: A5004" value={productor.codigo} readOnly />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-gray-700 text-sm">Descripción</Label>
          <Input placeholder="Ej: PARCELA 27 LOS GUINDOS" value={predio.descripcion} onChange={onChange("descripcion")} />
        </div>

        <div className="space-y-1.5 md:col-span-1">
          <Label className="text-gray-700 text-sm">Comuna (código)</Label>
          <Input placeholder="Ej: 1342 = BUIN" value={predio.comuna} onChange={onChange("comuna")} />
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label className="text-gray-700 text-sm">Dirección</Label>
          <Input placeholder="Ej: PARCELA 27 LOS GUINDOS" value={predio.direccion} onChange={onChange("direccion")} />
        </div>

        <div className="space-y-1.5 md:col-span-3">
          <Label className="text-gray-700 text-sm">CSG</Label>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Input placeholder="Ej: 98143" className="flex-1 min-w-[250px]" value={predio.csg} onChange={onChange("csg")} />
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
        </div>
      </div>

      <div className="flex justify-end mt-10">
        <Button
          className="bg-emerald-600 hover:bg-emerald-800 text-white text-md px-6 py-2 rounded-lg shadow-md transition-all"
          onClick={() => console.log("Guardar Predio", predio)}
        >
          Guardar Predio
        </Button>
      </div>
    </>
  );
}
