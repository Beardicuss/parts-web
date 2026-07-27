import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { useLang } from '../../i18n/LangContext.jsx';
import LanguageSwitcher from '../../components/LanguageSwitcher.jsx';

export default function AdminNav() {
  const { logout } = useAuth();
  const { t } = useLang();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <header className="admin-header">
      <div className="container admin-header-inner">
        <Link to="/admin" className="brand">
          <span className="brand-mark">P</span>
          <span>{t('brand')}</span>
        </Link>

        <nav className="admin-tabs">
          <Link
            className={`admin-tab ${isActive('/admin') && location.pathname === '/admin' ? 'active' : ''}`}
            to="/admin"
          >
            {t('admin.nav.home')}
          </Link>
          <Link
            className={`admin-tab ${isActive('/admin/parts') ? 'active' : ''}`}
            to="/admin/parts"
          >
            {t('admin.nav.parts')}
          </Link>
          <Link
            className={`admin-tab ${isActive('/admin/brands') ? 'active' : ''}`}
            to="/admin/brands"
          >
            {t('admin.nav.brands')}
          </Link>
          <Link
            className={`admin-tab ${isActive('/admin/categories') ? 'active' : ''}`}
            to="/admin/categories"
          >
            {t('admin.nav.categories')}
          </Link>
        </nav>

        <div className="header-nav">
          <LanguageSwitcher />
          <Link to="/" className="btn btn-outline btn-sm" target="_blank" rel="noreferrer">
            {t('admin.nav.viewSite')}
          </Link>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>
            {t('admin.nav.logout')}
          </button>
        </div>
      </div>
    </header>
  );
}
