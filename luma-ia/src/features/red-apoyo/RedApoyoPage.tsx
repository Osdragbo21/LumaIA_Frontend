// Ruta: src/features/red-apoyo/RedApoyoPage.tsx

import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Users, Plus, AlertCircle, Loader2, CheckCircle, PhoneCall } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { obtenerPerfil } from './services/red-apoyo.service';
import { FormularioContacto } from './components/FormularioContacto';

export const RedApoyoPage = () => {
  const { usuarioId } = useAuthStore();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [toastMensaje, setToastMensaje] = useState<string | null>(null);

  const { data: perfil, isLoading, isError, error } = useQuery({
    queryKey: ['perfil', usuarioId],
    queryFn: () => obtenerPerfil(usuarioId!),
    enabled: !!usuarioId,
  });

  const contactos = perfil?.contactos_emergencia || [];

  const manejarExitoGuardado = () => {
    setMostrarModal(false);
    setToastMensaje('¡Contacto guardado exitosamente!');
    setTimeout(() => setToastMensaje(null), 3000);
  };

  return (
    <div className="flex flex-col min-h-full p-5 sm:p-6 pb-32 bg-slate-50 relative w-full">
      
      {toastMensaje && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-green-100 border-2 border-green-500 text-green-900 px-4 py-3 rounded-[20px] shadow-lg z-50 flex items-center gap-3 font-bold text-lg animate-in slide-in-from-top-10 fade-in duration-300">
          <CheckCircle size={28} className="text-green-600 flex-shrink-0" />
          {toastMensaje}
        </div>
      )}

      <header className="mb-6 w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
          Red de Apoyo
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 font-medium mt-2">
          Llama rápidamente a tus familiares o cuidadores.
        </p>
      </header>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500 w-full">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
          <p className="text-xl font-bold">Cargando contactos...</p>
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-2xl flex items-start gap-3 mb-6 w-full shadow-sm">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={28} />
          <p className="text-red-800 font-bold text-lg">{error instanceof Error ? error.message : 'Error al obtener perfil'}</p>
        </div>
      )}

      {/* Lista de Contactos (Nuevo Diseño Visual) */}
      {!isLoading && !isError && contactos.length > 0 && (
        <div className="flex flex-col gap-4 w-full">
          {contactos.map((contacto, idx) => (
            <div key={idx} className="bg-white rounded-[24px] p-4 sm:p-5 flex flex-col gap-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 w-full">
              <div className="flex items-center gap-4">
                <div className="mt-1 bg-red-50 p-3 rounded-2xl text-red-500 flex-shrink-0">
                  <Users size={32} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 truncate whitespace-normal leading-tight">
                    {contacto.nombre_contacto}
                  </h3>
                  <p className="text-lg text-slate-500 font-medium mt-1">{contacto.parentesco}</p>
                </div>
              </div>
              
              <div className="flex justify-end mt-2">
                <a 
                  href={`tel:${contacto.telefono}`}
                  className="min-h-[48px] px-6 py-2 bg-blue-700 hover:bg-blue-800 active:scale-95 transition-transform rounded-2xl text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-md focus:outline-none focus:ring-4 focus:ring-blue-700/30"
                >
                  <PhoneCall size={22} strokeWidth={2.5} />
                  Llamar
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && contactos.length === 0 && (
        <div className="flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 rounded-[24px] p-8 text-center mt-4 w-full shadow-sm">
          <div className="bg-red-50 text-red-500 p-4 rounded-full mb-4">
            <Users size={48} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Sin red de apoyo</h2>
          <p className="text-lg text-slate-500 font-medium">Agrega a tus familiares de confianza.</p>
        </div>
      )}

      {/* Botón Flotante para agregar (Integrado al flujo) */}
      <div className="mt-8 w-full">
        <button onClick={() => setMostrarModal(true)}
          className="w-full min-h-[56px] py-4 bg-white border-2 border-blue-700 text-blue-700 active:bg-blue-50 transition-colors font-extrabold text-xl rounded-2xl shadow-sm flex items-center justify-center gap-3 focus:outline-none focus:ring-4 focus:ring-blue-700/20"
        >
          <Plus size={28} strokeWidth={3} /> Agregar Contacto
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