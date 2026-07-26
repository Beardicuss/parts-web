import { Link } from 'react-router-dom';
import { useLang } from '../../i18n/LangContext.jsx';
import AdminNav from './AdminNav.jsx';

export default function AdminHome() {
  const { t } = useLang();

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
      </div>
    </div>
  );
}
