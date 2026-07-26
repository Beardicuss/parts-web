import { useLang } from '../i18n/LangContext.jsx';

export default function CategoryShowcase({ categories, onSelect, activeCategoryId }) {
  const { t, field } = useLang();

  if (!categories.length) return null;

  return (
    <div className="category-showcase">
      <div className="category-pill-list">
        <button
          className={`category-pill ${!activeCategoryId ? 'active' : ''}`}
          onClick={() => onSelect('')}
        >
          {t('categoryShowcase.allParts')}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-pill ${activeCategoryId === String(cat.id) ? 'active' : ''}`}
            onClick={() => onSelect(cat.id)}
          >
            {field(cat, 'name')}
          </button>
        ))}
      </div>
    </div>
  );
}
