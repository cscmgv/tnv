"use server";

import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth";
import { getRoleFromScore } from "@/lib/data/roles";
import type { CallStatus } from "@/lib/supabase/types";
import { friendlyCandidateError } from "@/lib/db-errors";
import { safeAction } from "@/lib/action-utils";

export async function logCall(candidateId: number, status: CallStatus, notes: string) {
  return safeAction(async () => {
    const { supabase, profile } = await requireProfile();

    const { error } = await supabase.from("call_logs").insert({
      candidate_id: candidateId,
      interviewer_id: profile.id,
      status,
      notes: notes.trim() || null,
    });
    if (error) return { error: error.message };

    revalidatePath("/interview");
    revalidatePath("/admin");
    return { success: true };
  });
}

export type CandidateInput = {
  name: string;
  mobile: string;
  email: string;
  date: string;
  district: string;
  constituency: string;
  panchayat: string;
  pincode: string;
  ngo: string;
  dob: string;
  role: string;
};

export type ExtraInput = {
  tieBreaker: boolean;
  additionalRole: string;
  finalDecision: string;
  verification: string;
  assessorSignature: string;
  notes: string;
};

// How long a lock (see below) survives with no further activity before
// it's treated as abandoned and up for grabs again — an interviewer who
// closes the tab mid-interview without finishing shouldn't permanently
// block that candidate for everyone else.
const LOCK_TIMEOUT_MINUTES = 30;

