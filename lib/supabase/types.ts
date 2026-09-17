export type Profile = {
  id: string;
  role: "admin" | "interviewer";
  reg_no: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  profile_completed: boolean;
  allowed_districts: string[];
  allowed_constituencies: string[];
  allowed_pincodes: string[];
  allowed_categories: number[];
  district: string | null;
  assembly_constituency: string | null;
  panchayat_area: string | null;
  pincode: string | null;
  ngo: string | null;
  dob: string | null;
  current_tnv_role: string | null;
  created_at: string;
};

export type Candidate = {
  id: number;
  serial_number: number;
  candidate_name: string;
  candidate_mobile: string;
  candidate_email: string | null;
  interview_date: string;
  district: string;
  assembly_constituency: string;
  panchayat_area: string;
  pincode: string | null;
  ngo: string | null;
  dob: string | null;
  current_tnv_role: string | null;
  category_id: number | null;
  interview_completed: boolean;
  interview_started: boolean;
  assigned_to: string | null;
  created_by: string | null;
  locked_by: string | null;
  locked_at: string | null;
  created_at: string;
};

export type Category = {
  id: number;
  name: string;
  created_at: string;
};

// One grant of visibility for an interviewer: every candidate in
// `category_id`, optionally narrowed to one district and, within that, one
// constituency. district/constituency null means "all" at that level.
export type InterviewerCoverageRule = {
  id: number;
  interviewer_id: string;
  category_id: number;
  district: string | null;
  constituency: string | null;
  created_at: string;
};

export type CallStatus = "Attending" | "Not Attending" | "Postponed" | "No Answer";

export type CallLog = {
  id: number;
  candidate_id: number;
  interviewer_id: string;
  status: CallStatus;
  notes: string | null;
  called_at: string;
};

export type Assessment = {
  id: number;
  candidate_id: number;
  interviewer_id: string;
  base_score: number;
  tie_breaker_applied: boolean;
  final_score: number;
  auto_suggested_role: string | null;
  additional_suggested_role: string | null;
  final_decision: string | null;
  verification_status: string | null;
  assessor_signature: string | null;
  additional_notes: string | null;
  assessed_at: string;
  [key: `q${number}_score`]: number | null;
};

export type FullReportRow = {
  assessment_id: number;
  candidate_id: number;
  categories?: Category[];
  serial_number: number;
  interview_date: string;
  interviewer_reg_no: string | null;
  interviewer_name: string;
  interviewer_email: string | null;
  interviewer_phone: string | null;
  candidate_name: string;
  candidate_mobile: string;
  candidate_email: string | null;
  district: string;
  assembly_constituency: string;
  panchayat_area: string;
  pincode: string | null;
  ngo: string | null;
  dob: string | null;
  current_tnv_role: string | null;
  base_score: number;
  tie_breaker_applied: boolean;
  final_score: number;
  auto_suggested_role: string | null;
  additional_suggested_role: string | null;
  final_decision: string | null;
  verification_status: string | null;
  assessor_signature: string | null;
  additional_notes: string | null;
  assessed_at: string;
  [key: `q${number}_score`]: unknown;
};

// Unified row for the admin "All Candidates" table — a completed row (from
// v_full_report, has an assessment) or a pending one (candidate only, no
// assessment yet because the interview hasn't happened).
export type CandidateListRow =
  | (FullReportRow & { pending: false })
  | {
      pending: true;
      assessment_id: null;
      candidate_id: number;
      categories?: Category[];
      serial_number: number;
      interview_date: string;
      candidate_name: string;
      candidate_mobile: string;
      candidate_email: string | null;
      district: string;
      assembly_constituency: string;
      pincode: string | null;
      ngo: string | null;
      dob: string | null;
      interview_started: boolean;
      auto_suggested_role: null;
      final_score: null;
      final_decision: null;
      interviewer_name: string;
      assigned_to: string | null;
      district_covered_by: string[];
      call_count: number;
      latest_call_status: CallStatus | null;
    };

export type InterviewerSummaryRow = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  candidates_assessed: number;
  avg_candidate_score: number | null;
};

export type RoleDistributionRow = {
  role: string;
  count: number;
};

// Minimal Database type — kept loose since this project doesn't generate
// types via the Supabase CLI. Swap for `supabase gen types` output later.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any;
