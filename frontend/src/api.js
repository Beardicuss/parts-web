import { supabase, isSupabaseConfigured } from './supabaseClient.js';
import { API_ERROR_CODES, ApiError, toApiError } from './apiErrors.js';

const USE_MOCK_DATA =
  import.meta.env.MODE !== 'production' &&
  String(import.meta.env.VITE_USE_MOCK_DATA).toLowerCase() === 'true';

const PART_COLUMNS = `
  id,
  code,
  replacement_codes,
  compatible_models,
  title_en,
  title_ka,
  description_en,
  description_ka,
  brand_id,
  category_id,
  image_path,
  image_thumbnail_path,
  publication_status,
  created_at,
  updated_at,
  brands ( name_en, name_ka ),
  categories ( name_en, name_ka ),
  part_vehicle_models (
    vehicle_models ( id, brand_id, model_name, chassis_code, year_from, year_to )
  )
`;
const REFERENCE_COLUMNS = 'id, name_en, name_ka';
const VEHICLE_MODEL_COLUMNS =
  'id, brand_id, model_name, chassis_code, year_from, year_to, created_at, brands ( name_en, name_ka )';

const SYSTEM_CATEGORY_IDS = {
  'control-unit': [3],
  lighting: [1, 2, 4, 5, 6],
  'steering-wheels': [],
  'engine-transmission': [],
  'retrofit-adapter': [],
  'axles-suspension': []
};

let mockDataPromise;
async function getMockData() {
  if (!USE_MOCK_DATA) {
    throw new ApiError(
      API_ERROR_CODES.CONFIGURATION,
      'Supabase is not configured and development mock mode is disabled.'
    );
  }
  mockDataPromise ??= import('./mockData.js');
  return mockDataPromise;
}

function requireClient() {
  if (!isSupabaseConfigured || !supabase) {
    throw new ApiError(
      API_ERROR_CODES.CONFIGURATION,
      'Supabase configuration is missing or invalid.'
    );
  }
  return supabase;
}

function flattenPart(row) {
  if (!row) return row;
  const { brands, categories, part_vehicle_models, ...rest } = row;
  return {
    ...rest,
    publication_status: rest.publication_status || 'published',
    brand_name_en: brands?.name_en ?? null,
    brand_name_ka: brands?.name_ka ?? null,
    category_name_en: categories?.name_en ?? null,
    category_name_ka: categories?.name_ka ?? null,
    vehicle_models: (part_vehicle_models ?? []).map((link) => link.vehicle_models).filter(Boolean)
  };
}

function escapeForOr(value) {
  return value.replace(/[,%()]/g, ' ').trim();
}

function filterMockParts(parts, filters, { publicOnly = true } = {}) {
  let list = publicOnly
    ? parts.filter((part) => (part.publication_status || 'published') === 'published')
    : [...parts];
  if (filters.system) {
    const categoryIds = SYSTEM_CATEGORY_IDS[filters.system] || [];
    list = list.filter((part) => categoryIds.includes(Number(part.category_id)));
  }
  if (filters.search) {
    const search = filters.search.toLowerCase();
    list = list.filter((part) =>
      [
        part.code,
        part.replacement_codes,
        part.compatible_models,
        part.title_en,
        part.title_ka
      ].some((value) => value.toLowerCase().includes(search))
    );
  }
  if (filters.brand_id) {
    list = list.filter((part) => String(part.brand_id) === String(filters.brand_id));
  }
  if (filters.category_id) {
    list = list.filter((part) => String(part.category_id) === String(filters.category_id));
  }
  return list;
}

function applyPartFilters(query, filters) {
  let filteredQuery = query;
  if (filters.search) {
    const search = escapeForOr(filters.search);
    if (search) {
      filteredQuery = filteredQuery.or(
        `code.ilike.%${search}%,replacement_codes.ilike.%${search}%,compatible_models.ilike.%${search}%,title_en.ilike.%${search}%,title_ka.ilike.%${search}%`
      );
    }
  }
  if (filters.system) {
    const categoryIds = SYSTEM_CATEGORY_IDS[filters.system] || [];
    filteredQuery = categoryIds.length
      ? filteredQuery.in('category_id', categoryIds)
      : filteredQuery.eq('id', -1);
  }
  if (filters.brand_id) filteredQuery = filteredQuery.eq('brand_id', filters.brand_id);
  if (filters.category_id) {
    filteredQuery = filteredQuery.eq('category_id', filters.category_id);
  }
  if (filters.publication_status) {
    filteredQuery = filteredQuery.eq('publication_status', filters.publication_status);
  }
  return filteredQuery;
}

