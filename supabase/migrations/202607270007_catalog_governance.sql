begin;

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'parts'
      and column_name = 'publication_status'
  ) then
    alter table public.parts
      add column publication_status text not null default 'draft';

    -- Preserve the currently visible catalog only on the first application.
    update public.parts
    set publication_status = 'published';
  end if;
end;
$$;

alter table public.parts
  drop constraint if exists parts_publication_status_valid;
alter table public.parts
  add constraint parts_publication_status_valid
  check (publication_status in ('draft', 'needs_review', 'published', 'archived'));

create index if not exists parts_publication_status_idx
  on public.parts (publication_status, updated_at desc, id desc);

create or replace function public.validate_part_publication_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.publication_status = new.publication_status then
    return new;
  end if;

  if old.publication_status = 'draft'
    and new.publication_status in ('needs_review', 'published', 'archived') then
    return new;
  end if;
  if old.publication_status = 'needs_review'
    and new.publication_status in ('draft', 'published', 'archived') then
    return new;
  end if;
  if old.publication_status = 'published'
    and new.publication_status in ('draft', 'archived') then
    return new;
  end if;
  if old.publication_status = 'archived' and new.publication_status = 'draft' then
    return new;
  end if;

  raise exception 'Invalid publication transition from % to %',
    old.publication_status, new.publication_status
    using errcode = '23514';
end;
$$;

drop trigger if exists parts_publication_transition on public.parts;
create trigger parts_publication_transition
  before update of publication_status on public.parts
  for each row execute function public.validate_part_publication_transition();

create table if not exists public.vehicle_models (
  id bigint generated always as identity primary key,
  brand_id bigint not null references public.brands(id) on delete restrict,
  model_name text not null,
  chassis_code text not null default '',
  year_from integer,
  year_to integer,
  created_at timestamptz not null default now(),
  constraint vehicle_models_name_trimmed
    check (model_name = btrim(model_name) and model_name <> ''),
  constraint vehicle_models_chassis_trimmed
    check (chassis_code = btrim(chassis_code)),
  constraint vehicle_models_year_from_valid
    check (year_from is null or year_from between 1886 and 2200),
  constraint vehicle_models_year_to_valid
    check (year_to is null or year_to between 1886 and 2200),
  constraint vehicle_models_year_range_valid
    check (year_from is null or year_to is null or year_from <= year_to)
);

create unique index if not exists vehicle_models_identity_ci_unique
  on public.vehicle_models (
    brand_id,
    lower(btrim(model_name)),
    lower(btrim(chassis_code))
  );
create index if not exists vehicle_models_brand_id_idx
  on public.vehicle_models (brand_id, model_name, chassis_code);

create table if not exists public.part_vehicle_models (
  part_id bigint not null references public.parts(id) on delete cascade,
  vehicle_model_id bigint not null references public.vehicle_models(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (part_id, vehicle_model_id)
);
create index if not exists part_vehicle_models_vehicle_idx
  on public.part_vehicle_models (vehicle_model_id, part_id);

alter table public.vehicle_models enable row level security;
alter table public.part_vehicle_models enable row level security;

grant select on public.vehicle_models to anon, authenticated;
grant insert, update, delete on public.vehicle_models to authenticated;
grant usage, select on sequence public.vehicle_models_id_seq to authenticated;
grant select on public.part_vehicle_models to anon, authenticated;
grant insert, update, delete on public.part_vehicle_models to authenticated;

drop policy if exists "Public read parts" on public.parts;
drop policy if exists "Public read published parts" on public.parts;
create policy "Public read published parts"
  on public.parts
  for select
  to anon, authenticated
  using (publication_status = 'published');

drop policy if exists "Catalog admins read all parts" on public.parts;
create policy "Catalog admins read all parts"
  on public.parts
  for select
  to authenticated
  using (
    (select private.is_catalog_admin())
    and coalesce((select auth.jwt() ->> 'aal'), 'aal1') = 'aal2'
  );

drop policy if exists "Public read vehicle models" on public.vehicle_models;
create policy "Public read vehicle models"
  on public.vehicle_models
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Catalog admins write vehicle models" on public.vehicle_models;
create policy "Catalog admins write vehicle models"
  on public.vehicle_models
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

drop policy if exists "Public read published part vehicle models" on public.part_vehicle_models;
create policy "Public read published part vehicle models"
  on public.part_vehicle_models
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.parts
      where parts.id = part_vehicle_models.part_id
        and parts.publication_status = 'published'
    )
  );

drop policy if exists "Catalog admins manage part vehicle models" on public.part_vehicle_models;
create policy "Catalog admins manage part vehicle models"
  on public.part_vehicle_models
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

create or replace function public.set_part_vehicle_models(
  target_part_id bigint,
  target_vehicle_model_ids bigint[] default '{}'::bigint[]
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  delete from public.part_vehicle_models
  where part_id = target_part_id;

  insert into public.part_vehicle_models (part_id, vehicle_model_id)
  select target_part_id, model_id
  from unnest(coalesce(target_vehicle_model_ids, '{}'::bigint[])) as model_id;
end;
$$;

revoke all on function public.set_part_vehicle_models(bigint, bigint[]) from public;
grant execute on function public.set_part_vehicle_models(bigint, bigint[]) to authenticated;

commit;
