// Ruta: src/features/notas/services/notas.service.ts

import axios from 'axios';
import { apiClient } from '../../../config/api.client';

export interface NotaPersonal {
  _id: string;
  contenido: string;
  fecha_creacion: string;
}

// Utilidad para interceptar errores de GraphQL
const handleGraphQLError = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.data?.errors) {
    throw new Error(error.response.data.errors[0].message);
  }
  throw error;
};

export const obtenerNotas = async (usuarioId: string): Promise<NotaPersonal[]> => {
  if (!usuarioId) throw new Error("Sesión inactiva.");

  // Query exacta proporcionada por el backend
  const query = `
    query ObtenerNotasPersonales($usuario_id: ID!) {
      obtenerNotasPersonalesPorUsuario(usuario_id: $usuario_id) {
        _id
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

    return response.data.data.obtenerNotasPersonalesPorUsuario || [];
  } catch (error) {
    handleGraphQLError(error);
    return [];
  }
};

export interface CreateNotaInput {
  usuario_id: string;
  contenido: string;
  fecha_creacion: string; // Exigido por el nuevo contrato
}

export const crearNota = async (input: CreateNotaInput): Promise<NotaPersonal> => {
  // Mutation exacta proporcionada por el backend
  const mutation = `
    mutation CrearNotaPersonal($input: CreateNotaPersonalInput!) {
      crearNotaPersonal(createNotaPersonalInput: $input) {
        _id
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

    return response.data.data.crearNotaPersonal;
  } catch (error) {
    handleGraphQLError(error);
    throw error;
  }
};