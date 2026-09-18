"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireProfile } from "@/lib/auth";
import { QUESTIONS } from "@/lib/data/questions";
import { getRoleFromScore } from "@/lib/data/roles";
import { sendInterviewerSetupLink } from "@/lib/email";
import { friendlyCandidateError } from "@/lib/db-errors";
import { safeAction, safeVoidAction } from "@/lib/action-utils";

// Derive the site's own base URL from the incoming request rather than a
// NEXT_PUBLIC_APP_URL env var — that var is easy to leave unset (or wrong)
// per-deployment and silently makes invite links point at localhost in
// production. Falls back to the env var, then localhost, only if headers()
// genuinely isn't available (e.g. outside a request context).
async function getAppUrl() {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    if (host) {
      const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
      return `${proto}://${host}`;
    }
  } catch {
    // headers() unavailable outside a request context
  }
  return process.env.NEXT_PUBLIC_APP_URL || "https://tnv-selection-next.tnvinterview.workers.dev/";
}

async function generateAndSendSetupLink(email: string, regNo: string) {
  const admin = createAdminClient();
  const appUrl = await getAppUrl();

  const { data, error } = await admin.auth.admin.generateLink({ type: "magiclink", email });
  if (error || !data.properties?.hashed_token) {
    return { error: error?.message || "Could not generate a setup link." };
  }

  // Email our own /auth/callback link (verified server-side via token_hash)
  // rather than Supabase's hosted action_link, which redirects back with the
  // session in a URL hash our server route can't read.
  const actionLink = `${appUrl}/auth/callback?token_hash=${data.properties.hashed_token}&type=magiclink&next=/setup-account`;

  return sendInterviewerSetupLink({ to: email, regNo, actionLink });
}

export async function deleteCandidate(assessmentId: number | null, candidateId: number) {
  return safeAction(async () => {
    const { supabase, profile } = await requireProfile("admin");
    const now = new Date().toISOString();
    // Soft delete candidate
    const { error } = await supabase.from("candidates").update({ deleted_at: now }).eq("id", candidateId);
    if (error) {
      // Fallback to hard delete if deleted_at column is not yet present
      if (assessmentId) await supabase.from("assessments").delete().eq("id", assessmentId);
      await supabase.from("candidates").delete().eq("id", candidateId);
    }
    try {
      await supabase.from("activity_history").insert({
        action: "delete_candidate",
        details: `Moved candidate #${candidateId} to Recycle Bin`,
        performed_by: profile.id,
      });
    } catch {}

    revalidatePath("/admin");
    revalidatePath("/admin/recycle-bin");
    return { success: true };
  });
}

export async function bulkDeleteCandidates(candidateIds: number[]) {
  return safeAction(async () => {
    const { supabase, profile } = await requireProfile("admin");
    if (!candidateIds.length) return { error: "No candidates selected." };
    const now = new Date().toISOString();
    const { error } = await supabase.from("candidates").update({ deleted_at: now }).in("id", candidateIds);
    if (error) return { error: error.message };

    try {
      await supabase.from("activity_history").insert({
        action: "bulk_delete",
        details: `Moved ${candidateIds.length} candidate(s) to Recycle Bin`,
        performed_by: profile.id,
      });
    } catch {}

    revalidatePath("/admin");
    revalidatePath("/admin/recycle-bin");
    return { success: true, count: candidateIds.length };
  });
}

export async function restoreCandidate(candidateId: number) {
  return safeAction(async () => {
    const { supabase, profile } = await requireProfile("admin");
    const { error } = await supabase.from("candidates").update({ deleted_at: null }).eq("id", candidateId);
    if (error) return { error: error.message };

    try {
      await supabase.from("activity_history").insert({
        action: "restore_candidate",
        details: `Restored candidate #${candidateId} from Recycle Bin`,
        performed_by: profile.id,
      });
    } catch {}

    revalidatePath("/admin");
    revalidatePath("/admin/recycle-bin");
    return { success: true };
  });
}

