"use client";

import {
  ChevronRight, ChevronDown, FilePenLine, ClipboardList ,
  Truck, BookOpen, Users2,
  Globe, MoreHorizontal, Building2,
  ContactRound, ChartCandlestick, CircleDollarSign,
  Factory, ShieldPlus, Tickets,CirclePlus 
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Sidebar() {
  const [openProductores, setOpenProductores] = useState(false);

  return (
    <aside className="w-55 bg-white border-r flex flex-col h-full">
      {/* Encabezado fijo */}
      <div className="px-4 py-1 border-b bg-muted">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-md"
          />
          <div className="ml-4 flex flex-col justify-center h-[50px]">
            <div className="text-sm font-semibold">Quelen <span className="text-xs text-muted-foreground"> - Admin</span></div>
            <div className="text-xs text-muted-foreground flex justify-around">
              fflores
            </div>
          </div>
        </div>
      </div>

      {/* Contenido scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-4 text-sm space-y-6">
        {/* FUNCIONES */}
        <div>
          <div className="text-xs text-muted-foreground font-medium px-2 mb-1">
            Funciones
          </div>
          <ul className="space-y-1">
            <li>
              <a
                href="http://192.168.7.25/gestion_dotacion/"
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer"
                target="_blank" rel="noopener noreferrer"
              >
                <ContactRound className="h-4 w-4" />
                Dotación
              </a>
            </li>
            <li>
              <a
                href="http://192.168.1.149/patio_envase/home.php"
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer"
                target="_blank" rel="noopener noreferrer"
              >
                <Truck className="h-4 w-4" />
                Patio
              </a>
            </li>
            <li>
              <a
                href="http://192.168.1.149/traza/index.php"
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer"
                target="_blank" rel="noopener noreferrer"
              >
                <ChartCandlestick className="h-4 w-4" />
                Traza
              </a>
            </li>
            <li>
              <a
                href="http://192.168.1.149/comercial/index.php"
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer"
                target="_blank" rel="noopener noreferrer"
              >
                <CircleDollarSign className="h-4 w-4" />
                Comercial
              </a>
            </li>
            <li>
              <a
                href="http://192.168.1.149/Merquen/index.php"
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer"
                target="_blank" rel="noopener noreferrer"
              >
                <Factory className="h-4 w-4" />
                Planta
              </a>
            </li>
            <li>
              <a
                href="http://192.168.1.149/calidad/index.php"
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer"
                target="_blank" rel="noopener noreferrer"
              >
                <ShieldPlus className="h-4 w-4" />
                Calidad
              </a>
            </li>
            <li>
              <a
                href="http://192.168.7.25/help-desk2/index.php"
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer"
                target="_blank" rel="noopener noreferrer"
              >
                <Tickets className="h-4 w-4" />
                Ticketera
              </a>
            </li>

          </ul>
        </div>

        {/* DATOS MAESTRO */}
        <div>
          <div className="text-xs text-muted-foreground font-medium px-2 mb-1">
            Datos Maestro
          </div>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => setOpenProductores(!openProductores)}
                className="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-muted transition text-sm"
              >
                <span className="flex items-center gap-2 text-left">
                  <BookOpen className="h-4 w-4" />
                  Productores
                </span>
                {openProductores ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {openProductores && (
                <ul className="ml-4 mt-1 space-y-1 border-l-2 border-gray-300 pl-3">
                  <li className="flex items-center gap-2 text-sm text-foreground px-2 py-1 rounded-md hover:bg-muted cursor-pointer">
                    <CirclePlus className="h-4 w-4" />
                    Crear Productores
                  </li>
                  <li className="flex items-center gap-2 text-sm text-foreground px-2 py-1 rounded-md hover:bg-muted cursor-pointer">
                    <ClipboardList className="h-4 w-4" />
                    Listar Productores
                  </li>
                  <li className="flex items-center gap-2 text-sm text-foreground px-2 py-1 rounded-md hover:bg-muted cursor-pointer">
                    <FilePenLine className="h-4 w-4" />
                    Editar Productores
                  </li>
                </ul>
              )}
            </li>

            <li className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
              <Building2 className="h-4 w-4" />
              Usuarios
            </li>
            <li className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
              <Users2 className="h-4 w-4" />
              Ejemplo
            </li>
            <li className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
              <Globe className="h-4 w-4" />
              Ejemplo
            </li>
            <li className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
              <MoreHorizontal className="h-4 w-4" />
              Mas
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
