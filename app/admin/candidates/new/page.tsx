import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/supabase/types";
import NewCandidateForm from "./NewCandidateForm";

export const dynamic = "force-dynamic";

export default async function NewCandidatePage({
  searchParams,
}: {
  searchParams: Promise<{ category_id?: string }>;
}) {
  const { category_id } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  return <NewCandidateForm categories={(data || []) as Category[]} defaultCategoryId={category_id || ""} />;
}