export async function bulkRestoreCandidates(candidateIds: number[]) {
  return safeAction(async () => {
    const { supabase, profile } = await requireProfile("admin");
    if (!candidateIds.length) return { error: "No candidates selected." };
    const { error } = await supabase.from("candidates").update({ deleted_at: null }).in("id", candidateIds);
    if (error) return { error: error.message };

    try {
      await supabase.from("activity_history").insert({
        action: "bulk_restore",
        details: `Restored ${candidateIds.length} candidate(s) from Recycle Bin`,
        performed_by: profile.id,
      });
    } catch {}

    revalidatePath("/admin");
    revalidatePath("/admin/recycle-bin");
    return { success: true, count: candidateIds.length };
  });
}

export async function restoreAllRecycleBin() {
  return safeAction(async () => {
    const { supabase, profile } = await requireProfile("admin");
    const { data: candidates, error: fetchError } = await supabase
      .from("candidates")
      .select("id")
      .not("deleted_at", "is", null);

    if (fetchError) return { error: fetchError.message };
    if (!candidates || !candidates.length) return { success: true, count: 0 };

    const ids = candidates.map((c) => c.id);
    const { error } = await supabase.from("candidates").update({ deleted_at: null }).in("id", ids);
    if (error) return { error: error.message };

    try {
      await supabase.from("activity_history").insert({
        action: "restore_all",
        details: `Restored all ${ids.length} candidate(s) from Recycle Bin`,
        performed_by: profile.id,
      });
    } catch {}

    revalidatePath("/admin");
    revalidatePath("/admin/recycle-bin");
    return { success: true, count: ids.length };
  });
}

export async function permanentDeleteCandidate(candidateId: number) {
  return safeAction(async () => {
    const { supabase, profile } = await requireProfile("admin");
    await supabase.from("assessments").delete().eq("candidate_id", candidateId);
    await supabase.from("call_logs").delete().eq("candidate_id", candidateId);
    await supabase.from("candidate_categories").delete().eq("candidate_id", candidateId);
    const { error } = await supabase.from("candidates").delete().eq("id", candidateId);
    if (error) return { error: error.message };

    try {
      await supabase.from("activity_history").insert({
        action: "permanent_delete",
        details: `Permanently deleted candidate #${candidateId}`,
        performed_by: profile.id,
      });
    } catch {}

    revalidatePath("/admin");
    revalidatePath("/admin/recycle-bin");
    return { success: true };
  });
}

export async function bulkPermanentDeleteCandidates(candidateIds: number[]) {
  return safeAction(async () => {
    const { supabase, profile } = await requireProfile("admin");
    if (!candidateIds.length) return { error: "No candidates selected." };
    await supabase.from("assessments").delete().in("candidate_id", candidateIds);
    await supabase.from("call_logs").delete().in("candidate_id", candidateIds);
    await supabase.from("candidate_categories").delete().in("candidate_id", candidateIds);
    const { error } = await supabase.from("candidates").delete().in("id", candidateIds);
    if (error) return { error: error.message };

    try {
      await supabase.from("activity_history").insert({
        action: "bulk_permanent_delete",
        details: `Permanently deleted ${candidateIds.length} candidate(s)`,
        performed_by: profile.id,
      });
    } catch {}

    revalidatePath("/admin");
    revalidatePath("/admin/recycle-bin");
    return { success: true, count: candidateIds.length };
  });
}

export async function emptyRecycleBin() {
  return safeAction(async () => {
    const { supabase, profile } = await requireProfile("admin");
    const { data: candidates, error: fetchError } = await supabase
      .from("candidates")
      .select("id")
      .not("deleted_at", "is", null);

    if (fetchError) return { error: fetchError.message };
    if (!candidates || !candidates.length) return { success: true, count: 0 };

    const ids = candidates.map((c) => c.id);
    await supabase.from("assessments").delete().in("candidate_id", ids);
    await supabase.from("call_logs").delete().in("candidate_id", ids);
    await supabase.from("candidate_categories").delete().in("candidate_id", ids);
    const { error } = await supabase.from("candidates").delete().in("id", ids);
    if (error) return { error: error.message };

    try {
      await supabase.from("activity_history").insert({
        action: "empty_recycle_bin",
        details: `Emptied Recycle Bin (permanently deleted ${ids.length} candidate(s))`,
        performed_by: profile.id,
      });
    } catch {}

    revalidatePath("/admin");
    revalidatePath("/admin/recycle-bin");
    return { success: true, count: ids.length };
  });
}

