// Ruta: src/features/auth/services/auth.service.ts

import axios from 'axios';
import type { Enum_Rol } from '../../../types';

const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';

export interface LoginResponse {
  access_token: string;
  usuario_id: string;
  rol: Enum_Rol;
}

// Transformador: GraphQL (MAYÚSCULAS) -> Frontend (Legible)
const mapGraphQLRoleToEnum = (gqlRole: string): Enum_Rol => {
  if (gqlRole === 'ADULTO_MAYOR') return 'Adulto Mayor';
  if (gqlRole === 'CUIDADOR') return 'Cuidador';
  return 'Adulto Mayor'; // Fallback de seguridad
};

export const loginMutation = async (correo: string, password: string): Promise<LoginResponse> => {
  const query = `
    mutation Login($correo: String!, $password: String!) {
      login(correo: $correo, password: $password) {
        access_token
        usuario_id
        rol
      }
    }
  `;

  const response = await axios.post(GRAPHQL_ENDPOINT, {
    query,
    variables: { correo, password },
  });

  if (response.data.errors) {
    throw new Error(response.data.errors[0].message || 'Credenciales incorrectas');
  }

  const data = response.data.data.login;
  
  return {
    access_token: data.access_token,
    usuario_id: data.usuario_id,
    rol: mapGraphQLRoleToEnum(data.rol),
  };
};