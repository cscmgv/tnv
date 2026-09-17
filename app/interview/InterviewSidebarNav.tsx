"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";

export default function InterviewSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center gap-1 bg-white border-b border-[#e2e6ed] px-6 max-w-[1300px] mx-auto">
      {NAV_ITEMS.map((t) => {
        const active = t.href === "/interview" ? pathname === "/interview" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
              active
                ? "border-[#1a6b1a] text-[#1a6b1a] bg-[#f0f8f0]"
                : "border-transparent text-gray-600 hover:text-[#1a6b1a] hover:bg-[#f0f8f0]"
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
