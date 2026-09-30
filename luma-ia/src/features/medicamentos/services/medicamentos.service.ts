// Ruta: src/features/medicamentos/services/medicamentos.service.ts

import axios from 'axios';
import { apiClient } from '../../../config/api.client';
import type { Medicamento } from '../../../types';

// Utilidad para interceptar errores de GraphQL (Simulando el comportamiento de Apollo)
const handleGraphQLError = (error: unknown) => {
  // Si el backend responde con un HTTP 400/500 pero incluye el array de GraphQL
  if (axios.isAxiosError(error) && error.response?.data?.errors) {
    throw new Error(error.response.data.errors[0].message);
  }
  // Si es un error de red puro
  throw error;
};

export const obtenerMedicamentos = async (usuarioId: string): Promise<Medicamento[]> => {
  if (!usuarioId) throw new Error("No hay una sesión activa para consultar medicamentos.");

  const query = `
    query ObtenerMedicamentos($usuario_id: ID!) {
      obtenerMedicamentosPorUsuario(usuario_id: $usuario_id) {
        _id
        nombre_farmaco
        dosis
        frecuencia_horas
        horarios_especificos
      }
    }
  `;

  try {
    const response = await apiClient.post('', {
      query,
      variables: { usuario_id: usuarioId },
    });

    // Si el backend devuelve HTTP 200 pero incluye errores lógicos de GraphQL
    if (response.data.errors && response.data.errors.length > 0) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.obtenerMedicamentosPorUsuario || [];
  } catch (error) {
    handleGraphQLError(error);
    return []; // Satisfacer la firma de TypeScript, aunque el throw cortará la ejecución antes
  }
};

export interface CreateMedicamentoInput {
  usuario_id: string;
  nombre_farmaco: string;
  dosis: string;
  frecuencia_horas?: number;
  horarios_especificos: string[];
}

export const crearMedicamento = async (input: CreateMedicamentoInput): Promise<Medicamento> => {
  const mutation = `
    mutation CrearMedicamento($input: CreateMedicamentoInput!) {
      crearMedicamento(createMedicamentoInput: $input) {
        _id
        usuario_id
        nombre_farmaco
        dosis
        frecuencia_horas
        horarios_especificos
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

    return response.data.data.crearMedicamento;
  } catch (error) {
    handleGraphQLError(error);
    throw error; // Obligatorio lanzar el error para que React Query dispare el estado isError en la UI
  }
};