// Ruta: src/types/index.ts

export type RolUsuario = 'Adulto Mayor' | 'Cuidador';
export type EstadoToma = 'Pendiente' | 'Confirmada' | 'Omitida';
export type EstadoCita = 'Programada' | 'Completada' | 'Cancelada';

export interface ContactoEmergencia {
    nombre_contacto: string;
    telefono: string;
    parentesco: string;
}

export interface Usuario {
    _id: string;
    nombre: string;
    correo: string;
    password_hash?: string; // Opcional en el frontend por seguridad
    rol: RolUsuario;
    cuidador_vinculado_id?: string;
    pin_vinculacion?: string;
    estado_activo: boolean;
    tokens_dispositivo: string[];
    contactos_emergencia: ContactoEmergencia[];
}

export interface Medicamento {
    _id: string;
    usuario_id: string;
    nombre_farmaco: string;
    dosis: string;
    frecuencia_horas: number;
    horarios_especificos: string[];
    fecha_eliminacion: string | null;
}

export interface RegistroToma {
    _id: string;
    medicamento_id: string;
    fecha_programada: string;
    estado_toma: EstadoToma;
    fecha_confirmacion: string | null;
}

export interface Cita {
    _id: string;
    usuario_id: string;
    titulo_evento: string;
    fecha_hora: string;
    ubicacion: string;
    estado: EstadoCita;
    fecha_eliminacion: string | null;
}

export interface NotaPersonal {
    _id: string;
    usuario_id: string;
    contenido: string;
    fecha_creacion: string;
    fecha_eliminacion: string | null;
}

export interface LogInteraccion {
    _id: string;
    usuario_id: string;
    premisa_entrada: string;
    respuesta_generada: string;
    bloqueo_medico: boolean;
    fecha_interaccion: string;
}