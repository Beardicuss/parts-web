import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(new URL('../frontend/package.json', import.meta.url));
const sharp = require('sharp');

const [
  sourceDirectory,
  outputDirectory,
  qualityArg = '88',
  effortArg = '4',
  maximumArg = '0'
] = process.argv.slice(2);

if (!sourceDirectory || !outputDirectory) {
  throw new Error(
    'Usage: node scripts/prepare-product-image-batch.mjs <source> <output> [quality] [effort] [maximum dimension]'
  );
}

const quality = Number(qualityArg);
const effort = Number(effortArg);
const maximumDimension = Number(maximumArg);
if (!Number.isInteger(quality) || quality < 1 || quality > 100) {
  throw new Error('WebP quality must be an integer from 1 to 100.');
}
if (!Number.isInteger(effort) || effort < 0 || effort > 6) {
  throw new Error('WebP effort must be an integer from 0 to 6.');
}
if (!Number.isInteger(maximumDimension) || maximumDimension < 0) {
  throw new Error('Maximum dimension must be zero or a positive integer.');
}

const entries = await readdir(sourceDirectory, { withFileTypes: true });
const sourceFiles = entries
  .filter((entry) => entry.isFile() && /\.jpe?g$/i.test(entry.name))
  .map((entry) => entry.name)
  .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }));

await mkdir(outputDirectory, { recursive: true });
const reviewDirectory = path.join(outputDirectory, '_review');
await mkdir(reviewDirectory, { recursive: true });

const manifest = [];
for (const sourceName of sourceFiles) {
  const inputPath = path.join(sourceDirectory, sourceName);
  const outputName = `${path.parse(sourceName).name}.webp`;
  const outputPath = path.join(outputDirectory, outputName);
  let input = sharp(inputPath, { failOn: 'error' }).rotate();
  const sourceMetadata = await input.metadata();
  if (maximumDimension > 0) {
    input = input.resize(maximumDimension, maximumDimension, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }

  try {
    const existing = await sharp(outputPath).metadata();
    if (existing.format !== 'webp' || !existing.width || !existing.height) throw new Error();
  } catch {
    await input.webp({ quality, effort }).toFile(outputPath);
  }

  const outputMetadata = await sharp(outputPath).metadata();
  manifest.push({
    sourceName,
    outputName,
    width: outputMetadata.width,
    height: outputMetadata.height,
    sourceBytes: (await stat(inputPath)).size,
    outputBytes: (await stat(outputPath)).size,
    sourceOrientation: sourceMetadata.orientation ?? null
  });
}

const escapeXml = (value) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };
    return entities[character];
  });

const identifyProduct = (sourceName) => {
  const baseName = path.parse(sourceName).name;
  const exactNames = new Map([
    ['QX30 高配光源', ['Infiniti QX30 high-spec LED light-source module', 'high']],
    ['凯迪拉克XT4光源', ['Cadillac XT4 LED light-source module', 'high']],
    ['凯迪拉克尾灯光源', ['Cadillac tail-light LED light-source module', 'high']],
    ['哈佛日行光源', ['Haval daytime-running-light LED module', 'high']],
    ['埃尔法尾灯光源', ['Toyota Alphard tail-light LED module', 'high']],
    ['小海拉D1', ['Hella D1 xenon ballast (small housing)', 'high']],
    ['欧司朗D3   3角', ['Osram D3 triangular xenon ballast', 'high']],
    ['欧司朗D3  3角', ['Osram D3 triangular xenon ballast', 'high']],
    ['欧司朗D3  4角', ['Osram D3 four-corner xenon ballast', 'high']],
    ['欧司朗D8 三角', ['Osram D8 triangular xenon ballast', 'high']],
    ['沃尔沃XC90光源', ['Volvo XC90 LED light-source module', 'high']],
    ['法雷奥D3', ['Valeo D3 xenon ballast', 'high']],
    ['海拉4  D1', ['Hella Gen 4 D1 xenon ballast', 'high']],
    ['海拉四D2', ['Hella Gen 4 D2 xenon ballast', 'high']],
    ['海拉红头', ['Hella red-head xenon igniter/ballast module', 'medium']],
    ['特斯拉大灯模块', ['Tesla headlamp control module', 'high']],
    ['福特猛禽随动模块', ['Ford Raptor adaptive-headlamp module', 'high']],
    ['罗密欧日行光源', ['Alfa Romeo daytime-running-light LED module', 'high']],
    ['西亚特光源', ['SEAT LED light-source module', 'high']],
    ['轩逸日行灯驱动', ['Nissan Sylphy daytime-running-light driver', 'high']]
  ]);
  if (exactNames.has(baseName)) {
    const [productType, confidence] = exactNames.get(baseName);
    return { category: 'Lighting', productType, confidence, notes: 'Translated from supplier filename.' };
  }
  if (baseName === '0009054907') {
    return {
      category: 'Control Unit',
      productType: 'Mercedes-Benz radar sensor/control module',
      confidence: 'high',
      notes: 'Known catalog part; not a lighting module.'
    };
  }
  if (/^IMG_/i.test(baseName)) {
    return {
      category: 'Lighting',
      productType: 'LED/DRL light-source or headlamp driver module',
      confidence: 'low',
      notes: 'Exact vehicle and OEM number must be read from the product label or confirmed by supplier.'
    };
  }
  if (/^(85967|8990[678])-/.test(baseName)) {
    return {
      category: 'Lighting',
      productType: 'Toyota/Lexus headlamp control or LED driver module',
      confidence: 'medium',
      notes: 'Brand family inferred from OEM-number pattern; confirm exact model.'
    };
  }
  if (/^130732/.test(baseName)) {
    return {
      category: 'Lighting',
      productType: 'Automotive Lighting xenon ballast/headlamp control module',
      confidence: 'medium',
      notes: 'Module family inferred from part-number pattern and housing.'
    };
  }
  if (/^L90/.test(baseName) || /^6311/.test(baseName)) {
    return {
      category: 'Lighting',
      productType: 'BMW/MINI headlamp LED or control module',
      confidence: 'medium',
      notes: 'BMW lighting family inferred from OEM-number pattern; confirm exact model.'
    };
  }
  if (/^[JKL][A-Z0-9]{3}-13[BE][0-9A-Z]{3}-[A-Z]{2}$/i.test(baseName) || /^FL3Z/i.test(baseName)) {
    return {
      category: 'Lighting',
      productType: 'Ford/Lincoln headlamp control module',
      confidence: 'medium',
      notes: 'Ford engineering-number pattern; confirm exact vehicle and side.'
    };
  }
  if (/^260556623R$/i.test(baseName)) {
    return {
      category: 'Lighting',
      productType: 'Renault headlamp control module',
      confidence: 'medium',
      notes: 'Renault OEM-number pattern; confirm exact model.'
    };
  }
  return {
    category: 'Lighting',
    productType: 'Headlamp ballast, LED driver, or adaptive-light control module',
    confidence: 'low',
    notes: 'Lighting category is visually clear; exact vehicle/application still requires label or supplier confirmation.'
  };
};

