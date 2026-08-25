import { describe, expect, it } from 'vitest';
import { allowedPublicationStatuses, isPublicPart } from './publicationStatus.js';

describe('publication lifecycle', () => {
  it('restores archived products to draft instead of publishing directly', () => {
    expect(allowedPublicationStatuses('archived')).toEqual(['archived', 'draft']);
  });

  it('allows published products to return to draft or archive', () => {
    expect(allowedPublicationStatuses('published')).toEqual(['published', 'draft', 'archived']);
  });

  it('treats legacy products as published during migration compatibility', () => {
    expect(isPublicPart({})).toBe(true);
    expect(isPublicPart({ publication_status: 'draft' })).toBe(false);
  });
});