// Called the moment an interviewer moves past the candidate-details step
// into scoring — before anything is actually saved. This lets the admin
// table distinguish "never started" from "started but abandoned partway",
// which saveAssessment (only called at the very end) can't do on its own.
//
// It also acquires an exclusive lock on the candidate (locked_by/locked_at)
// so a second interviewer can't start scoring the same candidate at the
// same time. The UPDATE's WHERE clause — not a separate SELECT-then-UPDATE
// — is what makes this safe against two interviewers hitting "Start
// Interview" simultaneously: only one write can match a free-or-expired
// lock and actually take it, so there's no window between checking and
// acquiring for a second request to sneak through.
export async function startInterview(candidate: CandidateInput, existingCandidateId?: number) {
  return safeAction(async () => {
    const { supabase, profile } = await requireProfile();

    const candidatePatch = {
      candidate_name: candidate.name,
      candidate_mobile: candidate.mobile,
      candidate_email: candidate.email || null,
      interview_date: candidate.date,
      district: candidate.district,
      assembly_constituency: candidate.constituency,
      panchayat_area: candidate.panchayat,
      pincode: candidate.pincode || null,
      ngo: candidate.ngo || null,
      dob: candidate.dob || null,
      current_tnv_role: candidate.role,
      interview_started: true,
    };

    if (existingCandidateId) {
      const cutoff = new Date(Date.now() - LOCK_TIMEOUT_MINUTES * 60_000).toISOString();
      const { data, error } = await supabase
        .from("candidates")
        .update({ ...candidatePatch, locked_by: profile.id, locked_at: new Date().toISOString() })
        .eq("id", existingCandidateId)
        .or(`locked_by.is.null,locked_by.eq.${profile.id},locked_at.lt.${cutoff}`)
        .select("id")
        .maybeSingle();
      if (error) return { error: friendlyCandidateError(error) };

      if (!data) {
        const { data: current } = await supabase
          .from("candidates")
          .select("locked_by")
          .eq("id", existingCandidateId)
          .maybeSingle();
        let holderName = "another interviewer";
        if (current?.locked_by) {
          const { data: holder } = await supabase.from("profiles").select("full_name").eq("id", current.locked_by).maybeSingle();
          if (holder?.full_name) holderName = holder.full_name;
        }
        return { error: `This candidate is currently being interviewed by ${holderName}. Please try again later.` };
      }

      revalidatePath("/admin");
      return { candidateId: existingCandidateId };
    }

    const { data, error } = await supabase
      .from("candidates")
      .insert({
        ...candidatePatch,
        interview_completed: false,
        created_by: profile.id,
        locked_by: profile.id,
        locked_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error) return { error: friendlyCandidateError(error) };
    revalidatePath("/admin");
    return { candidateId: data.id };
  });
}

// Fired after every answered question (not just on the final "Save" click)
// so a candidate's scores are on the server the moment they're entered —
// an interviewer closing the tab mid-interview no longer loses everything
// back to whatever was last explicitly saved.
export async function autosaveScores(
  candidateId: number,
  scores: (number | null)[],
  assessmentId?: number
) {
  return safeAction(async () => {
    const { supabase, profile } = await requireProfile();

    const baseScore = scores.reduce((a: number, b) => a + (b || 0), 0);
    const scoreFields: Record<string, number> = {};
    scores.forEach((s, i) => (scoreFields[`q${i + 1}_score`] = s ?? 0));

    if (assessmentId) {
      const { error } = await supabase
        .from("assessments")
        .update({ ...scoreFields, base_score: baseScore, final_score: baseScore })
        .eq("id", assessmentId);
      if (error) return { error: error.message };
      return { assessmentId };
    }

    const { data, error } = await supabase
      .from("assessments")
      .insert({
        candidate_id: candidateId,
        interviewer_id: profile.id,
        ...scoreFields,
        base_score: baseScore,
        final_score: baseScore,
      })
      .select("id")
      .single();
    if (error) return { error: error.message };
    return { assessmentId: data.id };
  });
}

export async function saveAssessment(
  candidate: CandidateInput,
  scores: (number | null)[],
  extra: ExtraInput,
  existingIds: { candidateId: number; assessmentId: number } | null
) {
  return safeAction(async () => {
  const { supabase, profile } = await requireProfile();

  const baseScore = scores.reduce((a: number, b) => a + (b || 0), 0);
  const finalScore = baseScore + (extra.tieBreaker ? 0.5 : 0);
  const role = getRoleFromScore(finalScore);

  const scoreFields: Record<string, number> = {};
  scores.forEach((s, i) => (scoreFields[`q${i + 1}_score`] = s ?? 0));

  let candidateId = existingIds?.candidateId;

  if (!candidateId) {
    const { data: candData, error: candErr } = await supabase
      .from("candidates")
      .insert({
        candidate_name: candidate.name,
        candidate_mobile: candidate.mobile,
        candidate_email: candidate.email || null,
        interview_date: candidate.date,
        district: candidate.district,
        assembly_constituency: candidate.constituency,
        panchayat_area: candidate.panchayat,
        pincode: candidate.pincode || null,
        ngo: candidate.ngo || null,
      dob: candidate.dob || null,
        current_tnv_role: candidate.role,
        interview_started: true,
        interview_completed: true,
        created_by: profile.id,
      })
      .select("id")
      .single();
    if (candErr) return { error: friendlyCandidateError(candErr) };
    candidateId = candData.id;
  } else {
    const { error: updErr } = await supabase
      .from("candidates")
      .update({
        candidate_name: candidate.name,
        candidate_mobile: candidate.mobile,
        candidate_email: candidate.email || null,
        interview_date: candidate.date,
        district: candidate.district,
        assembly_constituency: candidate.constituency,
        panchayat_area: candidate.panchayat,
        pincode: candidate.pincode || null,
        ngo: candidate.ngo || null,
      dob: candidate.dob || null,
        current_tnv_role: candidate.role,
        interview_completed: true,
        locked_by: null,
        locked_at: null,
      })
      .eq("id", candidateId);
    if (updErr) return { error: friendlyCandidateError(updErr) };
  }

  const assessmentPayload = {
    ...scoreFields,
    base_score: baseScore,
    tie_breaker_applied: extra.tieBreaker,
    final_score: finalScore,
    auto_suggested_role: role.label,
    additional_suggested_role: extra.additionalRole,
    final_decision: extra.finalDecision || null,
    verification_status: extra.verification,
    assessor_signature: extra.assessorSignature,
    additional_notes: extra.notes,
  };

  if (existingIds?.assessmentId) {
    const { error } = await supabase
      .from("assessments")
      .update(assessmentPayload)
      .eq("id", existingIds.assessmentId);
    if (error) return { error: error.message };
    revalidatePath("/admin");
    return { candidateId, assessmentId: existingIds.assessmentId };
  }

  const { data: asmntData, error: asmntErr } = await supabase
    .from("assessments")
    .insert({
      candidate_id: candidateId,
      interviewer_id: profile.id,
      ...assessmentPayload,
    })
    .select("id")
    .single();
  if (asmntErr) return { error: asmntErr.message };

  revalidatePath("/admin");
  return { candidateId, assessmentId: asmntData.id };
  });
}
