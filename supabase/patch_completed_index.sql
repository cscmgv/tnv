-- ============================================================
-- Patch: index the hottest query path in the app — every admin and
-- interviewer dashboard load filters candidates by interview_completed
-- and orders pending ones by created_at. A composite index covers both
-- the filter and the sort in one pass instead of a sequential scan.
-- Safe to run multiple times.
-- ============================================================

create index if not exists idx_candidates_completed_created on candidates(interview_completed, created_at desc);
create index if not exists idx_profiles_role_active on profiles(role, is_active);

notify pgrst, 'reload schema';
