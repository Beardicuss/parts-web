import {
  copyFile,
  cp,
  mkdir,
  readdir,
  readFile,
  stat,
  writeFile,
} from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const [stagingRoot, outputRoot] = process.argv.slice(2);

if (!stagingRoot || !outputRoot) {
  throw new Error(
    "Usage: node scripts/organize-product-image-batch.mjs <staging root> <output root>",
  );
}

const safeSegment = (value) =>
  value
    .replace(/[<>:"/\\|?*]/g, "-")
    .replace(/[. ]+$/g, "")
    .trim();

const quoteCsv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

const explicitVagModels = [
  [/^A3/i, ["Audi", "A3", "high"]],
  [/^A4/i, ["Audi", "A4", "high"]],
  [/^A5/i, ["Audi", "A5", "high"]],
  [/^Q5/i, ["Audi", "Q5", "high"]],
  [/^Q7/i, ["Audi", "Q7", "high"]],
  [/^保时捷卡宴/, ["Porsche", "Cayenne", "high"]],
  [/^新款帕萨特/, ["Volkswagen", "Passat", "high"]],
  [/^途观L/, ["Volkswagen", "Tiguan L", "high"]],
  [/^途锐新款/, ["Volkswagen", "Touareg", "high"]],
];

const vagPrefixes = [
  [/^1K0/i, ["Volkswagen", "Golf Mk5 - Jetta Platform", "medium"]],
  [/^1T0/i, ["Volkswagen", "Touran", "high"]],
  [/^3D0/i, ["Volkswagen Group", "Phaeton - Bentley Platform", "medium"]],
  [/^4G[08]/i, ["Audi", "A6 - A7 C7", "high"]],
  [/^4H[04]/i, ["Audi", "A8 D4", "high"]],
  [/^4K0/i, ["Audi", "A6 - A7 C8", "high"]],
  [/^4M0/i, ["Audi", "Q7 - Q8 4M", "high"]],
  [/^4N0/i, ["Audi", "A8 D5", "high"]],
  [/^5ND/i, ["Volkswagen", "Tiguan I", "high"]],
  [/^761/i, ["Volkswagen", "Touareg III CR", "medium"]],
  [/^7L6/i, ["Volkswagen", "Touareg I", "high"]],
  [/^7P5/i, ["Volkswagen", "Touareg II", "high"]],
  [/^7PP/i, ["Volkswagen Group", "Cayenne 958 - Touareg II Shared", "medium"]],
  [/^80A/i, ["Audi", "Q5 FY", "high"]],
  [/^81A/i, ["Audi", "Q2 GA", "medium"]],
  [/^8K[05]/i, ["Audi", "A4 - A5 B8", "high"]],
  [/^8R0/i, ["Audi", "Q5 8R", "high"]],
  [/^8S0/i, ["Audi", "TT 8S", "high"]],
  [/^8U0/i, ["Audi", "Q3 8U", "high"]],
  [/^8V0/i, ["Audi", "A3 8V", "high"]],
  [/^8W6/i, ["Audi", "A4 - A5 B9", "high"]],
  [/^8X0/i, ["Audi", "A1 8X", "high"]],
  [/^95B/i, ["Porsche", "Macan 95B", "high"]],
  [/^970/i, ["Porsche", "Panamera I 970", "high"]],
  [/^991/i, ["Porsche", "911 991", "high"]],
  [/^992/i, ["Porsche", "911 992", "high"]],
];

const bmwNamedModels = [
  [/F06/i, ["BMW", "6 Series Gran Coupe F06"]],
  [/F15/i, ["BMW", "X5 F15"]],
  [/F20/i, ["BMW", "1 Series F20"]],
  [/F23/i, ["BMW", "2 Series Convertible F23"]],
  [/F34/i, ["BMW", "3 Series GT F34"]],
  [/F35/i, ["BMW", "3 Series LWB F35"]],
  [/F44/i, ["BMW", "2 Series Gran Coupe F44"]],
  [/F49/i, ["BMW", "X1 LWB F49"]],
  [/F56/i, ["MINI", "Hatch F56"]],
  [/G05/i, ["BMW", "X5 G05"]],
  [/G07/i, ["BMW", "X7 G07"]],
  [/G08/i, ["BMW", "X3 LWB G08"]],
  [/G12/i, ["BMW", "7 Series LWB G12"]],
  [/G28/i, ["BMW", "3 Series LWB G28"]],
  [/G38/i, ["BMW", "5 Series LWB G38"]],
  [/M4/i, ["BMW", "M4 - Chassis Unverified"]],
  [/X3/i, ["BMW", "X3 - Chassis Unverified"]],
  [/宝马6系/i, ["BMW", "6 Series - Chassis Unverified"]],
];

const identifyModuleFamily = (name) => {
  if (/激光/.test(name)) return "Laser Headlight Modules";
  if (/矩阵/.test(name)) return "Matrix LED Modules";
  if (/氙气|D1|D2|D3|D8/i.test(name)) return "Xenon Ballasts";
  if (/光源/.test(name)) return "LED Light Source Modules";
  if (/电机/.test(name)) return "Headlight Adjustment Motors";
  if (/全LED|全 LED|LED/i.test(name)) return "Full LED Module Sets";
  if (/907381/i.test(name)) return "Xenon Ballasts";
  if (/99847[34]|9415(71|72|91|92|97)/i.test(name)) return "LED Driver Modules";
  if (/941329|907397|907399|907472/i.test(name))
    return "Headlight Control Modules";
  return "Headlight Modules - Type Unverified";
};

const classify = (sourceGroup, outputName) => {
  const name = path.parse(outputName).name;
  const moduleFamily = identifyModuleFamily(name);

  if (sourceGroup === "VAG") {
    for (const [pattern, [brand, model, confidence]] of explicitVagModels) {
      if (pattern.test(name))
        return { brand, model, category: "Lighting", moduleFamily, confidence };
    }
    for (const [pattern, [brand, model, confidence]] of vagPrefixes) {
      if (pattern.test(name))
        return { brand, model, category: "Lighting", moduleFamily, confidence };
    }
    return {
      brand: "Volkswagen Group",
      model: "Unverified Model",
      category: "Lighting",
      moduleFamily,
      confidence: "low",
    };
  }

  // One Audi/VAG module was supplied in the BMW batch.
  if (/^4N0/i.test(name)) {
    return {
      brand: "Audi",
      model: "A8 D5",
      category: "Lighting",
      moduleFamily,
      confidence: "high",
    };
  }

  for (const [pattern, [brand, model]] of bmwNamedModels) {
    if (pattern.test(name)) {
      return {
        brand,
        model,
        category: "Lighting",
        moduleFamily,
        confidence: "high",
      };
    }
  }

  return {
    brand: "BMW",
    model: "Unverified Model",
    category: "Lighting",
    moduleFamily,
    confidence: "low",
  };
};

const groups = ["VAG", "BMW"];
const rows = [];
const seenHashes = new Map();
const skippedDuplicates = [];

for (const sourceGroup of groups) {
  const sourceDirectory = path.join(stagingRoot, sourceGroup);
  const files = (await readdir(sourceDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && /\.webp$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) =>
      left.localeCompare(right, undefined, { numeric: true }),
    );

  for (const outputName of files) {
    const classification = classify(sourceGroup, outputName);
    const targetDirectory = path.join(
      outputRoot,
      "Products",
      safeSegment(classification.brand),
      safeSegment(classification.model),
      classification.category,
      safeSegment(classification.moduleFamily),
    );
    const sourcePath = path.join(sourceDirectory, outputName);
    const targetPath = path.join(targetDirectory, outputName);
    const sourceBuffer = await readFile(sourcePath);
    const hash = createHash("sha256").update(sourceBuffer).digest("hex");
    const duplicateOf = seenHashes.get(hash);
    const candidate = {
      sourceGroup,
      originalFile: outputName,
      ...classification,
      bytes: sourceBuffer.length,
      sha256: hash,
      relativePath: path.relative(outputRoot, targetPath),
    };
    if (duplicateOf) {
      skippedDuplicates.push({
        ...candidate,
        duplicateOf: duplicateOf.relativePath,
      });
      continue;
    }
    await mkdir(targetDirectory, { recursive: true });
    await copyFile(sourcePath, targetPath);
    rows.push(candidate);
    seenHashes.set(hash, candidate);
  }
}

const reviewDirectory = path.join(outputRoot, "00_REVIEW");
await mkdir(reviewDirectory, { recursive: true });

for (const sourceGroup of groups) {
  const sourceReview = path.join(stagingRoot, sourceGroup, "_review");
  const targetReview = path.join(
    reviewDirectory,
    "Contact Sheets",
    sourceGroup,
  );
  await cp(sourceReview, targetReview, { recursive: true, force: true });
}

const columns = [
  "sourceGroup",
  "originalFile",
  "brand",
  "model",
  "category",
  "moduleFamily",
  "confidence",
  "bytes",
  "relativePath",
  "sha256",
];
const inventory = [
  columns.join(","),
  ...rows.map((row) =>
    columns.map((column) => quoteCsv(row[column])).join(","),
  ),
].join("\n");
await writeFile(
  path.join(reviewDirectory, "organized-inventory.csv"),
  `${inventory}\n`,
  "utf8",
);

const duplicateCsv = [
  "sha256,removedFile,keptFile",
  ...skippedDuplicates.map((item) =>
    [
      quoteCsv(item.sha256),
      quoteCsv(item.relativePath),
      quoteCsv(item.duplicateOf),
    ].join(","),
  ),
].join("\n");
await writeFile(
  path.join(reviewDirectory, "exact-duplicates.csv"),
  `${duplicateCsv}\n`,
  "utf8",
);

const summary = {
  generatedAt: new Date().toISOString(),
  files: rows.length,
  bytes: rows.reduce((total, row) => total + row.bytes, 0),
  removedExactDuplicates: skippedDuplicates.length,
  confidence: rows.reduce((counts, row) => {
    counts[row.confidence] = (counts[row.confidence] ?? 0) + 1;
    return counts;
  }, {}),
  byBrand: rows.reduce((counts, row) => {
    counts[row.brand] = (counts[row.brand] ?? 0) + 1;
    return counts;
  }, {}),
};
await writeFile(
  path.join(reviewDirectory, "summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

await writeFile(
  path.join(outputRoot, "README.txt"),
  [
    "ORGANIZED PRODUCT PHOTOS",
    "",
    "Structure: Products / Brand / Model or Platform / Lighting / Module Family / image.webp",
    "",
    "High confidence means the supplier filename or OEM platform prefix identifies the vehicle.",
    "Medium confidence means the OEM platform prefix is shared or should be confirmed before publishing.",
    "Low confidence items are deliberately stored under Unverified Model rather than guessed.",
    "",
    "Original filenames and part numbers were preserved.",
    "Exact duplicate photos are listed in 00_REVIEW\\exact-duplicates.csv.",
    "The complete sortable inventory is 00_REVIEW\\organized-inventory.csv.",
    "",
    `Files: ${summary.files}`,
    `Image payload: ${(summary.bytes / 1024 / 1024).toFixed(1)} MB`,
  ].join("\r\n"),
  "utf8",
);

console.log(JSON.stringify(summary, null, 2));