export async function autoPurgeOldRecycleBin() {
  return safeAction(async () => {
    const { supabase } = await requireProfile("admin");
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: oldRows } = await supabase
      .from("candidates")
      .select("id")
      .not("deleted_at", "is", null)
      .lt("deleted_at", cutoff);

    if (oldRows && oldRows.length) {
      const ids = oldRows.map((r) => r.id);
      await supabase.from("assessments").delete().in("candidate_id", ids);
      await supabase.from("call_logs").delete().in("candidate_id", ids);
      await supabase.from("candidate_categories").delete().in("candidate_id", ids);
      await supabase.from("candidates").delete().in("id", ids);
    }
    revalidatePath("/admin/recycle-bin");
    return { purged: oldRows?.length || 0 };
  });
}

export async function assignCandidate(candidateId: number, interviewerId: string | null) {
  return safeAction(async () => {
    await requireProfile("admin");
    const supabase = await createClient();
    const { error } = await supabase.from("candidates").update({ assigned_to: interviewerId }).eq("id", candidateId);
    if (error) return { error: error.message };
    revalidatePath("/admin");
    return { success: true };
  });
}

export async function resendInterviewerInvite(id: string) {
  return safeAction(async () => {
    await requireProfile("admin");
    const admin = createAdminClient();

    const { data: profile } = await admin.from("profiles").select("*").eq("id", id).single();
    if (!profile) return { error: "Interviewer not found." };
    if (!profile.email) return { error: "This interviewer has no email on file." };

    const result = await generateAndSendSetupLink(profile.email, profile.reg_no || "");
    if (result.error) return { error: result.error };
    return { success: true };
  });
}

export async function toggleInterviewerAccess(id: string, currentStatus: boolean) {
  return safeVoidAction(async () => {
    await requireProfile("admin");
    const admin = createAdminClient();
    await admin.from("profiles").update({ is_active: !currentStatus }).eq("id", id);
    revalidatePath("/admin/interviewers");
  });
}

export async function deleteInterviewer(id: string) {
  return safeVoidAction(async () => {
    await requireProfile("admin");
    const admin = createAdminClient();
    await admin.auth.admin.deleteUser(id);
    revalidatePath("/admin/interviewers");
  });
}

// Replaces an interviewer's entire coverage rule set — each rule grants
// visibility over every candidate in `category_id`, optionally narrowed to
// one district and, within that, one constituency (null at either level
// means "all"). This is a full replace (delete then insert), not a merge,
// so the UI always sends the complete desired set.
export async function saveInterviewerCoverage(
  interviewerId: string,
  rules: { category_id: number; district: string | null; constituency: string | null }[]
) {
  return safeAction(async () => {
    await requireProfile("admin");
    const admin = createAdminClient();

    const { error: delErr } = await admin.from("interviewer_coverage").delete().eq("interviewer_id", interviewerId);
    if (delErr) return { error: delErr.message };

    if (rules.length) {
      const { error: insErr } = await admin.from("interviewer_coverage").insert(
        rules.map((r) => ({ interviewer_id: interviewerId, category_id: r.category_id, district: r.district, constituency: r.constituency }))
      );
      if (insErr) return { error: insErr.message };
    }

    revalidatePath("/admin/interviewers");
    return { success: true };
  });
}

export async function updateInterviewerPincodes(id: string, pincodes: string[]) {
  return safeAction(async () => {
    await requireProfile("admin");
    const admin = createAdminClient();
    const { error } = await admin.from("profiles").update({ allowed_pincodes: pincodes }).eq("id", id);
    if (error) {
      if (error.message.includes("allowed_pincodes") || error.code === "42703") {
        return { error: "This database hasn't been migrated for pincode-based assignment yet. Run the allowed_pincodes migration in supabase/schema.sql." };
      }
      return { error: error.message };
    }
    revalidatePath("/admin/interviewers");
    return { success: true };
  });
}

