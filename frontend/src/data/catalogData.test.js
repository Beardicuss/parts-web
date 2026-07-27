import { describe, expect, it } from 'vitest';
import { MOCK_BRANDS, MOCK_CATEGORIES, MOCK_PARTS } from '../mockData.js';

describe('canonical catalog data', () => {
  it('contains 83 unique, fully linked products', () => {
    const codes = MOCK_PARTS.map(({ code }) => code.trim().toLowerCase());
    const brandIds = new Set(MOCK_BRANDS.map(({ id }) => id));
    const categoryIds = new Set(MOCK_CATEGORIES.map(({ id }) => id));

    expect(MOCK_PARTS).toHaveLength(83);
    expect(new Set(codes).size).toBe(83);
    for (const part of MOCK_PARTS) {
      expect(part.code).toBe(part.code.trim());
      expect(part.title_en.trim()).not.toBe('');
      expect(part.title_ka.trim()).not.toBe('');
      expect(part).toHaveProperty('replacement_codes');
      expect(part).toHaveProperty('compatible_models');
      expect(brandIds.has(part.brand_id)).toBe(true);
      expect(categoryIds.has(part.category_id)).toBe(true);
    }
  });
});
