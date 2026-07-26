import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useLang } from '../i18n/LangContext.jsx';
import PartCard from '../components/PartCard.jsx';

export default function Home() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [featuredParts, setFeaturedParts] = useState([]);

  useEffect(() => {
    // Fetch just a few parts to populate the main page so it's not a desert
    api.getParts({ search: '', brand_id: '', category_id: '' }, 1, 8).then((data) => {
      setFeaturedParts(data);
    });
  }, []);

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

      <div className="container catalog-body" style={{ paddingTop: '60px', paddingBottom: '80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <span className="section-eyebrow">{t('home.featuredEyebrow')}</span>
            <h2 className="section-title">{t('home.featuredTitle')}</h2>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/catalog')}
          >
            {t('nav.viewCatalog')}
          </button>
        </div>

        <div className="part-grid">
          {featuredParts.map((part) => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>
      </div>
    </>
  );
}
