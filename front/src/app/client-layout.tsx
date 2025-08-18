"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import AuthGuard from "@/components/guard/AuthGuard";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";

  const isAuthPage = pathname.startsWith("/auth");
  const isLoadingPage = pathname.startsWith("/loading");
  const hideChrome = isAuthPage || isLoadingPage;

  return (
    <AuthGuard>
      <div className="flex min-h-screen w-full">
        {!hideChrome && <Sidebar />}
        <main className={`flex-1 ${!hideChrome ? "p-6" : ""}`}>
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
