-- ============================================================
-- TNV Leadership Selection Portal â€” Schema (Supabase Auth based)
-- Run this once in the Supabase SQL Editor on a fresh project.
-- ============================================================

-- â”€â”€â”€ PROFILES (one row per auth.users, holds role) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null check (role in ('admin','interviewer')),
  reg_no      text unique,
  full_name   text not null,
  email       text,
  phone       text,
  is_active   boolean not null default true,
  profile_completed boolean not null default true,
  created_at  timestamptz not null default now()
);

-- is_admin() â€” SECURITY DEFINER so RLS on profiles itself doesn't recurse
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- â”€â”€â”€ CANDIDATES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
create table if not exists candidates (
  id                      bigint generated always as identity primary key,
  candidate_name          text not null,
  candidate_mobile        text not null,
  candidate_email         text,
  interview_date          date not null,
  district                text not null,
  assembly_constituency   text not null,
  panchayat_area          text not null,
  pincode                 text,
  ngo                     text,
  current_tnv_role        text,
  created_by              uuid references profiles(id),
  created_at              timestamptz not null default now()
);

-- â”€â”€â”€ ASSESSMENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
create table if not exists assessments (
  id                          bigint generated always as identity primary key,
  candidate_id                bigint not null references candidates(id) on delete cascade,
  interviewer_id               uuid not null references profiles(id),
  q1_score numeric, q2_score numeric, q3_score numeric, q4_score numeric,
  q5_score numeric, q6_score numeric, q7_score numeric, q8_score numeric,
  q9_score numeric, q10_score numeric, q11_score numeric, q12_score numeric,
  q13_score numeric, q14_score numeric, q15_score numeric, q16_score numeric,
  base_score                  numeric not null default 0,
  tie_breaker_applied         boolean not null default false,
  final_score                 numeric not null default 0,
  auto_suggested_role         text,
  additional_suggested_role   text,
  final_decision               text,
  verification_status         text default 'Pending',
  assessor_signature           text,
  additional_notes             text,
  assessed_at                  timestamptz not null default now()
);

create index if not exists idx_assessments_candidate on assessments(candidate_id);
create index if not exists idx_assessments_interviewer on assessments(interviewer_id);

-- â”€â”€â”€ VIEWS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
create or replace view v_full_report as
select
  a.id as assessment_id,
  a.candidate_id,
  c.interview_date,
  p.reg_no  as interviewer_reg_no,
  p.full_name as interviewer_name,
  p.email as interviewer_email,
  p.phone as interviewer_phone,
  c.candidate_name, c.candidate_mobile, c.candidate_email,
  c.district, c.assembly_constituency, c.panchayat_area, c.current_tnv_role,
  a.q1_score,a.q2_score,a.q3_score,a.q4_score,a.q5_score,a.q6_score,a.q7_score,a.q8_score,
  a.q9_score,a.q10_score,a.q11_score,a.q12_score,a.q13_score,a.q14_score,a.q15_score,a.q16_score,
  a.base_score, a.tie_breaker_applied, a.final_score,
  a.auto_suggested_role, a.additional_suggested_role, a.final_decision,
  a.verification_status, a.assessor_signature, a.additional_notes, a.assessed_at
from assessments a
join candidates c on c.id = a.candidate_id
join profiles p on p.id = a.interviewer_id;

create or replace view v_interviewer_summary as
select
  p.id, p.full_name, p.email, p.phone,
  count(a.id) as candidates_assessed,
  round(avg(a.final_score)::numeric, 1) as avg_candidate_score
from profiles p
left join assessments a on a.interviewer_id = p.id
where p.role = 'interviewer'
group by p.id, p.full_name, p.email, p.phone;

create or replace view v_role_distribution as
select auto_suggested_role as role, count(*) as count
from assessments
where auto_suggested_role is not null
group by auto_suggested_role;

-- â”€â”€â”€ ROW LEVEL SECURITY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
alter table profiles     enable row level security;
alter table candidates   enable row level security;
alter table assessments  enable row level security;

-- profiles
create policy "profiles_select_own_or_admin" on profiles
  for select using (id = auth.uid() or is_admin());
create policy "profiles_admin_insert" on profiles
  for insert with check (is_admin());
create policy "profiles_admin_update" on profiles
  for update using (is_admin());
create policy "profiles_admin_delete" on profiles
  for delete using (is_admin());

