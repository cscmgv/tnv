import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditForm from "./EditForm";

export const dynamic = "force-dynamic";

export default async function EditCandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: assessment } = await supabase
    .from("assessments")
    .select("*, candidates(*)")
    .eq("id", id)
    .single();

  if (!assessment) notFound();

  const { data: categories } = await supabase.from("categories").select("*").order("name");
  const { data: memberships } = await supabase
    .from("candidate_categories")
    .select("category_id")
    .eq("candidate_id", assessment.candidates.id);
  const selectedCategoryIds = (memberships || []).map((m) => m.category_id);

  return <EditForm assessment={assessment} categories={categories || []} selectedCategoryIds={selectedCategoryIds} />;
}
