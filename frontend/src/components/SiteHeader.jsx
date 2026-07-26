import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { useTheme } from '../theme/ThemeContext.jsx';

export default function SiteHeader() {
  const { t } = useLang();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="site-header">
      <div className="container">
        <Link to="/" className="brand">
          <img src="/logo.webp" alt="SebaTech" className="brand-logo" />
          <div className="brand-text">
            <span className="brand-name">{t('brand')}</span>
            <span className="brand-tagline">Next Level Performance</span>
          </div>
        </Link>
        <nav className="main-nav">
          <Link to="/" className="nav-link">{t('nav.main')}</Link>
          <Link to="/" className="nav-link">{t('nav.catalog')}</Link>
          <a href="#" className="nav-link">{t('nav.services')}</a>
          <a href="#" className="nav-link">{t('nav.about')}</a>
        </nav>
        <div className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme} 
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            )}
          </button>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
