"use client";

import { useRef, useState } from "react";
import { DISTRICTS } from "@/lib/data/districts";
import { constituenciesForDistrict } from "@/lib/data/constituencies";
import { getPanchayatsForConstituency, getDefaultPincodeForConstituency } from "@/lib/data/panchayats";
import { CURRENT_TNV_ROLE_OPTIONS } from "@/lib/data/roles";
import { calculateAge } from "@/lib/age";
import { submitCandidateApplication, type ApplicationInput } from "./actions";

const emptyForm: ApplicationInput = {
  candidate_name: "",
  candidate_mobile: "",
  candidate_email: "",
  dob: "",
  district: "",
  assembly_constituency: "",
  panchayat_area: "",
  pincode: "",
  ngo: "",
  current_tnv_role: "",
};

export default function ApplyForm({
  referrerId,
  categoryId,
  categoryName,
}: {
  referrerId: string | null;
  categoryId: number | null;
  categoryName: string | null;
}) {
  const [form, setForm] = useState<ApplicationInput>(emptyForm);
  const age = calculateAge(form.dob);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const errorRef = useRef<HTMLParagraphElement>(null);

  function set<K extends keyof ApplicationInput>(key: K, value: ApplicationInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      const result = await submitCandidateApplication(form, referrerId, categoryId);
      if (result?.error) {
        setError(result.error);
        setPending(false);
        requestAnimationFrame(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong submitting this form. Please check your connection and try again.");
      setPending(false);
      requestAnimationFrame(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
    }
  }

  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Thanks for filling the form!</h2>
        <p className="text-sm text-gray-500">Our team will contact you shortly to schedule your interview.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-6 pb-10">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Register as a Candidate</h2>
      <p className="text-xs text-gray-500 mb-3">
        Fill in your details below. Once submitted, a TNV interviewer will contact you to schedule your leadership
        interview.
      </p>
      {categoryName && (
        <p className="text-xs text-[#1a6b1a] bg-[#f0f8f0] border border-[#1a6b1a33] rounded-lg px-3 py-2 mb-6">
          You&rsquo;re registering under <strong>{categoryName}</strong>.
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p ref={errorRef} className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full Name *" value={form.candidate_name} onChange={(v) => set("candidate_name", v)} required />
          <Field label="Mobile Number *" value={form.candidate_mobile} onChange={(v) => set("candidate_mobile", v)} required />
          <Field label="Email" type="email" value={form.candidate_email} onChange={(v) => set("candidate_email", v)} />
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Date of Birth</label>
            <input
              type="date"
              value={form.dob}
              onChange={(e) => set("dob", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            {age !== null && <p className="text-xs text-gray-500 mt-1">Age: {age} years</p>}
          </div>
          <SelectField
            label="District *"
            value={form.district}
            options={DISTRICTS as unknown as string[]}
            required
            onChange={(v) =>
              setForm((prev) => ({
                ...prev,
                district: v,
                assembly_constituency: "",
                panchayat_area: "",
                pincode: "",
              }))
            }
          />
          <SelectField
            key={form.district}
            label="Assembly Constituency *"
            value={form.assembly_constituency}
            options={constituenciesForDistrict(form.district) as string[]}
            required
            onChange={(v) => {
              const defaultPin = getDefaultPincodeForConstituency(v) || "";
              setForm((prev) => ({
                ...prev,
                assembly_constituency: v,
                panchayat_area: "",
                pincode: defaultPin,
              }));
            }}
          />
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Panchayat / Area *
            </label>
            <input
              list="apply-panchayats-list"
              type="text"
              value={form.panchayat_area}
              onChange={(e) => {
                const val = e.target.value;
                const panchayats = getPanchayatsForConstituency(form.assembly_constituency);
                const matched = panchayats.find(
                  (p) => p.name.toLowerCase() === val.toLowerCase().trim()
                );
                setForm((prev) => ({
                  ...prev,
                  panchayat_area: val,
                  ...(matched ? { pincode: matched.pincode } : {}),
                }));
              }}
              placeholder={
                form.assembly_constituency
                  ? "Select or type Panchayat / Area"
                  : "Select Constituency first"
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#1a6b1a]"
            />
            <datalist id="apply-panchayats-list">
              {getPanchayatsForConstituency(form.assembly_constituency).map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} (PIN: {p.pincode})
                </option>
              ))}
            </datalist>
            {getPanchayatsForConstituency(form.assembly_constituency).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5 items-center">
                <span className="text-[11px] text-gray-400">Suggestions:</span>
                {getPanchayatsForConstituency(form.assembly_constituency)
                  .slice(0, 4)
                  .map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          panchayat_area: p.name,
                          pincode: p.pincode,
                        }))
                      }
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
              Pincode {form.pincode && <span className="text-[11px] font-normal text-[#1a6b1a]">(Auto-fetched)</span>}
            </label>
            <input
              type="text"
              value={form.pincode}
              onChange={(e) => set("pincode", e.target.value)}
              placeholder="e.g. 600001"
              maxLength={6}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#1a6b1a]"
            />
          </div>
          <Field label="NGO (if any)" value={form.ngo} onChange={(v) => set("ngo", v)} />
          <SelectField
            label="Current TNV Role"
            value={form.current_tnv_role}
            options={CURRENT_TNV_ROLE_OPTIONS as unknown as string[]}
            onChange={(v) => set("current_tnv_role", v)}
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="bg-[#1a6b1a] hover:bg-[#0f4a0f] disabled:opacity-60 text-white text-sm font-semibold rounded-lg px-6 py-2.5"
        >
          {pending ? "Submitting…" : "Submit Application"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
    </div>
  );
}

const OTHER = "__other__";

function SelectField({
  label,
  value,
  options,
  required,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  required?: boolean;
  onChange: (v: string) => void;
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
        required={required && !customMode}
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
      {customMode && (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={`Enter ${label.replace(" *", "")}`}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm mt-1.5"
        />
      )}
    </div>
  );
}
