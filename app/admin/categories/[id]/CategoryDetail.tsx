"use client";

import Link from "next/link";
import type { CallLog, CandidateListRow, Category, Profile } from "@/lib/supabase/types";
import CandidatesTable from "../../CandidatesTable";

export default function CategoryDetail({
  category,
  records,
  totalMembers,
  interviewers,
  callsByCandidate,
  currentUserId,
}: {
  category: Category;
  records: CandidateListRow[];
  totalMembers: number;
  interviewers: Profile[];
  callsByCandidate: Record<number, CallLog[]>;
  currentUserId?: string;
}) {
  return (
    <div className="pb-16">
      <div className="flex items-center gap-3 mb-5">
        <Link href="/admin/categories" className="text-sm text-gray-500 hover:text-[#1a6b1a]">
          ← Categories
        </Link>
        <h2 className="text-lg font-bold text-gray-900">{category.name}</h2>
        <span className="text-xs text-gray-400">{totalMembers} members</span>
      </div>

      <CandidatesTable
        records={records}
        totalCount={totalMembers}
        interviewers={interviewers}
        callsByCandidate={callsByCandidate}
        categoryId={category.id}
        currentUserId={currentUserId}
      />
    </div>
  );
}
