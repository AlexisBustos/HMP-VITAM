import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  rut?: string;
  roles: string[];
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Iniciar sin usuario (requiere login)
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      isAuthenticated: () => {
        const { token } = get();
        return !!token;
      },
      hasRole: (role: string) => {
        const { user } = get();
        return user?.roles?.includes(role) || false;
      },
      hasAnyRole: (roles: string[]) => {
        const { user } = get();
        return roles.some(role => user?.roles?.includes(role)) || false;
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);

