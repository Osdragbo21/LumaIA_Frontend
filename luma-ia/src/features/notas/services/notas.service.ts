// Ruta: src/features/notas/services/notas.service.ts

import axios from 'axios';
import { apiClient } from '../../../config/api.client';

export interface NotaPersonal {
  _id: string;
  usuario_id: string;
  contenido: string;
  fecha_creacion: string;
}

const handleGraphQLError = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.data?.errors) {
    throw new Error(error.response.data.errors[0].message);
  }
  throw error;
};

export const obtenerNotas = async (usuarioId: string): Promise<NotaPersonal[]> => {
  if (!usuarioId) throw new Error("Sesión inactiva.");

  const query = `
    query ObtenerNotas($usuario_id: ID!) {
      obtenerNotasPorUsuario(usuario_id: $usuario_id) {
        _id
        usuario_id
        contenido
        fecha_creacion
      }
    }
  `;

  try {
    const response = await apiClient.post('', {
      query,
      variables: { usuario_id: usuarioId },
    });

    if (response.data.errors && response.data.errors.length > 0) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.obtenerNotasPorUsuario || [];
  } catch (error) {
    handleGraphQLError(error);
    return [];
  }
};

export interface CreateNotaInput {
  usuario_id: string;
  contenido: string;
}

export const crearNota = async (input: CreateNotaInput): Promise<NotaPersonal> => {
  const mutation = `
    mutation CrearNota($input: CreateNotaInput!) {
      crearNota(createNotaInput: $input) {
        _id
        usuario_id
        contenido
        fecha_creacion
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

    return response.data.data.crearNota;
  } catch (error) {
    handleGraphQLError(error);
    throw error;
  }
};