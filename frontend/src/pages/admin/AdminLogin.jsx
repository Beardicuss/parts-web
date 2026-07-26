import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { useLang } from '../../i18n/LangContext.jsx';

export default function AdminLogin() {
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch {
      setError(t('admin.login.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>{t('admin.login.title')}</h1>
        <div className="field">
          <label>{t('admin.login.username')}</label>
          <input
            className="input input-lg"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            required
          />
        </div>
        <div className="field">
          <label>{t('admin.login.password')}</label>
          <input
            className="input input-lg"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-text">{error}</div>}
        <button className="btn btn-primary btn-lg" type="submit" disabled={submitting} style={{ width: '100%', marginTop: 8 }}>
          {t('admin.login.submit')}
        </button>
      </form>
    </div>
  );
}