-- candidates: any active interviewer can insert; owner (created_by) or admin can select/update/delete
create policy "candidates_insert_active_user" on candidates
  for insert with check (
    auth.uid() is not null and
    exists (select 1 from profiles where id = auth.uid() and is_active)
  );
create policy "candidates_select_own_or_admin" on candidates
  for select using (created_by = auth.uid() or is_admin());
create policy "candidates_update_own_or_admin" on candidates
  for update using (created_by = auth.uid() or is_admin());
create policy "candidates_delete_admin_only" on candidates
  for delete using (is_admin());

-- assessments: interviewer can insert/select/update own; admin full access.
-- (The insert policy is tightened further down, once candidate scoping
-- columns exist, to also require the candidate be in the interviewer's scope.)
create policy "assessments_insert_own" on assessments
  for insert with check (interviewer_id = auth.uid());
create policy "assessments_select_own_or_admin" on assessments
  for select using (interviewer_id = auth.uid() or is_admin());
create policy "assessments_update_own_or_admin" on assessments
  for update using (interviewer_id = auth.uid() or is_admin());
create policy "assessments_delete_admin_only" on assessments
  for delete using (is_admin());

-- views need security_invoker so they inherit RLS of the caller (Postgres 15+/Supabase default)
alter view v_full_report set (security_invoker = true);
alter view v_interviewer_summary set (security_invoker = true);
alter view v_role_distribution set (security_invoker = true);

-- â”€â”€â”€ CATEGORIES (optional tags e.g. Panai, DrugFreeTN) â”€â”€â”€â”€â”€â”€â”€â”€
create table if not exists categories (
  id          bigint generated always as identity primary key,
  name        text not null unique,
  created_at  timestamptz not null default now()
);

alter table candidates add column if not exists category_id bigint references categories(id) on delete set null;
alter table candidates add column if not exists interview_completed boolean not null default true;
create index if not exists idx_candidates_category on candidates(category_id);

-- set the moment an interviewer opens the question wizard for this
-- candidate (before the assessment is actually saved), so the admin table
-- can distinguish "never started" from "started but abandoned partway".
alter table candidates add column if not exists interview_started boolean not null default false;

-- interviewer self-service onboarding: false until they open their invite
-- link, set a password, and fill in their own name/mobile.
alter table profiles add column if not exists profile_completed boolean not null default true;

-- admin assigns a pending candidate to a specific interviewer; that
-- interviewer's /interview list only shows candidates assigned to them.
alter table candidates add column if not exists assigned_to uuid references profiles(id) on delete set null;
create index if not exists idx_candidates_assigned_to on candidates(assigned_to);

create policy "candidates_select_assigned" on candidates
  for select using (assigned_to = auth.uid());
create policy "candidates_update_assigned" on candidates
  for update using (assigned_to = auth.uid());

-- district-based access: admin grants an interviewer one or more districts;
-- every pending candidate in those districts is automatically visible to
-- them, on top of (not instead of) any one-off assignment above.
alter table profiles add column if not exists allowed_districts text[] not null default '{}';

create policy "candidates_select_district_scope" on candidates
  for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and candidates.district = any (p.allowed_districts)
    )
  );
create policy "candidates_update_district_scope" on candidates
  for update using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and candidates.district = any (p.allowed_districts)
    )
  );

-- constituency-based access: same idea as district scope above, but scoped
-- to individual assembly constituencies for finer-grained coverage.
alter table profiles add column if not exists allowed_constituencies text[] not null default '{}';

create policy "candidates_select_constituency_scope" on candidates
  for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and candidates.assembly_constituency = any (p.allowed_constituencies)
    )
  );
create policy "candidates_update_constituency_scope" on candidates
  for update using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and candidates.assembly_constituency = any (p.allowed_constituencies)
    )
  );

-- pincode field on candidates + pincode-based access, same pattern as
-- district/constituency scope above.
alter table candidates add column if not exists pincode text;
alter table profiles add column if not exists allowed_pincodes text[] not null default '{}';

create policy "candidates_select_pincode_scope" on candidates
  for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and candidates.pincode = any (p.allowed_pincodes)
    )
  );
create policy "candidates_update_pincode_scope" on candidates
  for update using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and candidates.pincode = any (p.allowed_pincodes)
    )
  );

