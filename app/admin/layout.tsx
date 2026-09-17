import { requireProfile } from "@/lib/auth";
import TopNav from "@/app/components/TopNav";
import SidebarNav from "./SidebarNav";
import MobileMenu from "./MobileMenu";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireProfile("admin");

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <TopNav badge="🛡️ Admin Portal" badgeClass="gold" menu={<MobileMenu />} />
      <SidebarNav />
      <div className="max-w-[1300px] mx-auto px-6 pt-6">{children}</div>
    </div>
  );
}
