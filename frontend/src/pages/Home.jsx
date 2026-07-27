import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useLang } from '../i18n/LangContext.jsx';
import PartCard from '../components/PartCard.jsx';
import HomeCategoryGrid from '../components/HomeCategoryGrid.jsx';
import ServicesPromo from '../components/ServicesPromo.jsx';
import LoadingSkeleton from '../components/LoadingSkeleton.jsx';

export default function Home() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [featuredParts, setFeaturedParts] = useState([]);
  const [featuredState, setFeaturedState] = useState('loading');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    api
      .getLatestParts(8)
      .then((data) => {
        setFeaturedParts(data);
        setFeaturedState(data.length ? 'success' : 'empty');
      })
      .catch(() => setFeaturedState('error'));
  }, [retryKey]);

  return (
    <>
      <div className="catalog-hero">
        <div className="container">
          <span className="hero-eyebrow">{t('catalog.eyebrow')}</span>
          <h1 className="hero-title">{t('catalog.title')}</h1>
          <p className="hero-subtitle">{t('catalog.subtitle')}</p>
        </div>
        <div className="hero-beam" aria-hidden="true" />
      </div>

      <HomeCategoryGrid />

      <div className="container catalog-body" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px'
          }}
        >
          <div>
            <span className="section-eyebrow">{t('home.featuredEyebrow')}</span>
            <h2 className="section-title">{t('home.featuredTitle')}</h2>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/catalog')}>
            {t('nav.viewCatalog')}
          </button>
        </div>

        {featuredState === 'loading' && <LoadingSkeleton cards={8} />}
        {featuredState === 'error' && (
          <div className="empty-state">
            <p>{t('catalog.loadError')}</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setFeaturedState('loading');
                setRetryKey((value) => value + 1);
              }}
            >
              {t('catalog.retry')}
            </button>
          </div>
        )}
        {featuredState === 'empty' && <div className="empty-state">{t('catalog.empty')}</div>}
        <div className="part-grid">
          {featuredParts.map((part, index) => (
            <PartCard key={part.id} part={part} priority={index === 0} />
          ))}
        </div>
      </div>

      <ServicesPromo />
    </>
  );
}
