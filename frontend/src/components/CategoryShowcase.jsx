import { useLang } from '../i18n/LangContext.jsx';

const TILE_VARIANTS = ['tile-a', 'tile-b', 'tile-c', 'tile-d'];

export default function CategoryShowcase({ categories, onSelect }) {
  const { t, field } = useLang();

  if (!categories.length) return null;

  return (
    <div className="category-showcase">
      <div className="container">
        <span className="section-eyebrow">{t('categoryShowcase.eyebrow')}</span>
        <h2 className="section-title">{t('categoryShowcase.title')}</h2>

        <div className="category-tile-grid">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              className={`category-tile ${TILE_VARIANTS[i % TILE_VARIANTS.length]}`}
              onClick={() => onSelect(cat.id)}
            >
              <span className="category-tile-name">{field(cat, 'name')}</span>
              <span className="category-tile-cta">{t('categoryShowcase.viewParts')} →</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
