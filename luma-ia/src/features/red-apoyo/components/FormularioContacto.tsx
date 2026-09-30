// Ruta: src/features/red-apoyo/components/FormularioContacto.tsx

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { agregarContacto } from '../services/red-apoyo.service';
import { Loader2, AlertCircle } from 'lucide-react';

interface Props {
  usuarioId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const FormularioContacto = ({ usuarioId, onClose, onSuccess }: Props) => {
  const queryClient = useQueryClient();
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [parentesco, setParentesco] = useState('');

  const mutation = useMutation({
    mutationFn: () => agregarContacto({
      usuario_id: usuarioId,
      nombre_contacto: nombre.trim(),
      telefono: telefono.trim(),
      parentesco: parentesco.trim(),
    }),
    onSuccess: async () => {
      // Invalidamos la query del perfil para refrescar la lista
      await queryClient.invalidateQueries({ queryKey: ['perfil', usuarioId] });
      onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !telefono || !parentesco) return;
    mutation.mutate();
  };

  const isPending = mutation.isPending;

  return (
    <div className="fixed inset-0 bg-text/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10">
        <h2 className="text-3xl font-extrabold text-text mb-6 text-center">Nuevo Contacto</h2>
        
        {mutation.isError && (
          <div className="bg-sos/10 border-l-4 border-sos p-4 rounded-xl flex items-center gap-3 mb-6">
            <AlertCircle className="text-sos flex-shrink-0" size={24} />
            <p className="text-text font-bold text-lg">{mutation.error instanceof Error ? mutation.error.message : 'Error al guardar'}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xl font-extrabold text-text">Nombre completo</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} disabled={isPending}
              className="min-h-touch px-4 rounded-2xl border-2 border-slate-300 text-xl focus:outline-none focus:ring-4 focus:ring-red-600/20 bg-white" placeholder="Ej. María Sánchez" required />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xl font-extrabold text-text">Teléfono</label>
            <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} disabled={isPending}
              className="min-h-touch px-4 rounded-2xl border-2 border-slate-300 text-xl focus:outline-none focus:ring-4 focus:ring-red-600/20 bg-white" placeholder="Ej. 55 1234 5678" required />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xl font-extrabold text-text">Parentesco / Relación</label>
            <input type="text" value={parentesco} onChange={e => setParentesco(e.target.value)} disabled={isPending}
              className="min-h-touch px-4 rounded-2xl border-2 border-slate-300 text-xl focus:outline-none focus:ring-4 focus:ring-red-600/20 bg-white" placeholder="Ej. Hija, Médico" required />
          </div>

          <div className="flex gap-4 mt-6">
            <button type="button" onClick={onClose} disabled={isPending}
              className="flex-1 min-h-touch bg-secondary text-secondary-content font-bold text-xl rounded-2xl hover:bg-secondary-hover transition-colors focus:outline-none">
              Cancelar
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 min-h-touch bg-red-600 text-white font-bold text-xl rounded-2xl flex items-center justify-center gap-2 shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-600/30">
              {isPending ? <Loader2 className="animate-spin" size={24} /> : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};