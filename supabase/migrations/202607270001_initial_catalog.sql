-- Canonical catalog schema for fresh Supabase projects.

create table if not exists public.brands (
  id bigint generated always as identity primary key,
  name_en text not null,
  name_ka text not null,
  constraint brands_name_en_trimmed check (name_en = btrim(name_en) and name_en <> ''),
  constraint brands_name_ka_trimmed check (name_ka = btrim(name_ka) and name_ka <> '')
);

create table if not exists public.categories (
  id bigint generated always as identity primary key,
  name_en text not null,
  name_ka text not null,
  constraint categories_name_en_trimmed check (name_en = btrim(name_en) and name_en <> ''),
  constraint categories_name_ka_trimmed check (name_ka = btrim(name_ka) and name_ka <> '')
);

create table if not exists public.parts (
  id bigint generated always as identity primary key,
  code text not null,
  replacement_codes text not null default '',
  compatible_models text not null default '',
  title_en text not null,
  title_ka text not null,
  description_en text not null default '',
  description_ka text not null default '',
  brand_id bigint references public.brands(id) on delete restrict,
  category_id bigint references public.categories(id) on delete restrict,
  image_path text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint parts_code_trimmed check (code = btrim(code) and code <> ''),
  constraint parts_title_en_trimmed check (title_en = btrim(title_en) and title_en <> ''),
  constraint parts_title_ka_trimmed check (title_ka = btrim(title_ka) and title_ka <> '')
);

create unique index if not exists brands_name_en_ci_unique
  on public.brands (lower(btrim(name_en)));
create unique index if not exists categories_name_en_ci_unique
  on public.categories (lower(btrim(name_en)));
create unique index if not exists parts_code_ci_unique
  on public.parts (lower(btrim(code)));
create index if not exists parts_brand_id_idx on public.parts (brand_id);
create index if not exists parts_category_id_idx on public.parts (category_id);
create index if not exists parts_created_at_idx on public.parts (created_at desc, id desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists parts_updated_at on public.parts;
create trigger parts_updated_at
  before update on public.parts
  for each row execute function public.set_updated_at();

alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.parts enable row level security;

drop policy if exists "Public read brands" on public.brands;
create policy "Public read brands" on public.brands for select using (true);
drop policy if exists "Authenticated write brands" on public.brands;
create policy "Authenticated write brands" on public.brands for all
  using ((select auth.role()) = 'authenticated')
  with check ((select auth.role()) = 'authenticated');

drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories" on public.categories for select using (true);
drop policy if exists "Authenticated write categories" on public.categories;
create policy "Authenticated write categories" on public.categories for all
  using ((select auth.role()) = 'authenticated')
  with check ((select auth.role()) = 'authenticated');

drop policy if exists "Public read parts" on public.parts;
create policy "Public read parts" on public.parts for select using (true);
drop policy if exists "Authenticated write parts" on public.parts;
create policy "Authenticated write parts" on public.parts for all
  using ((select auth.role()) = 'authenticated')
  with check ((select auth.role()) = 'authenticated');

insert into storage.buckets (id, name, public)
values ('part-images', 'part-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read part images" on storage.objects;
create policy "Public read part images" on storage.objects
  for select using (bucket_id = 'part-images');
drop policy if exists "Authenticated upload part images" on storage.objects;
create policy "Authenticated upload part images" on storage.objects
  for insert with check (bucket_id = 'part-images' and (select auth.role()) = 'authenticated');
drop policy if exists "Authenticated update part images" on storage.objects;
create policy "Authenticated update part images" on storage.objects
  for update
  using (bucket_id = 'part-images' and (select auth.role()) = 'authenticated')
  with check (bucket_id = 'part-images' and (select auth.role()) = 'authenticated');
drop policy if exists "Authenticated delete part images" on storage.objects;
create policy "Authenticated delete part images" on storage.objects
  for delete using (bucket_id = 'part-images' and (select auth.role()) = 'authenticated');
