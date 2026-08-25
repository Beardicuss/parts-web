import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminNav from './AdminNav.jsx';
import { api } from '../../api.js';
import { useLang } from '../../i18n/LangContext.jsx';
import { useToast } from '../../components/ToastContext.jsx';
import AccessibleDialog from '../../components/AccessibleDialog.jsx';

const emptyForm = {
  brand_id: '',
  model_name: '',
  chassis_code: '',
  year_from: '',
  year_to: ''
};

export default function AdminVehicleModels() {
  const { t } = useLang();
  const { showToast } = useToast();
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setError('');
    try {
      const [loadedBrands, loadedModels] = await Promise.all([
        api.getBrands(),
        api.getVehicleModels()
      ]);
      setBrands(loadedBrands);
      setModels(loadedModels);
    } catch {
      setError(t('admin.vehicleModels.loadError'));
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const visibleModels = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return models;
    return models.filter((model) =>
      [model.brand_name_en, model.model_name, model.chassis_code, model.year_from, model.year_to]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [models, search]);

  const update = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const reset = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.brand_id || !form.model_name.trim()) {
      setError(t('admin.vehicleModels.required'));
      return;
    }
    setBusy(true);
    setError('');
    try {
      if (editingId) await api.updateVehicleModel(editingId, form);
      else await api.createVehicleModel(form);
      showToast(t(editingId ? 'toast.saved' : 'toast.added'));
      reset();
      await load();
    } catch (saveError) {
      setError(saveError.message || t('toast.error'));
    } finally {
      setBusy(false);
    }
  };

  const edit = (model) => {
    setEditingId(model.id);
    setForm({
      brand_id: model.brand_id,
      model_name: model.model_name,
      chassis_code: model.chassis_code || '',
      year_from: model.year_from || '',
      year_to: model.year_to || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async () => {
    if (!deleteTarget || busy) return;
    setBusy(true);
    try {
      await api.deleteVehicleModel(deleteTarget.id);
      showToast(t('toast.deleted'));
      setDeleteTarget(null);
      await load();
    } catch (deleteError) {
      setError(deleteError.message || t('toast.error'));
      setDeleteTarget(null);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-shell">
      <AdminNav />
      <main className="container vehicle-models-page">
        <h1 className="page-title">{t('admin.vehicleModels.title')}</h1>
        <p className="page-subtitle">{t('admin.vehicleModels.description')}</p>

        <form className="vehicle-model-form" onSubmit={submit}>
          <select className="select" value={form.brand_id} onChange={update('brand_id')} required>
            <option value="">{t('admin.form.selectBrand')}</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name_en}
              </option>
            ))}
          </select>
          <input
            className="input"
            value={form.model_name}
            onChange={update('model_name')}
            placeholder={t('admin.vehicleModels.modelName')}
            required
          />
          <input
            className="input"
            value={form.chassis_code}
            onChange={update('chassis_code')}
            placeholder={t('admin.vehicleModels.chassis')}
          />
          <input
            className="input"
            type="number"
            min="1886"
            max="2200"
            value={form.year_from}
            onChange={update('year_from')}
            placeholder={t('admin.vehicleModels.yearFrom')}
          />
          <input
            className="input"
            type="number"
            min="1886"
            max="2200"
            value={form.year_to}
            onChange={update('year_to')}
            placeholder={t('admin.vehicleModels.yearTo')}
          />
          <button className="btn btn-primary" disabled={busy}>
            {editingId ? t('admin.vehicleModels.save') : t('admin.vehicleModels.add')}
          </button>
          {editingId && (
            <button type="button" className="btn btn-outline" onClick={reset}>
              {t('admin.form.cancel')}
            </button>
          )}
        </form>
        {error && (
          <div className="error-text" role="alert">
            {error}
          </div>
        )}

        <div className="toolbar vehicle-model-toolbar">
          <input
            className="input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('admin.vehicleModels.search')}
          />
          <span>{t('admin.vehicleModels.total').replace('{count}', visibleModels.length)}</span>
        </div>

        <div className="reference-list vehicle-model-list">
          {visibleModels.map((model) => (
            <div className="reference-row" key={model.id}>
              <div>
                <strong>
                  {model.brand_name_en} —{' '}
                  {[model.model_name, model.chassis_code].filter(Boolean).join(' ')}
                </strong>
                {(model.year_from || model.year_to) && (
                  <span className="field-hint">
                    {model.year_from || '…'}–{model.year_to || '…'}
                  </span>
                )}
              </div>
              <div className="admin-actions">
                <button className="btn btn-outline" onClick={() => edit(model)}>
                  {t('admin.edit')}
                </button>
                <button className="btn btn-danger" onClick={() => setDeleteTarget(model)}>
                  {t('admin.delete')}
                </button>
              </div>
            </div>
          ))}
          {!visibleModels.length && (
            <div className="empty-state">{t('admin.vehicleModels.empty')}</div>
          )}
        </div>
      </main>
      <AccessibleDialog
        open={Boolean(deleteTarget)}
        title={t('admin.deleteTitle')}
        confirmLabel={t('admin.delete')}
        cancelLabel={t('admin.form.cancel')}
        destructive
        busy={busy}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={remove}
      >
        <p>{t('admin.vehicleModels.deleteConfirm')}</p>
      </AccessibleDialog>
    </div>
  );
}
