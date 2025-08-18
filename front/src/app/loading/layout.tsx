import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quelen – Login",
  description: "Accede a tu cuenta en el ERP de Quelen",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
