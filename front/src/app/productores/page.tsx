"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Eye } from "lucide-react";

export default function PanelProductores() {
    const router = useRouter();

    return (
        <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
            {/* Encabezado */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold text-stale-600">Gestión de Productores</h1>
                <p className="text-muted-foreground">
                    Administra productores, predios y cuarteles registrados en el sistema.
                </p>
            </div>

            {/* Tarjetas de navegación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => router.push("/productores/crear_productor")}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-stale-600">
                            <Plus className="w-5 h-5" />
                            Crear Productor
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Registrar un nuevo productor en el sistema.</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => router.push("/productores/crear")}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-stale-600">
                            <Plus className="w-5 h-5" />
                            Crear Predio
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Asociar un predio a un productor existente.</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => router.push("/productores/crear")}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-stale-600">
                            <Plus className="w-5 h-5" />
                            Crear Cuartel
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Asignar cuarteles a los predios definidos.</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => router.push("/productores/modificar")}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-stale-600">
                            <Pencil className="w-5 h-5" />
                            Modificar
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Editar o eliminar registros existentes.</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition cursor-pointer" onClick={() => router.push("/productores/listar")}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-stale-600">
                            <Eye className="w-5 h-5" />
                            Listar Productores
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Ver el listado completo de productores.</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabla resumen - últimos registros */}
            <div>
                <h2 className="text-lg font-semibold text-stale-600 mb-2">Últimos productores registrados</h2>
                <div className="overflow-auto border rounded-lg">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-stale-600 text-stale">
                            <tr>
                                <th className="px-4 py-2">Código</th>
                                <th className="px-4 py-2">Nombre</th>
                                <th className="px-4 py-2">RUT</th>
                                <th className="px-4 py-2">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y bg-white">
                            <tr className="hover:bg-stale-50">
                                <td className="px-4 py-2 font-medium">A5004</td>
                                <td className="px-4 py-2">AGROFRUT MELI</td>
                                <td className="px-4 py-2">96604510-8</td>
                                <td className="px-4 py-2">05/08/2025</td>
                            </tr>
                            <tr className="hover:bg-stale-50">
                                <td className="px-4 py-2 font-medium">A5005</td>
                                <td className="px-4 py-2">AGRO LA CARRERA</td>
                                <td className="px-4 py-2">76089213-2</td>
                                <td className="px-4 py-2">06/08/2025</td>
                            </tr>
                            {/* Agrega más filas dinámicamente aquí */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
