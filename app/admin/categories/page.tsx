import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/supabase/types";
import CategoriesPanel from "./CategoriesPanel";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categoryData } = await supabase.from("categories").select("*").order("name");
  const categories = (categoryData || []) as Category[];

  // Supabase/PostgREST caps an unbounded select at db.max_rows (1000 by
  // default) — pulling every candidate_categories row and counting them in
  // JS silently truncated at 1000 total once membership grew past that,
  // undercounting every category. A count-only query per category (cheap,
  // exact, no row data transferred) can't be truncated that way.
  const countEntries = await Promise.all(
    categories.map(async (cat) => {
      const { count } = await supabase.from("candidate_categories").select("candidate_id", { count: "exact", head: true }).eq("category_id", cat.id);
      return [cat.id, count ?? 0] as const;
    })
  );
  const counts = new Map<number, number>(countEntries);

  return <CategoriesPanel categories={categories} counts={Object.fromEntries(counts)} />;
}
