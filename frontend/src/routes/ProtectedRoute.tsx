import { Navigate } from 'react-router-dom';
import { useAuthStore, Role } from '../store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Role[];
}

export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, hasRole } = useAuthStore();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !hasRole(...roles)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

