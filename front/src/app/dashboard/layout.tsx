import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quelen – Dashboard",
  description: "Accede al panel de quelen",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
