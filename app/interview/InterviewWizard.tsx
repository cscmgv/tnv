"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { QUESTIONS } from "@/lib/data/questions";
import { DISTRICTS } from "@/lib/data/districts";
import { constituenciesForDistrict } from "@/lib/data/constituencies";
import { getRoleFromScore, ADDITIONAL_ROLE_OPTIONS, CURRENT_TNV_ROLE_OPTIONS, ROLE_ALLOCATION_TABLE } from "@/lib/data/roles";
import { calculateAge } from "@/lib/age";
import AssessmentReport from "@/app/components/AssessmentReport";
import { autosaveScores, saveAssessment, startInterview, type CandidateInput } from "./actions";

const emptyCandidate: CandidateInput = {
  name: "",
  mobile: "",
  email: "",
  date: new Date().toISOString().split("T")[0],
  district: "",
  constituency: "",
  panchayat: "",
  pincode: "",
  ngo: "",
  dob: "",
  role: "",
};

type Step = "candidate" | "questions" | "results";

type Draft = {
  step: Step;
  candidate: CandidateInput;
  scores: (number | null)[];
  currentQ: number;
  ids: { candidateId: number; assessmentId: number } | null;
  completedSave: boolean;
  tieBreaker: boolean;
  additionalRole: string;
  finalDecision: string;
  verification: string;
  assessorSig: string;
  notes: string;
};

function loadDraft(key: string): Draft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}

// Whatever was already persisted to the server for this candidate — from a
// prior autosave or a prior real save — so resuming picks up mid-interview
// instead of restarting from question 1, even on a different browser than
// the one the draft's localStorage lives in.
export type ResumeAssessment = {
  id: number;
  scores: (number | null)[];
  tieBreaker: boolean;
  additionalRole: string;
  finalDecision: string;
  verification: string;
  assessorSignature: string;
  notes: string;
};

