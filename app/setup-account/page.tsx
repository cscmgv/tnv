import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import SetupAccountForm from "./SetupAccountForm";

export const dynamic = "force-dynamic";

export default async function SetupAccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) redirect("/login");
  if (profile.profile_completed) redirect(profile.role === "admin" ? "/admin" : "/interview");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-[#e2e6ed]">
        <div className="flex flex-col items-center mb-6">
          <Image src="/tnv-logo.png" alt="TNV" width={64} height={64} className="rounded-full mb-3" />
          <h1 className="text-lg font-bold text-gray-900">Set Up Your Account</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
            {profile.reg_no} · {profile.email}
          </p>
        </div>
        <SetupAccountForm />
      </div>
    </div>
  );
}