-- category-based access (a fourth coverage dimension in the admin's "Assign
-- Coverage" UI, alongside district/constituency/pincode) â€” same pattern:
-- any single match grants visibility. category_id already exists on
-- candidates by this point (added above, in the CATEGORIES section).
alter table profiles add column if not exists allowed_categories bigint[] not null default '{}';

create policy "candidates_select_category_scope" on candidates
  for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and candidates.category_id = any (p.allowed_categories)
    )
  );
create policy "candidates_update_category_scope" on candidates
  for update using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and candidates.category_id = any (p.allowed_categories)
    )
  );

-- v_full_report needs to be recreated (not just altered) to expose the new
-- pincode column â€” CREATE OR REPLACE is safe to re-run.
create or replace view v_full_report as
select
  a.id as assessment_id,
  a.candidate_id,
  c.interview_date,
  p.reg_no  as interviewer_reg_no,
  p.full_name as interviewer_name,
  p.email as interviewer_email,
  p.phone as interviewer_phone,
  c.candidate_name, c.candidate_mobile, c.candidate_email,
  c.district, c.assembly_constituency, c.panchayat_area, c.pincode, c.current_tnv_role,
  a.q1_score,a.q2_score,a.q3_score,a.q4_score,a.q5_score,a.q6_score,a.q7_score,a.q8_score,
  a.q9_score,a.q10_score,a.q11_score,a.q12_score,a.q13_score,a.q14_score,a.q15_score,a.q16_score,
  a.base_score, a.tie_breaker_applied, a.final_score,
  a.auto_suggested_role, a.additional_suggested_role, a.final_decision,
  a.verification_status, a.assessor_signature, a.additional_notes, a.assessed_at
from assessments a
join candidates c on c.id = a.candidate_id
join profiles p on p.id = a.interviewer_id;
alter view v_full_report set (security_invoker = true);

-- NGO the candidate belongs to (plain informational field, no access scoping).
alter table candidates add column if not exists ngo text;

-- v_full_report needs to be recreated again to expose ngo.
create or replace view v_full_report as
select
  a.id as assessment_id,
  a.candidate_id,
  c.interview_date,
  p.reg_no  as interviewer_reg_no,
  p.full_name as interviewer_name,
  p.email as interviewer_email,
  p.phone as interviewer_phone,
  c.candidate_name, c.candidate_mobile, c.candidate_email,
  c.district, c.assembly_constituency, c.panchayat_area, c.pincode, c.ngo, c.current_tnv_role,
  a.q1_score,a.q2_score,a.q3_score,a.q4_score,a.q5_score,a.q6_score,a.q7_score,a.q8_score,
  a.q9_score,a.q10_score,a.q11_score,a.q12_score,a.q13_score,a.q14_score,a.q15_score,a.q16_score,
  a.base_score, a.tie_breaker_applied, a.final_score,
  a.auto_suggested_role, a.additional_suggested_role, a.final_decision,
  a.verification_status, a.assessor_signature, a.additional_notes, a.assessed_at
from assessments a
join candidates c on c.id = a.candidate_id
join profiles p on p.id = a.interviewer_id;
alter view v_full_report set (security_invoker = true);

-- SECURITY FIX: the original assessments_insert_own policy only checked
-- interviewer_id = auth.uid() â€” it never checked that candidate_id was
-- actually in that interviewer's scope, letting any interviewer write an
-- assessment for any candidate. Tighten it now that scoping columns exist.
drop policy if exists "assessments_insert_own" on assessments;
create policy "assessments_insert_own" on assessments
  for insert with check (
    interviewer_id = auth.uid()
    and exists (
      select 1 from candidates c
      where c.id = assessments.candidate_id
      and (
        c.assigned_to = auth.uid()
        or c.created_by = auth.uid()
        or exists (
          select 1 from profiles p
          where p.id = auth.uid()
          and (
            c.district = any (p.allowed_districts)
            or c.assembly_constituency = any (p.allowed_constituencies)
            or c.pincode = any (p.allowed_pincodes)
            or c.category_id = any (p.allowed_categories)
          )
        )
      )
    )
  );

-- â”€â”€â”€ CALL LOGS (every call attempt made to a candidate) â”€â”€â”€â”€â”€â”€â”€â”€
create table if not exists call_logs (
  id            bigint generated always as identity primary key,
  candidate_id  bigint not null references candidates(id) on delete cascade,
  interviewer_id uuid not null references profiles(id),
  status        text not null check (status in ('Attending','Not Attending','Postponed','No Answer')),
  notes         text,
  called_at     timestamptz not null default now()
);

