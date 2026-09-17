import { notFound } from "next/navigation";
import Link from "next/link";
import { requireProfile } from "@/lib/auth";
import { fetchCategoriesByCandidate } from "@/lib/categories";
import type { CallLog, Candidate, CandidateListRow, Category, FullReportRow } from "@/lib/supabase/types";
import CandidatesTable from "../../../admin/CandidatesTable";

export const dynamic = "force-dynamic";

export default async function InterviewCategoryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ limit?: string }>;
}) {
  const { id } = await params;
  const { supabase, profile } = await requireProfile("interviewer");

  const { limit: limitParam } = await searchParams;
  const memberLimit = limitParam === "all" ? null : Number(limitParam) || 100;

  const { data: category } = await supabase.from("categories").select("*").eq("id", id).single();
  if (!category) notFound();

  // candidate_categories itself is readable by any authenticated user, but
  // the candidates fetched below via `.in("id", memberIds)` are still
  // subject to the candidates RLS policies — so only candidates this
  // interviewer can actually see end up in `members`.
  const { data: memberIdRows } = await supabase.from("candidate_categories").select("candidate_id").eq("category_id", id);
  const memberIds = (memberIdRows || []).map((r) => r.candidate_id);

  // No Export Excel on this page (interviewer-only view), so only the
  // split (interview_completed) and pending-row display fields are needed
  // — a completed member's display data comes from v_full_report instead.
  let memberQuery = memberIds.length
    ? supabase
        .from("candidates")
        .select(
          "id, interview_completed, serial_number, interview_date, candidate_name, candidate_mobile, candidate_email, district, assembly_constituency, pincode, ngo, dob, interview_started, assigned_to"
        )
        .in("id", memberIds)
        .order("created_at", { ascending: false })
    : null;
  if (memberQuery && memberLimit) memberQuery = memberQuery.limit(memberLimit);
  const { data: memberData } = memberQuery ? await memberQuery : { data: [] };
  const members = (memberData || []) as Candidate[];

  const { data: allCategoryData } = await supabase.from("categories").select("*").order("name");
  const allCategories = (allCategoryData || []) as Category[];

  const pending = members.filter((m) => !m.interview_completed);
  const completedIds = members.filter((m) => m.interview_completed).map((m) => m.id);
  const pendingIds = pending.map((c) => c.id);

  const [categoriesByCandidate, { data: completedData }, { data: callData }] = await Promise.all([
    fetchCategoriesByCandidate(supabase, allCategories, members.map((m) => m.id)),
    completedIds.length
      ? supabase
          .from("v_full_report")
          .select(
            "assessment_id, candidate_id, serial_number, interview_date, interviewer_name, candidate_name, candidate_mobile, district, assembly_constituency, pincode, ngo, dob, final_score, auto_suggested_role, final_decision"
          )
          .in("candidate_id", completedIds)
          .order("assessed_at", { ascending: false })
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

  return (
    <div className="pb-16">
      <div className="flex items-center gap-3 mb-5">
        <Link href="/interview/categories" className="text-sm text-gray-500 hover:text-[#1a6b1a]">
          ← Categories
        </Link>
        <h2 className="text-lg font-bold text-gray-900">{category.name}</h2>
        <span className="text-xs text-gray-400">{members.length} visible to you</span>
      </div>

      <CandidatesTable
        records={records}
        totalCount={records.length}
        interviewers={[]}
        callsByCandidate={Object.fromEntries(callsByCandidate)}
        categoryId={category.id}
        currentUserId={profile.id}
        viewerRole="interviewer"
      />
    </div>
  );
}
