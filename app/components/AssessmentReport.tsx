import { QUESTIONS } from "@/lib/data/questions";
import { getRoleFromScore, ROLE_ALLOCATION_TABLE } from "@/lib/data/roles";
import { calculateAge } from "@/lib/age";

// The single print/PDF layout used everywhere an assessment gets printed —
// right after an interviewer finishes an interview, and again from the
// admin's Edit Assessment page. Both used to build their own print markup
// (one a live form's raw inputs, one a read-only summary), which produced
// two differently-shaped reports for the same assessment. This component
// is the one source of truth; callers render it inside a `hidden
// print:block` wrapper alongside their normal (interactive) UI.
export default function AssessmentReport({
  candidateName,
  candidateMobile,
  candidateEmail,
  district,
  taluk,
  constituency,
  panchayat,
  pincode,
  ngo,
  dob,
  currentRole,
  categories,
  interviewDate,
  scores,
  tieBreaker,
  additionalRole,
  finalDecision,
  verificationStatus,
  assessorSignature,
  notes,
  interviewerName,
}: {
  candidateName: string;
  candidateMobile: string;
  candidateEmail?: string | null;
  district: string;
  taluk?: string | null;
  constituency?: string | null;
  panchayat?: string | null;
  pincode?: string | null;
  ngo?: string | null;
  dob?: string | null;
  currentRole?: string | null;
  categories?: string[];
  interviewDate: string;
  scores: (number | null)[];
  tieBreaker: boolean;
  additionalRole?: string;
  finalDecision?: string;
  verificationStatus?: string;
  assessorSignature?: string;
  notes?: string;
  interviewerName?: string;
}) {
  const baseScore = scores.reduce((a: number, b) => a + (b || 0), 0);
  const finalScore = baseScore + (tieBreaker ? 0.5 : 0);
  const role = getRoleFromScore(baseScore);
  const age = calculateAge(dob ?? null);

  return (
    <div className="text-sm text-gray-900">
      <div className="text-center mb-5 pb-4 border-b-2 border-[#1a6b1a]">
        <div className="text-xs font-bold tracking-wide text-gray-500 uppercase">Tamil Nadu Volunteers</div>
        <div className="text-lg font-extrabold text-gray-900">Leadership Assessment Report</div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mb-5 text-xs">
        <Field label="Candidate Name" value={candidateName} />
        <Field label="Mobile" value={candidateMobile} />
        {candidateEmail && <Field label="Email" value={candidateEmail} />}
        <Field label="Date of Birth" value={dob ? `${dob}${age !== null ? ` (Age ${age})` : ""}` : "—"} />
        <Field label="District" value={district} />
        <Field label={taluk ? "Taluk" : "Assembly Constituency"} value={taluk || constituency || "—"} />
        <Field label="Panchayat / Area" value={panchayat || "—"} />
        <Field label="Pincode" value={pincode || "—"} />
        <Field label="NGO" value={ngo || "—"} />
        <Field label="Current TNV Role" value={currentRole || "—"} />
        <Field label="Category" value={categories?.length ? categories.join(", ") : "—"} />
        <Field label="Interview Date" value={interviewDate} />
        {interviewerName && <Field label="Interviewer" value={interviewerName} />}
      </div>

      <div className="text-center mb-5">
        <div className="text-4xl font-extrabold text-[#1a6b1a]">{finalScore.toFixed(1)}</div>
        <div className="text-xs text-gray-500">out of {tieBreaker ? "16.5" : "16"}</div>
        <div className="inline-block mt-2 px-4 py-1.5 rounded-full bg-[#f0f8f0] text-[#1a6b1a] text-sm font-bold">
          {role.icon} Auto-Suggested: {role.label}
        </div>
      </div>

      <div className="mb-5 border border-[#e2e6ed] rounded-lg overflow-hidden">
        <div className="px-3 py-2 bg-[#f9fafb] border-b border-[#e2e6ed] text-xs font-bold text-gray-600">
          Role Allocation — by Base Score
        </div>
        <table className="w-full text-xs">
          <tbody>
            {ROLE_ALLOCATION_TABLE.map((band) => {
              const active = baseScore >= band.min && baseScore <= band.max;
              return (
                <tr key={band.label} className={`border-b border-[#f0f2f6] last:border-b-0 ${active ? "bg-[#f0f8f0]" : ""}`}>
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

      <div className="mb-5">
        <div className="text-xs font-bold text-gray-600 mb-2">Question Scores</div>
        <div className="grid grid-cols-8 gap-1.5">
          {QUESTIONS.map((q, i) => {
            const s = scores[i];
            return (
              <div
                key={i}
                title={q.en}
                className={`rounded-lg p-1.5 text-center text-xs font-bold ${
                  s === 1 ? "bg-green-100 text-green-800" : s === 0.5 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                }`}
              >
                <div className="text-[9px] font-normal opacity-70">Q{i + 1}</div>
                {s === null || s === undefined ? "—" : s}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mb-4 text-xs">
        <Field label="Tie-Breaker Applied" value={tieBreaker ? "Yes (+0.5)" : "No"} />
        <Field label="Additional Suggested Role" value={additionalRole || "—"} />
        <Field label="Verification Status" value={verificationStatus || "Pending"} />
        <Field label="Final Decision" value={finalDecision || "—"} />
        <Field label="Assessor Signature / Name" value={assessorSignature || "—"} />
      </div>

      <div className="text-xs">
        <div className="font-bold text-gray-600 mb-1">Additional Notes</div>
        <div className="text-gray-800 whitespace-pre-line min-h-[1.5em]">{notes || "—"}</div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#e2e6ed] text-sm font-bold text-gray-800">
        Final Score: {finalScore.toFixed(1)} / {tieBreaker ? "16.5" : "16"}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1.5">
      <span className="font-semibold text-gray-500 whitespace-nowrap">{label}:</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}
