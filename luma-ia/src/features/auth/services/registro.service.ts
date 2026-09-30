// Ruta: src/features/auth/services/registro.service.ts

import axios from 'axios';
import { apiClient } from '../../../config/api.client';

export interface CreateUsuarioInput {
  nombre: string;
  correo: string;
  password: string; // Se envía en texto plano según RNF-06
  rol: string;
}

const handleGraphQLError = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.data?.errors) {
    throw new Error(error.response.data.errors[0].message);
  }
  throw error;
};

export const registrarUsuario = async (input: CreateUsuarioInput) => {
  const mutation = `
    mutation RegistrarUsuario($input: CreateUsuarioInput!) {
      registrarUsuario(input: $input) {
        _id
        nombre
        correo
        rol
        estado_activo
      }
    }
  `;

  try {
    const response = await apiClient.post('', {
      query: mutation,
      variables: { input },
    });

    if (response.data.errors && response.data.errors.length > 0) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.registrarUsuario;
  } catch (error) {
    handleGraphQLError(error);
    throw error;
  }
};