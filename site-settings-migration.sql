-- Adds a simple key-value site_settings table so admin-controlled homepage
-- content (starting with the hero image) doesn't need to be hardcoded in
-- code. Safe to run multiple times.

create table if not exists site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

alter table site_settings enable row level security;

-- Anyone (including anonymous visitors) can read site settings — this is
-- public homepage content, not sensitive data.
drop policy if exists "site_settings_public_read" on site_settings;
create policy "site_settings_public_read"
  on site_settings for select
  using (true);

-- No insert/update/delete policy is created on purpose: only the server's
-- admin (service-role) client — used exclusively by admin-only server
-- actions that already check requireAdmin() — can write to this table.
