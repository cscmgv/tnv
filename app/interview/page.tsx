import { requireProfile } from "@/lib/auth";
import { fetchCategoriesByCandidate } from "@/lib/categories";
import type { CallLog, Candidate, CandidateListRow, Category, FullReportRow } from "@/lib/supabase/types";
import CandidatesTable from "../admin/CandidatesTable";

export const dynamic = "force-dynamic";

export default async function InterviewPage({ searchParams }: { searchParams: Promise<{ limit?: string }> }) {
  const { supabase, profile } = await requireProfile("interviewer");

  // RLS scopes every query below to exactly what this interviewer is
  // allowed to see (assigned to them, created by them, or covered by their
  // interviewer_coverage rules / pincode grants) — no need to replicate
  // that logic here, and there's no broad "browse everyone" access to
  // filter down from.
  const { limit: limitParam } = await searchParams;
  const rowLimit = limitParam === "all" ? null : Number(limitParam) || 100;

  // This page has no Export Excel (admin-only), so it only needs the
  // columns CandidatesTable actually renders for a non-admin viewer —
  // not the full row, which also carries export-only fields (interviewer
  // contact details, per-question scores, signatures, notes, etc.).
  let completedQuery = supabase
    .from("v_full_report")
    .select(
      "assessment_id, candidate_id, serial_number, interview_date, interviewer_name, candidate_name, candidate_mobile, district, assembly_constituency, pincode, ngo, dob, final_score, auto_suggested_role, final_decision"
    )
    .order("assessed_at", { ascending: false });
  if (rowLimit) completedQuery = completedQuery.limit(rowLimit);
  let pendingQuery = supabase
    .from("candidates")
    .select(
      "id, serial_number, interview_date, candidate_name, candidate_mobile, candidate_email, district, assembly_constituency, pincode, ngo, dob, interview_started, assigned_to"
    )
    .eq("interview_completed", false)
    .order("created_at", { ascending: false });
  if (rowLimit) pendingQuery = pendingQuery.limit(rowLimit);

  const [
    { data: completedData },
    { data: pendingData },
    { data: categoryData },
    { count: completedTotal },
    { count: pendingTotal },
  ] = await Promise.all([
    completedQuery,
    pendingQuery,
    supabase.from("categories").select("*").order("name"),
    supabase.from("assessments").select("id", { count: "exact", head: true }),
    supabase.from("candidates").select("id", { count: "exact", head: true }).eq("interview_completed", false),
  ]);
  const allCategories = (categoryData || []) as Category[];
  const completed = (completedData || []) as FullReportRow[];
  const pending = (pendingData || []) as Candidate[];

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
      return {
        pending: true as const,
        assessment_id: null,
        candidate_id: c.id,
        categories: categoriesByCandidate.get(c.id) || [],
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
        district_covered_by: [],
        call_count: calls.length,
        latest_call_status: calls[0]?.status ?? null,
      };
    }),
  ];

  const total = (completedTotal ?? 0) + (pendingTotal ?? 0);
  const avg = completed.length
    ? (completed.reduce((a, r) => a + (Number(r.final_score) || 0), 0) / completed.length).toFixed(1)
    : "—";
  const recommended = completed.filter((r) => r.final_decision === "Recommended").length;

  return (
    <div className="pb-16">
      <h1 className="text-lg font-bold text-gray-900 mb-4">My Candidates</h1>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard icon="👥" value={total} label="Total Candidates" />
        <StatCard icon="✅" value={recommended} label="Recommended" />
        <StatCard icon="📊" value={avg} label="Average Score" />
      </div>
      <CandidatesTable records={records} totalCount={total} interviewers={[]} callsByCandidate={Object.fromEntries(callsByCandidate)} currentUserId={profile.id} viewerRole="interviewer" />
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
