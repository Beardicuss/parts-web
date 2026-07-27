begin;

do $$
declare
  policy_count integer;
  bucket_limit bigint;
  bucket_types text[];
begin
  if to_regclass('public.admin_users') is null then
    raise exception 'admin_users table is missing';
  end if;

  if to_regprocedure('private.is_catalog_admin()') is null then
    raise exception 'admin authorization helper is missing';
  end if;

  select count(*) into policy_count
  from pg_policies
  where schemaname = 'public'
    and tablename in ('brands', 'categories', 'parts')
    and policyname like 'Catalog admins write %';
  if policy_count <> 3 then
    raise exception 'Expected 3 admin-only catalog write policies, found %', policy_count;
  end if;

  if exists (
    select 1 from pg_policies
    where policyname like 'Authenticated write %'
  ) then
    raise exception 'Legacy authenticated-user write policy still exists';
  end if;

  select file_size_limit, allowed_mime_types
  into bucket_limit, bucket_types
  from storage.buckets
  where id = 'part-images';

  if bucket_limit <> 8388608 then
    raise exception 'part-images bucket size limit is not 8 MB';
  end if;
  if bucket_types is distinct from array['image/jpeg', 'image/png', 'image/webp']::text[] then
    raise exception 'part-images MIME allowlist is incorrect';
  end if;
end
$$;

rollback;
