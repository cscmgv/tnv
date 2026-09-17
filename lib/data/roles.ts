export type RoleInfo = { label: string; cls: string; icon: string };

// What the candidate's role in TNV is right now, at the time of interview —
// distinct from ADDITIONAL_ROLE_OPTIONS (what an assessor recommends they
// become) and getRoleFromScore (what the score band auto-suggests).
export const CURRENT_TNV_ROLE_OPTIONS = ["District Coordinator", "Department Manager", "Volunteer", "Yet to Register"] as const;

export const ADDITIONAL_ROLE_OPTIONS = [
  "District Coordinator (DC)",
  "Additional District Coordinator (ADC)",
  "District Committee Member (DCM)",
  "District Department Coordinator (DDC)",
  "Additional District Department Coordinator (ADDC)",
  "Constituency Coordinator (CC)",
  "Additional Constituency Coordinator (ACC)",
  "Taluk Coordinator (TC)",
  "Additional Taluk Coordinator (ATC)",
  "Local Coordinator (LC)",
  "Additional Panchayat Coordinator (APC)",
  "Lead Volunteer (LV)",
  "Activity Volunteer (AV)",
  "Volunteer (TNV)",
] as const;

export function getRoleFromScore(score: number): RoleInfo {
  if (score >= 13) return { label: "District Coordinator", cls: "district-coord", icon: "🏆" };
  if (score >= 11) return { label: "Additional District Coordinator", cls: "add-district-coord", icon: "⭐" };
  if (score >= 9) return { label: "District Committee Member", cls: "district-committee", icon: "🎯" };
  if (score >= 7) return { label: "Constituency Coordinator", cls: "constituency-coord", icon: "📍" };
  if (score >= 5) return { label: "Additional Constituency Coordinator", cls: "add-constituency-coord", icon: "🌱" };
  return { label: "Volunteer / Leadership Development Pool", cls: "volunteer-pool", icon: "🤝" };
}

// Same bands as getRoleFromScore, spelled out as ranges for display (e.g. a
// reference table on the interview results screen).
export const ROLE_ALLOCATION_TABLE = [
  { min: 13, max: 16, label: "District Coordinator" },
  { min: 11, max: 12, label: "Additional District Coordinator" },
  { min: 9, max: 10, label: "District Committee Member" },
  { min: 7, max: 8, label: "Constituency Coordinator" },
  { min: 5, max: 6, label: "Additional Constituency Coordinator" },
  { min: 0, max: 4, label: "Volunteer / Leadership Development Pool" },
] as const;
