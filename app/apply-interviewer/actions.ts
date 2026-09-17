"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { safeAction } from "@/lib/action-utils";

export type InterviewerApplicationInput = {
  full_name: string;
  mobile: string;
  email: string;
  dob: string;
  district: string;
  assembly_constituency: string;
  panchayat_area: string;
  pincode: string;
  ngo: string;
  current_tnv_role: string;
  password: string;
  confirm_password: string;
};

// Public, unauthenticated submission — reached via the one shared
// /apply-interviewer link an admin hands out. There's no logged-in user
// here, so this uses the service-role client and does its own validation
// instead of relying on requireProfile()/RLS. It both creates the login
// (so no separate email/setup-link step is needed) and the profile row in
// one go, landing the new interviewer straight into "Registered
// Interviewers" for the admin to assign coverage.
export async function submitInterviewerApplication(input: InterviewerApplicationInput) {
  return safeAction(async () => {
    const admin = createAdminClient();

    const full_name = input.full_name.trim();
    const email = input.email.trim().toLowerCase();
    const dob = input.dob.trim() || null;
    const district = input.district.trim();
    const assembly_constituency = input.assembly_constituency.trim();
    const panchayat_area = input.panchayat_area.trim();
    const pincode = input.pincode.trim() || null;
    const ngo = input.ngo.trim() || null;
    const current_tnv_role = input.current_tnv_role.trim() || null;

    // Same normalization as the candidate application form — strips
    // formatting and a leading "91"/"0" country/trunk prefix.
    let digits = input.mobile.replace(/\D/g, "");
    if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
    else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
    const mobile = digits;

    if (!full_name) return { error: "Name is required." };
    if (!/^[6-9]\d{9}$/.test(mobile)) return { error: "Enter a valid 10-digit mobile number." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };
    if (!district) return { error: "District is required." };
    if (!assembly_constituency) return { error: "Assembly constituency is required." };
    if (!panchayat_area) return { error: "Panchayat / area is required." };
    if (input.password.length < 8) return { error: "Password must be at least 8 characters." };
    if (input.password !== input.confirm_password) return { error: "Passwords do not match." };

    const regNo = "TNV" + Math.floor(100000 + Math.random() * 900000);

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password: input.password,
      email_confirm: true,
    });
    if (createErr || !created.user) {
      return { error: createErr?.message || "Could not create your account. That email may already be registered." };
    }

    const { error: profileErr } = await admin.from("profiles").insert({
      id: created.user.id,
      role: "interviewer",
      reg_no: regNo,
      full_name,
      email,
      phone: mobile,
      is_active: true,
      profile_completed: true,
      district,
      assembly_constituency,
      panchayat_area,
      pincode,
      ngo,
      dob,
      current_tnv_role,
    });
    if (profileErr) {
      await admin.auth.admin.deleteUser(created.user.id);
      return { error: profileErr.message };
    }

    return { success: true, regNo };
  });
}
