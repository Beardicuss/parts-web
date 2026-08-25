const UNKNOWN_MODEL = 'Unverified Model';

const titleCaseModule = (value) => value?.trim() || 'Headlight Module';

export function parseProductImagePath(file) {
  const suppliedPath = file.webkitRelativePath || file.relativePath || file.name;
  const segments = suppliedPath.split(/[\\/]/).filter(Boolean);
  const productsIndex = segments.findIndex((segment) => segment.toLowerCase() === 'products');
  const productSegments = productsIndex >= 0 ? segments.slice(productsIndex + 1) : segments;
  const filename = productSegments.at(-1) || file.name;
  const code = filename.replace(/\.[^.]+$/, '').trim();

  let brand = '';
  let model = UNKNOWN_MODEL;
  let category = 'Lighting';
  let moduleFamily = 'Headlight Module';

  if (productSegments.length >= 5) {
    [brand, model, category, moduleFamily] = productSegments.slice(-5, -1);
  }

  const title = [brand, model !== UNKNOWN_MODEL ? model : '', titleCaseModule(moduleFamily)]
    .filter(Boolean)
    .join(' ')
    .trim();
  const needsReview = !brand || model === UNKNOWN_MODEL || /unverified|shared/i.test(model);

  return {
    code,
    brandName: brand,
    categoryName: category,
    compatible_models: model === UNKNOWN_MODEL ? '' : model,
    moduleFamily: titleCaseModule(moduleFamily),
    title_en: title || code,
    title_ka: title || code,
    sourcePath: suppliedPath,
    needsReview,
    reviewReason: !brand
      ? 'Folder structure was not recognized.'
      : model === UNKNOWN_MODEL
        ? 'Exact vehicle model is not verified.'
        : /shared/i.test(model)
          ? 'This module uses a shared vehicle platform.'
          : ''
  };
}

export async function hashFile(file) {
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function markBatchDuplicates(rows, existingCodes = []) {
  const existing = new Set(existingCodes.map((code) => String(code).trim().toLowerCase()));
  const codeCounts = new Map();
  const hashCounts = new Map();
  for (const row of rows) {
    const code = row.code.trim().toLowerCase();
    if (code) codeCounts.set(code, (codeCounts.get(code) || 0) + 1);
    if (row.hash) hashCounts.set(row.hash, (hashCounts.get(row.hash) || 0) + 1);
  }

  return rows.map((row) => {
    const code = row.code.trim().toLowerCase();
    const duplicateCode = Boolean(code && ((codeCounts.get(code) || 0) > 1 || existing.has(code)));
    const duplicateImage = Boolean(row.hash && (hashCounts.get(row.hash) || 0) > 1);
    return {
      ...row,
      duplicateCode,
      duplicateImage,
      selected: duplicateCode || duplicateImage ? false : row.selected
    };
  });
}

export function matchReferenceId(items, name) {
  const normalized = String(name || '')
    .trim()
    .toLowerCase();
  return items.find((item) => item.name_en.trim().toLowerCase() === normalized)?.id ?? '';
}
