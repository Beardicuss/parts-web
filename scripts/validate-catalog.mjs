import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {
  MOCK_BRANDS,
  MOCK_CATEGORIES,
  MOCK_PARTS
} from '../frontend/src/mockData.js';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(repositoryRoot, 'frontend', 'public');
const errors = [];
const warnings = [];

async function collectFiles(directory, prefix = '') {
  const files = new Set();
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relativePath = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) {
      for (const child of await collectFiles(path.join(directory, entry.name), relativePath)) {
        files.add(child);
      }
    } else {
      files.add(`/${relativePath}`);
    }
  }
  return files;
}

const publicFiles = await collectFiles(publicRoot);

function duplicates(items, selector) {
  const seen = new Set();
  return items.filter((item) => {
    const value = selector(item);
    if (seen.has(value)) return true;
    seen.add(value);
    return false;
  });
}

for (const [label, records] of [
  ['brand', MOCK_BRANDS],
  ['category', MOCK_CATEGORIES]
]) {
  for (const record of records) {
    if (!record.name_en?.trim() || !record.name_ka?.trim()) {
      errors.push(`${label} ${record.id} is missing a translated name`);
    }
  }
  for (const record of duplicates(records, (item) => item.name_en.trim().toLowerCase())) {
    errors.push(`duplicate ${label} name: ${record.name_en}`);
  }
}

const brandIds = new Set(MOCK_BRANDS.map(({ id }) => id));
const categoryIds = new Set(MOCK_CATEGORIES.map(({ id }) => id));
for (const part of MOCK_PARTS) {
  if (part.code !== part.code.trim() || !part.code) errors.push(`invalid code: ${part.code}`);
  if (!part.title_en?.trim() || !part.title_ka?.trim()) {
    errors.push(`${part.code} is missing a required EN or KA title`);
  }
  if (!brandIds.has(part.brand_id)) errors.push(`${part.code} references unknown brand`);
  if (!categoryIds.has(part.category_id)) errors.push(`${part.code} references unknown category`);
  if (!part.image_path?.startsWith('/')) {
    errors.push(`${part.code} has an invalid local image path`);
  } else {
    const decodedPath = decodeURIComponent(part.image_path);
    if (!publicFiles.has(decodedPath)) {
      errors.push(`${part.code} image does not exist: ${part.image_path}`);
    }
  }
  if (/-REP\b|,\s*B[A-Z0-9]/i.test(part.replacement_codes ?? '')) {
    warnings.push(`${part.code} has synthetic-looking replacement codes`);
  }
}

for (const part of duplicates(MOCK_PARTS, (item) => item.code.trim().toLowerCase())) {
  errors.push(`duplicate product code: ${part.code}`);
}

console.log(
  JSON.stringify(
    {
      counts: {
        brands: MOCK_BRANDS.length,
        categories: MOCK_CATEGORIES.length,
        parts: MOCK_PARTS.length,
        uniqueProductCodes: new Set(
          MOCK_PARTS.map(({ code }) => code.trim().toLowerCase())
        ).size
      },
      warnings: {
        syntheticReplacementCodes: warnings.length
      }
    },
    null,
    2
  )
);

if (warnings.length) {
  console.warn(
    `${warnings.length} replacement-code records require client verification; see docs/PHASE_1_DATA_REVIEW.md.`
  );
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
}