async function execute(query, fallbackMessage) {
  try {
    const result = await query;
    if (result.error) throw result.error;
    return result;
  } catch (error) {
    throw toApiError(error, fallbackMessage);
  }
}

async function uploadImage(file, folder = 'full') {
  const client = requireClient();
  const extension = file.name.split('.').pop().toLowerCase();
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await client.storage.from('part-images').upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type,
    upsert: false
  });
  if (error) throw toApiError(error, 'The image upload failed.');
  const { data } = client.storage.from('part-images').getPublicUrl(path);
  return { path, url: data.publicUrl };
}

function storagePathFromUrl(url) {
  if (!url) return null;
  const marker = '/part-images/';
  const index = url.indexOf(marker);
  return index === -1 ? null : decodeURIComponent(url.slice(index + marker.length));
}

async function rollbackUploads(uploads, originalError) {
  const paths = uploads.filter(Boolean).map(({ path }) => path);
  if (!paths.length) throw toApiError(originalError);
  try {
    const { error } = await requireClient().storage.from('part-images').remove(paths);
    if (error) throw error;
  } catch (cleanupError) {
    throw new ApiError(
      API_ERROR_CODES.CLEANUP,
      'Saving failed and the uploaded image could not be cleaned up.',
      {
        cause: originalError,
        details: { orphanPaths: paths, cleanupError: cleanupError.message }
      }
    );
  }
  throw toApiError(originalError);
}

async function syncPartVehicleModels(partId, vehicleModelIds) {
  if (!Array.isArray(vehicleModelIds)) return null;
  try {
    const { error } = await requireClient().rpc('set_part_vehicle_models', {
      target_part_id: partId,
      target_vehicle_model_ids: vehicleModelIds.map(Number).filter(Number.isFinite)
    });
    if (error) throw error;
    return null;
  } catch (error) {
    return { message: error.message || 'Vehicle-model links could not be saved.' };
  }
}

function partPayload(form) {
  return {
    code: form.code.trim(),
    replacement_codes: form.replacement_codes?.trim() || '',
    compatible_models: form.compatible_models?.trim() || '',
    title_en: form.title_en.trim(),
    title_ka: form.title_ka.trim(),
    description_en: form.description_en?.trim() || '',
    description_ka: form.description_ka?.trim() || '',
    brand_id: form.brand_id || null,
    category_id: form.category_id || null,
    publication_status: form.publication_status || 'draft'
  };
}

