import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext.jsx';

export default function SiteFooter() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand column */}
          <div className="footer-col">
            <div className="footer-brand">
              <img src="/logo.webp" alt="SebaTech" className="brand-logo" style={{ height: '40px', width: 'auto' }} />
              <div className="brand-text">
                <span className="brand-name" style={{ fontSize: '18px' }}>{t('brand')}</span>
                <span className="brand-tagline" style={{ fontSize: '11px' }}>Next Level Performance</span>
              </div>
            </div>
            <p className="footer-desc">{t('footer.desc')}</p>
          </div>

          {/* Navigation column */}
          <div className="footer-col">
            <h4 className="footer-heading">{t('footer.navigation')}</h4>
            <nav className="footer-nav">
              <Link to="/">{t('nav.main')}</Link>
              <Link to="/catalog">{t('nav.catalog')}</Link>
              <a href="#">{t('nav.services')}</a>
              <a href="#">{t('nav.about')}</a>
            </nav>
          </div>

          {/* Contact column */}
          <div className="footer-col">
            <h4 className="footer-heading">{t('footer.contact')}</h4>
            <div className="footer-contact">
              {/* <a href="tel:+995597969017">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +995 597 96 90 17
              </a> */}
              <a href="https://wa.me/995597969017" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 3.2L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
                WhatsApp
              </a>
              <a href="https://www.facebook.com/people/Seba-Tech/61566989052458/" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                Facebook
              </a>
              <span className="footer-address" style={{ marginTop: '4px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                {t('footer.address')}
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© {year} {t('brand')}. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}

