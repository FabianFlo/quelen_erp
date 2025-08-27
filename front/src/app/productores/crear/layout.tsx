"use client";

import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import StepTabs from "./StepTabs";
import { ProductorWizardProvider } from "../context/ProductorWizardContext";

export default function CrearLayout({ children }: { children: ReactNode }) {
  return (
    <ProductorWizardProvider>
      <main className="w-full h-full flex items-start px-4 py-6 relative">
        <StepTabs />
        <Card className="w-full max-w-5xl pt-10 px-6 pb-6 bg-white shadow-2xl rounded-3xl rounded-tl-none border border-gray-200 relative z-0">
          {children}
        </Card>
      </main>
    </ProductorWizardProvider>
  );
}