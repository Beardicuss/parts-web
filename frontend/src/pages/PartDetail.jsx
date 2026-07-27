import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { API_ERROR_CODES } from '../apiErrors.js';
import SafeImage from '../components/SafeImage.jsx';
import { useLang } from '../i18n/LangContext.jsx';

export default function PartDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { t, field } = useLang();
  const [part, setPart] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setPart(null);
    setNotFound(false);
    setError(false);
    api
      .getPart(id)
      .then(setPart)
      .catch((requestError) => {
        if (requestError.code === API_ERROR_CODES.NOT_FOUND) setNotFound(true);
        else setError(true);
      });
  }, [id, retryKey]);

  if (notFound) {
    return (
      <div className="container">
        <Link to="/catalog" className="back-link">
          ← {t('detail.back')}
        </Link>
        <div className="empty-state">{t('detail.notFound')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="empty-state">
          <p>{t('catalog.loadError')}</p>
          <button className="btn btn-primary" onClick={() => setRetryKey((value) => value + 1)}>
            {t('catalog.retry')}
          </button>
        </div>
      </div>
    );
  }

  if (!part) return <div className="container empty-state">{t('catalog.loading')}</div>;

  const returnTo = location.state?.returnTo || '/catalog';
  const whatsappUrl = `https://wa.me/995597969017?text=${encodeURIComponent(
    t('detail.whatsappMessage').replace('{code}', part.code)
  )}`;
  const brandName = part.brand_name_en
    ? field({ title_en: part.brand_name_en, title_ka: part.brand_name_ka }, 'title')
    : null;
  const categoryName = part.category_name_en
    ? field({ title_en: part.category_name_en, title_ka: part.category_name_ka }, 'title')
    : null;

  return (
    <div className="container">
      <Link to={returnTo} className="back-link">
        ← {t('detail.back')}
      </Link>

      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-image-large">
            <SafeImage
              src={part.image_path}
              alt={field(part, 'title')}
              loading="eager"
              fetchPriority="high"
              width="1200"
              height="900"
              sizes="(max-width: 900px) 100vw, 58vw"
            />
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="detail-header">
            {brandName && <div className="detail-brand">{brandName}</div>}
            <h1 className="detail-title-large">{field(part, 'title')}</h1>
          </div>

          <div className="detail-info-block">
            <div className="info-label">{t('detail.originalCode')}</div>
            <div className="info-value primary-code">{part.code}</div>
          </div>

          {part.replacement_codes && (
            <div className="detail-info-block">
              <div className="info-label">{t('detail.replacementCodes')}</div>
              <div className="info-value secondary-codes">{part.replacement_codes}</div>
            </div>
          )}

          {categoryName && (
            <div className="detail-info-block">
              <div className="info-label">{t('detail.category')}</div>
              <div className="info-value">{categoryName}</div>
            </div>
          )}

          <div className="detail-actions">
            <a
              className="btn btn-primary btn-block detail-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('detail.contactUs')}
            </a>
          </div>
        </div>
      </div>

      <div className="detail-bottom-section">
        {field(part, 'description') && (
          <div className="detail-tab-content">
            <h2 className="detail-section-title">{t('detail.descriptionTitle')}</h2>
            <p className="detail-description-text">{field(part, 'description')}</p>
          </div>
        )}

        {part.compatible_models && (
          <div className="detail-tab-content">
            <h2 className="detail-section-title">{t('detail.compatibleModels')}</h2>
            <div className="detail-models-list">
              {part.compatible_models.split(',').map((model, idx) => (
                <span key={idx} className="model-badge">
                  {model.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
