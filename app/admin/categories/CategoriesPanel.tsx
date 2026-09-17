"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { Category } from "@/lib/supabase/types";
import { createCategory, updateCategory, deleteCategory } from "../actions";

const COLORS = ["#1a6b1a", "#6366f1", "#c8a000", "#f97316", "#0891b2", "#d946ef"];

export default function CategoriesPanel({
  categories,
  counts,
}: {
  categories: Category[];
  counts: Record<number, number>;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleCreate(formData: FormData) {
    setError("");
    const result = await createCategory(formData);
    if (result?.error) setError(result.error);
    else setShowAdd(false);
  }

  async function handleUpdate(id: number, formData: FormData) {
    setError("");
    const result = await updateCategory(id, formData);
    if (result?.error) setError(result.error);
    else setEditingId(null);
  }

  function handleDelete(id: number, name: string) {
    if (!confirm(`Delete category "${name}"? Candidates tagged with it will become uncategorised.`)) return;
    startTransition(() => deleteCategory(id));
  }

  return (
    <div className="pb-16">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Categories</h2>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="bg-[#1a6b1a] hover:bg-[#0f4a0f] text-white text-sm font-semibold rounded-lg px-4 py-2"
        >
          {showAdd ? "Cancel" : "+ Add Category"}
        </button>
      </div>

      {showAdd && (
        <form
          action={handleCreate}
          className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-4 mb-5 flex items-end gap-3"
        >
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Category Name *</label>
            <input
              name="name"
              required
              autoFocus
              placeholder="e.g. Panai"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-[#1a6b1a] hover:bg-[#0f4a0f] text-white text-sm font-semibold rounded-lg px-5 py-2.5"
          >
            Save
          </button>
        </form>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">{error}</p>
      )}

      {!categories.length ? (
        <div className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-16 text-center text-gray-400">
          No categories yet. Click &ldquo;+ Add Category&rdquo; to create one (e.g. Panai, DrugFreeTN).
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => {
            const color = COLORS[i % COLORS.length];
            const isEditing = editingId === cat.id;
            return (
              <div key={cat.id} className="bg-white rounded-2xl border border-[#e2e6ed] shadow-sm p-5">
                {isEditing ? (
                  <form action={(fd) => handleUpdate(cat.id, fd)} className="space-y-2">
                    <input
                      name="name"
                      defaultValue={cat.name}
                      autoFocus
                      className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm font-bold"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-[#1a6b1a] hover:bg-[#0f4a0f] text-white text-xs font-semibold rounded-lg px-3 py-1.5"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg px-3 py-1.5"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <Link href={`/admin/categories/${cat.id}`} className="block">
                      <div className="text-lg font-extrabold mb-1" style={{ color }}>
                        {cat.name}
                      </div>
                      <div className="text-3xl font-extrabold text-gray-900">{counts[cat.id] ?? 0}</div>
                      <div className="text-xs text-gray-500 mt-1">members — click to view / import</div>
                    </Link>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => setEditingId(cat.id)}
                        className="px-2 py-1 rounded text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200"
                      >
                        Edit
                      </button>
                      <button
                        disabled={isPending}
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="px-2 py-1 rounded text-xs font-semibold bg-red-50 text-red-600 border border-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
