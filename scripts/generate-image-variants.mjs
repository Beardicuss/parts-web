import { readdir, mkdir, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(new URL('../frontend/package.json', import.meta.url));
const sharp = require('sharp');

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDirectory = path.join(projectRoot, 'frontend/public/parts');
const thumbnailDirectory = path.join(sourceDirectory, 'thumbs');
const thumbnailWidth = 640;
const thumbnailHeight = 480;

await mkdir(thumbnailDirectory, { recursive: true });

const files = (await readdir(sourceDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.webp'))
  .map((entry) => entry.name);

let sourceBytes = 0;
let thumbnailBytes = 0;

for (const file of files) {
  const source = path.join(sourceDirectory, file);
  const destination = path.join(thumbnailDirectory, file);
  sourceBytes += (await stat(source)).size;
  await sharp(source)
    .rotate()
    .resize(thumbnailWidth, thumbnailHeight, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
      withoutEnlargement: true
    })
    .webp({ quality: 72, effort: 5 })
    .toFile(destination);
  thumbnailBytes += (await stat(destination)).size;
}

const reduction = sourceBytes
  ? Math.round((1 - thumbnailBytes / sourceBytes) * 100)
  : 0;
console.log(
  `Generated ${files.length} card thumbnails: ${Math.round(sourceBytes / 1024)} KB → ` +
    `${Math.round(thumbnailBytes / 1024)} KB (${reduction}% reduction).`
);
