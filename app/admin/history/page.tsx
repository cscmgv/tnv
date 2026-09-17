import { requireProfile } from "@/lib/auth";
import HistoryPanel from "./HistoryPanel";
import type { UploadBatch, ActivityLog } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const { supabase } = await requireProfile("admin");

  // Fetch upload batches
  const { data: batches, error: batchError } = await supabase
    .from("upload_batches")
    .select("*")
    .order("uploaded_at", { ascending: false });

  // Fetch activity logs
  const { data: activities, error: activityError } = await supabase
    .from("activity_history")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

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
        batches={(batches as UploadBatch[]) || []}
        activities={(activities as ActivityLog[]) || []}
        profilesById={profilesById}
        error={batchError?.message || activityError?.message}
      />
    </div>
  );
}
