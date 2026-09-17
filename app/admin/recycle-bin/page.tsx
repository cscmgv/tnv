import { requireProfile } from "@/lib/auth";
import { autoPurgeOldRecycleBin } from "@/app/admin/actions";
import RecycleBinPanel from "./RecycleBinPanel";

export const dynamic = "force-dynamic";

export default async function RecycleBinPage() {
  const { supabase } = await requireProfile("admin");

  // Automatically clean up candidates that have been in the recycle bin for > 7 days (1 week)
  try {
    await autoPurgeOldRecycleBin();
  } catch {
    // Ignore error if column or table is being migrated
  }

  // Fetch all soft-deleted candidates
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let candidates: any[] = [];
  let isMigrationMissing = false;
  let customError = "";

  try {
    const { data, error } = await supabase
      .from("candidates")
      .select("id, serial_number, candidate_name, candidate_mobile, candidate_email, district, assembly_constituency, deleted_at, upload_batch_id")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false });

    if (error) {
      if (error.code === "42703" || error.message?.includes("deleted_at") || error.message?.includes("upload_batch_id")) {
        isMigrationMissing = true;
      } else {
        customError = error.message;
      }
    } else if (data) {
      candidates = data;
    }
  } catch {
    isMigrationMissing = true;
  }

  return (
    <div className="space-y-6">
      <RecycleBinPanel
        candidates={candidates}
        isMigrationMissing={isMigrationMissing}
        loadError={customError || undefined}
      />
    </div>
  );
}