export default function InterviewWizard({
  interviewerName,
  initialCandidate,
  existingCandidateId,
  resumeAssessment,
  backHref,
  backLabel = "← Back",
}: {
  interviewerName: string;
  initialCandidate?: CandidateInput;
  existingCandidateId?: number;
  resumeAssessment?: ResumeAssessment;
  backHref?: string;
  backLabel?: string;
}) {
  // Used once, to restore-on-mount whatever draft belongs to the candidate
  // this page was opened for. Deliberately NOT reactive to `ids` — the
  // restore effect below should only ever run for the page's original
  // candidate, never re-fire when the wizard moves on to the next one.
  const [initialDraftKey] = useState(() => `tnv_interview_draft_${existingCandidateId ?? "new"}`);

  // Initial state always matches what the server rendered (no localStorage
  // read here) — any saved draft is applied after mount, in the effect
  // below, to avoid a hydration mismatch.
  const [step, setStep] = useState<Step>("candidate");
  const [candidate, setCandidate] = useState<CandidateInput>(initialCandidate ?? emptyCandidate);
  const [scores, setScores] = useState<(number | null)[]>(resumeAssessment?.scores ?? Array(16).fill(null));
  const [currentQ, setCurrentQ] = useState(0);
  // The score tapped for the question on screen, held separately from
  // `scores` so it only gets written into `scores` when "Next" is pressed
  // — tapping an option alone doesn't save it.
  const [pendingScore, setPendingScore] = useState<number | null>(resumeAssessment?.scores[0] ?? null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [doneCount, setDoneCount] = useState(0);
  const [ids, setIds] = useState<{ candidateId: number; assessmentId: number } | null>(
    existingCandidateId ? { candidateId: existingCandidateId, assessmentId: resumeAssessment?.id ?? 0 } : null
  );
  const [saving, setSaving] = useState(false);
  const [starting, setStarting] = useState(false);
  // True only once the interviewer has actually clicked "Save" and it
  // succeeded — distinct from `ids.assessmentId`, which now also gets set
  // by the silent per-question autosave and so can't be used to gate
  // "Next Candidate" (that button should only appear after a real save).
  const [completedSave, setCompletedSave] = useState(false);
  const [toast, setToast] = useState<{ msg: string; error?: boolean } | null>(null);
  const [restored, setRestored] = useState(false);
  const [ready, setReady] = useState(false);

  const [tieBreaker, setTieBreaker] = useState(resumeAssessment?.tieBreaker ?? false);
  const [additionalRole, setAdditionalRole] = useState(resumeAssessment?.additionalRole ?? "");
  const [finalDecision, setFinalDecision] = useState(resumeAssessment?.finalDecision ?? "");
  const [verification, setVerification] = useState(resumeAssessment?.verification ?? "Pending");
  const [assessorSig, setAssessorSig] = useState(resumeAssessment?.assessorSignature || interviewerName);
  const [notes, setNotes] = useState(resumeAssessment?.notes ?? "");

  // The candidate actually being worked on right now — changes when
  // submitCandidate() assigns a new id, or resets to "new" after
  // nextCandidate() — unlike initialDraftKey, which never moves.
  const draftKey = `tnv_interview_draft_${ids?.candidateId ?? "new"}`;

  function clearDraft() {
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // ignore
    }
  }

  // Restore any saved draft once mounted on the client.
  useEffect(() => {
    const draft = loadDraft(initialDraftKey);
    if (draft) {
      setStep(draft.step);
      setCandidate(draft.candidate);
      setScores(draft.scores);
      setCurrentQ(draft.currentQ);
      setPendingScore(draft.scores[draft.currentQ] ?? null);
      setIds(draft.ids);
      setCompletedSave(draft.completedSave);
      setTieBreaker(draft.tieBreaker);
      setAdditionalRole(draft.additionalRole);
      setFinalDecision(draft.finalDecision);
      setVerification(draft.verification);
      setAssessorSig(draft.assessorSig);
      setNotes(draft.notes);
      setRestored(true);
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDraftKey]);

  // Autosave the in-progress interview so it survives a closed tab / reload.
  // Gated on `ready` so this doesn't fire (and overwrite the saved draft
  // with fresh defaults) before the restore effect above has run.
  useEffect(() => {
    if (!ready) return;
    try {
      const data: Draft = { step, candidate, scores, currentQ, ids, completedSave, tieBreaker, additionalRole, finalDecision, verification, assessorSig, notes };
      localStorage.setItem(draftKey, JSON.stringify(data));
    } catch {
      // ignore — e.g. private browsing with storage disabled
    }
  }, [ready, draftKey, step, candidate, scores, currentQ, ids, completedSave, tieBreaker, additionalRole, finalDecision, verification, assessorSig, notes]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  function showToast(msg: string, error = false) {
    setToast({ msg, error });
  }

  function validatePhone(p: string) {
    return /^[6-9]\d{9}$/.test(p);
  }
  function validateEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  async function submitCandidate() {
    const next: Record<string, boolean> = {};
    if (!candidate.name) next.name = true;
    if (!validatePhone(candidate.mobile)) next.mobile = true;
    if (candidate.email && !validateEmail(candidate.email)) next.email = true;
    if (!candidate.date) next.date = true;
    if (!candidate.district) next.district = true;
    if (!candidate.constituency) next.constituency = true;
    if (!candidate.panchayat) next.panchayat = true;
    if (!candidate.role) next.role = true;
    setErrors(next);
    if (Object.keys(next).length) return;

    // Record that this interview has begun — before any scores are entered
    // — so the admin's candidate table can show "In Progress" instead of
    // nothing at all if the interviewer leaves partway through.
    setStarting(true);
    const result = await startInterview(candidate, ids?.candidateId);
    setStarting(false);
    if ("error" in result) {
      showToast("Could not start interview: " + result.error, true);
      return;
    }

    setIds({ candidateId: result.candidateId!, assessmentId: ids?.assessmentId ?? 0 });
    setScores(Array(16).fill(null));
    setCurrentQ(0);
    setPendingScore(null);
    setStep("questions");
  }

  // Mirrors ids?.assessmentId, but updated synchronously inside the save
  // chain below — reading it from state would race two quick autosaves
  // against each other (both firing before either's response lands),
  // each seeing assessmentId as still unset and inserting its own
  // assessment row instead of the second one updating the first's.
  const assessmentIdRef = useRef(ids?.assessmentId || 0);
  useEffect(() => {
    assessmentIdRef.current = ids?.assessmentId || 0;
  }, [ids?.assessmentId]);

  // Every autosave is chained after the previous one so they run strictly
  // in order — otherwise two calls in flight at once could both read the
  // pre-save assessmentId and both insert, instead of the second updating
  // what the first just created.
  const saveChainRef = useRef<Promise<void>>(Promise.resolve());

  // Fire-and-forget: pushes the scores entered so far to the server, so an
  // interviewer who closes the tab mid-interview (or never presses the
  // final "Save" button) doesn't lose everything back to nothing — only
  // whatever they hadn't answered yet. Silent on failure; the localStorage
  // draft still has it, and the next successful autosave will catch up.
  function persistScores(committedScores: (number | null)[]) {
    const candidateId = ids?.candidateId;
    if (!candidateId) return;
    saveChainRef.current = saveChainRef.current.then(async () => {
      const result = await autosaveScores(candidateId, committedScores, assessmentIdRef.current || undefined);
      if (!("error" in result) && result.assessmentId) {
        assessmentIdRef.current = result.assessmentId;
        setIds((prev) => (prev ? { ...prev, assessmentId: result.assessmentId! } : prev));
      }
    });
  }

  function qNav(dir: 1 | -1) {
    if (dir === 1 && pendingScore === null) {
      showToast("Please select a score before proceeding.", true);
      return;
    }

    // Only committed here, on "Next" — selecting an option alone doesn't save it.
    const committedScores = dir === 1 ? scores.map((s, i) => (i === currentQ ? pendingScore : s)) : scores;
    if (dir === 1) {
      setScores(committedScores);
      persistScores(committedScores);
    }

    const next = currentQ + dir;
    if (next < 0) {
      setStep("candidate");
      return;
    }
    if (next > 15) {
      setFinalDecision("");
      setTieBreaker(false);
      setAdditionalRole("");
      setVerification("Pending");
      setAssessorSig(interviewerName);
      setNotes("");
      setStep("results");
      return;
    }
    setCurrentQ(next);
    setPendingScore(committedScores[next]);
  }

  const baseScore = scores.reduce((a: number, b) => a + (b || 0), 0);
  const finalScore = baseScore + (tieBreaker ? 0.5 : 0);
  const role = getRoleFromScore(finalScore);

  async function handleSaveAndExport() {
    setSaving(true);
    const result = await saveAssessment(
      candidate,
      scores,
      {
        tieBreaker,
        additionalRole,
        finalDecision,
        verification,
        assessorSignature: assessorSig,
        notes,
      },
      ids
    );
    setSaving(false);

    if ("error" in result) {
      showToast("Save failed: " + result.error, true);
      return;
    }

    setIds({ candidateId: result.candidateId!, assessmentId: result.assessmentId! });
    if (!completedSave) setDoneCount((c) => c + 1);
    setCompletedSave(true);

    showToast(`Saved! ${doneCount + (completedSave ? 0 : 1)} candidate(s) this session.`);
  }

  function nextCandidate() {
    clearDraft();
    setCandidate({ ...emptyCandidate, date: new Date().toISOString().split("T")[0] });
    setScores(Array(16).fill(null));
    setCurrentQ(0);
    setPendingScore(null);
    setIds(null);
    setCompletedSave(false);
    setStep("candidate");
    showToast("Ready for next candidate.");
  }

  return (
    <div>
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[200] px-4 py-2.5 rounded-lg text-sm font-semibold text-white shadow-lg ${
            toast.error ? "bg-red-600" : "bg-[#1a6b1a]"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {backHref && (
        <Link href={backHref} className="inline-block mb-4 text-sm font-semibold text-gray-500 hover:text-[#1a6b1a]">
          {backLabel}
        </Link>
      )}

      <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
        <span>Done today: <strong className="text-[#1a6b1a]">{doneCount}</strong></span>
        {restored && step !== "candidate" && (
          <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold">
            Restored your in-progress answers
          </span>
        )}
      </div>

      {step === "candidate" && (
        <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Candidate Details</h2>
          <p className="text-xs text-gray-500 mb-5">
            Enter the details of the person you are about to interview — not your own.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField label="Candidate Full Name *" value={candidate.name} error={errors.name} onChange={(v) => setCandidate({ ...candidate, name: v })} />
            <TextField
              label="Candidate Mobile Number *"
              value={candidate.mobile}
              error={errors.mobile}
              errorMsg="Enter a valid 10-digit mobile number"
              onChange={(v) => setCandidate({ ...candidate, mobile: v })}
            />
            <TextField label="Email" value={candidate.email} error={errors.email} errorMsg="Enter a valid email" onChange={(v) => setCandidate({ ...candidate, email: v })} />
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Date of Birth</label>
              <input
                type="date"
                value={candidate.dob}
                onChange={(e) => setCandidate({ ...candidate, dob: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#1a6b1a]"
              />
              {calculateAge(candidate.dob) !== null && (
                <p className="text-[11px] text-gray-500 mt-1">Age: {calculateAge(candidate.dob)} years</p>
              )}
            </div>
            <TextField label="Interview Date *" type="date" value={candidate.date} error={errors.date} onChange={(v) => setCandidate({ ...candidate, date: v })} />
            <SelectField label="District *" value={candidate.district} error={errors.district} options={DISTRICTS as unknown as string[]} onChange={(v) => setCandidate({ ...candidate, district: v, constituency: "" })} />
            <SelectField
              key={candidate.district}
              label="Assembly Constituency *"
              value={candidate.constituency}
              error={errors.constituency}
              options={constituenciesForDistrict(candidate.district) as string[]}
              onChange={(v) => setCandidate({ ...candidate, constituency: v })}
            />
            <TextField label="Panchayat / Area *" value={candidate.panchayat} error={errors.panchayat} onChange={(v) => setCandidate({ ...candidate, panchayat: v })} />
            <TextField label="Pincode" value={candidate.pincode} onChange={(v) => setCandidate({ ...candidate, pincode: v })} />
            <TextField label="NGO" value={candidate.ngo} onChange={(v) => setCandidate({ ...candidate, ngo: v })} />
            <SelectField
              label="Current TNV Role *"
              value={candidate.role}
              error={errors.role}
              options={CURRENT_TNV_ROLE_OPTIONS as unknown as string[]}
              onChange={(v) => setCandidate({ ...candidate, role: v })}
            />
          </div>
          <button
            onClick={submitCandidate}
            disabled={starting}
            className="mt-6 bg-[#1a6b1a] hover:bg-[#0f4a0f] disabled:opacity-60 text-white font-semibold rounded-lg px-6 py-2.5 text-sm"
          >
            {starting ? "Starting…" : "Start Interview →"}
          </button>
        </div>
      )}

      {step === "questions" && (
        <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-900">{candidate.name}</span>
            <span className="text-xs text-gray-500">{candidate.district} · {candidate.constituency}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-[#1a6b1a] transition-all" style={{ width: `${((currentQ + 1) / 16) * 100}%` }} />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span>Question {currentQ + 1} of 16</span>
            <span>Score: {scores.filter((s) => s !== null).reduce((a: number, b) => a + (b || 0), 0).toFixed(1)} / {scores.filter((s) => s !== null).length}</span>
          </div>
          <p className="text-base font-semibold text-gray-900">{QUESTIONS[currentQ].en}</p>
          <p className="text-sm text-gray-500 mt-1">{QUESTIONS[currentQ].ta}</p>
          <div className="mt-4 bg-[#f9fafb] border border-[#e2e6ed] rounded-lg p-3.5 text-xs text-gray-600 whitespace-pre-line">
            {QUESTIONS[currentQ].hint}
          </div>

          <div className="mt-6">
            <div className="text-xs font-semibold text-gray-600 mb-2">Award Score for This Answer</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: 0, label: "Inadequate / Unsupported" },
                { val: 0.5, label: "Partial / Acceptable" },
                { val: 1, label: "Clear / Credible" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setPendingScore(opt.val)}
                  className={`rounded-lg border-2 p-3 text-center transition ${
                    pendingScore === opt.val ? "border-[#1a6b1a] bg-[#f0f8f0]" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-lg font-extrabold text-gray-900">{opt.val}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button onClick={() => qNav(-1)} className="text-sm font-semibold text-gray-600 hover:text-gray-900">
              ← Back
            </button>
            <button onClick={() => qNav(1)} className="bg-[#1a6b1a] hover:bg-[#0f4a0f] text-white font-semibold rounded-lg px-6 py-2.5 text-sm">
              {currentQ === 15 ? "Finish Interview →" : "Next →"}
            </button>
          </div>
        </div>
      )}

      {step === "results" && (
        <div id="results-printable" className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-6 print:border-0 print:shadow-none print:rounded-none">
          <style>{`
            @media print {
              body * { visibility: hidden; }
              #results-printable, #results-printable * { visibility: visible; }
              #results-printable { position: absolute; inset: 0; width: 100%; padding: 24px; }
              .print\\:hidden { display: none !important; }
            }
          `}</style>
          <div className="print:hidden">
          <div className="text-center mb-6">
            <div className="text-4xl font-extrabold text-[#1a6b1a]">{finalScore.toFixed(1)}</div>
            <div className="text-xs text-gray-500">out of {tieBreaker ? "16.5" : "16"}</div>
            <div className="text-lg font-bold text-gray-900 mt-2">{candidate.name}</div>
            <div className="text-xs text-gray-500">{candidate.district} · {candidate.constituency} · {candidate.date}</div>
            <div className="inline-block mt-3 px-4 py-1.5 rounded-full bg-[#f0f8f0] text-[#1a6b1a] text-sm font-bold">
              {role.icon} Auto-Suggested: {role.label}
            </div>
          </div>

          <div className="mb-6 border border-[#e2e6ed] rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-[#f9fafb] border-b border-[#e2e6ed] text-xs font-bold text-gray-600">
              Role Allocation — by Base Score
            </div>
            <table className="w-full text-xs">
              <tbody>
                {ROLE_ALLOCATION_TABLE.map((band) => {
                  const isTopBand = band.max === ROLE_ALLOCATION_TABLE[0].max;
                  const active = finalScore >= band.min && (isTopBand || finalScore <= band.max);
                  return (
                    <tr
                      key={band.label}
                      className={`border-b border-[#f0f2f6] last:border-b-0 ${active ? "bg-[#f0f8f0]" : ""}`}
                    >
                      <td className={`px-3 py-1.5 font-semibold whitespace-nowrap ${active ? "text-[#1a6b1a]" : "text-gray-500"}`}>
                        {band.min}–{band.max}
                      </td>
                      <td className={`px-3 py-1.5 ${active ? "text-[#1a6b1a] font-bold" : "text-gray-700"}`}>
                        {active && "→ "}
                        {band.label}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-6">
            {scores.map((s, i) => (
              <div
                key={i}
                className={`rounded-lg p-2 text-center text-xs font-bold ${
                  s === 1 ? "bg-green-100 text-green-800" : s === 0.5 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                }`}
              >
                <div className="text-[10px] font-normal opacity-70">Q{i + 1}</div>
                {s === null ? "—" : s}
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tie-Breaker Applied</label>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-1.5">
                  <input type="radio" checked={tieBreaker} onChange={() => setTieBreaker(true)} /> Yes (+0.5)
                </label>
                <label className="flex items-center gap-1.5">
                  <input type="radio" checked={!tieBreaker} onChange={() => setTieBreaker(false)} /> No
                </label>
              </div>
            </div>
            <SelectField
              label="Additional Suggested Role"
              value={additionalRole}
              options={ADDITIONAL_ROLE_OPTIONS as unknown as string[]}
              onChange={setAdditionalRole}
            />
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Verification Status</label>
              <select value={verification} onChange={(e) => setVerification(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                <option>Pending</option>
                <option>Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Final Decision</label>
              <div className="flex flex-wrap gap-3 text-sm mt-1">
                {["Recommended", "Hold", "Not Recommended"].map((d) => (
                  <label key={d} className="flex items-center gap-1.5">
                    <input type="radio" checked={finalDecision === d} onChange={() => setFinalDecision(d)} /> {d}
                  </label>
                ))}
              </div>
            </div>
            <TextField label="Assessor Signature / Name" value={assessorSig} onChange={setAssessorSig} />
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Additional Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>

          <div className="mt-2 text-sm font-bold text-gray-800">
            Final Score: {finalScore.toFixed(1)} / {tieBreaker ? "16.5" : "16"}
          </div>
          </div>

          <div className="hidden print:block">
            <AssessmentReport
              candidateName={candidate.name}
              candidateMobile={candidate.mobile}
              candidateEmail={candidate.email}
              district={candidate.district}
              constituency={candidate.constituency}
              panchayat={candidate.panchayat}
              pincode={candidate.pincode}
              ngo={candidate.ngo}
              dob={candidate.dob}
              currentRole={candidate.role}
              interviewDate={candidate.date}
              scores={scores}
              tieBreaker={tieBreaker}
              additionalRole={additionalRole}
              finalDecision={finalDecision}
              verificationStatus={verification}
              assessorSignature={assessorSig}
              notes={notes}
              interviewerName={interviewerName}
            />
          </div>

          <div className="flex gap-3 mt-6 flex-wrap print:hidden">
            <button
              onClick={handleSaveAndExport}
              disabled={saving}
              className="bg-[#1a6b1a] hover:bg-[#0f4a0f] disabled:opacity-60 text-white font-semibold rounded-lg px-6 py-2.5 text-sm"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => window.print()}
              className="bg-white border border-[#1a6b1a] text-[#1a6b1a] hover:bg-[#f0f8f0] font-semibold rounded-lg px-6 py-2.5 text-sm"
            >
              Download PDF
            </button>
            {completedSave && (
              <button onClick={nextCandidate} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg px-6 py-2.5 text-sm">
                Next Candidate
              </button>
            )}
            <button onClick={() => setStep("questions")} className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-3">
              ← Back to Questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  error,
  errorMsg = "This field is required",
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
  errorMsg?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${error ? "border-red-400" : "border-gray-300 focus:border-[#1a6b1a]"}`}
      />
      {error && <p className="text-[11px] text-red-600 mt-1">{errorMsg}</p>}
    </div>
  );
}

const OTHER = "__other__";

function SelectField({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: boolean;
}) {
  const [customMode, setCustomMode] = useState(!!value && !options.includes(value));

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <select
        value={customMode ? OTHER : value}
        onChange={(e) => {
          if (e.target.value === OTHER) {
            setCustomMode(true);
            onChange("");
          } else {
            setCustomMode(false);
            onChange(e.target.value);
          }
        }}
        className={`w-full rounded-lg border px-3 py-2 text-sm ${error ? "border-red-400" : "border-gray-300"}`}
      >
        <option value="">— Select —</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
        <option value={OTHER}>Others (type manually)</option>
      </select>
      {customMode && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${label.replace(" *", "")}`}
          className={`w-full rounded-lg border px-3 py-2 text-sm mt-1.5 ${error ? "border-red-400" : "border-gray-300"}`}
        />
      )}
      {error && <p className="text-[11px] text-red-600 mt-1">Required</p>}
    </div>
  );
}
