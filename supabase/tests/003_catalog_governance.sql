begin;

do $$
declare
  test_brand_id bigint;
  test_category_id bigint;
  test_part_id bigint;
  test_model_id bigint;
begin
  if to_regclass('public.vehicle_models') is null then
    raise exception 'vehicle_models table is missing';
  end if;
  if to_regclass('public.part_vehicle_models') is null then
    raise exception 'part_vehicle_models table is missing';
  end if;
  if to_regprocedure('public.set_part_vehicle_models(bigint,bigint[])') is null then
    raise exception 'vehicle-model association function is missing';
  end if;

  insert into public.brands (name_en, name_ka)
  values ('Governance Test Brand', 'Governance Test Brand')
  returning id into test_brand_id;

  insert into public.categories (name_en, name_ka)
  values ('Governance Test Category', 'Governance Test Category')
  returning id into test_category_id;

  insert into public.vehicle_models (brand_id, model_name, chassis_code, year_from, year_to)
  values (test_brand_id, 'Test Model', 'T01', 2020, 2024)
  returning id into test_model_id;

  insert into public.parts (
    code, title_en, title_ka, brand_id, category_id, publication_status
  ) values (
    'GOVERNANCE-TEST', 'Governance test', 'Governance test',
    test_brand_id, test_category_id, 'draft'
  ) returning id into test_part_id;

  perform public.set_part_vehicle_models(test_part_id, array[test_model_id]);
  if not exists (
    select 1 from public.part_vehicle_models
    where part_id = test_part_id and vehicle_model_id = test_model_id
  ) then
    raise exception 'Vehicle-model association was not created';
  end if;

  update public.parts set publication_status = 'published' where id = test_part_id;
  update public.parts set publication_status = 'archived' where id = test_part_id;

  begin
    update public.parts set publication_status = 'published' where id = test_part_id;
    raise exception 'Archived product should not publish directly';
  exception when check_violation then
    null;
  end;

  update public.parts set publication_status = 'draft' where id = test_part_id;
end
$$;

rollback;
