import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api.js';
import { useLang } from '../../i18n/LangContext.jsx';
import { useToast } from '../../components/ToastContext.jsx';
import AdminNav from './AdminNav.jsx';
import { processImageFile } from '../../utils/processImageFile.js';
import { useUnsavedChanges } from '../../hooks/useUnsavedChanges.js';
import AccessibleDialog from '../../components/AccessibleDialog.jsx';
import { API_ERROR_CODES } from '../../apiErrors.js';
import { allowedPublicationStatuses } from '../../utils/publicationStatus.js';

const emptyForm = {
  code: '',
  replacement_codes: '',
  compatible_models: '',
  title_en: '',
  title_ka: '',
  description_en: '',
  description_ka: '',
  brand_id: '',
  category_id: '',
  publication_status: 'draft',
  vehicle_model_ids: []
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
  const [vehicleModels, setVehicleModels] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imageThumbnailFile, setImageThumbnailFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageInfo, setImageInfo] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const [initialForm, setInitialForm] = useState(emptyForm);
  const [referenceDialog, setReferenceDialog] = useState(null);
  const [confirmPhotoRemoval, setConfirmPhotoRemoval] = useState(false);
  const draftKey = `admin-part-draft:${id || 'new'}`;
  const allowNavigation = useRef(false);
  const isDirty = useMemo(
    () =>
      draftReady &&
      (JSON.stringify(form) !== JSON.stringify(initialForm) || Boolean(imageFile) || removeImage),
    [draftReady, form, imageFile, initialForm, removeImage]
  );
  const blocker = useUnsavedChanges(isDirty && !allowNavigation.current);

  const loadReferenceData = useCallback(() => {
    Promise.all([api.getBrands(), api.getCategories(), api.getVehicleModels()])
      .then(([b, c, models]) => {
        setBrands(b);
        setCategories(c);
        setVehicleModels(models);
      })
      .catch(() => setError(t('admin.form.loadError')));
  }, [t]);

  useEffect(loadReferenceData, [loadReferenceData]);

  useEffect(() => {
    let storedDraft = null;
    try {
      storedDraft = JSON.parse(sessionStorage.getItem(draftKey));
    } catch {
      sessionStorage.removeItem(draftKey);
    }

    if (!isEdit) {
      if (storedDraft) setForm({ ...emptyForm, ...storedDraft });
      setInitialForm(emptyForm);
      setDraftReady(true);
      return;
    }

    api
      .getAdminPart(id)
      .then((part) => {
        const databaseForm = {
          code: part.code,
          replacement_codes: part.replacement_codes || '',
          compatible_models: part.compatible_models || '',
          title_en: part.title_en,
          title_ka: part.title_ka,
          description_en: part.description_en || '',
          description_ka: part.description_ka || '',
          brand_id: part.brand_id || '',
          category_id: part.category_id || '',
          publication_status: part.publication_status || 'draft',
          vehicle_model_ids: (part.vehicle_models || []).map((model) => model.id)
        };
        setInitialForm(databaseForm);
        setForm(storedDraft ? { ...databaseForm, ...storedDraft } : databaseForm);
        setImagePreview(part.image_path || '');
        setDraftReady(true);
      })
      .catch(() => setError(t('admin.form.loadError')));
  }, [draftKey, id, isEdit, t]);

  useEffect(() => {
    if (draftReady) sessionStorage.setItem(draftKey, JSON.stringify(form));
  }, [draftKey, draftReady, form]);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleFile = async (file) => {
    if (!file) return;
    setError('');
    try {
      const processed = await processImageFile(file);
      setImageFile(processed.file);
      setImageThumbnailFile(processed.thumbnailFile);
      setImageInfo(processed);
      setRemoveImage(false);
      setImagePreview((currentPreview) => {
        if (currentPreview.startsWith('blob:')) URL.revokeObjectURL(currentPreview);
        return URL.createObjectURL(processed.file);
      });
    } catch (validationError) {
      setImageFile(null);
      setImageThumbnailFile(null);
      const translationKey = `admin.form.imageError.${validationError.code || 'processing'}`;
      const translated = t(translationKey);
      setError(translated === translationKey ? t('admin.form.imageError.processing') : translated);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openReferenceDialog = (type) => {
    setReferenceDialog({ type, name_en: '', name_ka: '', busy: false, error: '' });
  };

  const handleAddReference = async () => {
    if (!referenceDialog || !referenceDialog.name_en.trim() || !referenceDialog.name_ka.trim()) {
      setReferenceDialog((current) => ({ ...current, error: t('admin.validation.bothNames') }));
      return;
    }
    setReferenceDialog((current) => ({ ...current, busy: true, error: '' }));
    try {
      const payload = {
        name_en: referenceDialog.name_en.trim(),
        name_ka: referenceDialog.name_ka.trim()
      };
      const created =
        referenceDialog.type === 'brand'
          ? await api.createBrand(payload)
          : await api.createCategory(payload);
      if (referenceDialog.type === 'brand') {
        setBrands((previous) =>
          [...previous, created].sort((a, b) => a.name_en.localeCompare(b.name_en))
        );
        setForm((current) => ({ ...current, brand_id: created.id }));
      } else {
        setCategories((previous) =>
          [...previous, created].sort((a, b) => a.name_en.localeCompare(b.name_en))
        );
        setForm((current) => ({ ...current, category_id: created.id }));
      }
      setReferenceDialog(null);
      showToast(t('toast.added'));
    } catch (referenceError) {
      setReferenceDialog((current) => ({
        ...current,
        busy: false,
        error:
          referenceError.code === API_ERROR_CODES.CONFLICT
            ? t('admin.validation.duplicateReference')
            : t('toast.error')
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title_en.trim() || !form.title_ka.trim()) {
      setError(t('admin.form.titleRequiredError'));
      return;
    }

    setSaving(true);

    try {
      let cleanupWarning = false;
      if (isEdit) {
        const savedPart = await api.updatePart(id, form, imageFile, {
          removeImage,
          imageThumbnailFile
        });
        if (savedPart.mediaCleanupWarning) {
          cleanupWarning = true;
          showToast(t('toast.cleanupWarning'), 'error');
        }
        if (savedPart.vehicleModelWarning) {
          cleanupWarning = true;
          showToast(t('toast.vehicleModelWarning'), 'error');
        }
      } else {
        const savedPart = await api.createPart(form, imageFile, imageThumbnailFile);
        if (savedPart.vehicleModelWarning) {
          cleanupWarning = true;
          showToast(t('toast.vehicleModelWarning'), 'error');
        }
      }
      sessionStorage.removeItem(draftKey);
      if (!cleanupWarning) showToast(t('toast.saved'));
      allowNavigation.current = true;
      navigate('/admin/parts');
    } catch (err) {
      setError(
        err.code === API_ERROR_CODES.CONFLICT
          ? t('admin.validation.duplicateCode')
          : err.code === API_ERROR_CODES.UNAUTHORIZED
            ? t('admin.sessionExpired')
            : err.message
      );
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
        <h1 className="page-title">
          {isEdit ? t('admin.form.editTitle') : t('admin.form.addTitle')}
        </h1>
        {isEdit && (
          <Link className="btn btn-outline btn-sm" to={`/admin/parts/${id}/preview`}>
            {t('admin.preview.action')}
          </Link>
        )}

        <form onSubmit={handleSubmit} className="simple-form">
          <div className="field publication-status-field">
            <label>{t('admin.form.publicationStatus')}</label>
            <select
              className="select input-lg"
              value={form.publication_status}
              onChange={update('publication_status')}
            >
              {allowedPublicationStatuses(isEdit ? initialForm.publication_status : 'draft').map(
                (status) => (
                  <option key={status} value={status}>
                    {t(`admin.status.${status}`)}
                  </option>
                )
              )}
            </select>
            <span className="field-hint">{t(`admin.status.help.${form.publication_status}`)}</span>
          </div>
          <div
            className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
            role="button"
            tabIndex="0"
            aria-label={t('admin.form.uploadAction')}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                fileInputRef.current?.click();
              }
            }}
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
              <img
                src={imagePreview}
                alt={t('admin.form.photoPreview')}
                className="upload-preview"
              />
            ) : (
              <div className="upload-placeholder">
                <span className="upload-icon">📷</span>
                <span>{t('admin.form.dragDrop')}</span>
                <span className="btn btn-outline btn-sm" aria-hidden="true">
                  {t('admin.form.browseButton')}
                </span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label={t('admin.form.image')}
              style={{ display: 'none' }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>
          {imagePreview && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: -8 }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                {t('admin.form.changePhoto')}
              </button>
              {isEdit && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => {
                    setConfirmPhotoRemoval(true);
                  }}
                >
                  {t('admin.form.removePhoto')}
                </button>
              )}
            </div>
          )}
          {removeImage && (
            <p className="field-hint" role="status">
              {t('admin.form.photoMarkedForRemoval')}
            </p>
          )}
          {imageInfo && (
            <p className="field-hint">
              {t('admin.form.optimizedPhoto')
                .replace('{width}', imageInfo.width)
                .replace('{height}', imageInfo.height)
                .replace('{size}', `${Math.ceil(imageInfo.outputBytes / 1024)} KB`)}
            </p>
          )}

          <div className="field">
            <label>{t('admin.form.code')}</label>
            <input
              className="input input-lg"
              value={form.code}
              onChange={update('code')}
              required
            />
            <span className="field-hint">{t('admin.form.codeHint')}</span>
          </div>

          <div className="field">
            <label>{t('admin.form.replacementCodes')}</label>
            <input
              className="input input-lg"
              value={form.replacement_codes}
              onChange={update('replacement_codes')}
            />
            <span className="field-hint">{t('admin.form.replacementCodesHint')}</span>
          </div>

          <div className="field">
            <label>{t('admin.form.compatibleModels')}</label>
            <input
              className="input input-lg"
              value={form.compatible_models}
              onChange={update('compatible_models')}
            />
            <span className="field-hint">{t('admin.form.compatibleModelsHint')}</span>
          </div>

          <div className="field">
            <label>{t('admin.form.titleEn')}</label>
            <input
              className="input input-lg"
              value={form.title_en}
              onChange={update('title_en')}
              required
            />
          </div>
          <div className="field">
            <label>{t('admin.form.titleKa')}</label>
            <input
              className="input input-lg"
              value={form.title_ka}
              onChange={update('title_ka')}
              required
            />
            <span className="field-hint">{t('admin.form.titleHint')}</span>
          </div>

          <div className="field">
            <label>
              {t('admin.form.descriptionEn')}{' '}
              <span className="field-hint">({t('admin.form.descriptionOptional')})</span>
            </label>
            <textarea
              className="input"
              value={form.description_en}
              onChange={update('description_en')}
            />
          </div>
          <div className="field">
            <label>
              {t('admin.form.descriptionKa')}{' '}
              <span className="field-hint">({t('admin.form.descriptionOptional')})</span>
            </label>
            <textarea
              className="input"
              value={form.description_ka}
              onChange={update('description_ka')}
            />
          </div>

          <div className="field">
            <label>{t('admin.form.brand')}</label>
            <div className="select-with-add">
              <select
                className="select input-lg"
                value={form.brand_id}
                onChange={update('brand_id')}
              >
                <option value="">{t('admin.form.selectBrand')}</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name_en}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => openReferenceDialog('brand')}
              >
                {t('admin.form.addNewBrand')}
              </button>
            </div>
          </div>

          <div className="field">
            <label>{t('admin.form.category')}</label>
            <div className="select-with-add">
              <select
                className="select input-lg"
                value={form.category_id}
                onChange={update('category_id')}
              >
                <option value="">{t('admin.form.selectCategory')}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_en}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => openReferenceDialog('category')}
              >
                {t('admin.form.addNewCategory')}
              </button>
            </div>
          </div>

          <fieldset className="field vehicle-model-fieldset">
            <legend>{t('admin.form.structuredModels')}</legend>
            <span className="field-hint">{t('admin.form.structuredModelsHint')}</span>
            <div className="vehicle-model-options">
              {vehicleModels
                .filter(
                  (model) => !form.brand_id || String(model.brand_id) === String(form.brand_id)
                )
                .map((model) => {
                  const checked = form.vehicle_model_ids.some(
                    (modelId) => String(modelId) === String(model.id)
                  );
                  const label = [model.model_name, model.chassis_code].filter(Boolean).join(' ');
                  return (
                    <label key={model.id} className="vehicle-model-option">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            vehicle_model_ids: event.target.checked
                              ? [...current.vehicle_model_ids, model.id]
                              : current.vehicle_model_ids.filter(
                                  (modelId) => String(modelId) !== String(model.id)
                                )
                          }))
                        }
                      />
                      <span>{label}</span>
                    </label>
                  );
                })}
              {vehicleModels.filter(
                (model) => !form.brand_id || String(model.brand_id) === String(form.brand_id)
              ).length === 0 && (
                <span className="field-hint">{t('admin.form.noStructuredModels')}</span>
              )}
            </div>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => navigate('/admin/vehicle-models')}
            >
              {t('admin.form.manageStructuredModels')}
            </button>
          </fieldset>

          {error && (
            <div className="error-text" role="alert">
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button
              className="btn btn-primary btn-lg"
              type="submit"
              disabled={saving}
              style={{ flex: 1 }}
            >
              {saving ? t('admin.form.saving') : t('admin.form.save')}
            </button>
            <button
              type="button"
              className="btn btn-outline btn-lg"
              onClick={() => navigate('/admin/parts')}
            >
              {t('admin.form.cancel')}
            </button>
          </div>
        </form>
      </div>
      <AccessibleDialog
        open={blocker.state === 'blocked'}
        title={t('admin.unsaved.title')}
        confirmLabel={t('admin.unsaved.discard')}
        cancelLabel={t('admin.unsaved.keepEditing')}
        destructive
        onCancel={() => blocker.reset?.()}
        onConfirm={() => blocker.proceed?.()}
      >
        <p>{t('admin.unsaved.message')}</p>
      </AccessibleDialog>
      <AccessibleDialog
        open={Boolean(referenceDialog)}
        title={t(
          referenceDialog?.type === 'brand'
            ? 'admin.form.addBrandTitle'
            : 'admin.form.addCategoryTitle'
        )}
        confirmLabel={t('admin.ref.addButton')}
        cancelLabel={t('admin.form.cancel')}
        busy={referenceDialog?.busy}
        confirmDisabled={!referenceDialog?.name_en.trim() || !referenceDialog?.name_ka.trim()}
        onCancel={() => setReferenceDialog(null)}
        onConfirm={handleAddReference}
      >
        <div className="field">
          <label htmlFor="reference-name-en">{t('admin.ref.nameEn')}</label>
          <input
            id="reference-name-en"
            className="input"
            value={referenceDialog?.name_en || ''}
            onChange={(event) =>
              setReferenceDialog((current) => ({ ...current, name_en: event.target.value }))
            }
          />
        </div>
        <div className="field">
          <label htmlFor="reference-name-ka">{t('admin.ref.nameKa')}</label>
          <input
            id="reference-name-ka"
            className="input"
            value={referenceDialog?.name_ka || ''}
            onChange={(event) =>
              setReferenceDialog((current) => ({ ...current, name_ka: event.target.value }))
            }
          />
        </div>
        {referenceDialog?.error && (
          <div className="error-text" role="alert">
            {referenceDialog.error}
          </div>
        )}
      </AccessibleDialog>
      <AccessibleDialog
        open={confirmPhotoRemoval}
        title={t('admin.form.removePhoto')}
        confirmLabel={t('admin.form.removePhoto')}
        cancelLabel={t('admin.form.cancel')}
        destructive
        onCancel={() => setConfirmPhotoRemoval(false)}
        onConfirm={() => {
          setImageFile(null);
          setImageThumbnailFile(null);
          setImageInfo(null);
          setRemoveImage(true);
          setImagePreview((currentPreview) => {
            if (currentPreview.startsWith('blob:')) URL.revokeObjectURL(currentPreview);
            return '';
          });
          if (fileInputRef.current) fileInputRef.current.value = '';
          setConfirmPhotoRemoval(false);
        }}
      >
        <p>{t('admin.form.removePhotoConfirm')}</p>
      </AccessibleDialog>
    </div>
  );
}
