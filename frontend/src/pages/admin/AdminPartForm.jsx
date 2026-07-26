import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api.js';
import { useLang } from '../../i18n/LangContext.jsx';
import { useToast } from '../../components/ToastContext.jsx';
import AdminNav from './AdminNav.jsx';

const emptyForm = {
  code: '',
  title_en: '',
  title_ka: '',
  description_en: '',
  description_ka: '',
  brand_id: '',
  category_id: ''
};

export default function AdminPartForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { t } = useLang();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(emptyForm);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const loadReferenceData = () => {
    Promise.all([api.getBrands(), api.getCategories()]).then(([b, c]) => {
      setBrands(b);
      setCategories(c);
    });
  };

  useEffect(loadReferenceData, []);

  useEffect(() => {
    if (!isEdit) return;
    api.getPart(id).then((part) => {
      setForm({
        code: part.code,
        title_en: part.title_en,
        title_ka: part.title_ka,
        description_en: part.description_en || '',
        description_ka: part.description_ka || '',
        brand_id: part.brand_id || '',
        category_id: part.category_id || ''
      });
      setImagePreview(part.image_path || '');
    });
  }, [id, isEdit]);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleFile = (file) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAddBrand = async () => {
    const name_en = window.prompt(t('admin.form.newBrandPromptEn'));
    if (!name_en) return;
    const name_ka = window.prompt(t('admin.form.newBrandPromptKa')) || name_en;
    try {
      const brand = await api.createBrand({ name_en, name_ka });
      setBrands((prev) => [...prev, brand].sort((a, b) => a.name_en.localeCompare(b.name_en)));
      setForm((f) => ({ ...f, brand_id: brand.id }));
      showToast(t('toast.added'));
    } catch {
      showToast(t('toast.error'), 'error');
    }
  };

  const handleAddCategory = async () => {
    const name_en = window.prompt(t('admin.form.newCategoryPromptEn'));
    if (!name_en) return;
    const name_ka = window.prompt(t('admin.form.newCategoryPromptKa')) || name_en;
    try {
      const category = await api.createCategory({ name_en, name_ka });
      setCategories((prev) => [...prev, category].sort((a, b) => a.name_en.localeCompare(b.name_en)));
      setForm((f) => ({ ...f, category_id: category.id }));
      showToast(t('toast.added'));
    } catch {
      showToast(t('toast.error'), 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title_en.trim() && !form.title_ka.trim()) {
      setError(t('admin.form.titleRequiredError'));
      return;
    }

    setSaving(true);

    try {
      if (isEdit) {
        await api.updatePart(id, form, imageFile);
      } else {
        await api.createPart(form, imageFile);
      }
      showToast(t('toast.saved'));
      navigate('/admin/parts');
    } catch (err) {
      setError(err.message);
      showToast(t('toast.error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-shell">
      <AdminNav />
      <div className="container" style={{ paddingTop: 32, maxWidth: 640 }}>
        <button
          className="back-link"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          onClick={() => navigate('/admin/parts')}
        >
          ← {t('admin.back')}
        </button>
        <h1 className="page-title">{isEdit ? t('admin.form.editTitle') : t('admin.form.addTitle')}</h1>

        <form onSubmit={handleSubmit} className="simple-form">
          <div
            className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files[0]);
            }}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="" className="upload-preview" />
            ) : (
              <div className="upload-placeholder">
                <span className="upload-icon">📷</span>
                <span>{t('admin.form.dragDrop')}</span>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  {t('admin.form.browseButton')}
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>
          {imagePreview && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => fileInputRef.current?.click()}
              style={{ marginTop: -8 }}
            >
              {t('admin.form.changePhoto')}
            </button>
          )}

          <div className="field">
            <label>{t('admin.form.code')}</label>
            <input className="input input-lg" value={form.code} onChange={update('code')} required />
            <span className="field-hint">{t('admin.form.codeHint')}</span>
          </div>

          <div className="field">
            <label>{t('admin.form.titleEn')}</label>
            <input className="input input-lg" value={form.title_en} onChange={update('title_en')} />
          </div>
          <div className="field">
            <label>{t('admin.form.titleKa')}</label>
            <input className="input input-lg" value={form.title_ka} onChange={update('title_ka')} />
            <span className="field-hint">{t('admin.form.titleHint')}</span>
          </div>

          <div className="field">
            <label>
              {t('admin.form.descriptionEn')} <span className="field-hint">({t('admin.form.descriptionOptional')})</span>
            </label>
            <textarea className="input" value={form.description_en} onChange={update('description_en')} />
          </div>
          <div className="field">
            <label>
              {t('admin.form.descriptionKa')} <span className="field-hint">({t('admin.form.descriptionOptional')})</span>
            </label>
            <textarea className="input" value={form.description_ka} onChange={update('description_ka')} />
          </div>

          <div className="field">
            <label>{t('admin.form.brand')}</label>
            <div className="select-with-add">
              <select className="select input-lg" value={form.brand_id} onChange={update('brand_id')}>
                <option value="">{t('admin.form.selectBrand')}</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name_en}
                  </option>
                ))}
              </select>
              <button type="button" className="btn btn-outline" onClick={handleAddBrand}>
                {t('admin.form.addNewBrand')}
              </button>
            </div>
          </div>

          <div className="field">
            <label>{t('admin.form.category')}</label>
            <div className="select-with-add">
              <select className="select input-lg" value={form.category_id} onChange={update('category_id')}>
                <option value="">{t('admin.form.selectCategory')}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_en}
                  </option>
                ))}
              </select>
              <button type="button" className="btn btn-outline" onClick={handleAddCategory}>
                {t('admin.form.addNewCategory')}
              </button>
            </div>
          </div>

          {error && <div className="error-text">{error}</div>}

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button className="btn btn-primary btn-lg" type="submit" disabled={saving} style={{ flex: 1 }}>
              {saving ? t('admin.form.saving') : t('admin.form.save')}
            </button>
            <button type="button" className="btn btn-outline btn-lg" onClick={() => navigate('/admin/parts')}>
              {t('admin.form.cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
