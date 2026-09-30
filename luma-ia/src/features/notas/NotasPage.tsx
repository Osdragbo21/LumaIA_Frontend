// Ruta: src/features/notas/NotasPage.tsx

import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { StickyNote, Plus, AlertCircle, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { obtenerNotas } from './services/notas.service';
import { FormularioNota } from './components/FormularioNota';

export const NotasPage = () => {
  const { rol, usuarioId } = useAuthStore();
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [toastMensaje, setToastMensaje] = useState<string | null>(null);

  const { data: notas = [], isLoading, isError, error } = useQuery({
    queryKey: ['notas', usuarioId],
    queryFn: () => obtenerNotas(usuarioId!),
    enabled: !!usuarioId,
  });

  const irAInicio = () => navigate(rol === 'Adulto Mayor' ? '/paciente/inicio' : '/cuidador/inicio');

  const manejarExitoGuardado = () => {
    setMostrarModal(false);
    setToastMensaje('¡Nota guardada correctamente!');
    setTimeout(() => setToastMensaje(null), 3000);
  };

  return (
    <div className="flex flex-col min-h-full bg-background p-6 relative">
      
      {toastMensaje && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-green-100 border-2 border-green-500 text-green-900 px-4 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-3 font-bold text-lg animate-in slide-in-from-top-10 fade-in duration-300">
          <CheckCircle size={28} className="text-green-600 flex-shrink-0" />
          {toastMensaje}
        </div>
      )}

      <header className="flex items-center gap-4 mb-8">
        <button onClick={irAInicio} className="min-w-touch min-h-touch flex items-center justify-center bg-white border border-slate-200 rounded-xl text-text shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-yellow-500/20">
          <ArrowLeft size={28} strokeWidth={2.5} />
        </button>
        <h1 className="text-3xl font-extrabold text-text tracking-tight">Mis Notas</h1>
      </header>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-yellow-600">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="text-xl font-bold">Cargando notas...</p>
        </div>
      )}

      {isError && (
        <div className="bg-sos/10 border-l-4 border-sos p-4 rounded-2xl flex items-start gap-3 mb-6">
          <AlertCircle className="text-sos flex-shrink-0 mt-1" size={28} />
          <p className="text-text font-bold text-lg">{error instanceof Error ? error.message : 'Error de conexión'}</p>
        </div>
      )}

      {/* Lista de Notas */}
      {!isLoading && !isError && notas.length > 0 && (
        <div className="flex flex-col gap-4 pb-24">
          {notas.map((nota) => (
            <div key={nota._id} className="bg-yellow-50 border border-yellow-200 p-5 rounded-3xl flex items-start gap-4 shadow-sm">
              <div className="text-yellow-600 bg-white p-3 rounded-2xl shadow-sm mt-1">
                <StickyNote size={32} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col flex-1 gap-1">
                <p className="text-xl font-bold text-text whitespace-pre-wrap">{nota.contenido}</p>
                <span className="text-sm text-slate-500 font-medium mt-2">
                  {new Date(nota.fecha_creacion).toLocaleDateString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isError && notas.length === 0 && (
        <div className="flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center mt-4">
          <div className="bg-yellow-100 text-yellow-700 p-4 rounded-full mb-4">
            <StickyNote size={48} strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-extrabold text-text mb-2">Aún no hay notas</h2>
          <p className="text-lg text-text/80 font-medium">Guarda tu primer apunte o recordatorio libre.</p>
        </div>
      )}

      <div className="mt-auto pt-8">
        <button onClick={() => setMostrarModal(true)}
          className="w-full min-h-touch py-4 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-extrabold text-2xl rounded-2xl shadow-md flex items-center justify-center gap-3 transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-yellow-500/30"
        >
          <Plus size={32} strokeWidth={3} /> Agregar Nota
        </button>
      </div>

      {mostrarModal && (
        <FormularioNota 
          usuarioId={usuarioId!} 
          onClose={() => setMostrarModal(false)} 
          onSuccess={manejarExitoGuardado} 
        />
      )}
    </div>
  );
};