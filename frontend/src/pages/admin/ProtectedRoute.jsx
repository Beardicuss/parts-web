import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isAdmin, mfaStatus, loading, sessionExpired } = useAuth();

  if (loading) return null; // brief check of the existing session, avoids a login flash

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ sessionExpired }} />;
  }
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  if (mfaStatus !== 'verified') return <Navigate to="/admin/mfa" replace />;
  return children;
}
