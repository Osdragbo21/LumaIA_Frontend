// Ruta: src/features/tareas/TareasPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Pill, StickyNote, Calendar, ArrowRight } from 'lucide-react';

export const TareasPage = () => {
  const { rol } = useAuthStore();
  const navigate = useNavigate();
  
  // Resolvemos la ruta base dependiendo del rol del usuario
  const basePath = rol === 'Adulto Mayor' ? '/paciente' : '/cuidador';

  return (
    <div className="flex flex-col min-h-full p-5 sm:p-6 pb-32 w-full">
      <header className="mb-8 w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
          Mis Tareas
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 font-medium mt-2">
          Selecciona un módulo para gestionar tu información.
        </p>
      </header>

      <div className="flex flex-col gap-5 w-full">
        
        {/* Tarjeta: Medicamentos (RF-04) */}
        <div className="bg-white rounded-[24px] p-4 sm:p-5 flex flex-col gap-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 w-full">
          <div className="flex gap-4 items-start">
            <div className="mt-1 bg-red-50 p-3 rounded-2xl text-red-500 flex-shrink-0">
              <Pill size={36} strokeWidth={2.5} fill="#fca5a5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-tight">
                Medicamentos
              </h3>
              <p className="text-slate-500 font-medium text-sm sm:text-base mt-1">
                Añade o modifica tus tratamientos, dosis y alarmas.
              </p>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button 
              onClick={() => navigate(`${basePath}/medicamentos`)}
              className="min-h-[48px] px-6 py-2 bg-blue-700 hover:bg-blue-800 active:scale-95 transition-transform rounded-2xl text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-md focus:outline-none focus:ring-4 focus:ring-blue-700/30"
              aria-label="Ir a medicamentos"
            >
              Abrir <ArrowRight strokeWidth={3} size={20} />
            </button>
          </div>
        </div>

        {/* Tarjeta: Notas Personales (RF-06) */}
        <div className="bg-white rounded-[24px] p-4 sm:p-5 flex flex-col gap-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 w-full">
          <div className="flex gap-4 items-start">
            <div className="mt-1 bg-yellow-50 p-3 rounded-2xl text-yellow-600 flex-shrink-0">
              <StickyNote size={36} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-tight">
                Notas Personales
              </h3>
              <p className="text-slate-500 font-medium text-sm sm:text-base mt-1">
                Escribe apuntes rápidos y recordatorios libres.
              </p>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button 
              onClick={() => navigate(`${basePath}/notas`)}
              className="min-h-[48px] px-6 py-2 bg-blue-700 hover:bg-blue-800 active:scale-95 transition-transform rounded-2xl text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-md focus:outline-none focus:ring-4 focus:ring-blue-700/30"
              aria-label="Ir a notas personales"
            >
              Abrir <ArrowRight strokeWidth={3} size={20} />
            </button>
          </div>
        </div>

        {/* Tarjeta: Citas Médicas (RF-05) */}
        <div className="bg-white rounded-[24px] p-4 sm:p-5 flex flex-col gap-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 w-full">
          <div className="flex gap-4 items-start">
            <div className="mt-1 bg-teal-50 p-3 rounded-2xl text-teal-600 flex-shrink-0">
              <Calendar size={36} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-tight">
                Citas Médicas
              </h3>
              <p className="text-slate-500 font-medium text-sm sm:text-base mt-1">
                Visualiza y programa tus próximas consultas.
              </p>
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button 
              onClick={() => navigate(`${basePath}/citas`)}
              className="min-h-[48px] px-6 py-2 bg-blue-700 hover:bg-blue-800 active:scale-95 transition-transform rounded-2xl text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-md focus:outline-none focus:ring-4 focus:ring-blue-700/30"
              aria-label="Ir a citas médicas"
            >
              Abrir <ArrowRight strokeWidth={3} size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};