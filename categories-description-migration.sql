-- The categories table was missing a `description` column that the app
-- code (and its TypeScript types) already expected. Safe to run multiple
-- times.

alter table categories add column if not exists description text;

notify pgrst, 'reload schema';
