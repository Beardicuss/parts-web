import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminNav from './AdminNav.jsx';
import { api } from '../../api.js';
import { useLang } from '../../i18n/LangContext.jsx';
import { useToast } from '../../components/ToastContext.jsx';
import { processImageFile } from '../../utils/processImageFile.js';
import {
  hashFile,
  markBatchDuplicates,
  matchReferenceId,
  parseProductImagePath
} from '../../utils/batchImport.js';

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export default function AdminBatchImport() {
  const { t } = useLang();
  const { showToast } = useToast();
  const folderInput = useRef(null);
  const fileInput = useRef(null);
  const previewUrls = useRef([]);
  const [rows, setRows] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('all');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState({ current: 0, total: 0 });
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const [bulkBrand, setBulkBrand] = useState('');
  const [bulkCategory, setBulkCategory] = useState('');

  const visibleRows = useMemo(
    () =>
      rows.filter((row) => {
        if (filter === 'review') return row.needsReview || row.duplicateCode || row.duplicateImage;
        if (filter === 'ready')
          return !row.needsReview && !row.duplicateCode && !row.duplicateImage;
        if (filter === 'failed') return row.status === 'failed';
        return true;
      }),
    [filter, rows]
  );
  const selectedCount = rows.filter((row) => row.selected && row.status !== 'imported').length;
  const importedCount = rows.filter((row) => row.status === 'imported').length;
  const failedCount = rows.filter((row) => row.status === 'failed').length;

  useEffect(() => () => previewUrls.current.forEach((url) => URL.revokeObjectURL(url)), []);

  const analyzeFiles = async (fileList) => {
    const files = [...fileList].filter((file) => allowedTypes.has(file.type));
    if (!files.length) {
      setError(t('admin.batch.noImages'));
      return;
    }
    setAnalyzing(true);
    setError('');
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrls.current = [];
    setAnalysisProgress({ current: 0, total: files.length });
    try {
      const [loadedBrands, loadedCategories, existingCodes] = await Promise.all([
        api.getBrands(),
        api.getCategories(),
        api.getExistingPartCodes()
      ]);
      const analyzed = [];
      for (const [index, file] of files.entries()) {
        const parsed = parseProductImagePath(file);
        const previewUrl = URL.createObjectURL(file);
        previewUrls.current.push(previewUrl);
        analyzed.push({
          id: `${index}:${parsed.sourcePath}`,
          file,
          previewUrl,
          hash: await hashFile(file),
          ...parsed,
          brand_id: matchReferenceId(loadedBrands, parsed.brandName),
          category_id: matchReferenceId(loadedCategories, parsed.categoryName),
          selected: true,
          publication_status: parsed.needsReview ? 'needs_review' : 'draft',
          vehicle_model_ids: [],
          status: 'pending',
          error: ''
        });
        setAnalysisProgress({ current: index + 1, total: files.length });
      }
      setBrands(loadedBrands);
      setCategories(loadedCategories);
      setRows(markBatchDuplicates(analyzed, existingCodes));
    } catch (analysisError) {
      setError(analysisError.message || t('admin.batch.analysisError'));
    } finally {
      setAnalyzing(false);
    }
  };

  const updateRow = (id, changes) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...changes } : row)));
  };

  const applyBulk = () => {
    setRows((current) =>
      current.map((row) => {
        if (!row.selected || row.status === 'imported') return row;
        const changes = {};
        if (bulkBrand) {
          changes.brand_id = bulkBrand;
          changes.brandName = brands.find((brand) => String(brand.id) === bulkBrand)?.name_en || '';
        }
        if (bulkCategory) {
          changes.category_id = bulkCategory;
          changes.categoryName =
            categories.find((category) => String(category.id) === bulkCategory)?.name_en || '';
        }
        return { ...row, ...changes };
      })
    );
  };

  const ensureReferences = async (candidateRows) => {
    const missingBrands = [
      ...new Set(
        candidateRows
          .filter((row) => !row.brand_id)
          .map((row) => row.brandName)
          .filter(Boolean)
      )
    ];
    const missingCategories = [
      ...new Set(
        candidateRows
          .filter((row) => !row.category_id)
          .map((row) => row.categoryName)
          .filter(Boolean)
      )
    ];
    for (const name of missingBrands) {
      try {
        await api.createBrand({ name_en: name, name_ka: name });
      } catch {
        // A matching reference may already have been created in another session.
      }
    }
    for (const name of missingCategories) {
      try {
        await api.createCategory({ name_en: name, name_ka: name });
      } catch {
        // Reload below and validate the final result.
      }
    }
    const [freshBrands, freshCategories, freshVehicleModels] = await Promise.all([
      api.getBrands(),
      api.getCategories(),
      api.getVehicleModels()
    ]);
    setBrands(freshBrands);
    setCategories(freshCategories);
    return candidateRows.map((row) => {
      const brandId = row.brand_id || matchReferenceId(freshBrands, row.brandName);
      const normalizedCompatibility = row.compatible_models.trim().toLowerCase();
      const matchedModel = freshVehicleModels.find(
        (model) =>
          String(model.brand_id) === String(brandId) &&
          [model.model_name, model.chassis_code].filter(Boolean).join(' ').trim().toLowerCase() ===
            normalizedCompatibility
      );
      return {
        ...row,
        brand_id: brandId,
        category_id: row.category_id || matchReferenceId(freshCategories, row.categoryName),
        vehicle_model_ids: matchedModel ? [matchedModel.id] : []
      };
    });
  };

  const importSelected = async () => {
    if (!selectedCount || importing) return;
    setImporting(true);
    setError('');
    try {
      const selectedRows = rows.filter((row) => row.selected && row.status !== 'imported');
      const preparedRows = await ensureReferences(selectedRows);
      const existingCodes = await api.getExistingPartCodes();
      const recheckedRows = markBatchDuplicates(preparedRows, existingCodes);
      setRows((current) =>
        current.map((row) => recheckedRows.find((candidate) => candidate.id === row.id) || row)
      );
      const queue = recheckedRows.filter(
        (row) =>
          row.code.trim() &&
          row.title_en.trim() &&
          row.title_ka.trim() &&
          row.brand_id &&
          row.category_id &&
          !row.duplicateCode &&
          !row.duplicateImage
      );
      const invalidIds = new Set(
        recheckedRows.filter((row) => !queue.includes(row)).map((row) => row.id)
      );
      if (invalidIds.size) {
        setRows((current) =>
          current.map((row) =>
            invalidIds.has(row.id)
              ? { ...row, status: 'failed', error: t('admin.batch.missingFields') }
              : row
          )
        );
      }

      let cursor = 0;
      const worker = async () => {
        while (cursor < queue.length) {
          const row = queue[cursor++];
          updateRow(row.id, { status: 'processing', error: '' });
          try {
            const processed = await processImageFile(row.file);
            await api.createPart(
              {
                code: row.code,
                replacement_codes: '',
                compatible_models: row.compatible_models,
                title_en: row.title_en,
                title_ka: row.title_ka,
                description_en: `${row.moduleFamily}${row.compatible_models ? ` for ${row.compatible_models}` : ''}.`,
                description_ka: '',
                brand_id: row.brand_id,
                category_id: row.category_id,
                publication_status: row.publication_status,
                vehicle_model_ids: row.vehicle_model_ids
              },
              processed.file,
              processed.thumbnailFile
            );
            updateRow(row.id, { status: 'imported', selected: false });
          } catch (importError) {
            updateRow(row.id, {
              status: 'failed',
              error: importError.message || t('admin.batch.importError')
            });
          }
        }
      };
      await Promise.all([worker(), worker()]);
      showToast(t('admin.batch.finished'));
    } catch (importError) {
      setError(importError.message || t('admin.batch.importError'));
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="admin-shell">
      <AdminNav />
      <main className="container batch-import-page">
        <div className="toolbar batch-import-heading">
          <div>
            <Link className="back-link" to="/admin/parts">
              ← {t('admin.back')}
            </Link>
            <h1 className="page-title">{t('admin.batch.title')}</h1>
            <p className="page-subtitle">{t('admin.batch.description')}</p>
          </div>
          <div className="batch-picker-actions">
            <button
              className="btn btn-primary"
              onClick={() => folderInput.current?.click()}
              disabled={analyzing || importing}
            >
              {t('admin.batch.selectFolder')}
            </button>
            <button
              className="btn btn-outline"
              onClick={() => fileInput.current?.click()}
              disabled={analyzing || importing}
            >
              {t('admin.batch.selectFiles')}
            </button>
            <input
              ref={folderInput}
              className="visually-hidden"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              webkitdirectory=""
              directory=""
              multiple
              onChange={(event) => analyzeFiles(event.target.files)}
            />
            <input
              ref={fileInput}
              className="visually-hidden"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(event) => analyzeFiles(event.target.files)}
            />
          </div>
        </div>

        {analyzing && (
          <div className="batch-status" role="status">
            {t('admin.batch.analyzing')}
            <progress value={analysisProgress.current} max={analysisProgress.total} />
            <span>
              {analysisProgress.current} / {analysisProgress.total}
            </span>
          </div>
        )}
        {error && <div className="error-text batch-error">{error}</div>}

        {rows.length > 0 && (
          <>
            <section className="batch-summary" aria-label={t('admin.batch.summary')}>
              <div>
                <strong>{rows.length}</strong>
                <span>{t('admin.batch.analyzed')}</span>
              </div>
              <div>
                <strong>{selectedCount}</strong>
                <span>{t('admin.batch.selected')}</span>
              </div>
              <div>
                <strong>{rows.filter((row) => row.needsReview).length}</strong>
                <span>{t('admin.batch.needsReview')}</span>
              </div>
              <div>
                <strong>{importedCount}</strong>
                <span>{t('admin.batch.imported')}</span>
              </div>
              <div>
                <strong>{failedCount}</strong>
                <span>{t('admin.batch.failed')}</span>
              </div>
            </section>

            <section className="batch-controls">
              <div className="batch-filters" aria-label={t('admin.batch.filter')}>
                {['all', 'ready', 'review', 'failed'].map((value) => (
                  <button
                    key={value}
                    className={`btn btn-sm ${filter === value ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setFilter(value)}
                  >
                    {t(`admin.batch.filter.${value}`)}
                  </button>
                ))}
              </div>
              <div className="batch-bulk-controls">
                <select
                  className="select"
                  value={bulkBrand}
                  onChange={(event) => setBulkBrand(event.target.value)}
                  aria-label={t('admin.form.brand')}
                >
                  <option value="">{t('admin.batch.keepBrand')}</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name_en}
                    </option>
                  ))}
                </select>
                <select
                  className="select"
                  value={bulkCategory}
                  onChange={(event) => setBulkCategory(event.target.value)}
                  aria-label={t('admin.form.category')}
                >
                  <option value="">{t('admin.batch.keepCategory')}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name_en}
                    </option>
                  ))}
                </select>
                <button className="btn btn-outline" onClick={applyBulk}>
                  {t('admin.batch.applySelected')}
                </button>
              </div>
            </section>

            <div className="batch-table-wrap">
              <table className="batch-table">
                <thead>
                  <tr>
                    <th>
                      <span className="visually-hidden">{t('admin.batch.selected')}</span>
                    </th>
                    <th>{t('admin.form.publicationStatus')}</th>
                    <th>{t('admin.form.image')}</th>
                    <th>{t('admin.form.code')}</th>
                    <th>{t('admin.form.brand')}</th>
                    <th>{t('admin.form.compatibleModels')}</th>
                    <th>{t('admin.form.category')}</th>
                    <th>{t('admin.form.titleEn')}</th>
                    <th>{t('admin.form.titleKa')}</th>
                    <th>{t('admin.batch.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row) => (
                    <tr key={row.id} className={row.needsReview ? 'needs-review' : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={row.selected}
                          disabled={
                            row.status === 'imported' || row.duplicateCode || row.duplicateImage
                          }
                          onChange={(event) =>
                            updateRow(row.id, { selected: event.target.checked })
                          }
                        />
                      </td>
                      <td>
                        <select
                          className="select"
                          value={row.publication_status}
                          onChange={(event) =>
                            updateRow(row.id, { publication_status: event.target.value })
                          }
                        >
                          {['draft', 'needs_review', 'published'].map((status) => (
                            <option key={status} value={status}>
                              {t(`admin.status.${status}`)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <img className="batch-thumb" src={row.previewUrl} alt="" />
                      </td>
                      <td>
                        <input
                          className="input"
                          value={row.code}
                          onChange={(event) =>
                            updateRow(row.id, { code: event.target.value, duplicateCode: false })
                          }
                        />
                      </td>
                      <td>
                        <select
                          className="select"
                          value={row.brand_id}
                          onChange={(event) =>
                            updateRow(row.id, {
                              brand_id: event.target.value,
                              brandName:
                                brands.find((brand) => String(brand.id) === event.target.value)
                                  ?.name_en || row.brandName
                            })
                          }
                        >
                          {!row.brand_id && (
                            <option value="">{row.brandName || t('admin.batch.choose')}</option>
                          )}
                          {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                              {brand.name_en}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          className="input"
                          value={row.compatible_models}
                          placeholder={row.needsReview ? t('admin.batch.verifyModel') : ''}
                          onChange={(event) =>
                            updateRow(row.id, {
                              compatible_models: event.target.value,
                              needsReview: !event.target.value
                            })
                          }
                        />
                      </td>
                      <td>
                        <select
                          className="select"
                          value={row.category_id}
                          onChange={(event) =>
                            updateRow(row.id, { category_id: event.target.value })
                          }
                        >
                          {!row.category_id && (
                            <option value="">{row.categoryName || t('admin.batch.choose')}</option>
                          )}
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name_en}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          className="input batch-title-input"
                          value={row.title_en}
                          onChange={(event) => updateRow(row.id, { title_en: event.target.value })}
                        />
                      </td>
                      <td>
                        <input
                          className="input batch-title-input"
                          value={row.title_ka}
                          onChange={(event) => updateRow(row.id, { title_ka: event.target.value })}
                        />
                      </td>
                      <td>
                        <span className={`batch-row-status status-${row.status}`}>
                          {t(`admin.batch.status.${row.status}`)}
                        </span>
                        {row.duplicateCode && <small>{t('admin.batch.duplicateCode')}</small>}
                        {row.duplicateImage && <small>{t('admin.batch.duplicateImage')}</small>}
                        {row.needsReview && !row.duplicateCode && !row.duplicateImage && (
                          <small>{row.reviewReason || t('admin.batch.verifyModel')}</small>
                        )}
                        {row.error && <small className="error-text">{row.error}</small>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="batch-import-footer">
              <span>{t('admin.batch.importHelp')}</span>
              <button
                className="btn btn-primary btn-lg"
                disabled={!selectedCount || importing || analyzing}
                onClick={importSelected}
              >
                {importing
                  ? t('admin.batch.importing')
                  : t('admin.batch.importSelected').replace('{count}', selectedCount)}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
