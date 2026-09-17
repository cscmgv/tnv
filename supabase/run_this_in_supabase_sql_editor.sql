-- ==============================================================================
-- TAMIL NADU VOLUNTEERS (TNV) - COMPLETE MIGRATION & REPAIR SCRIPT
-- RUN THIS SCRIPT IN YOUR SUPABASE DASHBOARD -> SQL EDITOR
-- Link: https://supabase.com/dashboard/project/xrwrxpxfijcqlldoqmsr/sql
-- Safe to run multiple times (idempotent).
-- ==============================================================================

-- 1. Add missing columns to candidates table
alter table candidates add column if not exists deleted_at timestamptz default null;
alter table candidates add column if not exists upload_batch_id text default null;
alter table candidates add column if not exists taluk text default null;
alter table candidates alter column assembly_constituency drop not null;

create index if not exists idx_candidates_deleted_at on candidates(deleted_at);
create index if not exists idx_candidates_upload_batch on candidates(upload_batch_id);
create index if not exists idx_candidates_taluk on candidates(taluk);

-- 2. Create Upload Batches table (to track and revoke mistakenly uploaded spreadsheets)
create table if not exists upload_batches (
  id text primary key,
  filename text not null,
  total_rows integer not null default 0,
  created_rows integer not null default 0,
  updated_rows integer not null default 0,
  category_id bigint references categories(id) on delete set null,
  uploaded_by uuid references profiles(id) on delete set null,
  uploaded_at timestamptz not null default now(),
  status text not null default 'active', -- 'active' or 'revoked'
  revoked_at timestamptz,
  candidate_ids bigint[] not null default '{}'
);

create index if not exists idx_upload_batches_uploaded_at on upload_batches(uploaded_at desc);

alter table upload_batches enable row level security;
drop policy if exists "upload_batches_admin_all" on upload_batches;
create policy "upload_batches_admin_all" on upload_batches
  for all using (is_admin()) with check (is_admin());

-- 3. Create Activity History table (auditing admin actions, uploads, deletes, restores)
create table if not exists activity_history (
  id bigint generated always as identity primary key,
  action text not null,
  details text not null,
  performed_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_history_created_at on activity_history(created_at desc);

alter table activity_history enable row level security;
drop policy if exists "activity_history_admin_all" on activity_history;
create policy "activity_history_admin_all" on activity_history
  for all using (is_admin()) with check (is_admin());

-- 4. Purge candidates in recycle bin older than 7 days
create or replace function purge_old_deleted_candidates()
returns integer
language plpgsql
security definer
as $$
declare
  deleted_count integer;
begin
  delete from candidates
  where deleted_at is not null
  and deleted_at < now() - interval '7 days';
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

-- 5. Refresh full report view to safely include taluk and soft delete
drop view if exists v_full_report cascade;

create or replace view v_full_report as
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
  c.deleted_at,
  c.upload_batch_id,
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
  a.created_at as assessed_at
from assessments a
join candidates c on a.candidate_id = c.id
join profiles p on a.interviewer_id = p.id;

grant select on v_full_report to authenticated;

-- Force PostgREST to immediately refresh its schema cache
notify pgrst, 'reload schema';
