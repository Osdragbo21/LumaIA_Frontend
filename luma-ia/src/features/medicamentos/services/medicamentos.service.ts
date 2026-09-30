// Ruta: src/features/medicamentos/services/medicamentos.service.ts

import axios from 'axios';
import type { Medicamento } from '../../../types';

const GRAPHQL_ENDPOINT = '/graphql';

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

  const response = await axios.post(GRAPHQL_ENDPOINT, {
    query,
    variables: { usuario_id: usuarioId },
  });

  if (response.data.errors) throw new Error(response.data.errors[0].message);
  return response.data.data.obtenerMedicamentosPorUsuario;
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
        nombre_farmaco
        dosis
        frecuencia_horas
        horarios_especificos
      }
    }
  `;

  const response = await axios.post(GRAPHQL_ENDPOINT, {
    query: mutation,
    variables: { input },
  });

  if (response.data.errors) throw new Error(response.data.errors[0].message);
  return response.data.data.crearMedicamento;
};