create index if not exists idx_call_logs_candidate on call_logs(candidate_id);

alter table call_logs enable row level security;

-- (call_logs_insert_own is tightened further down, alongside the
-- assessments_insert_own fix, to also require the candidate be in scope.)
create policy "call_logs_insert_own" on call_logs
  for insert with check (interviewer_id = auth.uid());

create policy "call_logs_select_scope" on call_logs
  for select using (
    interviewer_id = auth.uid()
    or is_admin()
    or exists (
      select 1 from candidates c
      where c.id = call_logs.candidate_id
      and (
        c.assigned_to = auth.uid()
        or c.created_by = auth.uid()
        or exists (
          select 1 from profiles p
          where p.id = auth.uid()
          and (
            c.district = any (p.allowed_districts)
            or c.assembly_constituency = any (p.allowed_constituencies)
            or c.pincode = any (p.allowed_pincodes)
            or c.category_id = any (p.allowed_categories)
          )
        )
      )
    )
  );

create policy "call_logs_delete_admin_only" on call_logs
  for delete using (is_admin());

-- SECURITY FIX: the original call_logs_insert_own policy only checked
-- interviewer_id = auth.uid() â€” it never checked that candidate_id was in
-- that interviewer's scope, letting any interviewer log a call against any
-- candidate. Tighten it to match call_logs_select_scope above.
drop policy if exists "call_logs_insert_own" on call_logs;
create policy "call_logs_insert_own" on call_logs
  for insert with check (
    interviewer_id = auth.uid()
    and exists (
      select 1 from candidates c
      where c.id = call_logs.candidate_id
      and (
        c.assigned_to = auth.uid()
        or c.created_by = auth.uid()
        or exists (
          select 1 from profiles p
          where p.id = auth.uid()
          and (
            c.district = any (p.allowed_districts)
            or c.assembly_constituency = any (p.allowed_constituencies)
            or c.pincode = any (p.allowed_pincodes)
            or c.category_id = any (p.allowed_categories)
          )
        )
      )
    )
  );

alter table categories enable row level security;
create policy "categories_select_authenticated" on categories
  for select using (auth.uid() is not null);
create policy "categories_admin_insert" on categories
  for insert with check (is_admin());
create policy "categories_admin_update" on categories
  for update using (is_admin());
create policy "categories_admin_delete" on categories
  for delete using (is_admin());

insert into categories (name) values ('Panai'), ('DrugFreeTN')
on conflict (name) do nothing;

-- candidate mobile number is the unique identifier for a candidate â€” no two
-- candidate rows may share the same mobile number. If this fails with a
-- duplicate-key error, find and merge/delete the existing duplicates first:
--   select candidate_mobile, count(*) from candidates group by candidate_mobile having count(*) > 1;
create unique index if not exists idx_candidates_mobile_unique on candidates(candidate_mobile);

-- stable, persistent serial number â€” assigned once at creation (in creation
-- order), shown everywhere (table, forms, Excel export) instead of a row
-- index that shifts when the list is sorted/filtered.
create sequence if not exists candidates_serial_seq;
alter table candidates add column if not exists serial_number bigint;

update candidates set serial_number = sub.rn
from (
  select id, row_number() over (order by created_at, id) as rn
  from candidates
  where serial_number is null
) sub
where candidates.id = sub.id;

select setval('candidates_serial_seq', coalesce((select max(serial_number) from candidates), 0));
alter table candidates alter column serial_number set default nextval('candidates_serial_seq');
alter table candidates alter column serial_number set not null;
create unique index if not exists idx_candidates_serial_unique on candidates(serial_number);

-- v_full_report needs to be recreated (DROP + CREATE, not CREATE OR
-- REPLACE â€” see the pincode/ngo migration above for why) to expose
-- serial_number.
drop view if exists v_full_report;
create view v_full_report as
select
  a.id as assessment_id,
  a.candidate_id,
  c.serial_number,
  c.interview_date,
  p.reg_no  as interviewer_reg_no,
  p.full_name as interviewer_name,
  p.email as interviewer_email,
  p.phone as interviewer_phone,
  c.candidate_name, c.candidate_mobile, c.candidate_email,
  c.district, c.assembly_constituency, c.panchayat_area, c.pincode, c.ngo, c.current_tnv_role,
  a.q1_score,a.q2_score,a.q3_score,a.q4_score,a.q5_score,a.q6_score,a.q7_score,a.q8_score,
  a.q9_score,a.q10_score,a.q11_score,a.q12_score,a.q13_score,a.q14_score,a.q15_score,a.q16_score,
  a.base_score, a.tie_breaker_applied, a.final_score,
  a.auto_suggested_role, a.additional_suggested_role, a.final_decision,
  a.verification_status, a.assessor_signature, a.additional_notes, a.assessed_at
