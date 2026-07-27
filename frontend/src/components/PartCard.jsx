import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../i18n/LangContext.jsx';
import SafeImage from './SafeImage.jsx';

function cardImage(part) {
  if (part.image_thumbnail_path) return part.image_thumbnail_path;
  if (part.image_path?.startsWith('/parts/')) {
    return part.image_path.replace('/parts/', '/parts/thumbs/');
  }
  return part.image_path;
}

export default function PartCard({ part, priority = false }) {
  const { field } = useLang();
  const location = useLocation();
  const returnTo =
    location.pathname === '/catalog' ? `${location.pathname}${location.search}` : null;

  return (
    <Link
      to={`/parts/${part.id}`}
      state={returnTo ? { returnTo } : undefined}
      className="part-card"
    >
      <div className="part-card-image">
        <SafeImage
          src={cardImage(part)}
          alt={field(part, 'title')}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          width="640"
          height="480"
          sizes="(max-width: 640px) 50vw, (max-width: 900px) 33vw, 280px"
        />
      </div>
      <div className="part-card-body">
        <span className="part-code">{part.code}</span>
        <span className="part-title">{field(part, 'title')}</span>
        <div className="part-meta">
          {part.brand_name_en && (
            <span className="tag">
              {field({ title_en: part.brand_name_en, title_ka: part.brand_name_ka }, 'title')}
            </span>
          )}
          {part.category_name_en && (
            <span className="tag">
              {field({ title_en: part.category_name_en, title_ka: part.category_name_ka }, 'title')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
