-- ============================================================
-- Adds multi-category support: a candidate can belong to more than
-- one category at once. Run this once in the Supabase SQL Editor.
-- (Same content as the "CANDIDATE CATEGORIES" section appended to
-- schema.sql — kept here as a standalone patch for an existing DB.)
-- ============================================================

-- This database was never migrated with the allowed_categories column from
-- an earlier schema.sql revision (profiles predates it) — add it now since
-- the policies below reference it.
alter table profiles add column if not exists allowed_categories bigint[] not null default '{}';

create table if not exists candidate_categories (
  candidate_id  bigint not null references candidates(id) on delete cascade,
  category_id   bigint not null references categories(id) on delete cascade,
  created_at    timestamptz not null default now(),
  primary key (candidate_id, category_id)
);
create index if not exists idx_candidate_categories_candidate on candidate_categories(candidate_id);
create index if not exists idx_candidate_categories_category on candidate_categories(category_id);

alter table candidate_categories enable row level security;
drop policy if exists "candidate_categories_select_authenticated" on candidate_categories;
create policy "candidate_categories_select_authenticated" on candidate_categories
  for select using (auth.uid() is not null);
drop policy if exists "candidate_categories_admin_write" on candidate_categories;
create policy "candidate_categories_admin_write" on candidate_categories
  for all using (is_admin()) with check (is_admin());

insert into candidate_categories (candidate_id, category_id)
select id, category_id from candidates where category_id is not null
on conflict do nothing;

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
