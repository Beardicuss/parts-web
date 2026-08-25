import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { API_ERROR_CODES } from '../apiErrors.js';
import PartDetailView from '../components/PartDetailView.jsx';
import { useLang } from '../i18n/LangContext.jsx';

export default function PartDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { t } = useLang();
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
  return <PartDetailView part={part} returnTo={returnTo} />;
}
