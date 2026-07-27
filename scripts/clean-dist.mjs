import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const frontendRoot = path.join(repositoryRoot, 'frontend');
const distDirectory = path.join(frontendRoot, 'dist');
const relative = path.relative(frontendRoot, distDirectory);

if (relative !== 'dist' || path.basename(distDirectory) !== 'dist') {
  throw new Error(`Refusing to remove unexpected build path: ${distDirectory}`);
}

await rm(distDirectory, { recursive: true, force: true });
console.log(`Cleared disposable build output: ${distDirectory}`);
