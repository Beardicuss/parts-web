import { describe, expect, it } from 'vitest';
import { markBatchDuplicates, parseProductImagePath } from './batchImport.js';

describe('batch import metadata', () => {
  it('extracts product fields from the organized folder structure', () => {
    const parsed = parseProductImagePath({
      name: '80A907397A.webp',
      webkitRelativePath: 'Products/Audi/Q5 FY/Lighting/Headlight Control Modules/80A907397A.webp'
    });
    expect(parsed).toMatchObject({
      code: '80A907397A',
      brandName: 'Audi',
      compatible_models: 'Q5 FY',
      categoryName: 'Lighting',
      moduleFamily: 'Headlight Control Modules',
      needsReview: false
    });
  });

  it('flags unverified models for focused review', () => {
    const parsed = parseProductImagePath({
      name: '63117440875.webp',
      webkitRelativePath:
        'Products/BMW/Unverified Model/Lighting/Headlight Modules - Type Unverified/63117440875.webp'
    });
    expect(parsed.needsReview).toBe(true);
    expect(parsed.compatible_models).toBe('');
  });

  it('deselects duplicate codes and exact duplicate images', () => {
    const rows = markBatchDuplicates(
      [
        { code: 'A1', hash: 'same', selected: true },
        { code: 'A2', hash: 'same', selected: true },
        { code: 'EXISTING', hash: 'other', selected: true }
      ],
      ['existing']
    );
    expect(rows.every((row) => row.selected === false)).toBe(true);
    expect(rows[0].duplicateImage).toBe(true);
    expect(rows[2].duplicateCode).toBe(true);
  });
});
