// Ruta: src/features/red-apoyo/services/red-apoyo.service.ts

import axios from 'axios';
import { apiClient } from '../../../config/api.client';

export interface ContactoEmergencia {
  nombre_contacto: string;
  telefono: string;
  parentesco: string;
}

export interface PerfilUsuario {
  _id: string;
  nombre: string;
  correo: string;
  rol: string;
  contactos_emergencia: ContactoEmergencia[];
}

const handleGraphQLError = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.data?.errors) {
    throw new Error(error.response.data.errors[0].message);
  }
  throw error;
};

export const obtenerPerfil = async (usuarioId: string): Promise<PerfilUsuario> => {
  if (!usuarioId) throw new Error("ID de usuario no válido o sesión inactiva.");

  const query = `
    query ObtenerPerfil($usuario_id: ID!) {
      obtenerUsuario(usuario_id: $usuario_id) {
        _id
        nombre
        correo
        rol
        contactos_emergencia {
          nombre_contacto
          telefono
          parentesco
        }
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

    return response.data.data.obtenerUsuario;
  } catch (error) {
    handleGraphQLError(error);
    throw error;
  }
};

export interface AgregarContactoInput {
  usuario_id: string;
  nombre_contacto: string;
  telefono: string;
  parentesco: string;
}

export const agregarContacto = async (input: AgregarContactoInput): Promise<ContactoEmergencia[]> => {
  const mutation = `
    mutation AgregarContactoEmergencia($input: AgregarContactoInput!) {
      agregarContactoEmergencia(input: $input) {
        _id
        contactos_emergencia {
          nombre_contacto
          telefono
          parentesco
        }
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

    return response.data.data.agregarContactoEmergencia.contactos_emergencia;
  } catch (error) {
    handleGraphQLError(error);
    throw error;
  }
};