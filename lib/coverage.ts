import type { Candidate, Category, InterviewerCoverageRule, Profile } from "./supabase/types";

// Names of interviewers whose coverage rules already grant them visibility
// into this candidate — used for the admin's "already visible to X" hint on
// unassigned candidates. A rule matches when the candidate belongs to the
// rule's category and (the rule's district is unset or matches) and (the
// rule's constituency is unset or matches).
export function interviewersCoveringCandidate(
  candidate: Pick<Candidate, "district" | "assembly_constituency">,
  candidateCategories: Category[],
  coverage: InterviewerCoverageRule[],
  interviewerById: Map<string, Profile>
): string[] {
  const categoryIds = new Set(candidateCategories.map((c) => c.id));
  const names = new Set<string>();
  for (const rule of coverage) {
    if (!categoryIds.has(rule.category_id)) continue;
    if (rule.district && rule.district !== candidate.district) continue;
    if (rule.constituency && rule.constituency !== candidate.assembly_constituency) continue;
    const iv = interviewerById.get(rule.interviewer_id);
    if (iv) names.add(iv.full_name);
  }
  return Array.from(names);
}
