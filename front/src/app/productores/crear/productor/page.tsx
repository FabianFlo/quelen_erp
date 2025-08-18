"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserRound, BotIcon, HandIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProductorWizard } from "../../context/ProductorWizardContext";

export default function Page() {
  const router = useRouter();
  const { productor, setProductor } = useProductorWizard();

  const onChange =
    (field: keyof typeof productor) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setProductor({ ...productor, [field]: e.target.value });

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
          <Label>Comuna (código)</Label>
          <Input placeholder="Ej: 1351" value={productor.comuna} onChange={onChange("comuna")} />
        </div>

        <div className="space-y-1.5">
          <Label>Provincia (código)</Label>
          <Input placeholder="Ej: 1351" value={productor.provincia} onChange={onChange("provincia")} />
        </div>
        
        <div className="space-y-1.5">
          <Label>Region (código)</Label>
          <Input placeholder="Ej: 1351" value={productor.region} onChange={onChange("region")} />
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
          onClick={() => console.log("Guardar Productor", productor)}
        >
          Guardar Productor
        </Button>
      </div>
    </>
  );
}
