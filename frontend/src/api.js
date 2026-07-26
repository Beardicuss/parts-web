import { supabase, isSupabaseConfigured } from './supabaseClient.js';
import { MOCK_BRANDS, MOCK_CATEGORIES, MOCK_PARTS } from './mockData.js';

const PART_SELECT = `
  *,
  brands ( name_en, name_ka ),
  categories ( name_en, name_ka )
`;

// Reshape Supabase's nested join result into the flat shape the UI already expects
// (brand_name_en, category_name_en, ...) so components don't need to change.
function flattenPart(row) {
  if (!row) return row;
  const { brands, categories, ...rest } = row;
  return {
    ...rest,
    brand_name_en: brands?.name_en ?? rest.brand_name_en ?? null,
    brand_name_ka: brands?.name_ka ?? rest.brand_name_ka ?? null,
    category_name_en: categories?.name_en ?? rest.category_name_en ?? null,
    category_name_ka: categories?.name_ka ?? rest.category_name_ka ?? null
  };
}

function escapeForOr(value) {
  // Supabase's .or() filter uses commas as separators; strip them to keep the query valid.
  return value.replace(/,/g, ' ');
}

async function uploadImage(file) {
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
  const { error } = await supabase.storage.from('part-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('part-images').getPublicUrl(path);
  return data.publicUrl;
}

async function deleteImageByUrl(url) {
  if (!url) return;
  const marker = '/part-images/';
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = url.slice(idx + marker.length);
  await supabase.storage.from('part-images').remove([path]);
}

function filterMockParts(filters) {
  let list = [...MOCK_PARTS];
  if (filters.search) {
    const s = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.code.toLowerCase().includes(s) ||
        p.title_en.toLowerCase().includes(s) ||
        p.title_ka.toLowerCase().includes(s)
    );
  }
  if (filters.brand_id) {
    list = list.filter((p) => String(p.brand_id) === String(filters.brand_id));
  }
  if (filters.category_id) {
    list = list.filter((p) => String(p.category_id) === String(filters.category_id));
  }
  return list;
}

export const api = {
  // ---- Public catalog ----
  getParts: async (filters = {}, page = 1, limit = 20) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    if (!isSupabaseConfigured) {
      const mockResults = filterMockParts(filters);
      return mockResults.slice(from, to + 1);
    }

    try {
      let query = supabase.from('parts').select(PART_SELECT).order('updated_at', { ascending: false });

      if (filters.search) {
        const s = escapeForOr(filters.search);
        query = query.or(`code.ilike.%${s}%,title_en.ilike.%${s}%,title_ka.ilike.%${s}%`);
      }
      if (filters.brand_id) query = query.eq('brand_id', filters.brand_id);
      if (filters.category_id) query = query.eq('category_id', filters.category_id);

      // Add pagination
      query = query.range(from, to);

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        const mockResults = filterMockParts(filters);
        return mockResults.slice(from, to + 1);
      }
      return data.map(flattenPart);
    } catch {
      const mockResults = filterMockParts(filters);
      return mockResults.slice(from, to + 1);
    }
  },

  getPart: async (id) => {
    if (!isSupabaseConfigured) {
      const mock = MOCK_PARTS.find((p) => String(p.id) === String(id));
      if (mock) return mock;
      throw new Error('Part not found');
    }

    try {
      const { data, error } = await supabase.from('parts').select(PART_SELECT).eq('id', id).single();
      if (error || !data) {
        const mock = MOCK_PARTS.find((p) => String(p.id) === String(id));
        if (mock) return mock;
        throw new Error('Part not found');
      }
      return flattenPart(data);
    } catch {
      const mock = MOCK_PARTS.find((p) => String(p.id) === String(id));
      if (mock) return mock;
      throw new Error('Part not found');
    }
  },

  getBrands: async () => {
    if (!isSupabaseConfigured) return MOCK_BRANDS;
    try {
      const { data, error } = await supabase.from('brands').select('*').order('name_en');
      if (error || !data || data.length === 0) return MOCK_BRANDS;
      return data;
    } catch {
      return MOCK_BRANDS;
    }
  },

  getCategories: async () => {
    if (!isSupabaseConfigured) return MOCK_CATEGORIES;
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name_en');
      if (error || !data || data.length === 0) return MOCK_CATEGORIES;
      return data;
    } catch {
      return MOCK_CATEGORIES;
    }
  },

  // ---- Auth ----
  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  },
  logout: async () => {
    await supabase.auth.signOut();
  },

  // ---- Admin: parts ----
  createPart: async (form, imageFile) => {
    const payload = {
      code: form.code,
      title_en: form.title_en,
      title_ka: form.title_ka,
      description_en: form.description_en || '',
      description_ka: form.description_ka || '',
      brand_id: form.brand_id || null,
      category_id: form.category_id || null,
      image_path: ''
    };
    if (imageFile) payload.image_path = await uploadImage(imageFile);

    const { data, error } = await supabase.from('parts').insert(payload).select(PART_SELECT).single();
    if (error) throw new Error(error.message);
    return flattenPart(data);
  },

  updatePart: async (id, form, imageFile) => {
    const payload = {
      code: form.code,
      title_en: form.title_en,
      title_ka: form.title_ka,
      description_en: form.description_en || '',
      description_ka: form.description_ka || '',
      brand_id: form.brand_id || null,
      category_id: form.category_id || null
    };
    if (imageFile) payload.image_path = await uploadImage(imageFile);

    const { data, error } = await supabase.from('parts').update(payload).eq('id', id).select(PART_SELECT).single();
    if (error) throw new Error(error.message);
    return flattenPart(data);
  },

  deletePart: async (id) => {
    const { data: existing } = await supabase.from('parts').select('image_path').eq('id', id).single();
    const { error } = await supabase.from('parts').delete().eq('id', id);
    if (error) throw new Error(error.message);
    if (existing?.image_path) await deleteImageByUrl(existing.image_path);
  },

  // ---- Admin: brands ----
  createBrand: async (payload) => {
    const { data, error } = await supabase.from('brands').insert(payload).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  updateBrand: async (id, payload) => {
    const { data, error } = await supabase.from('brands').update(payload).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  deleteBrand: async (id) => {
    const { error } = await supabase.from('brands').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  // ---- Admin: categories ----
  createCategory: async (payload) => {
    const { data, error } = await supabase.from('categories').insert(payload).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  updateCategory: async (id, payload) => {
    const { data, error } = await supabase.from('categories').update(payload).eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return data;
  },
  deleteCategory: async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }
};
