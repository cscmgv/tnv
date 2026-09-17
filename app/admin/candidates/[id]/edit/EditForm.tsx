"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { QUESTIONS } from "@/lib/data/questions";
import { DISTRICTS } from "@/lib/data/districts";
import { constituenciesForDistrict } from "@/lib/data/constituencies";
import { getPanchayatsForConstituency, getDefaultPincodeForConstituency } from "@/lib/data/panchayats";
import { ADDITIONAL_ROLE_OPTIONS, CURRENT_TNV_ROLE_OPTIONS, getRoleFromScore, ROLE_ALLOCATION_TABLE } from "@/lib/data/roles";
import { calculateAge } from "@/lib/age";
import AssessmentReport from "@/app/components/AssessmentReport";
import type { Category } from "@/lib/supabase/types";
import { updateAssessment } from "../../../actions";

export default function EditForm({
  assessment,
  categories,
  selectedCategoryIds,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assessment: any;
  categories: Category[];
  selectedCategoryIds: number[];
}) {
  const router = useRouter();
  const c = assessment.candidates;
  const [tieBreaker, setTieBreaker] = useState(assessment.tie_breaker_applied ? "yes" : "no");
  const [district, setDistrict] = useState(c.district || "");
  const [constituency, setConstituency] = useState(c.assembly_constituency || "");
  const [panchayatArea, setPanchayatArea] = useState(c.panchayat_area || "");
  const [pincode, setPincode] = useState(c.pincode || "");
  const [dob, setDob] = useState(c.dob || "");
  const age = calculateAge(dob);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [scores, setScores] = useState<number[]>(QUESTIONS.map((_, i) => Number(assessment[`q${i + 1}_score`] ?? 0)));
  const [categoryIds, setCategoryIds] = useState<number[]>(selectedCategoryIds);
  const [additionalRole, setAdditionalRole] = useState(assessment.additional_suggested_role || "");
  const [verificationStatus, setVerificationStatus] = useState(assessment.verification_status || "Pending");
  const [finalDecision, setFinalDecision] = useState(assessment.final_decision || "");
  const [assessorSignature, setAssessorSignature] = useState(assessment.assessor_signature || "");
  const [notes, setNotes] = useState(assessment.additional_notes || "");

  function toggleCategory(id: number) {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  const baseScore = scores.reduce((a, b) => a + b, 0);
  const finalScore = baseScore + (tieBreaker === "yes" ? 0.5 : 0);
  const role = getRoleFromScore(finalScore);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError("");
    try {
      const result = await updateAssessment(assessment.id, c.id, formData, categoryIds);
      if (result?.error) {
        setError(result.error);
        setPending(false);
        requestAnimationFrame(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
        return;
      }
      router.push("/admin");
    } catch {
      setError("Something went wrong saving these changes. If the app was just updated, refresh the page and try again.");
      setPending(false);
      requestAnimationFrame(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
    }
  }

  return (
    <div
      id="results-printable"
      className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-6 pb-16 mb-16 print:border-0 print:shadow-none print:rounded-none"
    >
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #results-printable, #results-printable * { visibility: visible; }
          #results-printable { position: absolute; inset: 0; width: 100%; padding: 24px; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
      <h2 className="text-lg font-bold text-gray-900 mb-6 print:hidden">Edit Assessment — {c.candidate_name}</h2>
      <form action={handleSubmit} className="space-y-8 print:hidden">
        {error && (
          <p ref={errorRef} className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Candidate Name *" name="candidate_name" defaultValue={c.candidate_name} required />
          <Field label="Mobile *" name="candidate_mobile" defaultValue={c.candidate_mobile} required />
          <Field label="Email" name="candidate_email" defaultValue={c.candidate_email} type="email" />
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Date of Birth</label>
            <input
              name="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            {age !== null && <p className="text-xs text-gray-500 mt-1">Age: {age} years</p>}
          </div>
          <Field label="Interview Date *" name="interview_date" type="date" defaultValue={c.interview_date} required />
          <SelectField
            label="District *"
            name="district"
            defaultValue={c.district}
            options={DISTRICTS as unknown as string[]}
            required
            onValueChange={(v) => {
              setDistrict(v);
              setConstituency("");
              setPanchayatArea("");
              setPincode("");
            }}
          />
          <SelectField
            key={district}
            label="Assembly Constituency *"
            name="assembly_constituency"
            defaultValue={district === c.district ? constituency : ""}
            options={constituenciesForDistrict(district) as string[]}
            required
            onValueChange={(v) => {
              setConstituency(v);
              setPanchayatArea("");
              setPincode(getDefaultPincodeForConstituency(v) || "");
            }}
          />
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Panchayat / Area *
            </label>
            <input
              list="admin-edit-panchayats-list"
              name="panchayat_area"
              type="text"
              value={panchayatArea}
              onChange={(e) => {
                const val = e.target.value;
                setPanchayatArea(val);
                const panchayats = getPanchayatsForConstituency(constituency);
                const matched = panchayats.find(
                  (p) => p.name.toLowerCase() === val.toLowerCase().trim()
                );
                if (matched) {
                  setPincode(matched.pincode);
                }
              }}
              placeholder={
                constituency
                  ? "Select or type Panchayat / Area"
                  : "Select Constituency first"
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#1a6b1a]"
            />
            <datalist id="admin-edit-panchayats-list">
              {getPanchayatsForConstituency(constituency).map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} (PIN: {p.pincode})
                </option>
              ))}
            </datalist>
            {getPanchayatsForConstituency(constituency).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5 items-center">
                <span className="text-[11px] text-gray-400">Suggestions:</span>
                {getPanchayatsForConstituency(constituency)
                  .slice(0, 4)
                  .map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setPanchayatArea(p.name);
                        setPincode(p.pincode);
                      }}
                      className="text-[11px] bg-gray-100 hover:bg-[#eaf5ea] hover:text-[#1a6b1a] text-gray-700 rounded px-2 py-0.5 transition border border-gray-200"
                    >
                      {p.name} ({p.pincode})
                    </button>
                  ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Pincode {pincode && <span className="text-[11px] font-normal text-[#1a6b1a]">(Auto-fetched)</span>}
            </label>
            <input
              name="pincode"
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="e.g. 600001"
              maxLength={6}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#1a6b1a]"
            />
          </div>
          <Field label="NGO" name="ngo" defaultValue={c.ngo} />
          <SelectField
            label="Current TNV Role"
            name="current_tnv_role"
            defaultValue={c.current_tnv_role}
            options={CURRENT_TNV_ROLE_OPTIONS as unknown as string[]}
          />
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Categories</label>
            <div className="flex flex-wrap gap-3 border border-gray-300 rounded-lg px-3 py-2">
              {categories.length === 0 && <span className="text-xs text-gray-400">No categories yet.</span>}
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-1.5 text-xs cursor-pointer">
                  <input type="checkbox" checked={categoryIds.includes(cat.id)} onChange={() => toggleCategory(cat.id)} />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center bg-[#f9fafb] border border-[#e2e6ed] rounded-2xl p-6">
          <div className="text-4xl font-extrabold text-[#1a6b1a]">{finalScore.toFixed(1)}</div>
          <div className="text-xs text-gray-500">out of {tieBreaker === "yes" ? "16.5" : "16"}</div>
          <div className="inline-block mt-3 px-4 py-1.5 rounded-full bg-[#f0f8f0] text-[#1a6b1a] text-sm font-bold">
            {role.icon} Auto-Suggested: {role.label}
          </div>
          <div className="mt-4 border border-[#e2e6ed] rounded-lg overflow-hidden text-left">
            <div className="px-3 py-2 bg-white border-b border-[#e2e6ed] text-xs font-bold text-gray-600">
              Role Allocation — by Base Score
            </div>
            <table className="w-full text-xs bg-white">
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
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-800">Question Scores</h3>
          {QUESTIONS.map((q, i) => {
            return (
              <div key={i} className="p-3.5 border border-[#e2e6ed] rounded-lg bg-[#f9fafb]">
                <p className="text-sm font-semibold text-gray-900">
                  Q{i + 1}: {q.en}
                </p>
                <p className="text-xs text-gray-500 mt-1">{q.ta}</p>
                <div className="flex gap-5 mt-2">
                  {[0, 0.5, 1].map((val) => (
                    <label key={val} className="flex items-center gap-1.5 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name={`q${i + 1}_score`}
                        value={val}
                        checked={scores[i] === val}
                        onChange={() => setScores((prev) => prev.map((s, idx) => (idx === i ? val : s)))}
                      />
                      {val} {val === 0 ? "(Inadequate)" : val === 0.5 ? "(Partial)" : "(Clear)"}
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-sm font-bold text-gray-800">
          Final Score: {finalScore.toFixed(1)} / {tieBreaker === "yes" ? "16.5" : "16"}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Tie-Breaker Applied</label>
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  name="tie_breaker_applied"
                  value="yes"
                  checked={tieBreaker === "yes"}
                  onChange={() => setTieBreaker("yes")}
                />
                Yes (+0.5)
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="radio"
                  name="tie_breaker_applied"
                  value="no"
                  checked={tieBreaker === "no"}
                  onChange={() => setTieBreaker("no")}
                />
                No
              </label>
            </div>
          </div>
          <SelectField
            label="Additional Suggested Role"
            name="additional_suggested_role"
            defaultValue={assessment.additional_suggested_role}
            options={ADDITIONAL_ROLE_OPTIONS as unknown as string[]}
            onValueChange={setAdditionalRole}
          />
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Verification Status</label>
            <select
              name="verification_status"
              value={verificationStatus}
              onChange={(e) => setVerificationStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Final Decision</label>
            <select
              name="final_decision"
              value={finalDecision}
              onChange={(e) => setFinalDecision(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">—</option>
              <option>Recommended</option>
              <option>Hold</option>
              <option>Not Recommended</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Assessor Signature / Name</label>
            <input
              name="assessor_signature"
              value={assessorSignature}
              onChange={(e) => setAssessorSignature(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Additional Notes</label>
          <textarea
            name="additional_notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-3 flex-wrap print:hidden">
          <button
            type="submit"
            disabled={pending}
            className="bg-[#1a6b1a] hover:bg-[#0f4a0f] disabled:opacity-60 text-white text-sm font-semibold rounded-lg px-6 py-2.5"
          >
            {pending ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-white border border-[#1a6b1a] text-[#1a6b1a] hover:bg-[#f0f8f0] font-semibold rounded-lg px-6 py-2.5 text-sm"
          >
            Download PDF
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg px-6 py-2.5"
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="hidden print:block">
        <AssessmentReport
          candidateName={c.candidate_name}
          candidateMobile={c.candidate_mobile}
          candidateEmail={c.candidate_email}
          district={district || c.district}
          constituency={c.assembly_constituency}
          panchayat={c.panchayat_area}
          pincode={c.pincode}
          ngo={c.ngo}
          dob={dob}
          currentRole={c.current_tnv_role}
          categories={categories.filter((cat) => categoryIds.includes(cat.id)).map((cat) => cat.name)}
          interviewDate={c.interview_date}
          scores={scores}
          tieBreaker={tieBreaker === "yes"}
          additionalRole={additionalRole}
          finalDecision={finalDecision}
          verificationStatus={verificationStatus}
          assessorSignature={assessorSignature}
          notes={notes}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue || ""}
        required={required}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
    </div>
  );
}

const OTHER = "__other__";

function SelectField({
  label,
  name,
  defaultValue,
  options,
  required,
  onValueChange,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: string[];
  required?: boolean;
  onValueChange?: (v: string) => void;
}) {
  const initialIsOther = !!defaultValue && !options.includes(defaultValue);
  const [choice, setChoice] = useState(initialIsOther ? OTHER : defaultValue || "");
  const [customValue, setCustomValue] = useState(initialIsOther ? defaultValue || "" : "");
  const isOther = choice === OTHER;

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <select
        value={choice}
        onChange={(e) => {
          setChoice(e.target.value);
          onValueChange?.(e.target.value === OTHER ? customValue : e.target.value);
        }}
        required={required && !isOther}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      >
        <option value="">— Select —</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
        <option value={OTHER}>Others (type manually)</option>
      </select>
      {isOther && (
        <input
          name={name}
          value={customValue}
          onChange={(e) => {
            setCustomValue(e.target.value);
            onValueChange?.(e.target.value);
          }}
          required={required}
          placeholder={`Enter ${label.replace(" *", "")}`}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm mt-1.5"
        />
      )}
      {!isOther && <input type="hidden" name={name} value={choice} />}
    </div>
  );
}
