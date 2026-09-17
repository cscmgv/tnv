import type { PostgrestError } from "@supabase/supabase-js";

export function friendlyCandidateError(error: PostgrestError): string {
  if (error.code === "23505" && error.message.includes("candidates_mobile")) {
    return "A candidate with this mobile number already exists. Mobile numbers must be unique.";
  }
  return error.message;
}
