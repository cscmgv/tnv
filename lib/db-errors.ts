import type { PostgrestError } from "@supabase/supabase-js";

export function friendlyCandidateError(error: PostgrestError): string {
  if (
    error.code === "23505" &&
    (error.message?.includes("idx_candidates_mobile_unique") ||
      error.message?.includes("candidates_candidate_mobile_key") ||
      error.message?.includes("candidates_mobile_unique") ||
      error.details?.includes("candidate_mobile"))
  ) {
    return "Database has a unique constraint on mobile numbers. Please run 'supabase/allow_duplicate_mobile_numbers.sql' in your Supabase SQL Editor to allow multiple candidates to share the same mobile number.";
  }
  return error.message;
}

