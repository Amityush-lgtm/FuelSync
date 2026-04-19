// ──────────────────────────────────────────────────────────
// src/components/auth/ProtectedRoute.jsx
// Redirects unauthenticated users to /login
// ──────────────────────────────────────────────────────────
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../ui';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader message="Authenticating…" />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return <Outlet />;
}
