-- ============================================================
-- Patch: Recycle Bin (Soft Delete), Excel Upload Batch Revoke, and Activity History
-- Safe to run multiple times.
-- ============================================================

-- 1. Soft delete and batch tracking columns on candidates
alter table candidates add column if not exists deleted_at timestamptz default null;
alter table candidates add column if not exists upload_batch_id text default null;

create index if not exists idx_candidates_deleted_at on candidates(deleted_at);
create index if not exists idx_candidates_upload_batch on candidates(upload_batch_id);

-- 2. Upload Batches table (to track and revoke mistakenly uploaded spreadsheets)
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

-- 3. Activity History table (auditing admin actions, uploads, deletes, restores)
create table if not exists activity_history (
  id bigint generated always as identity primary key,
  action text not null, -- 'upload_excel', 'revoke_upload', 'delete_candidate', 'restore_candidate', 'permanent_delete', etc.
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

notify pgrst, 'reload schema';
