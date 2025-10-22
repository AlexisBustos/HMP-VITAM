import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'ADMIN_GENERAL' | 'ADMIN_PRO_CLINICO' | 'PERSONA_NATURAL';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasRole: (...roles: Role[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      
      setAuth: (token: string, user: User) => {
        set({ token, user });
      },
      
      logout: () => {
        set({ token: null, user: null });
      },
      
      isAuthenticated: () => {
        return !!get().token;
      },
      
      hasRole: (...roles: Role[]) => {
        const user = get().user;
        return user ? roles.includes(user.role) : false;
      }
    }),
    {
      name: 'hmp-auth-storage'
    }
  )
);

