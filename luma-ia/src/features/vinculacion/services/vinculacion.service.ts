// Ruta: src/features/vinculacion/services/vinculacion.service.ts

import axios from 'axios';
import { apiClient } from '../../../config/api.client';

const handleGraphQLError = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.data?.errors) {
    throw new Error(error.response.data.errors[0].message);
  }
  throw error;
};

// Función para el Adulto Mayor
export const generarPin = async (usuarioId: string): Promise<string> => {
  if (!usuarioId) throw new Error("Sesión inactiva.");

  const mutation = `
    mutation GenerarPinVinculacion($usuario_id: ID!) {
      generarPinVinculacion(usuario_id: $usuario_id)
    }
  `;

  try {
    const response = await apiClient.post('', {
      query: mutation,
      variables: { usuario_id: usuarioId },
    });

    if (response.data.errors?.length > 0) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.generarPinVinculacion;
  } catch (error) {
    handleGraphQLError(error);
    throw error;
  }
};

export interface VincularInput {
  cuidador_id: string;
  pin: string;
}

// Función para el Cuidador
export const vincularCuidador = async (input: VincularInput) => {
  const mutation = `
    mutation VincularCuidador($input: VincularCuidadorInput!) {
      vincularCuidador(input: $input) {
        _id
        nombre
        rol
        cuidador_vinculado_id
      }
    }
  `;

  try {
    const response = await apiClient.post('', {
      query: mutation,
      variables: { input },
    });

    if (response.data.errors?.length > 0) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.vincularCuidador;
  } catch (error) {
    handleGraphQLError(error);
    throw error;
  }
};