from assessments a
join candidates c on c.id = a.candidate_id
join profiles p on p.id = a.interviewer_id;
alter view v_full_report set (security_invoker = true);

-- date of birth â€” age is computed at display time from this, never stored
-- (a stored age column would silently go stale).
alter table candidates add column if not exists dob date;

drop view if exists v_full_report;
create view v_full_report as
select
  a.id as assessment_id,
  a.candidate_id,
  c.serial_number,
  c.interview_date,
  p.reg_no  as interviewer_reg_no,
  p.full_name as interviewer_name,
  p.email as interviewer_email,
  p.phone as interviewer_phone,
  c.candidate_name, c.candidate_mobile, c.candidate_email,
  c.district, c.assembly_constituency, c.panchayat_area, c.pincode, c.ngo, c.dob, c.current_tnv_role,
  a.q1_score,a.q2_score,a.q3_score,a.q4_score,a.q5_score,a.q6_score,a.q7_score,a.q8_score,
  a.q9_score,a.q10_score,a.q11_score,a.q12_score,a.q13_score,a.q14_score,a.q15_score,a.q16_score,
  a.base_score, a.tie_breaker_applied, a.final_score,
  a.auto_suggested_role, a.additional_suggested_role, a.final_decision,
  a.verification_status, a.assessor_signature, a.additional_notes, a.assessed_at
from assessments a
join candidates c on c.id = a.candidate_id
join profiles p on p.id = a.interviewer_id;
alter view v_full_report set (security_invoker = true);

-- Any active interviewer may READ every candidate (name/mobile/district/
-- status â€” for the "All Candidates" browse tab), on top of (not instead
-- of) the narrower scoped policies above. This does NOT grant write access:
-- the insert/update policies on candidates/assessments/call_logs are
-- unaffected and still require the candidate be in that interviewer's own
-- scope, so an interviewer still can't take/edit an interview or log a
-- call for a candidate outside their assignment/district/constituency/
-- pincode â€” they can only look.
create policy "candidates_select_all_active_interviewers" on candidates
  for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'interviewer' and p.is_active
    )
  );

-- Lets an interviewer "claim" (self-assign) a candidate they can see in the
-- All Candidates browse tab but who isn't in their normal scope and isn't
-- already assigned to anyone â€” this is what makes "Take Interview" work for
-- those rows. USING requires the row be currently unclaimed and pending;
-- WITH CHECK forces the only allowed change to be assigning it to *this*
-- interviewer (they can't reassign it to someone else, and they can't touch
-- a candidate someone else already claimed).
create policy "candidates_claim_unassigned" on candidates
  for update using (
    assigned_to is null
    and interview_completed = false
    and exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'interviewer' and p.is_active
    )
  )
  with check (assigned_to = auth.uid());

-- â”€â”€â”€ CANDIDATE CATEGORIES (many-to-many) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- A candidate can belong to several categories at once (e.g. imported into
-- both "Panai" and "DrugFreeTN"). candidates.category_id above is kept as a
-- legacy/primary pointer for existing scoping code, but membership display
-- and new imports/assignments go through this junction table so a candidate
-- can show up under more than one category.
create table if not exists candidate_categories (
  candidate_id  bigint not null references candidates(id) on delete cascade,
  category_id   bigint not null references categories(id) on delete cascade,
  created_at    timestamptz not null default now(),
  primary key (candidate_id, category_id)
);
create index if not exists idx_candidate_categories_candidate on candidate_categories(candidate_id);
create index if not exists idx_candidate_categories_category on candidate_categories(category_id);

alter table candidate_categories enable row level security;
create policy "candidate_categories_select_authenticated" on candidate_categories
  for select using (auth.uid() is not null);
create policy "candidate_categories_admin_write" on candidate_categories
  for all using (is_admin()) with check (is_admin());

-- backfill existing single-category assignments into the junction table
insert into candidate_categories (candidate_id, category_id)
select id, category_id from candidates where category_id is not null
on conflict do nothing;