export const api = {
  getLatestParts: async (limit = 8) => {
    if (USE_MOCK_DATA) {
      const { MOCK_PARTS } = await getMockData();
      return MOCK_PARTS.filter((part) => (part.publication_status || 'published') === 'published')
        .sort((a, b) => Number(b.id) - Number(a.id))
        .slice(0, limit);
    }
    const client = requireClient();
    const { data } = await execute(
      client
        .from('parts')
        .select(PART_COLUMNS)
        .eq('publication_status', 'published')
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
        .limit(limit),
      'Latest products could not be loaded.'
    );
    return (data ?? []).map(flattenPart);
  },

  getParts: async (filters = {}, page = 1, limit = 20) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    if (USE_MOCK_DATA) {
      const { MOCK_PARTS } = await getMockData();
      return filterMockParts(MOCK_PARTS, filters).slice(from, to + 1);
    }
    const client = requireClient();
    let query = client
      .from('parts')
      .select(PART_COLUMNS)
      .eq('publication_status', 'published')
      .order('updated_at', { ascending: false })
      .order('id', { ascending: false });
    query = applyPartFilters(query, filters).range(from, to);
    const { data } = await execute(query, 'Products could not be loaded.');
    return (data ?? []).map(flattenPart);
  },

  getAdminParts: async ({ search = '', publicationStatus = '', page = 1, pageSize = 20 } = {}) => {
    if (USE_MOCK_DATA) {
      const { MOCK_PARTS } = await getMockData();
      let filtered = [...MOCK_PARTS];
      if (search) filtered = filterMockParts(filtered, { search }, { publicOnly: false });
      if (publicationStatus) {
        filtered = filtered.filter(
          (part) => (part.publication_status || 'published') === publicationStatus
        );
      }
      const from = (page - 1) * pageSize;
      return {
        items: filtered.slice(from, from + pageSize),
        total: filtered.length,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(filtered.length / pageSize))
      };
    }
    const client = requireClient();
    const from = (page - 1) * pageSize;
    let query = client
      .from('parts')
      .select(PART_COLUMNS, { count: 'exact' })
      .order('created_at', { ascending: false })
      .order('id', { ascending: false });
    query = applyPartFilters(query, {
      search,
      publication_status: publicationStatus
    }).range(from, from + pageSize - 1);
    const { data, count } = await execute(query, 'Admin products could not be loaded.');
    return {
      items: (data ?? []).map(flattenPart),
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize))
    };
  },

  getExistingPartCodes: async () => {
    if (USE_MOCK_DATA) {
      const { MOCK_PARTS } = await getMockData();
      return MOCK_PARTS.map((part) => part.code);
    }
    const client = requireClient();
    const codes = [];
    const pageSize = 1000;
    for (let from = 0; ; from += pageSize) {
      const { data } = await execute(
        client
          .from('parts')
          .select('id, code')
          .order('id', { ascending: true })
          .range(from, from + pageSize - 1),
        'Existing product codes could not be checked.'
      );
      codes.push(...(data ?? []).map((part) => part.code));
      if ((data ?? []).length < pageSize) break;
    }
    return codes;
  },

  getPublicationCounts: async () => {
    const statuses = ['draft', 'needs_review', 'published', 'archived'];
    if (USE_MOCK_DATA) {
      const { MOCK_PARTS } = await getMockData();
      return Object.fromEntries(
        statuses.map((status) => [
          status,
          MOCK_PARTS.filter((part) => (part.publication_status || 'published') === status).length
        ])
      );
    }
    const client = requireClient();
    const results = await Promise.all(
      statuses.map((status) =>
        execute(
          client
            .from('parts')
            .select('id', { count: 'exact', head: true })
            .eq('publication_status', status),
          'Publication counts could not be loaded.'
        )
      )
    );
    return Object.fromEntries(statuses.map((status, index) => [status, results[index].count ?? 0]));
  },

  getPart: async (id) => {
    if (USE_MOCK_DATA) {
      const { MOCK_PARTS } = await getMockData();
      const part = MOCK_PARTS.find(
        (item) =>
          String(item.id) === String(id) && (item.publication_status || 'published') === 'published'
      );
      if (!part) throw new ApiError(API_ERROR_CODES.NOT_FOUND, 'Part not found.');
      return part;
    }
    const { data } = await execute(
      requireClient()
        .from('parts')
        .select(PART_COLUMNS)
        .eq('id', id)
        .eq('publication_status', 'published')
        .maybeSingle(),
      'The product could not be loaded.'
    );
    if (!data) throw new ApiError(API_ERROR_CODES.NOT_FOUND, 'Part not found.');
    return flattenPart(data);
  },

  getAdminPart: async (id) => {
    if (USE_MOCK_DATA) {
      const { MOCK_PARTS } = await getMockData();
      const part = MOCK_PARTS.find((item) => String(item.id) === String(id));
      if (!part) throw new ApiError(API_ERROR_CODES.NOT_FOUND, 'Part not found.');
      return flattenPart(part);
    }
    const { data } = await execute(
      requireClient().from('parts').select(PART_COLUMNS).eq('id', id).maybeSingle(),
      'The admin product could not be loaded.'
    );
    if (!data) throw new ApiError(API_ERROR_CODES.NOT_FOUND, 'Part not found.');
    return flattenPart(data);
  },

  getBrands: async () => {
    if (USE_MOCK_DATA) return (await getMockData()).MOCK_BRANDS;
    const { data } = await execute(
      requireClient().from('brands').select(REFERENCE_COLUMNS).order('name_en'),
      'Brands could not be loaded.'
    );
    return data ?? [];
  },

  getCategories: async () => {
    if (USE_MOCK_DATA) return (await getMockData()).MOCK_CATEGORIES;
    const { data } = await execute(
      requireClient().from('categories').select(REFERENCE_COLUMNS).order('name_en'),
      'Categories could not be loaded.'
    );
    return data ?? [];
  },

  getVehicleModels: async ({ brandId = '' } = {}) => {
    if (USE_MOCK_DATA) return [];
    let query = requireClient()
      .from('vehicle_models')
      .select(VEHICLE_MODEL_COLUMNS)
      .order('model_name')
      .order('chassis_code');
    if (brandId) query = query.eq('brand_id', brandId);
    const { data } = await execute(query, 'Vehicle models could not be loaded.');
    return (data ?? []).map(({ brands, ...model }) => ({
      ...model,
      brand_name_en: brands?.name_en ?? ''
    }));
  },

  createPart: async (form, imageFile, imageThumbnailFile) => {
    const client = requireClient();
    const uploads = [];
    try {
      if (imageFile) uploads.push(await uploadImage(imageFile, 'full'));
      if (imageThumbnailFile) uploads.push(await uploadImage(imageThumbnailFile, 'thumb'));
      const payload = {
        ...partPayload(form),
        image_path: uploads[0]?.url ?? '',
        image_thumbnail_path: uploads[1]?.url ?? ''
      };
      const { data } = await execute(
        client.from('parts').insert(payload).select(PART_COLUMNS).single(),
        'The product could not be created.'
      );
      const vehicleModelWarning = await syncPartVehicleModels(data.id, form.vehicle_model_ids);
      return { ...flattenPart(data), vehicleModelWarning };
    } catch (error) {
      return rollbackUploads(uploads, error);
    }
  },

  updatePart: async (
    id,
    form,
    imageFile,
    { removeImage = false, imageThumbnailFile = null } = {}
  ) => {
    const client = requireClient();
    const { data: existing } = await execute(
      client.from('parts').select('image_path, image_thumbnail_path').eq('id', id).single(),
      'The current product image could not be checked.'
    );
    const uploads = [];
    try {
      if (imageFile) uploads.push(await uploadImage(imageFile, 'full'));
      if (imageThumbnailFile) uploads.push(await uploadImage(imageThumbnailFile, 'thumb'));
      const payload = {
        ...partPayload(form),
        ...(uploads[0] ? { image_path: uploads[0].url } : {}),
        ...(uploads[1] ? { image_thumbnail_path: uploads[1].url } : {}),
        ...(removeImage && !uploads[0] ? { image_path: '', image_thumbnail_path: '' } : {})
      };
      const { data } = await execute(
        client.from('parts').update(payload).eq('id', id).select(PART_COLUMNS).single(),
        'The product could not be updated.'
      );

      const vehicleModelWarning = await syncPartVehicleModels(id, form.vehicle_model_ids);

      const oldPaths =
        uploads.length || removeImage
          ? [existing?.image_path, existing?.image_thumbnail_path]
              .map(storagePathFromUrl)
              .filter(Boolean)
          : [];
      let mediaCleanupWarning = null;
      if (oldPaths.length) {
        try {
          const { error: cleanupError } = await client.storage.from('part-images').remove(oldPaths);
          if (cleanupError) throw cleanupError;
        } catch (cleanupError) {
          mediaCleanupWarning = {
            paths: oldPaths,
            message: cleanupError.message
          };
        }
      }
      return { ...flattenPart(data), mediaCleanupWarning, vehicleModelWarning };
    } catch (error) {
      return rollbackUploads(uploads, error);
    }
  },

  deletePart: async (id) => {
    const client = requireClient();
    const { data: existing } = await execute(
      client.from('parts').select('image_path, image_thumbnail_path').eq('id', id).single(),
      'The current product image could not be checked.'
    );
    await execute(client.from('parts').delete().eq('id', id), 'The product could not be deleted.');
    const oldPaths = [existing?.image_path, existing?.image_thumbnail_path]
      .map(storagePathFromUrl)
      .filter(Boolean);
    if (!oldPaths.length) return { mediaCleanupWarning: null };
    try {
      const { error } = await client.storage.from('part-images').remove(oldPaths);
      if (error) throw error;
      return { mediaCleanupWarning: null };
    } catch (cleanupError) {
      return { mediaCleanupWarning: { paths: oldPaths, message: cleanupError.message } };
    }
  },

  listOrphanImages: async () => {
    const client = requireClient();
    const [{ data: objects, error: storageError }, { data: parts, error: partsError }] =
      await Promise.all([
        client.storage.from('part-images').list('', { limit: 1000, sortBy: { column: 'name' } }),
        client.from('parts').select('image_path, image_thumbnail_path')
      ]);
    if (storageError) throw toApiError(storageError, 'Storage inventory failed.');
    if (partsError) throw toApiError(partsError, 'Product image inventory failed.');
    const referenced = new Set(
      (parts ?? [])
        .flatMap(({ image_path, image_thumbnail_path }) => [image_path, image_thumbnail_path])
        .map(storagePathFromUrl)
        .filter(Boolean)
    );
    return (objects ?? []).filter((object) => !referenced.has(object.name));
  },

  createBrand: async (payload) => {
    const { data } = await execute(
      requireClient()
        .from('brands')
        .insert({ name_en: payload.name_en.trim(), name_ka: payload.name_ka.trim() })
        .select(REFERENCE_COLUMNS)
        .single(),
      'The brand could not be created.'
    );
    return data;
  },
  updateBrand: async (id, payload) => {
    const { data } = await execute(
      requireClient()
        .from('brands')
        .update({ name_en: payload.name_en.trim(), name_ka: payload.name_ka.trim() })
        .eq('id', id)
        .select(REFERENCE_COLUMNS)
        .single(),
      'The brand could not be updated.'
    );
    return data;
  },
  deleteBrand: async (id) => {
    await execute(requireClient().from('brands').delete().eq('id', id), 'Delete failed.');
  },
  createCategory: async (payload) => {
    const { data } = await execute(
      requireClient()
        .from('categories')
        .insert({ name_en: payload.name_en.trim(), name_ka: payload.name_ka.trim() })
        .select(REFERENCE_COLUMNS)
        .single(),
      'The category could not be created.'
    );
    return data;
  },
  updateCategory: async (id, payload) => {
    const { data } = await execute(
      requireClient()
        .from('categories')
        .update({ name_en: payload.name_en.trim(), name_ka: payload.name_ka.trim() })
        .eq('id', id)
        .select(REFERENCE_COLUMNS)
        .single(),
      'The category could not be updated.'
    );
    return data;
  },
  deleteCategory: async (id) => {
    await execute(requireClient().from('categories').delete().eq('id', id), 'Delete failed.');
  },
  createVehicleModel: async (payload) => {
    const { data } = await execute(
      requireClient()
        .from('vehicle_models')
        .insert({
          brand_id: payload.brand_id,
          model_name: payload.model_name.trim(),
          chassis_code: payload.chassis_code?.trim() || '',
          year_from: payload.year_from || null,
          year_to: payload.year_to || null
        })
        .select(VEHICLE_MODEL_COLUMNS)
        .single(),
      'The vehicle model could not be created.'
    );
    return data;
  },
  updateVehicleModel: async (id, payload) => {
    const { data } = await execute(
      requireClient()
        .from('vehicle_models')
        .update({
          brand_id: payload.brand_id,
          model_name: payload.model_name.trim(),
          chassis_code: payload.chassis_code?.trim() || '',
          year_from: payload.year_from || null,
          year_to: payload.year_to || null
        })
        .eq('id', id)
        .select(VEHICLE_MODEL_COLUMNS)
        .single(),
      'The vehicle model could not be updated.'
    );
    return data;
  },
  deleteVehicleModel: async (id) => {
    await execute(requireClient().from('vehicle_models').delete().eq('id', id), 'Delete failed.');
  },
  updatePartStatus: async (id, publicationStatus) => {
    const { data } = await execute(
      requireClient()
        .from('parts')
        .update({ publication_status: publicationStatus })
        .eq('id', id)
        .select(PART_COLUMNS)
        .single(),
      'The product status could not be changed.'
    );
    return flattenPart(data);
  }
};
