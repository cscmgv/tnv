import { requireProfile } from "@/lib/auth";
import { fetchCategoriesByCandidate } from "@/lib/categories";
import { interviewersCoveringCandidate } from "@/lib/coverage";
import type { CallLog, CandidateListRow, Candidate, Category, FullReportRow, InterviewerCoverageRule, Profile } from "@/lib/supabase/types";
import CandidatesTable from "./CandidatesTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ limit?: string }> }) {
  const { supabase, profile } = await requireProfile("admin");

  // This candidate list has grown into the thousands — loading, processing,
  // and rendering all of them in one request was blowing past the Worker's
  // CPU-time budget (a 503 with no visible app-level error, since the
  // failure happens inside Cloudflare's platform). Default to a capped page
  // (the "Show" control in CandidatesTable lets an admin pick 50/100/250/
  // All via ?limit=) — the stat cards below still use accurate site-wide
  // counts/aggregates (cheap, targeted queries) independent of this cap.
  // This is a stopgap until the table gets real server-side search.
  const { limit: limitParam } = await searchParams;
  const rowLimit = limitParam === "all" ? null : Number(limitParam) || 100;

  // v_full_report keeps select("*") — Export Excel reads every column
  // (interviewer contact info, all 16 per-question scores, signatures,
  // notes) from these same rows, so trimming it here would just mean
  // fetching it all over again the moment someone clicks Export.
  let completedQuery = supabase.from("v_full_report").select("*").order("assessed_at", { ascending: false });
  if (rowLimit) completedQuery = completedQuery.limit(rowLimit);
  // Pending candidates have no assessment yet, so none of the export-only
  // columns apply — only what's actually rendered or exported for them.
  let pendingQuery = supabase
    .from("candidates")
    .select(
      "id, serial_number, interview_date, candidate_name, candidate_mobile, candidate_email, district, assembly_constituency, pincode, ngo, dob, interview_started, assigned_to, deleted_at"
    )
    .eq("interview_completed", false)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });
  if (rowLimit) pendingQuery = pendingQuery.limit(rowLimit);

  // These queries don't depend on each other — run them concurrently
  // instead of round-tripping to Supabase one at a time, which was a
  // meaningful chunk of this page's load time.
  const [
    { data: completedData },
    { data: pendingData },
    { data: interviewerData },
    { data: categoryData },
    { count: completedTotal },
    { count: pendingTotal },
    { count: recommendedCount },
    { data: allScoresData },
  ] = await Promise.all([
    completedQuery,
    pendingQuery,
    supabase.from("profiles").select("id, full_name, reg_no, profile_completed").eq("role", "interviewer").eq("is_active", true).order("full_name"),
    supabase.from("categories").select("*").order("name"),
    supabase.from("assessments").select("id", { count: "exact", head: true }),
    supabase.from("candidates").select("id", { count: "exact", head: true }).eq("interview_completed", false).is("deleted_at", null),
    supabase.from("assessments").select("id", { count: "exact", head: true }).eq("final_decision", "Recommended"),
    supabase.from("assessments").select("final_score, interviewer_id"),
  ]);
  const allCategories = (categoryData || []) as Category[];

  const completed = (completedData || []) as FullReportRow[];
  const pending = (pendingData || []) as Candidate[];
  const interviewerList = (interviewerData || []) as Profile[];
  const interviewerById = new Map(interviewerList.map((iv) => [iv.id, iv]));
  const { data: coverageData } = await supabase.from("interviewer_coverage").select("*");
  const coverage = (coverageData || []) as InterviewerCoverageRule[];

  const allCandidateIds = [...completed.map((r) => r.candidate_id), ...pending.map((c) => c.id)];
  const categoriesByCandidate = await fetchCategoriesByCandidate(supabase, allCategories, allCandidateIds);

  const pendingIds = pending.map((c) => c.id);
  const { data: callData } = pendingIds.length
    ? await supabase
        .from("call_logs")
        .select("id, candidate_id, status, notes, called_at")
        .in("candidate_id", pendingIds)
        .order("called_at", { ascending: false })
    : { data: [] };
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

  const scores = allScoresData || [];
  const total = (completedTotal ?? 0) + (pendingTotal ?? 0);
  const avg = scores.length
    ? (scores.reduce((a, r) => a + (Number(r.final_score) || 0), 0) / scores.length).toFixed(1)
    : "—";
  const recommended = recommendedCount ?? 0;
  const interviewers = new Set(scores.map((r) => r.interviewer_id)).size;

  return (
    <div className="pb-16">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard icon="👥" value={total} label="Total Candidates" />
        <StatCard icon="✅" value={recommended} label="Recommended" />
        <StatCard icon="📊" value={avg} label="Average Score" />
        <StatCard icon="🎤" value={interviewers} label="Interviewers" />
      </div>
      <CandidatesTable
        records={records}
        totalCount={total}
        interviewers={interviewerList}
        callsByCandidate={Object.fromEntries(callsByCandidate)}
        currentUserId={profile.id}
      />
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-5 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-extrabold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}
