-- ==============================================================================
-- TAMIL NADU VOLUNTEERS (TNV) - ALLOW DUPLICATE / SHARED MOBILE NUMBERS
-- RUN THIS SCRIPT IN YOUR SUPABASE DASHBOARD -> SQL EDITOR:
-- Link: https://supabase.com/dashboard/project/xrwrxpxfijcqlldoqmsr/sql
-- Safe to run multiple times (idempotent).
-- ==============================================================================

-- 1. Explicitly drop known unique index and constraint names
drop index if exists idx_candidates_mobile_unique cascade;
alter table candidates drop constraint if exists candidates_candidate_mobile_key cascade;
alter table candidates drop constraint if exists candidates_mobile_unique cascade;

-- 2. Dynamically drop any other unique constraints on candidate_mobile (covers any auto-generated names)
do $$
declare
    r record;
begin
    -- Drop unique constraints
    for r in (
        select c.conname
        from pg_constraint c
        join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any(c.conkey)
        where c.conrelid = 'candidates'::regclass
          and c.contype = 'u'
          and a.attname = 'candidate_mobile'
    ) loop
        execute 'alter table candidates drop constraint if exists ' || quote_ident(r.conname) || ' cascade';
    end loop;

    -- Drop any remaining unique indexes on candidate_mobile
    for r in (
        select indexname
        from pg_indexes
        where tablename = 'candidates'
          and indexdef ilike '%unique%'
          and indexdef ilike '%candidate_mobile%'
    ) loop
        execute 'drop index if exists ' || quote_ident(r.indexname) || ' cascade';
    end loop;
end $$;

-- 3. Create normal, non-unique index on candidate_mobile for fast search & filtering
create index if not exists idx_candidates_mobile on candidates(candidate_mobile);

-- 4. Reload PostgREST schema cache
notify pgrst, 'reload schema';
