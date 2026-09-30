// Ruta: src/features/medicamentos/components/FormularioMedicamento.tsx

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { crearMedicamento } from '../services/medicamentos.service';
import { Loader2, AlertCircle } from 'lucide-react';

interface Props {
  usuarioId: string;
  onClose: () => void;
}

export const FormularioMedicamento = ({ usuarioId, onClose }: Props) => {
  const queryClient = useQueryClient();
  const [nombre, setNombre] = useState('');
  const [dosis, setDosis] = useState('');
  const [hora, setHora] = useState('');

  const mutation = useMutation({
    mutationFn: () => crearMedicamento({
      usuario_id: usuarioId,
      nombre_farmaco: nombre,
      dosis: dosis,
      frecuencia_horas: 24, // Frecuencia por defecto en esta fase
      horarios_especificos: [hora]
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicamentos', usuarioId] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !dosis || !hora) return;
    mutation.mutate();
  };

  const isPending = mutation.isPending;

  return (
    <div className="fixed inset-0 bg-text/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10">
        <h2 className="text-3xl font-extrabold text-text mb-6 text-center">Nuevo Medicamento</h2>
        
        {mutation.isError && (
          <div className="bg-sos/10 border-l-4 border-sos p-4 rounded-xl flex items-center gap-3 mb-6">
            <AlertCircle className="text-sos flex-shrink-0" size={24} />
            <p className="text-text font-bold text-lg">{mutation.error instanceof Error ? mutation.error.message : 'Error al guardar'}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xl font-extrabold text-text">Nombre del fármaco</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} disabled={isPending}
              className="min-h-touch px-4 rounded-2xl border-2 border-slate-300 text-xl focus:outline-none focus:ring-4 focus:ring-primary/20 bg-white" placeholder="Ej. Losartán" required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xl font-extrabold text-text">Dosis indicada</label>
            <input type="text" value={dosis} onChange={e => setDosis(e.target.value)} disabled={isPending}
              className="min-h-touch px-4 rounded-2xl border-2 border-slate-300 text-xl focus:outline-none focus:ring-4 focus:ring-primary/20 bg-white" placeholder="Ej. 1 pastilla" required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xl font-extrabold text-text">Hora de la toma</label>
            <input type="time" value={hora} onChange={e => setHora(e.target.value)} disabled={isPending}
              className="min-h-touch px-4 rounded-2xl border-2 border-slate-300 text-xl focus:outline-none focus:ring-4 focus:ring-primary/20 bg-white" required />
          </div>

          <div className="flex gap-4 mt-6">
            <button type="button" onClick={onClose} disabled={isPending}
              className="flex-1 min-h-touch bg-secondary text-secondary-content font-bold text-xl rounded-2xl hover:bg-secondary-hover transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isPending}
              className="flex-1 min-h-touch bg-primary text-primary-content font-bold text-xl rounded-2xl flex items-center justify-center gap-2 shadow-md hover:bg-primary-hover">
              {isPending ? <Loader2 className="animate-spin" size={24} /> : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};