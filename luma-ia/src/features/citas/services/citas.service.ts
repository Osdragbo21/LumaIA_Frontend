// Ruta: src/features/citas/services/citas.service.ts

import axios from 'axios';
import { apiClient } from '../../../config/api.client';
import type { Cita } from '../../../types';

// Utilidad para interceptar errores de GraphQL
const handleGraphQLError = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.data?.errors) {
    throw new Error(error.response.data.errors[0].message);
  }
  throw error;
};

export const obtenerCitas = async (usuarioId: string): Promise<Cita[]> => {
  if (!usuarioId) throw new Error("Sesión inactiva.");

  const query = `
    query ObtenerCitas($usuario_id: ID!) {
      obtenerCitasPorUsuario(usuario_id: $usuario_id) {
        _id
        titulo_evento
        fecha_hora
        ubicacion
        estado
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

    return response.data.data.obtenerCitasPorUsuario || [];
  } catch (error) {
    handleGraphQLError(error);
    return []; 
  }
};

export interface CreateCitaInput {
  usuario_id: string;
  titulo_evento: string;
  fecha_hora: string; // Formato ISO-8601 exigido
  ubicacion?: string;
}

export const crearCita = async (input: CreateCitaInput): Promise<Cita> => {
  const mutation = `
    mutation CrearCita($input: CreateCitaInput!) {
      crearCita(createCitaInput: $input) {
        _id
        titulo_evento
        fecha_hora
        ubicacion
        estado
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

    return response.data.data.crearCita;
  } catch (error) {
    handleGraphQLError(error);
    throw error; 
  }
};