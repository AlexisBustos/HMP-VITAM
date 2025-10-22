import { useAuthStore } from '../store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();

  // En modo demo, siempre permitir acceso
  if (!isAuthenticated()) {
    // Redirigir al dashboard en lugar de login
    return <>{children}</>;
  }

  return <>{children}</>;
};

