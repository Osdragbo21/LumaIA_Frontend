// Ruta: src/features/citas/components/FormularioCita.tsx

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { crearCita } from '../services/citas.service';
import { Loader2, AlertCircle } from 'lucide-react';

interface Props {
  usuarioId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const FormularioCita = ({ usuarioId, onClose, onSuccess }: Props) => {
  const queryClient = useQueryClient();
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  const mutation = useMutation({
    mutationFn: () => {
      // Combinar fecha y hora local en formato ISO-8601[cite: 27]
      const fechaHoraISO = new Date(`${fecha}T${hora}:00`).toISOString();
      return crearCita({
        usuario_id: usuarioId,
        titulo_evento: titulo,
        fecha_hora: fechaHoraISO,
        ubicacion: ubicacion || undefined,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['citas', usuarioId] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !fecha || !hora) return;
    mutation.mutate();
  };

  const isPending = mutation.isPending;

  return (
    <div className="fixed inset-0 bg-text/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-extrabold text-text mb-6 text-center">Nueva Cita</h2>
        
        {mutation.isError && (
          <div className="bg-sos/10 border-l-4 border-sos p-4 rounded-xl flex items-center gap-3 mb-6">
            <AlertCircle className="text-sos flex-shrink-0" size={24} />
            <p className="text-text font-bold text-lg">{mutation.error instanceof Error ? mutation.error.message : 'Error al guardar'}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xl font-extrabold text-text">Motivo de la cita</label>
            <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} disabled={isPending}
              className="min-h-touch px-4 rounded-2xl border-2 border-slate-300 text-xl focus:outline-none focus:ring-4 focus:ring-teal-600/20 bg-white" placeholder="Ej. Consulta Cardiológica" required />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xl font-extrabold text-text">Fecha</label>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} disabled={isPending}
              className="min-h-touch px-4 rounded-2xl border-2 border-slate-300 text-xl focus:outline-none focus:ring-4 focus:ring-teal-600/20 bg-white" required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xl font-extrabold text-text">Hora</label>
            <input type="time" value={hora} onChange={e => setHora(e.target.value)} disabled={isPending}
              className="min-h-touch px-4 rounded-2xl border-2 border-slate-300 text-xl focus:outline-none focus:ring-4 focus:ring-teal-600/20 bg-white" required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xl font-extrabold text-text">Ubicación (Opcional)</label>
            <input type="text" value={ubicacion} onChange={e => setUbicacion(e.target.value)} disabled={isPending}
              className="min-h-touch px-4 rounded-2xl border-2 border-slate-300 text-xl focus:outline-none focus:ring-4 focus:ring-teal-600/20 bg-white" placeholder="Ej. Consultorio 5" />
          </div>

          <div className="flex gap-4 mt-6">
            <button type="button" onClick={onClose} disabled={isPending}
              className="flex-1 min-h-touch bg-secondary text-secondary-content font-bold text-xl rounded-2xl hover:bg-secondary-hover transition-colors focus:outline-none">
              Cancelar
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 min-h-touch bg-teal-600 text-white font-bold text-xl rounded-2xl flex items-center justify-center gap-2 shadow-md hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-600/30">
              {isPending ? <Loader2 className="animate-spin" size={24} /> : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};