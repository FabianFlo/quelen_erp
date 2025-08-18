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

  return (
    <Ctx.Provider value={{ productor, setProductor, predio, setPredio, cuartel, setCuartel }}>
      {children}
    </Ctx.Provider>
  );
}

export function useProductorWizard() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProductorWizard debe usarse dentro de ProductorWizardProvider");
  return ctx;
}
