import Image from "next/image";
import { logout } from "@/app/logout-action";

export default function TopNav({
  badge,
  badgeClass,
  menu,
}: {
  badge: string;
  badgeClass: "green" | "gold";
  menu?: React.ReactNode;
}) {
  const badgeStyles =
    badgeClass === "gold"
      ? "bg-[#fffbea] text-[#c8a000] border-[#c8a00040]"
      : "bg-[#f0f8f0] text-[#1a6b1a] border-[#1a6b1a33]";

  return (
    <div className="w-full bg-white border-b border-[#e2e6ed] shadow-sm sticky top-0 z-50">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {menu}
          <Image
            src="/tnv-logo.png"
            alt="TNV"
            width={44}
            height={44}
            className="rounded-full object-contain shrink-0 w-9 h-9 sm:w-11 sm:h-11"
          />
          <div className="leading-tight min-w-0">
            <div className="hidden sm:block text-[10px] tracking-[2px] uppercase text-[#1a6b1a] font-bold">
              Tamil Nadu Volunteers
            </div>
            <div className="text-xs sm:text-sm font-bold text-gray-900 truncate">Leadership Selection Portal</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <span className={`px-2.5 sm:px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold border whitespace-nowrap ${badgeStyles}`}>
            {badge}
          </span>
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-md bg-red-50 text-red-600 border border-red-200 text-[10px] sm:text-xs font-semibold hover:bg-red-100 transition whitespace-nowrap"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
