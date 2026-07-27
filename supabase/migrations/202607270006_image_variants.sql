begin;

alter table public.parts
  add column if not exists image_thumbnail_path text not null default '';

update public.parts
set image_thumbnail_path = regexp_replace(image_path, '^/parts/', '/parts/thumbs/')
where image_path like '/parts/%'
  and image_thumbnail_path = '';

commit;
