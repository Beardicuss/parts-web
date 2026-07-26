import { useLang } from '../i18n/LangContext.jsx';

export default function FilterBar({ filters, onChange, onReset, brands, categories }) {
  const { t, field } = useLang();

  return (
    <div className="filter-bar">
      <div className="field">
        <label htmlFor="search">{t('filter.search')}</label>
        <input
          id="search"
          className="input"
          type="text"
          placeholder={t('filter.search')}
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="brand">{t('filter.brand')}</label>
        <select
          id="brand"
          className="select"
          value={filters.brand_id}
          onChange={(e) => onChange({ ...filters, brand_id: e.target.value })}
        >
          <option value="">{t('filter.allBrands')}</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {field(b, 'name')}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="category">{t('filter.category')}</label>
        <select
          id="category"
          className="select"
          value={filters.category_id}
          onChange={(e) => onChange({ ...filters, category_id: e.target.value })}
        >
          <option value="">{t('filter.allCategories')}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {field(c, 'name')}
            </option>
          ))}
        </select>
      </div>

      <div className="field" style={{ justifyContent: 'flex-end' }}>
        <label>&nbsp;</label>
        <button className="btn btn-outline" onClick={onReset}>
          {t('filter.reset')}
        </button>
      </div>
    </div>
  );
}
