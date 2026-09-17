import { createAdminClient } from "@/lib/supabase/admin";
import ApplyForm from "./ApplyForm";

export const dynamic = "force-dynamic";

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; cat?: string }>;
}) {
  const { ref, cat } = await searchParams;
  const categoryId = cat && /^\d+$/.test(cat) ? Number(cat) : null;

  // Categories aren't publicly readable (RLS requires an authenticated
  // user), so look the name up with the service-role client — purely to
  // display "You're registering for <category>" on the public form.
  let categoryName: string | null = null;
  if (categoryId) {
    const admin = createAdminClient();
    const { data } = await admin.from("categories").select("name").eq("id", categoryId).maybeSingle();
    categoryName = data?.name ?? null;
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="w-full bg-white border-b border-[#e2e6ed] shadow-sm">
        <div className="max-w-[700px] mx-auto px-4 sm:px-6 py-4">
          <div className="text-[10px] tracking-[2px] uppercase text-[#1a6b1a] font-bold">Tamil Nadu Volunteers</div>
          <div className="text-lg font-bold text-gray-900">Leadership Candidate Registration</div>
        </div>
      </div>
      <div className="max-w-[700px] mx-auto px-4 sm:px-6 py-6">
        <ApplyForm referrerId={ref || null} categoryId={categoryId} categoryName={categoryName} />
      </div>
    </div>
  );
}