const quoteCsv = (value) => `"${String(value).replaceAll('"', '""')}"`;
const identificationRows = manifest.map((item) => ({ ...item, ...identifyProduct(item.sourceName) }));
const csvColumns = [
  'sourceName',
  'outputName',
  'category',
  'productType',
  'confidence',
  'notes',
  'width',
  'height',
  'sourceBytes',
  'outputBytes'
];
const identificationCsv = [
  csvColumns.join(','),
  ...identificationRows.map((item) => csvColumns.map((column) => quoteCsv(item[column])).join(','))
].join('\n');
await writeFile(
  path.join(reviewDirectory, 'product-identification-review.csv'),
  `${identificationCsv}\n`,
  'utf8'
);

const filesPerSheet = 20;
const columns = 4;
const cellWidth = 320;
const cellHeight = 270;
const imageHeight = 220;
const sheetCount = Math.ceil(manifest.length / filesPerSheet);

for (let page = 0; page < sheetCount; page += 1) {
  const batch = manifest.slice(page * filesPerSheet, (page + 1) * filesPerSheet);
  const rows = Math.ceil(batch.length / columns);
  const composites = [];

  for (const [index, item] of batch.entries()) {
    const left = (index % columns) * cellWidth;
    const top = Math.floor(index / columns) * cellHeight;
    const thumbnail = await sharp(path.join(outputDirectory, item.outputName))
      .resize(cellWidth - 12, imageHeight - 12, {
        fit: 'contain',
        background: '#f3f4f6'
      })
      .jpeg({ quality: 82 })
      .toBuffer();
    composites.push({ input: thumbnail, left: left + 6, top: top + 6 });

    const label = Buffer.from(`
      <svg width="${cellWidth - 12}" height="42">
        <rect width="100%" height="100%" fill="#181a1f"/>
        <text x="6" y="25" fill="white" font-family="Arial, sans-serif" font-size="15">
          ${escapeXml(item.sourceName)}
        </text>
      </svg>`);
    composites.push({ input: label, left: left + 6, top: top + imageHeight + 2 });
  }

  await sharp({
    create: {
      width: columns * cellWidth,
      height: rows * cellHeight,
      channels: 3,
      background: '#181a1f'
    }
  })
    .composite(composites)
    .jpeg({ quality: 88 })
    .toFile(path.join(reviewDirectory, `sheet-${String(page + 1).padStart(2, '0')}.jpg`));
}

const totals = manifest.reduce(
  (result, item) => ({
    sourceBytes: result.sourceBytes + item.sourceBytes,
    outputBytes: result.outputBytes + item.outputBytes
  }),
  { sourceBytes: 0, outputBytes: 0 }
);

await writeFile(
  path.join(reviewDirectory, 'manifest.json'),
  `${JSON.stringify(
    { quality, effort, maximumDimension: maximumDimension || null, totals, files: manifest },
    null,
    2
  )}\n`,
  'utf8'
);

console.log(
  JSON.stringify(
    {
      files: manifest.length,
      quality,
      effort,
      maximumDimension: maximumDimension || null,
      sourceBytes: totals.sourceBytes,
      outputBytes: totals.outputBytes,
      reductionPercent: Math.round((1 - totals.outputBytes / totals.sourceBytes) * 1000) / 10,
      outputDirectory,
      reviewSheets: sheetCount
    },
    null,
    2
  )
);
