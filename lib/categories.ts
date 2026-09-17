import type { SupabaseClient } from "@supabase/supabase-js";
import type { Category } from "./supabase/types";

// Fetches candidate<->category membership rows and groups them by candidate
// id, so a page can attach `categories: Category[]` to each candidate/report
// row for display (a candidate can belong to several categories at once via
// the candidate_categories junction table).
//
// Scoped to `candidateIds` when given (chunked, since a `.in()` filter with
// thousands of values produces a request too expensive for the Worker's
// CPU/subrequest budget) — pass it whenever the caller already knows which
// candidates it's displaying, rather than pulling the whole junction table.
export async function fetchCategoriesByCandidate(
  supabase: SupabaseClient,
  allCategories: Category[],
  candidateIds?: number[]
): Promise<Map<number, Category[]>> {
  const categoryById = new Map(allCategories.map((c) => [c.id, c]));
  const rows: { candidate_id: number; category_id: number }[] = [];

  if (candidateIds) {
    const CHUNK_SIZE = 300;
    for (let i = 0; i < candidateIds.length; i += CHUNK_SIZE) {
      const chunk = candidateIds.slice(i, i + CHUNK_SIZE);
      const { data } = await supabase.from("candidate_categories").select("candidate_id, category_id").in("candidate_id", chunk);
      rows.push(...(data || []));
    }
  } else {
    const { data } = await supabase.from("candidate_categories").select("candidate_id, category_id");
    rows.push(...(data || []));
  }

  const map = new Map<number, Category[]>();
  rows.forEach((row) => {
    const category = categoryById.get(row.category_id);
    if (!category) return;
    const list = map.get(row.candidate_id) || [];
    list.push(category);
    map.set(row.candidate_id, list);
  });
  return map;
}
