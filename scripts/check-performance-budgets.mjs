import { readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distAssets = path.join(projectRoot, 'frontend/dist/assets');
const publicThumbnails = path.join(projectRoot, 'frontend/public/parts/thumbs');
const maxEntryBytes = 400_000;
const maxThumbnailBytes = 100_000;

const assetFiles = await readdir(distAssets);
const entryScripts = assetFiles.filter((file) => /^index-.*\.js$/.test(file));
if (entryScripts.length !== 1) {
  throw new Error(`Expected one initial entry script, found ${entryScripts.length}.`);
}

const entryBytes = (await stat(path.join(distAssets, entryScripts[0]))).size;
if (entryBytes > maxEntryBytes) {
  throw new Error(`Initial JavaScript is ${entryBytes} bytes; budget is ${maxEntryBytes}.`);
}

const thumbnailFiles = (await readdir(publicThumbnails)).filter((file) =>
  file.toLowerCase().endsWith('.webp')
);
const oversized = [];
for (const file of thumbnailFiles) {
  const bytes = (await stat(path.join(publicThumbnails, file))).size;
  if (bytes > maxThumbnailBytes) oversized.push(`${file}: ${bytes} bytes`);
}
if (oversized.length) {
  throw new Error(`Card thumbnails exceed ${maxThumbnailBytes} bytes:\n${oversized.join('\n')}`);
}

console.log(
  `Performance budgets passed: entry ${Math.round(entryBytes / 1024)} KB; ` +
    `${thumbnailFiles.length} thumbnails at or below ${Math.round(maxThumbnailBytes / 1024)} KB.`
);
