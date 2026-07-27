begin;

do $$
declare
  test_brand_id bigint;
  test_category_id bigint;
  test_part_id bigint;
begin
  insert into public.brands (name_en, name_ka)
  values ('Phase 1 Test Brand', 'ფაზა 1 სატესტო ბრენდი')
  returning id into test_brand_id;

  insert into public.categories (name_en, name_ka)
  values ('Phase 1 Test Category', 'ფაზა 1 სატესტო კატეგორია')
  returning id into test_category_id;

  insert into public.parts (
    code, replacement_codes, compatible_models, title_en, title_ka, brand_id, category_id
  ) values (
    'PHASE-1-TEST', 'REPLACEMENT-1', 'MODEL-1', 'Test part', 'სატესტო ნაწილი',
    test_brand_id, test_category_id
  ) returning id into test_part_id;

  if test_brand_id is null or test_category_id is null or test_part_id is null then
    raise exception 'Identity-generated IDs were not assigned';
  end if;

  begin
    delete from public.brands where id = test_brand_id;
    raise exception 'Brand deletion should be restricted while referenced';
  exception when foreign_key_violation then
    null;
  end;

  begin
    insert into public.parts (code, title_en, title_ka)
    values (' phase-1-invalid ', 'Invalid', 'არასწორი');
    raise exception 'Whitespace-padded code should fail';
  exception when check_violation then
    null;
  end;
end
$$;

rollback;
