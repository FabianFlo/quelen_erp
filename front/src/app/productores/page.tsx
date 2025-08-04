"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/button";
import { BotIcon, HandIcon, UserRound, MapPinHouse, LandPlot } from "lucide-react";
import { div } from "framer-motion/client";

export default function ProductorForm() {
    const [step, setStep] = useState<"productor" | "predio" | "cuartel">("productor");


    return (
        <main className="w-full h-full flex justify-center items-start px-4">
            <Card className="w-full max-w-5xl p-10 bg-white shadow-2xl rounded-3xl border border-gray-200">

                {step === "productor" && (
                    <>
                        {/* Título */}
                        <div className="flex border-b pb-1 mb-6">
                            <UserRound />
                            <h5 className="text-xl ml-4 font-extrabold text-gray-800 tracking-tight">
                                Nuevo Productor
                            </h5>
                        </div>

                        {/* Formulario */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="space-y-1.5">
                                <Label className="text-gray-700 text-sm">Código</Label>
                                <Input placeholder="Ej: A5004" />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-gray-700 text-sm">Nombre del Productor</Label>
                                <Input placeholder="Ej: MALLARAUCO S.A" />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-gray-700 text-sm">RUT</Label>
                                <Input placeholder="Ej: 96604510-8" />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-gray-700 text-sm">Dirección</Label>
                                <Input placeholder="Ej: FUNDO PATRIA VIEJA S/N" />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-gray-700 text-sm">Ciudad</Label>
                                <Input placeholder="Ej: MELIPILLA" />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-gray-700 text-sm">Comuna (código)</Label>
                                <Input placeholder="Ej: 1351" />
                            </div>

                            <div className="space-y-1.5 md:col-span-3">
                                <Label className="text-gray-700 text-sm">GGN</Label>
                                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                                    <Input
                                        placeholder="Ej: 4049929590856"
                                        className="flex-1 min-w-[250px]"
                                    />

                                    <Button
                                        type="button"
                                        className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-1.5"
                                        onClick={() => console.log("Buscar GGN automáticamente")}
                                    >
                                        <BotIcon size={16} />
                                        Auto
                                    </Button>

                                    <Button
                                        asChild
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-1.5"
                                    >
                                        <a
                                            href="https://database.globalgap.org/globalgap/search/SearchMain.faces"
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

                        {/* Acciones finales */}
                        <div className="flex justify-between items-center mt-10">
                            {/* Botón Asignar Predios a la izquierda */}
                            <Button
                                variant="outline"
                                className="text-emerald-700 border-emerald-600 hover:bg-emerald-50"
                                onClick={() => setStep("predio")}
                            >
                                Crear Predios
                            </Button>
                            <Button
                                variant="outline"
                                className="text-emerald-700 border-emerald-600 hover:bg-emerald-50"
                                onClick={() => setStep("cuartel")}
                            >
                                Crear Cuartel
                            </Button>

                            {/* Botón Guardar a la derecha */}
                            <Button className="bg-emerald-600 hover:bg-emerald-800 text-white text-md px-6 py-2 rounded-lg shadow-md transition-all">
                                Guardar Productor
                            </Button>
                        </div>
                    </>
                )}


                {step === "predio" && (
                    <>
                        <div className="flex border-b pb-1 mb-6">
                            <MapPinHouse />
                            <h5 className="text-xl ml-4 font-extrabold text-gray-800 tracking-tight">
                                Asignar Predios al Productor
                            </h5>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {/* Cod_pro */}
                            <div className="space-y-1.5 md:col-span-1">
                                <Label className="text-gray-700 text-sm">Productor (código)</Label>
                                <Input placeholder="Ej: A5004" />
                            </div>
                            {/* Descripción */}
                            <div className="space-y-1.5 md:col-span-2">
                                <Label className="text-gray-700 text-sm">Descripción</Label>
                                <Input placeholder="Ej: PARCELA 27 LOS GUINDOS" />
                            </div>
                            {/* Comuna */}
                            <div className="space-y-1.5 md:col-span-1">
                                <Label className="text-gray-700 text-sm">Comuna (código)</Label>
                                <Input placeholder="Ej: 1342 = BUIN" />
                            </div>



                            {/* Dirección */}
                            <div className="space-y-1.5 md:col-span-2">
                                <Label className="text-gray-700 text-sm">Dirección</Label>
                                <Input placeholder="Ej: PARCELA 27 LOS GUINDOS" />
                            </div>

                            {/* CSG con botones */}
                            <div className="space-y-1.5 md:col-span-3">
                                <Label className="text-gray-700 text-sm">CSG</Label>
                                <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                                    <Input
                                        placeholder="Ej: 98143"
                                        className="flex-1 min-w-[250px]"
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
                            </div>
                        </div>

                        <div className="flex justify-between mt-10">
                            <Button
                                variant="ghost"
                                className="text-gray-600 hover:text-gray-800"
                                onClick={() => setStep("productor")}
                            >
                                ← Volver
                            </Button>

                            <Button className="bg-emerald-600 hover:bg-emerald-800 text-white text-md px-6 py-2 rounded-lg shadow-md transition-all">
                                Guardar Predio
                            </Button>
                        </div>
                    </>
                )}
                {step === "cuartel" && (
                    <>
                        <div className="flex border-b pb-1 mb-6">
                            <LandPlot/> 
                            <h5 className="text-xl ml-4 font-extrabold text-gray-800 tracking-tight">
                                Asignar Cuarteles al Predio
                            </h5>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                            <div className="space-y-1.5 md:col-span-2">
                                <Label className="text-gray-700 text-sm">Productor</Label>
                                <Input placeholder="Ej: A5001 AGRICOLA LA CARRERA LTDA" />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-gray-700 text-sm">Predio</Label>
                                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                                    <option value="">Seleccione un predio</option>
                                    <option value="98143">98143 AGRICOLA LA CARRERA LTDA</option>
                                    {/* Agrega más opciones dinámicamente */}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-gray-700 text-sm">Cuartel / Sector</Label>
                                <Input placeholder="Ej: NA-58792" />
                            </div>

                            <div className="space-y-1.5 md:col-span-2">
                                <Label className="text-gray-700 text-sm">Descripción</Label>
                                <Input placeholder="Ej: SDP 58792 NARANJAS CARA CARA" />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-gray-700 text-sm">Especie</Label>
                                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                                    <option value="">Seleccione especie</option>
                                    <option value="41">41 NARANJAS</option>
                                    {/* + especies dinámicas */}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-gray-700 text-sm">Variedad Principal</Label>
                                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                                    <option value="">Seleccione variedad</option>
                                    <option value="4103">4103 CARA CARA</option>
                                    {/* + variedades dinámicas */}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-gray-700 text-sm">Tipo Cuartel</Label>
                                <Input placeholder="Ej: PRODUCTIVO" />
                            </div>

                        </div>

                        <div className="flex justify-between mt-10">
                            <Button
                                variant="ghost"
                                className="text-gray-600 hover:text-gray-800"
                                onClick={() => setStep("productor")}
                            >
                                ← Volver
                            </Button>

                            <Button className="bg-emerald-600 hover:bg-emerald-800 text-white text-md px-6 py-2 rounded-lg shadow-md transition-all">
                                Guardar Cuartel
                            </Button>
                        </div>
                    </>
                )}


            </Card>
        </main>
    );
}
