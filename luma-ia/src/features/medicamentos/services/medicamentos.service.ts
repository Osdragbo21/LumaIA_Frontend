// Ruta: src/features/medicamentos/services/medicamentos.service.ts

import { apiClient } from '../../../config/api.client';
import type { Medicamento } from '../../../types';

export const obtenerMedicamentos = async (usuarioId: string): Promise<Medicamento[]> => {
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

  // Usamos el apiClient que ya inyecta el JWT
  const response = await apiClient.post('', {
    query,
    variables: { usuario_id: usuarioId },
  });

  // Interceptamos explícitamente el array de errores de GraphQL
  if (response.data.errors) {
    throw new Error(response.data.errors[0].message || 'Error de autorización al obtener medicamentos');
  }

  return response.data.data.obtenerMedicamentosPorUsuario || [];
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

  // Usamos el apiClient que ya inyecta el JWT
  const response = await apiClient.post('', {
    query: mutation,
    variables: { input },
  });

  // Interceptamos explícitamente el array de errores de GraphQL
  if (response.data.errors) {
    throw new Error(response.data.errors[0].message || 'Error de autorización al crear medicamento');
  }

  return response.data.data.crearMedicamento;
};