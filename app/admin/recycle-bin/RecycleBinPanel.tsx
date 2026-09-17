"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  restoreCandidate,
  bulkRestoreCandidates,
  restoreAllRecycleBin,
  permanentDeleteCandidate,
  bulkPermanentDeleteCandidates,
  emptyRecycleBin,
} from "../actions";

interface TrashedCandidate {
  id: number;
  serial_number: number;
  candidate_name: string;
  candidate_mobile: string;
  candidate_email: string | null;
  district: string;
  assembly_constituency: string;
  deleted_at: string | null;
  upload_batch_id: string | null;
}

function getDaysRemaining(deletedAt: string | null): number {
  if (!deletedAt) return 7;
  const deletedTime = new Date(deletedAt).getTime();
  const elapsedMs = Date.now() - deletedTime;
  const daysPassed = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  return Math.max(0, 7 - daysPassed);
}

export default function RecycleBinPanel({
  candidates,
  loadError,
}: {
  candidates: TrashedCandidate[];
  loadError?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const filtered = candidates.filter((c) => {
    if (!query) return true;
    const q = query.toLowerCase();
    const hay = `${c.candidate_name} ${c.candidate_mobile} ${c.candidate_email || ""} ${c.district} ${c.assembly_constituency}`.toLowerCase();
    return hay.includes(q);
  });

  const allFilteredSelected = filtered.length > 0 && filtered.every((c) => selectedIds.includes(c.id));

  function toggleSelectAll() {
    if (allFilteredSelected) {
      const filteredIds = new Set(filtered.map((c) => c.id));
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      const filteredIds = filtered.map((c) => c.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  }

  function toggleSelectOne(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleRestoreSingle(id: number, name: string) {
    startTransition(async () => {
      setMessage(null);
      const res = await restoreCandidate(id);
      if (res && "error" in res && res.error) {
        setMessage({ type: "error", text: res.error });
      } else {
        setSelectedIds((prev) => prev.filter((x) => x !== id));
        setMessage({ type: "success", text: `Candidate "${name}" restored successfully.` });
        router.refresh();
      }
    });
  }

  function handlePermanentDeleteSingle(id: number, name: string) {
    if (!confirm(`Are you sure you want to permanently delete candidate "${name}"? This action cannot be undone.`)) {
      return;
    }
    startTransition(async () => {
      setMessage(null);
      const res = await permanentDeleteCandidate(id);
      if (res && "error" in res && res.error) {
        setMessage({ type: "error", text: res.error });
      } else {
        setSelectedIds((prev) => prev.filter((x) => x !== id));
        setMessage({ type: "success", text: `Candidate "${name}" permanently deleted.` });
        router.refresh();
      }
    });
  }

  function handleRestoreSelected() {
    if (!selectedIds.length) return;
    startTransition(async () => {
      setMessage(null);
      const res = await bulkRestoreCandidates(selectedIds);
      if (res && "error" in res && res.error) {
        setMessage({ type: "error", text: res.error });
      } else {
        const count = selectedIds.length;
        setSelectedIds([]);
        setMessage({ type: "success", text: `Restored ${count} candidate(s) to active list.` });
        router.refresh();
      }
    });
  }

  function handlePermanentDeleteSelected() {
    if (!selectedIds.length) return;
    if (!confirm(`Permanently delete ${selectedIds.length} selected candidate(s)? This CANNOT be undone.`)) {
      return;
    }
    startTransition(async () => {
      setMessage(null);
      const res = await bulkPermanentDeleteCandidates(selectedIds);
      if (res && "error" in res && res.error) {
        setMessage({ type: "error", text: res.error });
      } else {
        const count = selectedIds.length;
        setSelectedIds([]);
        setMessage({ type: "success", text: `Permanently deleted ${count} candidate(s).` });
        router.refresh();
      }
    });
  }

  function handleRestoreAll() {
    if (!candidates.length) return;
    if (!confirm(`Restore all ${candidates.length} candidate(s) in the Recycle Bin?`)) return;
    startTransition(async () => {
      setMessage(null);
      const res = await restoreAllRecycleBin();
      if (res && "error" in res && res.error) {
        setMessage({ type: "error", text: res.error });
      } else {
        setSelectedIds([]);
        setMessage({ type: "success", text: `Restored all candidates from Recycle Bin.` });
        router.refresh();
      }
    });
  }

  function handleEmptyRecycleBin() {
    if (!candidates.length) return;
    if (!confirm(`EMPTY RECYCLE BIN: Permanently delete ALL ${candidates.length} candidate(s)? This CANNOT be undone.`)) {
      return;
    }
    startTransition(async () => {
      setMessage(null);
      const res = await emptyRecycleBin();
      if (res && "error" in res && res.error) {
        setMessage({ type: "error", text: res.error });
      } else {
        setSelectedIds([]);
        setMessage({ type: "success", text: `Recycle Bin emptied completely.` });
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="bg-white rounded-2xl border border-[#e2e6ed] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-gray-900">🗑️ Recycle Bin</h1>
            <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {candidates.length} candidate{candidates.length === 1 ? "" : "s"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            Items are safely retained for <strong>1 week (7 days)</strong>, after which they are automatically cleared.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {candidates.length > 0 && (
            <>
              <button
                onClick={handleRestoreAll}
                disabled={isPending}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                ↩ Restore All ({candidates.length})
              </button>
              <button
                onClick={handleEmptyRecycleBin}
                disabled={isPending}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                🔥 Empty Recycle Bin
              </button>
            </>
          )}
          <Link
            href="/admin"
            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
          >
            ← Back to Candidates
          </Link>
        </div>
      </div>

      {/* Action feedback */}
      {message && (
        <div
          className={`p-3.5 rounded-xl border text-sm flex items-center justify-between gap-2 ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-xs font-bold underline">
            Dismiss
          </button>
        </div>
      )}

      {loadError && (
        <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
          Failed to load recycle bin: {loadError}
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#e2e6ed] bg-[#fafbfc] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search in Recycle Bin…"
              className="w-full sm:w-64 rounded-lg border border-gray-300 px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-[#1a6b1a]"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-xs text-gray-500 hover:underline">
                Clear
              </button>
            )}
          </div>

          {/* Bulk selection actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs font-semibold text-gray-700">
                {selectedIds.length} selected
              </span>
              <button
                onClick={handleRestoreSelected}
                disabled={isPending}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                ↩ Restore Selected
              </button>
              <button
                onClick={handlePermanentDeleteSelected}
                disabled={isPending}
                className="px-3 py-1.5 bg-white border border-red-300 hover:bg-red-50 text-red-600 text-xs font-semibold rounded-lg shadow-sm"
              >
                🗑️ Manual Delete Selected
              </button>
            </div>
          )}
        </div>

        {/* Empty state */}
        {!filtered.length ? (
          <div className="py-16 text-center text-gray-500">
            <div className="text-4xl mb-2">🎉</div>
            <p className="font-semibold text-base text-gray-800">Recycle Bin is empty</p>
            <p className="text-xs text-gray-400 mt-1">
              {query ? "No items matched your search." : "No candidates have been moved to the trash."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-[#f4f6f8] text-gray-600 font-semibold border-b border-[#e2e6ed]">
                <tr>
                  <th className="p-3 w-10">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </th>
                  <th className="p-3">Candidate</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">District & AC</th>
                  <th className="p-3">Deleted Date</th>
                  <th className="p-3">Auto-Purge In</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f6]">
                {filtered.map((c) => {
                  const isChecked = selectedIds.includes(c.id);
                  const daysRemaining = getDaysRemaining(c.deleted_at);

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-gray-50 transition-colors ${isChecked ? "bg-emerald-50/40" : ""}`}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(c.id)}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-gray-900">{c.candidate_name}</div>
                        {c.candidate_email && <div className="text-[11px] text-gray-400">{c.candidate_email}</div>}
                      </td>
                      <td className="p-3 text-gray-700">{c.candidate_mobile}</td>
                      <td className="p-3">
                        <div className="text-gray-800">{c.district || "—"}</div>
                        <div className="text-[11px] text-gray-400">{c.assembly_constituency || "—"}</div>
                      </td>
                      <td className="p-3 text-gray-500">
                        {c.deleted_at ? new Date(c.deleted_at).toLocaleString() : "Recently"}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            daysRemaining <= 1
                              ? "bg-red-100 text-red-700"
                              : daysRemaining <= 3
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {daysRemaining === 0
                            ? "Expires today"
                            : daysRemaining === 1
                            ? "1 day left"
                            : `${daysRemaining} days left`}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleRestoreSingle(c.id, c.candidate_name)}
                            disabled={isPending}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded border border-emerald-200 transition-colors"
                          >
                            ↩ Restore
                          </button>
                          <button
                            onClick={() => handlePermanentDeleteSingle(c.id, c.candidate_name)}
                            disabled={isPending}
                            className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded border border-red-200 transition-colors"
                          >
                            🗑️ Delete Permanently
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
