// Ruta: src/store/useAuthStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Usuario } from '../types';

interface AuthState {
    token: string | null;
    user: Usuario | null;
    isAuthenticated: boolean;
    login: (token: string, user: Usuario) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
        token: null,
        user: null,
        isAuthenticated: false,
        login: (token, user) => set({ token, user, isAuthenticated: true }),
        logout: () => set({ token: null, user: null, isAuthenticated: false }),
        }),
        {
        name: 'luma-auth-storage', // Nombre de la clave en localStorage
        }
    )
);