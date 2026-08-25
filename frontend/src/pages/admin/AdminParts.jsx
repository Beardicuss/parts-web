import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api.js';
import { useLang } from '../../i18n/LangContext.jsx';
import { useToast } from '../../components/ToastContext.jsx';
import AdminNav from './AdminNav.jsx';
import AccessibleDialog from '../../components/AccessibleDialog.jsx';
import { allowedPublicationStatuses, PUBLICATION_STATUSES } from '../../utils/publicationStatus.js';

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
  const [publicationStatus, setPublicationStatus] = useState('');
  const [publicationCounts, setPublicationCounts] = useState({
    draft: 0,
    needs_review: 0,
    published: 0,
    archived: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);
  const requestSequence = useRef(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [statusTarget, setStatusTarget] = useState(null);
  const [changingStatus, setChangingStatus] = useState(false);

  useEffect(() => {
    const requestId = ++requestSequence.current;
    const handle = setTimeout(() => {
      setLoading(true);
      setError('');
      Promise.all([
        api.getAdminParts({
          search: search.trim(),
          publicationStatus,
          page,
          pageSize
        }),
        api.getPublicationCounts()
      ])
        .then(([data, counts]) => {
          if (requestId === requestSequence.current) {
            setResult(data);
            setPublicationCounts(counts);
          }
        })
        .catch(() => {
          if (requestId === requestSequence.current) setError(t('admin.parts.loadError'));
        })
        .finally(() => {
          if (requestId === requestSequence.current) setLoading(false);
        });
    }, 250);
    return () => clearTimeout(handle);
  }, [page, pageSize, publicationStatus, retryKey, search, t]);

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

  const handleStatusChange = async () => {
    if (!statusTarget || changingStatus) return;
    setChangingStatus(true);
    try {
      await api.updatePartStatus(statusTarget.part.id, statusTarget.status);
      showToast(t('toast.saved'));
      setStatusTarget(null);
      reload();
    } catch {
      showToast(t('toast.error'), 'error');
    } finally {
      setChangingStatus(false);
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
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link to="/admin/parts/import" className="btn btn-outline btn-lg">
              {t('admin.parts.batchImport')}
            </Link>
            <Link to="/admin/parts/new" className="btn btn-primary btn-lg">
              {t('admin.parts.add')}
            </Link>
          </div>
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
          <select
            className="select"
            value={publicationStatus}
            onChange={(event) => {
              setPublicationStatus(event.target.value);
              setPage(1);
            }}
            aria-label={t('admin.parts.statusFilter')}
          >
            <option value="">{t('admin.parts.allStatuses')}</option>
            {PUBLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(`admin.status.${status}`)} ({publicationCounts[status] || 0})
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
                  <span
                    className={`publication-badge status-${part.publication_status || 'published'}`}
                  >
                    {t(`admin.status.${part.publication_status || 'published'}`)}
                  </span>
                  <div className="part-meta">
                    {part.brand_name_en && <span className="tag">{part.brand_name_en}</span>}
                    {part.category_name_en && <span className="tag">{part.category_name_en}</span>}
                  </div>
                  <div className="admin-actions" style={{ marginTop: 12 }}>
                    <Link to={`/admin/parts/${part.id}/preview`} className="btn btn-outline btn-lg">
                      {t('admin.preview.action')}
                    </Link>
                    <Link
                      to={`/admin/parts/${part.id}`}
                      className="btn btn-outline btn-lg"
                      style={{ flex: 1 }}
                    >
                      {t('admin.edit')}
                    </Link>
                    <select
                      className="select"
                      value={part.publication_status || 'published'}
                      aria-label={t('admin.parts.changeStatus')}
                      onChange={(event) => setStatusTarget({ part, status: event.target.value })}
                    >
                      {allowedPublicationStatuses(part.publication_status || 'published').map(
                        (status) => (
                          <option key={status} value={status}>
                            {t(`admin.status.${status}`)}
                          </option>
                        )
                      )}
                    </select>
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
      <AccessibleDialog
        open={Boolean(statusTarget)}
        title={t('admin.parts.statusConfirmTitle')}
        confirmLabel={changingStatus ? t('admin.form.saving') : t('admin.parts.statusConfirm')}
        cancelLabel={t('admin.form.cancel')}
        destructive={statusTarget?.status === 'archived'}
        busy={changingStatus}
        onCancel={() => setStatusTarget(null)}
        onConfirm={handleStatusChange}
      >
        <p>
          {statusTarget &&
            t('admin.parts.statusConfirmText')
              .replace('{code}', statusTarget.part.code)
              .replace('{status}', t(`admin.status.${statusTarget.status}`))}
        </p>
      </AccessibleDialog>
    </div>
  );
}
