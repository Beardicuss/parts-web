import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // brief check of the existing session, avoids a login flash

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
}
