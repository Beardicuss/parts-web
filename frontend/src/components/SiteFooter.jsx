import { useLang } from '../i18n/LangContext.jsx';

export default function SiteFooter() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="brand footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/logo.webp" alt="SebaTech" className="brand-logo" style={{ height: '20px', width: 'auto' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}>{t('brand')}</span>
        </div>
        <p className="footer-copy">© {year} {t('brand')}</p>
      </div>
    </footer>
  );
}
