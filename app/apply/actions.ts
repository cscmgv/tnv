"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { friendlyCandidateError } from "@/lib/db-errors";
import { safeAction } from "@/lib/action-utils";

export type ApplicationInput = {
  candidate_name: string;
  candidate_mobile: string;
  candidate_email: string;
  dob: string;
  district: string;
  taluk?: string;
  assembly_constituency?: string;
  panchayat_area: string;
  pincode: string;
  ngo: string;
  current_tnv_role: string;
};

// Public, unauthenticated submission — reached via a link an admin or
// interviewer shares (e.g. /apply?ref=<their profile id>&cat=<category id>).
// There is no logged-in user here, so this uses the service-role client and
// does its own validation instead of relying on requireProfile()/RLS. Takes
// a plain object (built from controlled React state in ApplyForm) rather
// than FormData — React 19 resets uncontrolled <form action> fields as part
// of dispatching the action, which was wiping the form's values before the
// FormData snapshot the server actually received.
export async function submitCandidateApplication(input: ApplicationInput, ref: string | null, categoryId: number | null) {
  return safeAction(async () => {
    const admin = createAdminClient();

    const candidate_name = input.candidate_name.trim();
    const candidate_email = input.candidate_email.trim() || null;
    const dob = input.dob.trim() || null;
    const district = input.district.trim();
    const taluk = (input.taluk || input.assembly_constituency || "").trim();
    const assembly_constituency = (input.assembly_constituency || taluk).trim();
    const panchayat_area = input.panchayat_area.trim();
    const pincode = input.pincode.trim() || null;
    const ngo = input.ngo.trim() || null;
    const current_tnv_role = input.current_tnv_role.trim() || null;

    // Strip everything but digits, then drop a leading "91"/"0" country/
    // trunk prefix, so "+91 98765 43210", "091-98765-43210" and
    // "9876543210" all validate the same way instead of only the last one.
    let digits = input.candidate_mobile.replace(/\D/g, "");
    if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
    else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
    const candidate_mobile = digits;

    if (!candidate_name) return { error: "Name is required." };
    if (!/^[6-9]\d{9}$/.test(candidate_mobile)) return { error: "Enter a valid 10-digit mobile number." };
    if (!district) return { error: "District is required." };
    if (!taluk && !assembly_constituency) return { error: "Taluk is required." };
    if (!panchayat_area) return { error: "Panchayat / area is required." };

    // A referral link identifies who to attribute this signup to. If it
    // doesn't resolve to a real, active admin/interviewer, the submission
    // still goes through — it just isn't attributed to anyone in particular
    // (an admin will see it in the unassigned pool regardless).
    let created_by: string | null = null;
    let assigned_to: string | null = null;
    if (ref) {
      const { data: referrer } = await admin
        .from("profiles")
        .select("id, role, is_active")
        .eq("id", ref)
        .maybeSingle();
      if (referrer?.is_active) {
        created_by = referrer.id;
        if (referrer.role === "interviewer") assigned_to = referrer.id;
      }
    }

    // A category-scoped link (shared from a category's page) auto-joins the
    // candidate to that category. Verify it still exists rather than
    // trusting the query param outright, so a stale/tampered ?cat= doesn't
    // just fail the insert on a bad foreign key.
    let category_id: number | null = null;
    if (categoryId) {
      const { data: category } = await admin.from("categories").select("id").eq("id", categoryId).maybeSingle();
      category_id = category?.id ?? null;
    }

    const { data: inserted, error } = await admin
      .from("candidates")
      .insert({
        candidate_name,
        candidate_mobile,
        candidate_email,
        dob,
        district,
        taluk,
        assembly_constituency,
        panchayat_area,
        pincode,
        ngo,
        current_tnv_role,
        category_id,
        interview_date: new Date().toISOString().slice(0, 10),
        interview_completed: false,
        interview_started: false,
        created_by,
        assigned_to,
      })
      .select("id")
      .single();
    if (error) return { error: friendlyCandidateError(error) };

    if (category_id) {
      await admin.from("candidate_categories").insert({ candidate_id: inserted.id, category_id });
    }

    return { success: true };
  });
}
