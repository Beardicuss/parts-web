import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  MOCK_BRANDS,
  MOCK_CATEGORIES,
  MOCK_PARTS
} from '../frontend/src/mockData.js';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(repositoryRoot, 'supabase', 'seed_all.sql');

const quote = (value) => `'${String(value ?? '').replaceAll("'", "''")}'`;
const brandById = new Map(MOCK_BRANDS.map((brand) => [brand.id, brand]));
const categoryById = new Map(MOCK_CATEGORIES.map((category) => [category.id, category]));

const lines = [
  '-- GENERATED FILE: run `npm run db:seed:generate` in frontend after editing mockData.js.',
  '-- Canonical source: frontend/src/mockData.js. Safe to run repeatedly.',
  '',
  'begin;',
  ''
];

for (const brand of MOCK_BRANDS) {
  lines.push(
    `insert into public.brands (name_en, name_ka) values (${quote(brand.name_en)}, ${quote(brand.name_ka)})`,
    `on conflict (lower(btrim(name_en))) do update set name_ka = excluded.name_ka;`
  );
}

lines.push('');
for (const category of MOCK_CATEGORIES) {
  lines.push(
    `insert into public.categories (name_en, name_ka) values (${quote(category.name_en)}, ${quote(category.name_ka)})`,
    `on conflict (lower(btrim(name_en))) do update set name_ka = excluded.name_ka;`
  );
}

lines.push('');
for (const part of MOCK_PARTS) {
  const brand = brandById.get(part.brand_id);
  const category = categoryById.get(part.category_id);
  if (!brand || !category) throw new Error(`Missing reference for part ${part.code}`);

  lines.push(
    `insert into public.parts (` +
      `code, replacement_codes, compatible_models, title_en, title_ka, ` +
      `description_en, description_ka, brand_id, category_id, image_path, image_thumbnail_path` +
      `) values (`,
    `  ${quote(part.code)}, ${quote(part.replacement_codes)}, ${quote(part.compatible_models)},`,
    `  ${quote(part.title_en)}, ${quote(part.title_ka)},`,
    `  ${quote(part.description_en)}, ${quote(part.description_ka)},`,
    `  (select id from public.brands where lower(btrim(name_en)) = lower(${quote(brand.name_en)})),`,
    `  (select id from public.categories where lower(btrim(name_en)) = lower(${quote(category.name_en)})),`,
    `  ${quote(part.image_path)},`,
    `  ${quote(part.image_path.replace('/parts/', '/parts/thumbs/'))}`,
    `) on conflict (lower(btrim(code))) do update set`,
    `  replacement_codes = excluded.replacement_codes,`,
    `  compatible_models = excluded.compatible_models,`,
    `  title_en = excluded.title_en,`,
    `  title_ka = excluded.title_ka,`,
    `  description_en = excluded.description_en,`,
    `  description_ka = excluded.description_ka,`,
    `  brand_id = excluded.brand_id,`,
    `  category_id = excluded.category_id,`,
    `  image_path = excluded.image_path,`,
    `  image_thumbnail_path = excluded.image_thumbnail_path;`
  );
}

lines.push('', 'commit;', '');
const generatedSql = lines.join('\n');

if (process.argv.includes('--check')) {
  const existingSql = await readFile(destination, 'utf8');
  if (existingSql !== generatedSql) {
    console.error('supabase/seed_all.sql is stale. Run `npm run db:seed:generate`.');
    process.exitCode = 1;
  } else {
    console.log(`Seed is current for ${MOCK_PARTS.length} canonical parts.`);
  }
} else {
  await writeFile(destination, generatedSql, 'utf8');
  console.log(`Generated ${destination} with ${MOCK_PARTS.length} parts.`);
}