-- category-scope RLS now also matches via the multi-category junction table,
-- not just the legacy single category_id column.
drop policy if exists "candidates_select_category_scope" on candidates;
create policy "candidates_select_category_scope" on candidates
  for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and (
        candidates.category_id = any (p.allowed_categories)
        or exists (
          select 1 from candidate_categories cc
          where cc.candidate_id = candidates.id and cc.category_id = any (p.allowed_categories)
        )
      )
    )
  );
drop policy if exists "candidates_update_category_scope" on candidates;
create policy "candidates_update_category_scope" on candidates
  for update using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and (
        candidates.category_id = any (p.allowed_categories)
        or exists (
          select 1 from candidate_categories cc
          where cc.candidate_id = candidates.id and cc.category_id = any (p.allowed_categories)
        )
      )
    )
  );

drop policy if exists "assessments_insert_own" on assessments;
create policy "assessments_insert_own" on assessments
  for insert with check (
    interviewer_id = auth.uid()
    and exists (
      select 1 from candidates c
      where c.id = assessments.candidate_id
      and (
        c.assigned_to = auth.uid()
        or c.created_by = auth.uid()
        or exists (
          select 1 from profiles p
          where p.id = auth.uid()
          and (
            c.district = any (p.allowed_districts)
            or c.assembly_constituency = any (p.allowed_constituencies)
            or c.pincode = any (p.allowed_pincodes)
            or c.category_id = any (p.allowed_categories)
            or exists (
              select 1 from candidate_categories cc
              where cc.candidate_id = c.id and cc.category_id = any (p.allowed_categories)
            )
          )
        )
      )
    )
  );

drop policy if exists "call_logs_insert_own" on call_logs;
create policy "call_logs_insert_own" on call_logs
  for insert with check (
    interviewer_id = auth.uid()
    and exists (
      select 1 from candidates c
      where c.id = call_logs.candidate_id
      and (
        c.assigned_to = auth.uid()
        or c.created_by = auth.uid()
        or exists (
          select 1 from profiles p
          where p.id = auth.uid()
          and (
            c.district = any (p.allowed_districts)
            or c.assembly_constituency = any (p.allowed_constituencies)
            or c.pincode = any (p.allowed_pincodes)
            or c.category_id = any (p.allowed_categories)
            or exists (
              select 1 from candidate_categories cc
              where cc.candidate_id = c.id and cc.category_id = any (p.allowed_categories)
            )
          )
        )
      )
    )
  );

-- â”€â”€â”€ INTERVIEWER COVERAGE (nested category â†’ district â†’ constituency) â”€â”€
-- Replaces the old flat allowed_districts/allowed_constituencies/
-- allowed_categories arrays (any single match granted access, regardless
-- of category) with an explicit rule set: each row grants an interviewer
-- visibility over every candidate in `category_id`, optionally narrowed to
-- one district and, within that, one constituency (null at either level
-- means "all"). Those legacy columns stay on `profiles` (still used by the
-- separate, untouched pincode-scope grant) but are otherwise no longer
-- consulted for candidate visibility.
create table if not exists interviewer_coverage (
  id             bigint generated always as identity primary key,
  interviewer_id uuid not null references profiles(id) on delete cascade,
  category_id    bigint not null references categories(id) on delete cascade,
  district       text,
  constituency   text,
  created_at     timestamptz not null default now()
);
create index if not exists idx_interviewer_coverage_interviewer on interviewer_coverage(interviewer_id);
create index if not exists idx_interviewer_coverage_category on interviewer_coverage(category_id);

alter table interviewer_coverage enable row level security;
drop policy if exists "interviewer_coverage_select_own_or_admin" on interviewer_coverage;
create policy "interviewer_coverage_select_own_or_admin" on interviewer_coverage
  for select using (interviewer_id = auth.uid() or is_admin());
drop policy if exists "interviewer_coverage_admin_write" on interviewer_coverage;
create policy "interviewer_coverage_admin_write" on interviewer_coverage
  for all using (is_admin()) with check (is_admin());

