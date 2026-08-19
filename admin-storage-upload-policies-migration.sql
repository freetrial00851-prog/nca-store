-- Allows admin users to upload directly from the browser to Storage
-- (bypassing Vercel's hard 4.5MB serverless-function body limit, which
-- next.config.ts's serverActions.bodySizeLimit CANNOT override — it's a
-- platform-level restriction). Reads stay exactly as before (buckets are
-- already public for reads). Safe to run multiple times.

-- Defensive: the storage policies above subquery the roles table. If RLS is
-- enabled on `roles` with no SELECT policy, that subquery could silently
-- return nothing even for real admins. This lets any authenticated user
-- read only their OWN role row — safe, and a no-op if a policy already exists.
drop policy if exists "users_read_own_role" on roles;
create policy "users_read_own_role"
  on roles for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "admin_insert_product_images" on storage.objects;
create policy "admin_insert_product_images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from roles where roles.user_id = auth.uid() and roles.role = 'admin')
  );

drop policy if exists "admin_update_product_images" on storage.objects;
create policy "admin_update_product_images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'product-images'
    and exists (select 1 from roles where roles.user_id = auth.uid() and roles.role = 'admin')
  );

drop policy if exists "admin_insert_pattern_files" on storage.objects;
create policy "admin_insert_pattern_files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'pattern-files'
    and exists (select 1 from roles where roles.user_id = auth.uid() and roles.role = 'admin')
  );

drop policy if exists "admin_update_pattern_files" on storage.objects;
create policy "admin_update_pattern_files"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'pattern-files'
    and exists (select 1 from roles where roles.user_id = auth.uid() and roles.role = 'admin')
  );
