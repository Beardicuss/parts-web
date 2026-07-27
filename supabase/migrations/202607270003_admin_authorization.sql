-- Explicit admin authorization and MFA-enforced catalog mutations.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  note text not null default ''
);

alter table public.admin_users enable row level security;

drop policy if exists "Admins can read own membership" on public.admin_users;
create policy "Admins can read own membership"
  on public.admin_users
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function private.is_catalog_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_catalog_admin() from public;
grant execute on function private.is_catalog_admin() to authenticated;

drop policy if exists "Authenticated write brands" on public.brands;
drop policy if exists "Catalog admins write brands" on public.brands;
create policy "Catalog admins write brands"
  on public.brands
  for all
  to authenticated
  using (
    (select private.is_catalog_admin())
    and coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2'
  )
  with check (
    (select private.is_catalog_admin())
    and coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2'
  );

drop policy if exists "Authenticated write categories" on public.categories;
drop policy if exists "Catalog admins write categories" on public.categories;
create policy "Catalog admins write categories"
  on public.categories
  for all
  to authenticated
  using (
    (select private.is_catalog_admin())
    and coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2'
  )
  with check (
    (select private.is_catalog_admin())
    and coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2'
  );

drop policy if exists "Authenticated write parts" on public.parts;
drop policy if exists "Catalog admins write parts" on public.parts;
create policy "Catalog admins write parts"
  on public.parts
  for all
  to authenticated
  using (
    (select private.is_catalog_admin())
    and coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2'
  )
  with check (
    (select private.is_catalog_admin())
    and coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2'
  );

drop policy if exists "Authenticated upload part images" on storage.objects;
drop policy if exists "Authenticated update part images" on storage.objects;
drop policy if exists "Authenticated delete part images" on storage.objects;
drop policy if exists "Catalog admins upload part images" on storage.objects;
drop policy if exists "Catalog admins update part images" on storage.objects;
drop policy if exists "Catalog admins delete part images" on storage.objects;

create policy "Catalog admins upload part images"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'part-images'
    and (select private.is_catalog_admin())
    and coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2'
  );

create policy "Catalog admins update part images"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'part-images'
    and (select private.is_catalog_admin())
    and coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2'
  )
  with check (
    bucket_id = 'part-images'
    and (select private.is_catalog_admin())
    and coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2'
  );

create policy "Catalog admins delete part images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'part-images'
    and (select private.is_catalog_admin())
    and coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2'
  );

update storage.buckets
set
  public = true,
  file_size_limit = 8388608,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']::text[]
where id = 'part-images';
