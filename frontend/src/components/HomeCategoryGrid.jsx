import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext.jsx';

const categories = [
  { key: 'controlUnit', system: 'control-unit', image: '/categories/category-control-unit.webp' },
  { key: 'lighting', system: 'lighting', image: '/categories/category-lighting.webp' },
  {
    key: 'steeringWheels',
    system: 'steering-wheels',
    image: '/categories/category-steering-wheel.webp'
  },
  {
    key: 'engineTransmission',
    system: 'engine-transmission',
    image: '/categories/category-engine-transmission.webp'
  },
  {
    key: 'retrofitAdapter',
    system: 'retrofit-adapter',
    image: '/categories/category-retrofit-adapter.webp'
  },
  {
    key: 'axlesSuspension',
    system: 'axles-suspension',
    image: '/categories/category-axles-suspension.webp'
  }
];

export default function HomeCategoryGrid() {
  const { t } = useLang();

  return (
    <section className="home-categories" aria-labelledby="home-categories-title">
      <div className="container">
        <div className="section-heading centered">
          <span className="section-eyebrow">{t('home.categoriesEyebrow')}</span>
          <h2 id="home-categories-title" className="section-title">
            {t('home.categoriesTitle')}
          </h2>
          <p className="section-description">{t('home.categoriesDescription')}</p>
        </div>

        <div className="home-category-grid">
          {categories.map((category) => (
            <Link
              key={category.key}
              to={`/catalog?system=${category.system}`}
              className="home-category-card"
              aria-label={`${t(`category.${category.key}`)} — ${t('category.viewCatalog')}`}
            >
              <div className="home-category-icon">
                <img src={category.image} alt="" width="1024" height="1024" loading="lazy" />
              </div>
              <div className="home-category-copy">
                <h3>{t(`category.${category.key}`)}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
