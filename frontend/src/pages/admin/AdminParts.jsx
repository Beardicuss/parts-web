import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api.js';
import { useLang } from '../../i18n/LangContext.jsx';
import { useToast } from '../../components/ToastContext.jsx';
import AdminNav from './AdminNav.jsx';

export default function AdminParts() {
  const { t, field } = useLang();
  const { showToast } = useToast();
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadParts = () => {
    setLoading(true);
    api
      .getParts()
      .then(setParts)
      .finally(() => setLoading(false));
  };

  useEffect(loadParts, []);

  const handleDelete = async (part) => {
    if (!window.confirm(t('admin.deleteConfirm'))) return;
    try {
      await api.deletePart(part.id);
      showToast(t('toast.deleted'));
      loadParts();
    } catch {
      showToast(t('toast.error'), 'error');
    }
  };

  const visibleParts = parts.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.code.toLowerCase().includes(q) ||
      p.title_en.toLowerCase().includes(q) ||
      p.title_ka.toLowerCase().includes(q)
    );
  });

  return (
    <div className="admin-shell">
      <AdminNav />
      <div className="container" style={{ paddingTop: 32 }}>
        <div className="toolbar">
          <h1 className="page-title" style={{ margin: 0 }}>
            {t('admin.parts.title')}
          </h1>
          <Link to="/admin/parts/new" className="btn btn-primary btn-lg">
            {t('admin.parts.add')}
          </Link>
        </div>

        <input
          className="input"
          style={{ maxWidth: 360, marginBottom: 24 }}
          placeholder={t('admin.parts.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {!loading && visibleParts.length === 0 && (
          <div className="empty-state">{t('admin.parts.empty')}</div>
        )}

        <div className="admin-part-grid">
          {visibleParts.map((part) => (
            <div className="admin-part-card" key={part.id}>
              <div className="admin-part-card-image">
                {part.image_path ? (
                  <img src={part.image_path} alt={field(part, 'title')} />
                ) : (
                  <span className="placeholder">{t('admin.parts.noImage')}</span>
                )}
              </div>
              <div className="admin-part-card-body">
                <span className="part-code">{part.code}</span>
                <span className="part-title">{field(part, 'title')}</span>
                <div className="part-meta">
                  {part.brand_name_en && <span className="tag">{part.brand_name_en}</span>}
                  {part.category_name_en && <span className="tag">{part.category_name_en}</span>}
                </div>
                <div className="admin-actions" style={{ marginTop: 12 }}>
                  <Link to={`/admin/parts/${part.id}`} className="btn btn-outline btn-lg" style={{ flex: 1 }}>
                    {t('admin.edit')}
                  </Link>
                  <button className="btn btn-danger btn-lg" onClick={() => handleDelete(part)}>
                    {t('admin.delete')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
