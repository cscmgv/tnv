import { requireProfile } from "@/lib/auth";
import { autoPurgeOldRecycleBin } from "@/app/admin/actions";
import RecycleBinPanel from "./RecycleBinPanel";

export const dynamic = "force-dynamic";

export default async function RecycleBinPage() {
  const { supabase, profile } = await requireProfile("admin");

  // Automatically clean up candidates that have been in the recycle bin for > 7 days (1 week)
  try {
    await autoPurgeOldRecycleBin();
  } catch {
    // Ignore error if column or table is being migrated
  }

  // Fetch all soft-deleted candidates
  const { data: candidates, error } = await supabase
    .from("candidates")
    .select("id, serial_number, candidate_name, candidate_mobile, candidate_email, district, assembly_constituency, deleted_at, upload_batch_id")
    .not("deleted_at", "is", null)
    .order("deleted_at", { ascending: false });

  return (
    <div className="space-y-6">
      <RecycleBinPanel candidates={candidates || []} loadError={error?.message} />
    </div>
  );
}
