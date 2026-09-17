import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import type { Category } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const COLORS = ["#1a6b1a", "#6366f1", "#c8a000", "#f97316", "#0891b2", "#d946ef"];

export default async function InterviewCategoriesPage() {
  const { supabase, profile } = await requireProfile("interviewer");

  // Only show categories this interviewer actually has a coverage rule
  // for — the categories table itself is readable by every authenticated
  // user, so without this an interviewer would see every category in the
  // system, including ones they've never been assigned.
  const { data: coverageData } = await supabase.from("interviewer_coverage").select("category_id").eq("interviewer_id", profile.id);
  const assignedCategoryIds = new Set((coverageData || []).map((r) => r.category_id));

  const { data: categoryData } = await supabase.from("categories").select("*").order("name");
  const categories = ((categoryData || []) as Category[]).filter((c) => assignedCategoryIds.has(c.id));

  // candidate_categories itself is readable by any authenticated user, but
  // the embedded `candidates!inner(id)` join is still subject to the
  // candidates RLS policies — so this only counts candidates this
  // interviewer can actually see (their coverage rules / assignments),
  // not every member of the category.
  const { data: membershipData } = await supabase.from("candidate_categories").select("category_id, candidates!inner(id)");
  const counts = new Map<number, number>();
  (membershipData || []).forEach((row: { category_id: number }) => {
    counts.set(row.category_id, (counts.get(row.category_id) || 0) + 1);
  });

  return (
    <div className="pb-16">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Categories</h2>

      {!categories.length ? (
        <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-16 text-center text-gray-400">
          No categories assigned to you yet — ask an admin to grant you coverage.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => {
            const color = COLORS[i % COLORS.length];
            return (
              <Link
                key={cat.id}
                href={`/interview/categories/${cat.id}`}
                className="block bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-5 hover:border-[#1a6b1a55]"
              >
                <div className="text-lg font-extrabold mb-1" style={{ color }}>
                  {cat.name}
                </div>
                <div className="text-3xl font-extrabold text-gray-900">{counts.get(cat.id) ?? 0}</div>
                <div className="text-xs text-gray-500 mt-1">candidates visible to you — click to view</div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
