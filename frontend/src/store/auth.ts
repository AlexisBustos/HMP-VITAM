import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasRole: (role: string) => boolean;
}

// Usuario demo pre-autenticado con rol ADMIN_GENERAL para acceso completo
const demoUser: User = {
  id: 1,
  email: 'admin@hmpvitam.com',
  firstName: 'Administrador',
  lastName: 'Sistema',
  role: 'ADMIN_GENERAL'
};

const demoToken = 'demo-token-hmp-vitam-2025';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Inicializar con usuario demo para permitir navegación completa
      user: demoUser,
      token: demoToken,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: demoUser, token: demoToken }), // Volver a demo en lugar de null
      isAuthenticated: () => {
        const { token } = get();
        return !!token;
      },
      hasRole: (role: string) => {
        const { user } = get();
        return user?.role === role;
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);

