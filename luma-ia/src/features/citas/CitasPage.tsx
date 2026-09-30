// Ruta: src/features/citas/CitasPage.tsx

import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Calendar, Plus, AlertCircle, ArrowLeft, Loader2, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { obtenerCitas } from './services/citas.service';
import { FormularioCita } from './components/FormularioCita';

export const CitasPage = () => {
  const { rol, usuarioId } = useAuthStore();
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [toastMensaje, setToastMensaje] = useState<string | null>(null);

  const { data: citas = [], isLoading, isError, error } = useQuery({
    queryKey: ['citas', usuarioId],
    queryFn: () => obtenerCitas(usuarioId!),
    enabled: !!usuarioId,
  });

  const irAInicio = () => navigate(rol === 'Adulto Mayor' ? '/paciente/inicio' : '/cuidador/inicio');

  const manejarExitoGuardado = () => {
    setMostrarModal(false);
    setToastMensaje('¡Cita agendada correctamente!');
    setTimeout(() => setToastMensaje(null), 3000);
  };

  return (
    <div className="flex flex-col min-h-full bg-background p-6 relative">
      
      {/* Toast de Notificación Visual */}
      {toastMensaje && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-green-100 border-2 border-green-500 text-green-900 px-4 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-3 font-bold text-lg animate-in slide-in-from-top-10 fade-in duration-300">
          <CheckCircle size={28} className="text-green-600 flex-shrink-0" />
          {toastMensaje}
        </div>
      )}

      <header className="flex items-center gap-4 mb-8">
        <button onClick={irAInicio} className="min-w-touch min-h-touch flex items-center justify-center bg-white border border-slate-200 rounded-xl text-text shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-teal-600/20">
          <ArrowLeft size={28} strokeWidth={2.5} />
        </button>
        <h1 className="text-3xl font-extrabold text-text tracking-tight">Mis Citas</h1>
      </header>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-teal-600">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="text-xl font-bold">Cargando agenda...</p>
        </div>
      )}

      {isError && (
        <div className="bg-sos/10 border-l-4 border-sos p-4 rounded-2xl flex items-start gap-3 mb-6">
          <AlertCircle className="text-sos flex-shrink-0 mt-1" size={28} />
          <p className="text-text font-bold text-lg">{error instanceof Error ? error.message : 'Error de conexión'}</p>
        </div>
      )}

      {/* Lista de Citas Renderizada */}
      {!isLoading && !isError && citas.length > 0 && (
        <div className="flex flex-col gap-4 pb-24">
          {citas.map((cita) => (
            <div key={cita._id} className="bg-teal-50/50 border border-teal-200 p-5 rounded-3xl flex items-start gap-4">
              <div className="text-teal-600 bg-white p-3 rounded-2xl shadow-sm mt-1">
                <Calendar size={32} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col flex-1 gap-1">
                <h3 className="text-2xl font-extrabold text-text leading-tight">{cita.titulo_evento}</h3>
                <div className="flex items-center gap-2 text-lg text-text/80 font-medium mt-1">
                  <Clock size={20} className="text-teal-600" />
                  <span>
                    {new Date(cita.fecha_hora).toLocaleString('es-MX', { 
                      weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' 
                    })}
                  </span>
                </div>
                {cita.ubicacion && (
                  <div className="flex items-center gap-2 text-lg text-text/80 font-medium mt-1">
                    <MapPin size={20} className="text-teal-600" />
                    <span>{cita.ubicacion}</span>
                  </div>
                )}
                {/* Etiqueta de Estado */}
                <div className="mt-2">
                  <span className="inline-block bg-white border border-teal-200 text-teal-700 font-bold px-3 py-1 rounded-lg text-sm">
                    {cita.estado || 'Programada'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isError && citas.length === 0 && (
        <div className="flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center mt-4">
          <div className="bg-teal-100 text-teal-600 p-4 rounded-full mb-4">
            <Calendar size={48} strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-extrabold text-text mb-2">Aún no hay citas</h2>
          <p className="text-lg text-text/80 font-medium">Programa tu primer compromiso médico.</p>
        </div>
      )}

      <div className="mt-auto pt-8">
        <button onClick={() => setMostrarModal(true)}
          className="w-full min-h-touch py-4 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-2xl rounded-2xl shadow-md flex items-center justify-center gap-3 transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-teal-600/30"
        >
          <Plus size={32} strokeWidth={3} /> Agregar Cita
        </button>
      </div>

      {mostrarModal && (
        <FormularioCita 
          usuarioId={usuarioId!} 
          onClose={() => setMostrarModal(false)} 
          onSuccess={manejarExitoGuardado} 
        />
      )}
    </div>
  );
};