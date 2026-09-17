import { requireProfile } from "@/lib/auth";
import TopNav from "@/app/components/TopNav";
import InterviewSidebarNav from "./InterviewSidebarNav";
import InterviewMobileMenu from "./InterviewMobileMenu";

export default async function InterviewLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireProfile("interviewer");

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <TopNav badge={`${profile.full_name} (${profile.reg_no})`} badgeClass="green" menu={<InterviewMobileMenu />} />
      <InterviewSidebarNav />
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 pt-6 pb-16">{children}</div>
    </div>
  );
}
