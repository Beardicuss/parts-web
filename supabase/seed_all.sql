-- GENERATED FILE: run `npm run db:seed:generate` in frontend after editing mockData.js.
-- Canonical source: frontend/src/mockData.js. Safe to run repeatedly.

begin;

insert into public.brands (name_en, name_ka) values ('Mercedes-Benz', 'მერსედეს-ბენცი')
on conflict (lower(btrim(name_en))) do update set name_ka = excluded.name_ka;

insert into public.categories (name_en, name_ka) values ('Headlight Modules', 'ფარების მოდულები')
on conflict (lower(btrim(name_en))) do update set name_ka = excluded.name_ka;
insert into public.categories (name_en, name_ka) values ('Digital Light Modules', 'Digital Light მოდულები')
on conflict (lower(btrim(name_en))) do update set name_ka = excluded.name_ka;
insert into public.categories (name_en, name_ka) values ('Sensors & Radars', 'სენსორები და რადარები')
on conflict (lower(btrim(name_en))) do update set name_ka = excluded.name_ka;
insert into public.categories (name_en, name_ka) values ('DRL & LED Diodes', 'დღის განათების დიოდები')
on conflict (lower(btrim(name_en))) do update set name_ka = excluded.name_ka;
insert into public.categories (name_en, name_ka) values ('Voltage Converters', 'ძაბვის გარდამქმნელები')
on conflict (lower(btrim(name_en))) do update set name_ka = excluded.name_ka;
insert into public.categories (name_en, name_ka) values ('Xenon & Ballast Units', 'ქსენონის მოდულები')
on conflict (lower(btrim(name_en))) do update set name_ka = excluded.name_ka;

insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A0009052504', 'A0009052504-REP, B0009052504', 'W205 / W213 / W222 / X253',
  'Mercedes W205 / W213 / W222 / X253 Distronic Radar Distance Sensor Module', 'მერსედეს W205 / W213 / W222 / X253 დისტრონიკის მანძილის რადარის სენსორი',
  'Original OEM Mercedes-Benz Distronic Radar Distance Sensor Module for W205 / W213 / W222 / X253. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის დისტრონიკის მანძილის რადარის სენსორი (W205 / W213 / W222 / X253). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Sensors & Radars')),
  '/parts/0009052504.webp',
  '/parts/thumbs/0009052504.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A0009052804', 'A0009052804-REP, B0009052804', 'W205 / W213 / W222 / C238',
  'Mercedes W205 / W213 / W222 / C238 Radar Sensor Distronic Control Unit', 'მერსედეს W205 / W213 / W222 / C238 დისტრონიკის რადარის მართვის ბლოკი',
  'Original OEM Mercedes-Benz Radar Sensor Distronic Control Unit for W205 / W213 / W222 / C238. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის დისტრონიკის რადარის მართვის ბლოკი (W205 / W213 / W222 / C238). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Sensors & Radars')),
  '/parts/0009052804.webp',
  '/parts/thumbs/0009052804.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A0009054101', 'A0009054101-REP, B0009054101', 'W177 / W205 / W213 / X253',
  'Mercedes W177 / W205 / W213 / X253 Blind Spot Radar Sensor Module', 'მერსედეს W177 / W205 / W213 / X253 მკვდარი ზონის (Blind Spot) რადარის სენსორი',
  'Original OEM Mercedes-Benz Blind Spot Radar Sensor Module for W177 / W205 / W213 / X253. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის მკვდარი ზონის (Blind Spot) რადარის სენსორი (W177 / W205 / W213 / X253). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Sensors & Radars')),
  '/parts/000905411.webp',
  '/parts/thumbs/000905411.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A0009054603', 'A0009054603-REP, B0009054603', 'W177 / C118 / W205 / W213',
  'Mercedes W177 / C118 / W205 / W213 Side Assist Blind Spot Radar Unit', 'მერსედეს W177 / C118 / W205 / W213 გვერდითი მკვდარი ზონის სენსორის მოდული',
  'Original OEM Mercedes-Benz Side Assist Blind Spot Radar Unit for W177 / C118 / W205 / W213. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის გვერდითი მკვდარი ზონის სენსორის მოდული (W177 / C118 / W205 / W213). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Sensors & Radars')),
  '/parts/0009054603.webp',
  '/parts/thumbs/0009054603.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A0009054907', 'A0009054907-REP, B0009054907', 'W205 / W213 / W222 / X253',
  'Mercedes W205 / W213 / W222 / X253 Radar Sensor Control Computer', 'მერსედეს W205 / W213 / W222 / X253 რადარის სენსორების მართვის კომპიუტერი',
  'Original OEM Mercedes-Benz Radar Sensor Control Computer for W205 / W213 / W222 / X253. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის რადარის სენსორების მართვის კომპიუტერი (W205 / W213 / W222 / X253). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Sensors & Radars')),
  '/parts/0009054907.webp',
  '/parts/thumbs/0009054907.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A0009055103', 'A0009055103-REP, B0009055103', 'W205 / W213 / X253 / W222',
  'Mercedes W205 / W213 / X253 / W222 360 Surround View Camera Radar Module', 'მერსედეს W205 / W213 / X253 / W222 360 კამერის და რადარის მართვის მოდული',
  'Original OEM Mercedes-Benz 360 Surround View Camera Radar Module for W205 / W213 / X253 / W222. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის 360 კამერის და რადარის მართვის მოდული (W205 / W213 / X253 / W222). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Sensors & Radars')),
  '/parts/0009055103.webp',
  '/parts/thumbs/0009055103.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A0009056911', 'A0009056911-REP, B0009056911', 'W206 / W223 / V167 / X247',
  'Mercedes W206 / W223 / V167 / X247 Distronic & Surround Camera Control Unit', 'მერსედეს W206 / W223 / V167 / X247 დისტრონიკისა და კამერების მართვის ბლოკი',
  'Original OEM Mercedes-Benz Distronic & Surround Camera Control Unit for W206 / W223 / V167 / X247. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის დისტრონიკისა და კამერების მართვის ბლოკი (W206 / W223 / V167 / X247). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Sensors & Radars')),
  '/parts/0009056911.webp',
  '/parts/thumbs/0009056911.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A0009057908', 'A0009057908-REP, B0009057908', 'W205 / W213 / W222 / X253',
  'Mercedes W205 / W213 / W222 / X253 Collision Avoidance Radar Sensor', 'მერსედეს W205 / W213 / W222 / X253 შეჯახების აცილების რადარის სენსორი',
  'Original OEM Mercedes-Benz Collision Avoidance Radar Sensor for W205 / W213 / W222 / X253. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის შეჯახების აცილების რადარის სენსორი (W205 / W213 / W222 / X253). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Sensors & Radars')),
  '/parts/0009057908.webp',
  '/parts/thumbs/0009057908.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A0009058406', 'A0009058406-REP, B0009058406', 'W205 / W213 / X253 / W222',
  'Mercedes W205 / W213 / X253 / W222 NOX Exhaust Gas Sensor Control Module', 'მერსედეს W205 / W213 / X253 / W222 NOX გამონაბოლქვის სენსორის ბლოკი',
  'Original OEM Mercedes-Benz NOX Exhaust Gas Sensor Control Module for W205 / W213 / X253 / W222. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის NOX გამონაბოლქვის სენსორის ბლოკი (W205 / W213 / X253 / W222). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Sensors & Radars')),
  '/parts/0009058406.webp',
  '/parts/thumbs/0009058406.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A0009058802', 'A0009058802-REP, B0009058802', 'W205 / W213 / X253 / W222',
  'Mercedes W205 / W213 / X253 / W222 Nitrogen Oxide NOX Emissions Sensor', 'მერსედეს W205 / W213 / X253 / W222 აზოტის ჟანგის (NOX) სენსორის მოდული',
  'Original OEM Mercedes-Benz Nitrogen Oxide NOX Emissions Sensor for W205 / W213 / X253 / W222. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის აზოტის ჟანგის (NOX) სენსორის მოდული (W205 / W213 / X253 / W222). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Sensors & Radars')),
  '/parts/0009058802.webp',
  '/parts/thumbs/0009058802.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A0009058909', 'A0009058909-REP, B0009058909', 'W205 / W213 / W222 / V167',
  'Mercedes W205 / W213 / W222 / V167 AdBlue NOX Emission Control Computer', 'მერსედეს W205 / W213 / W222 / V167 AdBlue NOX ემისიების კომპიუტერი',
  'Original OEM Mercedes-Benz AdBlue NOX Emission Control Computer for W205 / W213 / W222 / V167. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის AdBlue NOX ემისიების კომპიუტერი (W205 / W213 / W222 / V167). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Sensors & Radars')),
  '/parts/0009058909.webp',
  '/parts/thumbs/0009058909.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A0009059907', 'A0009059907-REP, B0009059907', 'W205 / W213 / X253 / W222',
  'Mercedes W205 / W213 / X253 / W222 Distronic Plus Front Radar Sensor', 'მერსედეს W205 / W213 / X253 / W222 დისტრონიკ პლუსის წინა რადარი',
  'Original OEM Mercedes-Benz Distronic Plus Front Radar Sensor for W205 / W213 / X253 / W222. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის დისტრონიკ პლუსის წინა რადარი (W205 / W213 / X253 / W222). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Sensors & Radars')),
  '/parts/0009059907.webp',
  '/parts/thumbs/0009059907.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A1669003309', 'A1669003309-REP, B1669003309', 'GLE W166 / GLS X166 / GL W166',
  'Mercedes GLE W166 / GLS X166 / GL W166 LED Headlight Control Unit', 'მერსედეს GLE W166 / GLS X166 / GL W166 LED ფარის მართვის მოდული',
  'Original OEM Mercedes-Benz LED Headlight Control Unit for GLE W166 / GLS X166 / GL W166. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის LED ფარის მართვის მოდული (GLE W166 / GLS X166 / GL W166). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/1669003309.webp',
  '/parts/thumbs/1669003309.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A1769001204', 'A1769001204-REP, B1769001204', 'A-Class W176 / CLA C117 / GLA X156',
  'Mercedes A-Class W176 / CLA C117 / GLA X156 LED Headlamp Controller Unit', 'მერსედეს A-Class W176 / CLA C117 / GLA X156 LED ფარის მართვის ბლოკი',
  'Original OEM Mercedes-Benz LED Headlamp Controller Unit for A-Class W176 / CLA C117 / GLA X156. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის LED ფარის მართვის ბლოკი (A-Class W176 / CLA C117 / GLA X156). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/1769001204.webp',
  '/parts/thumbs/1769001204.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A1779003803', 'A1779003803-REP, B1779003803', 'A-Class W177 / CLA C118 / GLE V167',
  'Mercedes A-Class W177 / CLA C118 / GLE V167 Multibeam LED Headlight Computer', 'მერსედეს A-Class W177 / CLA C118 / GLE V167 Multibeam LED ფარის კომპიუტერი',
  'Original OEM Mercedes-Benz Multibeam LED Headlight Computer for A-Class W177 / CLA C118 / GLE V167. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Multibeam LED ფარის კომპიუტერი (A-Class W177 / CLA C118 / GLE V167). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/1779003803.webp',
  '/parts/thumbs/1779003803.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2048700126', 'A2048700126-REP, B2048700126', 'C-Class W204 / GLK X204 / E-Class W212',
  'Mercedes C-Class W204 / GLK X204 / E-Class W212 Xenon Ballast Control Unit', 'მერსედეს C-Class W204 / GLK X204 / E-Class W212 ქსენონის ბლოკი და მართვის მოდული',
  'Original OEM Mercedes-Benz Xenon Ballast Control Unit for C-Class W204 / GLK X204 / E-Class W212. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის ქსენონის ბლოკი და მართვის მოდული (C-Class W204 / GLK X204 / E-Class W212). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Xenon & Ballast Units')),
  '/parts/2048700126.webp',
  '/parts/thumbs/2048700126.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2048700326', 'A2048700326-REP, B2048700326', 'C-Class W204 / GLK X204 / E-Class W212',
  'Mercedes C-Class W204 / GLK X204 / E-Class W212 HID Xenon Headlight Ballast Module', 'მერსედეს C-Class W204 / GLK X204 / E-Class W212 HID ქსენონის ფარის ბალასტის მოდული',
  'Original OEM Mercedes-Benz HID Xenon Headlight Ballast Module for C-Class W204 / GLK X204 / E-Class W212. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის HID ქსენონის ფარის ბალასტის მოდული (C-Class W204 / GLK X204 / E-Class W212). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Xenon & Ballast Units')),
  '/parts/2048700326.webp',
  '/parts/thumbs/2048700326.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2059006805', 'A2059006805-REP, B2059006805', 'C-Class W205 Facelift / GLC X253',
  'Mercedes C-Class W205 Facelift / GLC X253 LED Headlight Control Driver Unit', 'მერსედეს C-Class W205 Facelift / GLC X253 LED ფარის მართვის დრაივერის ბლოკი',
  'Original OEM Mercedes-Benz LED Headlight Control Driver Unit for C-Class W205 Facelift / GLC X253. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის LED ფარის მართვის დრაივერის ბლოკი (C-Class W205 Facelift / GLC X253). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2059006805.webp',
  '/parts/thumbs/2059006805.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2059009534', 'A2059009534-REP, B2059009534', 'C-Class W205 / GLC X253',
  'Mercedes C-Class W205 / GLC X253 LED Main Headlamp Control Module', 'მერსედეს C-Class W205 / GLC X253 LED მთავარი ფარის მართვის მოდული',
  'Original OEM Mercedes-Benz LED Main Headlamp Control Module for C-Class W205 / GLC X253. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის LED მთავარი ფარის მართვის მოდული (C-Class W205 / GLC X253). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2059009534.webp',
  '/parts/thumbs/2059009534.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2069007016', 'A2069007016-REP, B2069007016', 'C-Class W206 / S-Class W223',
  'Mercedes C-Class W206 / S-Class W223 Digital Light Projection Module', 'მერსედეს C-Class W206 / S-Class W223 Digital Light პროექციული ფარის მოდული',
  'Original OEM Mercedes-Benz Digital Light Projection Module for C-Class W206 / S-Class W223. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Digital Light პროექციული ფარის მოდული (C-Class W206 / S-Class W223). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Digital Light Modules')),
  '/parts/2069007016.webp',
  '/parts/thumbs/2069007016.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2129005324', 'A2129005324-REP, B2129005324', 'E-Class W212 Facelift / CLS W218',
  'Mercedes E-Class W212 Facelift / CLS W218 LED Voltage Converter Control Module', 'მერსედეს E-Class W212 Facelift / CLS W218 LED ძაბვის გარდამქმნელი მოდული',
  'Original OEM Mercedes-Benz LED Voltage Converter Control Module for E-Class W212 Facelift / CLS W218. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის LED ძაბვის გარდამქმნელი მოდული (E-Class W212 Facelift / CLS W218). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2129005324.webp',
  '/parts/thumbs/2129005324.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2129007804', 'A2129007804-REP, B2129007804', 'E-Class W212 Facelift / CLS W218',
  'Mercedes E-Class W212 Facelift / CLS W218 Full LED Headlight Driver Computer', 'მერსედეს E-Class W212 Facelift / CLS W218 Full LED ფარის დრაივერის კომპიუტერი',
  'Original OEM Mercedes-Benz Full LED Headlight Driver Computer for E-Class W212 Facelift / CLS W218. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Full LED ფარის დრაივერის კომპიუტერი (E-Class W212 Facelift / CLS W218). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2129007804.webp',
  '/parts/thumbs/2129007804.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2129008324', 'A2129008324-REP, B2129008324', 'E-Class W212 / CLS-Class W218',
  'Mercedes E-Class W212 / CLS-Class W218 LED Headlamp Power Module', 'მერსედეს E-Class W212 / CLS-Class W218 LED ფარის კვების მოდული',
  'Original OEM Mercedes-Benz LED Headlamp Power Module for E-Class W212 / CLS-Class W218. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის LED ფარის კვების მოდული (E-Class W212 / CLS-Class W218). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2129008324.webp',
  '/parts/thumbs/2129008324.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2139000737', 'A2139000737-REP, B2139000737', 'E-Class W213 / C238 / CLS C257',
  'Mercedes E-Class W213 / C238 / CLS C257 LED Headlight Control Module (Lear PXL3)', 'მერსედეს E-Class W213 / C238 / CLS C257 LED ფარის მოდული (Lear PXL3 star2)',
  'Original OEM Mercedes-Benz LED Headlight Control Module (Lear PXL3) for E-Class W213 / C238 / CLS C257. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის LED ფარის მოდული (Lear PXL3 star2) (E-Class W213 / C238 / CLS C257). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2139000737.webp',
  '/parts/thumbs/2139000737.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2139002334 / A2139002434', 'A2139002334 / A2139002434-REP, B2139002334 / A2139002434', 'E-Class W213 / CLS C257',
  'Mercedes E-Class W213 / CLS C257 Dual Multibeam LED Control Unit Pair', 'მერსედეს E-Class W213 / CLS C257 წყვილი Multibeam LED მართვის ბლოკები',
  'Original OEM Mercedes-Benz Dual Multibeam LED Control Unit Pair for E-Class W213 / CLS C257. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის წყვილი Multibeam LED მართვის ბლოკები (E-Class W213 / CLS C257). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2139002334%20%20%202139002434.webp',
  '/parts/thumbs/2139002334%20%20%202139002434.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2139002534 / A2139002634', 'A2139002534 / A2139002634-REP, B2139002534 / A2139002634', 'E-Class W213 / CLS C257',
  'Mercedes E-Class W213 / CLS C257 Multibeam LED Headlight Driver Pair', 'მერსედეს E-Class W213 / CLS C257 Multibeam LED ფარის დრაივერების წყვილი',
  'Original OEM Mercedes-Benz Multibeam LED Headlight Driver Pair for E-Class W213 / CLS C257. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Multibeam LED ფარის დრაივერების წყვილი (E-Class W213 / CLS C257). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2139002534%20%202139002634.webp',
  '/parts/thumbs/2139002534%20%202139002634.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2139002734 / A2139002834', 'A2139002734 / A2139002834-REP, B2139002734 / A2139002834', 'E-Class W213 / CLS C257',
  'Mercedes E-Class W213 / CLS C257 Multibeam LED Main Headlight Modules', 'მერსედეს E-Class W213 / CLS C257 Multibeam LED მთავარი ფარის მოდულები',
  'Original OEM Mercedes-Benz Multibeam LED Main Headlight Modules for E-Class W213 / CLS C257. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Multibeam LED მთავარი ფარის მოდულები (E-Class W213 / CLS C257). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2139002734%20%20%202139002834.webp',
  '/parts/thumbs/2139002734%20%20%202139002834.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2139005035', 'A2139005035-REP, B2139005035', 'E-Class W213 Facelift / CLS C257',
  'Mercedes E-Class W213 Facelift / CLS C257 Multibeam LED Headlight Computer', 'მერსედეს E-Class W213 Facelift / CLS C257 Multibeam LED ფარის კომპიუტერი',
  'Original OEM Mercedes-Benz Multibeam LED Headlight Computer for E-Class W213 Facelift / CLS C257. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Multibeam LED ფარის კომპიუტერი (E-Class W213 Facelift / CLS C257). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2139005035.webp',
  '/parts/thumbs/2139005035.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2139005732 / A2139005832', 'A2139005732 / A2139005832-REP, B2139005732 / A2139005832', 'E-Class W213 Facelift',
  'Mercedes E-Class W213 Facelift LED Headlamp Control Unit Pair', 'მერსედეს E-Class W213 Facelift LED ფარის მართვის ბლოკების წყვილი',
  'Original OEM Mercedes-Benz LED Headlamp Control Unit Pair for E-Class W213 Facelift. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის LED ფარის მართვის ბლოკების წყვილი (E-Class W213 Facelift). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2139005732%20%202139005832.webp',
  '/parts/thumbs/2139005732%20%202139005832.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2139007206', 'A2139007206-REP, B2139007206', 'E-Class W213 / CLS C257',
  'Mercedes E-Class W213 / CLS C257 High-Performance LED Control Unit', 'მერსედეს E-Class W213 / CLS C257 მაღალი წარმადობის LED მოდული',
  'Original OEM Mercedes-Benz High-Performance LED Control Unit for E-Class W213 / CLS C257. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის მაღალი წარმადობის LED მოდული (E-Class W213 / CLS C257). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2139007206.webp',
  '/parts/thumbs/2139007206.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2139007208', 'A2139007208-REP, B2139007208', 'E-Class W213 / CLS C257',
  'Mercedes E-Class W213 / CLS C257 LED Headlamp Driver Module', 'მერსედეს E-Class W213 / CLS C257 LED ფარის დრაივერის მოდული',
  'Original OEM Mercedes-Benz LED Headlamp Driver Module for E-Class W213 / CLS C257. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის LED ფარის დრაივერის მოდული (E-Class W213 / CLS C257). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2139007208.webp',
  '/parts/thumbs/2139007208.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2139007833 / A2139007933', 'A2139007833 / A2139007933-REP, B2139007833 / A2139007933', 'E-Class W213 Facelift / C238',
  'Mercedes E-Class W213 Facelift / C238 Multibeam LED Power Module Pair', 'მერსედეს E-Class W213 Facelift / C238 Multibeam LED კვების მოდულების წყვილი',
  'Original OEM Mercedes-Benz Multibeam LED Power Module Pair for E-Class W213 Facelift / C238. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Multibeam LED კვების მოდულების წყვილი (E-Class W213 Facelift / C238). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2139007833%20%202139007933.webp',
  '/parts/thumbs/2139007833%20%202139007933.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2139008602', 'A2139008602-REP, B2139008602', 'E-Class W213 / CLS C257',
  'Mercedes E-Class W213 / CLS C257 LED Headlight Control Computer', 'მერსედეს E-Class W213 / CLS C257 LED ფარის მართვის კომპიუტერი',
  'Original OEM Mercedes-Benz LED Headlight Control Computer for E-Class W213 / CLS C257. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის LED ფარის მართვის კომპიუტერი (E-Class W213 / CLS C257). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2139008602.webp',
  '/parts/thumbs/2139008602.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2169009100', 'A2169009100-REP, B2169009100', 'CL-Class C216 / S-Class W221',
  'Mercedes CL-Class C216 / S-Class W221 Night View Assist & Headlight Module', 'მერსედეს CL-Class C216 / S-Class W221 ღამის ხედვის ასისტენტის და ფარის მოდული',
  'Original OEM Mercedes-Benz Night View Assist & Headlight Module for CL-Class C216 / S-Class W221. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის ღამის ხედვის ასისტენტის და ფარის მოდული (CL-Class C216 / S-Class W221). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2169009100.webp',
  '/parts/thumbs/2169009100.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2189001902', 'A2189001902-REP, B2189001902', 'CLS-Class W218 / E-Class W212',
  'Mercedes CLS-Class W218 / E-Class W212 LED Voltage Converter Module', 'მერსედეს CLS-Class W218 / E-Class W212 LED ძაბვის გარდამქმნელი ბლოკი',
  'Original OEM Mercedes-Benz LED Voltage Converter Module for CLS-Class W218 / E-Class W212. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის LED ძაბვის გარდამქმნელი ბლოკი (CLS-Class W218 / E-Class W212). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Voltage Converters')),
  '/parts/2189001902.webp',
  '/parts/thumbs/2189001902.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2189004406', 'A2189004406-REP, B2189004406', 'CLS-Class W218 / E-Class W212',
  'Mercedes CLS-Class W218 / E-Class W212 Full LED Headlamp Voltage Controller', 'მერსედეს CLS-Class W218 / E-Class W212 Full LED ფარის ძაბვის რეგულატორი',
  'Original OEM Mercedes-Benz Full LED Headlamp Voltage Controller for CLS-Class W218 / E-Class W212. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Full LED ფარის ძაბვის რეგულატორი (CLS-Class W218 / E-Class W212). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Voltage Converters')),
  '/parts/2189004406.webp',
  '/parts/thumbs/2189004406.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2189007306', 'A2189007306-REP, B2189007306', 'CLS-Class W218 / E-Class W212 / S-Class W222',
  'Mercedes CLS-Class W218 / E-Class W212 / S-Class W222 LED Power Voltage Converter', 'მერსედეს CLS-Class W218 / E-Class W212 / S-Class W222 LED კვების ძაბვის გარდამქმნელი',
  'Original OEM Mercedes-Benz LED Power Voltage Converter for CLS-Class W218 / E-Class W212 / S-Class W222. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის LED კვების ძაბვის გარდამქმნელი (CLS-Class W218 / E-Class W212 / S-Class W222). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Voltage Converters')),
  '/parts/2189007306.webp',
  '/parts/thumbs/2189007306.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2189009103', 'A2189009103-REP, B2189009103', 'CLS-Class W218 / E-Class W212 / S-Class W222',
  'Mercedes CLS-Class W218 / E-Class W212 / S-Class W222 LED Lighting Voltage Converter', 'მერსედეს CLS-Class W218 / E-Class W212 / S-Class W222 LED განათების ძაბვის გარდამქმნელი',
  'Original OEM Mercedes-Benz LED Lighting Voltage Converter for CLS-Class W218 / E-Class W212 / S-Class W222. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის LED განათების ძაბვის გარდამქმნელი (CLS-Class W218 / E-Class W212 / S-Class W222). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Voltage Converters')),
  '/parts/2189009103.webp',
  '/parts/thumbs/2189009103.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2189009203-2', 'A2189009203-2-REP, B2189009203-2', 'CLS-Class W218 / E-Class W212 / S-Class W222',
  'Mercedes CLS-Class W218 / E-Class W212 / S-Class W222 LED Headlight Voltage Converter Module (Pair Unit)', 'მერსედეს CLS-Class W218 / E-Class W212 / S-Class W222 LED ფარის ძაბვის გარდამქმნელი (მეორე ბლოკი)',
  'Original OEM Mercedes-Benz LED Headlight Voltage Converter Module (Pair Unit) for CLS-Class W218 / E-Class W212 / S-Class W222. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის LED ფარის ძაბვის გარდამქმნელი (მეორე ბლოკი) (CLS-Class W218 / E-Class W212 / S-Class W222). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Voltage Converters')),
  '/parts/2189009203%20(2).webp',
  '/parts/thumbs/2189009203%20(2).webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2189009203', 'A2189009203-REP, B2189009203', 'CLS-Class W218 / E-Class W212 / S-Class W222',
  'Mercedes CLS-Class W218 / E-Class W212 / S-Class W222 LED Headlight Voltage Converter Module', 'მერსედეს CLS-Class W218 / E-Class W212 / S-Class W222 LED ფარის ძაბვის გარდამქმნელი მოდული',
  'Original OEM Mercedes-Benz LED Headlight Voltage Converter Module for CLS-Class W218 / E-Class W212 / S-Class W222. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის LED ფარის ძაბვის გარდამქმნელი მოდული (CLS-Class W218 / E-Class W212 / S-Class W222). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Voltage Converters')),
  '/parts/2189009203.webp',
  '/parts/thumbs/2189009203.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2219000701', 'A2219000701-REP, B2219000701', 'S-Class W221 / CL C216',
  'Mercedes S-Class W221 / CL C216 S-Class Xenon / LED Headlamp Controller', 'მერსედეს S-Class W221 / CL C216 S-Class ქსენონ/LED ფარის მართვის მოდული',
  'Original OEM Mercedes-Benz S-Class Xenon / LED Headlamp Controller for S-Class W221 / CL C216. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის S-Class ქსენონ/LED ფარის მართვის მოდული (S-Class W221 / CL C216). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2219000701.webp',
  '/parts/thumbs/2219000701.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2228700789', 'A2228700789-REP, B2228700789', 'S-Class W222 / Maybach X222',
  'Mercedes S-Class W222 / Maybach X222 Full LED Headlight Main Computer', 'მერსედეს S-Class W222 / Maybach X222 Full LED ფარის მთავარი კომპიუტერი',
  'Original OEM Mercedes-Benz Full LED Headlight Main Computer for S-Class W222 / Maybach X222. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Full LED ფარის მთავარი კომპიუტერი (S-Class W222 / Maybach X222). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2228700789.webp',
  '/parts/thumbs/2228700789.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2229000515', 'A2229000515-REP, B2229000515', 'S-Class W222 / Maybach X222',
  'Mercedes S-Class W222 / Maybach X222 Full LED Headlight Control Module', 'მერსედეს S-Class W222 / Maybach X222 Full LED ფარის მართვის მოდული',
  'Original OEM Mercedes-Benz Full LED Headlight Control Module for S-Class W222 / Maybach X222. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Full LED ფარის მართვის მოდული (S-Class W222 / Maybach X222). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2229000515.webp',
  '/parts/thumbs/2229000515.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2229004505', 'A2229004505-REP, B2229004505', 'S-Class W222 Facelift / Maybach',
  'Mercedes S-Class W222 Facelift / Maybach Multibeam LED Headlight Driver Unit', 'მერსედეს S-Class W222 Facelift / Maybach Multibeam LED ფარის დრაივერის ბლოკი',
  'Original OEM Mercedes-Benz Multibeam LED Headlight Driver Unit for S-Class W222 Facelift / Maybach. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Multibeam LED ფარის დრაივერის ბლოკი (S-Class W222 Facelift / Maybach). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2229004505.webp',
  '/parts/thumbs/2229004505.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2229004812', 'A2229004812-REP, B2229004812', 'S-Class W222 Facelift / Maybach',
  'Mercedes S-Class W222 Facelift / Maybach Multibeam LED Main Light Controller', 'მერსედეს S-Class W222 Facelift / Maybach Multibeam LED მთავარი განათების მოდული',
  'Original OEM Mercedes-Benz Multibeam LED Main Light Controller for S-Class W222 Facelift / Maybach. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Multibeam LED მთავარი განათების მოდული (S-Class W222 Facelift / Maybach). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2229004812.webp',
  '/parts/thumbs/2229004812.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2229008005', 'A2229008005-REP, B2229008005', 'S-Class W222 / Maybach X222',
  'Mercedes S-Class W222 / Maybach X222 LED Headlamp Control Computer', 'მერსედეს S-Class W222 / Maybach X222 LED ფარის მართვის კომპიუტერი',
  'Original OEM Mercedes-Benz LED Headlamp Control Computer for S-Class W222 / Maybach X222. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის LED ფარის მართვის კომპიუტერი (S-Class W222 / Maybach X222). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2229008005.webp',
  '/parts/thumbs/2229008005.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2229008105', 'A2229008105-REP, B2229008105', 'S-Class W222 / Maybach X222',
  'Mercedes S-Class W222 / Maybach X222 High-Performance LED Driver Module', 'მერსედეს S-Class W222 / Maybach X222 მაღალი წარმადობის LED დრაივერის მოდული',
  'Original OEM Mercedes-Benz High-Performance LED Driver Module for S-Class W222 / Maybach X222. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის მაღალი წარმადობის LED დრაივერის მოდული (S-Class W222 / Maybach X222). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2229008105.webp',
  '/parts/thumbs/2229008105.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2239000020', 'A2239000020-REP, B2239000020', 'S-Class W223 / EQS V297',
  'Mercedes S-Class W223 / EQS V297 Digital Light Flagship Control Unit', 'მერსედეს S-Class W223 / EQS V297 Digital Light ფლაგმანური მართვის ბლოკი',
  'Original OEM Mercedes-Benz Digital Light Flagship Control Unit for S-Class W223 / EQS V297. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Digital Light ფლაგმანური მართვის ბლოკი (S-Class W223 / EQS V297). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Digital Light Modules')),
  '/parts/2239000020.webp',
  '/parts/thumbs/2239000020.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2239001521', 'A2239001521-REP, B2239001521', 'S-Class W223 / EQS V297',
  'Mercedes S-Class W223 / EQS V297 Digital Light Projection Headlight Computer', 'მერსედეს S-Class W223 / EQS V297 Digital Light პროექციული ფარის კომპიუტერი',
  'Original OEM Mercedes-Benz Digital Light Projection Headlight Computer for S-Class W223 / EQS V297. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Digital Light პროექციული ფარის კომპიუტერი (S-Class W223 / EQS V297). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Digital Light Modules')),
  '/parts/2239001521.webp',
  '/parts/thumbs/2239001521.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2239001615', 'A2239001615-REP, B2239001615', 'S-Class W223 / EQS V297',
  'Mercedes S-Class W223 / EQS V297 Digital Light Main Controller Unit', 'მერსედეს S-Class W223 / EQS V297 Digital Light მთავარი მართვის ბლოკი',
  'Original OEM Mercedes-Benz Digital Light Main Controller Unit for S-Class W223 / EQS V297. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Digital Light მთავარი მართვის ბლოკი (S-Class W223 / EQS V297). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Digital Light Modules')),
  '/parts/2239001615.webp',
  '/parts/thumbs/2239001615.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2239002526 / A2239002626', 'A2239002526 / A2239002626-REP, B2239002526 / A2239002626', 'S-Class W223 / EQS V297',
  'Mercedes S-Class W223 / EQS V297 Digital Light Headlamp Control Module Pair', 'მერსედეს S-Class W223 / EQS V297 Digital Light ფარის მართვის მოდულების წყვილი',
  'Original OEM Mercedes-Benz Digital Light Headlamp Control Module Pair for S-Class W223 / EQS V297. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Digital Light ფარის მართვის მოდულების წყვილი (S-Class W223 / EQS V297). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Digital Light Modules')),
  '/parts/2239002526%20%20%202239002626.webp',
  '/parts/thumbs/2239002526%20%20%202239002626.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2239005120 / A2239005220', 'A2239005120 / A2239005220-REP, B2239005120 / A2239005220', 'S-Class W223 / EQS V297',
  'Mercedes S-Class W223 / EQS V297 Digital Light Driver Unit Pair', 'მერსედეს S-Class W223 / EQS V297 Digital Light დრაივერების წყვილი',
  'Original OEM Mercedes-Benz Digital Light Driver Unit Pair for S-Class W223 / EQS V297. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Digital Light დრაივერების წყვილი (S-Class W223 / EQS V297). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Digital Light Modules')),
  '/parts/2239005120%20%20%202239005220.webp',
  '/parts/thumbs/2239005120%20%20%202239005220.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2239005420', 'A2239005420-REP, B2239005420', 'S-Class W223 / EQS V297',
  'Mercedes S-Class W223 / EQS V297 Digital Light Lighting Controller', 'მერსედეს S-Class W223 / EQS V297 Digital Light განათების მოდული',
  'Original OEM Mercedes-Benz Digital Light Lighting Controller for S-Class W223 / EQS V297. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Digital Light განათების მოდული (S-Class W223 / EQS V297). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Digital Light Modules')),
  '/parts/2239005420.webp',
  '/parts/thumbs/2239005420.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2239007618', 'A2239007618-REP, B2239007618', 'S-Class W223 / EQS V297',
  'Mercedes S-Class W223 / EQS V297 Digital Light Multibeam Computer', 'მერსედეს S-Class W223 / EQS V297 Digital Light Multibeam კომპიუტერი',
  'Original OEM Mercedes-Benz Digital Light Multibeam Computer for S-Class W223 / EQS V297. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Digital Light Multibeam კომპიუტერი (S-Class W223 / EQS V297). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Digital Light Modules')),
  '/parts/2239007618.webp',
  '/parts/thumbs/2239007618.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2239007718', 'A2239007718-REP, B2239007718', 'S-Class W223 / EQS V297',
  'Mercedes S-Class W223 / EQS V297 Digital Light Projection Module', 'მერსედეს S-Class W223 / EQS V297 Digital Light პროექციის მოდული',
  'Original OEM Mercedes-Benz Digital Light Projection Module for S-Class W223 / EQS V297. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Digital Light პროექციის მოდული (S-Class W223 / EQS V297). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Digital Light Modules')),
  '/parts/2239007718.webp',
  '/parts/thumbs/2239007718.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2239008527', 'A2239008527-REP, B2239008527', 'S-Class W223 / EQS V297',
  'Mercedes S-Class W223 / EQS V297 Digital Light Main Controller Module', 'მერსედეს S-Class W223 / EQS V297 Digital Light მთავარი მართვის მოდული',
  'Original OEM Mercedes-Benz Digital Light Main Controller Module for S-Class W223 / EQS V297. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Digital Light მთავარი მართვის მოდული (S-Class W223 / EQS V297). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Digital Light Modules')),
  '/parts/2239008527.webp',
  '/parts/thumbs/2239008527.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2479004104', 'A2479004104-REP, B2479004104', 'GLA H247 / GLB X247',
  'Mercedes GLA H247 / GLB X247 LED Headlight Control Unit', 'მერსედეს GLA H247 / GLB X247 LED ფარის მართვის მოდული',
  'Original OEM Mercedes-Benz LED Headlight Control Unit for GLA H247 / GLB X247. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის LED ფარის მართვის მოდული (GLA H247 / GLB X247). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2479004104.webp',
  '/parts/thumbs/2479004104.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2479004204', 'A2479004204-REP, B2479004204', 'GLA H247 / GLB X247',
  'Mercedes GLA H247 / GLB X247 LED Headlamp Driver Computer', 'მერსედეს GLA H247 / GLB X247 LED ფარის დრაივერის კომპიუტერი',
  'Original OEM Mercedes-Benz LED Headlamp Driver Computer for GLA H247 / GLB X247. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის LED ფარის დრაივერის კომპიუტერი (GLA H247 / GLB X247). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2479004204.webp',
  '/parts/thumbs/2479004204.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2479004807', 'A2479004807-REP, B2479004807', 'GLA H247 / GLB X247',
  'Mercedes GLA H247 / GLB X247 Multibeam LED Lighting Module', 'მერსედეს GLA H247 / GLB X247 Multibeam LED განათების მოდული',
  'Original OEM Mercedes-Benz Multibeam LED Lighting Module for GLA H247 / GLB X247. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Multibeam LED განათების მოდული (GLA H247 / GLB X247). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2479004807.webp',
  '/parts/thumbs/2479004807.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2479004907', 'A2479004907-REP, B2479004907', 'GLA H247 / GLB X247',
  'Mercedes GLA H247 / GLB X247 Multibeam LED Driver Unit', 'მერსედეს GLA H247 / GLB X247 Multibeam LED დრაივერის ბლოკი',
  'Original OEM Mercedes-Benz Multibeam LED Driver Unit for GLA H247 / GLB X247. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის Multibeam LED დრაივერის ბლოკი (GLA H247 / GLB X247). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2479004907.webp',
  '/parts/thumbs/2479004907.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2539000700', 'A2539000700-REP, B2539000700', 'GLC X253 / C-Class W205',
  'Mercedes GLC X253 / C-Class W205 LED Headlight Control Computer', 'მერსედეს GLC X253 / C-Class W205 LED ფარის მართვის კომპიუტერი',
  'Original OEM Mercedes-Benz LED Headlight Control Computer for GLC X253 / C-Class W205. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის LED ფარის მართვის კომპიუტერი (GLC X253 / C-Class W205). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/2539000700.webp',
  '/parts/thumbs/2539000700.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2539050900', 'A2539050900-REP, B2539050900', 'GLC X253 / C-Class W205',
  'Mercedes GLC X253 / C-Class W205 GLC Radar Sensor Distronic Unit', 'მერსედეს GLC X253 / C-Class W205 GLC დისტრონიკის რადარის სენსორი',
  'Original OEM Mercedes-Benz GLC Radar Sensor Distronic Unit for GLC X253 / C-Class W205. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის GLC დისტრონიკის რადარის სენსორი (GLC X253 / C-Class W205). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Sensors & Radars')),
  '/parts/2539050900.webp',
  '/parts/thumbs/2539050900.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2539000700-OLD', 'A2539000700-OLD-REP, B2539000700-OLD', 'GLC X253 Pre-Facelift High-Spec',
  'Mercedes GLC X253 Pre-Facelift High-Spec GLC X253 Pre-Facelift High-Spec LED Module', 'მერსედეს GLC X253 Pre-Facelift High-Spec GLC X253 რესტაილინგამდელი LED მოდული',
  'Original OEM Mercedes-Benz GLC X253 Pre-Facelift High-Spec LED Module for GLC X253 Pre-Facelift High-Spec. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის GLC X253 რესტაილინგამდელი LED მოდული (GLC X253 Pre-Facelift High-Spec). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/253%E8%80%81%E6%AC%BE%E9%AB%98%E9%85%8D.webp',
  '/parts/thumbs/253%E8%80%81%E6%AC%BE%E9%AB%98%E9%85%8D.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2059060601', 'A2059060601-REP, B2059060601', 'C-Class W205',
  'Mercedes C-Class W205 Daytime Running Light DRL LED Diode Module', 'მერსედეს C-Class W205 დღის განათების DRL LED დიოდის მოდული',
  'Original OEM Mercedes-Benz Daytime Running Light DRL LED Diode Module for C-Class W205. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის დღის განათების DRL LED დიოდის მოდული (C-Class W205). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('DRL & LED Diodes')),
  '/parts/A2059060601.webp',
  '/parts/thumbs/A2059060601.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2189065900', 'A2189065900-REP, B2189065900', 'CLS W218 / E-Class W212',
  'Mercedes CLS W218 / E-Class W212 DRL LED Light Control Module', 'მერსედეს CLS W218 / E-Class W212 DRL LED განათების მართვის მოდული',
  'Original OEM Mercedes-Benz DRL LED Light Control Module for CLS W218 / E-Class W212. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის DRL LED განათების მართვის მოდული (CLS W218 / E-Class W212). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('DRL & LED Diodes')),
  '/parts/A2189065900.webp',
  '/parts/thumbs/A2189065900.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A1779003803-NEW', 'A1779003803-NEW-REP, B1779003803-NEW', 'A-Class W177 Facelift Multibeam',
  'Mercedes A-Class W177 Facelift Multibeam A-Class W177 Facelift Multibeam LED Unit', 'მერსედეს A-Class W177 Facelift Multibeam A-Class W177 რესტაილინგის Multibeam LED ბლოკი',
  'Original OEM Mercedes-Benz A-Class W177 Facelift Multibeam LED Unit for A-Class W177 Facelift Multibeam. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის A-Class W177 რესტაილინგის Multibeam LED ბლოკი (A-Class W177 Facelift Multibeam). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/A%E7%BA%A7%20177%E6%96%B0%E6%AC%BE%E5%87%A0%E4%BD%95.webp',
  '/parts/thumbs/A%E7%BA%A7%20177%E6%96%B0%E6%AC%BE%E5%87%A0%E4%BD%95.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2579000100', 'A2579000100-REP, B2579000100', 'CLS-Class C257 Facelift Multibeam',
  'Mercedes CLS-Class C257 Facelift Multibeam CLS C257 Facelift Multibeam LED Module', 'მერსედეს CLS-Class C257 Facelift Multibeam CLS C257 რესტაილინგის Multibeam LED მოდული',
  'Original OEM Mercedes-Benz CLS C257 Facelift Multibeam LED Module for CLS-Class C257 Facelift Multibeam. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის CLS C257 რესტაილინგის Multibeam LED მოდული (CLS-Class C257 Facelift Multibeam). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/CLS%20257%E6%96%B0%E6%AC%BE%E5%87%A0%E4%BD%95.webp',
  '/parts/thumbs/CLS%20257%E6%96%B0%E6%AC%BE%E5%87%A0%E4%BD%95.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2189000000', 'A2189000000-REP, B2189000000', 'CLS-Class W218 Multibeam LED',
  'Mercedes CLS-Class W218 Multibeam LED CLS W218 Multibeam LED Control Unit', 'მერსედეს CLS-Class W218 Multibeam LED CLS W218 Multibeam LED მართვის ბლოკი',
  'Original OEM Mercedes-Benz CLS W218 Multibeam LED Control Unit for CLS-Class W218 Multibeam LED. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის CLS W218 Multibeam LED მართვის ბლოკი (CLS-Class W218 Multibeam LED). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/CLS%E5%87%A0%E4%BD%95.webp',
  '/parts/thumbs/CLS%E5%87%A0%E4%BD%95.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2059009534-NEW', 'A2059009534-NEW-REP, B2059009534-NEW', 'C-Class W205 Facelift Multibeam',
  'Mercedes C-Class W205 Facelift Multibeam C-Class W205 Facelift Multibeam LED Unit', 'მერსედეს C-Class W205 Facelift Multibeam C-Class W205 რესტაილინგის Multibeam LED ბლოკი',
  'Original OEM Mercedes-Benz C-Class W205 Facelift Multibeam LED Unit for C-Class W205 Facelift Multibeam. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის C-Class W205 რესტაილინგის Multibeam LED ბლოკი (C-Class W205 Facelift Multibeam). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/C%E7%BA%A7205%20%E6%96%B0%E6%AC%BE%E5%87%A0%E4%BD%95.webp',
  '/parts/thumbs/C%E7%BA%A7205%20%E6%96%B0%E6%AC%BE%E5%87%A0%E4%BD%95.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2059006805-OLD', 'A2059006805-OLD-REP, B2059006805-OLD', 'C-Class W205 Pre-Facelift High-Spec',
  'Mercedes C-Class W205 Pre-Facelift High-Spec C-Class W205 Pre-Facelift LED Module', 'მერსედეს C-Class W205 Pre-Facelift High-Spec C-Class W205 რესტაილინგამდელი LED მოდული',
  'Original OEM Mercedes-Benz C-Class W205 Pre-Facelift LED Module for C-Class W205 Pre-Facelift High-Spec. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის C-Class W205 რესტაილინგამდელი LED მოდული (C-Class W205 Pre-Facelift High-Spec). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/C%E7%BA%A7205%20%E8%80%81%E6%AC%BE%E9%AB%98%E9%85%8D.webp',
  '/parts/thumbs/C%E7%BA%A7205%20%E8%80%81%E6%AC%BE%E9%AB%98%E9%85%8D.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2069007016-METEOR', 'A2069007016-METEOR-REP, B2069007016-METEOR', 'C-Class W206 Digital Light Projection',
  'Mercedes C-Class W206 Digital Light Projection C-Class W206 Digital Light Projection Module', 'მერსედეს C-Class W206 Digital Light Projection C-Class W206 Digital Light პროექციული მოდული',
  'Original OEM Mercedes-Benz C-Class W206 Digital Light Projection Module for C-Class W206 Digital Light Projection. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის C-Class W206 Digital Light პროექციული მოდული (C-Class W206 Digital Light Projection). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Digital Light Modules')),
  '/parts/C%E7%BA%A7206%20%E6%B5%81%E6%98%9F%E9%9B%A8.webp',
  '/parts/thumbs/C%E7%BA%A7206%20%E6%B5%81%E6%98%9F%E9%9B%A8.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2129008324-OLD', 'A2129008324-OLD-REP, B2129008324-OLD', 'E-Class W212 Pre-Facelift High-Spec',
  'Mercedes E-Class W212 Pre-Facelift High-Spec E-Class W212 Pre-Facelift Xenon/LED Unit', 'მერსედეს E-Class W212 Pre-Facelift High-Spec E-Class W212 რესტაილინგამდელი ქსენონ/LED ბლოკი',
  'Original OEM Mercedes-Benz E-Class W212 Pre-Facelift Xenon/LED Unit for E-Class W212 Pre-Facelift High-Spec. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის E-Class W212 რესტაილინგამდელი ქსენონ/LED ბლოკი (E-Class W212 Pre-Facelift High-Spec). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/E%E7%BA%A7212%20%E8%80%81%E6%AC%BE%E9%AB%98%E9%85%8D.webp',
  '/parts/thumbs/E%E7%BA%A7212%20%E8%80%81%E6%AC%BE%E9%AB%98%E9%85%8D.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2139000737-OLD', 'A2139000737-OLD-REP, B2139000737-OLD', 'E-Class W213 Pre-Facelift Multibeam',
  'Mercedes E-Class W213 Pre-Facelift Multibeam E-Class W213 Pre-Facelift Multibeam LED Module', 'მერსედეს E-Class W213 Pre-Facelift Multibeam E-Class W213 რესტაილინგამდელი Multibeam LED მოდული',
  'Original OEM Mercedes-Benz E-Class W213 Pre-Facelift Multibeam LED Module for E-Class W213 Pre-Facelift Multibeam. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის E-Class W213 რესტაილინგამდელი Multibeam LED მოდული (E-Class W213 Pre-Facelift Multibeam). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/E%E7%BA%A7213%20%E8%80%81%E6%AC%BE%E5%87%A0%E4%BD%95.webp',
  '/parts/thumbs/E%E7%BA%A7213%20%E8%80%81%E6%AC%BE%E5%87%A0%E4%BD%95.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2479060000', 'A2479060000-REP, B2479060000', 'GLB-Class X247 DRL LED',
  'Mercedes GLB-Class X247 DRL LED GLB X247 DRL LED Diode Light Source', 'მერსედეს GLB-Class X247 DRL LED GLB X247 DRL LED დიოდური განათება',
  'Original OEM Mercedes-Benz GLB X247 DRL LED Diode Light Source for GLB-Class X247 DRL LED. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის GLB X247 DRL LED დიოდური განათება (GLB-Class X247 DRL LED). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('DRL & LED Diodes')),
  '/parts/GLB%20%E5%85%89%E6%BA%90.webp',
  '/parts/thumbs/GLB%20%E5%85%89%E6%BA%90.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2539000700-NEW', 'A2539000700-NEW-REP, B2539000700-NEW', 'GLC-Class X253 Facelift Multibeam',
  'Mercedes GLC-Class X253 Facelift Multibeam GLC X253 Facelift Multibeam LED Module', 'მერსედეს GLC-Class X253 Facelift Multibeam GLC X253 რესტაილინგის Multibeam LED მოდული',
  'Original OEM Mercedes-Benz GLC X253 Facelift Multibeam LED Module for GLC-Class X253 Facelift Multibeam. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის GLC X253 რესტაილინგის Multibeam LED მოდული (GLC-Class X253 Facelift Multibeam). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/GLC%20253%20%E6%96%B0%E6%AC%BE%E5%87%A0%E4%BD%95.webp',
  '/parts/thumbs/GLC%20253%20%E6%96%B0%E6%AC%BE%E5%87%A0%E4%BD%95.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A1669003309-OLD', 'A1669003309-OLD-REP, B1669003309-OLD', 'GLE W166 Pre-Facelift High-Spec',
  'Mercedes GLE W166 Pre-Facelift High-Spec GLE W166 Pre-Facelift High-Spec LED Unit', 'მერსედეს GLE W166 Pre-Facelift High-Spec GLE W166 რესტაილინგამდელი High-Spec LED ბლოკი',
  'Original OEM Mercedes-Benz GLE W166 Pre-Facelift High-Spec LED Unit for GLE W166 Pre-Facelift High-Spec. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის GLE W166 რესტაილინგამდელი High-Spec LED ბლოკი (GLE W166 Pre-Facelift High-Spec). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/GLE%20166%20%E8%80%81%E6%AC%BE%E9%AB%98%E9%85%8D.webp',
  '/parts/thumbs/GLE%20166%20%E8%80%81%E6%AC%BE%E9%AB%98%E9%85%8D.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A1679000000', 'A1679000000-REP, B1679000000', 'GLE V167 Facelift Multibeam LED',
  'Mercedes GLE V167 Facelift Multibeam LED GLE V167 Facelift Multibeam LED Computer', 'მერსედეს GLE V167 Facelift Multibeam LED GLE V167 რესტაილინგის Multibeam LED კომპიუტერი',
  'Original OEM Mercedes-Benz GLE V167 Facelift Multibeam LED Computer for GLE V167 Facelift Multibeam LED. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის GLE V167 რესტაილინგის Multibeam LED კომპიუტერი (GLE V167 Facelift Multibeam LED). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/GLE%20167%20%E6%96%B0%E6%AC%BE%E5%87%A0%E4%BD%95.webp',
  '/parts/thumbs/GLE%20167%20%E6%96%B0%E6%AC%BE%E5%87%A0%E4%BD%95.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A1669003309-GLS', 'A1669003309-GLS-REP, B1669003309-GLS', 'GLS X166 Pre-Facelift High-Spec',
  'Mercedes GLS X166 Pre-Facelift High-Spec GLS X166 Pre-Facelift High-Spec LED Unit', 'მერსედეს GLS X166 Pre-Facelift High-Spec GLS X166 რესტაილინგამდელი High-Spec LED ბლოკი',
  'Original OEM Mercedes-Benz GLS X166 Pre-Facelift High-Spec LED Unit for GLS X166 Pre-Facelift High-Spec. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის GLS X166 რესტაილინგამდელი High-Spec LED ბლოკი (GLS X166 Pre-Facelift High-Spec). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/GLS%20166%20%E8%80%81%E6%AC%BE%E9%AB%98%E9%85%8D.webp',
  '/parts/thumbs/GLS%20166%20%E8%80%81%E6%AC%BE%E9%AB%98%E9%85%8D.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A1679001111', 'A1679001111-REP, B1679001111', 'GLS X167 Facelift Multibeam LED',
  'Mercedes GLS X167 Facelift Multibeam LED GLS X167 Facelift Multibeam LED Computer', 'მერსედეს GLS X167 Facelift Multibeam LED GLS X167 რესტაილინგის Multibeam LED კომპიუტერი',
  'Original OEM Mercedes-Benz GLS X167 Facelift Multibeam LED Computer for GLS X167 Facelift Multibeam LED. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის GLS X167 რესტაილინგის Multibeam LED კომპიუტერი (GLS X167 Facelift Multibeam LED). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/GLS%20167%20%E6%96%B0%E6%AC%BE%E5%87%A0%E4%BD%95.webp',
  '/parts/thumbs/GLS%20167%20%E6%96%B0%E6%AC%BE%E5%87%A0%E4%BD%95.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2229000515-OLD', 'A2229000515-OLD-REP, B2229000515-OLD', 'S-Class W222 Pre-Facelift High-Spec',
  'Mercedes S-Class W222 Pre-Facelift High-Spec S-Class W222 Pre-Facelift Full LED Module', 'მერსედეს S-Class W222 Pre-Facelift High-Spec S-Class W222 რესტაილინგამდელი Full LED მოდული',
  'Original OEM Mercedes-Benz S-Class W222 Pre-Facelift Full LED Module for S-Class W222 Pre-Facelift High-Spec. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის S-Class W222 რესტაილინგამდელი Full LED მოდული (S-Class W222 Pre-Facelift High-Spec). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/S%E7%BA%A7%20222%E8%80%81%E6%AC%BE%E9%AB%98%E9%85%8D.webp',
  '/parts/thumbs/S%E7%BA%A7%20222%E8%80%81%E6%AC%BE%E9%AB%98%E9%85%8D.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2229004505-NEW', 'A2229004505-NEW-REP, B2229004505-NEW', 'S-Class W222 / W223 Multibeam',
  'Mercedes S-Class W222 / W223 Multibeam S-Class Multibeam LED Main Headlight Unit', 'მერსედეს S-Class W222 / W223 Multibeam S-Class Multibeam LED მთავარი ფარის ბლოკი',
  'Original OEM Mercedes-Benz S-Class Multibeam LED Main Headlight Unit for S-Class W222 / W223 Multibeam. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის S-Class Multibeam LED მთავარი ფარის ბლოკი (S-Class W222 / W223 Multibeam). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/S%E7%BA%A7%E6%96%B0%E6%AC%BE%E5%87%A0%E4%BD%95.webp',
  '/parts/thumbs/S%E7%BA%A7%E6%96%B0%E6%AC%BE%E5%87%A0%E4%BD%95.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2139005035-NEW', 'A2139005035-NEW-REP, B2139005035-NEW', 'E-Class W213 Facelift Multibeam',
  'Mercedes E-Class W213 Facelift Multibeam E-Class W213 Facelift Multibeam LED Computer', 'მერსედეს E-Class W213 Facelift Multibeam E-Class W213 რესტაილინგის Multibeam LED კომპიუტერი',
  'Original OEM Mercedes-Benz E-Class W213 Facelift Multibeam LED Computer for E-Class W213 Facelift Multibeam. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის E-Class W213 რესტაილინგის Multibeam LED კომპიუტერი (E-Class W213 Facelift Multibeam). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('Headlight Modules')),
  '/parts/%E6%96%B0%E6%AC%BEE%E7%BA%A7213%E5%87%A0%E4%BD%95.webp',
  '/parts/thumbs/%E6%96%B0%E6%AC%BEE%E7%BA%A7213%E5%87%A0%E4%BD%95.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;
