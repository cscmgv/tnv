-- ============================================================
-- Patch: prevent two interviewers from taking the same candidate
-- at the same time. A lock is acquired atomically the moment an
-- interviewer starts scoring (startInterview), and expires on its
-- own after 30 minutes of inactivity so an abandoned interview
-- doesn't permanently block the candidate. Safe to run multiple times.
-- ============================================================

alter table candidates add column if not exists locked_by uuid references profiles(id) on delete set null;
alter table candidates add column if not exists locked_at timestamptz;

notify pgrst, 'reload schema';
