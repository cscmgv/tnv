-- ============================================================
-- Patch: index district/constituency filtering on candidates.
-- Coverage rules and the admin/interviewer list pages both filter by
-- these columns; as the table grows past a few thousand rows this keeps
-- those lookups off a full sequential scan. Safe to run multiple times.
-- ============================================================

create index if not exists idx_candidates_district on candidates(district);
create index if not exists idx_candidates_constituency on candidates(assembly_constituency);

notify pgrst, 'reload schema';
