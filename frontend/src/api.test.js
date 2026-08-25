import { beforeEach, describe, expect, it, vi } from 'vitest';

const service = vi.hoisted(() => {
  const state = {
    databaseResults: [],
    uploadResults: [],
    removeResults: []
  };

  function query() {
    const chain = {};
    for (const method of [
      'select',
      'order',
      'limit',
      'range',
      'or',
      'in',
      'eq',
      'insert',
      'update',
      'delete',
      'single',
      'maybeSingle'
    ]) {
      chain[method] = vi.fn(() => chain);
    }
    chain.then = (resolve, reject) =>
      Promise.resolve(state.databaseResults.shift() ?? { data: [], count: 0, error: null }).then(
        resolve,
        reject
      );
    return chain;
  }

  const storageBucket = {
    upload: vi.fn(async () => state.uploadResults.shift() ?? { error: null }),
    remove: vi.fn(async () => state.removeResults.shift() ?? { error: null }),
    getPublicUrl: vi.fn((path) => ({
      data: {
        publicUrl: `https://project.supabase.co/storage/v1/object/public/part-images/${path}`
      }
    })),
    list: vi.fn(async () => ({ data: [], error: null }))
  };

  return {
    state,
    client: {
      from: vi.fn(() => query()),
      storage: { from: vi.fn(() => storageBucket) }
    },
    storageBucket
  };
});

vi.mock('./supabaseClient.js', () => ({
  supabase: service.client,
  isSupabaseConfigured: true
}));

import { api } from './api.js';
import { API_ERROR_CODES } from './apiErrors.js';

const form = {
  code: 'TEST-1',
  replacement_codes: '',
  compatible_models: '',
  title_en: 'Test',
  title_ka: 'ტესტი',
  description_en: '',
  description_ka: '',
  brand_id: 1,
  category_id: 1
};

beforeEach(() => {
  vi.restoreAllMocks();
  service.state.databaseResults = [];
  service.state.uploadResults = [];
  service.state.removeResults = [];
  service.client.from.mockClear();
  service.storageBucket.upload.mockClear();
  service.storageBucket.remove.mockClear();
});

describe('catalog API correctness', () => {
  it('returns a real empty array and does not substitute mock products', async () => {
    service.state.databaseResults.push({ data: [], error: null });
    await expect(api.getParts()).resolves.toEqual([]);
  });

  it('propagates an outage as a retryable structured network error', async () => {
    service.state.databaseResults.push({ data: null, error: new TypeError('Failed to fetch') });
    await expect(api.getParts()).rejects.toMatchObject({
      code: API_ERROR_CODES.NETWORK,
      retryable: true
    });
  });

  it('returns not-found instead of resurrecting a deleted mock record', async () => {
    service.state.databaseResults.push({ data: null, error: null });
    await expect(api.getPart(1)).rejects.toMatchObject({
      code: API_ERROR_CODES.NOT_FOUND
    });
  });

  it('returns complete pagination metadata from the server count', async () => {
    service.state.databaseResults.push({
      data: [{ id: 83, code: 'A83', brands: null, categories: null }],
      count: 83,
      error: null
    });
    await expect(
      api.getAdminParts({ search: 'A83', page: 3, pageSize: 20 })
    ).resolves.toMatchObject({
      total: 83,
      page: 3,
      pageSize: 20,
      totalPages: 5
    });
  });

  it('returns all existing product codes for batch duplicate checks', async () => {
    service.state.databaseResults.push({
      data: [{ code: 'A1' }, { code: 'B2' }],
      error: null
    });
    await expect(api.getExistingPartCodes()).resolves.toEqual(['A1', 'B2']);
  });
});

describe('media lifecycle', () => {
  it('deletes the old object only after an image replacement succeeds', async () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValueOnce('new-image');
    service.state.databaseResults.push(
      {
        data: { image_path: 'https://x/part-images/old.webp' },
        error: null
      },
      {
        data: { id: 1, ...form, image_path: 'https://x/part-images/new-image.webp' },
        error: null
      }
    );
    const image = new File(['image'], 'processed.webp', { type: 'image/webp' });

    await api.updatePart(1, form, image);

    expect(service.storageBucket.remove).toHaveBeenCalledWith(['old.webp']);
  });

  it('rolls back a new upload and retains the old image when the database update fails', async () => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValueOnce('rolled-back');
    service.state.databaseResults.push(
      {
        data: { image_path: 'https://x/part-images/old.webp' },
        error: null
      },
      { data: null, error: { code: '23514', message: 'invalid' } }
    );
    const image = new File(['image'], 'processed.webp', { type: 'image/webp' });

    await expect(api.updatePart(1, form, image)).rejects.toMatchObject({
      code: API_ERROR_CODES.VALIDATION
    });
    expect(service.storageBucket.remove).toHaveBeenCalledWith(['full/rolled-back.webp']);
    expect(service.storageBucket.remove).not.toHaveBeenCalledWith(['old.webp']);
  });

  it('removes the old object after a successful explicit photo removal', async () => {
    service.state.databaseResults.push(
      {
        data: { image_path: 'https://x/part-images/old.webp' },
        error: null
      },
      {
        data: { id: 1, ...form, image_path: '' },
        error: null
      }
    );

    await api.updatePart(1, form, null, { removeImage: true });

    expect(service.storageBucket.upload).not.toHaveBeenCalled();
    expect(service.storageBucket.remove).toHaveBeenCalledWith(['old.webp']);
  });
});
