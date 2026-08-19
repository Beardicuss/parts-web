import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext.jsx';

const services = [
  { key: 'headUnit', items: ['mapCode', 'antiTheftCode'] },
  {
    key: 'fbs4',
    items: [
      'edc17cp57',
      'edc17cp66',
      'edc17cp60',
      'med177',
      'med1772',
      'med1773',
      'med17731',
      'med1775',
      'med1777'
    ]
  },
  { key: 'battery48v', items: ['batteryModels', 'batteryChassis'] },
  { key: 'transmission7g', items: ['transmissionRenew', 'transmissionVgs'] },
  { key: 'fdct', items: ['fdctAuthorization', 'fdctAdaptation'] },
  { key: 'dsm', items: ['dsmEmergencyPark', 'dsmDataTransfer'] },
  { key: 'instrumentCluster', items: ['clusterRenew', 'clusterAmgMenu'] }
];

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
            href={`https://wa.me/995597969017?text=${encodeURIComponent(
              t('services.whatsappMessage')
            )}`}
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
            {services.map((service, index) => (
              <article className="service-detail-card" key={service.key}>
                <span className="service-number">{String(index + 1).padStart(2, '0')}</span>
                <h2>{t(`services.${service.key}.title`)}</h2>
                <p>{t(`services.${service.key}.description`)}</p>
                <ul className="service-feature-list">
                  {service.items.map((item) => (
                    <li key={item}>{t(`services.${service.key}.${item}`)}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="services-compatibility-note">{t('services.compatibilityNote')}</p>

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