insert into public.parts (code, replacement_codes, compatible_models, title_en, title_ka, description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path) values (
  'A2229060000', 'A2229060000-REP, B2229060000', 'S-Class W222 Facelift DRL LED',
  'Mercedes S-Class W222 Facelift DRL LED S-Class W222 Facelift DRL LED Diode Module', 'მერსედეს S-Class W222 Facelift DRL LED S-Class W222 რესტაილინგის DRL LED დიოდის მოდული',
  'Original OEM Mercedes-Benz S-Class W222 Facelift DRL LED Diode Module for S-Class W222 Facelift DRL LED. Genuine factory module with guaranteed performance.', 'ორიგინალი OEM მერსედეს-ბენცის S-Class W222 რესტაილინგის DRL LED დიოდის მოდული (S-Class W222 Facelift DRL LED). გარანტირებული ხარისხი და თავსებადობა.',
  (select id from public.brands where lower(btrim(name_en)) = lower('Mercedes-Benz')),
  (select id from public.categories where lower(btrim(name_en)) = lower('DRL & LED Diodes')),
  '/parts/%E6%96%B0%E6%AC%BES%E7%BA%A7%20222%E5%85%89%E6%BA%90.webp',
  '/parts/thumbs/%E6%96%B0%E6%AC%BES%E7%BA%A7%20222%E5%85%89%E6%BA%90.webp'
) on conflict (lower(btrim(code))) do update set
  replacement_codes = excluded.replacement_codes,
  compatible_models = excluded.compatible_models,
  title_en = excluded.title_en,
  title_ka = excluded.title_ka,
  description_en = excluded.description_en,
  description_ka = excluded.description_ka,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_path = excluded.image_path,
  image_thumbnail_path = excluded.image_thumbnail_path;

commit;
