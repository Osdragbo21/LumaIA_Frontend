// Ruta: src/features/tareas/TareasPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Pill, Calendar, StickyNote, ArrowRight } from 'lucide-react';

export const TareasPage = () => {
  const { rol } = useAuthStore();
  const navigate = useNavigate();
  
  // Resolvemos la ruta base dependiendo del rol del usuario
  const basePath = rol === 'Adulto Mayor' ? '/paciente' : '/cuidador';

  const modulos = [
    {
      id: 'medicamentos',
      titulo: 'Medicamentos',
      descripcion: 'Gestiona tus tratamientos y pastillas.',
      icon: <Pill size={36} className="text-red-500" strokeWidth={2.5} fill="#fca5a5" />,
      colorBg: 'bg-red-50',
      path: `${basePath}/medicamentos`
    },
    {
      id: 'citas',
      titulo: 'Citas Médicas',
      descripcion: 'Revisa y agenda tus próximas consultas.',
      icon: <Calendar size={36} className="text-teal-600" strokeWidth={2.5} />,
      colorBg: 'bg-teal-50',
      path: `${basePath}/citas`
    },
    {
      id: 'notas',
      titulo: 'Notas Personales',
      descripcion: 'Tus apuntes y recordatorios libres.',
      icon: <StickyNote size={36} className="text-yellow-600" strokeWidth={2.5} />,
      colorBg: 'bg-yellow-50',
      path: `${basePath}/notas`
    }
  ];

  return (
    <div className="flex flex-col min-h-full p-5 sm:p-6 pb-32 w-full">
      <header className="mb-8 mt-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
          Mis Tareas
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 font-medium mt-2">
          Selecciona una categoría para organizar tu día.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {modulos.map((mod) => (
          <button
            key={mod.id}
            onClick={() => navigate(mod.path)}
            className="flex items-center gap-4 bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-700/20 active:scale-95 text-left w-full min-h-touch"
            aria-label={`Ir a ${mod.titulo}`}
          >
            <div className={`p-4 rounded-2xl ${mod.colorBg} flex-shrink-0`}>
              {mod.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800">{mod.titulo}</h3>
              <p className="text-slate-500 font-medium text-sm sm:text-base mt-1 truncate">{mod.descripcion}</p>
            </div>
            <div className="text-slate-300 flex-shrink-0">
              <ArrowRight size={28} strokeWidth={3} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};