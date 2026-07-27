import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext.jsx';

const serviceKeys = ['diagnostics', 'installation', 'retrofit'];

export default function Services() {
  const { t } = useLang();

  return (
    <>
      <section className="services-hero">
        <div className="container services-hero-inner">
          <span className="hero-eyebrow">{t('services.eyebrow')}</span>
          <h1>{t('services.pageTitle')}</h1>
          <p>{t('services.pageDescription')}</p>
          <a
            className="btn btn-primary btn-lg"
            href="https://wa.me/995597969017"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('services.contact')}
          </a>
        </div>
      </section>

      <section className="services-list-section">
        <div className="container">
          <div className="services-list-grid">
            {serviceKeys.map((key, index) => (
              <article className="service-detail-card" key={key}>
                <span className="service-number">0{index + 1}</span>
                <h2>{t(`services.${key}.title`)}</h2>
                <p>{t(`services.${key}.description`)}</p>
              </article>
            ))}
          </div>

          <div className="services-catalog-link">
            <p>{t('services.partsCta')}</p>
            <Link className="btn btn-outline" to="/catalog">
              {t('nav.viewCatalog')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
