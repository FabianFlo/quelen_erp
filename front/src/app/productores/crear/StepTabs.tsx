"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function StepTabs() {
  const pathname = usePathname();

  const items = [
    { href: "/productores/crear/productor", label: "Productor" },
    { href: "/productores/crear/predio", label: "Predio" },
    { href: "/productores/crear/cuartel", label: "Cuartel" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="absolute -top-3 left-4 z-10 flex space-x-2 bg-transparent">
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className={cn(
            "rounded-t-lg px-4 py-2 text-sm font-medium border border-b-0",
            isActive(it.href) ? "bg-white text-emerald-700" : "bg-gray-100 text-gray-500"
          )}
        >
          {it.label}
        </Link>
      ))}
    </div>
  );
}
