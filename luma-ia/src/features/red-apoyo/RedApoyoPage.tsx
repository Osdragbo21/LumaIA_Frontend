// Ruta: src/features/red-apoyo/RedApoyoPage.tsx

import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Users, Plus, AlertCircle, ArrowLeft, Loader2, CheckCircle, PhoneCall } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { obtenerPerfil } from './services/red-apoyo.service';
import { FormularioContacto } from './components/FormularioContacto';

export const RedApoyoPage = () => {
  const { rol, usuarioId } = useAuthStore();
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [toastMensaje, setToastMensaje] = useState<string | null>(null);

  const { data: perfil, isLoading, isError, error } = useQuery({
    queryKey: ['perfil', usuarioId],
    queryFn: () => obtenerPerfil(usuarioId!),
    enabled: !!usuarioId,
  });

  const contactos = perfil?.contactos_emergencia || [];

  const irAInicio = () => navigate(rol === 'Adulto Mayor' ? '/paciente/inicio' : '/cuidador/inicio');

  const manejarExitoGuardado = () => {
    setMostrarModal(false);
    setToastMensaje('¡Contacto guardado exitosamente!');
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
        <button onClick={irAInicio} className="min-w-touch min-h-touch flex items-center justify-center bg-white border border-slate-200 rounded-xl text-text shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-red-600/20">
          <ArrowLeft size={28} strokeWidth={2.5} />
        </button>
        <h1 className="text-3xl font-extrabold text-text tracking-tight">Red de Apoyo</h1>
      </header>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-red-600">
          <Loader2 className="animate-spin mb-4" size={48} />
          <p className="text-xl font-bold">Cargando perfil y contactos...</p>
        </div>
      )}

      {isError && (
        <div className="bg-sos/10 border-l-4 border-sos p-4 rounded-2xl flex items-start gap-3 mb-6">
          <AlertCircle className="text-sos flex-shrink-0 mt-1" size={28} />
          <p className="text-text font-bold text-lg">{error instanceof Error ? error.message : 'Error al obtener perfil'}</p>
        </div>
      )}

      {!isLoading && !isError && contactos.length > 0 && (
        <div className="flex flex-col gap-4 pb-24">
          {contactos.map((contacto, idx) => (
            <a 
              key={idx} 
              href={`tel:${contacto.telefono}`}
              className="bg-red-50/50 border border-red-200 p-5 rounded-3xl flex items-center gap-4 shadow-sm focus:outline-none focus:ring-4 focus:ring-red-600/30 hover:bg-red-50 transition-colors"
            >
              <div className="text-red-600 bg-white p-3 rounded-2xl shadow-sm">
                <Users size={32} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col flex-1 gap-1">
                <h3 className="text-2xl font-extrabold text-text">{contacto.nombre_contacto}</h3>
                <p className="text-lg text-slate-600 font-medium">{contacto.parentesco}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full text-red-600 flex items-center justify-center h-14 w-14 shadow-sm">
                <PhoneCall size={28} strokeWidth={2.5} />
              </div>
            </a>
          ))}
        </div>
      )}

      {!isLoading && !isError && contactos.length === 0 && (
        <div className="flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center mt-4">
          <div className="bg-red-100 text-red-600 p-4 rounded-full mb-4">
            <Users size={48} strokeWidth={2} />
          </div>
          <h2 className="text-2xl font-extrabold text-text mb-2">Sin red de apoyo</h2>
          <p className="text-lg text-text/80 font-medium">Agrega a tus familiares o médicos de confianza.</p>
        </div>
      )}

      <div className="mt-auto pt-8">
        <button onClick={() => setMostrarModal(true)}
          className="w-full min-h-touch py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-2xl rounded-2xl shadow-md flex items-center justify-center gap-3 transition-transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-600/30"
        >
          <Plus size={32} strokeWidth={3} /> Agregar Contacto
        </button>
      </div>

      {mostrarModal && (
        <FormularioContacto 
          usuarioId={usuarioId!} 
          onClose={() => setMostrarModal(false)} 
          onSuccess={manejarExitoGuardado} 
        />
      )}
    </div>
  );
};