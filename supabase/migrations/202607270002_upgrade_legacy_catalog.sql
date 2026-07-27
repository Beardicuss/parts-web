-- Idempotent upgrade for projects initialized with the former schema.sql.

alter table public.parts add column if not exists replacement_codes text not null default '';
alter table public.parts add column if not exists compatible_models text not null default '';

update public.brands set name_en = btrim(name_en), name_ka = btrim(name_ka);
update public.categories set name_en = btrim(name_en), name_ka = btrim(name_ka);
update public.parts
set
  code = btrim(code),
  title_en = btrim(title_en),
  title_ka = btrim(title_ka),
  description_en = coalesce(description_en, ''),
  description_ka = coalesce(description_ka, ''),
  image_path = coalesce(image_path, ''),
  replacement_codes = coalesce(replacement_codes, ''),
  compatible_models = coalesce(compatible_models, ''),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

alter table public.parts alter column description_en set not null;
alter table public.parts alter column description_ka set not null;
alter table public.parts alter column image_path set not null;
alter table public.parts alter column created_at set not null;
alter table public.parts alter column updated_at set not null;

alter table public.parts drop constraint if exists parts_brand_id_fkey;
alter table public.parts
  add constraint parts_brand_id_fkey foreign key (brand_id)
  references public.brands(id) on delete restrict;
alter table public.parts drop constraint if exists parts_category_id_fkey;
alter table public.parts
  add constraint parts_category_id_fkey foreign key (category_id)
  references public.categories(id) on delete restrict;

alter table public.brands drop constraint if exists brands_name_en_trimmed;
alter table public.brands
  add constraint brands_name_en_trimmed check (name_en = btrim(name_en) and name_en <> '');
alter table public.brands drop constraint if exists brands_name_ka_trimmed;
alter table public.brands
  add constraint brands_name_ka_trimmed check (name_ka = btrim(name_ka) and name_ka <> '');
alter table public.categories drop constraint if exists categories_name_en_trimmed;
alter table public.categories
  add constraint categories_name_en_trimmed check (name_en = btrim(name_en) and name_en <> '');
alter table public.categories drop constraint if exists categories_name_ka_trimmed;
alter table public.categories
  add constraint categories_name_ka_trimmed check (name_ka = btrim(name_ka) and name_ka <> '');
alter table public.parts drop constraint if exists parts_code_trimmed;
alter table public.parts
  add constraint parts_code_trimmed check (code = btrim(code) and code <> '');
alter table public.parts drop constraint if exists parts_title_en_trimmed;
alter table public.parts
  add constraint parts_title_en_trimmed check (title_en = btrim(title_en) and title_en <> '');
alter table public.parts drop constraint if exists parts_title_ka_trimmed;
alter table public.parts
  add constraint parts_title_ka_trimmed check (title_ka = btrim(title_ka) and title_ka <> '');

create unique index if not exists brands_name_en_ci_unique
  on public.brands (lower(btrim(name_en)));
create unique index if not exists categories_name_en_ci_unique
  on public.categories (lower(btrim(name_en)));
create unique index if not exists parts_code_ci_unique
  on public.parts (lower(btrim(code)));
create index if not exists parts_created_at_idx on public.parts (created_at desc, id desc);

-- Explicit IDs in the legacy seed did not advance identity sequences.
select setval(
  pg_get_serial_sequence('public.brands', 'id'),
  coalesce((select max(id) from public.brands), 1),
  exists(select 1 from public.brands)
);
select setval(
  pg_get_serial_sequence('public.categories', 'id'),
  coalesce((select max(id) from public.categories), 1),
  exists(select 1 from public.categories)
);
select setval(
  pg_get_serial_sequence('public.parts', 'id'),
  coalesce((select max(id) from public.parts), 1),
  exists(select 1 from public.parts)
);
