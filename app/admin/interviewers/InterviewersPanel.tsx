"use client";

import { useState, useTransition } from "react";
import type { Category, InterviewerCoverageRule, InterviewerSummaryRow, Profile } from "@/lib/supabase/types";
import { DISTRICTS } from "@/lib/data/districts";
import { constituenciesForDistrict } from "@/lib/data/constituencies";
import { deleteInterviewer, resendInterviewerInvite, toggleInterviewerAccess, saveInterviewerCoverage } from "../actions";

// A rule being edited in the UI — draft.district === "" means "all
// districts" (and constituency is then meaningless); draft.constituency ===
// "" means "all constituencies" within that district.
type RuleDraft = { category_id: number; district: string; constituency: string };

const ALL = "";

export default function InterviewersPanel({
  interviewers,
  summary,
  categories,
  coverage,
}: {
  interviewers: Profile[];
  summary: InterviewerSummaryRow[];
  categories: Category[];
  coverage: InterviewerCoverageRule[];
}) {
  const [linkCopied, setLinkCopied] = useState(false);
  // Deliberately NOT window.location.origin — this link is meant to be
  // shared with real interviewers, so it should always point at the
  // deployed site even when an admin generates it from a local dev server.
  const applyLink = `${process.env.NEXT_PUBLIC_APP_URL || "https://tnv-selection-next.tnvinterview.workers.dev"}/apply-interviewer`;
  const [resendMsg, setResendMsg] = useState<{ id: string; text: string; isError: boolean } | null>(null);
  const [openMenuRow, setOpenMenuRow] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [rules, setRules] = useState<RuleDraft[]>([]);
  const [newCategoryId, setNewCategoryId] = useState("");
  const [coverageError, setCoverageError] = useState("");

  const coverageByInterviewer = new Map<string, InterviewerCoverageRule[]>();
  coverage.forEach((r) => {
    const list = coverageByInterviewer.get(r.interviewer_id) || [];
    list.push(r);
    coverageByInterviewer.set(r.interviewer_id, list);
  });

  function openCoverageEditor(iv: Profile) {
    setEditingId(iv.id);
    setRules(
      (coverageByInterviewer.get(iv.id) || []).map((r) => ({
        category_id: r.category_id,
        district: r.district ?? ALL,
        constituency: r.constituency ?? ALL,
      }))
    );
    setNewCategoryId("");
    setCoverageError("");
  }

  function addRule() {
    if (!newCategoryId) return;
    setRules((prev) => [...prev, { category_id: Number(newCategoryId), district: ALL, constituency: ALL }]);
    setNewCategoryId("");
  }

  function removeRule(i: number) {
    setRules((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateRule(i: number, patch: Partial<RuleDraft>) {
    setRules((prev) =>
      prev.map((r, idx) => {
        if (idx !== i) return r;
        const next = { ...r, ...patch };
        // Changing district resets constituency — a constituency picked
        // under the old district wouldn't necessarily exist under the new
        // one, and "all constituencies" is the safe default either way.
        if (patch.district !== undefined) next.constituency = ALL;
        return next;
      })
    );
  }

  function saveCoverage() {
    if (!editingId) return;
    const id = editingId;
    setCoverageError("");
    startTransition(async () => {
      let result: { error?: string };
      try {
        result = await saveInterviewerCoverage(
          id,
          rules.map((r) => ({
            category_id: r.category_id,
            district: r.district || null,
            constituency: r.constituency || null,
          }))
        );
      } catch {
        setCoverageError("Something went wrong saving coverage. If the app was just updated, refresh the page and try again.");
        return;
      }
      if (result?.error) {
        setCoverageError(result.error);
        return;
      }
      setEditingId(null);
    });
  }

  async function copyApplyLink() {
    try {
      await navigator.clipboard.writeText(applyLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // clipboard API unavailable — the link is still visible to copy manually
    }
  }

  function handleResend(id: string) {
    setResendMsg(null);
    startTransition(async () => {
      const result = await resendInterviewerInvite(id);
      if (result?.error) setResendMsg({ id, text: result.error, isError: true });
      else setResendMsg({ id, text: "A new setup link has been emailed.", isError: false });
    });
  }

  const summaryByEmail = new Map(summary.map((s) => [s.id, s]));
  const editingInterviewer = interviewers.find((iv) => iv.id === editingId) || null;
  const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <div className="space-y-6 pb-16">
      <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-6">
        <h2 className="text-sm font-bold text-gray-900 mb-1">Interviewer Registration Link</h2>
        <p className="text-xs text-gray-500 mb-4">
          Share this link with anyone who should become an interviewer. They fill in their own details and set a
          password — no invite email needed. They&rsquo;ll show up below the moment they submit it, and you can then
          assign their candidate coverage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="flex-1 w-full">
            <input
              readOnly
              value={applyLink}
              onFocus={(e) => e.currentTarget.select()}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:border-[#1a6b1a]"
            />
          </div>
          <button
            type="button"
            onClick={copyApplyLink}
            className="bg-[#1a6b1a] hover:bg-[#0f4a0f] text-white text-sm font-semibold rounded-lg px-5 py-2.5 whitespace-nowrap"
          >
            {linkCopied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#e2e6ed]">
          <h2 className="text-sm font-bold text-gray-900">Registered Interviewers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-[#e2e6ed]">
                <th className="p-3">Reg No</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">Home District</th>
                <th className="p-3">Coverage</th>
                <th className="p-3">Assessed</th>
                <th className="p-3">Avg Score</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {interviewers.map((iv) => {
                const s = summaryByEmail.get(iv.id);
                const ivRules = coverageByInterviewer.get(iv.id) || [];
                return (
                  <tr key={iv.id} className="border-b border-[#f0f2f6] hover:bg-gray-50">
                    <td className="p-3 font-bold text-[#1a6b1a]">{iv.reg_no}</td>
                    <td className="p-3 font-semibold">
                      {iv.profile_completed ? iv.full_name : <span className="italic text-gray-400">Pending setup</span>}
                    </td>
                    <td className="p-3">{iv.email || "—"}</td>
                    <td className="p-3">{iv.phone || "—"}</td>
                    <td className="p-3">
                      {iv.district ? (
                        <>
                          {iv.district}
                          {iv.assembly_constituency && <span className="text-gray-400"> › {iv.assembly_constituency}</span>}
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-3 max-w-65">
                      <button onClick={() => openCoverageEditor(iv)} className="text-left">
                        {ivRules.length ? (
                          <div className="space-y-1">
                            {ivRules.slice(0, 3).map((r) => (
                              <div key={r.id} className="text-[11px] text-gray-700">
                                <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold">
                                  {categoryNameById.get(r.category_id) || "?"}
                                </span>{" "}
                                <span className="text-gray-500">
                                  {r.district || "All districts"}
                                  {r.district ? ` › ${r.constituency || "all constituencies"}` : ""}
                                </span>
                              </div>
                            ))}
                            {ivRules.length > 3 && <span className="text-[10px] text-gray-400">+{ivRules.length - 3} more rule(s)</span>}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic hover:text-[#1a6b1a]">None — click to assign</span>
                        )}
                      </button>
                    </td>
                    <td className="p-3 font-bold text-[#1a6b1a]">{s?.candidates_assessed ?? 0}</td>
                    <td className="p-3 font-bold">{s?.avg_candidate_score ?? "—"}</td>
                    <td className="p-3">
                      {!iv.profile_completed ? (
                        <span className="text-amber-700 font-bold">⏳ Invite Sent</span>
                      ) : (
                        <span className={iv.is_active ? "text-green-700 font-bold" : "text-red-700 font-bold"}>
                          {iv.is_active ? "✅ Active" : "🚫 Revoked"}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setOpenMenuRow(openMenuRow === iv.id ? null : iv.id)}
                          className="px-2.5 py-1.5 rounded text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
                        >
                          •••
                        </button>
                        {openMenuRow === iv.id && (
                          <div className="absolute right-0 top-8 z-10 bg-white border border-[#e2e6ed] rounded-lg shadow-lg py-1 w-44 text-xs">
                            {!iv.profile_completed && (
                              <button
                                disabled={isPending}
                                onClick={() => {
                                  setOpenMenuRow(null);
                                  if (confirm(`Send a new invite link to ${iv.email}?`)) handleResend(iv.id);
                                }}
                                className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-sky-700 font-semibold"
                              >
                                Resend Invite
                              </button>
                            )}
                            <button
                              disabled={isPending}
                              onClick={() => {
                                setOpenMenuRow(null);
                                startTransition(() => toggleInterviewerAccess(iv.id, iv.is_active));
                              }}
                              className={`block w-full text-left px-3 py-2 hover:bg-gray-50 font-semibold ${
                                iv.is_active ? "text-amber-700" : "text-green-700"
                              }`}
                            >
                              {iv.is_active ? "Revoke" : "Grant"}
                            </button>
                            <button
                              disabled={isPending}
                              onClick={() => {
                                setOpenMenuRow(null);
                                if (confirm("Delete this interviewer? They will no longer be able to log in.")) {
                                  startTransition(() => deleteInterviewer(iv.id));
                                }
                              }}
                              className="block w-full text-left px-3 py-2 hover:bg-red-50 text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                      {resendMsg?.id === iv.id && (
                        <p className={`text-xs mt-1.5 ${resendMsg.isError ? "text-red-600" : "text-green-700"}`}>
                          {resendMsg.text}
                        </p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!interviewers.length && (
            <div className="text-center text-gray-400 py-12 text-sm">No interviewers registered yet.</div>
          )}
        </div>
      </div>

      {editingInterviewer && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setEditingId(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6"
          >
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              Assign Coverage — {editingInterviewer.profile_completed ? editingInterviewer.full_name : editingInterviewer.reg_no}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Grant visibility one category at a time. Within a category, cover all districts or just specific ones —
              and within a district, all constituencies or just specific ones. Only candidates in these categories, in
              this scope, will be visible to this interviewer.
            </p>
            {coverageError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{coverageError}</p>
            )}

            <div className="space-y-3">
              {rules.map((rule, i) => (
                <RuleEditor
                  key={i}
                  rule={rule}
                  categoryName={categoryNameById.get(rule.category_id) || "?"}
                  onChange={(patch) => updateRule(i, patch)}
                  onRemove={() => removeRule(i)}
                />
              ))}
              {!rules.length && <p className="text-xs text-gray-400 italic">No coverage rules yet — add one below.</p>}
            </div>

            <div className="flex items-end gap-2 mt-4 pt-4 border-t border-[#e2e6ed]">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Add a category</label>
                <select
                  value={newCategoryId}
                  onChange={(e) => setNewCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">— Select category —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={addRule}
                disabled={!newCategoryId}
                className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 text-sm font-semibold rounded-lg px-4 py-2"
              >
                + Add
              </button>
            </div>
            {!categories.length && <p className="text-xs text-gray-400 italic mt-2">No categories created yet.</p>}

            <div className="flex gap-3 mt-5">
              <button
                disabled={isPending}
                onClick={saveCoverage}
                className="bg-[#1a6b1a] hover:bg-[#0f4a0f] disabled:opacity-60 text-white text-sm font-semibold rounded-lg px-5 py-2"
              >
                {isPending ? "Saving…" : "Save Coverage"}
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg px-5 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// One coverage rule's editor row: category name (fixed once added), then a
// district dropdown ("All districts" or one specific district), then —
// only when a specific district is chosen — a constituency dropdown ("All
// constituencies" or one specific constituency within that district).
function RuleEditor({
  rule,
  categoryName,
  onChange,
  onRemove,
}: {
  rule: RuleDraft;
  categoryName: string;
  onChange: (patch: Partial<RuleDraft>) => void;
  onRemove: () => void;
}) {
  const constituencyOptions = rule.district ? constituenciesForDistrict(rule.district) : [];
  return (
    <div className="border border-[#e2e6ed] rounded-lg p-3 flex flex-wrap items-end gap-3">
      <div>
        <span className="block text-xs font-semibold text-gray-600 mb-1">Category</span>
        <span className="inline-block px-2.5 py-2 rounded-lg bg-purple-50 text-purple-700 text-sm font-semibold">{categoryName}</span>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">District</label>
        <select
          value={rule.district}
          onChange={(e) => onChange({ district: e.target.value })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value={ALL}>All districts</option>
          {DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
      {rule.district && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Constituency</label>
          <select
            value={rule.constituency}
            onChange={(e) => onChange({ constituency: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value={ALL}>All constituencies</option>
            {constituencyOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="ml-auto text-xs font-semibold text-red-600 hover:underline px-2 py-2"
      >
        Remove
      </button>
    </div>
  );
}
