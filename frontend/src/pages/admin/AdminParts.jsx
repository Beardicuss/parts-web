import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api.js';
import { useLang } from '../../i18n/LangContext.jsx';
import { useToast } from '../../components/ToastContext.jsx';
import AdminNav from './AdminNav.jsx';
import AccessibleDialog from '../../components/AccessibleDialog.jsx';

export default function AdminParts() {
  const { t, field } = useLang();
  const { showToast } = useToast();
  const [result, setResult] = useState({
    items: [],
    total: 0,
    page: 1,
    pageSize: 20,
    totalPages: 1
  });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);
  const requestSequence = useRef(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const requestId = ++requestSequence.current;
    const handle = setTimeout(() => {
      setLoading(true);
      setError('');
      api
        .getAdminParts({ search: search.trim(), page, pageSize })
        .then((data) => {
          if (requestId === requestSequence.current) setResult(data);
        })
        .catch(() => {
          if (requestId === requestSequence.current) setError(t('admin.parts.loadError'));
        })
        .finally(() => {
          if (requestId === requestSequence.current) setLoading(false);
        });
    }, 250);
    return () => clearTimeout(handle);
  }, [page, pageSize, retryKey, search, t]);

  const reload = () => setRetryKey((value) => value + 1);

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      const deletion = await api.deletePart(deleteTarget.id);
      showToast(
        deletion.mediaCleanupWarning ? t('toast.cleanupWarning') : t('toast.deleted'),
        deletion.mediaCleanupWarning ? 'error' : 'success'
      );
      if (result.items.length === 1 && page > 1) setPage((value) => value - 1);
      else reload();
    } catch {
      showToast(t('toast.error'), 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="admin-shell">
      <AdminNav />
      <div className="container" style={{ paddingTop: 32 }}>
        <div className="toolbar">
          <h1 className="page-title" style={{ margin: 0 }}>
            {t('admin.parts.title')}
          </h1>
          <Link to="/admin/parts/new" className="btn btn-primary btn-lg">
            {t('admin.parts.add')}
          </Link>
        </div>

        <div className="toolbar" style={{ alignItems: 'center', gap: 12 }}>
          <input
            className="input"
            style={{ maxWidth: 360 }}
            placeholder={t('admin.parts.searchPlaceholder')}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
          <select
            className="select"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
            aria-label={t('admin.parts.pageSize')}
          >
            {[12, 20, 40].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>{t('admin.parts.total').replace('{count}', result.total)}</span>
        </div>

        {loading && <div className="empty-state">{t('catalog.loading')}</div>}
        {!loading && error && (
          <div className="empty-state">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={reload}>
              {t('catalog.retry')}
            </button>
          </div>
        )}
        {!loading && !error && result.items.length === 0 && (
          <div className="empty-state">{t('admin.parts.empty')}</div>
        )}

        {!loading && !error && (
          <div className="admin-part-grid">
            {result.items.map((part) => (
              <div className="admin-part-card" key={part.id}>
                <div className="admin-part-card-image">
                  {part.image_path ? (
                    <img src={part.image_path} alt={field(part, 'title')} />
                  ) : (
                    <span className="placeholder">{t('admin.parts.noImage')}</span>
                  )}
                </div>
                <div className="admin-part-card-body">
                  <span className="part-code">{part.code}</span>
                  <span className="part-title">{field(part, 'title')}</span>
                  <div className="part-meta">
                    {part.brand_name_en && <span className="tag">{part.brand_name_en}</span>}
                    {part.category_name_en && <span className="tag">{part.category_name_en}</span>}
                  </div>
                  <div className="admin-actions" style={{ marginTop: 12 }}>
                    <Link
                      to={`/admin/parts/${part.id}`}
                      className="btn btn-outline btn-lg"
                      style={{ flex: 1 }}
                    >
                      {t('admin.edit')}
                    </Link>
                    <button
                      className="btn btn-danger btn-lg"
                      onClick={() => setDeleteTarget(part)}
                      disabled={deleting}
                    >
                      {t('admin.delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && result.totalPages > 1 && (
          <div className="load-more-container" style={{ gap: 12 }}>
            <button
              className="btn btn-outline"
              disabled={page <= 1}
              onClick={() => setPage((value) => value - 1)}
            >
              {t('admin.parts.previous')}
            </button>
            <span>
              {t('admin.parts.page').replace('{page}', page).replace('{pages}', result.totalPages)}
            </span>
            <button
              className="btn btn-outline"
              disabled={page >= result.totalPages}
              onClick={() => setPage((value) => value + 1)}
            >
              {t('admin.parts.next')}
            </button>
          </div>
        )}
      </div>
      <AccessibleDialog
        open={Boolean(deleteTarget)}
        title={t('admin.deleteTitle')}
        confirmLabel={deleting ? t('admin.deleting') : t('admin.delete')}
        cancelLabel={t('admin.form.cancel')}
        destructive
        busy={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      >
        <p>{t('admin.deleteConfirm')}</p>
        {deleteTarget && <strong>{deleteTarget.code}</strong>}
      </AccessibleDialog>
    </div>
  );
}
