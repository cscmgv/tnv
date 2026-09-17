"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function setupAccount(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const fullName = String(formData.get("full_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirm_password") || "");

  if (!fullName) return { error: "Full name is required." };
  if (!password || password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirmPassword) return { error: "Passwords do not match." };

  const { error: pwErr } = await supabase.auth.updateUser({ password });
  if (pwErr) return { error: pwErr.message };

  const admin = createAdminClient();
  const { error: profileErr } = await admin
    .from("profiles")
    .update({ full_name: fullName, phone: phone || null, profile_completed: true })
    .eq("id", user.id);
  if (profileErr) return { error: profileErr.message };

  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  redirect(profile?.role === "admin" ? "/admin" : "/interview");
}
