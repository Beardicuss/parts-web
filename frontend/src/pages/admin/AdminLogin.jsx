import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { useLang } from '../../i18n/LangContext.jsx';
import AdminAuthHeader from './AdminAuthHeader.jsx';

export default function AdminLogin() {
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const authorization = await login(email, password);
      navigate(authorization.mfaStatus === 'verified' ? '/admin' : '/admin/mfa');
    } catch {
      setError(t('admin.login.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-shell">
      <AdminAuthHeader />
      <div className="container">
        <form className="login-card" onSubmit={handleSubmit}>
          <h1>{t('admin.login.title')}</h1>
          {location.state?.sessionExpired && (
            <div className="error-text" role="alert">
              {t('admin.sessionExpired')}
            </div>
          )}
          <div className="field">
            <label htmlFor="admin-email">{t('admin.login.username')}</label>
            <input
              id="admin-email"
              className="input input-lg"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="field">
            <label htmlFor="admin-password">{t('admin.login.password')}</label>
            <input
              id="admin-password"
              className="input input-lg"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="error-text" role="alert">
              {error}
            </div>
          )}
          <button
            className="btn btn-primary btn-lg"
            type="submit"
            disabled={submitting}
            style={{ width: '100%', marginTop: 8 }}
          >
            {t('admin.login.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