export async function createCategory(formData: FormData) {
  return safeAction(async () => {
    await requireProfile("admin");
    const admin = createAdminClient();
    const name = String(formData.get("name") || "").trim();
    if (!name) return { error: "Category name is required." };

    const { error } = await admin.from("categories").insert({ name });
    if (error) return { error: error.message.includes("duplicate") ? "A category with this name already exists." : error.message };

    revalidatePath("/admin/categories");
    return { success: true };
  });
}

export async function updateCategory(id: number, formData: FormData) {
  return safeAction(async () => {
    await requireProfile("admin");
    const admin = createAdminClient();
    const name = String(formData.get("name") || "").trim();
    if (!name) return { error: "Category name is required." };

    const { error } = await admin.from("categories").update({ name }).eq("id", id);
    if (error) return { error: error.message.includes("duplicate") ? "A category with this name already exists." : error.message };

    revalidatePath("/admin/categories");
    revalidatePath(`/admin/categories/${id}`);
    return { success: true };
  });
}

export async function deleteCategory(id: number) {
  return safeVoidAction(async () => {
    await requireProfile("admin");
    const admin = createAdminClient();
    await admin.from("categories").delete().eq("id", id);
    revalidatePath("/admin/categories");
  });
}

export type ImportRow = {
  candidate_name: string;
  candidate_mobile: string;
  candidate_email?: string;
  interview_date?: string;
  district?: string;
  taluk?: string;
  assembly_constituency?: string;
  panchayat_area?: string;
  pincode?: string;
  ngo?: string;
  dob?: string;
  current_tnv_role?: string;
};

type CleanedImportRow = {
  candidate_name: string;
  candidate_mobile: string;
  candidate_email: string | null;
  interview_date: string;
  district: string;
  taluk: string;
  assembly_constituency: string;
  panchayat_area: string;
  pincode: string | null;
  ngo: string | null;
  dob: string | null;
  current_tnv_role: string | null;
};

const IMPORT_FIELD_LABELS: Record<keyof Omit<CleanedImportRow, "candidate_mobile" | "interview_date">, string> = {
  candidate_name: "Name",
  candidate_email: "Email",
  district: "District",
  taluk: "Taluk",
  assembly_constituency: "Constituency",
  panchayat_area: "Panchayat / Area",
  pincode: "Pincode",
  ngo: "NGO",
  dob: "Date of Birth",
  current_tnv_role: "Role",
};

export type ImportFieldChange = { field: string; label: string; from: string; to: string };
export type ImportPreviewRow = {
  row: CleanedImportRow;
  existingId: number | null;
  status: "new" | "update" | "unchanged";
  changes: ImportFieldChange[];
};

function cleanImportRow(r: ImportRow, today: string): CleanedImportRow {
  const taluk = r.taluk?.trim() || r.assembly_constituency?.trim() || "";
  return {
    candidate_name: r.candidate_name.trim(),
    candidate_mobile: r.candidate_mobile.trim(),
    candidate_email: r.candidate_email?.trim() || null,
    interview_date: r.interview_date?.trim() || today,
    district: r.district?.trim() || "",
    taluk: taluk,
    assembly_constituency: r.assembly_constituency?.trim() || taluk,
    panchayat_area: r.panchayat_area?.trim() || "",
    pincode: r.pincode?.trim() || null,
    ngo: r.ngo?.trim() || null,
    dob: r.dob?.trim() || null,
    current_tnv_role: r.current_tnv_role?.trim() || null,
  };
}

