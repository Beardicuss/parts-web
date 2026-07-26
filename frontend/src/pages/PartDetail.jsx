import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useLang } from '../i18n/LangContext.jsx';

export default function PartDetail() {
  const { id } = useParams();
  const { t, field } = useLang();
  const [part, setPart] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setPart(null);
    setNotFound(false);
    api
      .getPart(id)
      .then(setPart)
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="container">
        <Link to="/" className="back-link">
          ← {t('detail.back')}
        </Link>
        <div className="empty-state">{t('detail.notFound')}</div>
      </div>
    );
  }

  if (!part) return null;

  const brandName = part.brand_name_en ? field({ title_en: part.brand_name_en, title_ka: part.brand_name_ka }, 'title') : null;
  const categoryName = part.category_name_en ? field({ title_en: part.category_name_en, title_ka: part.category_name_ka }, 'title') : null;

  return (
    <div className="container">
      <Link to="/" className="back-link">
        ← {t('detail.back')}
      </Link>

      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-image-large">
            {part.image_path ? (
              <img src={part.image_path} alt={field(part, 'title')} />
            ) : (
              <span className="placeholder">No image</span>
            )}
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
            <button className="btn btn-primary btn-block detail-btn">
              {t('detail.contactUs')}
            </button>
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
                <span key={idx} className="model-badge">{model.trim()}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
