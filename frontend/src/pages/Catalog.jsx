import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { useLang } from '../i18n/LangContext.jsx';
import FilterBar from '../components/FilterBar.jsx';
import PartCard from '../components/PartCard.jsx';
import LoadingSkeleton from '../components/LoadingSkeleton.jsx';

const emptyFilters = { search: '', brand_id: '', category_id: '', system: '' };
const PAGE_SIZE = 20;

function filtersFromParams(searchParams) {
  return {
    search: searchParams.get('q') || '',
    brand_id: searchParams.get('brand') || '',
    category_id: searchParams.get('category') || '',
    system: searchParams.get('system') || ''
  };
}

function paramsFromFilters(filters) {
  const params = new URLSearchParams();
  if (filters.search.trim()) params.set('q', filters.search.trim());
  if (filters.brand_id) params.set('brand', filters.brand_id);
  if (filters.category_id) params.set('category', filters.category_id);
  if (filters.system) params.set('system', filters.system);
  return params;
}

export default function Catalog() {
  const { t } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const [parts, setParts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(() => filtersFromParams(searchParams));
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);
  const requestSequence = useRef(0);

  useEffect(() => {
    setFilters(filtersFromParams(searchParams));
  }, [searchParams]);
  useEffect(() => {
    Promise.all([api.getBrands(), api.getCategories()])
      .then(([b, c]) => {
        setBrands(b);
        setCategories(c);
      })
      .catch(() => setError(t('catalog.loadError')));
  }, [retryKey, t]);

  // Fetch when filters change (resets to page 1)
  useEffect(() => {
    setLoading(true);
    setError('');
    setPage(1);
    const requestId = ++requestSequence.current;
    const handle = setTimeout(() => {
      api
        .getParts(filters, 1, PAGE_SIZE)
        .then((data) => {
          if (requestId !== requestSequence.current) return;
          setParts(data);
          setHasMore(data.length === PAGE_SIZE);
        })
        .catch(() => {
          if (requestId === requestSequence.current) {
            setParts([]);
            setHasMore(false);
            setError(t('catalog.loadError'));
          }
        })
        .finally(() => {
          if (requestId === requestSequence.current) setLoading(false);
        });
    }, 250);
    return () => clearTimeout(handle);
  }, [filters, retryKey, t]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    const requestId = requestSequence.current;
    api
      .getParts(filters, nextPage, PAGE_SIZE)
      .then((data) => {
        if (requestId !== requestSequence.current) return;
        setParts((prev) => [...prev, ...data]);
        setHasMore(data.length === PAGE_SIZE);
        setPage(nextPage);
      })
      .catch(() => setError(t('catalog.loadError')))
      .finally(() => {
        if (requestId === requestSequence.current) setLoadingMore(false);
      });
  };

  const handleFilterChange = (nextFilters) => {
    const categoryChanged = nextFilters.category_id !== filters.category_id;
    const updated = categoryChanged ? { ...nextFilters, system: '' } : nextFilters;
    setFilters(updated);
    setSearchParams(paramsFromFilters(updated), { replace: true });
  };

  const handleReset = () => {
    setFilters(emptyFilters);
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="container catalog-body" style={{ paddingTop: '40px' }}>
      <h1 className="section-title" style={{ marginBottom: '24px' }}>
        {t('nav.catalog')}
      </h1>

      <div>
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          brands={brands}
          categories={categories}
        />

        {loading && <LoadingSkeleton cards={8} />}
        {!loading && error && (
          <div className="empty-state">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => setRetryKey((value) => value + 1)}>
              {t('catalog.retry')}
            </button>
          </div>
        )}
        {!loading && !error && parts.length === 0 && (
          <div className="empty-state">{t('catalog.empty')}</div>
        )}

        <div className="part-grid">
          {parts.map((part, index) => (
            <PartCard key={part.id} part={part} priority={index === 0} />
          ))}
        </div>

        {hasMore && parts.length > 0 && (
          <div className="load-more-container">
            <button className="btn btn-primary" onClick={loadMore} disabled={loadingMore}>
              {loadingMore ? t('catalog.loadingMore') : t('catalog.loadMore')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
