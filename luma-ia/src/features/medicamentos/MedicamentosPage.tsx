// Ruta: src/features/medicamentos/MedicamentosPage.tsx

import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Pill, Plus, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { obtenerMedicamentos } from './services/medicamentos.service';
import { FormularioMedicamento } from './components/FormularioMedicamento';

export const MedicamentosPage = () => {
  const { rol, usuarioId } = useAuthStore();
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);

  const { data: medicamentos = [], isLoading, isError, error } = useQuery({
    queryKey: ['medicamentos', usuarioId],
    queryFn: () => obtenerMedicamentos(usuarioId!),
    enabled: !!usuarioId,
  });

  const irAInicio = () => navigate(rol === 'Adulto Mayor' ? '/paciente/inicio' : '/cuidador/inicio');

  return (
    <div className="flex flex-col min-h-full bg-background p-6">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={irAInicio} className="min-w-touch min-h-touch flex items-center justify-center bg-white border border-slate-200 rounded-xl text-text shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-primary/20">
          <ArrowLeft size={28} strokeWidth={2.5} />
        </button>
        <h1 className="text-3xl font-extrabold text-text tracking-tight">Mis Medicamentos</h1>
      </header>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-primary">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="text-xl font-bold">Cargando tratamientos...</p>
        </div>
      )}

      {isError && (
        <div className="bg-sos/10 border-l-4 border-sos p-4 rounded-2xl flex items-start gap-3 mb-6">
          <AlertCircle className="text-sos flex-shrink-0 mt-1" size={28} />
          <p className="text-text font-bold text-lg">{error instanceof Error ? error.message : 'Error al conectar'}</p>
        </div>
      )}

      {!isLoading && !isError && medicamentos.length > 0 && (
        <div className="flex flex-col gap-4 pb-24">
          {medicamentos.map((med) => (
            <div key={med._id} className="bg-orange-100/50 border border-orange-200 p-5 rounded-3xl flex items-center gap-4">
              <div className="text-orange-600 bg-white p-3 rounded-2xl shadow-sm">
                <Pill size={32} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col flex-1">
                <h3 className="text-2xl font-extrabold text-text">{med.nombre_farmaco}</h3>
                <p className="text-lg text-text/80 font-medium">
                  {med.horarios_especificos?.join(', ')} • {med.dosis}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isError && medicamentos.length === 0 && (
        <div className="flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center mt-4">
          <div className="bg-orange-100 text-orange-600 p-4 rounded-full mb-4">
            <Pill size={48} strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-extrabold text-text mb-2">Aún no hay medicamentos</h2>
          <p className="text-lg text-text/80 font-medium">Agrega tu primer tratamiento.</p>
        </div>
      )}

      <div className="mt-auto pt-8">
        <button onClick={() => setMostrarModal(true)}
          className="w-full min-h-touch py-4 bg-primary hover:bg-primary-hover text-primary-content font-extrabold text-2xl rounded-2xl shadow-md flex items-center justify-center gap-3 transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-primary/30"
        >
          <Plus size={32} strokeWidth={3} /> Agregar Medicamento
        </button>
      </div>

      {mostrarModal && <FormularioMedicamento usuarioId={usuarioId!} onClose={() => setMostrarModal(false)} />}
    </div>
  );
};