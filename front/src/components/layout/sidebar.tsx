"use client";

import {
  ChevronRight, ChevronDown, FilePenLine, ClipboardList,
  Truck, BookOpen, Users2, LogOut, ChartColumn,
  Globe, MoreHorizontal, Building2,
  ContactRound, ChartCandlestick, CircleDollarSign,
  Factory, ShieldPlus, Tickets, CirclePlus
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Section = "paginas" | "maestros";

export default function Sidebar() {
  const [openProductores, setOpenProductores] = useState(false);
  const [section, setSection] = useState<Section>("paginas"); // Tabs: muestra UNA sección a la vez
  const [usuario, setUsuario] = useState<string | null>(null);
  const [tipo, setTipo] = useState<string | null>(null);      // letra de importancia (A/B/C/...)
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUsuario(localStorage.getItem("usuario"));
      setTipo(localStorage.getItem("tipo"));
    }
  }, []);

  const isAdminA = ((tipo ?? "").toUpperCase().includes("A"));

  // Si no es A, forzar a "paginas" y ocultar tabs
  useEffect(() => {
    if (!isAdminA && section !== "paginas") setSection("paginas");
  }, [isAdminA, section]);

  return (
    <aside className="w-56 bg-white border-r flex flex-col min-h-screen">
      {/* Encabezado */}
      <div className="px-4 py-2 border-b bg-muted shrink-0">
        <div className="flex items-center justify-between">
          {/* Logo + Nombre */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo"
              width={45}
              height={45}
              className="rounded-full"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-foreground">Quelen</span>
              <span className="text-xs text-muted-foreground">
                {usuario ?? "No logueado"}
                {isAdminA && (
                  <span className="ml-1 text-xs text-muted-foreground">- Admin</span>
                )}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              localStorage.removeItem("usuario");
              localStorage.removeItem("tipo");
              document.cookie = "usuario=; path=/; max-age=0";
              router.push("/");
            }}
            className="p-2 rounded-md bg-red-100 hover:bg-red-200 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="h-4 w-4 text-red-600" />
          </button>
        </div>

        {/* Tabs: Paginas / Maestros (solo visibles para tipo A) */}
        {isAdminA && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => setSection("paginas")}
              className={`text-xs px-3 py-1.5 rounded-md border transition ${
                section === "paginas" ? "bg-white shadow-sm" : "hover:bg-muted"
              }`}
            >
              Paginas
            </button>
            <button
              onClick={() => setSection("maestros")}
              className={`text-xs px-3 py-1.5 rounded-md border transition ${
                section === "maestros" ? "bg-white shadow-sm" : "hover:bg-muted"
              }`}
            >
              Maestros
            </button>
          </div>
        )}
      </div>

      {/* Contenido (si no es A, solo se verá 'Paginas' y no aparecen tabs ni Maestros) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 text-sm space-y-6 scrollbar-thin scrollbar-thumb-muted-foreground hover:scrollbar-thumb-muted scrollbar-track-transparent">
        {(section === "paginas") && (
          <div>
            <div className="text-xs text-muted-foreground font-medium px-2 mb-1">Paginas</div>
            <ul className="space-y-1">
              <li
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 text-sm text-foreground px-2 py-1 rounded-md hover:bg-muted cursor-pointer">
                <ChartColumn className="h-4 w-4" />
                Panel
              </li>
              <li>
                <a href="http://192.168.7.25/gestion_dotacion/" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                  <ContactRound className="h-4 w-4" />
                  Dotación
                </a>
              </li>
              <li>
                <a href="http://192.168.1.149/patio_envase/home.php" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                  <Truck className="h-4 w-4" />
                  Patio
                </a>
              </li>
              <li>
                <a href="http://192.168.1.149/traza/index.php" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                  <ChartCandlestick className="h-4 w-4" />
                  Traza
                </a>
              </li>
              <li>
                <a href="http://192.168.1.149/comercial/index.php" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                  <CircleDollarSign className="h-4 w-4" />
                  Comercial
                </a>
              </li>
              <li>
                <a href="http://192.168.1.149/Merquen/index.php" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                  <Factory className="h-4 w-4" />
                  Planta
                </a>
              </li>
              <li>
                <a href="http://192.168.1.149/calidad/index.php" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                  <ShieldPlus className="h-4 w-4" />
                  Calidad
                </a>
              </li>
              <li>
                <a href="http://192.168.7.25/help-desk2/index.php" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                  <Tickets className="h-4 w-4" />
                  Ticketera
                </a>
              </li>
            </ul>
          </div>
        )}

        {/* Maestros solo si es A */}
        {isAdminA && section === "maestros" && (
          <div>
            <div className="text-xs text-muted-foreground font-medium px-2 mb-1">Maestros</div>
            <ul className="space-y-1">
              <li className="relative">
                <div className="flex items-center justify-between w-full px-2 py-1.5 rounded-md hover:bg-muted transition text-sm cursor-pointer">
                  {/* Texto e ícono que lleva al panel de productores */}
                  <span
                    className="flex items-center gap-2 text-left"
                    onClick={() => router.push("/productores")}
                  >
                    <BookOpen className="h-4 w-4" />
                    Productores
                  </span>
                  {/* Toggle submenú */}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenProductores(!openProductores);
                    }}
                    className="p-1 rounded hover:bg-muted"
                  >
                    {openProductores ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </span>
                </div>

                {openProductores && (
                  <ul className="ml-4 mt-1 space-y-1 border-l-2 border-gray-300 pl-3">
                    <li
                      onClick={() => router.push("/productores/crear/productor")}
                      className="flex items-center gap-2 text-sm text-foreground px-2 py-1 rounded-md hover:bg-muted cursor-pointer">
                      <CirclePlus className="h-4 w-4" />
                      Crear Productores
                    </li>
                    <li
                      onClick={() => router.push("/productores/listar")}
                      className="flex items-center gap-2 text-sm text-foreground px-2 py-1 rounded-md hover:bg-muted cursor-pointer">
                      <ClipboardList className="h-4 w-4" />
                      Listar Productores
                    </li>
                    <li
                      onClick={() => router.push("/productores/editar")}
                      className="flex items-center gap-2 text-sm text-foreground px-2 py-1 rounded-md hover:bg-muted cursor-pointer">
                      <FilePenLine className="h-4 w-4" />
                      Editar Productores
                    </li>
                  </ul>
                )}
              </li>

              {/* Otras opciones de maestros (solo A) */}
              <li
                onClick={() => router.push("/usuarios")}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                <Building2 className="h-4 w-4" />
                Usuarios
              </li>
              <li
                onClick={() => router.push("/ejemplo")}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                <Users2 className="h-4 w-4" />
                Ejemplo
              </li>
              <li
                onClick={() => router.push("/ejemplo-2")}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                <Globe className="h-4 w-4" />
                Ejemplo
              </li>
              <li
                onClick={() => router.push("/mas")}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer">
                <MoreHorizontal className="h-4 w-4" />
                Más
              </li>
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
