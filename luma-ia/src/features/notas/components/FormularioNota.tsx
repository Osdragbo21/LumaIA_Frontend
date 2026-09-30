// Ruta: src/features/notas/components/FormularioNota.tsx

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { crearNota } from '../services/notas.service';
import { Loader2, AlertCircle } from 'lucide-react';

interface Props {
  usuarioId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const FormularioNota = ({ usuarioId, onClose, onSuccess }: Props) => {
  const queryClient = useQueryClient();
  const [contenido, setContenido] = useState('');

  const mutation = useMutation({
    mutationFn: () => crearNota({
      usuario_id: usuarioId,
      contenido: contenido.trim(),
      fecha_creacion: new Date().toISOString(), // Autogenerado en formato ISO-8601
    }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notas', usuarioId] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contenido.trim()) return;
    mutation.mutate();
  };

  const isPending = mutation.isPending;

  return (
    <div className="fixed inset-0 bg-text/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10">
        <h2 className="text-3xl font-extrabold text-text mb-6 text-center">Nueva Nota</h2>
        
        {mutation.isError && (
          <div className="bg-sos/10 border-l-4 border-sos p-4 rounded-xl flex items-center gap-3 mb-6">
            <AlertCircle className="text-sos flex-shrink-0" size={24} />
            <p className="text-text font-bold text-lg">{mutation.error instanceof Error ? mutation.error.message : 'Error al guardar'}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xl font-extrabold text-text">Escribe tu nota o recordatorio</label>
            <textarea 
              rows={5}
              value={contenido} 
              onChange={e => setContenido(e.target.value)} 
              disabled={isPending}
              className="p-4 rounded-2xl border-2 border-slate-300 text-xl focus:outline-none focus:ring-4 focus:ring-yellow-500/20 bg-white resize-none" 
              placeholder="Ej. Preguntar al doctor sobre la nueva dieta sin sal..." 
              required 
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button type="button" onClick={onClose} disabled={isPending}
              className="flex-1 min-h-touch bg-secondary text-secondary-content font-bold text-xl rounded-2xl hover:bg-secondary-hover transition-colors focus:outline-none">
              Cancelar
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 min-h-touch bg-yellow-500 text-slate-900 font-bold text-xl rounded-2xl flex items-center justify-center gap-2 shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-500/30">
              {isPending ? <Loader2 className="animate-spin" size={24} /> : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};