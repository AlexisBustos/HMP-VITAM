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

// Usuario demo pre-autenticado
const demoUser: User = {
  id: 1,
  email: 'admin@hmp.cl',
  firstName: 'Administrador',
  lastName: 'Demo',
  role: 'ADMIN_GENERAL'
};

const demoToken = 'demo-token-123';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: demoUser,
      token: demoToken,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
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

