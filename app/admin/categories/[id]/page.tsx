import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import { fetchCategoriesByCandidate } from "@/lib/categories";
import { interviewersCoveringCandidate } from "@/lib/coverage";
import type { CallLog, Candidate, CandidateListRow, Category, FullReportRow, InterviewerCoverageRule, Profile } from "@/lib/supabase/types";
import CategoryDetail from "./CategoryDetail";

export const dynamic = "force-dynamic";

export default async function CategoryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ limit?: string }>;
}) {
  const { id } = await params;
  const { supabase, profile } = await requireProfile("admin");

  // A category can have thousands of members — loading, processing, and
  // rendering all of them in a single request was blowing past the
  // Worker's CPU-time budget (a 503 with no visible error, since the
  // failure happens inside Cloudflare's platform, not the app). Default to
  // a capped page (the "Show" control in CandidatesTable lets an admin pick
  // 50/100/250/All via ?limit=) — this is a stopgap until this table gets
  // real server-side search.
  const { limit: limitParam } = await searchParams;
  const memberLimit = limitParam === "all" ? null : Number(limitParam) || 100;

  let memberIdQuery = supabase.from("candidate_categories").select("candidate_id").eq("category_id", id).order("created_at", { ascending: false });
  if (memberLimit) memberIdQuery = memberIdQuery.limit(memberLimit);

  // These don't depend on each other — run them concurrently instead of
  // round-tripping to Supabase one at a time.
  const [{ data: category }, { data: memberIdRows }, { count: memberTotal }, { data: allCategoryData }, { data: interviewerData }] =
    await Promise.all([
      supabase.from("categories").select("*").eq("id", id).single(),
      // Membership is via the candidate_categories junction table (a
      // candidate can belong to more than one category), not just the
      // legacy single category_id column, so a candidate added here
      // through another category's page still shows up. Most-recently-
      // added members first.
      memberIdQuery,
      supabase.from("candidate_categories").select("candidate_id", { count: "exact", head: true }).eq("category_id", id),
      supabase.from("categories").select("*").order("name"),
      supabase.from("profiles").select("id, full_name, reg_no, profile_completed").eq("role", "interviewer").eq("is_active", true).order("full_name"),
    ]);
  if (!category) notFound();
  const memberIds = (memberIdRows || []).map((r) => r.candidate_id);
  const allCategories = (allCategoryData || []) as Category[];
  const interviewerList = (interviewerData || []) as Profile[];
  const interviewerById = new Map(interviewerList.map((iv) => [iv.id, iv]));
  const { data: coverageData } = await supabase.from("interviewer_coverage").select("*");
  const coverage = (coverageData || []) as InterviewerCoverageRule[];

  // Only the split (interview_completed) and the pending-row fields are
  // read from this fetch — a completed member's display data comes from
  // v_full_report below instead, so there's no need to pull its full row
  // here too.
  const { data: memberData } = memberIds.length
    ? await supabase
        .from("candidates")
        .select(
          "id, interview_completed, serial_number, interview_date, candidate_name, candidate_mobile, candidate_email, district, assembly_constituency, pincode, ngo, dob, interview_started, assigned_to"
        )
        .in("id", memberIds)
        .order("created_at", { ascending: false })
    : { data: [] };
  const members = (memberData || []) as Candidate[];

  const pending = members.filter((m) => !m.interview_completed);
  const completedIds = members.filter((m) => m.interview_completed).map((m) => m.id);
  const pendingIds = pending.map((c) => c.id);

  const [categoriesByCandidate, { data: completedData }, { data: callData }] = await Promise.all([
    fetchCategoriesByCandidate(supabase, allCategories, memberIds),
    completedIds.length
      ? supabase.from("v_full_report").select("*").in("candidate_id", completedIds).order("assessed_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    pendingIds.length
      ? supabase
          .from("call_logs")
          .select("id, candidate_id, status, notes, called_at")
          .in("candidate_id", pendingIds)
          .order("called_at", { ascending: false })
      : Promise.resolve({ data: [] }),
  ]);
  const completed = (completedData || []) as FullReportRow[];
  const callLogs = (callData || []) as CallLog[];
  const callsByCandidate = new Map<number, CallLog[]>();
  for (const log of callLogs) {
    const list = callsByCandidate.get(log.candidate_id) || [];
    list.push(log);
    callsByCandidate.set(log.candidate_id, list);
  }

  const records: CandidateListRow[] = [
    ...completed.map((r) => ({ ...r, pending: false as const, categories: categoriesByCandidate.get(r.candidate_id) || [] })),
    ...pending.map((c) => {
      const calls = callsByCandidate.get(c.id) || [];
      const candidateCategories = categoriesByCandidate.get(c.id) || [];
      return {
        pending: true as const,
        assessment_id: null,
        candidate_id: c.id,
        categories: candidateCategories,
        serial_number: c.serial_number,
        interview_date: c.interview_date,
        candidate_name: c.candidate_name,
        candidate_mobile: c.candidate_mobile,
        candidate_email: c.candidate_email,
        district: c.district,
        assembly_constituency: c.assembly_constituency,
        pincode: c.pincode,
        ngo: c.ngo,
        dob: c.dob,
        interview_started: c.interview_started,
        auto_suggested_role: null,
        final_score: null,
        final_decision: null,
        interviewer_name: "—",
        assigned_to: c.assigned_to,
        district_covered_by: interviewersCoveringCandidate(c, candidateCategories, coverage, interviewerById),
        call_count: calls.length,
        latest_call_status: calls[0]?.status ?? null,
      };
    }),
  ];

  return (
    <CategoryDetail
      category={category as Category}
      records={records}
      totalMembers={memberTotal ?? records.length}
      interviewers={interviewerList}
      callsByCandidate={Object.fromEntries(callsByCandidate)}
      currentUserId={profile.id}
    />
  );
}
