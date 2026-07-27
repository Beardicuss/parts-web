import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetsDirectory = path.join(repositoryRoot, 'frontend', 'dist', 'assets');
const files = (await readdir(assetsDirectory)).filter((file) => file.endsWith('.js'));
const leakedFiles = [];

for (const file of files) {
  const source = await readFile(path.join(assetsDirectory, file), 'utf8');
  if (source.includes('A0009052504')) leakedFiles.push(file);
}

if (leakedFiles.length) {
  console.error(`Mock catalog leaked into production bundles: ${leakedFiles.join(', ')}`);
  process.exitCode = 1;
} else {
  console.log('Production bundle contains no canonical mock product records.');
}
