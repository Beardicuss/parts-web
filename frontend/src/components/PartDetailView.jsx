import { Link } from 'react-router-dom';
import SafeImage from './SafeImage.jsx';
import { useLang } from '../i18n/LangContext.jsx';

export default function PartDetailView({ part, returnTo = '/catalog', preview = false }) {
  const { t, field } = useLang();
  const whatsappUrl = `https://wa.me/995597969017?text=${encodeURIComponent(
    t('detail.whatsappMessage').replace('{code}', part.code)
  )}`;
  const brandName = part.brand_name_en
    ? field({ title_en: part.brand_name_en, title_ka: part.brand_name_ka }, 'title')
    : null;
  const categoryName = part.category_name_en
    ? field({ title_en: part.category_name_en, title_ka: part.category_name_ka }, 'title')
    : null;
  const structuredModels = part.vehicle_models || [];
  const structuredModelLabels = structuredModels.map((model) =>
    [model.model_name, model.chassis_code].filter(Boolean).join(' ')
  );
  const freeModelLabels = (part.compatible_models || '')
    .split(',')
    .map((model) => model.trim())
    .filter(
      (model) =>
        model &&
        !structuredModelLabels.some(
          (structured) => structured.toLowerCase() === model.toLowerCase()
        )
    );

  return (
    <div className="container">
      {preview && (
        <div className="admin-preview-banner" role="status">
          <strong>{t('admin.preview.banner')}</strong>
          <span>{t(`admin.status.${part.publication_status || 'draft'}`)}</span>
        </div>
      )}
      <Link to={returnTo} className="back-link">
        ← {preview ? t('admin.preview.back') : t('detail.back')}
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

          {!preview && (
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
          )}
        </div>
      </div>

      <div className="detail-bottom-section">
        {field(part, 'description') && (
          <div className="detail-tab-content">
            <h2 className="detail-section-title">{t('detail.descriptionTitle')}</h2>
            <p className="detail-description-text">{field(part, 'description')}</p>
          </div>
        )}

        {(structuredModels.length > 0 || freeModelLabels.length > 0) && (
          <div className="detail-tab-content">
            <h2 className="detail-section-title">{t('detail.compatibleModels')}</h2>
            <div className="detail-models-list">
              {structuredModels.map((model, index) => (
                <span key={model.id} className="model-badge">
                  {structuredModelLabels[index]}
                </span>
              ))}
              {freeModelLabels.map((model) => (
                <span key={`free:${model}`} className="model-badge">
                  {model}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