// Multiple candidates can share the same mobile number. Previewing an upload
// matches each row by both candidate name and mobile so an upload can update
// an existing record if both match, while allowing multiple candidates with
// the same mobile number.
export async function previewCandidateImport(rows: ImportRow[], categoryId: number | null) {
  return safeAction(async () => {
    const { supabase } = await requireProfile("admin");
    if (!rows.length) return { error: "No rows to import." };

    const today = new Date().toISOString().slice(0, 10);
    const cleaned = rows
      .filter((r) => r.candidate_name?.trim() && r.candidate_mobile?.trim())
      .map((r) => cleanImportRow(r, today));

    if (!cleaned.length) return { error: "No valid rows (need at least Name and Mobile)." };

    // A `.in(...)` filter with thousands of values produces a URL too long
    // for the request to succeed — chunk it, and actually check for errors
    const mobiles = Array.from(new Set(cleaned.map((c) => c.candidate_mobile)));
    const existingData: {
      id: number;
      candidate_name: string;
      candidate_mobile: string;
      candidate_email: string | null;
      district: string;
      assembly_constituency: string;
      panchayat_area: string;
      pincode: string | null;
      ngo: string | null;
      dob: string | null;
      current_tnv_role: string | null;
    }[] = [];
    const LOOKUP_CHUNK_SIZE = 300;
    for (let i = 0; i < mobiles.length; i += LOOKUP_CHUNK_SIZE) {
      const chunk = mobiles.slice(i, i + LOOKUP_CHUNK_SIZE);
      const { data, error } = await supabase
        .from("candidates")
        .select("id, candidate_name, candidate_mobile, candidate_email, district, taluk, assembly_constituency, panchayat_area, pincode, ngo, dob, current_tnv_role")
        .in("candidate_mobile", chunk);
      if (error) return { error: "Could not check existing candidates: " + error.message };
      existingData.push(...(data || []));
    }
    // Match by both name and mobile so multiple candidates can share the same mobile number
    const existingByKey = new Map(
      existingData.map((e) => [`${e.candidate_name.trim().toLowerCase()}_${e.candidate_mobile.trim()}`, e])
    );

    // A candidate can belong to more than one category — check the junction
    // table for whether this candidate is already a member of the target
    // category, rather than the legacy single category_id column.
    const existingIds = existingData.map((e) => e.id);
    const existingCategoryMemberIds = new Set<number>();
    if (categoryId && existingIds.length) {
      for (let i = 0; i < existingIds.length; i += LOOKUP_CHUNK_SIZE) {
        const chunk = existingIds.slice(i, i + LOOKUP_CHUNK_SIZE);
        const { data: memberRows, error } = await supabase
          .from("candidate_categories")
          .select("candidate_id")
          .eq("category_id", categoryId)
          .in("candidate_id", chunk);
        if (error) return { error: "Could not check category membership: " + error.message };
        (memberRows || []).forEach((r) => existingCategoryMemberIds.add(r.candidate_id));
      }
    }

    const preview: ImportPreviewRow[] = cleaned.map((row) => {
      const matchKey = `${row.candidate_name.trim().toLowerCase()}_${row.candidate_mobile.trim()}`;
      const existing = existingByKey.get(matchKey);
      if (!existing) return { row, existingId: null, status: "new", changes: [] };

      const changes: ImportFieldChange[] = [];
      (Object.keys(IMPORT_FIELD_LABELS) as (keyof typeof IMPORT_FIELD_LABELS)[]).forEach((field) => {
        const toVal = row[field] || "";
        const fromVal = (existing as Record<string, unknown>)[field] as string | null;
        if (toVal && toVal !== (fromVal || "")) {
          changes.push({ field, label: IMPORT_FIELD_LABELS[field], from: fromVal || "—", to: toVal });
        }
      });
      if (categoryId && !existingCategoryMemberIds.has(existing.id)) {
        changes.push({ field: "category_membership", label: "Category", from: "Not in this category", to: "Added to this category" });
      }

      return { row, existingId: existing.id, status: changes.length ? "update" : "unchanged", changes };
    });

    return { success: true, preview };
  });
}

