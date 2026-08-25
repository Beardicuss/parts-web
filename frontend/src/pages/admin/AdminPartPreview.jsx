import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminNav from './AdminNav.jsx';
import PartDetailView from '../../components/PartDetailView.jsx';
import { api } from '../../api.js';
import { useLang } from '../../i18n/LangContext.jsx';

export default function AdminPartPreview() {
  const { id } = useParams();
  const { t } = useLang();
  const [part, setPart] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
    api
      .getAdminPart(id)
      .then(setPart)
      .catch(() => setError(true));
  }, [id]);

  return (
    <div className="admin-shell">
      <AdminNav />
      {error && <div className="container empty-state">{t('admin.preview.error')}</div>}
      {!error && !part && <div className="container empty-state">{t('catalog.loading')}</div>}
      {part && <PartDetailView part={part} returnTo={`/admin/parts/${id}`} preview />}
    </div>
  );
}
