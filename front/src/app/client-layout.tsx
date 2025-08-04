"use client";

import { usePathname } from "next/navigation";
import Sidebar from "../components/layout/sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith("/auth");

    return (
        <div className="flex min-h-screen w-full">
            {!isAuthPage && <Sidebar />}
            <main className={`flex-1 ${!isAuthPage ? "p-6" : ""}`}>{children}</main>
        </div>
    );
}
