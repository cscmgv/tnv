import { createClient } from "@/lib/supabase/server";
import type { Category, InterviewerCoverageRule, InterviewerSummaryRow, Profile } from "@/lib/supabase/types";
import InterviewersPanel from "./InterviewersPanel";

export const dynamic = "force-dynamic";

export default async function InterviewersPage() {
  const supabase = await createClient();

  const [{ data: profiles }, { data: summary }, { data: categories }, { data: coverage }] = await Promise.all([
    supabase.from("profiles").select("*").eq("role", "interviewer").order("created_at", { ascending: true }),
    supabase.from("v_interviewer_summary").select("*"),
    supabase.from("categories").select("*").order("name"),
    supabase.from("interviewer_coverage").select("*"),
  ]);

  return (
    <InterviewersPanel
      interviewers={(profiles || []) as Profile[]}
      summary={(summary || []) as InterviewerSummaryRow[]}
      categories={(categories || []) as Category[]}
      coverage={(coverage || []) as InterviewerCoverageRule[]}
    />
  );
}
