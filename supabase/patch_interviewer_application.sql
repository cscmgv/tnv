-- ============================================================
-- Patch: interviewer self-registration via public form.
-- Adds the same demographic fields candidates give, to profiles,
-- so an interviewer's home area is on hand when an admin assigns
-- coverage. Safe to run multiple times.
-- ============================================================

alter table profiles add column if not exists district text;
alter table profiles add column if not exists assembly_constituency text;
alter table profiles add column if not exists panchayat_area text;
alter table profiles add column if not exists pincode text;
alter table profiles add column if not exists ngo text;
alter table profiles add column if not exists dob date;
alter table profiles add column if not exists current_tnv_role text;

notify pgrst, 'reload schema';
