import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[]; // If specified, user must have at least one of these roles
  requirePerson?: boolean; // If true, only PERSON role can access
}

export const ProtectedRoute = ({ children, roles, requirePerson }: ProtectedRouteProps) => {
  const { isAuthenticated, user, hasAnyRole } = useAuthStore();

  // Check if user is authenticated
  if (!isAuthenticated() || !user) {
    return <Navigate to="/login" replace />;
  }

  // If requirePerson is true, only allow PERSON role
  if (requirePerson) {
    if (!user.roles.includes('PERSON')) {
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  }

  // If roles are specified, check if user has any of them
  if (roles && roles.length > 0) {
    if (!hasAnyRole(roles)) {
      // User doesn't have required roles
      // Redirect PERSON to their own area
      if (user.roles.includes('PERSON')) {
        return <Navigate to="/mi-ficha" replace />;
      }
      // Redirect others to dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

