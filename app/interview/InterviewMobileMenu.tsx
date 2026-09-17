"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./nav-items";

export default function InterviewMobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-[#e2e6ed] text-gray-700 shrink-0"
      >
        <span className="flex flex-col gap-1 w-4">
          <span className="h-0.5 w-full bg-current rounded" />
          <span className="h-0.5 w-full bg-current rounded" />
          <span className="h-0.5 w-full bg-current rounded" />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)}>
          <aside
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl p-4 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">Menu</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-gray-400 hover:text-gray-700 text-lg leading-none px-1"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((t) => {
                const active = t.href === "/interview" ? pathname === "/interview" : pathname.startsWith(t.href);
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition ${
                      active ? "bg-[#f0f8f0] text-[#1a6b1a]" : "text-gray-600 hover:text-[#1a6b1a] hover:bg-[#f0f8f0]"
                    }`}
                  >
                    <span>{t.icon}</span>
                    {t.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}
