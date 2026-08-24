import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function SiteHeader() {
  const { t } = useLang();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <img
            src="/logo.webp"
            alt="SebaTech"
            className="brand-logo"
            width="320"
            height="160"
            fetchpriority="high"
          />
          <div className="brand-text">
            <span className="brand-name">{t('brand')}</span>
            <span className="brand-tagline">Next Level Performance</span>
          </div>
        </Link>
        <nav className="main-nav">
          <Link to="/" className="nav-link">
            {t('nav.main')}
          </Link>
          <Link to="/catalog" className="nav-link">
            {t('nav.catalog')}
          </Link>
          <Link to="/services" className="nav-link">
            {t('nav.services')}
          </Link>
          <Link to="/about" className="nav-link">
            {t('nav.about')}
          </Link>
        </nav>
        <div className="header-controls">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
