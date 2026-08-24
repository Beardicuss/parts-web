import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient.js';
import { useLang } from '../../i18n/LangContext.jsx';
import { useAuth } from './AuthContext.jsx';
import AdminAuthHeader from './AdminAuthHeader.jsx';

export default function AdminMfa() {
  const { t } = useLang();
  const { isAuthenticated, isAdmin, mfaStatus, loading, logout, refreshAuthorization } = useAuth();
  const navigate = useNavigate();
  const [factorId, setFactorId] = useState('');
  const [secret, setSecret] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAdmin || mfaStatus === 'enroll') return;
    supabase.auth.mfa.listFactors().then(({ data, error: listError }) => {
      if (listError) {
        setError(t('admin.mfa.error'));
        return;
      }
      const verifiedFactor = (data?.totp ?? []).find((factor) => factor.status === 'verified');
      if (verifiedFactor) setFactorId(verifiedFactor.id);
    });
  }, [isAdmin, mfaStatus, t]);

  if (loading) return null;
  if (!isAuthenticated || !isAdmin) return <Navigate to="/admin/login" replace />;
  if (mfaStatus === 'verified') return <Navigate to="/admin" replace />;

  const enroll = async () => {
    setSubmitting(true);
    setError('');

    const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (factorsError) {
      setSubmitting(false);
      setError(`${t('admin.mfa.error')} (${factorsError.code || 'list_factors_failed'})`);
      return;
    }

    for (const factor of factors?.all ?? []) {
      if (factor.factor_type !== 'totp' || factor.status !== 'unverified') continue;
      const { error: cleanupError } = await supabase.auth.mfa.unenroll({
        factorId: factor.id
      });
      if (cleanupError) {
        setSubmitting(false);
        setError(`${t('admin.mfa.error')} (${cleanupError.code || 'factor_cleanup_failed'})`);
        return;
      }
    }

    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: `Parts Catalog Admin ${Date.now()}`
    });
    setSubmitting(false);
    if (enrollError) {
      setError(`${t('admin.mfa.error')} (${enrollError.code || 'enrollment_failed'})`);
      return;
    }
    setFactorId(data.id);
    setSecret(data.totp.secret);
  };

  const verify = async (event) => {
    event.preventDefault();
    if (!factorId || !/^\d{6}$/.test(code)) {
      setError(t('admin.mfa.codeError'));
      return;
    }

    setSubmitting(true);
    setError('');
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId
    });
    if (challengeError) {
      setSubmitting(false);
      setError(`${t('admin.mfa.error')} (${challengeError.code || 'mfa_challenge_failed'})`);
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code
    });
    if (verifyError) {
      setSubmitting(false);
      setError(`${t('admin.mfa.codeError')} (${verifyError.code || 'mfa_verification_failed'})`);
      return;
    }

    await refreshAuthorization();
    setSubmitting(false);
    navigate('/admin', { replace: true });
  };

  const cancel = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-shell">
      <AdminAuthHeader />
      <div className="container">
        <form className="login-card" onSubmit={verify}>
          <h1>{t('admin.mfa.title')}</h1>
          <p>{t(mfaStatus === 'enroll' ? 'admin.mfa.enrollHelp' : 'admin.mfa.challengeHelp')}</p>

          {mfaStatus === 'enroll' && !factorId && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={enroll}
              disabled={submitting}
            >
              {t('admin.mfa.setup')}
            </button>
          )}

          {secret && (
            <div className="field">
              <label>{t('admin.mfa.secret')}</label>
              <code
                className="input input-lg"
                style={{ display: 'block', overflowWrap: 'anywhere' }}
              >
                {secret}
              </code>
            </div>
          )}

          {(factorId || mfaStatus === 'challenge') && (
            <div className="field">
              <label htmlFor="admin-mfa-code">{t('admin.mfa.code')}</label>
              <input
                id="admin-mfa-code"
                className="input input-lg"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
                required
                autoFocus
              />
            </div>
          )}

          {error && (
            <div className="error-text" role="alert">
              {error}
            </div>
          )}

          {(factorId || mfaStatus === 'challenge') && (
            <button
              className="btn btn-primary btn-lg"
              type="submit"
              disabled={submitting || !factorId}
              style={{ width: '100%' }}
            >
              {submitting ? t('admin.mfa.verifying') : t('admin.mfa.verify')}
            </button>
          )}
          <button
            className="btn btn-outline"
            type="button"
            onClick={cancel}
            style={{ width: '100%', marginTop: 8 }}
          >
            {t('admin.form.cancel')}
          </button>
        </form>
      </div>
    </div>
  );
}
