// Ruta: src/config/api.client.ts

import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const apiClient = axios.create({
  baseURL: '/graphql', // Usamos el proxy de Vite configurado previamente
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el JWT automáticamente según RF-03.1[cite: 27]
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});