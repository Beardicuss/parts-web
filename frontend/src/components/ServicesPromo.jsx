import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext.jsx';

export default function ServicesPromo() {
  const { t } = useLang();

  return (
    <section className="services-promo" aria-labelledby="services-promo-title">
      <div className="container">
        <Link to="/services" className="services-promo-card">
          <div className="services-promo-image">
            <img src="/services/services-bg.webp" alt="" width="1600" height="900" loading="lazy" />
            <div className="services-promo-badge">{t('services.promoBadge')}</div>
          </div>
          <div className="services-promo-content">
            <span className="section-eyebrow">{t('services.eyebrow')}</span>
            <h2 id="services-promo-title">{t('services.promoTitle')}</h2>
            <p>{t('services.promoDescription')}</p>
            <span className="services-promo-action">
              {t('services.explore')} <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
