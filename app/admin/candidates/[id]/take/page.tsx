import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth";
import type { Assessment, Candidate } from "@/lib/supabase/types";
import InterviewWizard, { type ResumeAssessment } from "@/app/interview/InterviewWizard";
import type { CandidateInput } from "@/app/interview/actions";

export const dynamic = "force-dynamic";

function toResumeAssessment(a: Assessment): ResumeAssessment {
  return {
    id: a.id,
    scores: Array.from({ length: 16 }, (_, i) => a[`q${i + 1}_score`] ?? null),
    tieBreaker: a.tie_breaker_applied,
    additionalRole: a.additional_suggested_role || "",
    finalDecision: a.final_decision || "",
    verification: a.verification_status || "Pending",
    assessorSignature: a.assessor_signature || "",
    notes: a.additional_notes || "",
  };
}

export default async function TakeInterviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, profile } = await requireProfile("admin");

  const { data: candidate } = await supabase.from("candidates").select("*").eq("id", id).single();
  if (!candidate) notFound();

  const c = candidate as Candidate;

  // Pick up wherever a prior autosave (or a prior real save) left off,
  // rather than always restarting from question 1 — the localStorage
  // draft only helps on the same browser, this covers every device.
  const { data: assessment } = await supabase
    .from("assessments")
    .select("*")
    .eq("candidate_id", c.id)
    .order("assessed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const initialCandidate: CandidateInput = {
    name: c.candidate_name,
    mobile: c.candidate_mobile,
    email: c.candidate_email || "",
    date: c.interview_date || new Date().toISOString().split("T")[0],
    district: c.district,
    constituency: c.assembly_constituency,
    panchayat: c.panchayat_area,
    pincode: c.pincode || "",
    ngo: c.ngo || "",
    dob: c.dob || "",
    role: c.current_tnv_role || "",
  };

  return (
    <div className="max-w-[820px] mx-auto">
      <InterviewWizard
        interviewerName={profile.full_name}
        initialCandidate={initialCandidate}
        existingCandidateId={c.id}
        resumeAssessment={assessment ? toResumeAssessment(assessment as Assessment) : undefined}
        backHref="/admin"
        backLabel="← Back to All Candidates"
      />
    </div>
  );
}
