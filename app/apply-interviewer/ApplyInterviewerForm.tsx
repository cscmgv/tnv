"use client";

import { useRef, useState } from "react";
import { DISTRICTS } from "@/lib/data/districts";
import {
  getTaluksForDistrict,
  getPanchayatsForTaluk,
  getDefaultPincodeForTaluk,
} from "@/lib/data/taluks";
import { CURRENT_TNV_ROLE_OPTIONS } from "@/lib/data/roles";
import { calculateAge } from "@/lib/age";
import { submitInterviewerApplication, type InterviewerApplicationInput } from "./actions";

const emptyForm: InterviewerApplicationInput = {
  full_name: "",
  mobile: "",
  email: "",
  dob: "",
  district: "",
  taluk: "",
  assembly_constituency: "",
  panchayat_area: "",
  pincode: "",
  ngo: "",
  current_tnv_role: "",
  password: "",
  confirm_password: "",
};

export default function ApplyInterviewerForm() {
  const [form, setForm] = useState<InterviewerApplicationInput>(emptyForm);
  const age = calculateAge(form.dob);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  function set<K extends keyof InterviewerApplicationInput>(key: K, value: InterviewerApplicationInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      const result = await submitInterviewerApplication(form);
      if (result.error || !("regNo" in result)) {
        setError(result.error || "Something went wrong submitting this form.");
        setPending(false);
        requestAnimationFrame(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
        return;
      }
      setDone(result.regNo ?? "");
    } catch {
      setError("Something went wrong submitting this form. Please check your connection and try again.");
      setPending(false);
      requestAnimationFrame(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
    }
  }

  if (done !== null) {
    return (
      <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">You&rsquo;re registered!</h2>
        {done && <p className="text-sm text-gray-500 mb-1">Your Registration Number is <strong>{done}</strong>.</p>}
        <p className="text-sm text-gray-500">
          You can log in now with your email and the password you just set. An admin will assign your candidate
          coverage shortly.
        </p>
        <a
          href="/login"
          className="inline-block mt-4 bg-[#1a6b1a] hover:bg-[#0f4a0f] text-white text-sm font-semibold rounded-lg px-6 py-2.5"
        >
          Go to Login →
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-6 pb-10">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Register as an Interviewer</h2>
      <p className="text-xs text-gray-500 mb-6">
        Fill in your details below and set a password. Once submitted, you can log in right away — an admin will
        then assign you the candidates you&rsquo;ll be covering.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p ref={errorRef} className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full Name *" value={form.full_name} onChange={(v) => set("full_name", v)} required />
          <Field label="Mobile Number *" value={form.mobile} onChange={(v) => set("mobile", v)} required />
          <Field label="Email *" type="email" value={form.email} onChange={(v) => set("email", v)} required />
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
                taluk: "",
                assembly_constituency: "",
                panchayat_area: "",
                pincode: "",
              }))
            }
          />
          <SelectField
            key={form.district}
            label="Taluk *"
            value={form.taluk || form.assembly_constituency || ""}
            options={getTaluksForDistrict(form.district)}
            required
            onChange={(v) => {
              const defaultPin = getDefaultPincodeForTaluk(form.district, v) || "";
              setForm((prev) => ({
                ...prev,
                taluk: v,
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
            {(() => {
              const currentTaluk = form.taluk || form.assembly_constituency || "";
              const panchayats = getPanchayatsForTaluk(form.district, currentTaluk);
              return (
                <>
                  <input
                    list="interviewer-panchayats-list"
                    type="text"
                    value={form.panchayat_area}
                    onChange={(e) => {
                      const val = e.target.value;
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
                      currentTaluk
                        ? "Select or type Panchayat / Area"
                        : "Select Taluk first"
                    }
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#1a6b1a]"
                  />
                  <datalist id="interviewer-panchayats-list">
                    {panchayats.map((p) => (
                      <option key={p.name} value={p.name}>
                        {p.name} (PIN: {p.pincode})
                      </option>
                    ))}
                  </datalist>
                  {panchayats.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5 items-center">
                      <span className="text-[11px] text-gray-400">Suggestions:</span>
                      {panchayats.slice(0, 5).map((p) => (
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
                </>
              );
            })()}
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

        <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-[#e2e6ed]">
          <Field
            label="Set Password *"
            type="password"
            value={form.password}
            onChange={(v) => set("password", v)}
            required
            minLength={8}
            placeholder="At least 8 characters"
          />
          <Field
            label="Confirm Password *"
            type="password"
            value={form.confirm_password}
            onChange={(v) => set("confirm_password", v)}
            required
            minLength={8}
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="bg-[#1a6b1a] hover:bg-[#0f4a0f] disabled:opacity-60 text-white text-sm font-semibold rounded-lg px-6 py-2.5"
        >
          {pending ? "Submitting…" : "Submit & Register"}
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
  minLength,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        placeholder={placeholder}
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
