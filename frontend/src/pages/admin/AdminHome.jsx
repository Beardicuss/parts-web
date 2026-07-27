import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api.js';
import { useLang } from '../../i18n/LangContext.jsx';
import AdminNav from './AdminNav.jsx';

export default function AdminHome() {
  const { t } = useLang();
  const [orphanState, setOrphanState] = useState({ loading: false, names: null, error: false });

  const inspectOrphans = async () => {
    setOrphanState({ loading: true, names: null, error: false });
    try {
      const objects = await api.listOrphanImages();
      setOrphanState({ loading: false, names: objects.map(({ name }) => name), error: false });
    } catch {
      setOrphanState({ loading: false, names: null, error: true });
    }
  };

  return (
    <div className="admin-shell">
      <AdminNav />
      <div className="container" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <h1 className="page-title">{t('admin.home.title')}</h1>
        <p className="page-subtitle">{t('admin.home.subtitle')}</p>

        <div className="tile-grid">
          <Link to="/admin/parts" className="tile">
            <span className="tile-icon">⚙</span>
            <span className="tile-title">{t('admin.home.partsTile')}</span>
            <span className="tile-desc">{t('admin.home.partsDesc')}</span>
          </Link>
          <Link to="/admin/brands" className="tile">
            <span className="tile-icon">🏷</span>
            <span className="tile-title">{t('admin.home.brandsTile')}</span>
            <span className="tile-desc">{t('admin.home.brandsDesc')}</span>
          </Link>
          <Link to="/admin/categories" className="tile">
            <span className="tile-icon">📁</span>
            <span className="tile-title">{t('admin.home.categoriesTile')}</span>
            <span className="tile-desc">{t('admin.home.categoriesDesc')}</span>
          </Link>
        </div>

        <Link to="/admin/parts/new" className="btn btn-primary btn-lg" style={{ marginTop: 32 }}>
          {t('admin.home.quickAdd')}
        </Link>

        <section style={{ marginTop: 40 }}>
          <h2>{t('admin.home.storageTitle')}</h2>
          <p className="page-subtitle">{t('admin.home.storageDescription')}</p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={inspectOrphans}
            disabled={orphanState.loading}
          >
            {orphanState.loading ? t('catalog.loading') : t('admin.home.inspectStorage')}
          </button>
          {orphanState.names && (
            <div className="field-hint" style={{ marginTop: 12 }}>
              {orphanState.names.length
                ? t('admin.home.orphansFound').replace('{count}', orphanState.names.length)
                : t('admin.home.noOrphans')}
              {orphanState.names.length > 0 && (
                <pre style={{ whiteSpace: 'pre-wrap' }}>{orphanState.names.join('\n')}</pre>
              )}
            </div>
          )}
          {orphanState.error && <div className="error-text">{t('admin.home.storageError')}</div>}
        </section>
      </div>
    </div>
  );
}
