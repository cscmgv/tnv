import { requireProfile } from "@/lib/auth";
import HistoryPanel from "./HistoryPanel";
import type { UploadBatch, ActivityLog } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const { supabase } = await requireProfile("admin");

  // Fetch upload batches safely
  let batches: UploadBatch[] = [];
  let isBatchesMissing = false;
  let customError = "";

  try {
    const { data, error } = await supabase
      .from("upload_batches")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (error) {
      if (error.code === "PGRST205" || error.message?.includes("upload_batches") || error.message?.includes("schema cache")) {
        isBatchesMissing = true;
      } else {
        customError = error.message;
      }
    } else if (data) {
      batches = data as UploadBatch[];
    }
  } catch {
    isBatchesMissing = true;
  }

  // Fetch activity logs safely
  let activities: ActivityLog[] = [];
  try {
    const { data, error } = await supabase
      .from("activity_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      if (error.code === "PGRST205" || error.message?.includes("activity_history") || error.message?.includes("schema cache")) {
        // Table not created yet
      } else if (!customError) {
        customError = error.message;
      }
    } else if (data) {
      activities = data as ActivityLog[];
    }
  } catch {
    // Ignore
  }

  // Fetch user profiles for displaying performer names
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email");

  const profilesById: Record<string, string> = {};
  profiles?.forEach((p) => {
    profilesById[p.id] = p.full_name || p.email || p.id;
  });

  return (
    <div className="space-y-6">
      <HistoryPanel
        batches={batches}
        activities={activities}
        profilesById={profilesById}
        isTableMissing={isBatchesMissing}
        error={customError || undefined}
      />
    </div>
  );
}