export async function commitCandidateImport(
  preview: ImportPreviewRow[],
  categoryId: number | null,
  batchInfo?: { batchId: string; filename: string }
) {
  return safeAction(async () => {
    const { supabase, profile } = await requireProfile("admin");
    if (!preview.length) return { error: "Nothing to import." };

    let created = 0;
    let updated = 0;
    const createdIds: number[] = [];

    for (const item of preview) {
      if (item.existingId) {
        const patch: Record<string, unknown> = {};
        for (const ch of item.changes) {
          if (ch.field === "category_membership") continue;
          patch[ch.field] = (item.row as Record<string, unknown>)[ch.field];
        }
        if (Object.keys(patch).length) {
          const { error } = await supabase.from("candidates").update(patch).eq("id", item.existingId);
          if (error) return { error: friendlyCandidateError(error) };
        }
        const needsCategoryWrite = categoryId && item.changes.some((ch) => ch.field === "category_membership");
        if (needsCategoryWrite) {
          await supabase.from("candidate_categories").upsert(
            { candidate_id: item.existingId, category_id: categoryId },
            { onConflict: "candidate_id,category_id", ignoreDuplicates: true }
          );
        }
        if (item.changes.length) updated++;
      } else {
        const candidatePayload: Record<string, unknown> = {
          ...item.row,
          category_id: categoryId,
          interview_completed: false,
          created_by: profile.id,
        };
        if (batchInfo?.batchId) {
          candidatePayload.upload_batch_id = batchInfo.batchId;
        }

        const { data: inserted, error } = await supabase
          .from("candidates")
          .insert(candidatePayload)
          .select("id")
          .single();
        if (error) return { error: friendlyCandidateError(error) };
        if (categoryId) {
          await supabase.from("candidate_categories").insert({ candidate_id: inserted.id, category_id: categoryId });
        }
        createdIds.push(inserted.id);
        created++;
      }
    }

    // Register / update batch metadata for History & Revoke
    if (batchInfo?.batchId) {
      try {
        const { data: existingBatch } = await supabase
          .from("upload_batches")
          .select("candidate_ids, created_rows, updated_rows")
          .eq("id", batchInfo.batchId)
          .single();

        const mergedIds = Array.from(new Set([...(existingBatch?.candidate_ids || []), ...createdIds]));
        const totalCreated = (existingBatch?.created_rows || 0) + created;
        const totalUpdated = (existingBatch?.updated_rows || 0) + updated;

        await supabase.from("upload_batches").upsert({
          id: batchInfo.batchId,
          filename: batchInfo.filename,
          total_rows: mergedIds.length + totalUpdated,
          created_rows: totalCreated,
          updated_rows: totalUpdated,
          category_id: categoryId,
          uploaded_by: profile.id,
          status: "active",
          candidate_ids: mergedIds,
        });

        await supabase.from("activity_history").insert({
          action: "upload_excel",
          details: `Imported "${batchInfo.filename}": ${created} created, ${updated} updated`,
          performed_by: profile.id,
        });
      } catch {}
    }

    revalidatePath("/admin");
    revalidatePath("/admin/history");
    if (categoryId) {
      revalidatePath(`/admin/categories/${categoryId}`);
      revalidatePath("/admin/categories");
    }
    return { success: true, created, updated, batchId: batchInfo?.batchId };
  });
}

export async function revokeUploadBatch(batchId: string) {
  return safeAction(async () => {
    const { supabase, profile } = await requireProfile("admin");
    const { data: batch, error: batchError } = await supabase
      .from("upload_batches")
      .select("*")
      .eq("id", batchId)
      .single();

    if (batchError || !batch) return { error: "Upload batch not found." };
    if (batch.status === "revoked") return { error: "This upload batch was already revoked." };

    let candidateIds: number[] = batch.candidate_ids || [];
    const { data: batchCandidates } = await supabase
      .from("candidates")
      .select("id")
      .eq("upload_batch_id", batchId);

    if (batchCandidates && batchCandidates.length) {
      candidateIds = Array.from(new Set([...candidateIds, ...batchCandidates.map((c) => c.id)]));
    }

    if (candidateIds.length > 0) {
      const now = new Date().toISOString();
      await supabase.from("candidates").update({ deleted_at: now }).in("id", candidateIds);
    }

    await supabase.from("upload_batches").update({
      status: "revoked",
      revoked_at: new Date().toISOString(),
    }).eq("id", batchId);

    try {
      await supabase.from("activity_history").insert({
        action: "revoke_upload",
        details: `Revoked upload batch "${batch.filename}" (${candidateIds.length} candidate(s) moved to Recycle Bin)`,
        performed_by: profile.id,
      });
    } catch {}

    revalidatePath("/admin");
    revalidatePath("/admin/history");
    revalidatePath("/admin/recycle-bin");
    return { success: true, count: candidateIds.length, filename: batch.filename };
  });
}

