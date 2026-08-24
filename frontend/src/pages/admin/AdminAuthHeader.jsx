import { Link } from 'react-router-dom';
import { useLang } from '../../i18n/LangContext.jsx';
import LanguageSwitcher from '../../components/LanguageSwitcher.jsx';
import ThemeToggle from '../../components/ThemeToggle.jsx';

export default function AdminAuthHeader() {
  const { t } = useLang();

  return (
    <header className="admin-header admin-auth-header">
      <div className="container admin-header-inner">
        <Link to="/" className="brand">
          <img src="/logo.webp" alt="SebaTech" className="brand-logo" width="320" height="160" />
          <span className="brand-text">
            <span className="brand-name">{t('brand')}</span>
            <span className="brand-tagline">Next Level Performance</span>
          </span>
        </Link>
        <div className="header-nav admin-header-controls">
          <ThemeToggle />
          <LanguageSwitcher />
          <Link to="/" className="btn btn-outline btn-sm">
            {t('admin.nav.viewSite')}
          </Link>
        </div>
      </div>
    </header>
  );
}
