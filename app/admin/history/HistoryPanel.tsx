"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { revokeUploadBatch } from "../actions";
import type { UploadBatch, ActivityLog } from "@/lib/supabase/types";

export default function HistoryPanel({
  batches,
  activities,
  profilesById,
  error,
}: {
  batches: UploadBatch[];
  activities: ActivityLog[];
  profilesById: Record<string, string>;
  error?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"uploads" | "logs">("uploads");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleRevoke(batch: UploadBatch) {
    if (
      !confirm(
        `Are you sure you want to revoke upload batch "${batch.filename}"?\n\nAll newly created candidates from this upload will be safely moved to the Recycle Bin.`
      )
    ) {
      return;
    }

    startTransition(async () => {
      setMessage(null);
      const res = await revokeUploadBatch(batch.id);
      if (res && "error" in res && res.error) {
        setMessage({ type: "error", text: res.error });
      } else if (res && "success" in res) {
        setMessage({
          type: "success",
          text: `Successfully revoked "${batch.filename}". ${res.count ?? 0} candidate(s) moved to the Recycle Bin.`,
        });
        router.refresh();
      }
    });
  }

  const filteredBatches = batches.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return b.filename.toLowerCase().includes(q) || b.id.toLowerCase().includes(q);
  });

  const filteredActivities = activities.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.action.toLowerCase().includes(q) || (a.details || "").toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#e2e6ed] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-gray-900">📜 Uploads & Activity History</h1>
            <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {batches.length} upload{batches.length === 1 ? "" : "s"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1.5">
            Audit history of all Excel uploads, candidate edits, and quick 1-click batch revoking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/recycle-bin"
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg border border-emerald-200 transition-colors"
          >
            🗑️ View Recycle Bin
          </Link>
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

      {error && (
        <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">
          Failed to load history data: {error}
        </div>
      )}

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm overflow-hidden">
        {/* Navigation tabs & Search bar */}
        <div className="p-4 border-b border-[#e2e6ed] bg-[#fafbfc] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex rounded-lg border border-gray-200 p-0.5 bg-gray-100 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("uploads")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === "uploads" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📥 Excel Upload Batches ({batches.length})
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === "logs" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📋 Audit Log ({activities.length})
            </button>
          </div>

          <div className="w-full sm:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter list…"
              className="w-full sm:w-64 rounded-lg border border-gray-300 px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-[#1a6b1a]"
            />
          </div>
        </div>

        {/* Tab 1: Upload Batches */}
        {activeTab === "uploads" && (
          <div>
            {!filteredBatches.length ? (
              <div className="py-16 text-center text-gray-400 text-sm">
                <div className="text-3xl mb-2">📁</div>
                <p className="font-semibold text-gray-700">No Excel uploads recorded yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Upload an Excel spreadsheet from the All Candidates page to track batches here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-[#f4f6f8] text-gray-600 font-semibold border-b border-[#e2e6ed]">
                    <tr>
                      <th className="p-3">File Name</th>
                      <th className="p-3">Uploaded At</th>
                      <th className="p-3">Uploaded By</th>
                      <th className="p-3">Records Created</th>
                      <th className="p-3">Records Updated</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f2f6]">
                    {filteredBatches.map((b) => {
                      const isRevoked = b.status === "revoked";
                      const uploaderName = b.uploaded_by ? profilesById[b.uploaded_by] || b.uploaded_by : "Admin";

                      return (
                        <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3 font-bold text-gray-900 flex items-center gap-2">
                            <span>📄</span>
                            <span>{b.filename}</span>
                          </td>
                          <td className="p-3 text-gray-500">
                            {b.uploaded_at ? new Date(b.uploaded_at).toLocaleString() : "—"}
                          </td>
                          <td className="p-3 text-gray-700">{uploaderName}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
                              +{b.created_rows} added
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">
                              ~{b.updated_rows} updated
                            </span>
                          </td>
                          <td className="p-3">
                            {isRevoked ? (
                              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
                                Revoked
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                                Active
                              </span>
                            )}
                            {b.revoked_at && (
                              <span className="text-[10px] text-gray-400 block mt-0.5">
                                at {new Date(b.revoked_at).toLocaleDateString()}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {!isRevoked ? (
                              <button
                                onClick={() => handleRevoke(b)}
                                disabled={isPending}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors flex items-center gap-1 ml-auto"
                              >
                                ↩ Revoke Upload
                              </button>
                            ) : (
                              <span className="text-gray-400 text-xs italic">Already revoked</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Audit Log */}
        {activeTab === "logs" && (
          <div>
            {!filteredActivities.length ? (
              <div className="py-16 text-center text-gray-400 text-sm">
                <div className="text-3xl mb-2">📜</div>
                <p className="font-semibold text-gray-700">No activity logged yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-[#f4f6f8] text-gray-600 font-semibold border-b border-[#e2e6ed]">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Details</th>
                      <th className="p-3">Performed By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f2f6]">
                    {filteredActivities.map((a) => {
                      const user = a.performed_by ? profilesById[a.performed_by] || a.performed_by : "System";
                      const actionBadge =
                        a.action === "upload_excel"
                          ? "bg-blue-100 text-blue-800"
                          : a.action === "revoke_upload"
                          ? "bg-red-100 text-red-800"
                          : a.action.includes("delete")
                          ? "bg-amber-100 text-amber-800"
                          : a.action.includes("restore")
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800";

                      return (
                        <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3 text-gray-500">{new Date(a.created_at).toLocaleString()}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-semibold ${actionBadge}`}>
                              {a.action}
                            </span>
                          </td>
                          <td className="p-3 text-gray-800">{a.details || "—"}</td>
                          <td className="p-3 text-gray-600 font-medium">{user}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