export async function fixSerialNumbersSequentially() {
  return safeAction(async () => {
    const { supabase } = await requireProfile("admin");
    const { data: candidates, error } = await supabase
      .from("candidates")
      .select("id")
      .order("created_at", { ascending: true })
      .order("id", { ascending: true });

    if (error) return { error: error.message };
    if (!candidates || !candidates.length) return { success: true, updated: 0 };

    for (let i = 0; i < candidates.length; i++) {
      await supabase.from("candidates").update({ serial_number: i + 1 }).eq("id", candidates[i].id);
    }

    revalidatePath("/admin");
    return { success: true, updated: candidates.length };
  });
}

// Adds a candidate to a category without removing any other category
// they're already a member of (a candidate can belong to several at once).
export async function setCandidateCategory(candidateId: number, categoryId: number | null) {
  return safeVoidAction(async () => {
    await requireProfile("admin");
    const supabase = await createClient();
    if (categoryId) {
      await supabase
        .from("candidate_categories")
        .upsert({ candidate_id: candidateId, category_id: categoryId }, { onConflict: "candidate_id,category_id", ignoreDuplicates: true });
    }
    revalidatePath("/admin/categories");
    if (categoryId) revalidatePath(`/admin/categories/${categoryId}`);
  });
}

export async function removeCategoryMember(candidateId: number, categoryId: number) {
  return safeVoidAction(async () => {
    await requireProfile("admin");
    const supabase = await createClient();
    await supabase.from("candidate_categories").delete().eq("candidate_id", candidateId).eq("category_id", categoryId);
    revalidatePath(`/admin/categories/${categoryId}`);
    revalidatePath("/admin/categories");
  });
}

export async function createCandidate(formData: FormData) {
  return safeAction(async () => {
  const { supabase, profile } = await requireProfile("admin");

  const candidatePatch = {
    candidate_name: String(formData.get("candidate_name") || "").trim(),
    candidate_mobile: String(formData.get("candidate_mobile") || "").trim(),
    candidate_email: String(formData.get("candidate_email") || "").trim() || null,
    interview_date: String(formData.get("interview_date") || "") || new Date().toISOString().slice(0, 10),
    district: String(formData.get("district") || ""),
    taluk: String(formData.get("taluk") || formData.get("assembly_constituency") || "").trim(),
    assembly_constituency: String(formData.get("taluk") || formData.get("assembly_constituency") || "").trim(),
    panchayat_area: String(formData.get("panchayat_area") || "").trim(),
    pincode: String(formData.get("pincode") || "").trim() || null,
    ngo: String(formData.get("ngo") || "").trim() || null,
    dob: String(formData.get("dob") || "").trim() || null,
    current_tnv_role: String(formData.get("current_tnv_role") || "") || null,
    category_id: formData.get("category_id") ? Number(formData.get("category_id")) : null,
  };

  const interviewCompleted = formData.get("interview_completed") !== "no";

  if (!candidatePatch.candidate_name) return { error: "Candidate name is required." };
  if (!candidatePatch.candidate_mobile) return { error: "Mobile is required." };
  if (interviewCompleted && !candidatePatch.interview_date) return { error: "Interview date is required." };
  if (!candidatePatch.district) return { error: "District is required." };
  if (!candidatePatch.taluk && !candidatePatch.assembly_constituency) return { error: "Taluk is required." };
  if (!candidatePatch.panchayat_area) return { error: "Panchayat / area is required." };

  const { data: candData, error: candErr } = await supabase
    .from("candidates")
    .insert({ ...candidatePatch, interview_completed: interviewCompleted, created_by: profile.id })
    .select("id")
    .single();
  if (candErr) return { error: friendlyCandidateError(candErr) };

  if (candidatePatch.category_id) {
    await supabase.from("candidate_categories").insert({ candidate_id: candData.id, category_id: candidatePatch.category_id });
  }

  if (!interviewCompleted) {
    revalidatePath("/admin");
    return { success: true };
  }

  let baseScore = 0;
  const scoreFields: Record<string, number> = {};
  QUESTIONS.forEach((_, i) => {
    const val = parseFloat(String(formData.get(`q${i + 1}_score`) ?? "0"));
    scoreFields[`q${i + 1}_score`] = val;
    baseScore += val;
  });

  const tieBreaker = formData.get("tie_breaker_applied") === "yes";
  const finalScore = baseScore + (tieBreaker ? 0.5 : 0);
  const role = getRoleFromScore(baseScore);

  const { error: asmntErr } = await supabase.from("assessments").insert({
    candidate_id: candData.id,
    interviewer_id: profile.id,
    ...scoreFields,
    base_score: baseScore,
    tie_breaker_applied: tieBreaker,
    final_score: finalScore,
    auto_suggested_role: role.label,
    additional_suggested_role: String(formData.get("additional_suggested_role") || ""),
    final_decision: String(formData.get("final_decision") || "") || null,
    verification_status: String(formData.get("verification_status") || "Pending"),
    assessor_signature: String(formData.get("assessor_signature") || ""),
    additional_notes: String(formData.get("additional_notes") || ""),
  });
  if (asmntErr) return { error: asmntErr.message };

  revalidatePath("/admin");
  return { success: true };
  });
}

