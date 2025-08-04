import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quelen – Productores",
    description: "Panel de productores",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}