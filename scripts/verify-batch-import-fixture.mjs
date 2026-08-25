import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  hashFile,
  markBatchDuplicates,
  parseProductImagePath,
} from "../frontend/src/utils/batchImport.js";

const [productsDirectory] = process.argv.slice(2);
if (!productsDirectory) {
  throw new Error(
    "Usage: node scripts/verify-batch-import-fixture.mjs <Products directory>",
  );
}

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(fullPath)));
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) files.push(fullPath);
  }
  return files;
}

const paths = await collect(productsDirectory);
const rows = [];
for (const fullPath of paths) {
  const buffer = await readFile(fullPath);
  const relativePath = path.join(
    "Products",
    path.relative(productsDirectory, fullPath),
  );
  const file = {
    name: path.basename(fullPath),
    webkitRelativePath: relativePath,
    arrayBuffer: async () =>
      buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength,
      ),
  };
  const parsed = parseProductImagePath(file);
  rows.push({ ...parsed, hash: await hashFile(file), selected: true });
}

const checked = markBatchDuplicates(rows);
const summary = {
  files: checked.length,
  ready: checked.filter(
    (row) => !row.needsReview && !row.duplicateCode && !row.duplicateImage,
  ).length,
  needsReview: checked.filter((row) => row.needsReview).length,
  duplicateCodes: checked.filter((row) => row.duplicateCode).length,
  duplicateImages: checked.filter((row) => row.duplicateImage).length,
  missingCodes: checked.filter((row) => !row.code).length,
  missingBrands: checked.filter((row) => !row.brandName).length,
  categories: [...new Set(checked.map((row) => row.categoryName))].sort(),
};

console.log(JSON.stringify(summary, null, 2));
if (
  summary.files === 0 ||
  summary.missingCodes ||
  summary.missingBrands ||
  summary.duplicateImages
) {
  process.exitCode = 1;
}
