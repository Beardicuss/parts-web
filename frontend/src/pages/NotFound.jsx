import { Link } from 'react-router-dom';
import { useLang } from '../i18n/LangContext.jsx';

export default function NotFound() {
  const { t } = useLang();
  return (
    <div className="container empty-state" style={{ marginTop: 64 }}>
      <h1>{t('notFound.title')}</h1>
      <p>{t('notFound.description')}</p>
      <Link className="btn btn-primary" to="/">
        {t('notFound.home')}
      </Link>
    </div>
  );
}
