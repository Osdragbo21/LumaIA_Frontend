// Ruta: src/features/dashboard/MisTareasPage.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Calendar, StickyNote, ArrowLeft } from 'lucide-react';

export const MisTareasPage = () => {
  const { rol } = useAuthStore();
  const navigate = useNavigate();
  const basePath = rol === 'Adulto Mayor' ? '/paciente' : '/cuidador';

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc] p-6">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(`${basePath}/inicio`)} className="min-w-[48px] min-h-[48px] flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-800 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-700/20">
          <ArrowLeft size={28} strokeWidth={2.5} />
        </button>
        <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight">Mis Tareas</h1>
      </header>

      <p className="text-lg text-slate-600 font-medium mb-8">
        Organiza tus compromisos médicos y apuntes personales.
      </p>

      <div className="flex flex-col gap-4">
        {/* Botón Citas */}
        <button 
          onClick={() => navigate(`${basePath}/citas`)}
          className="bg-white rounded-3xl p-5 flex items-center gap-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 min-h-[80px] focus:outline-none focus:ring-4 focus:ring-blue-700/20 transition-transform active:scale-95"
        >
          <div className="bg-teal-50 p-3 rounded-2xl text-teal-600">
            <Calendar size={36} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-extrabold text-2xl text-[#1e293b]">Citas Médicas</span>
            <span className="text-slate-500 font-medium">Gestiona tu agenda completa</span>
          </div>
        </button>

        {/* Botón Notas */}
        <button 
          onClick={() => navigate(`${basePath}/notas`)}
          className="bg-white rounded-3xl p-5 flex items-center gap-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 min-h-[80px] focus:outline-none focus:ring-4 focus:ring-blue-700/20 transition-transform active:scale-95"
        >
          <div className="bg-yellow-50 p-3 rounded-2xl text-yellow-600">
            <StickyNote size={36} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-extrabold text-2xl text-[#1e293b]">Notas Personales</span>
            <span className="text-slate-500 font-medium">Tus apuntes y recordatorios</span>
          </div>
        </button>
      </div>
    </div>
  );
};