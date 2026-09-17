-- ============================================================
-- Patch: Add Taluk to candidates and update v_full_report view
-- ============================================================

-- 1. Add taluk column to candidates
alter table candidates add column if not exists taluk text default null;

-- 2. Allow assembly_constituency to be nullable or default to taluk
alter table candidates alter column assembly_constituency drop not null;

-- 3. Recreate v_full_report to expose taluk
drop view if exists v_full_report cascade;

create view v_full_report as
select
  a.id as assessment_id,
  c.id as candidate_id,
  c.serial_number,
  c.interview_date,
  p.reg_no as interviewer_reg_no,
  p.full_name as interviewer_name,
  p.email as interviewer_email,
  p.phone as interviewer_phone,
  c.candidate_name,
  c.candidate_mobile,
  c.candidate_email,
  c.district,
  c.assembly_constituency,
  coalesce(c.taluk, c.assembly_constituency) as taluk,
  c.panchayat_area,
  c.pincode,
  c.ngo,
  c.dob,
  c.current_tnv_role,
  a.q1_score, a.q2_score, a.q3_score, a.q4_score,
  a.q5_score, a.q6_score, a.q7_score, a.q8_score,
  a.q9_score, a.q10_score, a.q11_score, a.q12_score,
  a.q13_score, a.q14_score, a.q15_score, a.q16_score,
  a.base_score,
  a.tie_breaker_applied,
  a.final_score,
  a.auto_suggested_role,
  a.additional_suggested_role,
  a.final_decision,
  a.verification_status,
  a.assessor_signature,
  a.additional_notes,
  a.assessed_at
from assessments a
join candidates c on c.id = a.candidate_id
join profiles p on p.id = a.interviewer_id;

notify pgrst, 'reload schema';