export async function updateAssessment(assessmentId: number, candidateId: number, formData: FormData, categoryIds: number[] = []) {
  return safeAction(async () => {
  await requireProfile("admin");
  const supabase = await createClient();

  const candidatePatch = {
    candidate_name: String(formData.get("candidate_name") || "").trim(),
    candidate_mobile: String(formData.get("candidate_mobile") || "").trim(),
    candidate_email: String(formData.get("candidate_email") || "").trim() || null,
    interview_date: String(formData.get("interview_date") || ""),
    district: String(formData.get("district") || ""),
    taluk: String(formData.get("taluk") || formData.get("assembly_constituency") || "").trim(),
    assembly_constituency: String(formData.get("taluk") || formData.get("assembly_constituency") || "").trim(),
    panchayat_area: String(formData.get("panchayat_area") || "").trim(),
    pincode: String(formData.get("pincode") || "").trim() || null,
    ngo: String(formData.get("ngo") || "").trim() || null,
    dob: String(formData.get("dob") || "").trim() || null,
    current_tnv_role: String(formData.get("current_tnv_role") || "") || null,
  };

  // Sync candidate_categories to exactly the checked set — a candidate can
  // belong to several categories at once, so this replaces membership
  // wholesale rather than patching a single category_id column.
  const { data: existingMemberships } = await supabase.from("candidate_categories").select("category_id").eq("candidate_id", candidateId);
  const existingIds = new Set((existingMemberships || []).map((m) => m.category_id));
  const nextIds = new Set(categoryIds);
  const toAdd = categoryIds.filter((id) => !existingIds.has(id));
  const toRemove = [...existingIds].filter((id) => !nextIds.has(id));
  if (toAdd.length) {
    await supabase.from("candidate_categories").insert(toAdd.map((category_id) => ({ candidate_id: candidateId, category_id })));
  }
  if (toRemove.length) {
    await supabase.from("candidate_categories").delete().eq("candidate_id", candidateId).in("category_id", toRemove);
  }

  let baseScore = 0;
  const scoreFields: Record<string, number> = {};
  QUESTIONS.forEach((_, i) => {
    const val = parseFloat(String(formData.get(`q${i + 1}_score`) ?? "0"));
    scoreFields[`q${i + 1}_score`] = val;
    baseScore += val;
  });

  const tieBreaker = formData.get("tie_breaker_applied") === "yes";
  const finalScore = baseScore + (tieBreaker ? 0.5 : 0);
  const role = getRoleFromScore(baseScore);

  const { error: candErr } = await supabase.from("candidates").update(candidatePatch).eq("id", candidateId);
  if (candErr) return { error: friendlyCandidateError(candErr) };

  const { error: asmntErr } = await supabase
    .from("assessments")
    .update({
      ...scoreFields,
      base_score: baseScore,
      tie_breaker_applied: tieBreaker,
      final_score: finalScore,
      auto_suggested_role: role.label,
      additional_suggested_role: String(formData.get("additional_suggested_role") || ""),
      final_decision: String(formData.get("final_decision") || "") || null,
      verification_status: String(formData.get("verification_status") || "Pending"),
      assessor_signature: String(formData.get("assessor_signature") || ""),
      additional_notes: String(formData.get("additional_notes") || ""),
    })
    .eq("id", assessmentId);
  if (asmntErr) return { error: asmntErr.message };

  revalidatePath("/admin");
  return { success: true };
  });
}
