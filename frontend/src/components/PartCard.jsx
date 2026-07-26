import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext.jsx';

export default function PartCard({ part }) {
  const { field } = useLang();

  return (
    <Link to={`/parts/${part.id}`} className="part-card">
      <div className="part-card-image">
        {part.image_path ? (
          <img src={part.image_path} alt={field(part, 'title')} loading="lazy" />
        ) : (
          <span className="placeholder">No image</span>
        )}
      </div>
      <div className="part-card-body">
        <span className="part-code">{part.code}</span>
        <span className="part-title">{field(part, 'title')}</span>
        <div className="part-meta">
          {part.brand_name_en && <span className="tag">{field({ title_en: part.brand_name_en, title_ka: part.brand_name_ka }, 'title')}</span>}
          {part.category_name_en && (
            <span className="tag">{field({ title_en: part.category_name_en, title_ka: part.category_name_ka }, 'title')}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
