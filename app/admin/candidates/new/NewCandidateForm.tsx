"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { QUESTIONS } from "@/lib/data/questions";
import { DISTRICTS } from "@/lib/data/districts";
import { constituenciesForDistrict } from "@/lib/data/constituencies";
import { getPanchayatsForConstituency, getDefaultPincodeForConstituency } from "@/lib/data/panchayats";
import { ADDITIONAL_ROLE_OPTIONS, CURRENT_TNV_ROLE_OPTIONS } from "@/lib/data/roles";
import { calculateAge } from "@/lib/age";
import type { Category } from "@/lib/supabase/types";
import { createCandidate } from "../../actions";

export default function NewCandidateForm({ categories, defaultCategoryId = "" }: { categories: Category[]; defaultCategoryId?: string }) {
  const router = useRouter();
  const [tieBreaker, setTieBreaker] = useState("no");
  const [interviewCompleted, setInterviewCompleted] = useState("yes");
  const [dob, setDob] = useState("");
  const age = calculateAge(dob);
  const [district, setDistrict] = useState("");
  const [constituency, setConstituency] = useState("");
  const [panchayatArea, setPanchayatArea] = useState("");
  const [pincode, setPincode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const errorRef = useRef<HTMLParagraphElement>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError("");
    try {
      const result = await createCandidate(formData);
      if (result?.error) {
        setError(result.error);
        setPending(false);
        requestAnimationFrame(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
        return;
      }
      router.push(defaultCategoryId ? `/admin/categories/${defaultCategoryId}` : "/admin");
    } catch {
      setError("Something went wrong saving this candidate. If the app was just updated, refresh the page (the save was not lost — nothing was created) and try again.");
      setPending(false);
      requestAnimationFrame(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-6 pb-16 mb-16">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Add Candidate</h2>
      <form action={handleSubmit} className="space-y-8">
        {error && (
          <p ref={errorRef} className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Candidate Name *" name="candidate_name" required />
          <Field label="Mobile *" name="candidate_mobile" required />
          <Field label="Email" name="candidate_email" type="email" />
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
          <SelectField
            label="District *"
            name="district"
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
              list="admin-new-panchayats-list"
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
            <datalist id="admin-new-panchayats-list">
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
          <Field label="NGO" name="ngo" />
          <SelectField label="Current TNV Role" name="current_tnv_role" options={CURRENT_TNV_ROLE_OPTIONS as unknown as string[]} />
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
            <select name="category_id" defaultValue={defaultCategoryId} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border border-[#e2e6ed] rounded-lg p-3.5 bg-[#f9fafb]">
          <label className="block text-xs font-semibold text-gray-600 mb-2">Interview Status</label>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-1.5">
              <input
                type="radio"
                name="interview_completed"
                value="yes"
                checked={interviewCompleted === "yes"}
                onChange={() => setInterviewCompleted("yes")}
              />
              Interview Completed
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="radio"
                name="interview_completed"
                value="no"
                checked={interviewCompleted === "no"}
                onChange={() => setInterviewCompleted("no")}
              />
              Not Yet Interviewed
            </label>
          </div>
          {interviewCompleted === "no" && (
            <p className="text-xs text-gray-500 mt-2">
              Candidate will be saved without scores. Complete the interview later from Admin → Categories (if
              tagged) or the candidate&rsquo;s record.
            </p>
          )}
        </div>

        {interviewCompleted === "yes" && (
          <>
            <Field label="Interview Date *" name="interview_date" type="date" required />

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-800">Question Scores</h3>
              {QUESTIONS.map((q, i) => (
                <div key={i} className="p-3.5 border border-[#e2e6ed] rounded-lg bg-[#f9fafb]">
                  <p className="text-sm font-semibold text-gray-900">
                    Q{i + 1}: {q.en}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{q.ta}</p>
                  <div className="flex gap-5 mt-2">
                    {[0, 0.5, 1].map((val) => (
                      <label key={val} className="flex items-center gap-1.5 text-xs cursor-pointer">
                        <input type="radio" name={`q${i + 1}_score`} value={val} defaultChecked={val === 0} />
                        {val} {val === 0 ? "(Inadequate)" : val === 0.5 ? "(Partial)" : "(Clear)"}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
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
              <SelectField label="Additional Suggested Role" name="additional_suggested_role" options={ADDITIONAL_ROLE_OPTIONS as unknown as string[]} />
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Verification Status</label>
                <select name="verification_status" defaultValue="Pending" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  <option>Pending</option>
                  <option>Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Final Decision</label>
                <select name="final_decision" defaultValue="" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  <option value="">—</option>
                  <option>Recommended</option>
                  <option>Hold</option>
                  <option>Not Recommended</option>
                </select>
              </div>
              <Field label="Assessor Signature / Name" name="assessor_signature" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Additional Notes</label>
              <textarea name="additional_notes" rows={3} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
            </div>
          </>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="bg-[#1a6b1a] hover:bg-[#0f4a0f] disabled:opacity-60 text-white text-sm font-semibold rounded-lg px-6 py-2.5"
          >
            {pending ? "Saving…" : "Add Candidate"}
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
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <input
        name={name}
        type={type}
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
  options,
  required,
  onValueChange,
}: {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
  onValueChange?: (v: string) => void;
}) {
  const [choice, setChoice] = useState("");
  const [customValue, setCustomValue] = useState("");
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
