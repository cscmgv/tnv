import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

export async function requireProfile(role?: "admin" | "interviewer"): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>;
  profile: Profile;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (!profile || !profile.is_active) redirect("/login");
  if (!profile.profile_completed) redirect("/setup-account");
  if (role && profile.role !== role) redirect(profile.role === "admin" ? "/admin" : "/interview");

  return { supabase, profile: profile as Profile };
}
