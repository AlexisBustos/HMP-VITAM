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
  patientId?: string; // For PERSON role users
}

interface AuthState {
  user: User | null;
  token: string | null;
  mustAcceptConsent: boolean;
  setAuth: (user: User, token: string, mustAcceptConsent?: boolean) => void;
  setMustAcceptConsent: (value: boolean) => void;
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
      mustAcceptConsent: false,
      setAuth: (user, token, mustAcceptConsent = false) => set({ user, token, mustAcceptConsent }),
      setMustAcceptConsent: (value) => set({ mustAcceptConsent: value }),
      logout: () => set({ user: null, token: null, mustAcceptConsent: false }),
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

