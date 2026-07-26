import { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { useLang } from '../i18n/LangContext.jsx';
import FilterBar from '../components/FilterBar.jsx';
import PartCard from '../components/PartCard.jsx';
import CategoryShowcase from '../components/CategoryShowcase.jsx';

const emptyFilters = { search: '', brand_id: '', category_id: '' };
const PAGE_SIZE = 20;

export default function Catalog() {
  const { t } = useLang();
  const [parts, setParts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const gridRef = useRef(null);

  useEffect(() => {
    Promise.all([api.getBrands(), api.getCategories()]).then(([b, c]) => {
      setBrands(b);
      setCategories(c);
    });
  }, []);

  // Fetch when filters change (resets to page 1)
  useEffect(() => {
    setLoading(true);
    setPage(1);
    const handle = setTimeout(() => {
      api
        .getParts(filters, 1, PAGE_SIZE)
        .then((data) => {
          setParts(data);
          setHasMore(data.length === PAGE_SIZE);
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(handle);
  }, [filters]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    api
      .getParts(filters, nextPage, PAGE_SIZE)
      .then((data) => {
        setParts((prev) => [...prev, ...data]);
        setHasMore(data.length === PAGE_SIZE);
        setPage(nextPage);
      })
      .finally(() => setLoadingMore(false));
  };

  const handleCategorySelect = (categoryId) => {
    setFilters((f) => ({ ...f, category_id: String(categoryId) }));
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="container catalog-body" style={{ paddingTop: '40px' }}>
      <h1 className="section-title" style={{ marginBottom: '24px' }}>{t('nav.catalog')}</h1>

      <CategoryShowcase categories={categories} onSelect={handleCategorySelect} activeCategoryId={filters.category_id} />

      <div ref={gridRef}>
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(emptyFilters)}
          brands={brands}
          categories={categories}
        />

        {!loading && parts.length === 0 && <div className="empty-state">{t('catalog.empty')}</div>}

        <div className="part-grid">
          {parts.map((part) => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>

        {hasMore && parts.length > 0 && (
          <div className="load-more-container">
            <button 
              className="btn btn-primary" 
              onClick={loadMore} 
              disabled={loadingMore}
            >
              {loadingMore ? t('catalog.loadingMore') : t('catalog.loadMore')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


