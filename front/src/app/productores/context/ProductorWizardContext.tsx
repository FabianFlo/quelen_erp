"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Productor = {
  codigo: string;
  nombre: string;
  rut: string;
  direccion: string;
  ciudad: string;
  comuna: string;
  provincia: string;
  region: string;
  ggn: string;

  // ya lo usas en page.tsx
  exportador: string;
};

type Predio = {
  descripcion: string;
  comuna: string;
  direccion: string;
  csg: string;
};

type Cuartel = {
  predioId: string;
  codigo: string;
  descripcion: string;
  especie: string;
  variedad: string;
  tipo: string;
};

type WizardContext = {
  productor: Productor;
  setProductor: (p: Productor) => void;
  predio: Predio;
  setPredio: (p: Predio) => void;
  cuartel: Cuartel;
  setCuartel: (c: Cuartel) => void;

  // === NUEVO: responsable de la creación ===
  usuarioCreador: string;                  // user logueado/responsable
  setUsuarioCreador: (u: string) => void;  // para setearlo desde donde quieras
};

const Ctx = createContext<WizardContext | null>(null);

export function ProductorWizardProvider({ children }: { children: ReactNode }) {
  const [productor, setProductor] = useState<Productor>({
    codigo: "",
    nombre: "",
    rut: "",
    direccion: "",
    ciudad: "",
    comuna: "",
    provincia: "",
    region: "",
    ggn: "",
    exportador: "",
  });

  const [predio, setPredio] = useState<Predio>({
    descripcion: "",
    comuna: "",
    direccion: "",
    csg: "",
  });

  const [cuartel, setCuartel] = useState<Cuartel>({
    predioId: "",
    codigo: "",
    descripcion: "",
    especie: "",
    variedad: "",
    tipo: "",
  });

  // === NUEVO: usuario responsable (inicia vacío) ===
  const [usuarioCreador, setUsuarioCreador] = useState<string>("");

  return (
    <Ctx.Provider
      value={{
        productor,
        setProductor,
        predio,
        setPredio,
        cuartel,
        setCuartel,
        usuarioCreador,
        setUsuarioCreador,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useProductorWizard() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProductorWizard debe usarse dentro de ProductorWizardProvider");
  return ctx;
}
