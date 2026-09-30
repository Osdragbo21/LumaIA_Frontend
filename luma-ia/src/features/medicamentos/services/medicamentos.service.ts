import axios from 'axios';
import type { Medicamento } from '../../../types';

const GRAPHQL_ENDPOINT = '/graphql';

// TODO: Reemplazar con el Query real cuando se proporcione el contrato
export const getMedicamentos = async (usuarioId: string): Promise<Medicamento[]> => {
  const query = `
    query GetMedicamentos($usuarioId: String!) {
      medicamentos(usuario_id: $usuarioId) {
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
    variables: { usuarioId },
  });

  if (response.data.errors) {
    throw new Error(response.data.errors[0].message || 'Error al obtener medicamentos');
  }

  return response.data.data.medicamentos || [];
};