create or replace function candidate_in_interviewer_coverage(p_candidate_id bigint, p_interviewer_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $fn$
  select exists (
    select 1
    from interviewer_coverage ic
    join candidate_categories cc on cc.category_id = ic.category_id and cc.candidate_id = p_candidate_id
    join candidates c on c.id = p_candidate_id
    where ic.interviewer_id = p_interviewer_id
      and (ic.district is null or ic.district = c.district)
      and (ic.constituency is null or ic.constituency = c.assembly_constituency)
  );
$fn$;

-- Drop the old flat district/constituency/category scope policies, the
-- broad "any active interviewer can browse every candidate" policy (which
-- existed only to support claiming an out-of-scope candidate), and the
-- claim-unassigned policy that depended on it â€” an interviewer no longer
-- sees candidates outside their assigned coverage at all.
drop policy if exists "candidates_select_district_scope" on candidates;
drop policy if exists "candidates_select_constituency_scope" on candidates;
drop policy if exists "candidates_select_category_scope" on candidates;
drop policy if exists "candidates_update_district_scope" on candidates;
drop policy if exists "candidates_update_constituency_scope" on candidates;
drop policy if exists "candidates_update_category_scope" on candidates;
drop policy if exists "candidates_select_all_active_interviewers" on candidates;
drop policy if exists "candidates_claim_unassigned" on candidates;

create policy "candidates_select_coverage_scope" on candidates
  for select using (candidate_in_interviewer_coverage(candidates.id, auth.uid()));
create policy "candidates_update_coverage_scope" on candidates
  for update using (candidate_in_interviewer_coverage(candidates.id, auth.uid()));

drop policy if exists "assessments_insert_own" on assessments;
create policy "assessments_insert_own" on assessments
  for insert with check (
    interviewer_id = auth.uid()
    and exists (
      select 1 from candidates c
      where c.id = assessments.candidate_id
      and (
        c.assigned_to = auth.uid()
        or c.created_by = auth.uid()
        or exists (select 1 from profiles p where p.id = auth.uid() and c.pincode = any (p.allowed_pincodes))
        or candidate_in_interviewer_coverage(c.id, auth.uid())
      )
    )
  );

drop policy if exists "call_logs_insert_own" on call_logs;
create policy "call_logs_insert_own" on call_logs
  for insert with check (
    interviewer_id = auth.uid()
    and exists (
      select 1 from candidates c
      where c.id = call_logs.candidate_id
      and (
        c.assigned_to = auth.uid()
        or c.created_by = auth.uid()
        or exists (select 1 from profiles p where p.id = auth.uid() and c.pincode = any (p.allowed_pincodes))
        or candidate_in_interviewer_coverage(c.id, auth.uid())
      )
    )
  );

drop policy if exists "call_logs_select_scope" on call_logs;
create policy "call_logs_select_scope" on call_logs
  for select using (
    interviewer_id = auth.uid()
    or is_admin()
    or exists (
      select 1 from candidates c
      where c.id = call_logs.candidate_id
      and (
        c.assigned_to = auth.uid()
        or c.created_by = auth.uid()
        or exists (select 1 from profiles p where p.id = auth.uid() and c.pincode = any (p.allowed_pincodes))
        or candidate_in_interviewer_coverage(c.id, auth.uid())
      )
    )
  );

-- ============================================================
-- After running this file:
-- 1. Create the first admin user in Supabase Dashboard â†’ Authentication â†’ Users â†’ Add User
--    (or via the /supabase/create-admin.sql helper below, replacing values).
-- 2. Insert a matching row into `profiles` with role='admin'.
-- ============================================================


-- ============================================================
-- ALL PATCHES CONSOLIDATED (Interviewer Profile, Locks, Indexes)
-- ============================================================

-- 1. Profiles demographic columns for interviewer application
alter table profiles add column if not exists district text;
alter table profiles add column if not exists assembly_constituency text;
alter table profiles add column if not exists panchayat_area text;
alter table profiles add column if not exists pincode text;
alter table profiles add column if not exists ngo text;
alter table profiles add column if not exists dob date;
alter table profiles add column if not exists current_tnv_role text;

-- 2. Candidate concurrency locking
alter table candidates add column if not exists locked_by uuid references profiles(id) on delete set null;
alter table candidates add column if not exists locked_at timestamptz;

-- 3. Performance Indexes
create index if not exists idx_candidates_completed_created on candidates(interview_completed, created_at desc);
create index if not exists idx_profiles_role_active on profiles(role, is_active);
create index if not exists idx_candidates_district on candidates(district);
create index if not exists idx_candidates_constituency on candidates(assembly_constituency);

notify pgrst, 'reload schema';
